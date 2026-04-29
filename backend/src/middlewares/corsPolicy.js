const { AppError } = require("../utils/appError");

function getAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || "http://localhost:4173,http://localhost:3000";
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function corsPolicy(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = getAllowedOrigins();

  if (!origin) {
    next();
    return;
  }

  if (!allowedOrigins.includes(origin)) {
    next(
      new AppError({
        code: "CORS_NOT_ALLOWED",
        message: "Origin is not allowed by CORS policy",
        status: 403,
        details: {
          origin,
        },
      })
    );
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Request-Id");
  res.setHeader("Access-Control-Max-Age", "600");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  next();
}

module.exports = {
  corsPolicy,
};
