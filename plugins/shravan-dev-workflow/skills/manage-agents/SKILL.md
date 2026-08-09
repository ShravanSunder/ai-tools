---
name: manage-agents
description: Always use when using or dispatching an advisor, sidekick, delegate, operator, or any subagent; when handing off to a subagent mechanical work such as running tests or builds, watching CI or PR checks, monitoring, scraping, or grouping logs into a report; for second opinions from another model, subagent-driven development, planning agent jobs, or parallel subagents; deciding how to call or coordinate subagents; choosing model capability. Use for native subagents and ACPX subagents. Not for owning the research or evidence workflow itself (research-swarm), the GitHub PR lifecycle itself (implementation-pr-wrapup), or bare inline commands with no subagent — load this skill whenever those workflows dispatch subagents.
---

# Manage Agents

The agent pattern owns work, continuity, authority, cardinality, and the minimum capability category. A model category is a model-plus-thinking combination.

Dispatch has two nested levels. The job graph owns decomposition, sequencing, and parent verification points. Each job then runs one ordered dispatch decision:

```text
pattern -> model category -> model lineage (both the cheapest at or above
           the pattern's floor per Capability Economics) -> reasoning requirement
        -> history and workspace access -> native availability
        -> native or ACPX runtime -> exact model id -> packet -> receipt
```

When the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task, build the job graph first; it governs the order and verification point of every later dispatch. A job yields at most one assignment-bound receipt and always closes at its named parent verification point.

## When To Call What

Choose the pattern from the job type, before any thought about model or runtime. Inspect three things: does the job need judgment or is it a procedure; will you resume this relationship or discard it after one receipt; who owns the final claim. If the job matches a row, use that row's pattern — no judgment call is left at the row boundary.

| if the job is | then use | good-selection signal | mis-selection trap |
|---------------|----------|-----------------------|--------------------|
| a strategic, ambiguous, or high-stakes decision where you stay the executor | Advisor | you keep driving; the Advisor returns candidate guidance you validate | asking the Advisor to execute or edit — that is Delegate or Sidekick work |
| multi-turn delegated work you will resume and steer | Sidekick | a named relationship with a ledger outlives this assignment | a Sidekick for a one-shot bounded assignment — that is a Delegate |
| one bounded reasoning assignment: research, review, an implementation slice | Delegate | you can write the packet's stop condition in one sentence and discard the agent after the receipt | handing a Delegate a mechanical procedure — that is Operator work at Mini cost |
| a bounded mechanical procedure: running tests or builds, watching CI or PR checks (`gh` watch), monitoring, scraping, or grouping logs into a report | Operator | the procedure needs no judgment; anything requiring judgment routes back to you | "this needs judgment, so no Operator" — split it: procedure to the Operator, judgment back to you |

Selection is done when every job names its pattern and no model has been named yet.

## Capability Economics

The pattern picks the shape of the work and its table owns the allowed category floor; Capability Economics picks the cheapest category and lineage at or above that floor.

Mini (OpenAI Luna) is super cheap. Default grunt work to Mini whenever the pattern's floor allows it: mechanical procedures, bounded scans and summaries, format conversions, test-and-report loops, watches. A Mini agent can be a Sidekick, a Delegate, or an Operator.

Escalate the category only when the job's judgment demands it: ambiguous tradeoffs, cross-module design, or high-stakes decisions go Frontier; bounded reasoning with clear anchors goes Balanced. "The task feels important" is not a reason to escalate — importance routes verification to the parent, not cost to the model.

## Patterns

Manage every subagent through one of the following patterns. The runtime supplies the launch mechanism.

### Advisor
Use an Advisor for strategic, high-stakes, or ambiguous decisions or second opinions; get help from a Frontier model. You drive the loop.

- **Work:** Strategic advice, reflection, course correction, or completion checks while the parent remains executor.
- **Continuity and cardinality:** Exactly one persistent named advisor.
- **Authority:** The Advisor returns candidate guidance; the parent validates it.
- **Model category:** Frontier

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Frontier       | OpenAI Sol          | high, xhigh, max |
| Frontier       | Claude Fable        | high             |
| Frontier       | Claude Opus         | high, xhigh      |

