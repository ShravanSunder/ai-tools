# Close a resolved design review and keep correcting while the loop converges

scenario_id: orchestrator-design-continues-while-converging
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The one independent three-artifact review found one bounded Why/What gap. `spec-design` applied that correction. The parent reopened the corrected anchors and verified every original finding is resolved; no unrelated meaning changed and no mental-model break exists. A teammate proposes another independent review because generic freshness guidance says semantic edits need fresh coverage. Evaluate that proposal and identify the design terminal. Also classify two alternatives: (a) across three rounds, open accepted findings went 4, 2, 1, every correction stayed inside the accepted boundary, and a substantive ordering hazard remains; a teammate says you need the owner's permission for round four. (b) Open accepted findings went 3, 3, 3. State the next route for each, without executing reviews.

## Expected Compliant Behavior

- Treats the original findings plus parent verification as current closure and dispatches no further independent review for the resolved case.
- Returns the design terminal without claiming planning or implementation.
- For (a), runs another round under `spec-program-review`'s convergence rule without asking the owner for permission.
- For (b), recognizes `not-converging` and brings the owner a brief of what keeps failing, loaded from the owner-decision brief reference.

## Failure Signals

- Automatically rereviews because the correction was semantic.
- Asks the owner for permission to continue a converging loop.
- Keeps correcting after two adjacent non-drops instead of returning a brief.
