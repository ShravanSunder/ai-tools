# Model catalog

Rows name lineage and thinking, not ids; exact ids resolve per the Runtime rule in `SKILL.md` and the machine map `~/.config/agent-context/model-map.md`.

Select one row for the chosen role. Return the model lineage, thinking level, and model category, plus the Workhorse fit result when the unit could run on the Workhorse tier. Honor an explicit owner choice first; then match the task's Guidance and Architectural span to the row's signals. More complete guidance does not disqualify a capable model. Reassess from evidence when a choice struggles; do not automatically raise effort or claim universal benchmarks. Prefer total completion cost, including rework, proof, and coordination.

## Categories

| Model category | Definition |
|----------------|------------|
| Workhorse | Procedures, repeatable work, guided execution. |
| Daily driver | Execution or synthesis that needs judgment. |
| Frontier | Demanding judgment, design, or review. |

A model category is a cost and capability grouping of model plus effort. It does not assign role authority or promote effort. Do not pick a row marked `User must authorize` in this table or a role table unless Shravan explicitly authorizes that lineage and thinking; an empty Use cell means the role table decides. 🦉 Advisor rows are outside this mark: Shravan names every Advisor row, and the request is the authorization.

| Model category | Model lineage | Thinking | Use |
|----------------|---------------|----------|-----|
| Workhorse | OpenAI Luna | medium | |
| Workhorse | OpenAI Luna | high | |
| Workhorse | OpenAI Luna | xhigh | |
| Workhorse | OpenAI Luna | max | |
| Daily driver | OpenAI Sol | medium | |
| Daily driver | OpenAI Sol | high | |
| Daily driver | OpenAI Sol | xhigh | |
| Daily driver | Claude Opus | low | |
| Daily driver | Claude Opus | medium | |
| Daily driver | xAI Grok | medium | |
| Daily driver | xAI Grok | high | |
| Daily driver | Claude Opus | high | |
| Frontier | OpenAI Astra | high | |
| Frontier | Claude Opus | xhigh | User must authorize |
| Frontier | OpenAI Astra | xhigh | User must authorize |
| Frontier | Claude Fable | high | User must authorize |

## Workhorse fit

**Workhorse fit.** A unit of work fits the Workhorse tier when its Guidance is Exact steps, or Complete direction with the approach already fixed, its Architectural span is Local, and it has:

1. **Pinned inputs**: the files, paths, head, corpus slice, or brief are given, not discovered.
2. **A checkable output**: a file, a test or check result with its exit code, or a diff within declared paths.
3. **A named stop**: the packet says what to do at its boundary, which is to stop and return, not to widen.
4. **Its seams exist**: every seam, signal, event, or API the unit relies on already exists at its base and supports the observation the unit needs, checked in source by the planner, not assumed from the brief or from a matching name. A unit that needs a new seam gets a contract slice first, or goes to the Daily-driver tier.

A unit that misses any of these is split until its parts fit, or it goes to the Daily-driver tier with the missing condition as the reason. A packet that fixes the outcome but leaves the approach open is Partial direction and does not fit. Cost is why this is the default: at the dated snapshot below, Luna costs about an order of magnitude less per task than Sol or Opus low, and its highest effort still costs cents. A boundary stop from a Workhorse unit is evidence about the cut, so the assigner re-slices or re-tags it with a reason. When many units would apply the same mechanical edit, write the script or codemod and give it to one 🔧 Operator instead of many Workers.

The Workhorse tier is the default for work that passes this test. Escalate on evidence (a boundary stop, a failed check, a named cross-domain need) and record the reason. A Workhorse assignment uses the Workhorse packet in `agent-job-packet.md`.

### Dated cost snapshot

Source: Artificial Analysis, Intelligence versus cost per task, data dated 2026-09-22, read by eye from the published chart and not independently verified. At matched catalog rows, Luna ran roughly 9 to 14 times cheaper per task than Sol or Opus low, about an order of magnitude, and Luna at its highest effort still cost cents per task. This is a cost ratio from one dated snapshot, not a benchmark claim; refresh it when the snapshot ages or prices move.

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

## 🛠️ Worker

Use for execution and research 🛠️ Workers. Independent review uses the 🔎 Review Sidekick table. A Luna Worker defaults to xhigh; effort costs cents on Luna.

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | high | Exact steps or well-understood Complete direction; Local. |
| OpenAI Luna | xhigh | Exact steps or well-understood Complete direction; Local. |
| OpenAI Sol | medium | Complete direction; Local/Cross-domain. |
| Claude Opus | low | Complete direction; Local/Cross-domain. |
| Claude Opus | medium | Partial direction; Cross-domain/Cross-system. |

## Implementation and research 🐒 Sidekick

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | high | Exact steps or well-understood Complete direction; Local. |
| OpenAI Luna | xhigh | Exact steps or well-understood Complete direction; Local. |
| OpenAI Luna | max | Exact steps or well-understood Complete direction; Local. |
| OpenAI Sol | medium | Complete direction; Local/Cross-domain. |
| OpenAI Sol | high | Partial direction; Cross-domain/Cross-system. |
| Claude Opus | low | Complete direction; Local/Cross-domain. |
| Claude Opus | medium | Partial direction; Cross-domain/Cross-system. |

## 🔎 Review Sidekick

| Model lineage | Thinking | Use |
|---------------|----------|-----|
| OpenAI Sol | high | |
| OpenAI Sol | xhigh | |
| OpenAI Astra | high | |
| OpenAI Astra | xhigh | User must authorize |
| Claude Opus | medium | |
| Claude Opus | high | |
| Claude Opus | xhigh | User must authorize |
| Claude Fable | high | User must authorize |
| xAI Grok | high | |

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
