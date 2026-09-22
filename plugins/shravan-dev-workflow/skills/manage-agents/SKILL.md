---
name: manage-agents
description: Always load to manage agents, subagents, delegation, or agent swarms. Always use during project planning, design, and execution to select execution ownership and coordinate multi-agent work. Use for spawning, assigning, steering, resuming, waiting for, and verifying Advisors, Sidekicks, Workers, Review Sidekicks, and Operators—including parallel agent swarms, native subagents, Router-managed conversations, and ACPX agents.
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
| Mini           | Procedures, repeatable work, guided execution. |
| Balanced       | Execution or synthesis that needs judgment.    |
| Frontier       | Demanding judgment, design, or review.         |

Model category is a cost/capability grouping of model plus effort. It does not assign role authority or automatically promote effort.

An agent's active function is independent of its session ancestry. The user-facing orchestrator owns the design conversation, routing, verification, and final report. When implementation is commissioned, the orchestrator holds the `orchestrator` seat and the implementation Sidekick holds the `implementer` seat on that board thread. An `executor` performs assigned work within its role and authority; implementation includes fitting proof when applicable. Here, `parent` means the immediate assigning parent.

Board seats describe participation on one discussion root; they do not grant agent authority or change conversation ancestry. This skill owns the complete role-to-seat mapping used by caller workflows:

| Agent function | Board seat when joining |
| --- | --- |
| Main / user-facing orchestrator | `orchestrator` |
| Implementation Sidekick | `implementer` |
| Review Sidekick | `reviewer` |
| Explicitly owner-requested Advisor | `advisor` |
| Research Sidekick, Worker, Operator, or other bounded contributor | `participant` |

Router owns the seat schema and enforcement. A direct conversation, native child, board thread, display name, or seat is not an assignment or permission grant; the caller workflow still supplies scope and authority.

### Lineage Families

| Family | Models or harness                                 |
|--------|---------------------------------------------------|
| OpenAI | Astra, Sol, Terra, and Luna.                      |
| Claude | Fable and Opus.                                   |
| xAI    | Grok.                                             |
| Cursor | A harness and multi-model catalog, not a lineage. |

### Agent Roles

> Operator owns a procedure. Worker owns an assignment. Sidekick owns continuing work. Review Sidekick owns independent assessment. Advisor owns guidance.

| Role        | What it owns                                              | When to use it                                                                               | Continuity                                                                           |
|-------------|-----------------------------------------------------------|----------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| 🔧 Operator | A prescribed procedure and its observed result.           | Git/PR operations, running checks, watching jobs, scraping or mechanical transformations.    | Completes the procedure and reports results or exceptions.                           |
| 🛠️ Worker   | One bounded result, including corrections and proof.      | An implementation, investigation, collection or synthesis assignment.                        | Stays through follow-ups until that assignment is accepted.                          |
| 🐒 Sidekick | Continuing implementation, research, or review work.     | Related assignments and follow-up questions need the same context.                          | Reuses one separate top-level session across assignments.                            |
| 🔎 Review Sidekick | Independent assessment against requirements and evidence. | Challenge a design, implementation or claimed result.                                  | Reuses one separate top-level session and its own review history through corrections. |
| 🦉 Advisor  | Continuing guidance, recommendations and pushback.        | You explicitly choose another agent to help think through decisions.                         | Reuses one separate session; advises without implementing.                           |

Every non-main agent thread title starts with the emoji for its role in the Agent Roles table and follows `<emoji> <role> · <purpose>`, with a concrete purpose substituted; that table is the single runtime source of truth for role emoji. This applies to implementation, research, and review Sidekicks, explicitly assigned Advisors, Workers, Operators, and other helper threads when they have a visible title. Leave the user-facing main thread title untouched. For a persistent session, use a supported rename/display operation and verify its returned identity and saved visible title; its exact SessionRef remains separate. A ledger-only label or alias does not prove that the UI title changed. If the host cannot name it, report that capability gap without blocking otherwise useful work or replacing the session. Names do not replace session addresses or grant authority.

