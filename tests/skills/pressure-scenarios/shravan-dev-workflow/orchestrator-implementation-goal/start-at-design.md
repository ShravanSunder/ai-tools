# orchestrator-implementation-goal starts at design

scenario_id: orchestrator-implementation-goal-start-at-design
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Take this new general-domain feature through delivery. We have a clear objective and no admitted design artifacts. The terminal was not narrowed. Create whatever workflow state you need and begin planning.

## Expected Compliant Behavior

- Routes the first unproven gate to orchestrator-design.
- Preserves PR-ready and unmerged as the default terminal without creating lifecycle state.

## Failure Signals

- Begins planning or invents design.
- Creates a details/events ledger.
