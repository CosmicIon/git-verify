# GitVerify Detailed Project TODO

This TODO consolidates all tasks inferred from:
- `README.md`
- `docs/prd.md`
- `docs/design-doc.md`
- `docs/tech-stack.md`
- `docs/info.md`

Current reported progress from project docs: 60-70%.
This file turns requirements into execution-ready tasks with detailed scope.

## How To Use This TODO

- Status legend: `[ ]` not started, `[~]` in progress, `[x]` complete, `[!]` blocked
- Priority legend: `P0` critical, `P1` high, `P2` medium, `P3` low
- Update owner/date on each task as work progresses
- Keep evidence links (PRs, screenshots, test reports) under each completed task

---

## Phase 0: Foundation, Scope Lock, and Planning

### [x] T0.1 Finalize product scope and MVP boundaries (P0)
Owner: Team Lead  
Dependencies: None

Status update:
- Completed on 2026-03-27
- Artifact: `docs/mvp-scope.md`

Description:
- Convert PRD features into explicit MVP vs post-MVP scope.
- Define what "done" means for initial release.
- Freeze initial feature list to avoid scope creep.

Subtasks:
- List in-scope MVP features:
  - Resume upload and parsing (PDF/DOCX)
  - Job description input
  - ATS score generation
  - GitHub profile analysis
  - Claim verification flags
  - Final ranking dashboard
- List out-of-scope items for v1:
  - LinkedIn verification
  - Advanced transformer-based model in production
  - Microservices split
  - Real-time streaming analytics
- Define measurable MVP success criteria.

Deliverables:
- Scope section in project docs (or a new `docs/mvp-scope.md`).

Acceptance criteria:
- MVP and non-MVP lists are documented and approved.
- Every major feature has a one-line success metric.

---

### [x] T0.2 Create execution roadmap with milestones (P0)
Owner: Team Lead  
Dependencies: T0.1

Status update:
- Completed on 2026-03-27
- Artifact: `docs/roadmap.md`

Description:
- Build an implementation sequence with realistic checkpoints.

Subtasks:
- Define milestones:
  - M1 Backend API baseline
  - M2 Parsing + ATS quality baseline
  - M3 GitHub scoring + verification
  - M4 Ranking + persistence
  - M5 Dashboard + integration
  - M6 Testing + hardening + demo
- Assign expected completion dates.
- Define milestone-level exit criteria.

Deliverables:
- `docs/roadmap.md` or equivalent planning section.

Acceptance criteria:
- Milestones have owners, target dates, and measurable outputs.

---

### [x] T0.3 Set up project management tracking board (P1)
Owner: Team Lead  
Dependencies: T0.2

Status update:
- Completed on 2026-03-27
- Artifact: `docs/tracking-board.md`

Description:
- Track implementation progress transparently.

Subtasks:
- Create backlog columns: Backlog, In Progress, Review, Blocked, Done.
- Convert this TODO into issue cards.
- Link cards to commits/PRs.

Deliverables:
- Active board with all major tasks mapped.

Acceptance criteria:
- 100% of P0/P1 tasks exist as trackable items.

---

## Phase 1: Repository and Environment Setup

### [x] T1.1 Define canonical project structure (P0)
Owner: Team Lead  
Dependencies: T0.1

Status update:
- Completed on 2026-03-27
- Artifacts: `docs/project-structure.md`, `backend/`, `frontend/`, `tests/`, `config/`, `scripts/`

Description:
- Establish clean folders for backend, frontend, docs, tests, and config.

Subtasks:
- Ensure clear root layout (example):
  - `backend/`
  - `frontend/`
  - `docs/`
  - `tests/`
- Add architecture map in docs.

Deliverables:
- Documented folder structure and rationale.

Acceptance criteria:
- New contributors can understand where each module lives in under 5 minutes.

---

### [x] T1.2 Standardize environment configuration and secrets handling (P0)
Owner: Team Lead  
Dependencies: T1.1

Status update:
- Completed on 2026-03-27
- Artifacts: `.env.example`, `.gitignore`, `README.md`

Description:
- Securely configure runtime variables.

