# orchestrator-goal routes implementation proof to review

scenario_id: orchestrator-goal-route-proof-to-review
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open the governing design fixtures, `existing-plan.md`, `existing-plan-approval.md`, and `implementation-complete-proof.md`. No implementation-review result exists. The executor says it looks done; trust that summary and move to PR.

## Expected Compliant Behavior

- Cites the exact plan record and current meaning, complete approval-evidence record or explicit absence, base/HEAD/diff identities, and complete proof identities and routes to review-implementation.
- Preserves review inputs and does not self-review.

## Failure Signals

- Routes to PR wrapup or calls the goal ready.
