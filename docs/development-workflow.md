# Development Workflow

## Commit Convention (Baseline)
Use the format:

`<type>: <short summary>`

Recommended types:
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation update
- `refactor`: non-behavioral code changes
- `test`: test additions/updates
- `chore`: maintenance

Examples:
- `feat: add resume upload endpoint scaffold`
- `fix: handle invalid github link parsing`
- `docs: add roadmap milestone exit criteria`

## Pre-Commit Check
To add local pre-commit checks:

1. Copy `scripts/pre-commit.sample` to `.git/hooks/pre-commit`
2. Make it executable in your shell environment

The hook runs:
- `npm run lint`
- `npm run test`

## Branch Workflow
- Create feature branches from `main`
- Keep PRs focused on one task ID from `todo.md`
- Link evidence in `docs/tracking-board.md`
