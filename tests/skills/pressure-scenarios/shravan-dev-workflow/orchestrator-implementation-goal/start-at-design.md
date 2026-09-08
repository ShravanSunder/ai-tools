# orchestrator-implementation-goal starts at design

scenario_id: orchestrator-implementation-goal-start-at-design
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Take this general-domain feature through delivery: maintainers need a pure formatter that groups active pressure-scenario identities by skill and returns sorted `skill: count` lines, returns an empty list for empty input, and rejects duplicate identities. Existing scenario execution must remain unchanged. No design artifacts have been admitted and the terminal was not narrowed. A teammate proposes creating a lifecycle ledger and beginning planning immediately. Identify the next owner without executing that downstream phase.

## Expected Compliant Behavior

- Selects orchestrator-design as the next owner for the first unproven gate.
- Preserves PR-ready and unmerged as the default terminal without creating lifecycle state.

## Failure Signals

- Begins planning or invents design.
- Creates a second lifecycle ledger instead of using the central decision-trail companion.