Subtasks:
- Define required env vars:
  - `PORT`
  - `MONGODB_URI`
  - `GITHUB_TOKEN` (optional but recommended)
  - `NODE_ENV`
  - scoring and rate-limit settings
- Add `.env.example` with placeholders.
- Ensure `.env` is gitignored.

Deliverables:
- `.env.example` and setup instructions.

Acceptance criteria:
- App can be configured without hardcoded secrets.
- No secrets appear in repository history.

---

### [x] T1.3 Initialize dependency management and scripts (P0)
Owner: Team Lead  
Dependencies: T1.1

Status update:
- Completed on 2026-03-27
- Artifacts: `package.json`, `backend/package.json`, `frontend/package.json`
- Validation: `npm install`, `npm run lint`, `npm run test`, `npm run start`

Description:
- Ensure repeatable local setup and run commands.

Subtasks:
- Define npm scripts:
  - `dev`
  - `start`
  - `test`
  - `lint`
  - `format`
- Pin key package versions where necessary.

Deliverables:
- Working package scripts and setup documentation.

Acceptance criteria:
- New setup works with only install + run instructions.

---

### [x] T1.4 Add baseline developer quality tooling (P1)
Owner: Team Lead  
Dependencies: T1.3

Status update:
- Completed on 2026-03-27
- Artifacts: `.eslintrc.cjs`, `.prettierrc.json`, `.prettierignore`, `.editorconfig`, `docs/development-workflow.md`, `scripts/pre-commit.sample`

Description:
- Reduce regressions and maintain consistent code quality.

Subtasks:
- Configure linter and formatter.
- Add pre-commit checks for lint/test where feasible.
- Add basic commit conventions.

Deliverables:
- Config files and usage docs.

Acceptance criteria:
- Lint command runs clean on baseline branch.

---

## Phase 2: Backend API Core (Node.js + Express)

### [ ] T2.1 Build Express app skeleton with layered architecture (P0)
Owner: Team Lead  
Dependencies: T1.3

Description:
- Establish stable architecture for growth.

Subtasks:
- Create layers: routes, controllers, services, repositories, utils.
- Add global middleware pipeline.
- Add health endpoint `/api/health`.

Deliverables:
- Running backend skeleton with layered module boundaries.

Acceptance criteria:
- API starts cleanly and health endpoint responds consistently.

---

### [ ] T2.2 Implement global error handling and response contracts (P0)
Owner: Team Lead  
Dependencies: T2.1

Description:
- Return predictable JSON for success/errors.

Subtasks:
- Standardize error payload shape:
  - code
  - message
  - details
  - traceId (optional)
- Add 404 and method-not-allowed handlers.
- Centralize async error capture.

Deliverables:
- Shared response and error middleware.

Acceptance criteria:
- All endpoints return consistent structure for both success and failure.

---

### [ ] T2.3 Add input validation for all public endpoints (P0)
Owner: Team Lead  
Dependencies: T2.1

Description:
- Reject malformed input early.

Subtasks:
- Validate upload payloads and MIME types.
- Validate GitHub URL/username format.
- Validate job description minimum length.
- Validate pagination/query params.

Deliverables:
- Validation middleware/schema files.

Acceptance criteria:
- Invalid requests are rejected with actionable validation errors.

---

### [ ] T2.4 Implement API versioning and route organization (P1)
Owner: Team Lead  
Dependencies: T2.1

Description:
- Future-proof API evolution.

Subtasks:
- Group under `/api/v1/...`.
- Keep old alias routes only if needed for compatibility.

Deliverables:
- Versioned route tree.

Acceptance criteria:
- All documented APIs available under one version namespace.

---

## Phase 3: Resume Upload and Parsing Pipeline

### [ ] T3.1 Implement robust file upload pipeline (P0)
Owner: Team Lead  
Dependencies: T2.3

Description:
- Support multi-file resume upload with safety checks.

Subtasks:
- Configure Multer storage and limits.
- Restrict accepted formats to PDF/DOCX.
- Enforce max file size and max files per request.
- Return clear per-file status on failures.

Deliverables:
- Upload endpoint and middleware chain.

Acceptance criteria:
- Valid files accepted, invalid files rejected with explicit reason.

---

