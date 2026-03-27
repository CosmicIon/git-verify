# GitVerify MVP Scope

## Objective
Define clear MVP boundaries for the first usable release of GitVerify so development remains focused and measurable.

## Release Target
- Release name: `v1.0-mvp`
- Target date: `2026-04-24`
- Primary users: Recruiters and hiring managers evaluating fresher candidates

## In-Scope MVP Features

### 1) Resume Intake and Parsing
- Upload resume files in PDF and DOCX format.
- Parse resume text and store extraction output.
- Handle invalid file type, oversized file, and empty extraction errors.

Success metric:
- At least 95% of valid sample resumes are parsed into non-empty text.

### 2) Job Description Intake
- Recruiter can submit a job description with required skills.
- Backend stores and links job description to candidate scoring context.

Success metric:
- 100% of scoring requests require a valid job description context.

### 3) ATS Scoring
- Compute ATS score using TF-IDF similarity.
- Include embedding-based component if available.
- Return normalized score between 0 and 1.

Success metric:
- Score consistency across reruns on same input is 100% deterministic.

### 4) GitHub Profile Analysis
- Accept GitHub profile link or username.
- Fetch repository/activity/language signals via GitHub API.
- Gracefully handle rate limits and missing profiles.

Success metric:
- At least 90% of valid public GitHub usernames return usable analysis output.

### 5) Claim Verification Flags
- Compare claimed resume skills with observable GitHub signals.
- Generate verification and inconsistency flags.

Success metric:
- 100% of candidates have either `NO_FLAG` or one or more explicit flags.

### 6) Final Score and Ranking
- Compute final weighted score from ATS + GitHub components.
- Rank candidates with deterministic tie-break behavior.

Success metric:
- Ranking output remains stable across repeated runs on same dataset.

### 7) Recruiter Dashboard (Core)
- Display ranked candidates with ATS/GitHub/final scores and flags.
- Provide basic filtering/search/sort.

Success metric:
- Recruiter can complete upload-to-ranking workflow in under 5 minutes for test dataset.

## Out-of-Scope for MVP (Post-MVP)
- LinkedIn verification and multi-platform profile validation.
- Transformer-heavy production model (BERT/LLM pipeline) as required dependency.
- Microservices split and distributed deployment architecture.
- Real-time streaming ingestion and analytics.
- Advanced recruiter feedback loop and model auto-retraining.

## Non-Functional MVP Baselines
- Performance:
  - Process 20 resumes in one batch without service crash.
  - Median ranking API response under 2s for test-sized dataset.
- Reliability:
  - All critical API routes return structured error payloads.
- Security:
  - File validation, request size limits, and env-based secrets.
- Usability:
  - One clear flow: upload -> score -> rank.

## Definition of Done (MVP Release Gate)
MVP is complete only when all conditions are satisfied:
1. `POST /api/upload`, `POST /api/score`, and `GET /api/rankings` are functional and documented.
2. Resume parsing, ATS scoring, GitHub scoring, final ranking, and flags are integrated end-to-end.
3. MongoDB persistence works for candidate/job/score records.
4. Dashboard renders ranking output with flags and score breakdown.
5. Unit + integration tests pass for critical paths.
6. README includes full setup and run instructions.

## Risks and Assumptions
- Assumption: candidates provide valid public GitHub profiles.
- Risk: GitHub API rate limits can reduce scoring fidelity.
- Risk: resume parsing quality varies by template/layout.
- Mitigation: retries, fallback logic, and extraction quality flags.
