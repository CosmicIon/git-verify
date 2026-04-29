const { AppError } = require("../utils/appError");
const { preprocessText } = require("./preprocessingService");
const { computeSemanticScore } = require("./semanticScoringService");

function countTerms(tokens) {
  const map = new Map();

  for (const token of tokens) {
    map.set(token, (map.get(token) || 0) + 1);
  }

  return map;
}

function buildIdf(tokensA, tokensB) {
  const df = new Map();
  const docs = [new Set(tokensA), new Set(tokensB)];

  for (const doc of docs) {
    for (const token of doc) {
      df.set(token, (df.get(token) || 0) + 1);
    }
  }

  const docCount = docs.length;
  const idf = new Map();

  for (const [token, freq] of df.entries()) {
    const value = Math.log((docCount + 1) / (freq + 1)) + 1;
    idf.set(token, value);
  }

  return idf;
}

function buildTfIdfVector(tokens, idf) {
  const termCounts = countTerms(tokens);
  const total = tokens.length || 1;
  const vector = new Map();

  for (const [token, count] of termCounts.entries()) {
    const tf = count / total;
    const weight = tf * (idf.get(token) || 0);
    vector.set(token, weight);
  }

  return vector;
}

function cosineSimilarity(vectorA, vectorB) {
  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const value of vectorA.values()) {
    magnitudeA += value * value;
  }

  for (const value of vectorB.values()) {
    magnitudeB += value * value;
  }

  for (const [token, valueA] of vectorA.entries()) {
    const valueB = vectorB.get(token) || 0;
    dot += valueA * valueB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function parseWeight(name, fallback) {
  const parsed = Number(process.env[name] || fallback);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new AppError({
      code: "CONFIG_ERROR",
      message: `${name} must be a number between 0 and 1`,
      status: 500,
      details: { field: name },
    });
  }

  return parsed;
}

function getAtsWeights() {
  const alpha = parseWeight("ATS_ALPHA", 0.6);
  const beta = parseWeight("ATS_BETA", 0.4);
  const sum = alpha + beta;

  if (Math.abs(sum - 1) > 0.0001) {
    throw new AppError({
      code: "CONFIG_ERROR",
      message: "ATS_ALPHA + ATS_BETA must equal 1",
      status: 500,
      details: { alpha, beta },
    });
  }

  return { alpha, beta };
}

function buildExplainability({ resumeTokens, jdTokens, resumeVector, jdVector }) {
  const resumeSet = new Set(resumeTokens);
  const jdUnique = [...new Set(jdTokens)];

  const matched = [];
  const missing = [];

  for (const token of jdUnique) {
    if (resumeSet.has(token)) {
      const contribution = (resumeVector.get(token) || 0) * (jdVector.get(token) || 0);
      matched.push({ token, contribution });
    } else {
      missing.push(token);
    }
  }

  matched.sort((a, b) => b.contribution - a.contribution);

  return {
    topMatchedSkills: matched.slice(0, 10).map((item) => item.token),
    missingRequiredSkills: missing.slice(0, 10),
  };
}

function computeSingleResumeAts({ resumeText, jobDescription }) {
  const resumeProcessed = preprocessText(resumeText);
  const jdProcessed = preprocessText(jobDescription);

  const idf = buildIdf(resumeProcessed.tokens, jdProcessed.tokens);
  const resumeVector = buildTfIdfVector(resumeProcessed.tokens, idf);
  const jdVector = buildTfIdfVector(jdProcessed.tokens, idf);

  const tfidfScore = cosineSimilarity(resumeVector, jdVector);
  const semanticScore = computeSemanticScore({
    resumeTokens: resumeProcessed.tokens,
    jdTokens: jdProcessed.tokens,
  });

  const { alpha, beta } = getAtsWeights();
  const atsScore = Number((alpha * tfidfScore + beta * semanticScore).toFixed(6));

  const explanation = buildExplainability({
    resumeTokens: resumeProcessed.tokens,
    jdTokens: jdProcessed.tokens,
    resumeVector,
    jdVector,
  });

  return {
    atsScore,
    components: {
      tfidf: Number(tfidfScore.toFixed(6)),
      semantic: Number(semanticScore.toFixed(6)),
      weights: { alpha, beta },
    },
    explanation,
    preprocessing: {
      resumeTokenCount: resumeProcessed.tokenCount,
      jdTokenCount: jdProcessed.tokenCount,
    },
  };
}

function computeAtsFromResumes({ resumes, jobDescription }) {
  const parsedResumes = (resumes || []).filter(
    (resume) => resume.status === "parsed" && resume.extraction && resume.extraction.rawText
  );

  if (parsedResumes.length === 0) {
    throw new AppError({
      code: "ATS_INPUT_ERROR",
      message: "No parsed resumes available for ATS scoring",
      status: 400,
      details: { field: "resumes" },
    });
  }

  const evaluated = parsedResumes.map((resume) => {
    const result = computeSingleResumeAts({
      resumeText: resume.extraction.rawText,
      jobDescription,
    });

    return {
      fileName: resume.fileName,
      ...result,
    };
  });

  evaluated.sort((a, b) => b.atsScore - a.atsScore);
  const best = evaluated[0];

  return {
    atsScore: best.atsScore,
    components: best.components,
    explanation: best.explanation,
    sourceFile: best.fileName,
    evaluatedResumes: evaluated.map((item) => ({
      fileName: item.fileName,
      atsScore: item.atsScore,
    })),
    preprocessing: best.preprocessing,
  };
}

module.exports = {
  computeAtsFromResumes,
  computeSingleResumeAts,
};