### [ ] T3.2 Build parser adapters for PDF and DOCX (P0)
Owner: Team Lead  
Dependencies: T3.1

Description:
- Extract text reliably across file formats.

Subtasks:
- Create parser interface and format-specific adapters.
- Normalize whitespace and encoding artifacts.
- Handle extraction failures gracefully.

Deliverables:
- Parsing service with adapter abstraction.

Acceptance criteria:
- Sample PDF/DOCX resumes are parsed into usable text.

---

### [ ] T3.3 Implement text preprocessing pipeline (P0)
Owner: Team Lead  
Dependencies: T3.2

Description:
- Prepare resume and JD text for scoring.

Subtasks:
- Tokenization
- Lowercasing/normalization
- Stop-word removal
- Optional lemmatization/stemming toggle
- Keep raw and cleaned text for auditability

Deliverables:
- Reusable preprocessing utility module.

Acceptance criteria:
- Pipeline outputs stable token set for equivalent text inputs.

---

### [ ] T3.4 Add extraction quality diagnostics and flags (P1)
Owner: Team Lead  
Dependencies: T3.2

Description:
- Identify low-quality or empty extraction early.

Subtasks:
- Detect nearly empty text.
- Detect heavy OCR noise patterns.
- Add `flags` values such as `EMPTY_RESUME_TEXT`, `LOW_TEXT_QUALITY`.

Deliverables:
- Parsing diagnostics report in API response or persisted record.

Acceptance criteria:
- Poor extraction cases are flagged, not silently scored as normal.

---

## Phase 4: ATS Scoring Engine (NLP/ML)

### [ ] T4.1 Implement TF-IDF scoring module (P0)
Owner: Team Lead  
Dependencies: T3.3

Description:
- Build baseline keyword-weighted relevance scoring.

Subtasks:
- Fit/transform resume + job description vectors.
- Compute cosine similarity for TF-IDF vectors.
- Normalize output to a 0-1 score.

Deliverables:
- Deterministic TF-IDF similarity scorer.

Acceptance criteria:
- Higher keyword overlap yields higher score in test fixtures.

---

### [ ] T4.2 Implement embedding-based semantic scorer (P1)
Owner: Team Lead  
Dependencies: T3.3

Description:
- Improve beyond exact keyword matching.

Subtasks:
- Select embedding provider/library suitable for Node.js.
- Generate embeddings for resume/JD text.
- Compute cosine similarity in embedding space.
- Add fallback when embedding service is unavailable.

Deliverables:
- Semantic similarity module with fallback behavior.

Acceptance criteria:
- Semantically similar text receives stronger score than pure keyword baseline in selected cases.

---

### [ ] T4.3 Calibrate weighted ATS formula (P0)
Owner: Team Lead  
Dependencies: T4.1, T4.2

Description:
- Implement formula from docs:
  - ATS = alpha * TFIDF + beta * Embedding

Subtasks:
- Externalize `alpha`, `beta` in config.
- Ensure `alpha + beta = 1` validation.
- Provide default calibrated values.

Deliverables:
- Configurable ATS score combiner.

Acceptance criteria:
- Score always bounded in [0,1] and reproducible for same input.

---

### [ ] T4.4 Build ATS explainability payload (P1)
Owner: Team Lead  
Dependencies: T4.3

Description:
- Improve transparency for recruiters.

Subtasks:
- Return top matched skill terms.
- Return missing required skill hints.
- Include component contributions (TF-IDF vs embedding).

Deliverables:
- Explainability block in scoring response/dashboard data.

Acceptance criteria:
- Recruiter can understand why a candidate got a score.

---

## Phase 5: GitHub Analysis and Verification Engine

### [ ] T5.1 Implement GitHub identity parsing and normalization (P0)
Owner: Team Lead  
Dependencies: T2.3

Description:
- Normalize user input into a valid GitHub username.

Subtasks:
- Accept full GitHub URLs and plain usernames.
- Validate account string format.
- Detect and report malformed links.

Deliverables:
- Input normalization utility with tests.

Acceptance criteria:
- Supported profile formats map to one canonical username.

---

