const { collectGithubMetrics } = require("./githubMetricsService");
const { scoreGithub } = require("./githubScoringService");
const { buildInconsistencyFlags } = require("./githubVerificationService");

async function analyzeGithubProfile({ username, jobDescription, resumes, fallbackResumeText }) {
  const metrics = await collectGithubMetrics({
    username,
    jobDescription,
    resumes,
    fallbackResumeText,
  });

  const scoring = scoreGithub(metrics);
  const flags = buildInconsistencyFlags(metrics);

  return {
    metrics,
    score: scoring,
    flags,
  };
}

module.exports = {
  analyzeGithubProfile,
};
