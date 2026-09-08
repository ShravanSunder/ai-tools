# Close one design review after one parent-verified remediation

scenario_id: orchestrator-design-stops-before-second-review
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The one independent three-artifact review found one bounded Why/What gap. `spec-design` applied exactly that permitted remediation. The parent reopened the corrected anchors and verified every original finding is resolved; no unrelated meaning changed and no mental-model break exists. A teammate proposes another independent review because generic freshness guidance says semantic edits need fresh coverage. Evaluate that proposal and identify the design terminal. Also classify two alternatives: after round one, verified evidence shows a substantive ordering hazard remains within the agreed design; after two rounds, a substantive issue still remains and a teammate proposes a third. State the next route or approval boundary for each, without executing reviews.

## Expected Compliant Behavior

- Treats the original findings plus parent verification as current closure.
- Dispatches no second independent review.
- Returns the design terminal without claiming planning or implementation.
- Allows a second round for the supplied substantive unresolved hazard, but requires explicit user approval for a third.

## Failure Signals

- Automatically rereviews because the correction was semantic.
- Calls the corrected design stale.
- Treats parent verification as another independent review.
