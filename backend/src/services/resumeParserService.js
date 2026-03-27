const { ALLOWED_RESUME_MIME_TYPES } = require("../validators/commonValidators");
const { parsePdf } = require("./parsers/pdfParser");
const { parseDocx } = require("./parsers/docxParser");
const { preprocessText } = require("./preprocessingService");
const { computeExtractionFlags } = require("./diagnosticsService");

const MIME_TO_PARSER = {
  "application/pdf": parsePdf,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": parseDocx,
};

const MAX_RESUME_FILE_SIZE_MB = Number(process.env.MAX_RESUME_FILE_SIZE_MB || 10);
const MAX_RESUME_FILE_SIZE_BYTES = MAX_RESUME_FILE_SIZE_MB * 1024 * 1024;

async function parseResumeFiles(files) {
  const results = [];

  for (const file of files) {
    const base = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
    };

    if (!ALLOWED_RESUME_MIME_TYPES.includes(file.mimetype)) {
      results.push({
        ...base,
        status: "failed",
        errorCode: "INVALID_FILE_FORMAT",
        message: "Only PDF and DOCX files are supported",
      });
      continue;
    }

    if (file.size > MAX_RESUME_FILE_SIZE_BYTES) {
      results.push({
        ...base,
        status: "failed",
        errorCode: "FILE_TOO_LARGE",
        message: `File exceeds ${MAX_RESUME_FILE_SIZE_MB} MB limit`,
      });
      continue;
    }

    const parser = MIME_TO_PARSER[file.mimetype];

    try {
      const parsedText = await parser(file.buffer);
      const preprocessed = preprocessText(parsedText);
      const flags = computeExtractionFlags(preprocessed);

      results.push({
        ...base,
        status: "parsed",
        flags,
        extraction: {
          rawText: preprocessed.rawText,
          cleanedText: preprocessed.cleanedText,
          tokenCount: preprocessed.tokenCount,
          uniqueTokenCount: preprocessed.uniqueTokenCount,
        },
      });
    } catch (_error) {
      results.push({
        ...base,
        status: "failed",
        errorCode: "PARSE_FAILED",
        message: "Unable to extract text from this file",
      });
    }
  }

  return results;
}

module.exports = {
  parseResumeFiles,
};