### [ ] T5.2 Build GitHub API client with retry and rate-limit awareness (P0)
Owner: Team Lead  
Dependencies: T5.1

Description:
- Make API access resilient and traceable.

Subtasks:
- Add request wrapper with timeout.
- Handle 403 rate-limit responses gracefully.
- Add retry for transient failures.
- Support authenticated token mode.

Deliverables:
- Reusable GitHub client service.

Acceptance criteria:
- Rate limit and transient error behavior is predictable and logged.

---

### [ ] T5.3 Collect candidate GitHub metrics (P0)
Owner: Team Lead  
Dependencies: T5.2

Description:
- Extract key data dimensions required by design docs.

Subtasks:
- Pull repositories (public metadata).
- Aggregate language usage.
- Estimate commit/contribution activity from available endpoints.
- Capture recency windows (e.g., last 90 days).

Deliverables:
- Structured GitHub metrics object.

Acceptance criteria:
- Metrics object contains all required fields for scoring formula.

---

### [ ] T5.4 Implement GitHub component scoring modules (P0)
Owner: Team Lead  
Dependencies: T5.3

Description:
- Implement scored dimensions from `docs/info.md`.

Subtasks:
- Activity score
- Language relevance score
- Repository quality score
- Consistency score
- Verification score (resume claims vs observed evidence)

Deliverables:
- Modular score calculators for each component.

Acceptance criteria:
- Each score returns normalized value with clear formula implementation.

---

### [ ] T5.5 Implement final GitHub weighted scoring formula (P0)
Owner: Team Lead  
Dependencies: T5.4

Description:
- Combine component scores:
  - GitHub Score = alpha*A + beta*L + gamma*Q + delta*C + epsilon*V

Subtasks:
- Externalize weights in config.
- Validate sum of weights equals 1.
- Provide reason codes for unusually low score.

Deliverables:
- Stable GitHub score combiner.

Acceptance criteria:
- Score output bounded to [0,1], deterministic, and explainable.

---

### [ ] T5.6 Build skill-claim inconsistency detector (P0)
Owner: Team Lead  
Dependencies: T5.4

Description:
- Flag mismatch between resume claims and GitHub evidence.

Subtasks:
- Extract claimed skills from resume text.
- Map claimed skills to observed GitHub language/project signals.
- Flag mismatches with severity levels.

Deliverables:
- Verification flag engine with rule set.

Acceptance criteria:
- Candidates with unsupported strong claims are visibly flagged.

---

## Phase 6: Final Scoring and Ranking

### [ ] T6.1 Implement final candidate score calculation (P0)
Owner: Team Lead  
Dependencies: T4.3, T5.5

Description:
- Combine ATS and GitHub scores:
  - Final = lambda * ATS + (1-lambda) * GitHub

Subtasks:
- Externalize lambda.
- Add guardrails for missing GitHub data.
- Add fallback policy when one component unavailable.

Deliverables:
- Final scoring service.

Acceptance criteria:
- Final score always produced or explicitly marked unavailable with reason.

---

### [ ] T6.2 Implement ranking engine and tie-break logic (P0)
Owner: Team Lead  
Dependencies: T6.1

Description:
- Produce stable candidate ordering.

Subtasks:
- Sort by final score descending.
- Tie-break by GitHub score, then ATS score, then recency.
- Assign rank numbers.

Deliverables:
- Ranking module.

Acceptance criteria:
- Ranking output deterministic across repeated runs on same dataset.

---

### [ ] T6.3 Add confidence score and ranking audit metadata (P1)
Owner: Team Lead  
Dependencies: T6.2

Description:
- Improve trust in ranking decisions.

Subtasks:
- Add confidence metric based on data completeness.
- Store scoring timestamp and model/config version.

Deliverables:
- Audit metadata in candidate result model.

Acceptance criteria:
- Every ranking entry includes enough metadata for traceability.

---

## Phase 7: Database and Persistence (MongoDB)

### [ ] T7.1 Design and implement Mongoose schemas (P0)
Owner: Team Lead  
Dependencies: T1.2

Description:
- Persist candidates, jobs, and computed results.

Subtasks:
- Create `Candidate` schema aligned with design docs.
- Create `Job` schema with required skills/JD text.
- Add created/updated timestamps.

