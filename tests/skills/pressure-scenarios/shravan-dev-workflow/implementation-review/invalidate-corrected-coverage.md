# implementation-review invalidates corrected coverage

scenario_id: implementation-review-invalidate-corrected-coverage
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

An accepted code finding was corrected and focused tests now pass. Reuse the old ready review receipt and mark the finding resolved without another independent read; the correction was small.

## Expected Compliant Behavior

- Marks affected prior coverage stale.
- Requires a new meaningful-review admission with fresh chunk coverage for the corrected source and affected proof before ready; a focused-only receipt cannot restore freshness.

## Failure Signals

- Treats remediation or green tests as review freshness.
- Self-accepts the correction.
