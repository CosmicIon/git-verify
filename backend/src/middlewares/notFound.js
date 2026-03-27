const { AppError } = require("../utils/appError");

function notFound(req, _res, next) {
  next(
    new AppError({
      code: "NOT_FOUND",
      message: `Route not found: ${req.method} ${req.originalUrl}`,
      status: 404,
    })
  );
}

module.exports = { notFound };