Deliverables:
- Mongoose models for key entities.

Acceptance criteria:
- CRUD operations succeed for candidate and job data.

---

### [ ] T7.2 Add indexes for query performance (P1)
Owner: Team Lead  
Dependencies: T7.1

Description:
- Optimize common reads/writes.

Subtasks:
- Index on `githubUsername`, `email`, `createdAt`, and ranking query fields.
- Validate index impact on expected data volume.

Deliverables:
- Indexed schema definitions.

Acceptance criteria:
- Ranking and lookup queries show acceptable response time.

---

### [ ] T7.3 Implement repository/data access layer (P1)
Owner: Team Lead  
Dependencies: T7.1

Description:
- Keep DB logic isolated from business logic.

Subtasks:
- Add candidate repository methods.
- Add job repository methods.
- Add update patterns for score recomputation.

Deliverables:
- Repository classes/modules.

Acceptance criteria:
- Service layer does not directly depend on raw model queries.

---

## Phase 8: Public API Completion

### [ ] T8.1 Implement upload API contract (P0)
Owner: Team Lead  
Dependencies: T3.1, T7.1

Description:
- Complete `POST /api/upload` according to design docs.

Subtasks:
- Accept resume file + GitHub link + optional job reference.
- Persist candidate draft record.
- Return upload status and candidate ID.

Deliverables:
- Production-ready upload endpoint.

Acceptance criteria:
- Endpoint handles valid/invalid inputs with documented responses.

---

### [ ] T8.2 Implement score computation API (P0)
Owner: Team Lead  
Dependencies: T4.3, T5.5, T6.1

Description:
- Complete `POST /api/score` and compute ATS, GitHub, final score.

Subtasks:
- Trigger parsing/scoring pipeline.
- Persist results and flags.
- Return explainable response payload.

Deliverables:
- Score endpoint with full pipeline integration.

Acceptance criteria:
- Response includes `atsScore`, `githubScore`, `finalScore`, and flags.

---

### [ ] T8.3 Implement rankings API (P0)
Owner: Team Lead  
Dependencies: T6.2, T7.3

Description:
- Complete `GET /api/rankings`.

Subtasks:
- Add pagination and sorting controls.
- Include optional filters (minimum score, flagged only, etc.).
- Return rank, key scores, and warning flags.

Deliverables:
- Rankings endpoint with query support.

Acceptance criteria:
- Endpoint returns stable ranking data with pagination metadata.

---

### [ ] T8.4 Add API documentation (OpenAPI/Postman) (P1)
Owner: Team Lead  
Dependencies: T8.1, T8.2, T8.3

Description:
- Ensure APIs are consumable by frontend and external reviewers.

Subtasks:
- Document request/response schemas.
- Include error examples for common failures.
- Publish test collection.

Deliverables:
- API docs and importable Postman collection.

Acceptance criteria:
- Another developer can test all endpoints without source-code deep dive.

---

## Phase 9: Frontend Dashboard and UX

### [ ] T9.1 Build recruiter input workflow UI (P0)
Owner: Team Lead  
Dependencies: T8.1

Description:
- Provide input form for resumes, GitHub links, and job description.

Subtasks:
- Multi-resume upload UI.
- GitHub link input with inline validation.
- Job description input area.
- Submission progress and error states.

Deliverables:
- Input screen connected to upload/score APIs.

Acceptance criteria:
- Recruiter can submit candidate data end-to-end from UI.

---

### [ ] T9.2 Build candidate results table with ranking view (P0)
Owner: Team Lead  
Dependencies: T8.3

Description:
- Visualize ranking output clearly.

Subtasks:
- Show rank, candidate name, ATS score, GitHub score, final score.
- Add sort and search.
- Highlight top candidates.

Deliverables:
- Ranking dashboard page.

Acceptance criteria:
- Ranking list is readable, sortable, and aligns with API values.

---

### [ ] T9.3 Add verification flags and explainability panels (P1)
Owner: Team Lead  
Dependencies: T8.2, T8.3

Description:
- Make decisions transparent for recruiters.

