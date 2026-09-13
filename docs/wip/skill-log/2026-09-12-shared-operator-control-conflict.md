# Shared operator received conflicting control

- Observed: 2026-09-12
- Status: captured
- Skill/workflow: manage-agents 2.11.0 / parent, Sidekick and Operator coordination
- Task context: Swift test-only command cutover with serialized build ownership.
- Expected behavior: one parent owns an Operator's commands and cancellation; a Sidekick returns requested validation rather than independently controlling the same Operator.
- Observed behavior: parent and Sidekick queued alternative test commands to the same Operator. After parent said to stop further dispatch, the Sidekick interrupted the Operator's agent turn. Its shell command could remain active, so parent had to recover observation before another run.
- Evidence: AgentStudio keyboard-navigation validation; `zoom-cutover-webkit-green.log` captured the existing command's terminal zero-test failure. Operator recovery explicitly confirmed no command remained active before the next dispatch.
- Recurrence: multiple conflicting command messages and one agent interruption in this incident; broader frequency unknown.
- Impact: ambiguous next-command ownership and risk of duplicate builds; no duplicate active build or source mutation was established.
- Suspected cause: shared Operator reuse without exclusive control ownership in the job graph; not established as a skill implementation defect.
- Follow-up: parent became sole Operator coordinator; Sidekick was restricted to source/static-check receipts. No skill change authorized.
