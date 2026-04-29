const test = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { JSDOM } = require("jsdom");

const appScriptPath = path.join(__dirname, "..", "src", "app.js");
const htmlPath = path.join(__dirname, "..", "src", "index.html");

function setupDom() {
  const html = fs.readFileSync(htmlPath, "utf8");
  const dom = new JSDOM(html, {
    url: "http://localhost:4173",
  });

  global.window = dom.window;
  global.document = dom.window.document;
  global.HTMLElement = dom.window.HTMLElement;
  global.Event = dom.window.Event;
  global.FormData = dom.window.FormData;
  global.File = dom.window.File;

  const candidateForm = dom.window.document.getElementById("candidate-form");
  const filtersForm = dom.window.document.getElementById("filters-form");

  Object.defineProperty(candidateForm, "githubLink", {
    configurable: true,
    value: dom.window.document.getElementById("githubLink"),
  });
  Object.defineProperty(candidateForm, "jobDescription", {
    configurable: true,
    value: dom.window.document.getElementById("jobDescription"),
  });
  Object.defineProperty(candidateForm, "jobId", {
    configurable: true,
    value: dom.window.document.getElementById("jobId"),
  });
  Object.defineProperty(candidateForm, "resumes", {
    configurable: true,
    value: dom.window.document.getElementById("resumes"),
  });

  Object.defineProperty(filtersForm, "sortBy", {
    configurable: true,
    value: dom.window.document.getElementById("sortBy"),
  });
  Object.defineProperty(filtersForm, "direction", {
    configurable: true,
    value: dom.window.document.getElementById("direction"),
  });
  Object.defineProperty(filtersForm, "flaggedOnly", {
    configurable: true,
    value: dom.window.document.getElementById("flaggedOnly"),
  });
  Object.defineProperty(filtersForm, "minFinalScore", {
    configurable: true,
    value: dom.window.document.getElementById("minFinalScore"),
  });

  return dom;
}

function installFetchMock() {
  const calls = [];

  global.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    const target = String(url);

    if (target.startsWith("/api/v1/rankings")) {
      return {
        ok: true,
        async json() {
          return {
            success: true,
            data: {
              items: [
                {
                  id: "1",
                  rank: 1,
                  githubUsername: "octocat",
                  atsScore: 0.8,
                  githubScore: 0.7,
                  finalScore: 0.75,
                  confidenceScore: 0.9,
                  flags: [],
                  atsDetails: {
                    explanation: {
                      topMatchedSkills: ["node"],
                      missingRequiredSkills: ["redis"],
                    },
                  },
                  githubDetails: {
                    reasonCodes: ["LOW_ACTIVITY"],
                  },
                },
              ],
            },
            meta: {
              page: 1,
              total: 1,
            },
          };
        },
      };
    }

    if (target === "/api/v1/upload") {
      return {
        ok: true,
        async json() {
          return {
            success: true,
            data: {
              candidateId: "1",
            },
          };
        },
      };
    }

    if (target === "/api/v1/score") {
      return {
        ok: true,
        async json() {
          return {
            success: true,
            data: {
              candidateId: "1",
              finalScore: 0.75,
            },
          };
        },
      };
    }

    return {
      ok: false,
      async json() {
        return { success: false, error: { message: "Unexpected call" } };
      },
    };
  };

  return calls;
}

function cleanupDom(dom) {
  dom.window.close();
  delete global.window;
  delete global.document;
  delete global.HTMLElement;
  delete global.Event;
  delete global.FormData;
  delete global.File;
  delete global.fetch;
  delete require.cache[appScriptPath];
}

test("Form validation shows error for missing github input", async () => {
  const dom = setupDom();
  installFetchMock();
  require(appScriptPath);

  const form = document.getElementById("candidate-form");
  form.querySelector("#jobDescription").value =
    "Need node express mongodb testing ci docker backend engineering skills";

  form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));

  const status = document.getElementById("form-status").textContent;
  assert.match(status, /GitHub link\/username is required/);

  await new Promise((resolve) => setTimeout(resolve, 10));

  cleanupDom(dom);
});

test("Upload submit triggers upload and score calls, then updates status", async () => {
  const dom = setupDom();
  const calls = installFetchMock();
  require(appScriptPath);

  const form = document.getElementById("candidate-form");
  form.querySelector("#githubLink").value = "https://github.com/octocat";
  form.querySelector("#jobDescription").value =
    "Need node express mongodb testing ci docker backend engineering skills";

  const fakeFile = new File(["resume content"], "resume.pdf", { type: "application/pdf" });
  const fileInput = form.querySelector("#resumes");
  Object.defineProperty(fileInput, "files", {
    configurable: true,
    value: [fakeFile],
  });

  form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));

  await new Promise((resolve) => setTimeout(resolve, 60));

  assert.ok(calls.find((call) => call.url === "/api/v1/upload"));
  assert.ok(calls.find((call) => call.url === "/api/v1/score"));

  const status = document.getElementById("form-status").textContent;
  assert.match(status, /Candidate 1 scored/);

  const rows = document.querySelectorAll("#rankings-body tr");
  assert.ok(rows.length >= 1);

  cleanupDom(dom);
});
