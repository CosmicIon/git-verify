const { AppError } = require("../utils/appError");

const counters = new Map();

function getClientKey(req) {
  return String(req.ip || req.headers["x-forwarded-for"] || "unknown");
}

function rateLimiter(req, _res, next) {
  const limit = Number(process.env.API_RATE_LIMIT_PER_MINUTE || 60);
  const now = Date.now();
  const windowMs = 60 * 1000;
  const clientKey = getClientKey(req);
  const existing = counters.get(clientKey) || { count: 0, windowStart: now };

  if (now - existing.windowStart >= windowMs) {
    counters.set(clientKey, { count: 1, windowStart: now });
    next();
    return;
  }

  if (existing.count >= limit) {
    next(
      new AppError({
        code: "RATE_LIMITED",
        message: "Too many requests, please retry later",
        status: 429,
        details: {
          limit,
          windowSeconds: 60,
        },
      })
    );
    return;
  }

  existing.count += 1;
  counters.set(clientKey, existing);
  next();
}

module.exports = {
  rateLimiter,
};
