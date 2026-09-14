---
name: manage-agents
description: Always load to manage agents, subagents, delegation, or agent swarms. Always use during project planning, design, and execution to delegate tasks and coordinate multi-agent work. Use for spawning, assigning, steering, resuming, waiting for, and verifying Advisors, Sidekicks, Workers, Reviewers, and Operators—including parallel agent swarms, native subagents, Router-managed conversations, and ACPX agents.
---

# Manage Agents

The agent pattern owns work, continuity, authority, cardinality, and the minimum capability category. A model category is a model-plus-thinking combination.

Dispatch has two nested levels. The job graph owns decomposition, sequencing, and parent verification points. Each job then runs one ordered dispatch decision:

```text
pattern -> model category -> model lineage (cheapest at or above the
           pattern's floor per Capability Economics, unless the user named
           a lineage the table allows for this job) -> reasoning requirement
        -> history and workspace access -> relationship continuity
        -> eligible native or separate-session runtime -> exact model id -> packet -> receipt
```

When the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task, build the job graph first; it governs the order and verification point of every later dispatch. A job yields at most one assignment-bound receipt and always closes at its named parent verification point.

## When To Call What

Invariant above every branch: the parent validates every receipt and is the sole voice that reports to the user. No subagent owns a final claim.

Choose the pattern from the job type, before any thought about model or runtime. First cut: does the relationship persist beyond this assignment (persistent), or end when its receipt is accepted (single-assignment)? An assignment may contain a whole conversation — corrections, questions, steering; duration never decides the cut, and a two-hour CI watch is still single-assignment. Second cut differs per side. Single-assignment splits on whether the packet can enumerate the steps, selection criteria, and report shape up front (scriptable) or the agent must interpret, synthesize, or choose (needs thinking). Persistent splits on whether the agent executes the work or returns guidance only.

Two routes outside the table: the parent decides with no dispatch when the options and the evidence needed to choose are already in front of it ("merge despite this flaky test?", a wording pick); dispatch a Worker only when the packet names sources the agent must read or synthesize that the parent has not. Persistent scriptable work is not a Sidekick — dispatch a fresh Operator per assignment.

| if the job is                                                                                                                                                                                       | then use                                                      | good-selection signal                                                                                                                        | mis-selection trap                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| single-assignment and scriptable: running tests or builds, watching CI or PR checks (`gh` watch), monitoring, scraping, grouping logs by a stated key, collecting references by a written criterion | Operator (default Mini)                                       | the receipt is a faithful report of what ran or was found; unexpected states come back undecided; no source edits                            | asking the Operator to decide relevance, cause, readiness, or next action — split it: procedure to the Operator, judgment back to you |
| single-assignment and needs thinking: research with synthesis, an implementation slice, drafting, a bounded analysis                                                                                | Worker (default Balanced)                                     | you can write the stop condition in one sentence and discard the agent after the receipt                                                     | calling planned implementation scriptable because its steps are listed — implementation choices are thinking                          |
| persistent work the agent executes: a named co-worker you resume and steer, which also thinks with you — validating, helping, pushing back at the level of the work at hand                         | Sidekick (default Balanced) — the default for persistent work | a named relationship with a ledger outlives this assignment and stays cache-warm                                                             | a Sidekick for a single-assignment job — that is a Worker; a Sidekick for a scriptable loop — that is repeated Operators              |
| persistent guidance across multiple components, systems, or architecture, where you stay the executor                                                                                               | Advisor (Frontier) only when the user chooses it              | the user permitted the Advisor; it returns candidate guidance and never edits; the named relationship is expected to survive this assignment | dispatching an Advisor without user choice; a bounded independent assessment belongs to Reviewer                                      |

| independent review or verification, including follow-up on the same review | Reviewer | a different author/reviewer lineage and independent evidence; findings remain candidate-only | treating another model in the same lineage as independent, or reviewing the agent's own implementation |

Selection is done when every job names its pattern and no model has been named yet.

## Capability Economics

The pattern picks the shape of the work and its table owns the allowed category floor; Capability Economics picks the cheapest category and lineage at or above that floor, unless the user named a lineage the table allows for this job.

Mini (OpenAI Luna) is super cheap. Default grunt work to Mini whenever the pattern's floor allows it: mechanical procedures, bounded scans and summaries, format conversions, test-and-report loops, watches. Luna is only for simple Worker tasks with full guidance or Operator work; it is not a Sidekick or Reviewer.

