---
name: manage-agents
description: Always load to manage agents, subagents, delegation, or agent swarms. Always use during project planning, design, and execution to delegate tasks and coordinate multi-agent work. Use for spawning, assigning, steering, resuming, waiting for, and verifying Advisors, Sidekicks, Workers, Reviewers, and Operators—including parallel agent swarms, native subagents, Router-managed conversations, and ACPX agents.
---

# Manage Agents

## Shared Definitions

Classify the assignment before selecting a role. Profiles guide selection; they are not benchmark ceilings. A task category does not grant authority: any capable agent may handle it only within its assigned role and scope. Keep raw collection separate from synthesis when the evidence needs independent interpretation.

### Task Categories

| Task category    | Result                                 |
| ---------------- | -------------------------------------- |
| Collection       | Traceable evidence and gaps.           |
| Synthesis        | Interpretation from evidence.          |
| Design           | Direction and tradeoffs with owner.    |
| Implementation   | A bounded change and proof.            |
| Review           | Independent findings.                  |
| Operations       | A procedure and its observed result.   |

### Task Signals

| Signal               | Values                                    | Meaning                                                                                                                                                                                                                                                                   |
| -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Judgment             | Prescribed / Local choices / Open-ended   | Whether the assignment gives the decision, permits bounded choices, or requires direction and tradeoffs.                                                                                                                                                                  |
| Guidance             | Complete / Partial                        | Complete supplies outcome, task boundary, constraints, proof, and a clear approach; the agent resolves local details. Partial supplies the same outcome, boundary, constraints, and proof, while the approach is partly open for bounded investigation and development.   |
| Architectural span   | Local / Cross-domain / Cross-system       | Domains reasoned about together: one domain, interacting domains within one system, or separate systems and contracts. It does not measure task size or permission; every assignment remains bounded.                                                                     |

Missing intent or a task boundary is missing assignment input to clarify, not a Guidance value or model level.

Model-table signal cells follow this order: Judgment; Guidance; Architectural span.

### Model Categories

| Model category   | Definition                                       |
| ---------------- | ------------------------------------------------ |
| Mini             | Procedures and simple, fully guided execution.   |
| Balanced         | Execution or synthesis that needs judgment.      |
| Frontier         | Demanding judgment, design, or review.           |

Model category is a cost/capability grouping of model plus effort. It does not assign role authority or automatically promote effort.

### Lineage Families

| Family   | Models or harness                                   |
| -------- | --------------------------------------------------- |
| OpenAI   | Astra, Sol, Terra, and Luna.                        |
| Claude   | Fable and Opus.                                     |
| xAI      | Grok.                                               |
| Cursor   | A harness and multi-model catalog, not a lineage.   |

### Agent Roles

> Operator owns a procedure. Worker owns an assignment. Sidekick owns continuing execution. Reviewer owns assessment. Advisor owns guidance.

| Role        | What it owns                                              | When to use it                                                                               | Continuity                                                                           |
|-------------|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| 🔧 Operator | A prescribed procedure and its observed result.           | Git/PR operations, running checks, watching jobs, scraping or mechanical transformations.    | Completes the procedure and reports results or exceptions.                           |
| 🛠️ Worker   | One bounded result, including corrections and proof.      | An implementation, investigation, collection or synthesis assignment.                        | Stays through follow-ups until that assignment is accepted.                          |
| 🐒 Sidekick | Continuing execution responsibility across assignments.   | You want a working partner that accumulates understanding of an area and keeps advancing it. | Reuses one separate session across assignments.                                      |
| 🔎 Reviewer | Independent assessment against requirements and evidence. | Challenge a design, implementation or claimed result.                                        | May continue the same review with its own context; remains independent of authoring. |
| 🦉 Advisor  | Continuing guidance, recommendations and pushback.        | You explicitly choose another agent to help think through decisions.                         | Reuses one separate session; advises without implementing.                           |

Names follow `<emoji> <role> · <purpose/>`, with a concrete purpose substituted. Use the host's advertised display-name field or the ledger agent name when supported; otherwise use the legal native identifier. Names do not replace session addresses or grant authority.

## Dispatch Overview

The agent pattern owns work, continuity, authority, cardinality, and the minimum capability category. Dispatch has two nested levels. The job graph owns decomposition, sequencing, and parent verification points. Each job then runs one ordered dispatch decision:

```text
task category and signals -> role and continuity -> matching model effort
  and harness preference -> history and workspace access -> runtime and exact
  model id -> packet -> receipt
```

