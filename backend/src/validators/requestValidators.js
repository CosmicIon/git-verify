const {
  ALLOWED_RESUME_MIME_TYPES,
  assertOrThrow,
  isNonEmptyString,
  isValidGithubIdentity,
  toPositiveInteger,
} = require("./commonValidators");

function validateUploadRequest(req, _res, next) {
  const { githubLink, jobDescription, resumeMimeType } = req.body || {};

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

    if (resumeMimeType !== undefined) {
      assertOrThrow(ALLOWED_RESUME_MIME_TYPES.includes(resumeMimeType), {
        code: "VALIDATION_ERROR",
        message: "resumeMimeType must be PDF or DOCX MIME type",
        status: 400,
        details: {
          field: "resumeMimeType",
          allowedValues: ALLOWED_RESUME_MIME_TYPES,
        },
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

function validateScoreRequest(req, _res, next) {
  const { githubLink, jobDescription } = req.body || {};

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

    next();
  } catch (error) {
    next(error);
  }
}

function validateRankingsQuery(req, _res, next) {
  try {
    const page = toPositiveInteger(req.query.page, 1);
    const limit = toPositiveInteger(req.query.limit, 20);
    const allowedSortFields = ["finalScore", "atsScore", "githubScore", "createdAt"];
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
