---
name: manage-agents
description: Always load to manage agents, subagents, delegation, or agent swarms. Always use during project planning, design, and execution to select execution ownership and coordinate multi-agent work. Use for spawning, assigning, steering, resuming, waiting for, and verifying Advisors, Sidekicks, Workers, Review Sidekicks, and Operators—including parallel agent swarms, native subagents, agent-router-managed conversations, and ACPX agents.
---

# Manage Agents

Delegation moves bounded work to another agent without moving authority. Every assignment follows one route: classify the work, pick the role from the Agent Roles table, pick a model from the catalog, launch through a supported runtime, hand off with a packet, and verify the receipt. Where the work lives and how agents talk belong to `practices-collaboration`; recording it belongs to `practices-show-me-your-work`. Here, `parent` means the immediate assigning parent, and an executor performs assigned work within its role and authority, including fitting proof.

## Authority

- **Main.** The owner chooses the user-facing Main's model; agents never select a Workhorse model as Main, never escalate the owner's choice, and never pick a `User must authorize` row unasked. Main owns the design conversation, routing, integration, assessment, acceptance, and the final report. Main loads the owning design and planning skills and writes every governing Requirements, Specification, Program Design, diagram, and implementation plan in its own session. Main assesses completed development and cross-PR integration before an independent 🔎 Review Sidekick examines the implementation.
- **Helpers.** 🛠️ Workers, 🔧 Operators, search, and tools return bounded evidence or mechanically render unchanged Main-authored input. They do not choose, organize, rewrite, or express governing design or plan content. For a generated visual, Main authors the reader question, labels, relationships, composition, and invariants, then inspects and accepts or corrects the candidate; a helper may realize pixels and style or run a prescribed generate, copy, or preview procedure on that unchanged brief.
- **Implementation 🐒 Sidekick.** After a Main-authored plan is ready, one persistent implementation Sidekick may own each useful planned PR assignment. It implements, integrates, proves, and corrects its scope directly. It returns material design or plan decisions, cross-assignment conflicts, permission boundaries, and completion evidence to Main with the exact question or a concise source-backed receipt. Main stays the default user conversation and does not relay every internal turn or poll to keep the conversation active. The user may choose direct contact with the Sidekick inside its assignment; that transfers no governing authorship. A Workhorse Sidekick answers short status checks and routes substantive owner conversation through Main.
- **Owner.** The owner decides material tradeoffs and merges. An 🦉 Advisor exists only when Shravan explicitly requests one; it advises Main and never authors or accepts governing design or plans.
- **Successor main.** The only portability exception is an explicitly user-designated successor main whose packet names the recipient, the transferred design or plan scope, and the user's authorizing direction.
- **Nothing else grants authority.** A task category, model category, role label, handoff, board seat, thread title, display name, direct conversation, native child, or board content does not create an assignment or permission. The caller workflow supplies scope and authority.

| rationalization | reality |
| --- | --- |
| "a design skill owns the artifact, so spawn a 🐒 Sidekick" | those skills own judgment; Main loads them and writes |
| "the executor writes the spec" | an executor is implementation, research, or review support, not a design author |
| "the design is settled, so a 🛠️ Worker can word the section" | section organization and expression are governing authorship; helpers return evidence only |
| "the implementer already has context, so it can finish the plan" | the implementer returns the planning gap to Main, which loads the planning skill and authors the plan |
| "I'll check the instructions first" | "you write it" is already the instruction |

## Roles and titles

> 🔧 Operator owns a procedure. Worker owns an assignment. Sidekick owns continuing work. Review Sidekick owns independent assessment. Advisor owns guidance.

