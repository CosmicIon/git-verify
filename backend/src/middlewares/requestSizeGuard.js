const { AppError } = require("../utils/appError");

function toBytes(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function requestSizeGuard(req, _res, next) {
  const maxBytes = toBytes(process.env.MAX_REQUEST_BODY_BYTES, 1_500_000);
  const contentLength = Number(req.headers["content-length"] || 0);

  if (contentLength > maxBytes) {
    next(
      new AppError({
        code: "REQUEST_TOO_LARGE",
        message: "Request payload exceeds configured limit",
        status: 413,
        details: {
          maxBytes,
        },
      })
    );
    return;
  }

  next();
}

module.exports = {
  requestSizeGuard,
};
