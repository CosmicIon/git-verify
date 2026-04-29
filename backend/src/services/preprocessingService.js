const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "or",
  "this",
  "these",
  "those",
]);

function preprocessText(rawText) {
  const normalizedWhitespace = String(rawText || "")
    .replace(/\r/g, "\n")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  const lowered = normalizedWhitespace.toLowerCase();
  const alphanumeric = lowered.replace(/[^a-z0-9\s]/g, " ");

  const tokens = alphanumeric
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1)
    .filter((token) => !STOP_WORDS.has(token));

  return {
    rawText: normalizedWhitespace,
    cleanedText: tokens.join(" "),
    tokens,
    tokenCount: tokens.length,
    uniqueTokenCount: new Set(tokens).size,
  };
}

module.exports = {
  preprocessText,
};
