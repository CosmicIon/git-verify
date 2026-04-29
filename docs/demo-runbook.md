# GitVerify Demo Runbook and Evaluation Checklist

Use this guide for a consistent end-to-end demonstration of GitVerify.

## Demo Objective

Show that GitVerify can:

1. Accept candidate evidence (resume + GitHub + job context).
2. Compute ATS and GitHub scores.
3. Produce explainable ranking output with verification flags.

## Pre-Demo Setup

1. Ensure prerequisites are installed:
- Node.js 20+
- npm 10+
- MongoDB available

2. Configure environment:
- Copy `.env.example` to `.env`
- Verify `MONGODB_URI`
- Optionally set `GITHUB_TOKEN`

3. Install dependencies:

```bash
npm install
```

4. Start backend:

```bash
npm run dev
```

5. Start frontend in a second terminal:

```bash
npm run dev --workspace frontend
```

6. Verify health:

```bash
curl http://localhost:5000/api/v1/health
```

Expected: HTTP 200 with success response.

## Demo Scenario

Use at least three candidate profiles:

- Candidate A: strong JD match + active relevant GitHub
- Candidate B: moderate JD match + mixed GitHub evidence
- Candidate C: weak JD match or mismatched claimed skills

Use a backend-oriented JD that mentions Node.js, Express, testing, and database tooling.

## Scripted Walkthrough

1. Open frontend dashboard at `http://localhost:4173`.
2. Enter GitHub link/username.
3. Enter job description or job reference.
4. Upload one resume file (`.pdf` or `.docx`).
5. Submit candidate.
6. Confirm upload success status.
7. Trigger scoring for submitted candidate.
8. Refresh rankings table.
9. Open explainability details for top and lower-ranked candidates.
10. Show flags/reason codes for mismatch or low evidence candidates.

## Talking Points During Demo

- Innovation statement:
  - GitVerify combines resume relevance and proof-of-work evidence from GitHub.
- Transparency:
  - Recruiters can inspect score components and mismatch flags.
- Reliability:
  - Includes API validation, security hardening, and automated tests.
- Determinism:
  - Ranking tie-break and regression checks reduce drift risk.

## Evaluation Checklist

## Functional Checks

- [ ] Upload works for valid PDF/DOCX file.
- [ ] Invalid format is rejected with clear error.
- [ ] Score API returns ATS, GitHub, final score, and confidence metadata.
- [ ] Rankings endpoint returns sorted and paginated items.
- [ ] Flags and reason codes are visible in UI.

## Explainability Checks

- [ ] Top matched skills are displayed.
- [ ] Missing required skills are displayed.
- [ ] GitHub reason codes are displayed for weak profiles.

## Quality Checks

- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] Regression report is available at `docs/regression-validation.md`.

## Operational Checks

- [ ] Backend and frontend start without configuration errors.
- [ ] API health endpoint is reachable.
- [ ] CORS and rate-limit policies are active in API stack.

## Known Constraints to Mention

- GitHub signals are only one source of evidence.
- Candidates with private or non-GitHub work may score conservatively.
- Model weights are configurable and should be periodically reviewed against outcome data.

## Post-Demo Artifacts

Capture these after the run:

- Screenshot of ranking table
- Screenshot of explainability/flags panel
- Terminal outputs for lint and tests
- Notes on observed edge cases or reviewer feedback
