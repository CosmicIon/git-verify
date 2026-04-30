const {
  ALLOWED_RESUME_MIME_TYPES,
  assertOrThrow,
  isValidEntityId,
  isNonEmptyString,
  isValidGithubIdentity,
  toPositiveInteger,
} = require("./commonValidators");

function validateUploadRequest(req, _res, next) {
  const { githubLink, jobDescription, jobId } = req.body || {};
  const files = req.files || [];
  const maxFilesPerUpload = Number(process.env.MAX_FILES_PER_UPLOAD || 20);

  try {
    assertOrThrow(isValidGithubIdentity(githubLink), {
      code: "VALIDATION_ERROR",
      message: "githubLink must be a valid GitHub username or profile URL",
      status: 400,
      details: { field: "githubLink" },
    });

    const normalizedJobId = String(jobId || "").trim();
    const hasJobDescription = isNonEmptyString(jobDescription) && jobDescription.trim().length >= 30;
    const hasJobReference = normalizedJobId.length > 0;

    if (hasJobReference) {
      assertOrThrow(isValidEntityId(normalizedJobId), {
        code: "VALIDATION_ERROR",
        message: "jobId must be a positive integer or a valid UUID",
        status: 400,
        details: { field: "jobId" },
      });
    }

    assertOrThrow(hasJobDescription || hasJobReference, {
      code: "VALIDATION_ERROR",
      message: "Either jobDescription (min 30 chars) or jobId is required",
      status: 400,
      details: {
        fields: ["jobDescription", "jobId"],
        minLength: 30,
      },
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

    req.validatedUploadInput = {
      githubLink: githubLink.trim(),
      jobDescription: hasJobDescription ? jobDescription.trim() : null,
      jobId: hasJobReference ? normalizedJobId : null,
    };

    next();
  } catch (error) {
    next(error);
  }
}

function validateScoreRequest(req, _res, next) {
  const { candidateId, githubLink, jobDescription, resumeText } = req.body || {};

  try {
    const rawCandidateId = String(candidateId || "").trim();

    assertOrThrow(isValidEntityId(rawCandidateId), {
      code: "VALIDATION_ERROR",
      message: "candidateId must be a positive integer or a valid UUID",
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
      candidateId: rawCandidateId,
      githubLink: githubLink !== undefined ? githubLink.trim() : undefined,
      jobDescription: jobDescription !== undefined ? jobDescription.trim() : undefined,
      resumeText: resumeText !== undefined ? resumeText.trim() : undefined,
    };

    next();
  } catch (error) {
    next(error);
  }
}

function parseBooleanFilter(value) {
  if (value === undefined) {
    return false;
  }

  const normalized = String(value).toLowerCase();
  if (normalized === "true" || normalized === "1") {
    return true;
  }

  if (normalized === "false" || normalized === "0") {
    return false;
  }

  return null;
}

function parseScoreFilter(value) {
  if (value === undefined) {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return null;
  }

  return parsed;
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
    const flaggedOnly = parseBooleanFilter(req.query.flaggedOnly);
    const minFinalScore = parseScoreFilter(req.query.minFinalScore);
    const minAtsScore = parseScoreFilter(req.query.minAtsScore);
    const minGithubScore = parseScoreFilter(req.query.minGithubScore);

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

    assertOrThrow(flaggedOnly !== null, {
      code: "VALIDATION_ERROR",
      message: "flaggedOnly must be true/false",
      status: 400,
      details: { field: "flaggedOnly", allowedValues: ["true", "false", "1", "0"] },
    });

    if (req.query.minFinalScore !== undefined) {
      assertOrThrow(minFinalScore !== null, {
        code: "VALIDATION_ERROR",
        message: "minFinalScore must be a number between 0 and 1",
        status: 400,
        details: { field: "minFinalScore", min: 0, max: 1 },
      });
    }

    if (req.query.minAtsScore !== undefined) {
      assertOrThrow(minAtsScore !== null, {
        code: "VALIDATION_ERROR",
        message: "minAtsScore must be a number between 0 and 1",
        status: 400,
        details: { field: "minAtsScore", min: 0, max: 1 },
      });
    }

    if (req.query.minGithubScore !== undefined) {
      assertOrThrow(minGithubScore !== null, {
        code: "VALIDATION_ERROR",
        message: "minGithubScore must be a number between 0 and 1",
        status: 400,
        details: { field: "minGithubScore", min: 0, max: 1 },
      });
    }

    req.validatedQuery = {
      page,
      limit,
      sortBy,
      direction: req.query.direction === "asc" ? "asc" : "desc",
      flaggedOnly,
      minFinalScore,
      minAtsScore,
      minGithubScore,
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
