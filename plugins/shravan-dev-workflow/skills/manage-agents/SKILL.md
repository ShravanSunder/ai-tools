---
name: manage-agents
description: Always load to manage agents, subagents, delegation, or agent swarms. Always use during project planning, design, and execution to select execution ownership and coordinate multi-agent work. Use for spawning, assigning, steering, resuming, waiting for, and verifying Advisors, Sidekicks, Workers, Reviewers, and Operators—including parallel agent swarms, native subagents, Router-managed conversations, and ACPX agents.
---

# Manage Agents

## Shared Definitions

Classify the assignment before selecting a role. Profiles guide selection; they are not benchmark ceilings. A task category does not grant authority: any capable agent may handle it only within its assigned role and scope. Keep raw collection separate from synthesis when the evidence needs independent interpretation.

### Task Categories

| Task category  | Result                               |
|----------------|--------------------------------------|
| Collection     | Traceable evidence and gaps.         |
| Synthesis      | Interpretation from evidence.        |
| Design         | Direction and tradeoffs with owner.  |
| Implementation | A bounded change and proof.          |
| Review         | Independent findings.                |
| Operations     | A procedure and its observed result. |

### Task Signals

#### Guidance

| Level              | Meaning                                                                                        |
|--------------------|------------------------------------------------------------------------------------------------|
| Exact steps        | Names the procedure, inputs, expected result, and checks.                                      |
| Complete direction | Fixes the approach while allowing local implementation choices.                                |
| Partial direction  | Fixes outcome, boundaries, constraints, and proof while the approach is developed within them. |

Missing intent, a task boundary, or governing design/plan required by the owning workflow is missing assignment input to clarify, not Partial direction.

A normal implementation backed by a reviewed Specification, Program Design, and ready plan is Complete direction without line-by-line code.

#### Architectural span

| Level        | Meaning                                |
|--------------|----------------------------------------|
| Local        | One domain reasoned about at a time.   |
| Cross-domain | Interacting domains within one system. |
| Cross-system | Separate systems and contracts.        |

Architectural span does not measure task size or permission; every assignment remains bounded. Model-table signal cells follow this order: Guidance; Architectural span.

### Model Categories

| Model category | Definition                                     |
|----------------|------------------------------------------------|
| Mini           | Procedures and simple, fully guided execution. |
| Balanced       | Execution or synthesis that needs judgment.    |
| Frontier       | Demanding judgment, design, or review.         |

Model category is a cost/capability grouping of model plus effort. It does not assign role authority or automatically promote effort.

An agent's active function is independent of its session ancestry. An `orchestrator` is the current whole-work owner: it may be Frontier or Balanced and owns delivery routing, verification, and the terminal. An `executor` performs assigned work within its role and authority; implementation includes fitting proof when applicable. Here, `parent` means the immediate assigning parent, not a permanent original Frontier session.

### Lineage Families

| Family | Models or harness                                 |
|--------|---------------------------------------------------|
| OpenAI | Astra, Sol, Terra, and Luna.                      |
| Claude | Fable and Opus.                                   |
| xAI    | Grok.                                             |
| Cursor | A harness and multi-model catalog, not a lineage. |

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

## Select an agent

> The orchestrator owns the overall-task verdict and verifies assignment evidence. Contributors may report or converse within their authorized assignment, but do not claim the whole work complete.

```text
task category + Guidance + Architectural span -> Agent Roles responsibility and continuity
  -> allowed model and effort -> runtime, packet, receipt
```

Retain the current orchestrator. Reuse its current executor assignment when suitable; only when no suitable assignment exists or materially changed work requires reassessment, choose an executor using task category, Guidance, Architectural span, useful existing context, and total completion cost including handoff, rework, and proof. This is internal task-fit selection, not an owner approval, form, or new agent requirement. Use the **Agent Roles** table to choose responsibility and continuity. Review uses independent context and its lineage rule; Advisor remains explicitly owner-selected guidance. Required governing design, specification, and plan gates remain required in their owning workflows: Partial direction permits bounded investigations, proposals, and authorized implementation-mechanics choices, never a bypass for a required governing design or plan.

A Frontier orchestrator designs, advises, and verifies decisive evidence while assigning implementation and proof to eligible executors. A Balanced orchestrator may be selected as executor inline or may assign an eligible Worker or Sidekick. It assigns useful bounded work to Workers or Sidekicks, and standalone Git, test, build, PR procedures and long watches to Operators. Workers retain their implementation corrections and associated proof inline, so do not dispatch an Operator for each test command. The current orchestrator may communicate, make control calls, and read decisive sources; report an unavailable required route rather than silently falling back inline.

