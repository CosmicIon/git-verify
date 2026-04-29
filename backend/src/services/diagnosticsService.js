function computeExtractionFlags(preprocessed) {
  const flags = [];

  const rawLength = preprocessed.rawText.length;
  const tokenCount = preprocessed.tokenCount;
  const uniqueRatio = tokenCount === 0 ? 0 : preprocessed.uniqueTokenCount / tokenCount;
  const oddCharMatches = preprocessed.rawText.match(/[^a-zA-Z0-9\s.,;:!?()-]/g) || [];
  const oddCharRatio = rawLength === 0 ? 0 : oddCharMatches.length / rawLength;

  if (rawLength === 0 || tokenCount < 20) {
    flags.push("EMPTY_RESUME_TEXT");
  }

  if (oddCharRatio > 0.08 || (tokenCount >= 30 && uniqueRatio < 0.2)) {
    flags.push("LOW_TEXT_QUALITY");
  }

  return flags;
}

module.exports = {
  computeExtractionFlags,
};
