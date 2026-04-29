const { createUploadDraft } = require("../services/candidateService");
const { parseResumeFiles } = require("../services/resumeParserService");
const { successResponse } = require("../utils/response");

async function uploadCandidate(req, res) {
  const input = req.validatedUploadInput || {};
  const uploadedFiles = req.files || [];
  const fileResults = await parseResumeFiles(uploadedFiles);
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

  // Multer uses memory storage; clear buffers after processing to reduce memory pressure.
  for (const file of uploadedFiles) {
    if (file && file.buffer) {
      file.buffer = Buffer.alloc(0);
    }
  }

  res.status(payload.status).json(payload.body);
}

module.exports = { uploadCandidate };