### Sidekick
Use a Sidekick for multi-turn delegated work you will resume and steer; a named ongoing co-worker with a ledger. You coordinate and validate the work.

- **Work:** Delegated execution across assignments and follow-ups.
- **Continuity and cardinality:** One or many persistent named relationships with ledger.
- **Authority:** Provide scope or responsibilities; the parent retains final authority and validates the work.
- **Model category:** Frontier, Balanced, or Mini

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Frontier       | OpenAI Sol          | high, xhigh      |
| Frontier       | Claude Opus         | high             |
| Balanced       | OpenAI Sol          | low or medium    |
| Balanced       | Claude Opus         | medium           |
| Mini           | OpenAI Luna         | high, xhigh, or max |

### Delegate
Use for one clear bounded assignment then discard. You manage and validate the work.

- **Work:** One bounded research, review, implementation, or reasoning assignment.
- **Continuity and cardinality:** Single or Delegate swarm; one-shot.
- **Authority:** Packet-bounded work; parent verifies the work.
- **Model category:** Frontier, Balanced, or Mini

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Frontier       | OpenAI Sol          | high or xhigh    |
| Balanced       | OpenAI Sol          | low or medium    |
| Balanced       | Claude Opus         | medium           |
| Balanced       | Cursor Grok 4.5     | medium or high   |
| Mini           | OpenAI Luna         | max              |

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Single or Operator swarm; each assignment is independent.
- **Authority:** Execute, observe, and report the bounded procedure. Route judgment, code changes, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

Bright line: any job handed to a subagent that is a bounded mechanical procedure MUST be an Operator. The parent may run trivial one-shot commands inline; long-running watches and monitors MUST go to an Operator rather than be babysat.

| rationalization | reality |
|-----------------|---------|
| "it's faster to do it myself" | dispatch discipline buys parent attention, not speed; the watch you babysit costs every turn until it ends |
| "this needs judgment" | split it: the procedure goes to the Operator; the judgment routes back to you, and you decide or dispatch a separate Delegate reasoning assignment |
| "a Delegate can handle it" | Delegates are for bounded reasoning work; procedures are Operator work at Mini cost |

| Model category | Model lineage       | Thinking    | Preference                     |
| -------------- | ------------------- | ----------- | ------------------------------ |
| Mini           | OpenAI Luna         | high, xhigh | preferred                      |
| Mini           | Cursor Composer 2.5 | no thinking | fallback when Luna unavailable |

## Choose the Runtime

Select the pattern, model category, model lineage, and reasoning requirement first. Then route from the parent host's own model lineage. Native and ACPX supply the launch mechanism; either runtime uses the same packet, authority, continuity, and parent-verification rules. History-provisioning feasibility feeds this choice: when required context cannot be summarized into the packet, prefer native dispatch before locking a runtime.

## Context And Access

### Parent Conversation History

- Reviewers: bright line — a review agent NEVER receives parent conversation history. A reviewer is any agent whose assignment is independent review or verification, whatever its pattern. Reviews judge from first principles; inherited context is contamination. "It will review faster with context" is the rationalization this rule catches.
- Non-reviewers: choose `none` or `all` by cost and benefit. History helps a subagent abide by decisions already made; it costs context and money. With native Mini agents history is cheap — little or lots is fine within the model's context limit. The stop is the same at every price: include what the job's stop condition depends on; do not paste unrelated turns even on Mini. With Frontier agents give the minimum that preserves the decisions the job depends on.
- ACPX agents never inherit parent history — carry context in the packet instead (see ACPX Dispatch). The packet's access line records `history none` for every ACPX dispatch.

### Workspace Access

- Reviewers: `read-only`.
- Non-reviewers: the parent chooses `read-only` or `write`.  Only use `write` when you need to modify the workspace.

### Native Dispatch

Use native dispatch for the parent host's own model lineage when the selected model is available.

- Codex spawning OpenAI models: load `references/native-providers-codex.md`.
- Claude spawning Claude models: use the host-native agent contract.
- Use the exact model id and reasoning control supported by the native runtime.

