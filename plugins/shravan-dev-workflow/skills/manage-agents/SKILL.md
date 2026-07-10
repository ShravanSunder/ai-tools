---
name: manage-agents
description: Use when choosing, dispatching, resuming, monitoring, or reducing advisors, sidekicks, delegates, operations, or swarms; choosing native subagents versus ACPX and model lineage; or using ACPX sessions, queueing, automation, flows, and custom adapters.
---

# Manage Agents

The pattern owns work, continuity, authority, and allowed cardinality. Model and
runtime follow it:

```text
pattern -> model category -> exact model -> reasoning effort -> lineage
        -> native or ACPX runtime -> permissions -> packet -> receipt
```

## Rules

- Parent owns decisions and accepted truth. Agent output is candidate evidence.
- Choose the pattern before the model or runtime.
- Operation executes, observes, and reports; it escalates judgment.
- Every non-trivial call gets one bounded packet. Persistent relationships get
  a ledger before the first prompt that assumes continuity.
- Status proves liveness, not correctness. Only assignment-bound output enters
  parent reduction.
- Queue runs later. It is not immediate steer, and acknowledgement is not
  completion.

## Workflow

1. Choose the pattern.
   - Load `references/orchestration-patterns.md`.
   - Completion: Advisor, Sidekick, Delegate, or Operation is explicit; the
     table determines continuity, authority, and allowed single/swarm form.

2. Choose model and runtime.
   - Load `references/model-selection.md` for Frontier, Balanced, and Mini.
   - Load `references/agent-registry.md` when resolving ACPX providers, names,
     raw commands, or config-defined agents.
   - Load `references/provider-claude.md`, `references/provider-codex.md`, or
     `references/provider-cursor.md` only when that provider's behavior matters.
   - Completion: exact model, reasoning effort, lineage, native/ACPX runtime,
     and fallback are explicit.

3. Choose controls and permissions.
   - Load `references/runtime-control.md` for prompt/exec, queue/steer, cancel,
     status, model controls, and permissions.
   - Completion: runtime controls and authority match the packet.

4. Dispatch and reduce.
   - Load `references/agent-job-packet.md` for dispatch, Operation decisions,
     and reduction shapes.
   - Completion: source anchors, non-goals, receipt scope, stop condition, and
     parent verification are present.

5. Manage persistence.
   - Load `references/session-ledger.md` for Advisor/Sidekick creation, resume,
     reconnect, progress, history, freshness, or reduction.
   - Completion: the persistent identity is stable and the current receipt
     matches the assignment and source/head version.

6. Enter specialized branches only when needed.
   - Load `references/automation-and-flows.md` for JSON, exit codes, compare, or
     TypeScript flows.
   - Load `references/building-custom-agents.md` only to build or wrap an ACP
     adapter.

Completion: the parent can name the pattern, model, runtime, permissions,
packet, receipt, and verification step.
