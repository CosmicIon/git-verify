const { fetchEvents, fetchRepos, fetchUser } = require("./githubApiClient");
const { preprocessText } = require("./preprocessingService");

function pickRequiredSkills(jobDescription) {
  const processed = preprocessText(jobDescription || "");
  return new Set(processed.tokens);
}

function extractClaimedSkills(resumes, fallbackResumeText) {
  const sourceTexts = [];

  for (const resume of resumes || []) {
    if (resume.status === "parsed" && resume.extraction && resume.extraction.rawText) {
      sourceTexts.push(resume.extraction.rawText);
    }
  }

  if (sourceTexts.length === 0 && fallbackResumeText) {
    sourceTexts.push(fallbackResumeText);
  }

  const combined = sourceTexts.join(" ");
  const processed = preprocessText(combined);
  return new Set(processed.tokens);
}

function aggregateLanguageStats(repos) {
  const languageCounts = new Map();

  for (const repo of repos) {
    const language = String(repo.language || "").trim().toLowerCase();
    if (!language) {
      continue;
    }

    languageCounts.set(language, (languageCounts.get(language) || 0) + 1);
  }

  const sorted = [...languageCounts.entries()].sort((a, b) => b[1] - a[1]);

  return {
    counts: Object.fromEntries(sorted),
    languages: sorted.map(([lang]) => lang),
  };
}

function analyzeActivity(events) {
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

  let estimatedCommits90d = 0;
  let estimatedCommits30d = 0;
  const activeDays = new Set();

  for (const event of events || []) {
    const createdAt = new Date(event.created_at).getTime();
    if (!Number.isFinite(createdAt)) {
      continue;
    }

    const ageMs = now - createdAt;
    if (ageMs > ninetyDaysMs) {
      continue;
    }

    activeDays.add(new Date(createdAt).toISOString().slice(0, 10));

    if (event.type === "PushEvent") {
      const size = Number(event.payload && event.payload.size ? event.payload.size : 0);
      const commits = size > 0 ? size : 1;
      estimatedCommits90d += commits;
      if (ageMs <= thirtyDaysMs) {
        estimatedCommits30d += commits;
      }
    }
  }

  return {
    estimatedCommits90d,
    estimatedCommits30d,
    activeDays90d: activeDays.size,
    totalDays90d: 90,
  };
}

async function collectGithubMetrics({ username, jobDescription, resumes, fallbackResumeText }) {
  const user = await fetchUser(username);
  const [reposPage1, reposPage2, events] = await Promise.all([
    fetchRepos(username, 1, 50),
    fetchRepos(username, 2, 50),
    fetchEvents(username, 1, 100),
  ]);

  const repos = [...reposPage1, ...reposPage2];
  const languageStats = aggregateLanguageStats(repos);
  const activity = analyzeActivity(events);

  const requiredSkills = pickRequiredSkills(jobDescription);
  const claimedSkills = extractClaimedSkills(resumes, fallbackResumeText);

  const observedSkills = new Set([
    ...languageStats.languages,
    ...repos.flatMap((repo) => (repo.topics || []).map((t) => String(t || "").toLowerCase())),
    "github",
  ]);

  const matchingLanguages = languageStats.languages.filter((lang) => requiredSkills.has(lang));

  return {
    username,
    profile: {
      publicRepos: Number(user.public_repos || 0),
      followers: Number(user.followers || 0),
      accountCreatedAt: user.created_at || null,
    },
    repositories: {
      total: repos.length,
      stars: repos.reduce((sum, repo) => sum + Number(repo.stargazers_count || 0), 0),
      forks: repos.reduce((sum, repo) => sum + Number(repo.forks_count || 0), 0),
      languages: languageStats,
      updatedAtMostRecent: repos[0] ? repos[0].updated_at : null,
    },
    activity,
    skills: {
      required: [...requiredSkills],
      claimed: [...claimedSkills],
      observed: [...observedSkills],
      matchingLanguages,
    },
  };
}

module.exports = {
  collectGithubMetrics,
};
