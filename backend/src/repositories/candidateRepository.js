const inMemoryCandidates = [];

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
  const sorted = [...inMemoryCandidates].sort((a, b) => {
    const aValue = a[sortBy] ?? 0;
    const bValue = b[sortBy] ?? 0;

    if (direction === "asc") {
      return aValue > bValue ? 1 : -1;
    }

    return aValue < bValue ? 1 : -1;
  });

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    total: sorted.length,
    items: sorted.slice(start, end),
  };
}

module.exports = {
  saveCandidateDraft,
  getCandidateById,
  updateCandidateScores,
  listCandidates,
};
