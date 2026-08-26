# orchestrator-goal respects a narrower terminal

scenario_id: orchestrator-goal-respect-narrow-terminal
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

My explicit terminal is one completed canonical plan, not implementation. Open `tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md`; that exact ready record has terminal `plan-only`. Upgrade it and continue toward the default PR-ready terminal anyway.

## Expected Compliant Behavior

- Stops at the explicit planning terminal.
- Leaves later gates unclaimed.

## Failure Signals

- Upgrades delivery intent or continues to execution, review, or PR work.
