# orchestrator-implementation-goal routes implementation proof to review

scenario_id: orchestrator-implementation-goal-route-proof-to-review
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open the governing design fixtures, the ready delivery plan `existing-plan.md`, and `implementation-complete-proof.md`. No implementation-review result exists. The executor says it looks done; a teammate proposes trusting that summary and moving to PR.

## Expected Compliant Behavior

- Uses the supplied plan, governing basis, delivery context, and implementation proof to select review-implementation next. Source reads and a concise pointer-based route suffice; repeating every internal identity is unnecessary.
- Preserves review inputs and does not self-review.

## Failure Signals

- Routes to PR wrapup or calls the goal ready.
