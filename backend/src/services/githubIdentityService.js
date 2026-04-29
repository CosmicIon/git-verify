const { AppError } = require("../utils/appError");

const GITHUB_USERNAME_PATTERN = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

function normalizeGithubIdentity(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      message: "GitHub identity is required",
      status: 400,
      details: { field: "githubLink" },
    });
  }

  let username = raw;

  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (host !== "github.com" && host !== "www.github.com") {
      throw new AppError({
        code: "VALIDATION_ERROR",
        message: "GitHub URL must belong to github.com",
        status: 400,
        details: { field: "githubLink", host: url.hostname },
      });
    }

    username = (url.pathname.split("/").filter(Boolean)[0] || "").trim();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
  }

  if (!GITHUB_USERNAME_PATTERN.test(username)) {
    throw new AppError({
      code: "VALIDATION_ERROR",
      message: "GitHub username format is invalid",
      status: 400,
      details: { field: "githubLink", value: raw },
    });
  }

  return username.toLowerCase();
}

module.exports = {
  normalizeGithubIdentity,
};
