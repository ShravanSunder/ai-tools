---
name: manage-agents
description: Use when choosing, dispatching, resuming, monitoring, or reducing advisors, sidekicks, subagents, or subagent swarms; selecting model lineage, provider, or runtime; or using ACPX sessions, automation, flows, and custom ACP adapters.
---

# Manage Agents

Run subordinate AI-agent work without flattening relationships, models, and
runtimes into one choice. The parent chooses each axis deliberately:

```text
category -> assignment -> topology -> lineage -> model capability
         -> provider/runtime -> permissions -> receipt -> reduction
```

Categories describe the relationship to the parent. An advisor is usually one
persistent consultative agent. A sidekick is usually one persistent delegated
worker. A subagent is one ephemeral bounded worker. A swarm is a topology made
from multiple independent subagents; it is not a fourth category. A handoff is
a transfer protocol, not an agent category.

## Core Rules

- Parent owns truth. Subordinate output is candidate evidence until the parent
  verifies it.
- Category before provider. Choose advisor, sidekick, or subagent before a
  model, provider, runtime, or command.
- Topology is separate. Choose one agent or a swarm only after the category and
  assignment are clear. Do not describe advisor or sidekick collections as
  swarms by default.
- Task before model. Match risk, required judgment, lineage independence, and
  reasoning level before optimizing cost or availability.
- Provider is not lineage. Cursor is a multi-model provider; ACPX is a runtime.
  Neither identifies the model family by itself.
- Packet before prompt. Every non-trivial subordinate job gets source anchors,
  authority limits, non-goals, expected receipt, and stop condition.
- Continuity needs a ledger. Advisors, sidekicks, and queued follow-ups need
  enough state to resume, monitor, and reduce safely.
- Queue is not steer. Queue runs later; steer affects the active turn only when
  the harness exposes that capability.

Completion: the parent can name the job, target agent, session mode, permission
boundary, expected receipt, progress check, and verification step before
treating the subordinate agent call as underway.

## When Loaded

1. Choose the category and topology.
   - Load `references/glossary.md` when terms like sidekick, advisor, swarm,
     handoff, queue, or steer are ambiguous.
   - Load `references/orchestration-patterns.md` when deciding between an
     advisor, sidekick, subagent, one-agent topology, subagent swarm, or
     workflow handoff.
   - Completion: category, assignment, and topology are named before any model,
     provider, or command.

2. Choose lineage, model capability, and provider.
   - Load `references/model-selection.md` for risk, lineage independence,
     reasoning level, current-generation model guidance, and fallback rules.
   - Load `references/agent-registry.md` for the provider map and ACPX agent
     resolution, then load one provider reference when provider behavior
     matters.
   - Completion: the chosen model can perform the assignment at the required
     risk level, and any availability fallback preserves the category's
     lineage and capability constraints.

3. Pick the runtime and permission boundary.
   - Load `references/runtime-control.md` for session, prompt, queue, steer,
     cancel, permission, timeout, or model controls.
   - Load `references/automation-and-flows.md` for JSON, exit-code, quiet,
     strict-output, or TypeScript flow automation.
   - Load `references/building-custom-agents.md` only when building or wrapping
     an ACP-compatible adapter.
   - Completion: runtime and permission choices follow the category, assignment,
     topology, and model choice.

4. Write the packet.
   - Load `references/agent-job-packet.md` for dispatch prompts, advisor notes,
     handoffs, and reduction receipts.
   - Completion: the packet names category, assignment, topology, lineage,
     model, provider/runtime, authority, source anchors, non-goals, permission
     boundary, receipt, and stop condition.

5. Track continuity, dispatch, and monitor.
   - Load `references/session-ledger.md` for advisors, sidekicks, resumed
     sessions, queued follow-ups, progress checks, or multi-agent reduction.
   - Create the ledger row before the first persistent prompt. Send the packet,
     then use runtime status and saved session output to distinguish queued,
     running, answered, blocked, dead, or missing work.
   - Completion: persistent work has a ledger row and current receipt; one-shot
     work names why no ledger is needed.

6. Reduce to the parent workflow.
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
  advisors, sidekicks, subagents, single-agent or swarm topology, and workflow
  handoffs before provider or command selection.
- `references/model-selection.md`: assignment risk, lineage independence,
  reasoning level, current-generation model guidance, and fallback rules.
- `references/session-ledger.md`: persistent agent naming, session ids,
  progress polling, history, receipts, and parent reduction.
- `references/automation-and-flows.md`: machine-readable output, exit codes,
  `jq` parsing, quiet mode, strict JSON, and TypeScript flows.
- `references/agent-registry.md`: provider map plus selection of built-in, raw,
  overridden, or config-defined ACPX agents.
- `references/building-custom-agents.md`: building or wrapping an
  ACP-compatible custom agent. This is the custom-agent authoring reference;
  do not shorten it to the overloaded name `custom-agents.md`.
- `references/provider-claude.md`: Claude-specific ACPX behavior.
- `references/provider-codex.md`: Codex-specific ACPX behavior.
- `references/provider-cursor.md`: Cursor-specific ACPX behavior.
