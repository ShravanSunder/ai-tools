# 2026-09-29 manage-agents: classify, roles, models by role

`shravan-dev-workflow` 2.66.0.

- `manage-agents/SKILL.md` follows one spine: classify, role, model, launch, hand off, wait, verify. Each section uses the previous one's result by name.
- Classify defines direction (Exact, Complete, Partial), span (Local, Cross-domain, Cross-system), and horizon (Step, Planned, Open), and says what the plan does about each answer.
- The model catalog moves back into `SKILL.md` as Models: one table per role, with the criteria as columns. Daily-driver rows need a recorded reason. Luna high and max, Opus low, and Sol xhigh leave; Sol medium is owner-only; Sol leaves the review table.
- `agent-job-packet.md` absorbs `session-ledger.md` and says what goes where.
- Removed: the Authority section, rationalization tables, task categories, and the Sidekick commission section (`orchestrator-implementation-goal` and `implement-plan` own commissioning and stand-ins).
- 3,262 + 822 + 527 + 509 words become 1,114 + 528.

Validation: existing skills tests 123 passing, `claude plugin validate` passing. Refresh the plugin in Claude Code and Codex after merge.