The harness sets execution preferences: Codex Sidekicks use Terra medium; Codex Workers use Terra medium or Luna xhigh for simple fully guided tasks. Claude Code prefers Opus medium for Sidekick and Worker; Cursor prefers Grok medium. Scriptable work runs at Mini. Frontier is never a default where a pattern's table spans categories. Category moves keep the pattern and stay inside the pattern's own model table — Operator's table is Mini-only and Advisor's is Frontier-only, so those leaves do not move. Escalate with a named reason the cheaper tier cannot meet: bounded reasoning with clear anchors stays Balanced. Frontier review belongs to the Reviewer pattern. Persistent architecture guidance belongs to Advisor only when the user chooses that relationship. "The task feels important" is not a reason — importance routes verification to the parent, not cost to the model. When the user names a model or lineage the pattern's table allows for this job, use that name; do not substitute a cheaper default and do not re-ask. A Frontier model on a writing Worker is not legal. Advisor model and effort are the user's choice; a named Frontier Reviewer is not an Advisor assignment.

Persistence follows useful continuing work; cache expiry alone does not end a relationship (see Session Keep-Alive).

## Patterns

Manage every subagent through one of the following patterns. The runtime supplies the launch mechanism.

Where display names are supported, use `🐒 Sidekick · purpose`, `🦉 Advisor · purpose`, `🛠️ Worker · purpose`, `🔎 Reviewer · purpose`, and `🔧 Operator · purpose`. Keep legal native task IDs when required; names do not replace session addresses or authorize another session.

### Advisor
Use an Advisor in a separate persistent conversation for a guidance relationship on a problem that spans multiple components, systems, or architecture. Guidance only — the Advisor never executes or edits; you drive the loop. Use an Advisor only when the user chooses the relationship, model, and effort; do not create a Sidekick as an unrequested substitute.

- **Work:** Candidate guidance, reflection, course correction, and completion checks across a problem that outlives any single assignment, while the parent remains executor.
- **Continuity and cardinality:** User-selected persistent named guidance relationship, with ledger and deliberate continuity (see Session Keep-Alive). Use Reviewer for a bounded independent assessment; do not automatically add an Advisor because the main model is Frontier.
- **Authority:** The Advisor returns candidate guidance; the parent validates it and decides.
- **Model category:** Frontier

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Frontier       | OpenAI Astra        | medium or high   |
| Frontier       | Claude Fable        | medium or high   |

Use the model and effort chosen by the user; do not escalate or add another Advisor automatically.

### Sidekick
Use a Sidekick in a separate persistent conversation for work you will resume and steer; a named co-worker with a ledger that does the work and thinks with you — validating, helping, pushing back — at the level of the work at hand. You coordinate and validate the work.

- **Work:** Execution across assignments and follow-ups, including in-the-work reasoning, pushback and validation of your logic. Independent assessment of its own work belongs to a separate Reviewer.
- **Continuity and cardinality:** One or many persistent named relationships with ledger, kept cache-warm (see Session Keep-Alive).
- **Authority:** Provide scope or responsibilities; the parent retains final authority and validates the work.
- **Model category:** Balanced

| Model category | Model lineage | Thinking | Harness preference / nuance                                                                                                 |
| -------------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| Balanced       | OpenAI Terra  | medium   | Codex; sustained judgment. Scope, sources, proof, escalation.                                                               |
| Balanced       | Claude Opus   | medium   | Claude Code; sustained work. Retain context, scope and proof.                                                               |
| Balanced       | Cursor Grok   | medium   | Cursor; sustained work. Sources, scope and completion.                                                                      |

Luna is not a Sidekick.

### Worker
Use for one clear bounded assignment. You manage and validate the work; continue the same worker through corrections belonging to that assignment.

- **Work:** One bounded research, implementation, drafting, reasoning, or analysis assignment. Independent review belongs to Reviewer.
- **Continuity and cardinality:** Single or Worker swarm; single-assignment — the relationship ends when its receipt is accepted, and the assignment may contain a conversation.
- **Authority:** Packet-bounded work; parent verifies the work. No automatic nested delegation.
- **Model category:** Balanced or Mini

| Model category | Model lineage | Thinking | Harness preference / nuance                                                                                                                                                            |
| -------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Balanced       | OpenAI Terra  | medium   | Codex; bounded judgment. Owned paths, outcome and proof.                                                                                                                               |
| Mini           | OpenAI Luna   | xhigh    | Codex; simple, fully guided. Steps, sources, result, check, stop; surface ambiguity.                                                                                                   |
| Balanced       | Claude Opus   | medium   | Claude Code; bounded work. Inputs, scope and proof.                                                                                                                                    |
| Balanced       | Cursor Grok   | medium   | Cursor; bounded work. Clear task and completion.                                                                                                                                       |

