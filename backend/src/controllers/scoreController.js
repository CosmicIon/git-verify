const { calculateScores } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

function scoreCandidate(req, res) {
  const result = calculateScores({ githubLink: req.body.githubLink });

  const payload = successResponse(req, result);
  res.status(payload.status).json(payload.body);
}

module.exports = { scoreCandidate };
