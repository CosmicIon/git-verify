const inMemoryCandidates = [];
const { rankCandidates } = require("../services/rankingService");

function saveCandidateDraft(payload) {
  const created = {
    id: String(inMemoryCandidates.length + 1),
    ...payload,
    createdAt: new Date().toISOString(),
  };

  inMemoryCandidates.push(created);
  return created;
}

function getCandidateById(id) {
  return inMemoryCandidates.find((candidate) => candidate.id === String(id)) || null;
}

function updateCandidateScores(id, payload) {
  const candidate = getCandidateById(id);
  if (!candidate) {
    return null;
  }

  Object.assign(candidate, payload, {
    updatedAt: new Date().toISOString(),
  });

  return candidate;
}

function listCandidates({ page, limit, sortBy, direction }) {
  return rankCandidates(inMemoryCandidates, {
    page,
    limit,
    sortBy,
    direction,
  });
}

module.exports = {
  saveCandidateDraft,
  getCandidateById,
  updateCandidateScores,
  listCandidates,
};