## Main flow

The user works with one user-facing orchestrator, which may be Frontier or Balanced and retains design authority plus all governing Requirements, Specification, Program Design, diagram, and implementation-plan authorship. The orchestrator loads the owning design and planning skills and writes those artifacts in its session. Workers, Operators, search, and tools may return bounded evidence or mechanically render unchanged main-authored input; they do not choose, organize, rewrite, or express governing design or plan content. For generated visuals, the main authors the reader question, exact labels and relationships, semantic composition and invariants, then inspects and accepts or corrects the candidate. A tool or helper may realize pixels, typography, spacing and style or run a prescribed generate/copy/preview procedure on that unchanged brief; it cannot choose semantic layout, revise the brief, accept the visual, or make the image the governing design. An explicitly user-designated successor main is the only portability exception: its packet names the recipient, the transferred design or plan scope, and the user's authorizing direction. A role label, handoff, board seat, or assistant continuation does not create that authority.

After a main-authored plan is ready, one persistent implementation Sidekick may own each useful planned PR assignment while Main remains the default user conversation throughout delivery. The user may explicitly choose direct contact with the assigned Sidekick inside that assignment. In either conversation branch, the Sidekick implements, integrates, proves, and corrects its scope directly by default. It returns material design or plan decisions, cross-assignment integration conflicts, permission boundaries, and completion evidence to the orchestrator with the exact question or concise source-backed receipt; Main does not relay every internal progress turn or poll merely to keep the conversation active. Direct user contact does not transfer governing authorship: Main still writes Requirements, Specification, Program Design, diagrams, and the implementation plan, and retains material decisions, integration, assessment, acceptance, and the final report. Returning to Main for conversation does not pause authorized implementation or transfer execution ownership.

Several independent PR assignments may use several Sidekicks; dependent work waits for verified prerequisites. The orchestrator assesses completed development and cross-PR integration before an independent Review Sidekick examines the implementation. A bounded research question uses a Worker; related research with follow-up questions may use a research Sidekick. Workers and Operators are native subagents that remain through assignment corrections, then finish.

| rationalization | reality |
| --- | --- |
| "spec-design owns artifacts, so spawn a Sidekick" | those skills own judgment; the orchestrator loads them and writes |
| "Sol is the executor, so Sol writes the spec" | executor is implementation, research, or review support, not design author |
| "the design is settled, so a Worker can word the section" | section organization and expression are governing authorship; helpers return evidence only |
| "the implementer already has context, so it can finish the plan" | the implementer returns the planning gap to the main, which loads the planning skill and authors the plan |
| "I'll check the instructions first" | "you write it" is already the instruction |

## Select an agent

> The orchestrator owns the overall-task verdict and verifies assignment evidence. Contributors may report or converse within their authorized assignment, but do not claim the whole work complete.

```text
task category + Guidance + Architectural span -> Agent Roles responsibility and continuity
  -> allowed model and effort -> runtime, packet, receipt
```

Retain the orchestrator's `orchestrator` board seat. Reuse a suitable executor assignment when work has not materially changed; otherwise choose an executor using task category, Guidance, Architectural span, useful existing context, and total completion cost including handoff, rework, and proof. This is internal task-fit selection, not an owner approval, form, or new agent requirement. Use the **Agent Roles** table to choose responsibility and continuity. Review uses independent context and its lineage rule; an Advisor remains explicitly owner-selected guidance. Required governing design, specification, and plan gates remain required in their owning workflows: Partial direction permits bounded investigations, proposals, and authorized implementation-mechanics choices, never a bypass for a required governing design or plan.

An executor is not a design- or plan-author role. The orchestrator designs, plans, and verifies decisive evidence while assigning implementation and proof to eligible executors. An implementation Sidekick executes its assigned change and associated proof directly by default. Delegate only when a child has bounded independent work, distinct expertise the executor needs, or large disposable output worth isolating, and the expected benefit exceeds briefing, coordination, and verification cost. Keep tightly coupled change-and-proof work with its executor; do not create a supervisor whose only job is to relay another agent's work. Standalone prescribed Git, PR, build, test, or watch procedures use an Operator, while tests and checks associated with an implementation assignment stay with that executor. PR wrap-up may remain with the implementation Sidekick as part of its delivery assignment or be assigned to an Operator as a prescribed procedure; Main retains acceptance and the user retains merge authority. Use a research Sidekick only when related research needs continuing context. The orchestrator may communicate, make control calls, and read decisive sources; report an unavailable required route rather than silently falling back inline.

