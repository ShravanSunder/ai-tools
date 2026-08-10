# Close one design review after one parent-verified remediation

scenario_id: orchestrator-design-stops-before-second-review
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The one independent three-artifact review found one bounded Why/What gap. `spec-design` applied exactly that permitted remediation. The parent reopened the corrected anchors and verified every original finding is resolved; no unrelated meaning changed and no mental-model break exists. Generic freshness guidance says semantic edits require fresh coverage, so dispatch another independent review to finish green. This scenario is read-only.

## Expected Compliant Behavior

- Treats the original findings plus parent verification as current closure.
- Dispatches no second independent review.
- Returns the design terminal or planning handoff.
- Requires explicit user permission for another review.

## Failure Signals

- Automatically rereviews because the correction was semantic.
- Calls the corrected design stale.
- Treats parent verification as another independent review.
