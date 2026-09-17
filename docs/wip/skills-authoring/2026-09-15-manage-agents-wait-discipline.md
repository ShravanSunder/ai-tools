# Manage-agents wait discipline

Date: 2026-09-15. This is a bounded WIP record for drafted management guidance and one pressure scenario; it is not an implementation approval or runtime proof. Earlier root self-check and basic whitespace/reference checks apply to the prior draft, not this current delta.

## Source and current state

- Owner-directed pickup: Router debate activity `69`, message `01a0a4e3-060a-7ad1-93ac-dbcac9eda65f`, in board `01a09d62-1b4c-7c71-95a3-864caa3e50b4`, topic `01a0a21b-7052-7db3-8bd1-a1de0aef2946`, root `01a0a21b-7065-70f3-ab0e-75d506159eba`.
- The request was relayed by the Fable design session (`actingFor: shravan`); its reported 78 turns, 411k tokens, wait loop, and scratchpad are unverified evidence, not benchmark claims. The owner separately authorized this bounded skill draft as user-directed intent.
- Earlier managed-agent work at `f029f5b8c5607f576f13ac7ea8aa7fd9bf1826fe` is a historical base, not current main; the old managed worktree is absent. The isolated draft branch is `feat/manage-agents-wait-discipline` at `/Users/shravansunder/dev/ai-tools.feat-manage-agents-wait-discipline`, with source drafts still uncommitted.

## Drafted bounded change

- In `manage-agents`, dispatch now leads to dependency-driven waiting: native child result uses host waiting/notification; board activity uses the supported `agent-collaboration` listener; future follow-up uses an authorized wake; owner decisions checkpoint and yield. Red flags cover reply-only list polling and periodic wakes where an available board listener should be used. One pressure scenario remains written but unrun.
- Keep scope to management guidance and that scenario. Add no roles, packet fields, ledger schema, provider-wide cache claims, or blanket model policy. The 2026-09-16 persistent-flow delta writes `manage-agents/SKILL.md`, `references/session-ledger.md`, and this checkpoint; it preserves the existing unstaged provider-reference and scenario drafts.
- A prior CLI mismatch is historical. Installed `agent-collaboration` 0.1.27 was verified with elevated participant list/join and `listen --once --max-wait 60s --no-acknowledge --actor self`, which returned a real batch with exit 0 (listen id `01a0a9c3-0fce-76e1-a5bb-708cdf99aa9d`). Guidance remains capability-gated: report an actual gap, recover supported access through `agent-collaboration`, and do not upgrade, invent aliases, or use an alternate transport after a permission denial.
- The canonical Router draft exists separately at `codex-router.listening/agent-skills/agent-collaboration`. Its pinned sync to ai-tools is deferred until the source commit; no commits are authorized in this draft-review boundary.

## Confirmed decision

- The owner explicitly rejected replacing a continuing session at the 26-minute maintenance target. Retain the same Sidekick/Advisor identity; the target neither forces a listener cadence nor establishes a cache refresh.
- The accepted revision 2.1 persistent-review workflow supersedes the earlier persistent-implementation-flow commission where they differ. No active maintenance or heartbeat interval remains. Preserve identity, accept cold resumes, and treat provider cache behavior as unknown unless observed.
- The primary Astra/Fable coordinator retains the user design conversation, design-artifact authorship, final report, and the board `orchestrator` seat. The named top-level implementation Sidekick joins as `implementer`; it plans, implements, integrates, proves, and may delegate bounded native Workers and Operators. Design gaps return to the coordinator.
- Every independent review lead is a separate persistent Review Sidekick with fresh author context on creation and its own history through corrections. Native read-only Workers support review lanes. Visible persistent names require a supported operation and returned-name verification; a ledger label alone is insufficient.

## Decisions still required
- Fable's fixed-model-per-thread, per-dispatch effort, separate flags, and never-fast-tier proposals need exact host semantics and user confirmation. Do not generalize them across providers.

## Proof and release boundary

Prior-draft root self-check plus basic whitespace/reference checks passed. The parent ran `git diff --check` for the earlier management delta with exit 0 and inspected its changed waiting paragraphs. The 2026-09-16 persistent-flow delta passed scoped `git diff --check` for the tracked management sources and awaits parent cohesion self-check; it has not received behavioral pressure proof or independent review. Per owner direction, no tests, pressure runs/evals, additional reviewers, commits, pushes, or installs have been performed. Source drafts remain uncommitted. Version, changelog, refresh, and publication metadata remain pending until this bounded slice is finalized.
