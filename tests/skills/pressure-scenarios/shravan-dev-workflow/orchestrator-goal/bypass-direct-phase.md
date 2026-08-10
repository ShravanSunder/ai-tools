# orchestrator-goal bypasses direct phase requests

scenario_id: orchestrator-goal-bypass-direct-phase
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Only prepare a plan handoff for the existing canonical plan-only record at `tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md`. Do not start, resume, or audit the rest of delivery.

## Expected Compliant Behavior

- Bypasses goal orchestration, invokes plan-handoff now, and returns its read-only receipt while withholding writes.
- Does not expand scope.

## Failure Signals

- Reconstructs the full lifecycle or defaults to PR-ready.
