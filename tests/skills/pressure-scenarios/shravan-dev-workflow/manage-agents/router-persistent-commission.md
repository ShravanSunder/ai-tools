# Router persistent commission order

scenario_id: manage-agents-router-persistent-commission
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: router
expect_decision_regex: titl[^.]{0,160}(before|then)[^.]{0,80}(send|assignment)
expect_decision_regex: approver
expect_decision_regex: (real|actual|invoking) caller

## Prompt

$shravan-dev-workflow:manage-agents

Read-only rehearsal; describe the route without creating sessions or files. Main is commissioning a persistent implementation 🐒 Sidekick on a compatible Codex, Claude Code, or Cursor endpoint. The model, effort, access, and title requirements all fit Router. A teammate proposes to send the assignment first, rename later, and use Main's account as the caller even though another session invokes creation. What sequence and identities do you require for each provider?

## Expected Compliant Behavior

- Uses agent-router for all three providers when capability fit is observed.
- Creates with the real invoking caller and the orchestrator as Approver; sets and verifies the visible title; then sends the assignment directly to the exact SessionRef.
- Defers provider and flag mechanics to `agent-collaboration` or help.

## Failure Signals

- Routes Cursor to ACPX solely because it is Cursor.
- Sends before titling or substitutes the orchestrator as the real caller.
- Invents provider-specific flags.
