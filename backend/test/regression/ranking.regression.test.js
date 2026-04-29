const test = require("node:test");
const assert = require("node:assert/strict");
const { rankCandidates } = require("../../src/services/rankingService");

const baselineDataset = [
  {
    id: "cand-backend-strong",
    finalScore: 0.82,
    atsScore: 0.85,
    githubScore: 0.78,
    confidenceScore: 0.92,
    createdAt: "2026-03-01T00:00:00.000Z",
    updatedAt: "2026-03-27T09:00:00.000Z",
  },
  {
    id: "cand-backend-mid",
    finalScore: 0.61,
    atsScore: 0.64,
    githubScore: 0.56,
    confidenceScore: 0.8,
    createdAt: "2026-03-02T00:00:00.000Z",
    updatedAt: "2026-03-27T08:00:00.000Z",
  },
  {
    id: "cand-nonmatch-low",
    finalScore: 0.22,
    atsScore: 0.18,
    githubScore: 0.3,
    confidenceScore: 0.73,
    createdAt: "2026-03-03T00:00:00.000Z",
    updatedAt: "2026-03-27T07:00:00.000Z",
  },
];

test("Regression ranking baseline ordering is stable", () => {
  const ranked = rankCandidates(baselineDataset, {
    page: 1,
    limit: 10,
    sortBy: "finalScore",
    direction: "desc",
  });

  const orderedIds = ranked.items.map((item) => item.id);
  assert.deepEqual(orderedIds, ["cand-backend-strong", "cand-backend-mid", "cand-nonmatch-low"]);
});

test("Regression score sanity checks remain within expected bounds", () => {
  for (const candidate of baselineDataset) {
    assert.ok(candidate.finalScore >= 0 && candidate.finalScore <= 1);
    assert.ok(candidate.atsScore >= 0 && candidate.atsScore <= 1);
    assert.ok(candidate.githubScore >= 0 && candidate.githubScore <= 1);
  }
});
