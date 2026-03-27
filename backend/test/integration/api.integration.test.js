const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../../src/app");

function createMockResponse({ status = 200, jsonBody = {}, headers = {} }) {
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: {
      get(name) {
        return headers[String(name).toLowerCase()] || null;
      },
    },
    async json() {
      return jsonBody;
    },
    async text() {
      return JSON.stringify(jsonBody);
    },
  };
}

function installGithubFetchMock() {
  global.fetch = async (url) => {
    const target = String(url);

    if (target.includes("/users/") && !target.includes("/repos") && !target.includes("/events")) {
      return createMockResponse({
        jsonBody: {
          public_repos: 4,
          followers: 2,
          created_at: "2023-01-01T00:00:00.000Z",
        },
      });
    }

    if (target.includes("/repos")) {
      return createMockResponse({
        jsonBody: [
          {
            language: "JavaScript",
            stargazers_count: 12,
            forks_count: 2,
            updated_at: "2026-03-01T00:00:00.000Z",
            topics: ["node", "api"],
          },
        ],
      });
    }

    if (target.includes("/events")) {
      return createMockResponse({
        jsonBody: [
          {
            type: "PushEvent",
            created_at: new Date().toISOString(),
            payload: { size: 3 },
          },
        ],
      });
    }

    return createMockResponse({ status: 404, jsonBody: {} });
  };
}

const app = createApp();

test.beforeEach(() => {
  installGithubFetchMock();
  process.env.ALLOWED_ORIGINS = "http://localhost:4173,http://localhost:3000";
  process.env.API_RATE_LIMIT_PER_MINUTE = "500";
});

test("Upload -> Score -> Rankings happy path works", async () => {
  const uploadRes = await request(app)
    .post("/api/v1/upload")
    .field("githubLink", "https://github.com/octocat")
    .field("jobDescription", "Need node express mongodb testing ci docker backend engineering skills")
    .attach("resumes", Buffer.from("%PDF-1.4 fake"), {
      filename: "candidate.pdf",
      contentType: "application/pdf",
    });

  assert.equal(uploadRes.statusCode, 201);
  assert.equal(uploadRes.body.success, true);

  const candidateId = uploadRes.body.data.candidateId;

  const scoreRes = await request(app)
    .post("/api/v1/score")
    .send({
      candidateId,
      jobDescription: "Need node express mongodb testing ci docker backend engineering skills",
      resumeText: "Built node express services with mongodb tests in ci docker pipelines",
    });

  assert.equal(scoreRes.statusCode, 200);
  assert.equal(typeof scoreRes.body.data.atsScore, "number");
  assert.equal(typeof scoreRes.body.data.githubScore, "number");
  assert.equal(typeof scoreRes.body.data.finalScore, "number");

  const rankingsRes = await request(app).get("/api/v1/rankings?page=1&limit=5");
  assert.equal(rankingsRes.statusCode, 200);
  assert.ok(Array.isArray(rankingsRes.body.data.items));
  assert.ok(rankingsRes.body.data.items.length >= 1);
});

test("Upload rejects extension mismatch even when MIME says PDF", async () => {
  const response = await request(app)
    .post("/api/v1/upload")
    .field("githubLink", "https://github.com/octocat")
    .field("jobDescription", "Need node express mongodb testing ci docker backend engineering skills")
    .attach("resumes", Buffer.from("fake payload"), {
      filename: "resume.docx",
      contentType: "application/pdf",
    });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.error.code, "INVALID_FILE_EXTENSION");
});

test("Score request validates github link format", async () => {
  const uploadRes = await request(app)
    .post("/api/v1/upload")
    .field("githubLink", "https://github.com/octocat")
    .field("jobDescription", "Need node express mongodb testing ci docker backend engineering skills")
    .attach("resumes", Buffer.from("%PDF-1.4 fake"), {
      filename: "candidate.pdf",
      contentType: "application/pdf",
    });

  const candidateId = uploadRes.body.data.candidateId;

  const response = await request(app)
    .post("/api/v1/score")
    .send({
      candidateId,
      githubLink: "https://example.com/notgithub",
      resumeText: "Built node express services with mongodb tests in ci docker pipelines",
      jobDescription: "Need node express mongodb testing ci docker backend engineering skills",
    });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error.code, "VALIDATION_ERROR");
});

test("Scoring fails when no parsed resume and no inline resume fallback", async () => {
  const uploadRes = await request(app)
    .post("/api/v1/upload")
    .field("githubLink", "https://github.com/octocat")
    .field("jobDescription", "Need node express mongodb testing ci docker backend engineering skills")
    .attach("resumes", Buffer.from("broken pdf"), {
      filename: "broken.pdf",
      contentType: "application/pdf",
    });

  const candidateId = uploadRes.body.data.candidateId;

  const response = await request(app)
    .post("/api/v1/score")
    .send({
      candidateId,
      jobDescription: "Need node express mongodb testing ci docker backend engineering skills",
    });

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.error.code, "ATS_INPUT_ERROR");
});
