const {
  getCandidateById,
  listCandidates,
  saveCandidateDraft,
  updateCandidateScores,
} = require("../repositories/candidateRepository");
const { AppError } = require("../utils/appError");
const { computeAtsFromResumes, computeSingleResumeAts } = require("./atsScoringService");
const { normalizeGithubIdentity } = require("./githubIdentityService");
const { analyzeGithubProfile } = require("./githubAnalysisService");

function createUploadDraft({ githubLink, jobDescription, resumes }) {
  const githubUsername = normalizeGithubIdentity(githubLink);

  return saveCandidateDraft({
    githubLink,
    githubUsername,
    jobDescription,
    resumes,
    atsScore: 0,
    githubScore: 0,
    finalScore: 0,
    flags: [],
  });
}

async function calculateScores({ candidateId, githubLink, jobDescription, resumeText }) {
  const candidate = getCandidateById(candidateId);
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
  const finalScore = Number(((atsResult.atsScore + githubScore) / 2).toFixed(6));

  updateCandidateScores(candidate.id, {
    githubUsername: normalizedGithubUsername,
    atsScore: atsResult.atsScore,
    githubScore,
    finalScore,
    flags: githubAnalysis.flags,
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
    finalScore,
  };
}

function getRankings(query) {
  return listCandidates(query);
}

module.exports = {
  createUploadDraft,
  calculateScores,
  getRankings,
};
