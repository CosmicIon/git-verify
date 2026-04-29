const { AppError } = require("../utils/appError");

function clamp01(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

function parseWeight(name, fallback) {
  const parsed = Number(process.env[name] || fallback);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new AppError({
      code: "CONFIG_ERROR",
      message: `${name} must be a number between 0 and 1`,
      status: 500,
      details: { field: name },
    });
  }

  return parsed;
}

function getGithubWeights() {
  const weights = {
    activity: parseWeight("GITHUB_ACTIVITY_WEIGHT", 0.2),
    language: parseWeight("GITHUB_LANGUAGE_WEIGHT", 0.2),
    quality: parseWeight("GITHUB_QUALITY_WEIGHT", 0.2),
    consistency: parseWeight("GITHUB_CONSISTENCY_WEIGHT", 0.2),
    verification: parseWeight("GITHUB_VERIFICATION_WEIGHT", 0.2),
  };

  const sum =
    weights.activity +
    weights.language +
    weights.quality +
    weights.consistency +
    weights.verification;

  if (Math.abs(sum - 1) > 0.0001) {
    throw new AppError({
      code: "CONFIG_ERROR",
      message: "GitHub weights must sum to 1",
      status: 500,
      details: weights,
    });
  }

  return weights;
}

function computeActivityScore(metrics) {
  const commits = metrics.activity.estimatedCommits90d + metrics.activity.estimatedCommits30d;
  return Number(clamp01(commits / 250).toFixed(6));
}

function computeLanguageRelevanceScore(metrics) {
  const requiredCount = metrics.skills.required.length || 1;
  const matchCount = metrics.skills.matchingLanguages.length;
  return Number(clamp01(matchCount / requiredCount).toFixed(6));
}

function computeRepositoryQualityScore(metrics) {
  const starsNorm = clamp01(metrics.repositories.stars / 300);
  const forksNorm = clamp01(metrics.repositories.forks / 150);
  const reposNorm = clamp01(metrics.repositories.total / 50);

  const score = 0.5 * starsNorm + 0.2 * forksNorm + 0.3 * reposNorm;
  return Number(clamp01(score).toFixed(6));
}

function computeConsistencyScore(metrics) {
  const ratio = metrics.activity.totalDays90d
    ? metrics.activity.activeDays90d / metrics.activity.totalDays90d
    : 0;

  return Number(clamp01(ratio).toFixed(6));
}

function computeVerificationScore(metrics) {
  const claimed = new Set(metrics.skills.claimed);
  if (claimed.size === 0) {
    return 0.5;
  }

  const observed = new Set(metrics.skills.observed);
  let verified = 0;
  for (const skill of claimed) {
    if (observed.has(skill)) {
      verified += 1;
    }
  }

  return Number(clamp01(verified / claimed.size).toFixed(6));
}

function scoreGithub(metrics) {
  const weights = getGithubWeights();

  const components = {
    activity: computeActivityScore(metrics),
    language: computeLanguageRelevanceScore(metrics),
    quality: computeRepositoryQualityScore(metrics),
    consistency: computeConsistencyScore(metrics),
    verification: computeVerificationScore(metrics),
  };

  const githubScore = Number(
    (
      components.activity * weights.activity +
      components.language * weights.language +
      components.quality * weights.quality +
      components.consistency * weights.consistency +
      components.verification * weights.verification
    ).toFixed(6)
  );

  const reasonCodes = [];
  if (components.activity < 0.2) {
    reasonCodes.push("LOW_ACTIVITY");
  }
  if (components.language < 0.2) {
    reasonCodes.push("LOW_LANGUAGE_MATCH");
  }
  if (components.verification < 0.4) {
    reasonCodes.push("LOW_CLAIM_VERIFICATION");
  }

  return {
    githubScore,
    components,
    weights,
    reasonCodes,
  };
}

module.exports = {
  scoreGithub,
};
