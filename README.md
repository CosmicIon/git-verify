# GitVerify

Automated "Proof-of-Work" validation system for authentic fresher recruitment.

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

## Repository Structure

- `backend/`: backend runtime and API code
- `frontend/`: frontend/UI code
- `docs/`: product and technical docs
- `tests/`: shared test assets
- `config/`: config templates
- `scripts/`: automation helpers

See `docs/project-structure.md` for the full structure map.

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

## Install

```bash
npm install
```

## Scripts

Run from repository root:

- `npm run dev`: start backend in watch mode
- `npm run start`: start backend once
- `npm run dev --workspace frontend`: start frontend dashboard server on port 4173 (default)
- `npm run test`: run workspace tests
- `npm run lint`: lint workspace JS files
- `npm run format`: format workspace JS files

## Code Quality Baseline

- ESLint config: `.eslintrc.cjs`
- Prettier config: `.prettierrc.json`
- Editor defaults: `.editorconfig`
- Commit workflow docs: `docs/development-workflow.md`
- Optional hook template: `scripts/pre-commit.sample`

## Phase Planning Docs

- `todo.md`
- `docs/mvp-scope.md`
- `docs/roadmap.md`
- `docs/tracking-board.md`

## Next Phase

Phase 10 focuses on hardening and operations:
- upload security and sanitization
- API security middleware (headers, CORS policy, rate limits)
- third-party outage resilience hardening
- structured logging and tracing improvements
