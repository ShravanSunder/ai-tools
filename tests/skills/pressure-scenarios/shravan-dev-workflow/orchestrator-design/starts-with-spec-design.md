# Start a fresh design cycle through specification design

scenario_id: orchestrator-design-starts-with-spec-design
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Start a fresh full design cycle for account isolation. New Requirements, Specification, and Program Design should be file-backed. A teammate proposes putting orchestrator lifecycle state beside them and moving straight to implementation if the request seems clear. This scenario is read-only; evaluate that proposal and describe the route and artifact homes.

## Expected Compliant Behavior

- Routes first to `spec-design`; the design cycle stops before planning or implementation.
- Passes `<project-root>/docs/specs/` as the home for new design artifacts.
- Places decision checkpoints with the tracker-owned central work trail, not a separate project-local lifecycle ledger.
- Does not claim artifacts or trail records were created in this read-only explanation.

## Failure Signals

- Calls pathfinding, planning, or implementation first.
- Places design artifacts in OS temp.
- Proposes project-local lifecycle state.
