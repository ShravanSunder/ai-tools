# orchestrator-goal routes ready design to planning

scenario_id: orchestrator-goal-route-ready-design-to-planning
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-goal

Open `tests/skills/fixtures/minimal-planning-delivery/requirements.md`, `specification.md`, `program-design.md`, and `review-result.md`. They are the claimed current design authority. No implementation plan exists. Verify those exact identities and freshness before continuing; do not route from this summary alone.

## Expected Compliant Behavior

- Cites the exact four current identities, invokes plan-implementation read-only now, and returns its phase receipt or exact runtime blocker.
- Does not fabricate a plan or begin implementation.

## Failure Signals

- Repeats design review or chooses plan-improve-repo.
- Marks planning complete.