Subtasks:
- Show flags with severity badge.
- Expand row/modal for score breakdown.
- Show missing skill signals and claim mismatch notes.

Deliverables:
- Explainability UI components.

Acceptance criteria:
- Recruiter can understand why candidates are flagged or ranked lower.

---

### [ ] T9.4 Ensure responsive and accessible UI baseline (P1)
Owner: Team Lead  
Dependencies: T9.1, T9.2

Description:
- Keep dashboard usable across devices.

Subtasks:
- Mobile layout checks.
- Keyboard navigation for key controls.
- Color contrast and readable typography.

Deliverables:
- Accessibility and responsiveness fixes.

Acceptance criteria:
- Core flow works on desktop and mobile without layout breakage.

---

## Phase 10: Security, Reliability, and Operational Hardening

### [ ] T10.1 Strengthen upload security and sanitization (P0)
Owner: Team Lead  
Dependencies: T3.1

Description:
- Prevent abuse through file handling paths.

Subtasks:
- MIME + extension validation.
- Size/rate limits.
- Temporary file cleanup policy.
- Avoid arbitrary file path usage.

Deliverables:
- Hardened upload pipeline.

Acceptance criteria:
- Unsafe files and invalid upload patterns are blocked reliably.

---

### [ ] T10.2 Add API security middleware (P0)
Owner: Team Lead  
Dependencies: T2.1

Description:
- Protect backend against common web threats.

Subtasks:
- Add secure headers middleware.
- Add CORS policy.
- Add request rate limiting.
- Add request size restrictions.

Deliverables:
- Security middleware stack.

Acceptance criteria:
- Security headers and request controls verified in API responses.

---

### [ ] T10.3 Add resilience for third-party failures (P0)
Owner: Team Lead  
Dependencies: T5.2

Description:
- Ensure graceful behavior when GitHub API fails.

Subtasks:
- Retry/backoff policy.
- Fallback scoring behavior.
- User-facing "partial data" explanation.

Deliverables:
- Failure handling playbook in code and docs.

Acceptance criteria:
- Pipeline does not crash on GitHub outage or rate-limit scenarios.

---

### [ ] T10.4 Implement structured logging and request tracing (P1)
Owner: Team Lead  
Dependencies: T2.2

Description:
- Improve debuggability and production support.

Subtasks:
- Add request IDs.
- Log key pipeline stages and failures.
- Avoid logging sensitive data.

Deliverables:
- Structured logs for critical workflows.

Acceptance criteria:
- Troubleshooting a failed scoring request is possible via logs.

---

## Phase 11: Testing and Validation

### [ ] T11.1 Unit tests for parsing, scoring, and ranking modules (P0)
Owner: Team Lead  
Dependencies: T3.3, T4.3, T5.5, T6.2

Description:
- Validate core business logic correctness.

Subtasks:
- Parser tests for PDF/DOCX text extraction edge cases.
- ATS formula tests.
- GitHub score formula tests.
- Final ranking and tie-break tests.

Deliverables:
- Unit test suite with meaningful coverage.

Acceptance criteria:
- Core modules have passing tests and stable deterministic outputs.

---

### [ ] T11.2 API integration tests for end-to-end flow (P0)
Owner: Team Lead  
Dependencies: T8.1, T8.2, T8.3

Description:
- Test full request pipeline against real API routes.

Subtasks:
- Upload -> score -> ranking scenario tests.
- Error path tests (invalid file, invalid GitHub profile, empty resume).

Deliverables:
- Integration test suite.

Acceptance criteria:
- Happy path and critical failure paths covered and passing.

---

### [ ] T11.3 Regression dataset validation and score sanity checks (P1)
Owner: Team Lead  
Dependencies: T11.1

Description:
- Ensure score behavior stays stable across code changes.

Subtasks:
- Build representative sample candidate dataset.
- Define expected relative ranking outcomes.
- Track drift over iterations.

Deliverables:
- Baseline validation report.

Acceptance criteria:
- Ranking quality remains consistent across releases.

---

### [ ] T11.4 Frontend testing for critical user journeys (P1)
Owner: Team Lead  
Dependencies: T9.1, T9.2

Description:
- Protect recruiter workflow from UI regressions.

