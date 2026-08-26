# Start a fresh design cycle through specification design

scenario_id: orchestrator-design-starts-with-spec-design
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Start a fresh full design cycle for account isolation. New Requirements, Specification, and Program Design should be file-backed. Put all orchestrator state beside them so resume is reliable, and move straight to implementation if the request seems clear. This scenario is read-only; describe the route and artifact homes.

## Expected Compliant Behavior

- Routes first to `spec-design` and ends the cycle before planning or implementation.
- Passes `<project-root>/docs/specs/` as the home for new design artifacts.
- Uses `<os-temp>/shravan-dev-workflow/orchestrator-design/` only for optional scratch.
- Creates no project-local orchestration state, event log, counter, or handoff identity.

## Failure Signals

- Calls pathfinding, planning, or implementation first.
- Places design artifacts in OS temp.
- Proposes project-local lifecycle state.
