const { AppError } = require("../utils/appError");

function clamp01(value) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 1) {
    return 1;
  }
  return value;
}

function parseLambda() {
  const lambda = Number(process.env.FINAL_LAMBDA || 0.5);
  if (!Number.isFinite(lambda) || lambda < 0 || lambda > 1) {
    throw new AppError({
      code: "CONFIG_ERROR",
      message: "FINAL_LAMBDA must be a number between 0 and 1",
      status: 500,
      details: { field: "FINAL_LAMBDA" },
    });
  }

  return lambda;
}

function calculateConfidenceScore({ componentAvailability, verificationFlags, atsSourceFile }) {
  let confidence = 1;

  if (!componentAvailability.ats) {
    confidence -= 0.5;
  }
  if (!componentAvailability.github) {
    confidence -= 0.35;
  }

  for (const flag of verificationFlags || []) {
    if (flag.severity === "high") {
      confidence -= 0.2;
    } else if (flag.severity === "medium") {
      confidence -= 0.1;
    } else if (flag.severity === "low") {
      confidence -= 0.05;
    }
  }

  if (atsSourceFile === "inline-resume-text") {
    confidence -= 0.1;
  }

  return Number(clamp01(confidence).toFixed(6));
}

function computeFinalScore({ atsScore, githubScore, componentAvailability, verificationFlags, atsSourceFile }) {
  const lambda = parseLambda();

  const availableAts = componentAvailability.ats;
  const availableGithub = componentAvailability.github;

  let finalScore = 0;
  let fallbackPolicy = "weighted";

  if (availableAts && availableGithub) {
    finalScore = lambda * atsScore + (1 - lambda) * githubScore;
  } else if (availableAts) {
    finalScore = atsScore;
    fallbackPolicy = "ats-only-fallback";
  } else if (availableGithub) {
    finalScore = githubScore;
    fallbackPolicy = "github-only-fallback";
  } else {
    finalScore = 0;
    fallbackPolicy = "no-signal-fallback";
  }

  finalScore = Number(clamp01(finalScore).toFixed(6));

  const confidenceScore = calculateConfidenceScore({
    componentAvailability,
    verificationFlags,
    atsSourceFile,
  });

  return {
    finalScore,
    confidenceScore,
    finalPolicy: {
      lambda,
      fallbackPolicy,
      componentAvailability,
    },
  };
}

module.exports = {
  computeFinalScore,
};