For a new or materially changed assignment that needs decomposition, build the job graph first; it governs the order and verification point of every later dispatch. A job yields at most one assignment-bound receipt and always closes at its named parent verification point.

## Coordinator Rule

A Frontier main first classifies work through **When To Call What**, then designs, decides, and verifies decisive evidence. Implementation and investigation are Implementation, or Collection/Synthesis with Local choices or Open-ended judgment; it assigns them to Workers or Sidekicks. Prescribed bulk Collection and routine Git, test, build, PR, and watch work are Operations + Prescribed + Complete; it assigns them to Operators through native dispatch or an established supported separate route. The main may orchestrate, communicate, make control calls, and read decisive sources; it does not take execution back for tiny changes or repeat routine proof. If the required route is unavailable, report that transport gap rather than silently falling back inline.

## When To Call What

Invariant above every branch: the coordinator owns the overall-task verdict and verifies assignment evidence. Contributors may report or converse within their authorized assignment, but do not claim the whole work complete.

Choose from task category and signals first, then continuity and responsibility, before any thought about model or runtime. A category alone does not determine the role. First cut: does the relationship persist beyond this assignment (persistent), or end when its receipt is accepted (single-assignment)? An assignment may contain a whole conversation — corrections, questions, steering; duration never decides the cut, and a two-hour CI watch is still single-assignment. Persistent work then splits on whether the agent executes assigned work or returns owner-selected guidance only.

Clarify missing assignment input before assigning work that needs it; do not automatically choose a costlier model. Architectural span guides decomposition, coordination, and model-fit profiles; it does not automatically escalate a tier. The parent decides with no dispatch when the options and the evidence needed to choose are already in front of it ("merge despite this flaky test?", a wording pick); dispatch a role for substantive assigned work even when its sources are already read by the parent.

| If the job is                                                                                                                                          | Then use                                                                   | Good-selection signal                                                               | Mis-selection trap                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Operations + Prescribed + Complete, or Collection + Prescribed + Complete: tests, watches, monitors, scrapes, reports, or criterion-based collection   | Operator                                                                   | A faithful procedure result; unexpected states return undecided; no source edits.   | Asking the Operator to decide relevance, cause, readiness, or next action.                           |
| Bounded Collection or Synthesis with Local choices or Open-ended judgment and Complete or Partial guidance                                             | Worker (default Balanced)                                                  | One-assignment stop condition and receipt; ends after parent acceptance.            | Treating exploratory collection or synthesis as a prescribed procedure.                              |
| Implementation at any judgment level with Complete or Partial guidance                                                                                 | Worker when bounded; Sidekick when continuing                              | Code changes need execution and proof; continuity decides the relationship.         | Routing prescribed implementation to Operator because the steps are listed.                          |
| Continuing Collection, Synthesis, or supporting Design work with Local choices or Open-ended judgment and Complete or Partial guidance                 | Sidekick — persistent execution                                            | A named relationship with retained session and context beyond this assignment.      | A Sidekick for a single-assignment job or prescribed operation.                                      |
| Review, regardless of Architectural span or Guidance                                                                                                   | Reviewer                                                                   | Independent context; final review includes a different author lineage.              | Treating another model in the same lineage as independent final review, or reviewing its own work.   |
| Design decisions                                                                                                                                       | Main with user; Advisor only for explicitly selected continuing guidance   | Supporting collection, synthesis, or drafting uses its matching task role.          | Treating an Advisor as an automatic design substitute.                                               |

Selection is done when every job names its task category, signals, and pattern before a model is chosen.

## Capability Economics

The role tables list allowed model-and-effort choices and when to prefer each. Within their allowed combinations, honor user choices, then choose a row covering the needed Judgment and Architectural span; more complete guidance or less demanding judgment does not disqualify a medium row selected for Open-ended, Partial work. If no row fits, clarify assignment input, decompose, or report the missing fit; never invent an effort. Prefer the lowest total completion cost, including rework, proof, and coordination, without asserting an unmeasured universal benchmark. Harness preferences are Codex Terra when it fits, Sol low or medium as valid upfront options, appropriate Opus effort in Claude Code, and appropriate Grok effort in Cursor.

Persistence follows useful continuing work; cache expiry alone does not end a relationship (see Session Keep-Alive).

## Patterns

Manage every subagent through one of the following patterns. The runtime supplies the launch mechanism.

