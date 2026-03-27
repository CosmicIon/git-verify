const { AppError } = require("../utils/appError");
const { errorResponse } = require("../utils/response");

function errorHandler(error, req, res, next) {
  void next;
  const normalizedError =
    error instanceof AppError
      ? error
      : new AppError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Unexpected server error",
          status: 500,
          details: process.env.NODE_ENV === "development" ? { raw: error.message } : null,
        });

  const body = errorResponse(req, normalizedError);
  res.status(normalizedError.status).json(body);
}

module.exports = { errorHandler };
