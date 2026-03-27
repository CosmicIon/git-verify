const { randomUUID } = require("node:crypto");

function requestContext(req, _res, next) {
  req.traceId = randomUUID();
  next();
}

module.exports = { requestContext };