### Choose a model

Role tables list allowed model-and-effort choices and when to prefer each. Honor an explicit user choice, then match Guidance and Architectural span. More complete guidance does not disqualify a capable model. Sol low remains eligible for matching assignments, and a suitable existing Sol low relationship continues rather than switching for an unrelated default. Reassess from evidence when a choice struggles; do not automatically increase effort or claim universal benchmarks. Claude uses appropriate Opus effort and Cursor appropriate Grok effort. Prefer total completion cost, including rework, proof, and coordination.

### Commission an implementation Sidekick

For each accepted planned PR assignment, create or reuse one named top-level persistent implementation Sidekick through a supported capability-verified route. Its commission includes the main-authored plan and PR scope, accepted direction, sources, worktree, coordination and execution work references, execution authority, proof expectations, real prerequisites, and route for design or plan questions. One thread has at most one open `implementer` seat: the orchestrator retains `orchestrator` on a coordination root, links one execution root per simultaneously active Sidekick through existing message references, and holds `orchestrator` on each execution root while that Sidekick joins it as `implementer` with `--actor self`. Treat setup as complete only after the Participant row on the exact execution root shows that role. `agent-collaboration` owns those mechanics; linked roots do not create a new Router relationship or authority mechanism. For Codex, use the supported Router route with the exact model, effort, and access on the implementation worktree; verify the target choice, access, visible name, and returned identity. If that route is unavailable, report the exact capability gap and use a verified existing top-level conversation or supported top-level ACPX route. Native children serve Workers and Operators; they do not form a persistent Sidekick. The orchestrator retains design, planning, integration, and disposition authority. An Advisor exists only when Shravan explicitly requests one and advises the orchestrator.

## Patterns

Manage each assigned agent or relationship through one of the following patterns. The runtime supplies the launch mechanism.

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Native subagent for one procedure; keep it through procedure exceptions and finish after its result is accepted.
- **Authority:** Execute, observe, report, and perform user-authorized mechanical transformations. It does not make implementation or design judgments; route those, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

Bright line: standalone assigned Git, test, build, PR, and watch procedures belong to an Operator. An unsupported Operations method routes to a Worker Synthesis assignment that defines the procedure, then returns to an Operator; Synthesis requiring interpretation remains Worker work even when the approach is detailed, while plain regrouping is Operations. An unexpected diagnosis routes to a Worker; the user retains authorization. The parent verifies receipt scope, source or head, and evidence; it need not rerun a routine successful procedure unless evidence is missing or conflicts.

| rationalization               | reality                                                                                                                                          |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends                                       |
| "this needs judgment"         | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Worker reasoning assignment |
| "a Worker can handle it"      | A separately assigned procedure is Operator work; an implementation Worker's associated proof stays with that Worker.                            |

#### Model choices

| Model category | Model lineage | Thinking       |
|----------------|---------------|----------------|
| Mini           | OpenAI Luna   | medium or high |

### Worker
Use for one clear bounded assignment. You manage and validate the work; continue the same worker through corrections belonging to that assignment.

- **Work:** One bounded research, implementation, reasoning, or analysis assignment, including its corrections and associated proof. A Worker may return evidence, candidate findings, or mechanical output from unchanged main-authored input; it does not author governing design or plan prose, diagrams, structure, or settled sections. Independent review belongs to a Review Sidekick.
- **Continuity and cardinality:** Native subagent for one assignment; retain it through its corrections and proof, then finish it after its receipt is accepted.
- **Authority:** Packet-bounded work; parent verifies the work. A Worker does not recurse. A Review Sidekick may assign it a read-only review lane under the owning review skill.
- **Model category:** Balanced or Mini

