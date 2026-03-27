const { getRankings } = require("../services/candidateService");
const { successResponse } = require("../utils/response");

async function listRankings(req, res) {
  const result = await getRankings(req.validatedQuery);

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
        filters: {
          flaggedOnly: req.validatedQuery.flaggedOnly,
          minFinalScore: req.validatedQuery.minFinalScore,
          minAtsScore: req.validatedQuery.minAtsScore,
          minGithubScore: req.validatedQuery.minGithubScore,
        },
      },
    }
  );

  res.status(payload.status).json(payload.body);
}

module.exports = { listRankings };
