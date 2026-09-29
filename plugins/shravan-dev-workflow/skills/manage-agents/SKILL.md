---
name: manage-agents
description: "Always use when delegating to subagents, agent teams, or parallel agents: choosing which agent and model take a job, or spawning, assigning, steering, resuming, waiting for, or verifying a Worker, Operator, Sidekick, Review Sidekick, or Advisor, including a fan-out across many units."
---

# Manage Agents

Collaborate with other agents through a fixed structure: each job is classified, each agent has a role and a model, each handoff is a packet, and each result is checked against its evidence.

The 🦁 Lead is the agent the owner talks to. It designs, plans, cuts the work, and accepts results. The owner decides tradeoffs, merges, and can override any pick. Other agents take jobs from the Lead or from a Sidekick, and return evidence, findings, or changes; they never write the design or the plan.

## Classify

Work nests like a project plan. At every level the agent works in a loop: do one piece, check it against that level's check, then do the next piece or hand back.

| Level | Made of | Checked against |
|---|---|---|
| Project | milestones | the owner's definition of done |
| Milestone, such as one PR | tasks | the plan's proof, then review |
| Task, such as one slice | subtasks | its acceptance check |
| Subtask, one step | edits or commands | its expected result |

An agent can drive only as far as there is a check to verify against. If the Lead cannot name the check for a level, the job is cut smaller.

| Criterion | Answers |
|---|---|
| **Direction**: how much the brief decides | Exact: every step is given · Complete: the approach is named · Partial: only the outcome is given |
| **Span**: what the agent must hold | Local: one owner and the contracts it uses · Cross-domain: several owners in one system · Cross-system: a contract another system consumes |
| **Horizon**: the highest level of the work the agent closes before handing back | Subtask · Task · Milestone |

Before picking, cut the plan toward Complete and Local where you can: name the approach, write shared contracts and open choices into the plan, split at a system boundary, and name the check that ends each job. Size does not set span; missing intent or a missing plan is missing input, not Partial.

## Roles

| Role | Owns | Lives for | Runs as |
|---|---|---|---|
| 🔧 Operator | a procedure someone else wrote (commands, a watch, a mechanical transform) and what it observed | one procedure | native subagent |
| 🛠️ Worker | one bounded result, with its proof | one job, until accepted | native subagent |
| 🐒 Sidekick | continuing work that needs earlier context | related jobs | its own session, reused by address |
| 🔎 Review Sidekick | independent findings | one review, through its corrections | its own session, no author history |
| 🦉 Advisor | guidance, only when the owner asks | the owner's question | its own session |

Horizon limits the role; it does not pick it. The 🦁 Lead closes the Project, a 🐒 Sidekick at most a Milestone, a 🛠️ Worker at most a Task, and a 🔧 Operator at most a Subtask, and only an Exact one. Among the roles a job's horizon allows, a job that needs context from related jobs goes to a Sidekick, a job that stands alone goes to a Worker, and a written procedure goes to an Operator.

An Operator makes no judgment calls: it never decides what to run, what a result means, or how to fix it. It runs the suite and reports failures, watches CI until it finishes, pushes and publishes a verified file, applies a codemod, or collects logs; it does not fix a failing test or decide whether a failure matters. Judgment it meets goes back to whoever assigned it. Tests and proof for an agent's own change stay with that agent; an Operator takes only a procedure assigned on its own, such as a suite run or a CI watch. Only the Lead and a Sidekick assign other agents.

Delegate only independent work that costs less to hand off than to do. Work that splits into independent units (an audit, a migration, a review across files) fans out: one Worker per unit, one table at the end.

Title every non-Lead thread `<emoji> <role> · <purpose>`.

## Models

| Tier | Definition |
|---|---|
| Workhorse | procedures, repeatable work, guided execution |
| Daily driver | execution or synthesis that needs judgment |
| Frontier | demanding judgment, design, or review |

A Daily-driver row needs one recorded reason: the owner recommends it, the Lead says what the Workhorse lacks, or the Workhorse failed after corrections. Rows marked `User must authorize` are used only when the owner names them. Effort is the most a row allows; use less when the job needs less.

### 🔧 Operator

| Tier | Model | Max effort | Direction | Span |
|---|---|---|---|---|
| Workhorse | OpenAI Luna | medium | Exact | Local, Cross-domain, Cross-system |

### 🛠️ Worker and 🐒 Sidekick

| Tier | Model | Max effort | Direction | Span |
|---|---|---|---|---|
| Workhorse | OpenAI Luna | xhigh | Complete | Local, Cross-domain |
| Daily driver | OpenAI Sol | high | Complete | Cross-domain |
| Daily driver | Claude Opus | xhigh | Partial | Local, Cross-domain, Cross-system |
| Daily driver | Claude Opus | xhigh | Complete | Cross-system |

### 🔎 Review Sidekick

Pick a different lineage (OpenAI, Claude, xAI) from the author's.

| Tier | Model | Max effort | Use |
|---|---|---|---|
| Daily driver | xAI Grok | high | usual pick |
| Frontier | OpenAI Astra | high | usual pick; required when the review touches auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugins, agents, or external services |
| Daily driver | Claude Opus | high | |
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

### 🦉 Advisor

| Tier | Model | Max effort | Use |
|---|---|---|---|
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

## Work with an agent

Classify the job, pick its role and model from the catalogs above, then launch, hand off, wait, and check the result's evidence (files, exit codes, diff scope) against its claim. The Lead gives the overall verdict.

MUST load `references/delegation-examples.md` and return the six steps (direction, span, horizon, plan cut, role, Models row) written for this job.

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
