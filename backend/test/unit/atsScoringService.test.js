const test = require("node:test");
const assert = require("node:assert/strict");
const { computeSingleResumeAts } = require("../../src/services/atsScoringService");

test("ATS score is higher for semantically closer resume text", () => {
  const jobDescription =
    "Looking for backend engineer with node express mongodb testing ci docker skills";

  const strongResume =
    "Built backend APIs using node express and mongodb with docker based CI test pipelines";
  const weakResume = "Created social media graphics and managed basic office documentation";

  const strongResult = computeSingleResumeAts({
    resumeText: strongResume,
    jobDescription,
  });

  const weakResult = computeSingleResumeAts({
    resumeText: weakResume,
    jobDescription,
  });

  assert.ok(strongResult.atsScore > weakResult.atsScore);
  assert.ok(strongResult.components.tfidf >= 0);
  assert.ok(strongResult.components.semantic >= 0);
});

test("ATS config throws when alpha and beta do not sum to 1", () => {
  const previousAlpha = process.env.ATS_ALPHA;
  const previousBeta = process.env.ATS_BETA;

  process.env.ATS_ALPHA = "0.8";
  process.env.ATS_BETA = "0.4";

  assert.throws(
    () =>
      computeSingleResumeAts({
        resumeText: "node express mongodb",
        jobDescription: "node express mongodb",
      }),
    /ATS_ALPHA \+ ATS_BETA must equal 1/
  );

  process.env.ATS_ALPHA = previousAlpha;
  process.env.ATS_BETA = previousBeta;
});
