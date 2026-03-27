const { createUploadDraft } = require("../services/candidateService");
const { parseResumeFiles } = require("../services/resumeParserService");
const { successResponse } = require("../utils/response");

async function uploadCandidate(req, res) {
  const input = req.validatedUploadInput || {};
  const fileResults = await parseResumeFiles(req.files || []);
  const parsedFiles = fileResults.filter((result) => result.status === "parsed");
  const failedFiles = fileResults.filter((result) => result.status === "failed");

  const record = await createUploadDraft({
    githubLink: input.githubLink,
    jobDescription: input.jobDescription,
    jobId: input.jobId,
    resumes: fileResults,
  });

  const aggregateFlags = [
    ...new Set(parsedFiles.flatMap((file) => file.flags || [])),
  ];

  const payload = successResponse(
    req,
    {
      message: "Upload successful",
      candidateId: record.id,
      job: {
        jobId: record.jobId,
        source: record.jobId ? "job-reference" : "inline-description",
      },
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