### Choose a model

Role tables list allowed model-and-effort choices and when to prefer each. Honor an explicit user choice, then match Guidance and Architectural span. More complete guidance does not disqualify a capable model. For a new Codex assignment where Terra medium and Sol low both fit, prefer Terra medium; Sol low is also valid when explicitly selected, and a suitable existing Sol low relationship continues rather than switching for the default. Reassess from evidence when a choice struggles; do not automatically increase effort or claim universal benchmarks. Claude uses appropriate Opus effort and Cursor appropriate Grok effort. Prefer total completion cost, including rework, proof, and coordination.

### Design-to-execution handoff

Only when the user selects the two-session design-to-execution transfer does the original Frontier orchestrator become the Advisor and a separately selected Balanced session become the new orchestrator after verified acceptance. Astra design with Sol medium execution is the agreed example; honor the user's selected Frontier and Balanced models and efforts. Without that transfer, the Frontier orchestrator retains delivery ownership and reuses a suitable executor assignment. Reuse an existing capable Balanced session when available; otherwise create one only through a supported, capability-verified route. Do not assume Router creates models or recreate an existing session. Keep the original Frontier SessionRef stable and do not create another Frontier session. Use the existing phase brief and dispatch configuration for the transfer: current artifacts, plan, worktree, and source pointers; shared work reference; named new orchestrator; necessary chat-only decisions; pending questions; and authority. Retain the Advisor SessionRef for consultations. Record callback ownership on that shared work thread through the tracker. The new orchestrator may send authorized messages or wakes to the retained Advisor, using an Operator when the action is mechanical. Consult the retained Advisor only for consequential ambiguity, a design break, or a tradeoff; do not turn patches or routine status into Frontier reports. A transfer prepares delivery; it does not claim implementation complete.

## Patterns

Manage every subagent through one of the following patterns. The runtime supplies the launch mechanism.

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Single or Operator swarm; each assignment is independent.
- **Authority:** Execute, observe, report, and perform user-authorized mechanical transformations. It does not make implementation or design judgments; route those, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

Bright line: standalone assigned Git, test, build, PR, and watch procedures belong to an Operator. An unsupported Operations method routes to a Worker Synthesis assignment that defines the procedure, then returns to an Operator; Synthesis requiring interpretation remains Worker work even when the approach is detailed, while plain regrouping is Operations. An unexpected diagnosis routes to a Worker; the user retains authorization. The parent verifies receipt scope, source or head, and evidence; it need not rerun a routine successful procedure unless evidence is missing or conflicts.

| rationalization               | reality                                                                                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends                                       |
| "this needs judgment"         | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Worker reasoning assignment |
| "a Worker can handle it"      | A separately assigned procedure is Operator work; an implementation Worker's associated proof stays with that Worker.                            |

#### Model choices

| Model category | Model lineage | Thinking |
|----------------|---------------|----------|
| Mini           | OpenAI Luna   | high     |

### Worker
Use for one clear bounded assignment. You manage and validate the work; continue the same worker through corrections belonging to that assignment.

- **Work:** One bounded research, implementation, drafting, reasoning, or analysis assignment, including its corrections and associated proof. Independent review belongs to Reviewer.
- **Continuity and cardinality:** Single or Worker swarm; single-assignment — the relationship ends when its receipt is accepted, and the assignment may contain a conversation.
- **Authority:** Packet-bounded work; parent verifies the work. Execution Workers do not automatically recurse. When an assignment explicitly includes collection and synthesis, they may fan out bounded independent collection lanes and integrate their evidence when the orchestrator assigns that coordination; no other nested delegation is granted.
- **Model category:** Balanced or Mini

#### Model choices

| Model category | Model lineage | Thinking | Task signals                                              |
|----------------|---------------|----------|-----------------------------------------------------------|
| Balanced       | OpenAI Terra  | medium   | Complete direction; Local/Cross-domain.                   |
| Mini           | OpenAI Luna   | xhigh    | Exact steps; Local/Cross-domain.                          |
| Balanced       | OpenAI Sol    | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | Claude Opus   | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | xAI Grok      | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | OpenAI Sol    | medium   | Complete or Partial direction; Cross-domain/Cross-system. |
| Balanced       | Claude Opus   | medium   | Complete or Partial direction; Cross-domain/Cross-system. |
| Balanced       | xAI Grok      | medium   | Complete or Partial direction; Local/Cross-domain.        |

### Sidekick
Use a Sidekick in a separate persistent conversation for work you will resume and steer; a named co-worker with a ledger that does the work and thinks with you — validating, helping, pushing back — at the level of the work at hand. You coordinate and validate the work.