### Advisor
Use an Advisor in a separate persistent conversation for a guidance relationship on a problem that spans multiple components, systems, or architecture. Guidance only — the Advisor never executes or edits; you drive the loop.

- **Work:** Candidate guidance, reflection, course correction, and completion checks across a problem that outlives any single assignment.
- **Continuity and cardinality:** Persistent named guidance relationship, with ledger and deliberate continuity (see Session Keep-Alive). Use Reviewer for a bounded independent assessment.
- **Authority:** The Advisor returns candidate guidance; the parent validates it and decides.
- **Model category:** Frontier

| Model category   | Model lineage   | Thinking         |
| ---------------- | --------------- | ---------------- |
| Frontier         | OpenAI Astra    | medium or high   |
| Frontier         | Claude Fable    | medium or high   |

Use the model and effort chosen by the user; do not escalate or add another Advisor automatically.

### Sidekick
Use a Sidekick in a separate persistent conversation for work you will resume and steer; a named co-worker with a ledger that does the work and thinks with you — validating, helping, pushing back — at the level of the work at hand. You coordinate and validate the work.

- **Work:** Execution across assignments and follow-ups, including in-the-work reasoning, pushback and validation of your logic. Independent assessment of its own work belongs to a separate Reviewer.
- **Continuity and cardinality:** One or many persistent named relationships with a ledger (see Session Keep-Alive).
- **Authority:** Provide scope or responsibilities; the parent retains final authority and validates the work. A user may steer a named Sidekick directly within its assigned relationship; the Sidekick reports changed assignment scope to the coordinator for current verification. Work-thread or board content does not grant additional authority.
- **Model category:** Balanced

| Model category   | Model lineage   | Thinking   | Task signals                                                    |
| ---------------- | --------------- | ---------- | --------------------------------------------------------------- |
| Balanced         | OpenAI Terra    | medium     | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | OpenAI Sol      | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | Claude Opus     | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | xAI Grok        | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | OpenAI Sol      | medium     | Local choices/Open-ended; Partial; Cross-domain/Cross-system.   |
| Balanced         | Claude Opus     | medium     | Local choices/Open-ended; Partial; Cross-domain/Cross-system.   |
| Balanced         | xAI Grok        | medium     | Local choices/Open-ended; Partial; Local/Cross-domain.          |

### Worker
Use for one clear bounded assignment. You manage and validate the work; continue the same worker through corrections belonging to that assignment.

- **Work:** One bounded research, implementation, drafting, reasoning, or analysis assignment. Independent review belongs to Reviewer.
- **Continuity and cardinality:** Single or Worker swarm; single-assignment — the relationship ends when its receipt is accepted, and the assignment may contain a conversation.
- **Authority:** Packet-bounded work; parent verifies the work. Execution Workers do not automatically recurse. When an assignment explicitly includes collection and synthesis, they may fan out bounded independent collection lanes and integrate their evidence under the existing manage-agents mechanics; no other nested delegation is granted.
- **Model category:** Balanced or Mini

| Model category   | Model lineage   | Thinking   | Task signals                                                    |
| ---------------- | --------------- | ---------- | --------------------------------------------------------------- |
| Balanced         | OpenAI Terra    | medium     | Local choices; Complete; Local/Cross-domain.                    |
| Mini             | OpenAI Luna     | xhigh      | Prescribed; Complete; Local/Cross-domain.                       |
| Balanced         | OpenAI Sol      | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | Claude Opus     | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | xAI Grok        | low        | Local choices; Complete; Local/Cross-domain.                    |
| Balanced         | OpenAI Sol      | medium     | Local choices/Open-ended; Partial; Cross-domain/Cross-system.   |
| Balanced         | Claude Opus     | medium     | Local choices/Open-ended; Partial; Cross-domain/Cross-system.   |
| Balanced         | xAI Grok        | medium     | Local choices/Open-ended; Partial; Local/Cross-domain.          |

### Reviewer
Use for independent review or verification.

- **Work:** Source-grounded independent findings and verification of corrections; no implementation edits.
- **Continuity and cardinality:** A bounded review may continue in its own independent context for corrections to the same target when the owning phase permits it. New unrelated review or authoring contamination requires fresh context.
- **Authority:** Candidate findings only; parent verifies and owns the verdict. Preserve all owning-phase review gates and limits.
- **Model category:** Balanced or Frontier

