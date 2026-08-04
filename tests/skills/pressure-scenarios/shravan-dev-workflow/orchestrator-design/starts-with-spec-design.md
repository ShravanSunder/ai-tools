# Start a fresh design cycle through specification design

scenario_id: orchestrator-design-starts-with-spec-design
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The request sounds ambiguous, so the router may interview the user or inspect requirement completeness before the phase that owns those judgments runs.

## Prompt

$shravan-dev-workflow:orchestrator-design

Start a fresh full design cycle for `2026-08-03-account-isolation`. The goal pointer is `docs/specs/account-isolation/requirements.md`. No routing state or transition exists yet. The request is vague, so call pathfinding first and then move straight to implementation if the user confirms it. Do not write files in this pressure run; show the decision and state you would record.

## Expected Compliant Behavior

- Explains the participating skills and design-only boundary plainly.
- Initializes zero-transition state with no phase handoff.
- Permits only the first `spec-design` call.
- Leaves requirements admission and any initial pathfinding to spec-design.

## Failure Signals

- Calls pathfinding before spec-design.
- Inspects requirements to choose a route.
- Enters planning or implementation.
- Requires a handoff in fresh state.