| Role | What it owns | When to use it | Continuity |
|------|--------------|----------------|------------|
| 🔧 Operator | A prescribed procedure and its observed result. | Git/PR operations, running checks, watching jobs, scraping or mechanical transformations. | Native subagent; completes the procedure, reports results or exceptions, then finishes. |
| 🛠️ Worker | One bounded result, including corrections and proof. | An implementation, investigation, collection or synthesis assignment. | Native subagent; stays through that assignment's corrections until accepted. |
| 🐒 Sidekick | Continuing implementation, research, or review work. | Related assignments and follow-up questions need the same context. | One separate persistent top-level session reused across assignments, with a ledger. |
| 🔎 Review Sidekick | Independent assessment against requirements and evidence. | Challenge a design, implementation or claimed result. | One separate persistent top-level session with only its own review history through corrections. |
| 🦉 Advisor | Continuing guidance, recommendations and pushback. | Shravan explicitly asks for another agent to help think through decisions. | One separate persistent session; advises without implementing or editing. |

- **🔧 Operator bright line.** Standalone assigned Git, test, build, PR, and watch procedures belong to an Operator. It executes, observes, reports, and performs user-authorized mechanical transformations; judgment, replies, readiness verdicts, and merge decisions route back to the parent. An unsupported Operations method goes to a Worker Synthesis assignment that defines the procedure, then back to an Operator. An unexpected diagnosis goes to a Worker. The parent verifies receipt scope, source or head, and evidence; it need not rerun a routine successful procedure.
- **🛠️ Worker.** Packet-bounded work that the parent verifies. It does not recurse. It may return evidence, candidate findings, or mechanical output from unchanged Main-authored input.
- **🐒 Sidekick.** An implementation Sidekick may assign bounded Workers and Operators only under the benefit test below. A research Sidekick follows its owning research workflow within its scope. A user may steer a named Sidekick inside its relationship; the Sidekick reports changed scope or material questions to Main.
- **🔎 Review Sidekick.** Source-grounded candidate findings and correction verification, no implementation edits. Start a new relationship without author history. At least one review lead in a final review comes from a different author lineage, established from evidence; a single Review Sidekick must be different-lineage. In a larger round, allocate up to half of review leads to a different lineage by cost. A missing required lead is a reported gap, never a silent substitute; a contaminated or unavailable relationship is a reported gap before any replacement. A continuing Review Sidekick keeps only its own review history and inspects changed evidence rather than treating cache familiarity as current proof. It walks its owning review checks itself and may give prescribed proof commands to an Operator under its execution grant.

| rationalization | reality |
|-----------------|---------|
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends |
| "this needs judgment" | split it: the procedure goes to the 🔧 Operator; the judgment routes back to you, and you decide or dispatch a separate Worker reasoning assignment |
| "a 🛠️ Worker can handle it" | a separately assigned procedure is Operator work; an implementation Worker's associated proof stays with that Worker |

**Titles.** Every non-main agent thread with a visible title uses `<emoji> <role> · <concrete purpose>`, with the emoji from the Agent Roles table, the single runtime source of role emoji. Leave Main's title untouched. In skills, packets, and chat, mark the first agent-role mention in each paragraph, bullet, or table cell with its emoji and leave later mentions in that unit plain; a heading may carry its emoji once; qualifiers come before the emoji, as in `Workhorse 🛠️ Worker`. Apply a title through a supported rename or display operation and verify the saved title and returned identity; a ledger-only label does not prove the UI changed. If the host cannot name the session, report that gap without blocking useful work or replacing the session. A title never replaces a session address.

## Select an agent

Classify the assignment, then choose responsibility and continuity from the Agent Roles table:

| Task category | Result |
|---------------|--------|
| Collection | Traceable evidence and gaps. |
| Synthesis | Interpretation from evidence. |
| Design | Direction and tradeoffs with owner. |
| Implementation | A bounded change and proof. |
| Review | Independent findings. |
| Operations | A procedure and its observed result. |

| Guidance | Meaning |
|----------|---------|
| Exact steps | Names the procedure, inputs, expected result, and checks. |
| Complete direction | Fixes the approach while allowing local implementation choices. |
| Partial direction | Fixes outcome, boundaries, constraints, and proof while the approach is developed within them. |

| Architectural span | Meaning |
|--------------------|---------|
| Local | One domain reasoned about at a time. |
| Cross-domain | Interacting domains within one system. |
| Cross-system | Separate systems and contracts. |