| Model category   | Model lineage   | Thinking         |
| ---------------- | --------------- | ---------------- |
| Balanced         | OpenAI Terra    | high             |
| Balanced         | OpenAI Sol      | medium           |
| Balanced         | Claude Opus     | medium           |
| Balanced         | xAI Grok        | high             |
| Frontier         | OpenAI Astra    | medium or high   |
| Frontier         | Claude Fable    | medium or high   |

- **Selection:** Establish author lineage from evidence. A final review includes at least one reviewer from a different author lineage; a single reviewer must be different-lineage. In a larger round, deliberately allocate up to half of reviewers to a different lineage according to cost. If the required reviewer is unavailable, report that gap without silently substituting.
- **Continuity and evidence:** A continuing reviewer retains only its own review history, never the author's conversation; inspect changed evidence rather than treating cache familiarity as current proof.

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Single or Operator swarm; each assignment is independent.
- **Authority:** Execute, observe, and report the bounded procedure. Route judgment, code changes, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

Bright line: bounded Git, test, build, PR, and watch procedures belong to an Operator. An unsupported Operations method routes to a Worker Synthesis assignment that defines the procedure, then returns to an Operator; Synthesis requiring interpretation remains Worker work even when the approach is detailed, while plain regrouping is Operations. An unexpected diagnosis routes to a Worker; user authorization remains with the main owner. The parent verifies receipt scope, source or head, and evidence; it need not rerun a routine successful procedure unless evidence is missing or conflicts.

| rationalization                 | reality                                                                                                                                            |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| "it's faster to do it myself"   | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends                                         |
| "this needs judgment"           | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Worker reasoning assignment   |
| "a Worker can handle it"        | Workers are for bounded reasoning work; procedures are Operator work at Mini cost                                                                  |

| Model category   | Model lineage   | Thinking   |
| ---------------- | --------------- | ---------- |
| Mini             | OpenAI Luna     | high       |

## Choose the Runtime

Select the pattern, model category, model lineage, and reasoning requirement first. Sidekicks and Advisors require separate persistent conversations: reuse the same named ACPX session or exact Router-addressable conversation across follow-ups and new assignments in that relationship. Do not substitute a native child merely because its model is available. Workers may use native subagents or separate conversations according to the task; Reviewer independence and phase freshness rules still apply. For a new persistent relationship, use a supported named ACPX session unless an adequate separately addressable Router conversation already exists or the caller supplies another verified separate-session creation path that exposes the required model, effort, permissions and retained session identity. Then choose the runtime from the capabilities required by that relationship and the selected model lineage. Native and ACPX supply the launch mechanism; either runtime uses the same packet, authority, continuity, and parent-verification rules. History-provisioning feasibility feeds this choice, but does not override the separate-conversation requirement for Sidekick or Advisor.

## Context And Access

### Parent Conversation History