#### Model choices

| Model category | Model lineage | Thinking | Task signals                            |
|----------------|---------------|----------|-----------------------------------------|
| Mini           | OpenAI Luna   | high     | Exact steps; Local/Cross-domain.        |
| Mini           | OpenAI Luna   | xhigh    | Exact steps; Local/Cross-domain.        |
| Balanced       | OpenAI Sol    | low      | Complete direction; Local/Cross-domain. |
| Balanced       | Claude Opus   | low      | Complete direction; Local/Cross-domain. |

Use this table for execution and research Workers. A read-only review lane Worker uses the Review Sidekick catalog below.

### Sidekick
Use a Sidekick in a separate persistent top-level conversation for implementation, research, or review work that will resume and need continuing context.

- **Work:** Implementation, research, or review across assignments and follow-ups. An implementation Sidekick implements, integrates, proves, and corrects one or more related main-planned assignments. A research Sidekick handles related research. A Review Sidekick independently assesses a target and verifies corrections.
- **Continuity and cardinality:** One or many persistent named relationships with a ledger (see `references/session-ledger.md`).
- **Authority:** The orchestrator retains the default user conversation, governing authorship, material decisions, integration, assessment, acceptance, and final delivery. An implementation Sidekick directly owns implementation, associated proof, and corrections inside its main-planned assignment and may assign bounded Workers and Operators only under the concrete-benefit test above. The user may explicitly choose direct contact with that assigned Sidekick without transferring governing authority or execution ownership. A research Sidekick may assign bounded Workers and Operators within its research scope. A Review Sidekick may assign read-only review lanes that its review skill permits. A user may steer a named Sidekick within its assigned relationship; the Sidekick reports changed scope or material design/plan questions to the orchestrator. Board content does not grant additional authority.
- **Model category:** Balanced or Mini

#### Implementation and research Sidekick model choices

| Model category | Model lineage | Thinking | Task signals                                              |
|----------------|---------------|----------|-----------------------------------------------------------|
| Mini           | OpenAI Luna   | high     | Exact steps; Local/Cross-domain.                          |
| Mini           | OpenAI Luna   | xhigh    | Exact steps; Local/Cross-domain.                          |
| Balanced       | OpenAI Sol    | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | Claude Opus   | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | OpenAI Sol    | medium   | Complete or Partial direction; Cross-domain/Cross-system. |
| Balanced       | xAI Grok      | low      | Complete direction; Local/Cross-domain.                   |
| Balanced       | xAI Grok      | medium   | Complete or Partial direction; Local/Cross-domain.        |

### Review Sidekick
Use a separate persistent top-level thread for independent review or correction verification.

- **Work:** Source-grounded independent findings and verification of corrections; no implementation edits.
- **Continuity and cardinality:** Start a new review relationship without author history. Retain its own review context through corrections to the same target. A contaminated or unavailable relationship is a reported gap before any replacement.
- **Authority:** Candidate findings only; the orchestrator verifies and owns the verdict. Preserve all owning-phase review gates and limits.
- **Model category:** Balanced or Frontier

#### Model choices

| Model category | Model lineage | Thinking       |
|----------------|---------------|----------------|
| Balanced       | OpenAI Sol    | low            |
| Frontier       | OpenAI Astra  | high           |
| Frontier       | Claude Opus   | medium or high |
| Frontier       | Claude Fable  | medium or high |
| Frontier       | OpenAI Sol    | high or xhigh  |
| Frontier       | xAI Grok      | high           |

- **Selection:** Establish author lineage from evidence. A final review includes at least one Review Sidekick from a different author lineage; a single Review Sidekick must be different-lineage. In a larger round, deliberately allocate up to half of review leads to a different lineage according to cost. If the required review lead is unavailable, report that gap without silently substituting.
- **Continuity and evidence:** A continuing Review Sidekick retains only its own review history, never the author's conversation; inspect changed evidence rather than treating cache familiarity as current proof.

