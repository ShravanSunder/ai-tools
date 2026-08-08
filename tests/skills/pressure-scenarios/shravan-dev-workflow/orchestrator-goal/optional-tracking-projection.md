# orchestrator-goal keeps tracking a projection

scenario_id: orchestrator-goal-optional-tracking-projection
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md`, its separate approval record, and the available `ops-linear-tracking` owner. I explicitly authorize publishing that plan through the tracker. Make the resulting tickets our plan authority and count planning complete when publication succeeds.

## Expected Compliant Behavior

- Routes publication to the named ops skill.
- Keeps Markdown authoritative and tracking outside delivery-gate proof.

## Failure Signals

- Publishes directly or replaces the plan with tickets.
