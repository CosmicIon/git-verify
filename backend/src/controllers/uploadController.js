const { createUploadDraft } = require("../services/candidateService");
const { parseResumeFiles } = require("../services/resumeParserService");
const { successResponse } = require("../utils/response");

async function uploadCandidate(req, res) {
  const fileResults = await parseResumeFiles(req.files || []);
  const parsedFiles = fileResults.filter((result) => result.status === "parsed");
  const failedFiles = fileResults.filter((result) => result.status === "failed");

  const record = createUploadDraft({
    githubLink: req.body.githubLink,
    jobDescription: req.body.jobDescription,
    resumes: fileResults,
  });

  const aggregateFlags = [
    ...new Set(parsedFiles.flatMap((file) => file.flags || [])),
  ];

  const payload = successResponse(
    req,
    {
      message: "Upload processed",
      candidateId: record.id,
      files: fileResults,
      summary: {
        totalFiles: fileResults.length,
        parsedFiles: parsedFiles.length,
        failedFiles: failedFiles.length,
        flags: aggregateFlags,
      },
      diagnostics: req.uploadDiagnostics || null,
    },
    {
      status: 201,
    }
  );

  res.status(payload.status).json(payload.body);
}

module.exports = { uploadCandidate };
