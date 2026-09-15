# Persistent managed conversations

- `shravan-dev-workflow` 2.14.0: Worker/Reviewer roles, harness-specific execution nuance, subordinate labels, user-controlled Advisors and a shared 26-minute idle-continuation target without provider guarantees.
- Added the task-first rubric: task categories, Guidance, and Architectural span before role and model selection.
- Reorganized `manage-agents` around progressive H1-H4 definitions, selection, patterns, execution, and continuity sections.
- Restored Sol/Opus/Grok role choices by guidance and Architectural span; the orchestrator may be Frontier or Balanced, while the executor is chosen independently for task, context, and total cost.
- Sidekicks and Advisors use separate persistent conversations; reuse the same session across follow-ups and new assignments, including ACPX.
- Workers select native or separate conversations according to the task; reviewer independence and phase gates remain intact.
- Clarified the Agent Roles table with ownership, use, and continuity for Operators, Workers, Sidekicks, Reviewers, and Advisors.
- Clarified Codex Terra/Sol selection defaults, explicit user choice, relationship continuity, and evidence-based reassessment.
- Balanced execution may remain inline when it fits; only a transfer of orchestration to another session is user-selected, while executor assignment remains within task authority.
- `agent-router` 0.7.0: Router owns transport and delivery with no upward management, tracker, role, or 26-minute policy dependency; `plugin-sources.json` pins `agent-collaboration` to `a48871a9349a5b6044bbcf6d0f83c2877eacf347` (`Align collaboration skill with persistent agent relationships`, #57). `commit` may be a full SHA or a git ref so the pin can switch later.
- Updated management provider/session references, role callers and focused collaboration scenarios.
- Updated the Claude ACPX Opus selection example to the latest verified advertised id.
- Clarified blocking waits, authorized wakes, and shared idle-maintenance boundaries.
- Simplified Workflow dispatch coordination and removed the standalone job-planning reference; phase contracts are reused rather than duplicated in a second generic packet, with authority stated once and existing phase results accepted only after evidence.
- Added the `orchestrator-design`, `orchestrator-implementation-goal`, and `implement-plan` phase-entrypoint handoff contract.
- Committed driver-flow, phase-pointer, assignment-reuse, and collaboration-mirror edits; static validation only, with tests, additional review, and further pressure testing deferred.
- Focused pressure run: three semantic passes and one known wake-cadence failure; further pressure testing remains paused at owner request.
- Installed CLI/caches not upgraded; no production restart or home activation.
