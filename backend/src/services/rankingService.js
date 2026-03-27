function toTimestamp(value) {
  const timestamp = new Date(value || 0).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function compareWithTieBreak(a, b) {
  if ((b.finalScore || 0) !== (a.finalScore || 0)) {
    return (b.finalScore || 0) - (a.finalScore || 0);
  }

  if ((b.githubScore || 0) !== (a.githubScore || 0)) {
    return (b.githubScore || 0) - (a.githubScore || 0);
  }

  if ((b.atsScore || 0) !== (a.atsScore || 0)) {
    return (b.atsScore || 0) - (a.atsScore || 0);
  }

  return toTimestamp(b.updatedAt || b.createdAt) - toTimestamp(a.updatedAt || a.createdAt);
}

function applySort(sorted, query) {
  const sortBy = query.sortBy || "finalScore";
  const direction = query.direction === "asc" ? 1 : -1;

  if (sortBy === "finalScore") {
    return sorted;
  }

  return [...sorted].sort((a, b) => {
    const aValue = a[sortBy] ?? 0;
    const bValue = b[sortBy] ?? 0;

    if (aValue === bValue) {
      return compareWithTieBreak(a, b);
    }

    return aValue > bValue ? direction : -direction;
  });
}

function rankCandidates(candidates, query) {
  const baseSorted = [...candidates].sort(compareWithTieBreak);
  const displaySorted = applySort(baseSorted, query);

  const withRank = displaySorted.map((candidate, index) => ({
    ...candidate,
    rank: index + 1,
  }));

  const start = (query.page - 1) * query.limit;
  const end = start + query.limit;

  return {
    total: withRank.length,
    items: withRank.slice(start, end),
  };
}

module.exports = {
  rankCandidates,
};