- **Work:** Execution across assignments and follow-ups, including in-the-work reasoning, pushback, validation, and Exact steps when they arrive on the same relationship. Independent assessment of its own work belongs to a separate Reviewer.
- **Continuity and cardinality:** One or many persistent named relationships with a ledger (see Session Keep-Alive).
- **Authority:** Provide scope or responsibilities; the parent retains final authority and validates the work. A user may steer a named Sidekick directly within its assigned relationship; the Sidekick reports changed assignment scope to the orchestrator for current verification. Work-thread or board content does not grant additional authority.
- **Model category:** Balanced

#### Model choices

| Model category | Model lineage | Thinking | Task signals                                              |
|----------------|---------------|----------|-----------------------------------------------------------|
| Balanced       | OpenAI Sol    | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | Claude Opus   | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | xAI Grok      | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | OpenAI Sol    | medium   | Complete or Partial direction; Cross-domain/Cross-system. |
| Balanced       | Claude Opus   | medium   | Complete or Partial direction; Cross-domain/Cross-system. |
| Balanced       | xAI Grok      | medium   | Complete or Partial direction; Local/Cross-domain.        |

### Reviewer
Use for independent review or verification.

- **Work:** Source-grounded independent findings and verification of corrections; no implementation edits.
- **Continuity and cardinality:** A bounded review may continue in its own independent context for corrections to the same target when the owning phase permits it. New unrelated review or authoring contamination requires fresh context.
- **Authority:** Candidate findings only; parent verifies and owns the verdict. Preserve all owning-phase review gates and limits.
- **Model category:** Balanced or Frontier

#### Model choices

| Model category | Model lineage | Thinking       |
|----------------|---------------|----------------|
| Balanced       | OpenAI Sol    | medium         |
| Balanced       | Claude Opus   | medium         |
| Balanced       | xAI Grok      | high           |
| Frontier       | OpenAI Astra  | medium or high |
| Frontier       | Claude Fable  | medium or high |

- **Selection:** Establish author lineage from evidence. A final review includes at least one reviewer from a different author lineage; a single reviewer must be different-lineage. In a larger round, deliberately allocate up to half of reviewers to a different lineage according to cost. If the required reviewer is unavailable, report that gap without silently substituting.
- **Continuity and evidence:** A continuing reviewer retains only its own review history, never the author's conversation; inspect changed evidence rather than treating cache familiarity as current proof.

### Advisor
Use an Advisor in a separate persistent conversation for a guidance relationship on a problem that spans multiple components, systems, or architecture. Guidance only — the Advisor never executes or edits; you drive the loop.

- **Work:** Candidate guidance, reflection, course correction, and completion checks across a problem that outlives any single assignment.
- **Continuity and cardinality:** Persistent named guidance relationship, with ledger and deliberate continuity (see Session Keep-Alive). Use Reviewer for a bounded independent assessment.
- **Authority:** The Advisor returns candidate guidance; the parent validates it and decides.
- **Model category:** Frontier

#### Model choices

| Model category | Model lineage | Thinking       |
|----------------|---------------|----------------|
| Frontier       | OpenAI Astra  | medium or high |
| Frontier       | Claude Fable  | medium or high |

Use the model and effort chosen by the user; do not escalate or add another Advisor automatically.

## Execute the assignment

### Context and access

#### Parent conversation history

