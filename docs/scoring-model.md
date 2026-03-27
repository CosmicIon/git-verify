# GitVerify Scoring Model Reference

This document describes the scoring logic used by GitVerify, including formulas, assumptions, and known limitations.

## Scoring Pipeline Overview

For each candidate:

1. Resume parsing and text preprocessing are executed.
2. ATS components are calculated.
3. GitHub metrics and verification components are calculated.
4. Final score and confidence metadata are generated.
5. Candidate is ranked with deterministic tie-break rules.

## ATS Score

ATS score combines lexical relevance and semantic relevance.

Formula:

- `ATS = (ATS_ALPHA * TFIDF_SCORE) + (ATS_BETA * SEMANTIC_SCORE)`

Configuration:

- `ATS_ALPHA`
- `ATS_BETA`

Constraint:

- `ATS_ALPHA + ATS_BETA = 1`

Outputs:

- `atsScore` in `[0,1]`
- Explainability payload:
  - top matched skills
  - missing required skills
  - component values (`tfidf`, `semantic`)

## GitHub Score

GitHub score combines five normalized components.

Formula:

- `GitHub = (A * Activity) + (L * Language) + (Q * Quality) + (C * Consistency) + (V * Verification)`

Configuration:

- `GITHUB_ACTIVITY_WEIGHT`
- `GITHUB_LANGUAGE_WEIGHT`
- `GITHUB_QUALITY_WEIGHT`
- `GITHUB_CONSISTENCY_WEIGHT`
- `GITHUB_VERIFICATION_WEIGHT`

Constraint:

- weights must sum to `1`

Component intent:

- Activity: commit and engagement recency signals.
- Language: overlap between job/resume expectations and observed repository language evidence.
- Quality: proxy quality indicators (stars, forks, project hygiene metadata).
- Consistency: continuity of contribution behavior.
- Verification: alignment between claimed skills and observed GitHub evidence.

Outputs:

- `githubScore` in `[0,1]`
- reason codes for low-confidence or weak evidence scenarios

## Final Score

Formula:

- `Final = (FINAL_LAMBDA * ATS) + ((1 - FINAL_LAMBDA) * GitHub)`

Configuration:

- `FINAL_LAMBDA`

Fallback policy:

- If one component is unavailable, service-level fallback policy applies and audit metadata records the applied strategy.

Outputs:

- `finalScore` in `[0,1]`
- `confidenceScore` in `[0,1]`
- `scoreAudit` metadata (version/timestamp/policy)

## Ranking Policy

Primary sort (default):

1. `finalScore` desc
2. `githubScore` desc
3. `atsScore` desc
4. recency (`updatedAt`/`createdAt`)

Ranking is deterministic for equivalent inputs.

## Assumptions

- Resume text quality impacts ATS quality directly.
- Public GitHub evidence is a partial but useful proxy for practical skill signals.
- Weighted linear combinations are intentionally interpretable for recruiter-facing transparency.

## Known Limitations and Fairness Caveats

- GitHub-based scoring may under-represent candidates with strong private or non-GitHub work.
- Sparse repository history can reduce confidence even for capable early-career candidates.
- Resume keyword density can influence lexical score disproportionately in edge cases.
- Domain-specific jargon may not always be captured equally by generic preprocessing.

Recommended operational safeguards:

- Use flags and explainability as review support, not sole rejection criteria.
- Consider alternate evidence channels in final human review.
- Revisit weights against periodic regression datasets and hiring outcome feedback.

## Validation References

- Unit tests:
  - `backend/test/unit/atsScoringService.test.js`
  - `backend/test/unit/githubScoringService.test.js`
  - `backend/test/unit/rankingService.test.js`
- Integration tests:
  - `backend/test/integration/api.integration.test.js`
- Regression baseline:
  - `backend/test/regression/ranking.regression.test.js`
  - `docs/regression-validation.md`