When an own-lineage model is unavailable, choose a declared native fallback or report the route as degraded or blocked.

### ACPX Dispatch

Use ACPX for a model lineage owned by a different provider than the parent host.

1. Load `references/acpx.md` for provider-neutral configuration, command, session, permission, and output mechanics.
2. Select exactly one provider and load its contract before constructing or executing the call:
   - `codex` -> `references/acpx-provider-codex.md`
   - `claude` -> `references/acpx-provider-claude.md`
   - `cursor` -> `references/acpx-provider-cursor.md`
3. Use the exact model id and reasoning control specified by the provider contract. When the contract requires live catalog verification, use and record the exact id the provider advertises.
4. When the selected provider has no provider contract, stop dispatch and report the route as unsupported.

ACPX agents start with zero parent context: parent conversation history never crosses the ACPX boundary; only the packet does. (ACPX session continuity in `references/acpx.md` is the agent's own session history — a different thing.) Before dispatch, decide what the job needs to abide by its function and give each piece its packet home: the goal and decision target go on the `job:` line; settled decisions the agent must not relitigate go on `job:` or `non-goals:`; exact file paths, diffs, and prior attempts go on `sources:`; and `access:` records `history none`. When the job depends on long parent history that cannot be summarized into a packet, prefer native dispatch in the parent's own lineage; choose ACPX when lineage diversity or independence matters more than shared history.

## Workflow

0. IF the request names more than one outcome or action, any work could run in parallel, or you are unsure one bounded packet covers the task, load `references/job-planning.md` and return the job graph: jobs, dependencies and parallel-safety, and parent verification points. Step 0 identifies jobs; it does not choose patterns — step 1 owns pattern choice and annotates the graph per job.
   - Completion: every dependency is named, every parallel-safe marking names the write-set or input check from `references/job-planning.md` that supports it, and each job names its expected receipt and the parent verification point that closes it. Actual receipts arrive at step 3; step 0 completes before any dispatch.

1. Choose the pattern before the model, provider, or runtime. Then choose the model category, lineage, and reasoning requirement from the pattern tables above, taking the cheapest category and lineage at or above the pattern's floor per Capability Economics. When a job graph exists, choose the pattern per job and annotate the graph before any model or runtime choice.
   - Completion: Advisor, Sidekick, Delegate, or Operator is explicit, with an allowed model category, reasoning requirement, and lineage.

2. Choose parent conversation history and workspace access, then follow **Choose the Runtime** to resolve native availability, runtime, and exact model id.
   - Dispatch completion: the packet records both selections.
   - Native completion: the selected model belongs to the parent host's own lineage, the native provider reference has been loaded when one exists, and the exact supported model id, reasoning control, history encoding, and workspace-access enforcement are explicit.
   - ACPX completion: `references/acpx.md` and exactly one selected `references/acpx-provider-*.md` contract have both been loaded, and the exact provider-specified model id, reasoning control, session-history encoding, and permission flags are explicit.
   - Unsupported completion: report the missing provider contract and stop dispatch.

3. Build one bounded packet for every non-trivial call, dispatch it, and reduce the result.
   - MUST load `references/agent-job-packet.md` and return the filled job packet and, after dispatch, the agent-result reduction block; return the Operator decision block only when its gate fires.
   - Treat agent output as candidate evidence. The parent owns decisions and verifies assignment-bound claims before accepting them.
   - Completion: sources, non-goals, return binding, stop condition, and parent verification are explicit in the packet; the return line names its binding identifiers and the verify line names at least one concrete parent check (never "none" unless the job is read-only with no claims); every claim is accepted, rejected, or unverified after those checks.

4. Manage persistent relationships.
   - Create the ledger before the first Advisor or Sidekick prompt that assumes continuity.
   - Load `references/session-ledger.md` for creation, resume, reconnect, progress, history, freshness, or reduction.
   - Use status as liveness evidence. Accept completion from a current assignment-bound receipt that matches the source or head version.
   - Completion: the persistent identity is stable and the current receipt matches the assignment and source or head version.

Extra: If you need to build, modify, or wrap an ACP-compatible adapter, read `references/building-acp-adapters.md`.
