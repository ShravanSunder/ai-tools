---
name: manage-agents
description: "Always use when delegating to subagents, agent teams, or parallel agents: choosing which agent and model take a job, or spawning, assigning, steering, resuming, waiting for, or verifying a Worker, Operator, Sidekick, Review Sidekick, or Advisor, including a fan-out across many units."
---

# Manage Agents

Collaborate with other agents through a fixed structure: each job is classified, each agent has a role and a model, each handoff is a packet, and each result is checked against its evidence.

The 🦁 Lead is the agent the owner talks to. It designs, plans, cuts the work, and accepts results. The owner decides tradeoffs, merges, and can override any pick. Other agents (the roles under Model Catalog & Roles) take jobs from the Lead, a Sidekick, or an Advisor, and return evidence, findings, or changes; they never write the design or the plan.

## Classify

### Work levels

Work nests like a project plan. At every level the agent works in a loop: do one piece, check it against that level's check, then do the next piece or hand back. An agent can drive only as far as there is a check to verify against; if the Lead cannot name the check for a level, the job is cut smaller.

| Level | Made of | Checked against |
|---|---|---|
| Project | milestones | the owner's definition of done |
| Milestone, such as one PR | tasks | the plan's proof, then review |
| Task, such as one slice | subtasks | its acceptance check |
| Subtask, one step or one written procedure with no judgment between its steps | edits or commands | its expected result |

### Horizon

The highest work level the agent closes before handing back. Name the check that ends each job.

| Answer | The agent closes | Before handing back at |
|---|---|---|
| Subtask | one step, or one written procedure | its expected result |
| Task | one result made of subtasks | its acceptance check |
| Milestone | one deliverable made of tasks | the plan's proof |

### Direction

How much of the job the brief decides.

| Answer | The brief | Test | Then |
|---|---|---|---|
| Exact | is a procedure; nothing is left to judge | could a script run it? | only an Exact job can go to a 🔧 Operator |
| Complete | names the approach; the agent decides only details nothing else depends on | can you name the approach in one sentence? | ready to hand off |
| Partial | gives only the outcome, so the agent would choose the approach | does the job hide a design choice? | the Lead writes any design choice into the plan, since a design choice never goes to another agent; what stays Partial after that, an approach inside choices nothing else builds on, takes the Partial row of the Worker and Sidekick catalog when it crosses domains or systems |

Missing intent or a missing plan is missing input, not Partial.

### Span

What the agent must hold in its head to get the job right. Size and module count don't change it.

| Answer | The agent must hold | Test | Then |
|---|---|---|---|
| Local | one owner's code and the contracts it uses | is reading that owner and its contracts enough? | ready to hand off |
| Cross-domain | two or more owners in one system whose shared contract must stay in step | would the change break another owner's code in this system? | write the shared contract into the plan |
| Cross-system | a contract another system consumes: an API, a wire format, stored data another system reads | does another system read what changes? | split at the system boundary if you can; once the contract is written into the plan, each side built against it is Local |

### How they fit

Horizon caps the role, direction decides whether an Operator can take the job, and direction and span pick the catalog row.

## Model Catalog & Roles

### Roles

| Role | Owns | Lives for | Runs as |
|---|---|---|---|
| 🔧 Operator | a procedure someone else wrote (commands, a watch, a mechanical transform) and what it observed | one procedure | native subagent |
| 🛠️ Worker | one bounded result, with its proof | one job, until accepted | native subagent |
| 🐒 Sidekick | continuing work that needs earlier context | related jobs | its own session, reused by address |
| 🔎 Review Sidekick | independent findings | one review, through its corrections | its own session, no author history |
| 🦉 Advisor | guidance, only when the owner asks | the owner's question | its own session |

Horizon limits the role; it does not pick it.

| Role | Horizons it can take |
|---|---|
| 🦁 Lead | Project |
| 🐒 Sidekick | Milestone, Task, Subtask |
| 🛠️ Worker | Task, Subtask |
| 🔧 Operator | Subtask, only an Exact one |

Among the roles a job's horizon allows, an Exact Subtask goes to an Operator, a job that needs context from related jobs goes to a Sidekick, and any other job that stands alone goes to a Worker.

An Operator makes no judgment calls: it never decides what to run, what a result means, or how to fix it. It runs the suite and reports failures, watches CI until it finishes, pushes and publishes a verified file, applies a codemod, or collects logs; it does not fix a failing test or decide whether a failure matters. Judgment it meets goes back to whoever assigned it. Tests and proof for an agent's own change stay with that agent; an Operator takes only a procedure assigned on its own, such as a suite run or a CI watch. The 🦁 Lead assigns every role. A 🐒 Sidekick or a 🦉 Advisor may also start 🛠️ Workers and 🔧 Operators for its own work.

