function requestLogger(req, _res, next) {
  const startedAt = Date.now();

  resFinishLogger(req, startedAt);
  next();
}

function resFinishLogger(req, startedAt) {
  req.res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    const logLine = {
      traceId: req.traceId,
      method: req.method,
      path: req.originalUrl,
      statusCode: req.res.statusCode,
      durationMs,
    };

    console.log(JSON.stringify(logLine));
  });
}

module.exports = { requestLogger };