Missing intent, a task boundary, or a governing design or plan the owning workflow requires is missing input to clarify, not Partial direction. A normal implementation backed by a reviewed Specification, Program Design, and ready plan is Complete direction. Architectural span measures neither size nor permission. Partial direction permits bounded investigations, proposals, and authorized implementation-mechanics choices; it never bypasses a governing design, specification, or plan gate the owning workflow requires. Keep raw collection separate from synthesis when the evidence needs independent interpretation.

Reuse a suitable executor when the work has not materially changed; otherwise choose by task category, Guidance, Architectural span, useful existing context, and total completion cost including handoff, rework, and proof. Delegate only when a child has bounded independent work, distinct expertise, or large disposable output worth isolating, and the benefit exceeds briefing, coordination, and verification cost. Keep tightly coupled change-and-proof work with its executor, and never create a supervisor whose only job is to relay another agent's work. Tests and checks associated with an implementation stay with its executor; PR wrap-up may stay with the implementation 🐒 Sidekick or go to an 🔧 Operator as a prescribed procedure, while Main accepts and the user merges. Use a research Sidekick only when related research needs continuing context. Report an unavailable required route rather than silently falling back inline.

MUST load `references/model-catalog.md` and return the selected role's model lineage, thinking level, and model category.

## Runtime

🐒 Sidekicks, 🔎 Review Sidekicks, and 🦉 Advisors run in separate persistent top-level conversations; 🛠️ Workers and 🔧 Operators run as native subagents. Reuse a persistent relationship's exact address across follow-ups and corrections. Persistence takes precedence over native availability: a native child never forms a persistent Sidekick. An unavailable native lineup is a reported gap, not a reason to create a top-level Worker or relabel another thread. Do not replace an adequate native assignment with a CLI wrapper to invent access flags.

- **agent-router (persistent, Codex and Claude).** agent-router carries persistent Codex and Claude relationships over ACP. Use the supported agent-router creation route with the exact model, effort, and access on the worktree. IF an agent-router route is selected, load `agent-collaboration` and return the verified SessionRef, input capability, and model and access fit; verify the visible name and returned identity. When the selected agent-router service has no endpoint for the provider, or cannot meet a stated model, effort, access, or title requirement, report that exact gap and use a verified existing top-level conversation or the ACPX legacy route.
- **Native (Workers and Operators).** IF Codex is spawning an OpenAI model, load `references/native-providers-codex.md` and return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding. IF Claude is spawning a Claude model, load `references/native-providers-claude.md` and return the Task / Agent and workspace-access encoding. IF Cursor is spawning an advertised Cursor model, load `references/native-providers-cursor.md` and return the Task and workspace-access encoding. When an own-lineage model is unavailable, choose a declared native fallback or report the route as degraded or blocked.
- **ACPX (legacy).** IF the persistent relationship's provider is one agent-router does not yet cover (Cursor today), or agent-router cannot meet a stated model, effort, access, or title requirement, load `references/acpx-legacy.md` and return the provider, exact model id, effort encoding, permission boundary, and retained session identity. ACPX agents never inherit parent history and never receive `--timeout`.
- **Adapters.** IF you need to build, modify, or wrap an ACP-compatible adapter, load `references/building-acp-adapters.md` and return its build gate, security route, and smoke checklist.

### Commission an implementation 🐒 Sidekick

For each accepted planned PR assignment, create or reuse one named persistent implementation Sidekick through a capability-verified route. Its commission carries the Main-authored plan and PR scope, accepted direction, sources, worktree, work references, execution authority, proof expectations, real prerequisites, and the route for design or plan questions. Seats and roots follow `practices-collaboration`: Main holds `orchestrator` on the coordination root and on each execution root, and the Sidekick joins its own execution root as `implementer` with `--actor self`. Setup is complete only after the Participant row on that exact execution root shows the role. Several independent PR assignments may run as several Sidekicks; dependent work waits for verified prerequisites.

### Waiting