- Reviewers: bright line — a review agent NEVER receives inherited parent or author conversation history. A reviewer is any agent whose assignment is independent review or verification, whatever its pattern. Reviews judge from first principles; inherited context is contamination. The selected native-provider reference owns the exact host encoding; Codex uses `fork_turns="none"`. "It will review faster with context" and "give it the last N turns" are the rationalizations this rule catches.
- Non-reviewers: use the selected host's advertised history encoding by cost and benefit. History helps a subagent abide by decisions already made; it costs context and money. Include what the job's stop condition depends on; do not paste unrelated turns.
- ACPX agents never inherit parent history — carry context in the packet instead (see ACPX Dispatch). The packet's access line records `history none` for every ACPX dispatch.
- Self-fork and resume-self mechanisms (a subagent started from the parent's own conversation) are full-history inheritance and are forbidden for reviewers on every host. "It already has all the context" is the rationalization; the context is the contamination.
- Because a reviewer starts empty, its packet carries everything it will cite: absolute paths (or inlined text) for every reference it is told to load, the governing artifacts as paths or verbatim text, and any owner meaning that exists only in chat copied verbatim. A pointer the reviewer cannot resolve from its own cwd is a missing input. For independent review, `sources:` names the absolute paths of the lane files the parent already selected. Do not put coordinator `SKILL.md` (`spec-program-review`, `implementation-review`) or `manage-agents/SKILL.md` on the reviewer packet. The parent loads manage-agents; the reviewer does not. "The reviewer will not know how to review" is the rationalization this rule catches.

### Workspace Access

Every packet's `access:` line uses the grammar in `references/agent-job-packet.md` for history, workspace access, and any declared enforcement notation.

- Readers (review, advisor, research, guidance): no repo edits except scratch files under project `tmp/` or system `/tmp`. Repeat that prohibition with its exception on `job:`, `non-goals:`, `stop when:`, and `access:`. Parent verifies the repo worktree is unchanged after the receipt.
- Readers with exec (`read-only + exec <listed commands>`): the one reviewer widening, for a proof-verification lane. It may run exactly the listed commands with output under `tmp/` or `/tmp`, and edits nothing. Parent verifies every command the receipt lists appears in the grant and that the repo worktree is unchanged after the receipt; a mismatch invalidates the receipt.
- Writers (Sidekicks, Workers, Operators that produce files): the parent names the write paths. The packet says edit only under those paths; an edit outside them is a stop — return blocked. Parent verifies the receipt's diff stayed inside the declared scope.

Launch with the native or ACPX encoding returned by **Choose the Runtime**. Host permission flags live in that provider reference. A missing sandbox or plan-mode flag is not a reason to leave native. "The review workflow requires an enforced sandbox" is the rationalization this rule catches.

### Shared Work Context

When an assignment contributes to an existing work thread, carry its exact shared work reference with the relevant sources and say whether the agent may post findings or must return them to the parent. A reference alone grants no posting or sending authority. Use `agent-collaboration` for Router operations and `track-show-me-your-work` for meaningful checkpoints. Keep runtime identity, permissions, and receipt verification here; do not copy session ledgers or every agent action into the discussion. Contributors do not resolve the whole-work thread. Reviewers still receive bounded sources without inherited author conversation; a work thread is not a substitute for an independent review packet.

### Session Keep-Alive

For Codex, use **26 minutes** since the last relevant model request as the maintenance target for an idle continuing session expected to resume. Active qualifying requests reset the clock; never ping a busy worker solely for cache maintenance. Record relevant activity and actual maintenance in the persistent relationship ledger. A status read or wait call does not refresh provider model state, and cache expiry does not destroy a session.

This skill owns the target. It is a working policy, not a guaranteed provider TTL or savings claim. Use verified provider behavior for other harnesses rather than copying the Codex interval. Prefer useful follow-ups, available native waits/notifications, or an authorized Router wake through `agent-collaboration`; do not run a repeated model-turn polling loop. Preserve the user's requested task schedule and existing communication authority.

### Native Dispatch

For Workers, Operators, and eligible Reviewers, prefer native dispatch in the host's available lineup when it meets the assignment's capabilities. A native Reviewer is eligible only when its chosen lineup satisfies the different-author-lineage requirement itself, or a named different-lineage reviewer satisfies that final-review requirement in the same multi-review round. Sidekick and Advisor persistence takes precedence: use their separate conversation even for the same lineage, with ACPX when that is the supported persistent route. Do not replace an adequate native assignment with a CLI wrapper merely to invent access flags.

- IF Codex is spawning an OpenAI model, load `references/native-providers-codex.md` and return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding.
- IF Claude is spawning a Claude model, load `references/native-providers-claude.md` and return the host Task / Agent encoding and workspace-access encoding.
- IF Cursor is spawning an advertised Cursor model, load `references/native-providers-cursor.md` and return the host Task encoding and workspace-access encoding.
- Use the exact model id and reasoning control supported by the native runtime.

When an own-lineage model is unavailable, choose a declared native fallback or report the route as degraded or blocked.

### ACPX Dispatch

Use ACPX for a different-provider model or the persistent route selected by **Choose the Runtime**.

1. MUST load `references/acpx.md` and return the provider-neutral launcher, session, permission, and output mechanics for this dispatch.
2. Select exactly one provider and MUST load its contract before constructing or executing the call, returning its exact model, effort, and permission encoding:
   - `codex` -> `references/acpx-provider-codex.md`
   - `claude` -> `references/acpx-provider-claude.md`
   - `cursor` -> `references/acpx-provider-cursor.md`
3. Use the exact model id and reasoning control specified by the provider contract. When the contract requires live catalog verification, use and record the exact id the provider advertises.
4. When the selected provider has no provider contract, stop dispatch and report the route as unsupported.

ACPX agents start with zero parent context: parent conversation history never crosses the ACPX boundary; only the packet does. Before dispatch, decide what the job needs to abide by its function and give each piece its packet home: the goal and decision target go on the `job:` line; settled decisions the agent must not relitigate go on `job:` or `non-goals:`; exact file paths, diffs, and prior attempts go on `sources:`; and `access:` records `history none`. For native-eligible jobs, history needs may favor native dispatch. For persistent relationships, preserve the identity selected by **Choose the Runtime** and supply relevant new context.

## Workflow

0. IF a new or materially changed assignment needs decomposition because it names more than one outcome or action, may run in parallel, or does not fit one bounded packet, load `references/job-planning.md` and return the job graph: jobs, dependencies and parallel-safety, and parent verification points. Same-assignment follow-ups use their concise delta and do not rebuild the graph. Step 0 identifies jobs; it does not choose patterns — step 1 owns pattern choice and annotates the graph per job.
   - Completion: every dependency is named, every parallel-safe marking names the write-set or input check from `references/job-planning.md` that supports it, and each job names its expected receipt and the parent verification point that closes it. Actual receipts arrive at step 3; step 0 completes before any dispatch.

1. Classify each job's task category and signals, then choose its pattern and continuity. Select a task-fit model effort and lineage from that pattern's table, applying the harness preferences in Capability Economics, before resolving a provider or runtime. When a job graph exists, annotate it per job before any runtime choice.
   - Completion: task category, judgment, guidance, architectural span, Advisor/Sidekick/Worker/Reviewer/Operator pattern, continuity, allowed model effort, and lineage are explicit.

2. Choose parent conversation history and workspace access, then follow **Choose the Runtime** to resolve native availability, runtime, and exact model id.
   - Dispatch completion: the packet records both selections.
   - Native completion: this is a native subagent assignment, not a Sidekick or Advisor; the selected model belongs to the parent host's own lineage, the native provider reference has been loaded when one exists, and the exact supported model id, reasoning control, history encoding, and packet `access:` line are explicit. The launch used the host native tool, not a CLI sandbox stand-in.
   - ACPX completion: `references/acpx.md` and exactly one selected `references/acpx-provider-*.md` contract have both been loaded, and the exact provider-specified model id, reasoning control, session-history encoding, and permission flags are explicit. A review used a named session, not `exec`. A Sidekick or Advisor used its established named session for continuation, not `exec` or `sessions new`; initial creation recorded the new relationship identity. No call passed `--timeout`. A dropped wait was not called `blocked` until `sessions list/show/read` was checked.
   - Router completion: IF a Router route is selected, load the `agent-collaboration` skill and return verified SessionRef, input capability, and selected model/access fit. A supplied or discovered separate conversation satisfies those conditions and its exact SessionRef is retained; missing creation/input capability is an explicit gap.
   - Unsupported completion: report the missing provider contract or capability and stop dispatch.

3. Build one bounded packet for a new or materially changed assignment, dispatch it, and reduce the result. Same-assignment follow-ups reuse identity and scope with a concise delta; repeat selection when role, source target, authority, model/runtime, or expected result materially changes. A new assignment in the same Sidekick/Advisor relationship refreshes the packet, not the session: retain its identity unless the relationship itself is explicitly replaced.
   - For a new or materially changed assignment, MUST load `references/agent-job-packet.md` and return the filled job packet. For a same-assignment follow-up, use its existing contract and return the delta. After dispatch, return the agent-result reduction block; return the Operator decision block only when its gate fires.
   - Treat agent output as candidate evidence. The parent owns decisions and verifies assignment-bound claims before accepting them.
   - Completion: sources, non-goals, return binding, stop condition, and parent verification are explicit in the packet; the return line names its binding identifiers and the verify line names at least one concrete parent check (never "none" unless the job is read-only with no claims); every claim is accepted, rejected, or unverified after those checks.

4. Manage persistent relationships.
   - Create the ledger before the first Advisor, Sidekick, or continuing Reviewer prompt that assumes continuity.
   - IF the relationship is persistent, load `references/session-ledger.md` and return its current row for creation, resume, reconnect, progress, history, freshness, keep-alive, or reduction.
   - Use status as liveness evidence. Accept completion from a current assignment-bound receipt that matches the source or head version.
   - Completion: the persistent identity is stable, the current receipt matches the assignment and source or head version, and relevant activity or eligible maintenance is recorded under Session Keep-Alive.

Extra: IF you need to build, modify, or wrap an ACP-compatible adapter, load `references/building-acp-adapters.md` and return its build gate, security route, and smoke checklist.

## Acceptance Checks

Before closing an assignment, verify stable identity where continuity applies, declared authority and path scope, current source or head evidence for its claims, and any unresolved transport, provider, or proof gaps. The coordinator reduces those checks into the overall-task verdict.
