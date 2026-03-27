const express = require("express");
const v1Routes = require("./routes/v1");
const legacyRoutes = require("./routes/legacy");
const { requestContext } = require("./middlewares/requestContext");
const { requestLogger } = require("./middlewares/requestLogger");
const { requestSizeGuard } = require("./middlewares/requestSizeGuard");
const { securityHeaders } = require("./middlewares/securityHeaders");
const { corsPolicy } = require("./middlewares/corsPolicy");
const { rateLimiter } = require("./middlewares/rateLimiter");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

function createApp() {
  const app = express();
  const jsonLimit = process.env.JSON_BODY_LIMIT || "1mb";
  const urlEncodedLimit = process.env.URLENCODED_BODY_LIMIT || "1mb";

  // Global middleware pipeline.
  app.use(requestContext);
  app.use(securityHeaders);
  app.use(corsPolicy);
  app.use(rateLimiter);
  app.use(requestSizeGuard);
  app.use(express.json({ limit: jsonLimit }));
  app.use(express.urlencoded({ extended: false, limit: urlEncodedLimit }));
  app.use(requestLogger);

  // Versioned API routes.
  app.use("/api/v1", v1Routes);

  // Legacy aliases for compatibility.
  app.use("/api", legacyRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
