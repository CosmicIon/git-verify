const { createUploadDraft } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

function uploadCandidate(req, res) {
  const record = createUploadDraft({
    githubLink: req.body.githubLink,
    jobDescription: req.body.jobDescription,
  });

  const payload = successResponse(req, {
    message: "Upload validated and draft created",
    candidateId: record.id,
  }, {
    status: 201,
  });

  res.status(payload.status).json(payload.body);
}

module.exports = { uploadCandidate };
