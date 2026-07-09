---
name: manage-agents
description: Use when subordinate AI-agent work needs parent-owned delegation, monitoring, or reduction across swarms, sidekicks, advisors, ephemeral helpers, workflow handoffs, provider runtimes, JSON automation, flows, or custom ACP adapters.
---

# Manage Agents

Run subordinate AI-agent work without losing parent authority over scope,
permissions, progress, verification, and the final claim. The parent chooses
the relationship shape, sends bounded packets, tracks continuity when needed,
and reduces candidate output back into the owning phase workflow.

## Core Rules

- Parent owns truth. Subordinate output is candidate evidence until the parent
  verifies it.
- Pattern before provider. Choose swarm, sidekick, advisor, ephemeral helper,
  workflow handoff, one-shot, flow, or adapter before choosing a command.
- Packet before prompt. Every non-trivial subordinate job gets source anchors,
  authority limits, non-goals, expected receipt, and stop condition.
- Continuity needs a ledger. Persistent sidekicks and queued follow-ups need
  enough state to resume, monitor, and reduce safely.
- Queue is not steer. Queue runs later; steer affects the active turn only when
  the harness exposes that capability.

Completion: the parent can name the job, target agent, session mode, permission
boundary, expected receipt, progress check, and verification step before
treating the subordinate agent call as underway.

## When Loaded

1. Choose the relationship.
   - Load `references/glossary.md` when terms like sidekick, advisor, swarm,
     handoff, queue, or steer are ambiguous.
   - Load `references/orchestration-patterns.md` when deciding between a swarm,
     persistent sidekick, advisor, ephemeral subagent, or workflow handoff.
   - Completion: the pattern is named before any provider or command.
2. Write the packet.
   - Load `references/agent-job-packet.md` for dispatch prompts, advisor notes,
     handoffs, and reduction receipts.
   - Completion: the packet names authority, source anchors, non-goals,
     receipt, and stop condition.

3. Pick the runtime.
   - Load `references/runtime-control.md` for session, prompt, queue, steer,
     cancel, permission, timeout, or model controls.
   - Load `references/automation-and-flows.md` for JSON, exit-code, quiet,
     strict-output, or TypeScript flow automation.
   - Load `references/agent-registry.md` and one provider reference when agent
     selection or provider behavior matters.
   - Load `references/building-custom-agents.md` only when building or wrapping
     an ACP-compatible adapter.
   - Completion: runtime choice follows the pattern and packet.

4. Track continuity.
   - Load `references/session-ledger.md` for persistent sidekicks, resumed
     sessions, queued follow-ups, progress checks, or multi-agent reduction.
   - Completion: persistent work has a ledger row; one-shot work names why no
     ledger is needed.

5. Reduce to the parent workflow.
   - Accept only claims the parent verifies against source, commands, logs,
     artifacts, or the owning phase skill's proof matrix.
   - Completion: accepted, rejected, and unverified child output are separated.

## Reference Routing

- `references/glossary.md`: term meanings only for subordinate-agent patterns,
  control words, ledgers, receipts, and parent authority.
- `references/agent-job-packet.md`: skill-local packet anatomy for agent-call
  plans, dispatch prompts, handoff packets, and result reductions.
- `references/runtime-control.md`: live command/session controls,
  permissions, queueing, timeout, cancel, status, model control, prompt versus
  exec, and prompt versus steer boundaries.
- `references/orchestration-patterns.md`: harness-neutral choice between
  swarms, persistent sidekicks, advisors, ephemeral subagents, and workflow
  handoffs before provider or command selection.
- `references/session-ledger.md`: persistent sidekick naming, session ids,
  progress polling, history, receipts, and parent reduction.
- `references/automation-and-flows.md`: machine-readable output, exit codes,
  `jq` parsing, quiet mode, strict JSON, and TypeScript flows.
- `references/agent-registry.md`: selecting existing built-in, raw,
  overridden, or config-defined agents.
- `references/building-custom-agents.md`: building or wrapping an
  ACP-compatible custom agent. This is the custom-agent authoring reference;
  do not shorten it to the overloaded name `custom-agents.md`.
- `references/provider-claude.md`: Claude-specific ACPX behavior.
- `references/provider-codex.md`: Codex-specific ACPX behavior.
- `references/provider-cursor.md`: Cursor-specific ACPX behavior.