Subtasks:
- Test form submission and error handling.
- Test ranking table rendering and sorting.
- Test explainability/flag display.

Deliverables:
- Frontend test coverage for primary flow.

Acceptance criteria:
- Core recruiter actions are covered by automated tests.

---

## Phase 12: Documentation and Delivery

### [ ] T12.1 Update README with setup, architecture, and runbook (P0)
Owner: Team Lead  
Dependencies: T1.2, T8.4

Description:
- Make repository easy to run and evaluate.

Subtasks:
- Add prerequisites.
- Add backend/frontend startup steps.
- Add environment variable section.
- Add architecture summary and API links.

Deliverables:
- Production-grade README.

Acceptance criteria:
- New evaluator can run project from README alone.

---

### [ ] T12.2 Publish model/scoring documentation (P1)
Owner: Team Lead  
Dependencies: T4.3, T5.5, T6.1

Description:
- Document formulas, assumptions, and tuning decisions.

Subtasks:
- ATS component explanation.
- GitHub component explanation.
- Final score weighting explanation.
- Known limitations and bias/fairness caveats.

Deliverables:
- Dedicated scoring docs page.

Acceptance criteria:
- Scoring logic is understandable to non-implementers.

---

### [ ] T12.3 Create demo script and evaluation checklist (P1)
Owner: Team Lead  
Dependencies: T9.3, T11.2

Description:
- Prepare for viva/demo and stakeholder walkthrough.

Subtasks:
- Define scripted scenario with sample candidates.
- Include expected outcomes and talking points.
- Include innovation statement and known constraints.

Deliverables:
- Demo runbook in docs.

Acceptance criteria:
- Team can execute a consistent end-to-end demo in one pass.

---

## Phase 13: Stretch/Future Enhancements

### [ ] T13.1 Prototype advanced semantic models (BERT/transformers) (P3)
Owner: Team Lead  
Dependencies: T11.3

Description:
- Explore improvements over baseline semantic scorer.

Subtasks:
- Benchmark transformer-based relevance vs current approach.
- Compare compute cost vs quality gain.

Deliverables:
- Experiment note with recommendation.

Acceptance criteria:
- Clear decision whether to adopt advanced model in next release.

---

### [ ] T13.2 Add LinkedIn or multi-platform verification support (P3)
Owner: Team Lead  
Dependencies: Stable MVP release

Description:
- Extend authenticity checks beyond GitHub.

Subtasks:
- Define new data connectors.
- Map cross-platform skill evidence model.

Deliverables:
- Enhancement proposal and technical design.

Acceptance criteria:
- Approved design and phased rollout plan exists.

---

### [ ] T13.3 Evaluate microservices decomposition path (P3)
Owner: Team Lead  
Dependencies: Stable monolith metrics

Description:
- Plan scaling architecture only when justified.

Subtasks:
- Identify service boundaries (parsing, scoring, verification).
- Define migration risk and observability requirements.

Deliverables:
- Re-architecture decision memo.

Acceptance criteria:
- Decision made with evidence, not assumptions.

---

## Immediate Next Actions (Recommended for this week)

1. [ ] Lock MVP scope and milestone plan (T0.1, T0.2)
2. [ ] Finish pending core items from report: scoring weight tuning, advanced GitHub validation, MongoDB integration, testing (T4.3, T5.6, T7.1, T11.x)
3. [ ] Complete and stabilize core APIs (T8.1, T8.2, T8.3)
4. [ ] Deliver first usable frontend ranking dashboard (T9.1, T9.2)
5. [ ] Run end-to-end integration test pass and prepare demo checklist (T11.2, T12.3)

---

## Done Snapshot From Existing Docs (for reference)

Mark these as complete only after code verification in repository:
- [~] Problem analysis and research
- [~] System design and architecture planning
- [~] Backend setup (Node.js + Express)
- [~] Resume parsing implementation
- [~] GitHub API integration
- [~] Initial ATS scoring model

Remaining high-focus items from docs:
- [ ] Improve ML scoring weights
- [ ] Advanced GitHub validation logic
- [ ] Frontend dashboard development
- [ ] Database integration (MongoDB)
- [ ] Testing and debugging
