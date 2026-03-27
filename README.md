# GitVerify

Automated "Proof-of-Work" validation system for authentic fresher recruitment.

GitVerify helps recruiters evaluate candidates using resume relevance and GitHub evidence, then produces a transparent ranked list with verification flags.

## Project Status

- Phase 0 complete: planning artifacts created
- Phase 1 complete: repository scaffold and environment baseline created
- Phase 2 complete: backend API core and validation contracts
- Phase 3 complete: upload + resume parsing pipeline
- Phase 4 complete: ATS scoring and explainability
- Phase 5 complete: GitHub analysis and verification scoring
- Phase 6 complete: final score, ranking policy, and confidence metadata
- Phase 7 complete: MongoDB models and repository layer
- Phase 8 complete: public API contract + OpenAPI/Postman docs
- Phase 9 complete: recruiter dashboard workflow and ranking UI
- Phase 10 complete: security, resilience, and operational hardening
- Phase 11 complete: unit/integration/regression/frontend testing baseline
- Phase 12 complete: documentation, runbook, scoring reference, and demo checklist

## Repository Structure

- `backend/`: backend runtime and API code
- `frontend/`: frontend/UI code
- `docs/`: product and technical docs
- `tests/`: shared test assets
- `config/`: config templates
- `scripts/`: automation helpers

See `docs/project-structure.md` for the full structure map.

## Architecture Summary

Runtime components:

- Backend API (`backend/`): Express layered architecture (routes -> controllers -> services -> repositories)
- Frontend dashboard (`frontend/`): static server + API proxy with recruiter workflow UI
- Persistence: MongoDB + Mongoose repositories with in-memory fallback behavior
- Scoring pipeline:
	- Resume parsing + preprocessing + diagnostics
	- ATS scoring (TF-IDF + semantic component)
	- GitHub metrics, verification, weighted scoring
	- Final weighted score + confidence + audit metadata

Core API namespace: `/api/v1`

- `POST /api/v1/upload`
- `POST /api/v1/score`
- `GET /api/v1/rankings`
- `GET /api/v1/health`

## Prerequisites

- Node.js 20+
- npm 10+
- MongoDB (local or remote)

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill required values:
	 - `PORT`
	 - `MONGODB_URI`
	 - `GITHUB_TOKEN` (recommended)
	 - scoring and rate-limit variables as needed

Key environment variables (see `.env.example` for full list):

- Server and runtime: `PORT`, `NODE_ENV`
- Database: `MONGODB_URI`, `MONGODB_AUTO_INDEX`
- ATS scoring: `ATS_ALPHA`, `ATS_BETA`, `FINAL_LAMBDA`
- GitHub scoring: `GITHUB_ACTIVITY_WEIGHT`, `GITHUB_LANGUAGE_WEIGHT`, `GITHUB_QUALITY_WEIGHT`, `GITHUB_CONSISTENCY_WEIGHT`, `GITHUB_VERIFICATION_WEIGHT`
- Limits and security: `MAX_RESUME_FILE_SIZE_MB`, `MAX_FILES_PER_UPLOAD`, `API_RATE_LIMIT_PER_MINUTE`, `MAX_REQUEST_BODY_BYTES`, `ALLOWED_ORIGINS`
- GitHub resilience: `GITHUB_API_TIMEOUT_MS`, `GITHUB_API_RETRIES`, `GITHUB_RETRY_BASE_MS`

## Install

```bash
npm install
```

## Runbook

### Start Backend API

From repository root:

```bash
npm run dev
```

Backend default base URL:

- `http://localhost:5000`

Health check:

```bash
curl http://localhost:5000/api/v1/health
```

### Start Frontend Dashboard

In a second terminal, from repository root:

```bash
npm run dev --workspace frontend
```

Frontend default URL:

- `http://localhost:4173`

The frontend proxies `/api/*` to backend origin (default `http://localhost:5000`).

### Run Quality Gates

```bash
npm run lint
npm run test
```

Current automated validation includes:

- backend unit tests
- backend API integration tests
- backend regression ranking checks
- frontend critical journey tests

## Workspace Scripts

Run from repository root:

- `npm run dev`: start backend in watch mode
- `npm run start`: start backend once
- `npm run dev --workspace frontend`: start frontend dashboard server on port 4173 (default)
- `npm run test`: run workspace tests
- `npm run lint`: lint workspace JS files
- `npm run format`: format workspace JS files

Additional workspace commands:

- `npm run start --workspace frontend`: run frontend server without watch semantics
- `npm run test --workspace backend`: run backend tests only
- `npm run test --workspace frontend`: run frontend tests only

## Code Quality Baseline

- ESLint config: `.eslintrc.cjs`
- Prettier config: `.prettierrc.json`
- Editor defaults: `.editorconfig`
- Commit workflow docs: `docs/development-workflow.md`
- Optional hook template: `scripts/pre-commit.sample`

## API and Supporting Docs

- OpenAPI spec: `docs/api/openapi.yaml`
- Postman collection: `docs/api/GitVerify.postman_collection.json`
- Regression report: `docs/regression-validation.md`
- Scoring documentation: `docs/scoring-model.md`
- Demo script and checklist: `docs/demo-runbook.md`

## Phase Planning Docs

- `todo.md`
- `docs/mvp-scope.md`
- `docs/roadmap.md`
- `docs/tracking-board.md`

## Next Phase

Phase 13 focuses on stretch enhancements:

- advanced semantic model experimentation
- multi-platform verification expansion
- architecture scale-path evaluation
