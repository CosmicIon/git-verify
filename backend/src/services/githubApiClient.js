const { AppError } = require("../utils/appError");
const { warn } = require("../utils/logger");

const BASE_URL = "https://api.github.com";
const DEFAULT_TIMEOUT_MS = Number(process.env.GITHUB_API_TIMEOUT_MS || 8000);
const MAX_RETRIES = Number(process.env.GITHUB_API_RETRIES || 2);
const BASE_BACKOFF_MS = Number(process.env.GITHUB_RETRY_BASE_MS || 250);

function backoffDelay(attempt) {
  const jitter = Math.floor(Math.random() * 100);
  return BASE_BACKOFF_MS * 2 ** attempt + jitter;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const token = process.env.GITHUB_TOKEN || "";
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "git-verify",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

    try {
      const response = await fetch(`${BASE_URL}${path}`, {
        method: options.method || "GET",
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.status === 403 && response.headers.get("x-ratelimit-remaining") === "0") {
        const reset = response.headers.get("x-ratelimit-reset");
        warn("github_api_rate_limited", {
          path,
          reset,
        });
        throw new AppError({
          code: "GITHUB_RATE_LIMITED",
          message: "GitHub API rate limit reached",
          status: 429,
          details: {
            resetEpochSeconds: reset ? Number(reset) : null,
          },
        });
      }

      if (response.status === 404) {
        throw new AppError({
          code: "GITHUB_NOT_FOUND",
          message: "GitHub user not found",
          status: 404,
        });
      }

      if (response.status >= 500 && attempt < MAX_RETRIES) {
        warn("github_api_retry_on_server_error", {
          path,
          status: response.status,
          attempt: attempt + 1,
        });
        await sleep(backoffDelay(attempt));
        continue;
      }

      if (!response.ok) {
        const text = await response.text();
        throw new AppError({
          code: "GITHUB_API_ERROR",
          message: "GitHub API request failed",
          status: 502,
          details: {
            path,
            status: response.status,
            body: text.slice(0, 300),
          },
        });
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeout);
      const normalizedError =
        error instanceof AppError
          ? error
          : new AppError({
              code: "GITHUB_API_ERROR",
              message: "GitHub API request failed",
              status: 502,
              details: {
                path,
                reason: error && error.message ? error.message : "unknown",
              },
            });

      lastError = normalizedError;

      const isAbort = error && error.name === "AbortError";
      const retryable = isAbort || normalizedError.code === "GITHUB_API_ERROR";

      if (!retryable || attempt >= MAX_RETRIES) {
        throw normalizedError;
      }

      warn("github_api_retry", {
        path,
        attempt: attempt + 1,
        reason: normalizedError.code || error.name || "unknown",
      });

      await sleep(backoffDelay(attempt));
    }
  }

  throw lastError;
}

async function fetchUser(username) {
  return request(`/users/${encodeURIComponent(username)}`);
}

async function fetchRepos(username, page = 1, perPage = 50) {
  return request(
    `/users/${encodeURIComponent(username)}/repos?sort=updated&direction=desc&page=${page}&per_page=${perPage}`
  );
}

async function fetchEvents(username, page = 1, perPage = 100) {
  return request(
    `/users/${encodeURIComponent(username)}/events/public?page=${page}&per_page=${perPage}`
  );
}

module.exports = {
  fetchUser,
  fetchRepos,
  fetchEvents,
};
