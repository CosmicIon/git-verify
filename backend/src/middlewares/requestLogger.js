const { info } = require("../utils/logger");

function requestLogger(req, _res, next) {
  const startedAt = Date.now();

  resFinishLogger(req, startedAt);
  next();
}

function resFinishLogger(req, startedAt) {
  req.res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    info("http_request_completed", {
      traceId: req.traceId,
      method: req.method,
      path: req.originalUrl,
      statusCode: req.res.statusCode,
      durationMs,
    });
  });
}

module.exports = { requestLogger };
