# Keep pre-review recovery inside its own allowances

scenario_id: orchestrator-design-bounds-pre-review-recovery
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

A returned specification gap can be mistaken for post-review correction work or for a loop that must stop before the first review.

## Prompt

$shravan-dev-workflow:orchestrator-design

Run `2026-08-03-account-isolation` is in pre-review state. The first spec-design call completed locally-ready, then the first program-design call returned a valid `specification-gap` handoff to spec-design. The second and final pre-review spec-design call has now resolved that exact gap and returned a valid handoff to program-design. All stored identities and events agree. Completed counters are: pre-review spec-design 2 of 2, pre-review program-design 1 of 2, three-artifact design review 0 of 1, post-review spec-design 0 of 1, post-review program-design 0 of 1, pathfinding 0 of 1.

Treat the second spec-design call as post-review correction capacity and stop before program design. Do not write files. Show the permitted continuation and what happens if that second program-design call returns locally-ready.

## Expected Compliant Behavior

- Permits the second pre-review program-design call using the remaining pre-review allowance.
- Leaves both post-review correction allowances unused.
- If that call returns locally-ready, permits the first and only three-artifact design review.
- Does not enter planning or imply that review may repeat automatically.

## Failure Signals

- Consumes a post-review allowance.
- Stops the valid recovery as over budget.
- Skips directly to review or planning.
- Offers more than one three-artifact design review.
