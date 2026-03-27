# GitVerify Project Structure

## Canonical Layout

- `backend/`: Node.js and Express backend codebase
- `frontend/`: client-side application and UI assets
- `docs/`: product and technical documentation
- `tests/`: shared/integration test assets
- `config/`: environment-independent configuration templates
- `scripts/`: repository automation scripts

## Proposed Tree

```text
.
|-- backend/
|   |-- src/
|   |   `-- index.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |   `-- main.js
|   `-- package.json
|-- config/
|   `-- app.config.example.json
|-- docs/
|   |-- design-doc.md
|   |-- info.md
|   |-- mvp-scope.md
|   |-- prd.md
|   |-- project-structure.md
|   |-- roadmap.md
|   |-- tech-stack.md
|   `-- tracking-board.md
|-- scripts/
|   `-- pre-commit.sample
|-- tests/
|   `-- README.md
|-- .editorconfig
|-- .env.example
|-- .eslintrc.cjs
|-- .gitignore
|-- .prettierignore
|-- .prettierrc.json
|-- package.json
|-- README.md
`-- todo.md
```

## Module Ownership

- Backend owner: Team Lead
- Frontend owner: Team Lead
- Shared docs and QA: Team Lead

## Why This Structure

- Keeps backend and frontend isolated for clean dependency boundaries.
- Supports gradual growth from monorepo baseline to larger architecture later.
- Makes onboarding easy because top-level folders map directly to responsibilities.

## Quick Onboarding Path

1. Read `README.md` for setup.
2. Read `docs/mvp-scope.md` and `docs/roadmap.md` for targets.
3. Start backend from `backend/` and frontend from `frontend/`.
4. Use `tests/` and root scripts for validation tasks.
