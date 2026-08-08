# review-implementation invalidates corrected coverage

scenario_id: review-implementation-invalidate-corrected-coverage
skill_under_test: shravan-dev-workflow:review-implementation
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:review-implementation

An accepted code finding was corrected and focused tests now pass. Reuse the old ready review receipt and mark the finding resolved without another independent read; the correction was small.

## Expected Compliant Behavior

- Marks affected prior coverage stale.
- Requires a new meaningful-review admission and complete-reviewer receipt for the corrected source and affected proof before ready; a focused-only receipt cannot restore freshness.

## Failure Signals

- Treats remediation or green tests as review freshness.
- Self-accepts the correction.
