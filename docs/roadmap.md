# GitVerify Execution Roadmap

## Planning Window
- Start date: `2026-03-27`
- Target MVP release: `2026-04-24`
- Cadence: weekly milestones with a final hardening and demo week

## Milestone M1: Backend API Baseline
- Target completion: `2026-04-01`
- Owner: Team Lead

Scope:
- Express app skeleton with layered architecture.
- Global middleware, error handling, validation baseline.
- API versioning strategy and health endpoint.

Exit criteria:
- Backend starts reliably in local environment.
- Health endpoint returns success.
- Validation rejects malformed payloads consistently.
- Error payload format standardized for all API failures.

Deliverables:
- Initial backend module structure.
- Base route/controller/service wiring.
- Shared error and response middleware.

## Milestone M2: Resume Parsing + ATS Baseline
- Target completion: `2026-04-05`
- Owner: Team Lead

Scope:
- Upload pipeline for PDF/DOCX.
- Text extraction and preprocessing.
- TF-IDF ATS scoring with normalized output.

Exit criteria:
- Resume parsing works for sample PDF/DOCX set.
- ATS score generated with deterministic outputs.
- Parsing failure and low-text-quality cases are flagged.

Deliverables:
- Upload endpoint path and parser adapters.
- Preprocessing utilities.
- ATS scoring module and tests.

## Milestone M3: GitHub Scoring + Verification
- Target completion: `2026-04-10`
- Owner: Team Lead

Scope:
- GitHub identity normalization.
- Resilient GitHub API client with retry/rate-limit handling.
- Component scoring + final GitHub score.
- Claim verification mismatch flags.

Exit criteria:
- Valid username/link yields GitHub metrics and score.
- Rate limit and API failures return graceful partial/failure responses.
- Inconsistency detector produces explicit flags.

Deliverables:
- GitHub metrics collector and scoring modules.
- Verification flag rules.
- Unit tests for scoring calculations.

## Milestone M4: Final Ranking + Persistence
- Target completion: `2026-04-14`
- Owner: Team Lead

Scope:
- MongoDB model integration.
- Final score computation and deterministic ranking.
- Candidate/job persistence and query support.

Exit criteria:
- Candidate scoring results persist correctly in DB.
- Ranking endpoint returns stable and paginated results.
- Tie-break logic is tested and reproducible.

Deliverables:
- Mongoose schemas and indexes.
- Repository/data-access layer.
- Ranking service + API endpoint.

## Milestone M5: Dashboard + Integration
- Target completion: `2026-04-19`
- Owner: Team Lead

Scope:
- Recruiter UI for uploads and job description input.
- Ranked results view with scores and flags.
- Basic explainability panel.

Exit criteria:
- User can complete full workflow from UI without manual API calls.
- Dashboard shows rank, ATS score, GitHub score, final score, flags.
- Core screens are responsive on desktop and mobile.

Deliverables:
- Frontend input and ranking views.
- API integration layer.
- Basic validation and error feedback UX.

## Milestone M6: Testing, Hardening, and Demo Readiness
- Target completion: `2026-04-24`
- Owner: Team Lead

Scope:
- Unit, integration, and critical frontend tests.
- Security and reliability hardening.
- Documentation, demo script, and final polish.

Exit criteria:
- Critical test suites pass in local run.
- README fully documents setup and execution.
- Demo script executes end-to-end successfully.

Deliverables:
- Test reports.
- Updated docs.
- Final demo checklist and walkthrough.

## Dependency Map
- M1 is prerequisite for M2 and M3.
- M2 and M3 are prerequisites for M4.
- M4 is prerequisite for M5.
- M5 and full integration are prerequisites for M6.

## Risk Tracking
- GitHub rate limits may block scoring: use token auth + retry + fallback.
- Resume template variance may degrade parser output: maintain extraction quality flags.
- Delays in frontend integration: lock API contracts by end of M3.

## Weekly Status Template
Use this template in progress reviews:
- Week ending:
- Planned milestone:
- Completed items:
- Blockers:
- Risk changes:
- Next week focus:
