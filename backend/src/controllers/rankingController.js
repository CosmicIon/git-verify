const { getRankings } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

function listRankings(req, res) {
  const result = getRankings(req.validatedQuery);

  const payload = successResponse(
    req,
    {
      items: result.items,
    },
    {
      meta: {
        page: req.validatedQuery.page,
        limit: req.validatedQuery.limit,
        total: result.total,
      },
    }
  );

  res.status(payload.status).json(payload.body);
}

module.exports = { listRankings };
