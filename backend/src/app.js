const express = require("express");
const v1Routes = require("./routes/v1");
const legacyRoutes = require("./routes/legacy");
const { requestContext } = require("./middlewares/requestContext");
const { requestLogger } = require("./middlewares/requestLogger");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

function createApp() {
  const app = express();

  // Global middleware pipeline.
  app.use(requestContext);
  app.use(express.json({ limit: "1mb" }));
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
