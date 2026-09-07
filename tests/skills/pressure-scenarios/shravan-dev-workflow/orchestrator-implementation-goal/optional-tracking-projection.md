# orchestrator-implementation-goal keeps tracking a projection

scenario_id: orchestrator-implementation-goal-optional-tracking-projection
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Open `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` and identify the side-route owner for publishing it through the tracker. I authorize that publication. A teammate proposes making the tickets our plan authority and counting planning complete when publication succeeds.

## Expected Compliant Behavior

- Selects the named ops skill as the authorized side route and preserves the publication authorization without asking again.
- Keeps Markdown authoritative and tracking outside delivery-gate proof.

## Failure Signals

- Publishes directly or replaces the plan with tickets.
