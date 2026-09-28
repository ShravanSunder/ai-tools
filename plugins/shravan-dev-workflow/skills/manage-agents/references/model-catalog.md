# Model catalog

Rows name lineage and thinking, not ids; exact ids resolve per the Runtime rule in `SKILL.md` and the machine map `~/.config/agent-context/model-map.md`.

Select one row for the chosen role. Return the model lineage, thinking level, and model category, plus the Workhorse fit result when the unit could run on the Workhorse tier. Honor an explicit owner choice first; then match the task's signals to the row. More complete guidance does not disqualify a capable model. Reassess from evidence when a choice struggles; do not automatically raise effort or claim universal benchmarks. Prefer total completion cost, including rework, proof, and coordination.

## Task signals

Three signals choose a row: direction (Guidance), complexity (Architectural span), and horizon. `SKILL.md` defines each. Horizon follows the role: a 🛠️ Worker's or 🔧 Operator's horizon is its job, a 🐒 Sidekick's is one PR, and the Lead's (Main's) is the stack of PRs it sequences.

Work stays on Luna unless a signal forces it off:

- Partial direction goes to Opus.
- Cross-system span goes to Sol medium when the approach is fixed, and to Opus when it is open.
- A Sidekick whose later slices rest on a local choice the plan leaves open goes to Opus.

Opus high is an escalation on evidence within Opus's band, not a default. When Opus implements, the reviewer comes from another lineage (Grok or Astra).

## Categories

| Model category | Definition |
|----------------|------------|
| Workhorse | Procedures, repeatable work, guided execution. |
| Daily driver | Everyday judgment. The Lead usually runs one at the owner's pick. |
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

## Workhorse fit

**Workhorse fit.** A 🛠️ Worker or 🐒 Sidekick unit fits the Workhorse tier when a Luna row in its role table matches its Guidance and Architectural span (Complete direction here means the approach is already fixed); a 🔧 Operator procedure fits when it is prescribed (Exact steps, no judgment; the Operator table's Luna rows apply at any span). Either way it has:

1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
4. **Its seams exist**: every seam, signal, event, or API the unit relies on already exists at its base and supports the observation the unit needs, checked in source by the planner, not assumed from the brief or from a matching name. A unit that needs a new seam gets a contract slice first, or goes to the Daily-driver tier.

A unit that misses any of these is split until its parts fit, or it goes to the Daily-driver tier with the missing condition as the reason. A packet that fixes the outcome but leaves the approach open is Partial direction and does not fit. Cost is why this is the default: at the dated snapshot below, Luna costs about an order of magnitude less per task than Sol or Opus low, and its highest effort still costs cents. A boundary stop from a Workhorse unit is evidence about the cut, so the assigner re-slices or re-tags it with a reason. When many units would apply the same mechanical edit, write the script or codemod and give it to one 🔧 Operator instead of many Workers.

The Workhorse tier is the default for work that passes this test. Escalate on evidence (a boundary stop, a failed check, a missing fit condition, or a span or direction outside every Luna row) and record the reason. A Workhorse assignment uses the Workhorse packet in `agent-job-packet.md`.

### Dated cost snapshot

Source: Artificial Analysis, Intelligence versus cost per task, data dated 2026-09-22, read by eye from the published chart and not independently verified. At matched catalog rows, Luna ran roughly 9 to 14 times cheaper per task than Sol or Opus low, about an order of magnitude, and Luna at its highest effort still cost cents per task. This is a cost ratio from one dated snapshot, not a benchmark claim; refresh it when the snapshot ages or prices move.

## Jobs inside a PR

The Lead uses this table while planning a PR's slices. Thinking level follows the job's direction and span; horizon follows its role.

| Job | Role | Row |
|-----|------|-----|
| Implementation slice, exact recipe in one domain | 🛠️ Worker | Luna medium |
| Implementation slice, fixed approach with local choices | 🛠️ Worker | Luna high |
| Implementation slice, fixed approach across domains | 🛠️ Worker | Luna xhigh |
| Coupled slices | the PR's 🐒 Sidekick | stays with the Sidekick under the staffing table in `SKILL.md` |
| Evidence: sweep one unit | 🛠️ Worker | Luna medium |
| Evidence: classify with a fixed rubric | 🛠️ Worker | Luna high |
| Monitoring and procedures: suites, CI watches to terminal, PR wrap-up checks, scripted transforms | 🔧 Operator | Luna medium |
| Diagnosis with a prescribed diagnostic approach | 🛠️ Worker | Luna high or xhigh, by span |
| Open diagnosis (Partial direction) | 🛠️ Worker | Opus medium, any span |
| Independent review | 🔎 Review Sidekick | a different-lineage reviewer, usually Grok high; never Luna |

Luna max shares xhigh's band and is kept for a Luna Sidekick carrying a long PR.

## Lineage families

| Family | Models or harness |
|--------|-------------------|
| OpenAI | Astra, Sol, and Luna. |
| Claude | Fable and Opus. |
| xAI | Grok. |
| Cursor | A harness and multi-model catalog, not a lineage. |

## 🔧 Operator

| Model lineage | Thinking |
|---------------|----------|
| OpenAI Luna | medium |
| OpenAI Luna | high |

A procedure takes these rows when it passes Workhorse fit's Operator branch: it is prescribed, Exact steps with no judgment, at any span, and it meets the four conditions. A procedure that needs judgment is not Operator work.

## 🛠️ Worker

Use for execution and research 🛠️ Workers. Independent review uses the 🔎 Review Sidekick table.

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | medium | Exact steps; Local. |
| OpenAI Luna | high | Complete direction; Local. |
| OpenAI Luna | xhigh | Complete direction; Local/Cross-domain. |
| OpenAI Sol | medium | Complete direction; Cross-system. |
| Claude Opus | medium | Partial direction; any span. |

## Implementation and research 🐒 Sidekick

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | high | Complete direction; Local. |
| OpenAI Luna | xhigh | Complete direction; Local/Cross-domain. |
| OpenAI Luna | max | Complete direction; Local/Cross-domain. |
| OpenAI Sol | medium | Complete direction; Cross-system; every dependent choice in the plan. |
| Claude Opus | medium | Partial direction, any span; or Complete direction, any span, when a later slice depends on a local choice the plan leaves to the Sidekick. |
| Claude Opus | high | Partial direction, any span; or Complete direction, any span, when a later slice depends on a local choice the plan leaves to the Sidekick. |

A Sidekick's horizon is one PR. A Luna Sidekick carries context across its PR but makes no choice that later slices depend on: every such choice is already in the plan, and needing a new one is a plan defect for the Lead. An Opus Sidekick may make local choices later slices build on and records each. Long-horizon Sidekick work is not in use, so Luna max shares Luna xhigh's band and Opus high shares Opus medium's.

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

Grok high is the usual pick because it is a third lineage. It still follows the different-lineage rule in `SKILL.md`, so it never reviews Grok-authored work.

## 🦉 Advisor

| Model lineage | Thinking |
|---------------|----------|
| OpenAI Astra | high |
| OpenAI Astra | xhigh |
| Claude Opus | high |
| Claude Opus | xhigh |
| Claude Fable | high |

Shravan chooses every 🦉 Advisor's model and effort from this table; an Advisor request is that authorization. Do not pick one yourself, escalate, or add another Advisor automatically.

Complete when one row is selected for the role, it is not an unauthorized `User must authorize` row, a Workhorse row is chosen only for a unit that passes Workhorse fit, and the lineage rule for review in `SKILL.md` still holds.
