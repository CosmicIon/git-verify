const test = require("node:test");
const assert = require("node:assert/strict");
const { scoreGithub } = require("../../src/services/githubScoringService");

function createMetrics(overrides = {}) {
  return {
    activity: {
      estimatedCommits90d: 80,
      estimatedCommits30d: 30,
      activeDays90d: 45,
      totalDays90d: 90,
      ...(overrides.activity || {}),
    },
    repositories: {
      total: 12,
      stars: 120,
      forks: 40,
      ...(overrides.repositories || {}),
    },
    skills: {
      required: ["node", "express", "mongodb"],
      claimed: ["node", "express"],
      observed: ["node", "express", "github"],
      matchingLanguages: ["node", "express"],
      ...(overrides.skills || {}),
    },
  };
}

test("GitHub score is bounded and exposes reason codes for weak profiles", () => {
  const weakMetrics = createMetrics({
    activity: { estimatedCommits90d: 0, estimatedCommits30d: 0, activeDays90d: 1 },
    skills: { matchingLanguages: [], observed: ["github"], claimed: ["rust", "go"] },
  });

  const result = scoreGithub(weakMetrics);

  assert.ok(result.githubScore >= 0 && result.githubScore <= 1);
  assert.ok(result.reasonCodes.includes("LOW_ACTIVITY"));
  assert.ok(result.reasonCodes.includes("LOW_LANGUAGE_MATCH"));
});

test("GitHub weights config validation rejects invalid sum", () => {
  const backup = {
    activity: process.env.GITHUB_ACTIVITY_WEIGHT,
    language: process.env.GITHUB_LANGUAGE_WEIGHT,
    quality: process.env.GITHUB_QUALITY_WEIGHT,
    consistency: process.env.GITHUB_CONSISTENCY_WEIGHT,
    verification: process.env.GITHUB_VERIFICATION_WEIGHT,
  };

  process.env.GITHUB_ACTIVITY_WEIGHT = "0.5";
  process.env.GITHUB_LANGUAGE_WEIGHT = "0.2";
  process.env.GITHUB_QUALITY_WEIGHT = "0.2";
  process.env.GITHUB_CONSISTENCY_WEIGHT = "0.2";
  process.env.GITHUB_VERIFICATION_WEIGHT = "0.2";

  assert.throws(() => scoreGithub(createMetrics()), /GitHub weights must sum to 1/);

  process.env.GITHUB_ACTIVITY_WEIGHT = backup.activity;
  process.env.GITHUB_LANGUAGE_WEIGHT = backup.language;
  process.env.GITHUB_QUALITY_WEIGHT = backup.quality;
  process.env.GITHUB_CONSISTENCY_WEIGHT = backup.consistency;
  process.env.GITHUB_VERIFICATION_WEIGHT = backup.verification;
});
