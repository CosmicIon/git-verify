const {
  getCandidateById,
  listCandidates,
  saveCandidateDraft,
  updateCandidateScores,
} = require("../repositories/candidateRepository");
const { AppError } = require("../utils/appError");
const { computeAtsFromResumes, computeSingleResumeAts } = require("./atsScoringService");

function createUploadDraft({ githubLink, jobDescription, resumes }) {
  return saveCandidateDraft({
    githubLink,
    jobDescription,
    resumes,
    atsScore: 0,
    githubScore: 0,
    finalScore: 0,
  });
}

function calculateScores({ candidateId, githubLink, jobDescription, resumeText }) {
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

  // Keep GitHub and final score placeholders until Phase 5/6 are implemented.
  const githubSource = githubLink || candidate.githubLink || "";
  const githubSignal = githubSource.length % 10;
  const githubScore = Number((0.4 + githubSignal / 100).toFixed(6));
  const finalScore = Number(((atsResult.atsScore + githubScore) / 2).toFixed(6));

  updateCandidateScores(candidate.id, {
    atsScore: atsResult.atsScore,
    githubScore,
    finalScore,
    atsDetails: {
      components: atsResult.components,
      explanation: atsResult.explanation,
      sourceFile: atsResult.sourceFile,
      evaluatedResumes: atsResult.evaluatedResumes,
      preprocessing: atsResult.preprocessing,
    },
  });

  return {
    candidateId: candidate.id,
    atsScore: atsResult.atsScore,
    atsExplainability: atsResult.explanation,
    atsComponents: atsResult.components,
    atsSourceFile: atsResult.sourceFile,
    atsEvaluatedResumes: atsResult.evaluatedResumes,
    githubScore,
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
