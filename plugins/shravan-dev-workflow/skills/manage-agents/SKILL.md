---
name: manage-agents
description: Use when using an advisor, sidekick, delegate, operator, subagent, or swarm; deciding how to call or coordinate subagents for implementation, TDD and testing, research, reviews, monitoring, or other bounded work; choosing model capability; or learning how to use ACPX.
---

# Manage Agents

The pattern owns work, continuity, authority, cardinality, model category, and
reasoning floor. Runtime follows it:

```text
pattern -> model category -> exact model -> reasoning effort -> lineage
        -> native or ACPX runtime -> permissions -> packet -> receipt
```

## Patterns

| Pattern | Work | Continuity and cardinality | Authority | Model | Effort |
| --- | --- | --- | --- | --- | --- |
| Advisor | Strategic advice, reflection, course correction, or completion checks while the parent remains executor. | Exactly one persistent named relationship. | Candidate guidance only. | Frontier | high or above |
| Sidekick | Delegated execution across assignments and follow-ups. | Exactly one persistent named relationship with ledger. | Scoped execution; no final authority. | Frontier or Balanced | medium or above |
| Delegate | One bounded research, review, implementation, or reasoning assignment. | Single or Delegate swarm; normally one-shot. | Packet-bounded work; parent verifies. | Balanced or Mini | medium or above |
| Operator | A bounded procedure, monitor, simple `git`/`gh` or PR-state check, script, scrape, or structured report. | Single or Operator swarm; no semantic continuity. | Execute, observe, and report only. No judgment, code changes, replies, readiness verdicts, or merge; send a decision packet. | Mini | medium or above |

A subagent is a runtime, not a pattern. Use a Delegate for bounded judgment or
implementation and an Operator for mechanical execution or observation.
Changing patterns requires a new packet and authority boundary; entering
Advisor or Sidekick also requires a ledger transition.

## Models

| Model category | Models |
| --- | --- |
| Frontier | GPT-5.6 Sol, Claude Fable |
| Balanced | GPT-5.6 Terra, Claude Opus, Grok 4.5 through Cursor |
| Mini | GPT-5.6 Luna, Cursor Composer 2.5 |

Verify the exact provider-advertised model id. Use a declared equivalent
fallback or report degraded/blocked when the required category or lineage is
unavailable.

## Runtimes

| Runtime | What it is | Choose it when |
| --- | --- | --- |
| Native subagent | The current host's built-in agent runtime. The host may be Codex, Claude, Cursor, or another client. | The host exposes the selected model and can honor the pattern's continuity and authority. |
| ACPX | A client for calling ACP-compatible provider adapters and persistent sessions outside the host's native runtime. | The selected provider or lineage is not native, persistent cross-provider control is required, or the user asks for ACPX. |

Native describes how the subagent is launched, not its pattern or model. A
native subagent still operates as an Advisor, Sidekick, Delegate, or Operator
under the same packet, authority, continuity, and parent-verification rules.

## Rules

- Parent owns decisions and accepted truth. Agent output is candidate evidence.
- Choose the pattern before the model or runtime.
- Operator executes, observes, and reports; it escalates judgment.
- Every non-trivial call gets one bounded packet. Persistent relationships get
  a ledger before the first prompt that assumes continuity.
- Status proves liveness, not correctness. Only assignment-bound output enters
  parent reduction.
- Queue runs later. It is not immediate steer, and acknowledgement is not
  completion.

## Workflow

1. Choose the pattern and model from the tables above.
   - Completion: Advisor, Sidekick, Delegate, or Operator is explicit, with an
     allowed model category, reasoning effort, and lineage requirement.

2. Choose native or ACPX runtime.
   - Prefer a native subagent when the current client exposes the selected model
     and the pattern's continuity can be honored.
   - Load `references/acpx.md` for another provider or lineage, persistent
     cross-provider work, explicit ACPX use, or ACPX configuration and control.
   - After choosing an ACPX provider, load `references/acpx-provider-claude.md`
     or `references/acpx-provider-cursor.md` when that provider has additional
     behavior.
   - When the user explicitly asks to build, modify, or wrap an ACP-compatible
     adapter, route that work through `references/building-acp-adapters.md`.
   - Completion: exact model, reasoning effort, runtime, permissions, and
     fallback are explicit.

3. Dispatch and reduce.
   - Load `references/agent-job-packet.md` for dispatch, Operator decisions,
     and reduction shapes.
   - Completion: source anchors, non-goals, receipt scope, stop condition, and
     parent verification are present.

4. Manage persistence.
   - Load `references/session-ledger.md` for Advisor/Sidekick creation, resume,
     reconnect, progress, history, freshness, or reduction.
   - Completion: the persistent identity is stable and the current receipt
     matches the assignment and source/head version.

Completion: the parent can name the pattern, model, runtime, permissions,
packet, receipt, and verification step.
