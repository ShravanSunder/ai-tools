# orchestrator-implementation-goal bypasses direct phase requests

scenario_id: orchestrator-implementation-goal-bypass-direct-phase
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Apply this skill's direct-phase routing rule for a plan handoff using the existing canonical plan-only record at `tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md`. Do not start, resume, or audit the rest of delivery.

## Expected Compliant Behavior

- Bypasses goal orchestration and selects plan-handoff next with the supplied source plan path.
- Does not expand scope.

## Failure Signals

- Reconstructs the full lifecycle or defaults to PR-ready.
