const { calculateScores } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

function scoreCandidate(req, res) {
  const result = calculateScores({
    candidateId: req.body.candidateId,
    githubLink: req.body.githubLink,
    jobDescription: req.body.jobDescription,
    resumeText: req.body.resumeText,
  });

  const payload = successResponse(req, result);
  res.status(payload.status).json(payload.body);
}

module.exports = { scoreCandidate };
