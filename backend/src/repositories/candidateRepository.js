const inMemoryCandidates = [];
const { isDatabaseReady } = require("../database/connection");
const { CandidateModel } = require("../models/Candidate");
const { rankCandidates } = require("../services/rankingService");

function toEntity(candidate) {
  if (!candidate) {
    return null;
  }

  return {
    id: String(candidate._id || candidate.id),
    name: candidate.name || "",
    email: candidate.email || "",
    resumeText: candidate.resumeText || "",
    githubLink: candidate.githubLink,
    githubUsername: candidate.githubUsername,
    resumes: candidate.resumes || [],
    atsScore: Number(candidate.atsScore || 0),
    githubScore: Number(candidate.githubScore || 0),
    finalScore: Number(candidate.finalScore || 0),
    confidenceScore: Number(candidate.confidenceScore || 0),
    rank: candidate.rank ?? null,
    flags: candidate.flags || [],
    atsDetails: candidate.atsDetails || null,
    githubDetails: candidate.githubDetails || null,
    scoreAudit: candidate.scoreAudit || null,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
  };
}

async function saveCandidateDraft(payload) {
  if (isDatabaseReady()) {
    const created = await CandidateModel.create(payload);
    return toEntity(created.toObject());
  }

  const created = {
    id: String(inMemoryCandidates.length + 1),
    ...payload,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  inMemoryCandidates.push(created);
  return created;
}

async function getCandidateById(id) {
  if (isDatabaseReady()) {
    const found = await CandidateModel.findById(id).lean();
    return toEntity(found);
  }

  return inMemoryCandidates.find((candidate) => candidate.id === String(id)) || null;
}

async function updateCandidateScores(id, payload) {
  if (isDatabaseReady()) {
    const updated = await CandidateModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...payload,
        },
      },
      {
        new: true,
      }
    ).lean();

    return toEntity(updated);
  }

  const candidate = inMemoryCandidates.find((item) => item.id === String(id));
  if (!candidate) {
    return null;
  }

  Object.assign(candidate, payload, {
    updatedAt: new Date().toISOString(),
  });

  return candidate;
}

async function listCandidates({ page, limit, sortBy, direction }) {
  if (isDatabaseReady()) {
    const all = await CandidateModel.find().lean();
    return rankCandidates(all.map(toEntity), {
      page,
      limit,
      sortBy,
      direction,
    });
  }

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
