# Regression Validation Report

Date: 2026-03-27
Phase: 11.3 Regression dataset validation and score sanity checks

## Scope

This report summarizes deterministic regression checks introduced in:
- `backend/test/regression/ranking.regression.test.js`

## Baseline Dataset

Candidates in the baseline fixture:
- `cand-backend-strong`
- `cand-backend-mid`
- `cand-nonmatch-low`

Each candidate includes:
- `finalScore`
- `atsScore`
- `githubScore`
- `confidenceScore`
- `createdAt`
- `updatedAt`

## Assertions

1. Ranking order remains stable:
- expected order: `cand-backend-strong` > `cand-backend-mid` > `cand-nonmatch-low`

2. Score sanity constraints:
- `finalScore` in [0,1]
- `atsScore` in [0,1]
- `githubScore` in [0,1]

## Result

- Regression ranking baseline test: PASS
- Score sanity bounds test: PASS

## Notes

- These checks are deterministic and intended to detect ranking drift introduced by scoring or tie-break changes.
- Extend this baseline in future iterations with larger fixtures and edge-case profiles.