Delegate only independent work that costs less to hand off than to do. Work that splits into independent units (an audit, a migration, a review across files) fans out: one Worker per unit, one table at the end.

Title every non-Lead thread `<emoji> <role> · <purpose>`.

### Tiers

| Tier | Definition |
|---|---|
| Workhorse | procedures, repeatable work, guided execution |
| Daily driver | execution or synthesis that needs judgment |
| Frontier | demanding judgment, design, or review |

A Daily-driver row needs one recorded reason: the owner recommends it, the Lead says what the Workhorse lacks, or the Workhorse failed after corrections. Rows marked `User must authorize` are used only when the owner names them. Thinking Effort lists the allowed value or inclusive range for each row. A job that matches no row is not ready: cut it until it matches one, or bring it to the owner, who can name a model.

### 🔧 Operator

| Tier | Model | Thinking Effort | Direction | Span |
|---|---|---|---|---|
| Workhorse | OpenAI Luna | medium | Exact | Local, Cross-domain, Cross-system |

### 🛠️ Worker and 🐒 Sidekick

| Tier | Model | Thinking Effort | Direction | Span |
|---|---|---|---|---|
| Workhorse | OpenAI Luna | xhigh | Exact, Complete | Local, Cross-domain |
| Daily driver | OpenAI Sol | high | Complete | Cross-domain |
| Daily driver | Claude Opus | medium to xhigh | Partial | Cross-domain, Cross-system |

### 🔎 Review Sidekick

Implementation review comes after the 🦁 Lead has verified the work against the plan and its proof, asking the 🦉 Advisor to check it too when one exists. Review Sidekicks then review each Project and Milestone, never a single Task or Subtask. Design and proposal reviews happen where their owning phase says and use the same reviewers. Every reviewer is from a different lineage (OpenAI, Claude, xAI) than the author and gets no author history; when the author is xAI, the owner picks the every-review reviewer and one security reviewer.

| Reviewer | Tier | Model | Thinking Effort | When |
|---|---|---|---|---|
| Every review | Daily driver | xAI Grok | high | every Project and Milestone review |
| Security | Frontier | OpenAI Astra | high to xhigh | the review touches auth, secrets, untrusted input, parsing, filesystem, network, subprocess, plugins, agents, or external services, and the author is not OpenAI |
| Security | Frontier | Claude Opus | xhigh | the same surfaces, and the author is not Claude |

Beyond the rows above, another reviewer joins only when the owner asks for one and names its model.

### 🦉 Advisor

| Tier | Model | Thinking Effort | Use |
|---|---|---|---|
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

## Work with an agent

Classify the job (the Examples at the end show how), pick its role and model from the catalogs above, then launch, hand off, wait, and check the result's evidence (files, exit codes, diff scope) against its claim. The Lead gives the overall verdict.

### Launch

Operators and Workers run as native subagents. Sidekicks, Review Sidekicks, and Advisors run in their own sessions; reuse a session by its address, and keep the model and effort it was created with.

Exact id: the host's row in `~/.config/agent-context/model-map.md`; otherwise the host's current-generation id for the catalog row, never an older generation or a `-fast` variant; otherwise report the gap.

- IF the role runs in its own session, load `agent-collaboration` and return the session address.
- IF Codex spawns it, load `references/native-providers-codex.md` and return the spawn encoding.
- IF Claude spawns it, load `references/native-providers-claude.md` and return the spawn encoding.
- IF Cursor spawns it, load `references/native-providers-cursor.md` and return the spawn encoding.
- IF the host has no native model for the row, run it through agent-router instead.
- IF agent-router cannot meet the model, effort, access, or title, load `references/acpx-legacy.md` and return the route. An access denial needs the grant, not a route switch.
- IF building or wrapping an ACP adapter, load `references/building-acp-adapters.md` and return its checklist.

### Hand off

Whoever assigns the job writes its prompt: the 🦁 Lead for every role, or a Sidekick or Advisor for the Workers and Operators it starts. MUST load `references/agent-job-packet.md` and return the packet, opened with the role's opening, plus the session row when the role runs in its own session.

A Review Sidekick gets no author history: no fork, no resume. Its packet carries the sources. When an agent drifts, send it a correction; don't restart it.

## Examples

MUST load `references/delegation-examples.md` and return the six steps (direction, span, horizon, plan cut, role, catalog row) written for this job.
