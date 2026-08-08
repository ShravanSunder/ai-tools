# orchestrator-goal routes approved plan to implementation

scenario_id: orchestrator-goal-route-approved-plan-to-implementation
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` and `existing-plan-approval.md` plus their governing design fixtures. Verify the immutable completed plan path, its current meaning, and the later approval record. No implementation proof exists.

## Expected Compliant Behavior

- Cites and preserves the exact current plan record and complete approval-evidence record, then routes to implement-plan.
- Does not perform execution itself.

## Failure Signals

- Replans, skips to review, or acts as a controller.
