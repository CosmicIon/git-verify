function successResponse(req, data, options = {}) {
  const { status = 200, meta = {} } = options;

  return {
    status,
    body: {
      success: true,
      data,
      meta: {
        traceId: req.traceId,
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
  };
}

function errorResponse(req, error) {
  return {
    success: false,
    error: {
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Unexpected server error",
      details: error.details || null,
    },
    meta: {
      traceId: req.traceId,
      timestamp: new Date().toISOString(),
    },
  };
}

module.exports = {
  successResponse,
  errorResponse,
};
