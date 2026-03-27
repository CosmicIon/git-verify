const express = require("express");
const { asyncHandler } = require("../../utils/asyncHandler");
const { methodNotAllowed } = require("../../middlewares/methodNotAllowed");
const { getHealth } = require("../../controllers/healthController");
const { uploadCandidate } = require("../../controllers/uploadController");
const { scoreCandidate } = require("../../controllers/scoreController");
const { listRankings } = require("../../controllers/rankingController");
const {
  validateUploadRequest,
  validateScoreRequest,
  validateRankingsQuery,
} = require("../../validators/requestValidators");

const router = express.Router();

router
  .route("/health")
  .get(asyncHandler(getHealth))
  .all(methodNotAllowed(["GET"]));

router
  .route("/upload")
  .post(validateUploadRequest, asyncHandler(uploadCandidate))
  .all(methodNotAllowed(["POST"]));

router
  .route("/score")
  .post(validateScoreRequest, asyncHandler(scoreCandidate))
  .all(methodNotAllowed(["POST"]));

router
  .route("/rankings")
  .get(validateRankingsQuery, asyncHandler(listRankings))
  .all(methodNotAllowed(["GET"]));

module.exports = router;
