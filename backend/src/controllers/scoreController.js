const { calculateScores } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

async function scoreCandidate(req, res) {
  const input = req.validatedScoreInput || {};

  const result = await calculateScores({
    candidateId: input.candidateId || req.body.candidateId,
    githubLink: input.githubLink,
    jobDescription: input.jobDescription,
    resumeText: input.resumeText,
  });

  const payload = successResponse(req, result);
  res.status(payload.status).json(payload.body);
}

module.exports = { scoreCandidate };
