const { successResponse } = require("../utils/response");

function getHealth(req, res) {
  const payload = successResponse(req, {
    service: "git-verify-backend",
    status: "ok",
  });

  res.status(payload.status).json(payload.body);
}

module.exports = { getHealth };
