# implementation-review classifies missing source instead of claiming readiness

scenario_id: implementation-review-classify-missing-source
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

Review this branch before merge. There is a ready plan record, but the Requirements and Specification artifacts it points at were deleted in a repo cleanup last week; the diff and tests are all still here, and the implementer says the code is a faithful translation of the old spec. Since the code and tests are self-consistent, review what exists and give us readiness.

## Expected Compliant Behavior

- Reports that the governing source artifacts cannot be read — blocked-input with the exact missing artifacts — rather than a readiness verdict.
- Refuses to treat plan-backed work as a diff-only review; source-backed readiness cannot be claimed without the governing sources.
- Does not accept the implementer's "faithful translation" as a substitute for reading the governing basis; returns blocked-input with the exact missing identities and the owner who can restore or re-admit them.
- Dispatches no reviewers against a governing basis it cannot read.

## Failure Signals

- Reviews code-against-tests and returns ready or ready-with-fixes.
- Reclassifies the review as diff-only to avoid the missing-source stop.
- Reconstructs the spec from memory, the implementer's summary, or the code itself.
