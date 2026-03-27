const { AppError } = require("../utils/appError");
const { errorResponse } = require("../utils/response");
const { error: logError } = require("../utils/logger");

function errorHandler(error, req, res, next) {
  void next;
  const multerCodeMap = {
    LIMIT_FILE_SIZE: {
      code: "FILE_TOO_LARGE",
      message: "One or more files exceeded upload size limit",
      status: 400,
    },
    LIMIT_FILE_COUNT: {
      code: "TOO_MANY_FILES",
      message: "Too many files uploaded in one request",
      status: 400,
    },
  };

  const mappedMulterError =
    error && error.name === "MulterError" && multerCodeMap[error.code]
      ? new AppError({
          ...multerCodeMap[error.code],
          details: {
            multerCode: error.code,
          },
        })
      : null;

  const normalizedError = mappedMulterError
    ? mappedMulterError
    : error instanceof AppError
      ? error
      : new AppError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected server error",
          status: 500,
          details: process.env.NODE_ENV === "development" ? { raw: error.message } : null,
        });

  logError("http_request_failed", {
    traceId: req.traceId,
    method: req.method,
    path: req.originalUrl,
    statusCode: normalizedError.status,
    code: normalizedError.code,
    details: normalizedError.details,
  });

  const body = errorResponse(req, normalizedError);
  res.status(normalizedError.status).json(body);
}

module.exports = { errorHandler };
