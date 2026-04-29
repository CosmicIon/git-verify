const { AppError } = require("../utils/appError");

const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
const ALLOWED_RESUME_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidGithubIdentity(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const trimmed = value.trim();

  try {
    const maybeUrl = new URL(trimmed);
    if (maybeUrl.hostname.toLowerCase() !== "github.com") {
      return false;
    }

    const username = maybeUrl.pathname.split("/").filter(Boolean)[0] || "";
    return GITHUB_USERNAME_PATTERN.test(username);
  } catch (_error) {
    return GITHUB_USERNAME_PATTERN.test(trimmed);
  }
}

function toPositiveInteger(value, fallback) {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

function isValidEntityId(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const normalized = String(value).trim();
  const asNumber = Number(normalized);
  const isPositiveInteger = Number.isInteger(asNumber) && asNumber > 0;
  const isObjectId = /^[a-f\d]{24}$/i.test(normalized);

  return isPositiveInteger || isObjectId;
}

function assertOrThrow(condition, spec) {
  if (!condition) {
    throw new AppError(spec);
  }
}

module.exports = {
  ALLOWED_RESUME_MIME_TYPES,
  assertOrThrow,
  isValidEntityId,
  isNonEmptyString,
  isValidGithubIdentity,
  toPositiveInteger,
};
