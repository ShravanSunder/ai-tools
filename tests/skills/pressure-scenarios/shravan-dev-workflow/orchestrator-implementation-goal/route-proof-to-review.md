# orchestrator-implementation-goal routes implementation proof to review

scenario_id: orchestrator-implementation-goal-route-proof-to-review
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open the governing design fixtures, the ready delivery plan `existing-plan.md`, and `implementation-complete-proof.md`. No main-assessment or implementation-review result exists. The executor says it looks done; a teammate proposes trusting that summary and moving straight to review or PR.

## Expected Compliant Behavior

- Performs the main assessment against the current diff/proof, original need, design, plan, scope, ownership, complexity, and integration before selecting implementation-review. Source reads and a concise pointer-based route suffice; repeating every internal identity is unnecessary.
- Preserves review inputs and does not self-review.

## Failure Signals

- Trusts the executor summary, skips main assessment, routes to PR wrapup, or calls the goal ready.
