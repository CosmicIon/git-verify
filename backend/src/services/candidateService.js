const {
  getCandidateById,
  listCandidates,
  saveCandidateDraft,
  updateCandidateScores,
} = require("../repositories/candidateRepository");
const { getJobById } = require("../repositories/jobRepository");
const { AppError } = require("../utils/appError");
const { computeAtsFromResumes, computeSingleResumeAts } = require("./atsScoringService");
const { normalizeGithubIdentity } = require("./githubIdentityService");
const { analyzeGithubProfile } = require("./githubAnalysisService");
const { computeFinalScore } = require("./finalScoringService");
const { info, warn } = require("../utils/logger");

async function createUploadDraft({ githubLink, jobDescription, jobId, resumes }) {
  info("candidate_upload_draft_started", {
    traceable: true,
    resumeCount: Array.isArray(resumes) ? resumes.length : 0,
    hasJobId: Boolean(jobId),
  });

  const githubUsername = normalizeGithubIdentity(githubLink);
  const normalizedJobId = jobId ? String(jobId).trim() : null;

  let resolvedJobDescription = jobDescription ? String(jobDescription).trim() : "";

  if (normalizedJobId && !resolvedJobDescription) {
    const foundJob = await getJobById(normalizedJobId);
    if (!foundJob) {
      throw new AppError({
        code: "NOT_FOUND",
        message: "Job reference not found",
        status: 404,
        details: { field: "jobId", value: normalizedJobId },
      });
    }

    resolvedJobDescription = foundJob.jobDescription;
  }

  if (!resolvedJobDescription) {
    throw new AppError({
      code: "ATS_INPUT_ERROR",
      message: "Job description is required for candidate upload",
      status: 400,
      details: { fields: ["jobDescription", "jobId"] },
    });
  }

  const saved = await saveCandidateDraft({
    githubLink,
    githubUsername,
    jobId: normalizedJobId,
    jobDescription: resolvedJobDescription,
    resumes,
    atsScore: 0,
    githubScore: 0,
    finalScore: 0,
    flags: [],
  });

  info("candidate_upload_draft_completed", {
    candidateId: saved.id,
    githubUsername,
    hasJobId: Boolean(saved.jobId),
  });

  return saved;
}

