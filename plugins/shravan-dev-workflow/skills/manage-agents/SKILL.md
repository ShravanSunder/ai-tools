---
name: manage-agents
description: Always use when using an advisor, sidekick, delegate, operator or subagent; deciding how to call or coordinate subagents for implementation, TDD and testing, research, reviews, monitoring, or other bounded work; choosing model capability. Use for native subagents and ACPX subagents.
---

# Manage Agents

The agent pattern owns work, continuity, authority, cardinality, and the minimum capability category. A model category is a model-plus-thinking combination. Dispatch is one ordered decision:

```text
pattern -> model category -> model lineage -> reasoning requirement
        -> native availability -> native or ACPX runtime -> exact model id
        -> permissions -> packet -> receipt
```

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
- **Model category:** Frontier or Balanced

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Frontier       | OpenAI Sol          | high, xhigh      |
| Frontier       | Claude Opus         | high             |
| Balanced       | OpenAI Sol          | low or medium    |
| Balanced       | Claude Opus         | medium           |

### Delegate
Use for one clear bounded assignment then discard. You manage and validate the work.

- **Work:** One bounded research, review, implementation, or reasoning assignment.
- **Continuity and cardinality:** Single or Delegate swarm; one-shot.
- **Authority:** Packet-bounded work; parent verifies the work.
- **Model category:** Balanced or Mini

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Balanced       | OpenAI Sol          | low or medium    |
| Balanced       | Claude Opus         | medium           |
| Balanced       | Cursor Grok 4.5     | medium or high   |

### Operator
Use for mechanical actions: execution (running tests, building, deploying, etc.) / observe (gh watch) / scraping / watching (watching monitors) / report (grouping logs and results). Give the Operator a procedure and reserve reasoning for the parent.

- **Work:** A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report.
- **Continuity and cardinality:** Single or Operator swarm; each assignment is independent.
- **Authority:** Execute, observe, and report the bounded procedure. Route judgment, code changes, replies, readiness verdicts, and merge decisions to the parent.
- **Model category:** Mini

| Model category | Model lineage       | Thinking         |
| -------------- | ------------------- | ---------------- |
| Mini           | OpenAI Luna         | high or xhigh    |
| Mini           | OpenAI Terra        | low or medium    |
| Mini           | Cursor Composer 2.5 | no thinking      |

## Choose the Runtime

Select the pattern, model category, model lineage, and reasoning requirement first. Then route from the parent host's own model lineage. Native and ACPX supply the launch mechanism; either runtime uses the same packet, authority, continuity, and parent-verification rules.

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

## Workflow

1. Choose the pattern before the model, provider, or runtime. Then choose the model category, lineage, and reasoning requirement from the pattern tables above.
   - Completion: Advisor, Sidekick, Delegate, or Operator is explicit, with an allowed model category, reasoning requirement, and lineage.

2. Follow **Choose the Runtime** to resolve native availability, runtime, and exact model id.
   - Native completion: the selected model belongs to the parent host's own lineage, the native provider reference has been loaded when one exists, and the exact supported model id and reasoning control are explicit.
   - ACPX completion: `references/acpx.md` and exactly one selected `references/acpx-provider-*.md` contract have both been loaded, and the exact provider-specified model id and reasoning control are explicit.
   - Unsupported completion: report the missing provider contract and stop dispatch.

3. Build one bounded packet for every non-trivial call, dispatch it, and reduce the result.
   - Load `references/agent-job-packet.md` for packet, dispatch, Operator decision, and reduction shapes.
   - Treat agent output as candidate evidence. The parent owns decisions and verifies assignment-bound claims before accepting them.
   - Completion: source anchors, non-goals, receipt scope, stop condition, parent verification, and accepted, rejected, or unverified claims are explicit.

4. Manage persistent relationships.
   - Create the ledger before the first Advisor or Sidekick prompt that assumes continuity.
   - Load `references/session-ledger.md` for creation, resume, reconnect, progress, history, freshness, or reduction.
   - Use status as liveness evidence. Accept completion from a current assignment-bound receipt that matches the source or head version.
   - Completion: the persistent identity is stable and the current receipt matches the assignment and source or head version.

Extra: If you need to build, modify, or wrap an ACP-compatible adapter, read `references/building-acp-adapters.md`.
