# Model catalog

Rows name lineage and thinking, not ids; exact ids resolve per the Runtime rule in `SKILL.md` and the machine map `~/.config/agent-context/model-map.md`.

Select one row for the job. Return the model lineage, thinking level, and model category, plus the Workhorse fit result when the job could run on Luna. Honor an explicit owner choice first; then match the task's signals to the row. More complete guidance does not disqualify a capable model. Reassess from evidence when a choice struggles; do not automatically raise effort or claim universal benchmarks. Prefer total completion cost, including rework, proof, and coordination.

## Categories

| Model category | Definition |
|----------------|------------|
| Workhorse | Procedures, repeatable work, guided execution. |
| Daily driver | Everyday judgment. |
| Frontier | Demanding judgment, design, or review. |

A model category is a cost and capability grouping of model plus effort. It does not assign role authority or promote effort. Do not pick a row marked `User must authorize` in this table or a role table unless Shravan explicitly authorizes that lineage and thinking; an empty Use cell means the role table decides. 🦉 Advisor rows are outside this mark: Shravan names every Advisor row, and the request is the authorization.

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

## Choose by job

Each Luna row is a ceiling: it fits a job when the job's direction, span, and horizon are each at or below that row's value (Exact steps below Complete; Local below Cross-domain; Step below Task below Run). Take the first row that fits.

| Luna row | Direction up to | Span up to | Horizon up to |
|---|---|---|---|
| Luna medium | Exact steps | Local | Step |
| Luna high | Complete | Local | Task |
| Luna xhigh | Complete | Cross-domain | Run |

A job leaves Luna when any signal is above every row: Partial direction, Cross-system span, or Open horizon. Off Luna, Partial direction or Open horizon selects Opus medium; otherwise (Cross-system span with a fixed approach) Sol medium. A signal that cannot be classified is missing input (`SKILL.md` Select an agent), not a guess.

A prescribed procedure (Exact steps, no judgment) is 🔧 Operator work at any span: Luna medium at Step, Luna high at Task. Luna max and Opus high are escalations on evidence within Luna xhigh's and Opus medium's bands, never a starting row.

The examples below illustrate the rule; the rule decides.

| Job | Signals | Row |
|---|---|---|
| 🔧 Run a suite, watch CI to terminal, apply a scripted transform | Exact · any · Step | Luna medium |
| 🔧 Multi-step prescribed procedure, such as PR wrap-up checks | Exact · any · Task | Luna high |
| Sweep one evidence unit | Exact · Local · Step | Luna medium |
| Classify with a fixed rubric | Complete · Local · Task | Luna high |
| Implementation slice or prescribed diagnosis, fixed approach | Complete · Local or Cross-domain · Task | Luna high or xhigh |
| 🐒 Sidekick driving a PR whose choices are all in the plan | Complete · Local or Cross-domain · Run | Luna xhigh |
| 🐒 Sidekick making choices later slices build on | any · any · Open | Opus medium |
| Open diagnosis | Partial · any · Task | Opus medium |
| Fixed-approach Cross-system work | Complete · Cross-system · Task or Run | Sol medium |
| Independent review | not an execution job | 🔎 Review Sidekick table; never Luna |

## Workhorse fit

**Workhorse fit.** A job fits the Workhorse tier when the job table keeps it on Luna and it has:

1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
4. **Its seams exist**: every seam, signal, event, or API the job relies on already exists at its base and supports the observation the job needs, checked in source by the planner, not assumed from the brief or from a matching name. A job that needs a new seam gets a contract slice first, or goes to the Daily-driver tier.

A job that misses any of these is split until its parts fit, or it goes to the Daily-driver tier with the missing condition as the reason. The Workhorse tier is the default for every job that fits; escalate on evidence (a failed check, a missing condition, or a signal off Luna) and record the reason.

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

Complete when one row is selected for the job, it is not an unauthorized `User must authorize` row, a Luna row is chosen only for a job that passes Workhorse fit, and the lineage rule for review in `SKILL.md` still holds.
