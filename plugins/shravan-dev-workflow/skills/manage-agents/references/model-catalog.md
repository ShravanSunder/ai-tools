# Model catalog

Rows name lineage and thinking, not ids; exact ids resolve per the Runtime rule in `SKILL.md` and the machine map `~/.config/agent-context/model-map.md`.

Select one row for the job. Return the model lineage, thinking level, and model category, plus the Workhorse fit result when the job could run on the Workhorse tier. Honor an explicit owner choice first. More complete guidance does not disqualify a capable model. Reassess from evidence when a choice struggles; do not automatically raise effort or claim universal benchmarks. Prefer total completion cost, including rework, proof, and coordination.

## Categories

| Model category | Definition |
|----------------|------------|
| Workhorse | Procedures, repeatable work, guided execution. |
| Daily driver | Everyday judgment. |
| Frontier | Demanding judgment, design, or review. |

A model category is a cost and capability grouping of model plus effort. It does not assign role authority or promote effort. Do not pick a row marked `User must authorize` in this table or the 🔎 Review Sidekick table unless Shravan explicitly authorizes that lineage and thinking; an empty Use cell means the effort bands or the Review Sidekick table decide. 🦉 Advisor rows are outside this mark: Shravan names every Advisor row, and the request is the authorization.

| Model category | Model lineage | Thinking | Use |
|----------------|---------------|----------|-----|
| Workhorse | OpenAI Luna | medium | |
| Workhorse | OpenAI Luna | high | |
| Workhorse | OpenAI Luna | xhigh | |
| Workhorse | OpenAI Luna | max | |
| Daily driver | Claude Opus | medium | |
| Daily driver | Claude Opus | high | |
| Daily driver | OpenAI Sol | medium | |
| Daily driver | OpenAI Sol | high | |
| Daily driver | xAI Grok | medium | |
| Daily driver | xAI Grok | high | |
| Frontier | OpenAI Astra | high | |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

## Effort bands

Every job starts on the Workhorse tier. The role sets the effort band; the job's demanding signals pick the effort inside it.

| Role | Effort band | Effort |
|---|---|---|
| 🔧 Operator | medium | always medium |
| 🛠️ Worker | high to xhigh | high; xhigh when any signal is demanding |
| 🐒 Sidekick | high to max | high; xhigh with one demanding signal; max with two or more |

Demanding signals: Partial direction; Cross-domain or Cross-system span; Run or Open horizon (definitions in `SKILL.md` Select an agent).

**Escalation.** Partial direction, Cross-system span, and Open horizon are flags, not routes. For a flagged job, Main first fixes the cut: write the open choice into the plan, split at the system boundary, or fix the diagnostic approach. A Daily-driver model takes a job only with one recorded escalation reason: `owner recommended`; `judged tough: <missing condition>`, when Main judges it too tough for the Workhorse tier at its band's top; or `Workhorse failed: <evidence>`, after a failed check or result through corrections (a boundary stop is a plan defect instead). Record it in the slice's tier record or the assignment.

Sidekick examples (use them to classify any assignment):

| Assignment | Signals | Effort |
|---|---|---|
| "Implement slice 3 of this PR (add the config field and its tests), then report back." | Complete · Local · Task | high |
| "Fix this bug in one module; the cause is known and the fix approach is in the brief." | Complete · Local · Task | high |
| "Implement this PR: four slices in one module, every choice written in the plan." | Complete · Local · Run | xhigh |
| "Take slice 2, which changes the orders and billing domains' shared contract as the plan specifies, then report back." | Complete · Cross-domain · Task | xhigh |
| "Implement this PR: three planned slices, one domain publishes a new event and another consumes it; the event contract and both sides' approach are in the plan." | Complete · Cross-domain · Run | max |
| "Find why sync drops messages under load, fix it, and choose the retry policy the next two slices build on." | Partial · Local · Open | max; flagged: fix the diagnostic approach or the retry choice in the plan first, or escalate with a reason |
| "Move the client and the server to the new wire format: the plan names the format and the migration approach in four ordered slices." | Complete · Cross-system · Run | max; flagged: split into PRs only where the PR independence test passes (an independently landable seam exists); otherwise keep one PR at max, or escalate with a reason |

Worker and Operator examples:

| Job | Role · signals | Effort |
|---|---|---|
| Classify these findings with this rubric | 🛠️ · Complete · Local · Task | high |
| Read one service and list each call to X with file:line | 🛠️ · Complete · Local · Task | high |
| Implement one slice whose fixed approach keeps the orders and billing domains' contract in step | 🛠️ · Complete · Cross-domain · Task | xhigh |
| Diagnose a failing test without a known cause | 🛠️ · Partial · Local · Task | xhigh |
| Run a suite, watch CI to terminal, apply a scripted transform, run PR wrap-up checks | 🔧 · Exact · any · Step | medium |
| Independent review | 🔎 Review Sidekick table; never the Workhorse tier | — |

## Workhorse fit

A job fits the Workhorse tier when it has:

1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
4. **Its seams exist**: every seam, signal, event, or API the job relies on already exists at its base and supports the observation the job needs, checked in source by the planner, not assumed from the brief or from a matching name. A job that needs a new seam gets a contract slice first, or escalates.

A job that misses a condition is re-cut until it fits: pin its inputs, name its output and stop, or add a contract slice for a missing seam.

## Lineage families

| Family | Models or harness |
|--------|-------------------|
| OpenAI | Astra, Sol, and Luna. |
| Claude | Fable and Opus. |
| xAI | Grok. |
| Cursor | A harness and multi-model catalog, not a lineage. |

## 🔎 Review Sidekick

| Model lineage | Thinking | Use |
|---------------|----------|-----|
| xAI Grok | high | |
| OpenAI Astra | high | |
| OpenAI Sol | high | |
| Claude Opus | medium | |
| Claude Opus | high | |
| OpenAI Astra | xhigh | User must authorize |
| Claude Opus | xhigh | User must authorize |
| Claude Fable | high | User must authorize |

Grok high is the usual pick because it is a third lineage.

## 🦉 Advisor

| Model lineage | Thinking |
|---------------|----------|
| OpenAI Astra | high |
| OpenAI Astra | xhigh |
| Claude Opus | high |
| Claude Opus | xhigh |
| Claude Fable | high |

Shravan chooses every 🦉 Advisor's model and effort from this table; an Advisor request is that authorization. Do not pick one yourself, escalate, or add another Advisor automatically.

Complete when one row is selected for the job, it is not an unauthorized `User must authorize` row, an escalated job records its reason, and the lineage rule for review in `SKILL.md` still holds.
