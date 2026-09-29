---
name: manage-agents
description: "Use during project planning, design, and execution to choose who executes, and when spawning, assigning, steering, resuming, waiting for, or verifying Workers, Operators, Sidekicks, Review Sidekicks, Advisors, swarms, or agent-router and ACPX agents."
---

# Manage Agents

The Lead designs and plans, cuts work into independent PRs, and hands well-cut work to the cheapest agent that can do it. A stronger model needs a reason. The Lead writes every design and plan itself; other agents return evidence, findings, or changes inside their assignment. The owner decides tradeoffs, merges, and can override any pick.

Classify the job, pick the role, pick the model, launch, hand off, wait, verify.

## Classify

| Criterion | Answer | Then |
|---|---|---|
| **Direction**: how much the brief decides | Exact: every step is given | |
| | Complete: the approach is named | |
| | Partial: only the outcome is given | name the approach in the plan if you can |
| **Span**: what the agent must hold | Local: one owner and the contracts it uses | |
| | Cross-domain: several owners in one system | write the shared contracts into the plan |
| | Cross-system: a contract another system consumes | split at the system boundary if you can |
| **Horizon**: how long the agent drives before its next check | Step: one command, then report | |
| | Planned: the plan already made its choices | |
| | Open: it makes choices later work builds on | write those choices into the plan if you can |

Size does not set span. Missing intent or a missing plan is missing input, not Partial.

## Roles

| Role | Owns | Lives for | Runs as |
|---|---|---|---|
| 🔧 Operator | a given procedure and what it observed | one procedure | native subagent |
| 🛠️ Worker | one bounded result, with its proof | one job, until accepted | native subagent |
| 🐒 Sidekick | continuing work that needs earlier context | related jobs | its own session, reused by address |
| 🔎 Review Sidekick | independent findings | one review, through its corrections | its own session, no author history |
| 🦉 Advisor | guidance, only when the owner asks | the owner's question | its own session |

A Step job goes to a 🔧 Operator. A Planned job goes to a 🛠️ Worker, or to a 🐒 Sidekick when it needs context from related jobs. Judgment an Operator meets goes back to whoever assigned it. Only the Lead and a Sidekick assign other agents.

Delegate only independent work that costs less to hand off than to do. Work that splits into independent units (an audit, a migration, a review across files) fans out: one Worker per unit, one table at the end.

Title every non-Lead thread `<emoji> <role> · <purpose>`.

## Models

| Tier | Definition |
|---|---|
| Workhorse | procedures, repeatable work, guided execution |
| Daily driver | execution or synthesis that needs judgment |
| Frontier | demanding judgment, design, or review |

A Daily-driver row needs one recorded reason: the owner recommends it, the Lead says what the Workhorse lacks, or the Workhorse failed after corrections. Owner-only rows are used only when the owner names them.

### 🔧 Operator

| Tier | Model | Effort | Direction | Span | Horizon |
|---|---|---|---|---|---|
| Workhorse | OpenAI Luna | medium | Exact | any | Step |

### 🛠️ Worker and 🐒 Sidekick

| Tier | Model | Effort | Direction | Span | Horizon |
|---|---|---|---|---|---|
| Workhorse | OpenAI Luna | xhigh | Complete | Local, Cross-domain | Planned |
| Daily driver | OpenAI Sol | high | Complete | Cross-system | Planned |
| Daily driver | Claude Opus | high | Partial | any | any |
| Daily driver | Claude Opus | high | any | any | Open |
| Daily driver | OpenAI Sol | medium | owner-only | | |

### 🔎 Review Sidekick

Pick a different lineage (OpenAI, Claude, xAI) from the author's.

| Tier | Model | Effort | Use |
|---|---|---|---|
| Daily driver | xAI Grok | high | usual pick, a third lineage |
| Frontier | OpenAI Astra | high | |
| Daily driver | Claude Opus | medium or high | |
| Frontier | OpenAI Astra, Claude Opus | xhigh | owner-only |
| Frontier | Claude Fable | high | owner-only |

### 🦉 Advisor

The owner picks: OpenAI Astra high or xhigh, Claude Opus high or xhigh, or Claude Fable high.

## Launch

Operators and Workers run as native subagents. Sidekicks, Review Sidekicks, and Advisors run in their own sessions; reuse a session by its address, and keep the model and effort it was created with.

Exact id: the host's row in `~/.config/agent-context/model-map.md`; otherwise the host's current-generation id for the Models row, never an older generation or a `-fast` variant; otherwise report the gap.

- IF the role runs in its own session, load `agent-collaboration` and return the session address.
- IF Codex spawns it, load `references/native-providers-codex.md` and return the spawn encoding.
- IF Claude spawns it, load `references/native-providers-claude.md` and return the spawn encoding.
- IF Cursor spawns it, load `references/native-providers-cursor.md` and return the spawn encoding.
- IF the host has no native model for the row, run it through agent-router instead.
- IF agent-router cannot meet the model, effort, access, or title, load `references/acpx-legacy.md` and return the route. An access denial needs the grant, not a route switch.
- IF building or wrapping an ACP adapter, load `references/building-acp-adapters.md` and return its checklist.

## Hand off

MUST load `references/agent-job-packet.md` and return the packet, plus the session row when the role runs in its own session.

A Review Sidekick gets no author history: no fork, no resume. Its packet carries the sources. When an agent drifts, send it a correction; don't restart it.

## Wait, verify

Wait once no independent work is left. A native result arrives through the host's notification; IF Codex native lifecycle tools apply, load `references/native-providers-codex.md` and return the `timeout_ms`. IF waiting on an agent in its own session, load `practices-collaboration` and return its listener or wake. A long CI watch goes to an Operator.

Check the result's evidence (files, exit codes, diff scope) against its claim, and mark each claim accepted, rejected, or unverified. The Lead gives the overall verdict.

Done when the role, the Models row, and any Daily-driver reason are recorded, the packet was sent, and the result's evidence was checked.
