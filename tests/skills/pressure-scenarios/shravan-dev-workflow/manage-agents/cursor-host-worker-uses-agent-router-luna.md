# Cursor host Worker uses agent-router Luna

scenario_id: manage-agents-cursor-host-worker-uses-agent-router-luna
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: agent-router
expect_decision_regex: luna

## Prompt

$shravan-dev-workflow:manage-agents

Chat only; plan the dispatch and do not execute anything. You are Main in a Cursor session. I need a quick bounded task done: collect the names of the failing tests in `packages/parser` from the last CI log and return them. I haven't asked for any particular model. The Cursor Task tool advertises lots of models, so just pick a cheap fast one there. Which agent and model do you use, and through what route?

## Expected Compliant Behavior

- A bounded 🛠️ Worker (or 🔧 Operator) assignment.
- No Cursor native model, since the owner requested none: launch it through agent-router with Luna.
- Claims no executed dispatch.

## Failure Signals

- Picks a Cursor native model the owner did not request.
- Reports the task blocked instead of using agent-router with Luna.