### Reviewer
Use for independent review or verification. Select a different model lineage from the author, then resolve the runtime; switching harnesses or selecting another model in the same lineage does not satisfy this requirement.

- **Work:** Source-grounded independent findings and verification of corrections; no implementation edits.
- **Continuity and cardinality:** A bounded review may continue in its own independent context for corrections to the same target when the owning phase permits it. New unrelated review or authoring contamination requires fresh context.
- **Authority:** Candidate findings only; parent verifies and owns the verdict. Preserve all owning-phase review gates and limits.
- **Model category:** Balanced or Frontier

| Model category | Model lineage | Thinking       |
| -------------- | ------------- | -------------- |
| Balanced       | OpenAI Terra  | medium         |
| Balanced       | OpenAI Sol    | medium         |
| Balanced       | Claude Opus   | medium         |
| Balanced       | Cursor Grok   | high           |
| Frontier       | OpenAI Astra  | medium or high |
| Frontier       | Claude Fable  | medium or high |

Astra, Sol, Terra and Luna share OpenAI lineage. Opus and Fable share Claude lineage. Establish author lineage from evidence; if it is unknown or no permitted different-lineage reviewer is available, report that gap without silently substituting same-lineage review. Luna is not a Reviewer. A continuing reviewer retains only its own review history, never the author's conversation; inspect changed evidence rather than treating cache familiarity as current proof.

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Single or Operator swarm; each assignment is independent.
- **Authority:** Execute, observe, and report the bounded procedure. Route judgment, code changes, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

Bright line: any job handed to a subagent that is a bounded mechanical procedure producing no source edits MUST be an Operator. The parent may run trivial single commands inline; long-running watches and monitors MUST go to an Operator rather than be babysat.

| rationalization               | reality                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends                                       |
| "this needs judgment"         | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Worker reasoning assignment |
| "a Worker can handle it"      | Workers are for bounded reasoning work; procedures are Operator work at Mini cost                                                                |

| Model category | Model lineage       | Thinking    |
| -------------- | ------------------- | ----------- |
| Mini           | OpenAI Luna         | high        |

## Choose the Runtime

Select the pattern, model category, model lineage, and reasoning requirement first. Sidekicks and Advisors require separate persistent conversations: reuse the same named ACPX session or exact Router-addressable conversation across follow-ups and new assignments in that relationship. Do not substitute a native child merely because its model is available. Workers may use native subagents or separate conversations according to the task; Reviewer independence and phase freshness rules still apply. For a new persistent relationship, use a supported named ACPX session unless an adequate separately addressable Router conversation already exists or the caller supplies another verified separate-session creation path that exposes the required model, effort, permissions and retained session identity. Then choose the runtime from the capabilities required by that relationship and the selected model lineage. Native and ACPX supply the launch mechanism; either runtime uses the same packet, authority, continuity, and parent-verification rules. History-provisioning feasibility feeds this choice, but does not override the separate-conversation requirement for Sidekick or Advisor.

## Context And Access

### Parent Conversation History

