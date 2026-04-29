# GitVerify

Automated "Proof-of-Work" validation system for authentic fresher recruitment.

GitVerify helps recruiters evaluate candidates using resume relevance and GitHub evidence, then produces a transparent ranked list with verification flags.

## Overview

GitVerify is a full-stack recruitment intelligence platform that combines:

- Resume parsing and relevance analysis
- GitHub-based proof-of-work verification
- Explainable candidate scoring and ranking

The goal is to support faster, more reliable fresher hiring decisions with transparent, auditable outputs.

## Key Capabilities

- Multi-file resume upload with validation and diagnostics
- ATS scoring with lexical and semantic components
- GitHub profile normalization, metrics extraction, and verification scoring
- Final weighted score, confidence score, and deterministic ranking policy
- Recruiter dashboard for submission, scoring, ranking, and flag review
- Security controls, rate limiting, and structured operational logging

## Architecture

Runtime components:

- Backend API (`backend/`): Express layered architecture (routes -> controllers -> services -> repositories)
- Frontend dashboard (`frontend/`): static server + API proxy with recruiter workflow UI
- Persistence: MongoDB + Mongoose repositories with in-memory fallback behavior
- Scoring pipeline:
  - Resume parsing + preprocessing + diagnostics
  - ATS scoring (TF-IDF + semantic component)
  - GitHub metrics, verification, weighted scoring
  - Final weighted score + confidence + audit metadata

## Technology Stack

- Backend: Node.js, Express.js, Mongoose, Multer
- Parsing: `pdf-parse`, `mammoth`
- Frontend: vanilla JavaScript, HTML, CSS
- Database: MongoDB
- Testing: Node test runner, Supertest, JSDOM
- Tooling: ESLint, Prettier

## API Surface

Core API namespace: `/api/v1`

- `POST /api/v1/upload`
- `POST /api/v1/score`
- `GET /api/v1/rankings`
- `GET /api/v1/health`

Detailed API docs:

- OpenAPI spec: `docs/api/openapi.yaml`
- Postman collection: `docs/api/GitVerify.postman_collection.json`

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

## Running The Application

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

## Quality And Validation

- Lint: `npm run lint`
- Full test suite: `npm run test`
- Backend only tests: `npm run test --workspace backend`
- Frontend only tests: `npm run test --workspace frontend`

Automated coverage includes unit, integration, regression, and frontend journey tests.

Regression reference:

- `docs/regression-validation.md`

## Engineering Standards

- ESLint config: `.eslintrc.cjs`
- Prettier config: `.prettierrc.json`
- Editor defaults: `.editorconfig`
- Commit workflow docs: `docs/development-workflow.md`
- Optional hook template: `scripts/pre-commit.sample`

## Project Structure

- `backend/`: backend runtime and API code
- `frontend/`: frontend UI and proxy server
- `docs/`: architecture, API, scoring, and delivery documentation
- `tests/`: shared test assets
- `config/`: configuration templates
- `scripts/`: automation helpers

See `docs/project-structure.md` for the full structure map.

## Additional Documentation

- Scoring documentation: `docs/scoring-model.md`
- Demo script and checklist: `docs/demo-runbook.md`