async function calculateScores({ candidateId, githubLink, jobDescription, resumeText }) {
  info("candidate_score_started", {
    candidateId: String(candidateId),
  });

  const candidate = await getCandidateById(candidateId);
  if (!candidate) {
    throw new AppError({
      code: "NOT_FOUND",
      message: "Candidate not found for scoring",
      status: 404,
      details: { field: "candidateId", value: candidateId },
    });
  }

  const scoringJobDescription = jobDescription || candidate.jobDescription;
  if (!scoringJobDescription) {
    throw new AppError({
      code: "ATS_INPUT_ERROR",
      message: "Job description is required for ATS scoring",
      status: 400,
      details: { field: "jobDescription" },
    });
  }

  let atsResult;
  try {
    atsResult = computeAtsFromResumes({
      resumes: candidate.resumes,
      jobDescription: scoringJobDescription,
    });
  } catch (error) {
    if (!resumeText) {
      throw error;
    }

    const single = computeSingleResumeAts({
      resumeText,
      jobDescription: scoringJobDescription,
    });

    atsResult = {
      atsScore: single.atsScore,
      components: single.components,
      explanation: single.explanation,
      sourceFile: "inline-resume-text",
      evaluatedResumes: [
        {
          fileName: "inline-resume-text",
          atsScore: single.atsScore,
        },
      ],
      preprocessing: single.preprocessing,
    };
  }

  const normalizedGithubUsername = normalizeGithubIdentity(
    githubLink || candidate.githubLink || candidate.githubUsername
  );

  let githubAnalysis;
  let partialData = null;
  try {
    githubAnalysis = await analyzeGithubProfile({
      username: normalizedGithubUsername,
      jobDescription: scoringJobDescription,
      resumes: candidate.resumes,
      fallbackResumeText: resumeText,
    });
  } catch (error) {
    const recoverableCodes = new Set([
      "GITHUB_RATE_LIMITED",
      "GITHUB_API_ERROR",
      "GITHUB_NOT_FOUND",
    ]);

    if (!recoverableCodes.has(error.code)) {
      throw error;
    }

    warn("candidate_score_github_fallback", {
      candidateId: candidate.id,
      reasonCode: error.code,
    });

    githubAnalysis = {
      metrics: null,
      score: {
        githubScore: 0,
        components: {
          activity: 0,
          language: 0,
          quality: 0,
          consistency: 0,
          verification: 0,
        },
        weights: null,
        reasonCodes: ["GITHUB_DATA_UNAVAILABLE"],
      },
      flags: [
        {
          code: "GITHUB_DATA_UNAVAILABLE",
          severity: "medium",
          message: "GitHub analysis unavailable; score computed with fallback values",
          details: {
            reasonCode: error.code,
          },
        },
      ],
    };

    partialData = {
      githubUnavailable: true,
      reasonCode: error.code,
      userMessage:
        "GitHub data is temporarily unavailable. Final score was computed using fallback values.",
    };
  }

  const githubScore = githubAnalysis.score.githubScore;
  const componentAvailability = {
    ats: Number.isFinite(atsResult.atsScore),
    github: !githubAnalysis.score.reasonCodes.includes("GITHUB_DATA_UNAVAILABLE"),
  };

  const finalResult = computeFinalScore({
    atsScore: atsResult.atsScore,
    githubScore,
    componentAvailability,
    verificationFlags: githubAnalysis.flags,
    atsSourceFile: atsResult.sourceFile,
  });

  const scoreAudit = {
    scoringVersion: "v1-phase10",
    scoringTimestamp: new Date().toISOString(),
    finalPolicy: finalResult.finalPolicy,
    confidenceScore: finalResult.confidenceScore,
    partialData,
  };

  await updateCandidateScores(candidate.id, {
    githubUsername: normalizedGithubUsername,
    atsScore: atsResult.atsScore,
    githubScore,
    finalScore: finalResult.finalScore,
    confidenceScore: finalResult.confidenceScore,
    flags: githubAnalysis.flags,
    scoreAudit,
    atsDetails: {
      components: atsResult.components,
      explanation: atsResult.explanation,
      sourceFile: atsResult.sourceFile,
      evaluatedResumes: atsResult.evaluatedResumes,
      preprocessing: atsResult.preprocessing,
    },
    githubDetails: {
      metrics: githubAnalysis.metrics,
      components: githubAnalysis.score.components,
      weights: githubAnalysis.score.weights,
      reasonCodes: githubAnalysis.score.reasonCodes,
    },
  });

  info("candidate_score_completed", {
    candidateId: candidate.id,
    finalScore: finalResult.finalScore,
    usedGithubFallback: Boolean(partialData),
  });

  return {
    candidateId: candidate.id,
    githubUsername: normalizedGithubUsername,
    atsScore: atsResult.atsScore,
    atsExplainability: atsResult.explanation,
    atsComponents: atsResult.components,
    atsSourceFile: atsResult.sourceFile,
    atsEvaluatedResumes: atsResult.evaluatedResumes,
    githubScore,
    githubComponents: githubAnalysis.score.components,
    githubReasonCodes: githubAnalysis.score.reasonCodes,
    verificationFlags: githubAnalysis.flags,
    partialData,
    pipelineMessage: partialData
      ? partialData.userMessage
      : "All scoring components completed successfully",
    finalScore: finalResult.finalScore,
    confidenceScore: finalResult.confidenceScore,
    scoreAudit,
  };
}

async function getRankings(query) {
  return listCandidates(query);
}

module.exports = {
  createUploadDraft,
  calculateScores,
  getRankings,
};