- Reviewers: bright line — a review agent NEVER receives parent conversation history. A reviewer is any agent whose assignment is independent review or verification, whatever its pattern. Reviews judge from first principles; inherited context is contamination. Native encoding is only `fork_turns="none"`. A positive integer or `all` is parent-history inheritance and is forbidden. "It will review faster with context" and "give it the last N turns" are the rationalizations this rule catches.
- Non-reviewers: choose `none` or `all` by cost and benefit. History helps a subagent abide by decisions already made; it costs context and money. With native Mini agents history is cheap — little or lots is fine within the model's context limit. The stop is the same at every price: include what the job's stop condition depends on; do not paste unrelated turns even on Mini. With Frontier agents give the minimum that preserves the decisions the job depends on.
- ACPX agents never inherit parent history — carry context in the packet instead (see ACPX Dispatch). The packet's access line records `history none` for every ACPX dispatch.
- Self-fork and resume-self mechanisms (a subagent started from the parent's own conversation) are full-history inheritance and are forbidden for reviewers on every host. "It already has all the context" is the rationalization; the context is the contamination.
- Because a reviewer starts empty, its packet carries everything it will cite: absolute paths (or inlined text) for every reference it is told to load, the governing artifacts as paths or verbatim text, and any owner meaning that exists only in chat copied verbatim. A pointer the reviewer cannot resolve from its own cwd is a missing input. For independent review, `sources:` names the absolute paths of the lane files the parent already selected. Do not put coordinator `SKILL.md` (`spec-program-review`, `implementation-review`) or `manage-agents/SKILL.md` on the reviewer packet. The parent loads manage-agents; the reviewer does not. "The reviewer will not know how to review" is the rationalization this rule catches.

### Workspace Access

Every packet's `access:` line states history and workspace scope: `workspace read-only`, `read-only + exec <listed commands>`, or `write <paths>`.

- Readers (review, advisor, research, guidance): they may read the repo and may write under project `tmp/` or system `/tmp`. They must not edit any file in the repo. Repeat that on `job:`, `non-goals:`, `stop when:`, and `access:`. Parent verifies the repo worktree is unchanged after the receipt.
- Readers with exec (`read-only + exec <listed commands>`): the one reviewer widening, for a proof-verification lane. It may run exactly the listed commands with output under `tmp/` or `/tmp`, and edits nothing. Parent verifies every command the receipt lists appears in the grant and that the repo worktree is unchanged after the receipt; a mismatch invalidates the receipt.
- Writers (Sidekicks, Workers, Operators that produce files): the parent names the write paths. The packet says edit only under those paths; an edit outside them is a stop — return blocked. Parent verifies the receipt's diff stayed inside the declared scope.

Launch with the native or ACPX encoding returned by **Choose the Runtime**. Host permission flags live in that provider reference. A missing sandbox or plan-mode flag is not a reason to leave native. "The review workflow requires an enforced sandbox" is the rationalization this rule catches.

### Shared Work Context

When an assignment contributes to an existing work thread, carry its exact shared work reference with the relevant sources and say whether the agent may post findings or must return them to the parent. A reference alone grants no posting or sending authority. Use `agent-collaboration` for Router operations and `track-show-me-your-work` for meaningful checkpoints. Keep runtime identity, permissions, and receipt verification here; do not copy session ledgers or every agent action into the discussion. Contributors do not resolve the whole-work thread. Reviewers still receive bounded sources without inherited author conversation; a work thread is not a substitute for an independent review packet.

### Session Keep-Alive

For Codex, use **26 minutes** since the last relevant model request as the maintenance target for an idle continuing session expected to resume. Active qualifying requests reset the clock; never ping a busy worker solely for cache maintenance. Record relevant activity and actual maintenance in the session ledger (`references/session-ledger.md`). A status read or wait call does not refresh provider model state, and cache expiry does not destroy a session.

This skill owns the target. It is a working policy, not a guaranteed provider TTL or savings claim. Use verified provider behavior for other harnesses rather than copying the Codex interval. Prefer useful follow-ups, available native waits/notifications, or an authorized Router wake through `agent-collaboration`; do not run a repeated model-turn polling loop. Preserve the user's requested task schedule and existing communication authority.

### Native Dispatch

For Workers, Operators, and eligible Reviewers, prefer native dispatch in the parent host's model lineage when it meets the assignment's capabilities. Sidekick and Advisor persistence takes precedence: use their separate conversation even for the same lineage, with ACPX when that is the supported persistent route. Do not replace an adequate native assignment with a CLI wrapper merely to invent access flags.

- IF Codex is spawning an OpenAI model, load `references/native-providers-codex.md` and return the exact `model`, `reasoning_effort`, `fork_turns`, and workspace-access encoding.
- IF Claude is spawning a Claude model, load `references/native-providers-claude.md` and return the host Task / Agent encoding and workspace-access encoding.
- IF Cursor is spawning an advertised Cursor model, load `references/native-providers-cursor.md` and return the host Task encoding and workspace-access encoding.
- Use the exact model id and reasoning control supported by the native runtime.

When an own-lineage model is unavailable, choose a declared native fallback or report the route as degraded or blocked.

### ACPX Dispatch

Use ACPX for a different-provider model or the persistent route selected by **Choose the Runtime**.

1. Load `references/acpx.md` for provider-neutral configuration, command, session, permission, and output mechanics.
2. Select exactly one provider and load its contract before constructing or executing the call:
   - `codex` -> `references/acpx-provider-codex.md`
   - `claude` -> `references/acpx-provider-claude.md`
   - `cursor` -> `references/acpx-provider-cursor.md`
3. Use the exact model id and reasoning control specified by the provider contract. When the contract requires live catalog verification, use and record the exact id the provider advertises.
4. When the selected provider has no provider contract, stop dispatch and report the route as unsupported.

ACPX agents start with zero parent context: parent conversation history never crosses the ACPX boundary; only the packet does. (ACPX session continuity in `references/acpx.md` is the agent's own session history — a different thing.) Before dispatch, decide what the job needs to abide by its function and give each piece its packet home: the goal and decision target go on the `job:` line; settled decisions the agent must not relitigate go on `job:` or `non-goals:`; exact file paths, diffs, and prior attempts go on `sources:`; and `access:` records `history none`. For native-eligible jobs, history needs may favor native dispatch. For persistent relationships, preserve the identity selected by **Choose the Runtime** and supply relevant new context.

## Workflow

0. IF the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task, load `references/job-planning.md` and return the job graph: jobs, dependencies and parallel-safety, and parent verification points. Step 0 identifies jobs; it does not choose patterns — step 1 owns pattern choice and annotates the graph per job.
   - Completion: every dependency is named, every parallel-safe marking names the write-set or input check from `references/job-planning.md` that supports it, and each job names its expected receipt and the parent verification point that closes it. Actual receipts arrive at step 3; step 0 completes before any dispatch.

1. Choose the pattern before the model, provider, or runtime. Then choose the model category, lineage, and reasoning requirement from the pattern tables above, taking the cheapest category and lineage at or above the pattern's floor per Capability Economics unless the user named a lineage the table allows for this job. When a job graph exists, choose the pattern per job and annotate the graph before any model or runtime choice.
   - Completion: Advisor, Sidekick, Worker, Reviewer, or Operator is explicit, with an allowed model category, reasoning requirement, and lineage.

2. Choose parent conversation history and workspace access, then follow **Choose the Runtime** to resolve native availability, runtime, and exact model id.
   - Dispatch completion: the packet records both selections.
   - Native completion: this is a native subagent assignment, not a Sidekick or Advisor; the selected model belongs to the parent host's own lineage, the native provider reference has been loaded when one exists, and the exact supported model id, reasoning control, history encoding, and packet `access:` line are explicit. The launch used the host native tool, not a CLI sandbox stand-in.
   - ACPX completion: `references/acpx.md` and exactly one selected `references/acpx-provider-*.md` contract have both been loaded, and the exact provider-specified model id, reasoning control, session-history encoding, and permission flags are explicit. A review used a named session, not `exec`. A Sidekick or Advisor used its established named session for continuation, not `exec` or `sessions new`; initial creation recorded the new relationship identity. No call passed `--timeout`. A dropped wait was not called `blocked` until `sessions list/show/read` was checked.
   - Router completion: a supplied or discovered separate conversation satisfies the selected role/model/access and its exact SessionRef is retained; missing creation/input capability is an explicit gap.
   - Unsupported completion: report the missing provider contract or capability and stop dispatch.

3. Build one bounded packet for a new or materially changed assignment, dispatch it, and reduce the result. Same-assignment follow-ups reuse identity and scope with a concise delta; repeat selection when role, source target, authority, model/runtime, or expected result materially changes. A new assignment in the same Sidekick/Advisor relationship refreshes the packet, not the session: retain its identity unless the relationship itself is explicitly replaced.
   - For a new or materially changed assignment, MUST load `references/agent-job-packet.md` and return the filled job packet. For a same-assignment follow-up, use its existing contract and return the delta. After dispatch, return the agent-result reduction block; return the Operator decision block only when its gate fires.
   - Treat agent output as candidate evidence. The parent owns decisions and verifies assignment-bound claims before accepting them.
   - Completion: sources, non-goals, return binding, stop condition, and parent verification are explicit in the packet; the return line names its binding identifiers and the verify line names at least one concrete parent check (never "none" unless the job is read-only with no claims); every claim is accepted, rejected, or unverified after those checks.

4. Manage persistent relationships.
   - Create the ledger before the first Advisor, Sidekick, or continuing Reviewer prompt that assumes continuity.
   - Load `references/session-ledger.md` for creation, resume, reconnect, progress, history, freshness, keep-alive, or reduction.
   - Use status as liveness evidence. Accept completion from a current assignment-bound receipt that matches the source or head version.
   - Completion: the persistent identity is stable, the current receipt matches the assignment and source or head version, and relevant activity or eligible maintenance is recorded under Session Keep-Alive.

Extra: If you need to build, modify, or wrap an ACP-compatible adapter, read `references/building-acp-adapters.md`.
