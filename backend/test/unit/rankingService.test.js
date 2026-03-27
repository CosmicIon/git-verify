const test = require("node:test");
const assert = require("node:assert/strict");
const { rankCandidates } = require("../../src/services/rankingService");

test("Ranking is deterministic and follows tie-break order", () => {
  const candidates = [
    {
      id: "A",
      finalScore: 0.9,
      githubScore: 0.5,
      atsScore: 0.6,
      updatedAt: "2026-03-27T10:00:00.000Z",
      createdAt: "2026-03-27T09:00:00.000Z",
    },
    {
      id: "B",
      finalScore: 0.9,
      githubScore: 0.8,
      atsScore: 0.4,
      updatedAt: "2026-03-27T08:00:00.000Z",
      createdAt: "2026-03-27T07:00:00.000Z",
    },
    {
      id: "C",
      finalScore: 0.9,
      githubScore: 0.8,
      atsScore: 0.7,
      updatedAt: "2026-03-27T06:00:00.000Z",
      createdAt: "2026-03-27T05:00:00.000Z",
    },
  ];

  const ranked = rankCandidates(candidates, {
    page: 1,
    limit: 10,
    sortBy: "finalScore",
    direction: "desc",
  });

  assert.equal(ranked.items[0].id, "C");
  assert.equal(ranked.items[1].id, "B");
  assert.equal(ranked.items[2].id, "A");
  assert.deepEqual(
    ranked.items.map((candidate) => candidate.rank),
    [1, 2, 3]
  );
});
