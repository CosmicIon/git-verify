const { listCandidates, saveCandidateDraft } = require("../repositories/candidateRepository");

function createUploadDraft({ githubLink, jobDescription }) {
  return saveCandidateDraft({
    githubLink,
    jobDescription,
    atsScore: 0,
    githubScore: 0,
    finalScore: 0,
  });
}

function calculateScores({ githubLink }) {
  // Placeholder outputs for Phase 2 route contracts. Real logic lands in later phases.
  const githubSignal = githubLink.length % 10;
  const atsScore = 0.5;
  const githubScore = Number((0.4 + githubSignal / 100).toFixed(2));
  const finalScore = Number(((atsScore + githubScore) / 2).toFixed(2));

  return {
    atsScore,
    githubScore,
    finalScore,
  };
}

function getRankings(query) {
  return listCandidates(query);
}

module.exports = {
  createUploadDraft,
  calculateScores,
  getRankings,
};