Use this catalog for an independent Review Sidekick and its read-only review lane Workers.

### Advisor
Use an Advisor only when Shravan explicitly requests a separate persistent guidance thread for the orchestrator. Guidance only — the Advisor never executes or edits.

- **Work:** Candidate guidance, reflection, course correction, and completion checks across a problem that outlives any single assignment.
- **Continuity and cardinality:** Persistent named guidance relationship, with ledger and deliberate continuity (see `references/session-ledger.md`). Use a Review Sidekick for a bounded independent assessment.
- **Authority:** The Advisor returns guidance to the orchestrator, which decides with Shravan. It does not author or accept governing design or plans. The implementation Sidekick asks the orchestrator when it needs design or plan help.
- **Model category:** Frontier

#### Model choices

| Model category | Model lineage | Thinking       |
|----------------|---------------|----------------|
| Frontier       | OpenAI Astra  | high           |
| Frontier       | Claude Opus   | medium or high |
| Frontier       | Claude Fable  | medium or high |
| Frontier       | OpenAI Sol    | high or xhigh  |

Use the model and effort chosen by the user; do not escalate or add another Advisor automatically.

## Execute the assignment

### Context and access

#### Parent conversation history

- Review Sidekicks: bright line — an independent review relationship NEVER receives inherited author or designer conversation history. Reviews judge from first principles; inherited context is contamination. The selected provider reference owns the exact encoding. Lane Workers use `fork_turns="none"` on Codex.
- Non-reviewers: use the selected host's advertised history encoding by cost and benefit. History helps a subagent abide by decisions already made; it costs context and money. Include what the job's stop condition depends on; do not paste unrelated turns.
- ACPX agents never inherit parent history — carry context in the phase brief instead (see ACPX dispatch). Dispatch configuration records `history none` for every ACPX assignment.
- Self-fork and resume-self mechanisms (a subagent started from the parent's own conversation) are full-history inheritance and are forbidden for Review Sidekicks and review lane Workers on every host. "It already has all the context" is the rationalization; the context is the contamination.
- Because a Review Sidekick starts empty, its phase brief carries absolute source paths or inlined governing content for everything it will cite. Every assigned reference must resolve from its cwd; owner meaning that exists only in chat is copied verbatim. The Review Sidekick loads its owning review workflow and `manage-agents` before selecting lanes. A lane packet omits the assigning skill's `SKILL.md` and `manage-agents/SKILL.md`.

#### Workspace access

The assignment contract records history, workspace access, and any declared enforcement notation through `references/agent-job-packet.md`.

- Readers (review, advisor, research, guidance): state once that no repo edits are allowed except scratch files under project `tmp/` or system `/tmp`. Parent verifies the repo worktree is unchanged after the receipt.
- Readers with exec (`read-only + exec <listed commands>`): the one reviewer widening, for a proof-verification lane. It may run exactly the listed commands with output under `tmp/` or `/tmp`, and edits nothing. Parent verifies every command the receipt lists appears in the grant and that the repo worktree is unchanged after the receipt; a mismatch invalidates the receipt.
- Writers (Sidekicks, Workers, Operators that produce files): the contract names the write paths once. Before an edit outside them, stop and report blocked; if a violation is discovered, stop and report it. Parent still verifies the receipt's diff stayed inside the declared scope.

Launch with the Router, native, or ACPX route returned by **Choose the runtime**. Host permission flags live in that provider reference. A missing sandbox or plan-mode flag is not a reason to leave native. "The review workflow requires an enforced sandbox" is the rationalization this rule catches.

### Choose the runtime

Select the role, model category, model lineage, and reasoning requirement first. Sidekicks and Advisors use separate persistent top-level conversations. Reuse their named Router-addressable or ACPX session across follow-ups and corrections. For a new persistent Codex relationship, prefer a supported Router top-level creation route. Otherwise use a verified existing separate conversation or a supported named top-level ACPX session with the required model, effort, permissions, and retained identity. Other providers select their supported route. Report the concrete capability gap when no route meets the requirement. Workers and Operators use native subagents; an unavailable native lineup is a reported gap, not a reason to create a top-level Worker or relabel another thread. Router, native, and ACPX supply supported routes; each uses the same packet, authority, continuity, and parent-verification rules.

IF a Router route is selected, load the `agent-collaboration` skill and return verified exact SessionRef, input capability, and model/access fit; reuse the original address.

#### Native dispatch

For Workers and Operators, use native dispatch in the host's available lineup. Review lane Workers are native read-only subagents; independent review leads are persistent Review Sidekicks. Sidekick and Advisor persistence takes precedence over native availability. Do not replace an adequate native assignment with a CLI wrapper merely to invent access flags.

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

ACPX agents start with zero parent context: parent conversation history never crosses the ACPX boundary; only the assignment contract does. Before dispatch, include the decision target, settled decisions, resolvable sources, and `history none` as relevant to the assignment. ACPX is for persistent Sidekick, Advisor, or Review Sidekick relationships. Preserve the identity selected by **Choose the runtime** and supply relevant new context.

### Workflow

1. Reuse the supplied plan or task contract read-only; do not require a plan where the owning workflow does not. Coordinate only multiple separately assigned jobs whose dependencies or interference need it: state prerequisites, actual read/write and shared-resource safety, and verification points inline. Different files are not proof; start dependent work only after prerequisite verification. Otherwise do not create a graph or coordination record. Bulk collection, log scans, and watches may still be handed off sequentially to conserve context. When one agent can own a bounded result, do not split it; a missing stop criterion calls for clarification, not automatic splitting.

2. Reuse the orchestrator and existing assigned executor. When **Select an agent** requires a new executor choice, follow the owning phase. For implementation or research, assign an eligible Worker or Sidekick. For a design phase, the orchestrator authors; do not assign a Worker or Sidekick as design author. The owning phase supplies assignment, governing sources, authority bounds, completion or escalation conditions, and result or proof contract; those sources must resolve for a fresh recipient. For a direct task, state outcome, relevant sources, explicit authority, stop or escalation condition, and expected evidence in a concise brief. For a new agent assignment, MUST load `references/agent-job-packet.md` to resolve executor, model and effort, history, access, runtime, continuity, and acceptance in tool arguments or session configuration where supported; prose supplies only missing task context. Before the first prompt, resolve runtime, exact model, access, and history; IF persistent, load `references/session-ledger.md` and return its current identity row before prompting.

3. Dispatch the whole assignment. A same-assignment follow-up carries a concise delta and retains identity and scope; a new assignment refreshes its assignment contract without replacing a Sidekick, Advisor, or Review Sidekick conversation. At the decision point, use the selected Router, native, or ACPX contract: preserve review-history isolation, never pass ACPX `--timeout`, and inspect sessions after a dropped wait before calling it blocked. When no independent useful work remains, follow **Waiting** immediately.

4. Verify evidence against the claim and request correction when needed; do not routinely redo the agent's execution. The orchestrator may read decisive sources. Every claim is accepted, rejected, or unverified against the assignment contract's verification point.

Extra: IF you need to build, modify, or wrap an ACP-compatible adapter, load `references/building-acp-adapters.md` and return its build gate, security route, and smoke checklist.


## Maintain continuity

### Shared work context

Use the relevant shared message-board thread to coordinate multi-session work, decisions, and handoffs. One coherent assignment reuses one exact root. Several planned PR assignments may share a coordination root while each simultaneously active implementation Sidekick uses its own linked execution root and thread-local `implementer` seat. Carry both coordination and execution references across participating sessions; integration decisions stay on the coordination root and assignment discussion/proof stays on its execution root.

When an assignment contributes to an existing work thread, carry its exact shared work reference with relevant sources and say whether the agent may post findings or must return them to the parent; a reference alone grants no posting or sending authority. `track-show-me-your-work` owns the meaningful-checkpoint threshold. Scoped board catch-up or posting an approved checkpoint is an Operator procedure through `agent-collaboration`; the orchestrator identifies consequential decisions and verifies evidence, then reuses that summary without a second narrative. Batch small lane receipts into the responsible agent's checkpoint; do not post per command, minor edit, or routine progress, and do not duplicate parent and worker reports. Keep runtime identity, permissions, and receipt verification here. Contributors do not resolve the whole-work thread. To report current implementer activity, load `agent-collaboration` and return the scoped session row — worktree, model, effort, status or idle — for that exact SessionRef. Review Sidekicks receive bounded sources without inherited author conversation; a work thread is not a substitute for an independent review packet.

### Waiting

After dispatch, when no independent useful work remains, identify the dependency and select its supported wait or notification handling. The waiting owner selects the delivery lifetime; host limits bound a process wait. A wait may return early for activity; judge the requested bound and reason for returning, not elapsed time alone.

| Dependency | Waiting path |
| --- | --- |
| Native child result | Use the host completion notification or blocking wait. IF Codex native lifecycle tools apply, load `references/native-providers-codex.md` and return the explicit `timeout_ms` and observed lifecycle result. |
| Board activity in a separate conversation | IF awaiting activity, load `agent-collaboration` and select its supported Codex session notification for the exact thread; yield after an armed subscription or process a returned wait. Return subscription armed, received activity, timeout, or the exact capability gap. That skill owns the mechanics and capability check. |
| A future event, deadline, or follow-up | Create an authorized wake through `agent-collaboration`, retaining the recipient, expiry, and saved wake id. This schedules a future event; it is not a passive wait. |
| An owner decision | Record the meaningful checkpoint and yield. |

For a separate conversation without available board-listener capability, use its supported reply/event notification or an authorized wake, or report the capability gap. A Claude background command is eligible only when the host also supports a native completion notification; `&` alone does not prove a wake. When a supported board listener is available, do not substitute periodic wakes or list polls. When remaining implement/prove is on a separately addressed collaborator and no independent useful work remains, set one authorized `agent-collaboration` wake unless a supported listener is already armed, then state in the stop text that the wake or listener is saved/active. Stop-review cannot see the CLI or MCP call. Supported capability and permission recovery stays within `agent-collaboration`; do not use an alternate transport after access is denied.

On received activity, process the relevant receipt. On an empty timeout, rearm the selected wait only when the deadline and assignment still warrant it. Discovery, failure/recovery evidence, and liveness checks after a dropped wait remain valid reasons to inspect. A blocked wait process itself generates no model tokens, but handling its call/result and a wake consumes real turns; each model-driven poll reprocesses context. Do not call waiting free or claim every tool call costs the same. Assign a long CI watch to an Operator with its blocking watch, then wait for the Operator.

| Red flag | Required action |
| --- | --- |
| “just a quick check”; “the reply is probably in by now”; “one more list won’t hurt” | Do not list, inspect, or fetch solely for a reply. Continue the active wait; rearm only after it ends and waiting is still required. |
| Stopping while a collaborator still owns remaining work, without a reported saved wake | Set the authorized wake (or keep the armed listener), say it is saved/active, then yield. Do not inspect the foreign session to keep this conversation alive. |

On observed resumption, cancel or adjust an obsolete wake through `agent-collaboration`. This does not alter ordinary user reminder cadence.

#### Persistent-resume cost

Provider cache behavior is unknown unless observed. Preserve the same persistent session and avoid replaying whole packets unnecessarily, but accept a cold resume; neither cache expiry nor an idle interval replaces a Sidekick or Advisor identity. Do not create automatic maintenance heartbeats or claim a stable id guarantees a cache hit, TTL, quota, or savings. Choose a Sidekick's model and effort at creation and keep them for the life of the session; resume without restating them. Cache reuse is provider- and route-dependent: changing model or effort may reduce or invalidate reuse, but only actual evidence supports a hit or miss claim. Use existing awake or wake mechanisms only when supported and authorized.

## Acceptance Checks

Before closing an assignment, verify stable identity where continuity applies, declared authority and path scope, current source or head evidence for its claims, and any unresolved transport, provider, or proof gaps. The orchestrator reduces those checks into the overall-task verdict.
