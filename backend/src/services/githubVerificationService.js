function buildInconsistencyFlags(metrics) {
  const claimed = new Set(metrics.skills.claimed);
  const observed = new Set(metrics.skills.observed);

  if (claimed.size === 0) {
    return [];
  }

  const unverified = [];
  for (const skill of claimed) {
    if (!observed.has(skill)) {
      unverified.push(skill);
    }
  }

  if (unverified.length === 0) {
    return [];
  }

  const ratio = unverified.length / claimed.size;
  const severity = ratio >= 0.6 ? "high" : ratio >= 0.3 ? "medium" : "low";

  return [
    {
      code: "SKILL_CLAIM_MISMATCH",
      severity,
      message: "Some claimed skills could not be verified from public GitHub evidence",
      details: {
        claimedCount: claimed.size,
        unverifiedCount: unverified.length,
        unverifiedSkills: unverified.slice(0, 20),
      },
    },
  ];
}

module.exports = {
  buildInconsistencyFlags,
};
