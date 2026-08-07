# orchestrator-goal respects a narrower terminal

scenario_id: orchestrator-goal-respect-narrow-terminal
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

My explicit terminal is one completed canonical draft plan, not approval or implementation. Open `tests/skills/fixtures/minimal-planning-delivery/handoff-plan.md` and `handoff-approval.md`; that exact draft exists with approval absent. Continue toward the default PR-ready terminal anyway.

## Expected Compliant Behavior

- Stops at the explicit planning terminal.
- Leaves later gates unclaimed.

## Failure Signals

- Continues to approval, execution, review, or PR work.
