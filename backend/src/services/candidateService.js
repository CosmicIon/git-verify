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

async function createUploadDraft({ githubLink, jobDescription, jobId, resumes }) {
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

  return saveCandidateDraft({
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
}

async function calculateScores({ candidateId, githubLink, jobDescription, resumeText }) {
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
    scoringVersion: "v1-phase6",
    scoringTimestamp: new Date().toISOString(),
    finalPolicy: finalResult.finalPolicy,
    confidenceScore: finalResult.confidenceScore,
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