- Reviewers: bright line — a review agent NEVER receives inherited parent or author conversation history. A reviewer is any agent whose assignment is independent review or verification, whatever its pattern. Reviews judge from first principles; inherited context is contamination. The selected native-provider reference owns the exact host encoding; Codex uses `fork_turns="none"`. "It will review faster with context" and "give it the last N turns" are the rationalizations this rule catches.
- Non-reviewers: use the selected host's advertised history encoding by cost and benefit. History helps a subagent abide by decisions already made; it costs context and money. Include what the job's stop condition depends on; do not paste unrelated turns.
- ACPX agents never inherit parent history — carry context in the phase brief instead (see ACPX dispatch). Dispatch configuration records `history none` for every ACPX assignment.
- Self-fork and resume-self mechanisms (a subagent started from the parent's own conversation) are full-history inheritance and are forbidden for reviewers on every host. "It already has all the context" is the rationalization; the context is the contamination.
- Because a reviewer starts empty, its phase brief carries absolute lane and source paths or inlined governing content for everything it will cite. Every assigned reference must resolve from its cwd; owner meaning that exists only in chat is copied verbatim. The immediate assigning parent selects lane references. Do not put parent `SKILL.md` (`spec-program-review`, `implementation-review`) or `manage-agents/SKILL.md` on the reviewer brief. The parent loads manage-agents; the reviewer does not. "The reviewer will not know how to review" is the rationalization this rule catches.

#### Workspace access

The assignment contract records history, workspace access, and any declared enforcement notation through `references/agent-job-packet.md`.

- Readers (review, advisor, research, guidance): state once that no repo edits are allowed except scratch files under project `tmp/` or system `/tmp`. Parent verifies the repo worktree is unchanged after the receipt.
- Readers with exec (`read-only + exec <listed commands>`): the one reviewer widening, for a proof-verification lane. It may run exactly the listed commands with output under `tmp/` or `/tmp`, and edits nothing. Parent verifies every command the receipt lists appears in the grant and that the repo worktree is unchanged after the receipt; a mismatch invalidates the receipt.
- Writers (Sidekicks, Workers, Operators that produce files): the contract names the write paths once. Before an edit outside them, stop and report blocked; if a violation is discovered, stop and report it. Parent still verifies the receipt's diff stayed inside the declared scope.

Launch with the native or ACPX encoding returned by **Choose the runtime**. Host permission flags live in that provider reference. A missing sandbox or plan-mode flag is not a reason to leave native. "The review workflow requires an enforced sandbox" is the rationalization this rule catches.

### Choose the runtime

Select the pattern, model category, model lineage, and reasoning requirement first. Sidekicks and Advisors require separate persistent conversations: reuse the same named ACPX session or exact Router-addressable conversation across follow-ups and new assignments in that relationship. Do not substitute a native child merely because its model is available. Workers may use native subagents or separate conversations according to the task; Reviewer independence and phase freshness rules still apply. For a new persistent relationship, use a supported named ACPX session unless an adequate separately addressable Router conversation already exists or the caller supplies another verified separate-session creation path that exposes the required model, effort, permissions and retained session identity. Then choose the runtime from the capabilities required by that relationship and the selected model lineage. Native and ACPX supply the launch mechanism; either runtime uses the same packet, authority, continuity, and parent-verification rules. History-provisioning feasibility feeds this choice, but does not override the separate-conversation requirement for Sidekick or Advisor.

IF a Router route is selected, load the `agent-collaboration` skill and return verified exact SessionRef, input capability, and model/access fit; reuse the original address.

#### Native dispatch

For Workers, Operators, and eligible Reviewers, prefer native dispatch in the host's available lineup when it meets the assignment's capabilities. A native Reviewer is eligible only when its chosen lineup satisfies the different-author-lineage requirement itself, or a named different-lineage reviewer satisfies that final-review requirement in the same multi-review round. Sidekick and Advisor persistence takes precedence: use their separate conversation even for the same lineage, with ACPX when that is the supported persistent route. Do not replace an adequate native assignment with a CLI wrapper merely to invent access flags.

- IF Codex is spawning an OpenAI model, load `references/native-providers-codex.md` and return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding.
- IF Claude is spawning a Claude model, load `references/native-providers-claude.md` and return the host Task / Agent encoding and workspace-access encoding.
- IF Cursor is spawning an advertised Cursor model, load `references/native-providers-cursor.md` and return the host Task encoding and workspace-access encoding.
- Use the exact model id and reasoning control supported by the native runtime.

When an own-lineage model is unavailable, choose a declared native fallback or report the route as degraded or blocked.

#### ACPX dispatch

Use ACPX for a different-provider model or the persistent route selected by **Choose the runtime**.

1. MUST load `references/acpx.md` and return the provider-neutral launcher, session, permission, and output mechanics for this dispatch.
2. Select exactly one provider and MUST load its contract before constructing or executing the call, returning its exact model, effort, and permission encoding:
   - `codex` -> `references/acpx-provider-codex.md`
   - `claude` -> `references/acpx-provider-claude.md`
   - `cursor` -> `references/acpx-provider-cursor.md`
3. Use the exact model id and reasoning control specified by the provider contract. When the contract requires live catalog verification, use and record the exact id the provider advertises.
4. When the selected provider has no provider contract, stop dispatch and report the route as unsupported.

ACPX agents start with zero parent context: parent conversation history never crosses the ACPX boundary; only the assignment contract does. Before dispatch, include the decision target, settled decisions, resolvable sources, and `history none` as relevant to the assignment. For native-eligible jobs, history needs may favor native dispatch. For persistent relationships, preserve the identity selected by **Choose the runtime** and supply relevant new context.

### Workflow

1. Reuse the supplied plan or task contract read-only; do not require a plan where the owning workflow does not. Coordinate only multiple separately assigned jobs whose dependencies or interference need it: state prerequisites, actual read/write and shared-resource safety, and verification points inline. Different files are not proof; start dependent work only after prerequisite verification. Otherwise do not create a graph or coordination record. Bulk collection, log scans, and watches may still be handed off sequentially to conserve context. When one agent can own a bounded result, do not split it; a missing stop criterion calls for clarification, not automatic splitting.

2. Reuse the current orchestrator and existing assigned executor. When **Select an agent** requires a new executor choice, a Balanced orchestrator follows the owning implementation skill only if selected as executor inline; otherwise it assigns an eligible Worker or Sidekick. The owning phase supplies assignment, governing sources, authority bounds, completion or escalation conditions, and result or proof contract; those sources must resolve for a fresh recipient. For a direct task, state outcome, relevant sources, explicit authority, stop or escalation condition, and expected evidence in a concise brief. For a new agent assignment, MUST load `references/agent-job-packet.md` to resolve executor, model and effort, history, access, runtime, continuity, and acceptance in tool arguments or session configuration where supported; prose supplies only missing task context. Before the first prompt, resolve runtime, exact model, access, and history; IF persistent, load `references/session-ledger.md` and return its current identity row before prompting.

3. Dispatch the whole assignment. A same-assignment follow-up carries a concise delta and retains identity and scope; a new assignment refreshes its assignment contract without replacing a Sidekick or Advisor conversation. At the decision point, use the selected native or ACPX contract: preserve reviewer history isolation, never pass ACPX `--timeout`, and inspect sessions after a dropped wait before calling it blocked.

4. Verify evidence against the claim and request correction when needed; do not routinely redo the agent's execution. The orchestrator may read decisive sources. Every claim is accepted, rejected, or unverified against the assignment contract's verification point.

Extra: IF you need to build, modify, or wrap an ACP-compatible adapter, load `references/building-acp-adapters.md` and return its build gate, security route, and smoke checklist.


## Maintain continuity

### Shared work context

Use the existing shared message-board thread to coordinate multi-session work, decisions, and handoffs. Carry its exact work reference across participating sessions.

When an assignment contributes to an existing work thread, carry its exact shared work reference with relevant sources and say whether the agent may post findings or must return them to the parent; a reference alone grants no posting or sending authority. `track-show-me-your-work` owns the meaningful-checkpoint threshold. Scoped board catch-up or posting an approved checkpoint is an Operator procedure through `agent-collaboration`; the current orchestrator identifies consequential decisions and verifies evidence, then reuses that summary without a second narrative. Batch small lane receipts into the responsible agent's checkpoint; do not post per command, minor edit, or routine progress, and do not duplicate parent and worker reports. Keep runtime identity, permissions, and receipt verification here. Contributors do not resolve the whole-work thread. Reviewers still receive bounded sources without inherited author conversation; a work thread is not a substitute for an independent review packet.

### Waiting

When no independent useful work remains, park rather than repeatedly checking with short model turns: use the current host's blocking wait or completion notification for a native job, a supported reply or event notification for a separate conversation, an authorized Router wake through `agent-collaboration` for a later follow-up or deadline, or checkpoint/yield for a user decision. Assign a long CI watch to an Operator with its blocking watch, then wait for the Operator. Use the longest suitable supported wait bounded by the real deadline and host constraints; do not invent a polling interval or watch service.

Before parking, decide whether a future check or wake is needed and retain the exact recipient, expiry, and saved wake id when one is created. On observed resumption, cancel or adjust an obsolete wake through `agent-collaboration`. This does not alter ordinary user reminder cadence.

#### Session Keep-Alive

Use **26 minutes** since the last qualifying model request as the shared maintenance target for an idle continuing session expected to resume. Actual qualifying model requests reset the clock; status reads, waits, and queued acknowledgements do not establish refresh. Never ping a busy worker solely for cache maintenance. Record relevant activity and actual maintenance in the persistent relationship ledger; expiry does not end session identity.

This skill owns the target. It does not guarantee provider TTL, quota, or savings. Cache matching needs the same prefix: preserve the same conversation and avoid replaying whole packets unnecessarily, but do not claim a stable id guarantees a cache hit. Provider behavior determines observed cache hits; use existing awake or wake mechanisms only when supported and authorized.

## Acceptance Checks

Before closing an assignment, verify stable identity where continuity applies, declared authority and path scope, current source or head evidence for its claims, and any unresolved transport, provider, or proof gaps. The orchestrator reduces those checks into the overall-task verdict.
