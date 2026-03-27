const {
  ALLOWED_RESUME_MIME_TYPES,
  assertOrThrow,
  isNonEmptyString,
  isValidGithubIdentity,
  toPositiveInteger,
} = require("./commonValidators");

function validateUploadRequest(req, _res, next) {
  const { githubLink, jobDescription } = req.body || {};
  const files = req.files || [];
  const maxFilesPerUpload = Number(process.env.MAX_FILES_PER_UPLOAD || 20);

  try {
    assertOrThrow(isValidGithubIdentity(githubLink), {
      code: "VALIDATION_ERROR",
      message: "githubLink must be a valid GitHub username or profile URL",
      status: 400,
      details: { field: "githubLink" },
    });

    assertOrThrow(isNonEmptyString(jobDescription) && jobDescription.trim().length >= 30, {
      code: "VALIDATION_ERROR",
      message: "jobDescription must be at least 30 characters",
      status: 400,
      details: { field: "jobDescription", minLength: 30 },
    });

    assertOrThrow(files.length > 0, {
      code: "VALIDATION_ERROR",
      message: "At least one resume file is required under field 'resumes'",
      status: 400,
      details: { field: "resumes" },
    });

    assertOrThrow(files.length <= maxFilesPerUpload, {
      code: "VALIDATION_ERROR",
      message: `Maximum ${maxFilesPerUpload} files allowed per upload`,
      status: 400,
      details: { field: "resumes", maxFilesPerUpload },
    });

    const unsupportedFiles = files.filter(
      (file) => !ALLOWED_RESUME_MIME_TYPES.includes(file.mimetype)
    );

    req.uploadDiagnostics = {
      totalFiles: files.length,
      unsupportedFileNames: unsupportedFiles.map((file) => file.originalname),
    };

    next();
  } catch (error) {
    next(error);
  }
}

function validateScoreRequest(req, _res, next) {
  const { candidateId, githubLink, jobDescription, resumeText } = req.body || {};

  try {
    const normalizedCandidateId = Number(candidateId);
    assertOrThrow(Number.isInteger(normalizedCandidateId) && normalizedCandidateId > 0, {
      code: "VALIDATION_ERROR",
      message: "candidateId must be a positive integer",
      status: 400,
      details: { field: "candidateId" },
    });

    if (githubLink !== undefined) {
      assertOrThrow(isValidGithubIdentity(githubLink), {
        code: "VALIDATION_ERROR",
        message: "githubLink must be a valid GitHub username or profile URL",
        status: 400,
        details: { field: "githubLink" },
      });
    }

    if (jobDescription !== undefined) {
      assertOrThrow(isNonEmptyString(jobDescription) && jobDescription.trim().length >= 30, {
        code: "VALIDATION_ERROR",
        message: "jobDescription must be at least 30 characters",
        status: 400,
        details: { field: "jobDescription", minLength: 30 },
      });
    }

    if (resumeText !== undefined) {
      assertOrThrow(isNonEmptyString(resumeText) && resumeText.trim().length >= 30, {
        code: "VALIDATION_ERROR",
        message: "resumeText must be at least 30 characters when provided",
        status: 400,
        details: { field: "resumeText", minLength: 30 },
      });
    }

    req.validatedScoreInput = {
      candidateId: normalizedCandidateId,
    };

    next();
  } catch (error) {
    next(error);
  }
}

function validateRankingsQuery(req, _res, next) {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = toPositiveInteger(req.query.limit, 20);
    const allowedSortFields = [
      "finalScore",
      "atsScore",
      "githubScore",
      "confidenceScore",
      "createdAt",
    ];
    const sortBy = req.query.sortBy || "finalScore";

    assertOrThrow(page !== null, {
      code: "VALIDATION_ERROR",
      message: "page must be a positive integer",
      status: 400,
      details: { field: "page" },
    });

    assertOrThrow(limit !== null && limit <= 100, {
      code: "VALIDATION_ERROR",
      message: "limit must be a positive integer less than or equal to 100",
      status: 400,
      details: { field: "limit", max: 100 },
    });

    assertOrThrow(allowedSortFields.includes(sortBy), {
      code: "VALIDATION_ERROR",
      message: "sortBy contains unsupported field",
      status: 400,
      details: { field: "sortBy", allowedValues: allowedSortFields },
    });

    req.validatedQuery = {
      page,
      limit,
      sortBy,
      direction: req.query.direction === "asc" ? "asc" : "desc",
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  validateUploadRequest,
  validateScoreRequest,
  validateRankingsQuery,
};
