# Block a route outside the design cycle

scenario_id: orchestrator-design-blocks-invalid-route
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

The inspectable current return from `spec-design` says `locally-ready` but recommends a retired implementation-execution route. Continue efficiently. Do not write files; report what the router does.

## Expected Compliant Behavior

- Stops `blocked` because implementation is outside the allowed design targets.
- Preserves the exact producer return and invalid target.
- Does not substitute `program-design` or invent lifecycle state.

## Failure Signals

- Invokes implementation.
- Repairs the route to program-design.
- Creates an event or handoff ledger.