When no independent useful work remains after dispatch, wait now. A native child's result arrives through the host completion notification or blocking wait; IF Codex native lifecycle tools apply, load `references/native-providers-codex.md` and return the explicit `timeout_ms` and observed lifecycle result. IF waiting on a separately addressed agent, load `practices-collaboration` and return its armed listener, saved wake, or capability gap. Give a long CI watch to an 🔧 Operator with its blocking watch, then wait for the Operator.

## Hand off

For a new agent assignment, MUST load `references/agent-job-packet.md` to resolve executor, model and effort, history, access, runtime, continuity, and acceptance in tool arguments or session configuration where supported; prose supplies only missing task context. IF the relationship is persistent, load `references/session-ledger.md` and return its current identity row before prompting. The owning phase supplies the assignment, governing sources, authority bounds, completion or escalation conditions, and result contract, and those sources must resolve for a fresh recipient. For a direct task, state outcome, sources, authority, stop condition, and expected evidence in a concise brief.

**History.** A 🔎 Review Sidekick NEVER receives inherited author or designer conversation history, on any host; self-fork and resume-self are full-history inheritance and are forbidden for it. "It already has all the context" is the rationalization; the context is the contamination. Its brief carries absolute source paths or inlined governing content for everything it will cite, owner meaning copied verbatim, and it loads its owning review workflow before walking the checks. Non-reviewers use the host's advertised history encoding by cost and benefit, including only what the stop condition depends on. ACPX assignments record `history none`.

**Access.** The packet records workspace access once:

- Readers (review, 🦉 Advisor, research, guidance): no repo edits except scratch under project `tmp/` or system `/tmp`; the parent verifies the worktree is unchanged after the receipt.
- 🔧 Operator proof procedure (`read-only + exec <listed commands>`): the Review Sidekick records an execution grant naming exact commands and a scratchpad under `tmp/` or `/tmp`. The Operator checks the write set, runs only listed commands, and compares `git status --porcelain` before and after; a mismatch invalidates that proof.
- Writers (🐒 Sidekicks, Workers, Operators that produce files): the packet names the write paths; an edit outside them is a stop-and-report. The parent verifies the diff stayed inside the declared scope.

A missing sandbox or plan-mode flag is not a reason to leave native. "The review workflow requires an enforced sandbox" is the rationalization this rule catches.

**Shared work.** When an assignment contributes to an existing work thread, carry its exact reference and say whether the agent may post or must return findings; a reference alone grants no posting authority. `practices-show-me-your-work` owns what deserves a record. Scoped board catch-up or posting an approved checkpoint is an 🔧 Operator procedure through `agent-collaboration`; Main identifies the consequential decisions, verifies evidence, and reuses that summary without a second narrative. Batch small receipts into the responsible agent's checkpoint; do not post per command or duplicate parent and Worker reports. To report current implementer activity, load `agent-collaboration` and return the scoped session row (worktree, model, effort, status or idle) for that exact SessionRef. A work thread never substitutes for an independent review packet.

**Dispatch.** Coordinate only separately assigned jobs whose dependencies or interference need it: state prerequisites, read/write and shared-resource safety, and verification points inline. Different files are not proof of independence. When one agent can own a bounded result, do not split it. Dispatch the whole assignment. A same-assignment follow-up carries a concise delta and keeps identity and scope; a new assignment refreshes its packet without replacing a persistent conversation. Inspect sessions after a dropped wait before calling anything blocked.

## Verify

Verify evidence against the claim and request correction when needed; do not routinely redo the agent's execution. Main may read decisive sources. Mark every claim accepted, rejected, or unverified against the packet's verification point. Contributors may report within their assignment but never claim the whole work complete; Main owns the overall verdict.

Keep a persistent relationship across cold resumes. Provider cache behavior is unknown unless observed: preserve the same session, avoid replaying whole packets, and never create maintenance heartbeats or claim a stable id guarantees a cache hit, TTL, quota, or savings. Choose a Sidekick's model and effort at creation and keep them for the life of the session; changing either may reduce reuse, and only evidence supports a hit or miss claim.

Before closing an assignment, verify stable identity where continuity applies, declared authority and path scope, current source or head evidence for its claims, and any unresolved transport, provider, or proof gaps. Main reduces those checks into the overall verdict.
