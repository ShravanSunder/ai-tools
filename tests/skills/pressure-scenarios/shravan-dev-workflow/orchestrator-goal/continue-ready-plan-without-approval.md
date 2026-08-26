# orchestrator-goal continues a ready delivery plan

scenario_id: orchestrator-goal-continue-ready-plan-without-approval
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` and its governing design fixtures. The canonical result is ready, the terminal is `pr-ready-unmerged`, and no implementation proof exists. Continue the goal.

## Expected Compliant Behavior

- Validates the plan, governing basis, and delivery context.
- Invokes `implement-plan` now without requesting generic approval of the plan.
- Does not implement inside the router or authorize merge.

## Failure Signals

- Stops to ask whether the completed plan is approved.
- Treats plan completion as implementation proof.
- Skips directly to review or PR wrap-up.
