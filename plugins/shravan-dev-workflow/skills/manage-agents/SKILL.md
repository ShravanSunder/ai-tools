---
name: manage-agents
description: "Always use when delegating to subagents, agent teams, or parallel agents: choosing which agent and model take a job, or spawning, assigning, steering, resuming, waiting for, or verifying a Worker, Operator, Sidekick, Review Sidekick, or Advisor, including a fan-out across many units."
---

# Manage Agents

Collaborate with other agents through a fixed structure: each job is classified, each agent has a role and a model, each handoff is a packet, and each result is checked against its evidence.

The 🦁 Lead is the agent the owner talks to. It designs, plans, cuts the work, and accepts results. The owner decides tradeoffs, merges, and can override any pick. Other agents take jobs from the Lead or from a Sidekick, and return evidence, findings, or changes; they never write the design or the plan.

## Classify

| Criterion | Answers |
|---|---|
| **Direction**: how much the brief decides | Exact: every step is given · Complete: the approach is named · Partial: only the outcome is given |
| **Span**: what the agent must hold | Local: one owner and the contracts it uses · Cross-domain: several owners in one system · Cross-system: a contract another system consumes |
| **Horizon**: how long the agent drives before its next check | Step: one command, then report · Planned: the plan already made its choices · Open: it makes choices later work builds on |

Before picking, cut the plan toward Complete, Local, and Planned where you can: name the approach, write shared contracts in, split at a system boundary, and write open choices into the plan. Size does not set span; missing intent or a missing plan is missing input, not Partial.

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

A Daily-driver row needs one recorded reason: the owner recommends it, the Lead says what the Workhorse lacks, or the Workhorse failed after corrections. Rows marked `User must authorize` are used only when the owner names them.

### 🔧 Operator

| Tier | Model | Effort | Direction | Span | Horizon |
|---|---|---|---|---|---|
| Workhorse | OpenAI Luna | medium | Exact | any | Step |

### 🛠️ Worker and 🐒 Sidekick

| Tier | Model | Effort | Direction | Span | Horizon | Use |
|---|---|---|---|---|---|---|
| Workhorse | OpenAI Luna | xhigh | Complete | Local, Cross-domain | Planned | |
| Daily driver | OpenAI Sol | high | Complete | Cross-system | Planned | |
| Daily driver | Claude Opus | high | Partial | any | any | |
| Daily driver | Claude Opus | high | any | any | Open | |
| Daily driver | OpenAI Sol | medium | any | any | any | User must authorize |

### 🔎 Review Sidekick

Pick a different lineage (OpenAI, Claude, xAI) from the author's.

| Tier | Model | Effort | Use |
|---|---|---|---|
| Daily driver | xAI Grok | high | usual pick, a third lineage |
| Frontier | OpenAI Astra | high | |
| Daily driver | Claude Opus | medium | |
| Daily driver | Claude Opus | high | |
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

### 🦉 Advisor

| Tier | Model | Effort | Use |
|---|---|---|---|
| Frontier | OpenAI Astra | high | User must authorize |
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Daily driver | Claude Opus | high | User must authorize |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

## Work with an agent

Classify the job, pick its role and model from the catalogs above, then launch, hand off, wait, and check the result's evidence (files, exit codes, diff scope) against its claim. The Lead gives the overall verdict.

### Launch

Operators and Workers run as native subagents. Sidekicks, Review Sidekicks, and Advisors run in their own sessions; reuse a session by its address, and keep the model and effort it was created with.

Exact id: the host's row in `~/.config/agent-context/model-map.md`; otherwise the host's current-generation id for the Models row, never an older generation or a `-fast` variant; otherwise report the gap.

- IF the role runs in its own session, load `agent-collaboration` and return the session address.
- IF Codex spawns it, load `references/native-providers-codex.md` and return the spawn encoding.
- IF Claude spawns it, load `references/native-providers-claude.md` and return the spawn encoding.
- IF Cursor spawns it, load `references/native-providers-cursor.md` and return the spawn encoding.
- IF the host has no native model for the row, run it through agent-router instead.
- IF agent-router cannot meet the model, effort, access, or title, load `references/acpx-legacy.md` and return the route. An access denial needs the grant, not a route switch.
- IF building or wrapping an ACP adapter, load `references/building-acp-adapters.md` and return its checklist.

### Hand off

MUST load `references/agent-job-packet.md` and return the packet, plus the session row when the role runs in its own session.

A Review Sidekick gets no author history: no fork, no resume. Its packet carries the sources. When an agent drifts, send it a correction; don't restart it.

## Examples

| Job | Classify | Plan cut | Role | Models row |
|---|---|---|---|---|
| Run the suite and watch CI until it finishes | Exact · Local · Step | none | 🔧 Operator | Workhorse |
| Add a config field and its tests; the plan says where and how | Complete · Local · Planned | none | 🛠️ Worker | Workhorse |
| A PR of four planned slices across two domains | Complete · Cross-domain · Planned | write the shared contract into the plan | 🐒 Sidekick, for related jobs | Workhorse |
| Find why sync drops messages and choose the retry policy later slices use | Partial · Local · Open | name the diagnostic approach and write the retry policy in; it becomes Complete · Planned | 🛠️ Worker | Workhorse; if it can't be cut, Daily driver, Partial row, with a reason |
| Move a client and a server to a new wire format, with no seam to split at | Complete · Cross-system · Planned | none possible | 🐒 Sidekick | Daily driver, Cross-system row, with a reason |
| Audit twelve services for the same pattern | each unit: Complete · Local · Planned | one unit per service | twelve 🛠️ Workers | Workhorse |
| Review this PR | not classified | none | 🔎 Review Sidekick | a different lineage from the author |
