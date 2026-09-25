# Model catalog

Rows name lineage and thinking, not ids; exact ids resolve per the Runtime rule in `SKILL.md` and the machine map `~/.config/agent-context/model-map.md`.

Select one row for the chosen role. Return the model lineage, thinking level, and model category. Honor an explicit owner choice first; then match the task's Guidance and Architectural span to the row's signals. More complete guidance does not disqualify a capable model. Reassess from evidence when a choice struggles; do not automatically raise effort or claim universal benchmarks. Prefer total completion cost, including rework, proof, and coordination.

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

Use for execution and research 🛠️ Workers. Independent review uses the 🔎 Review Sidekick table.

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | medium | Exact steps or well-understood Complete direction; Local/Cross-domain. |
| OpenAI Luna | high | Exact steps or well-understood Complete direction; Local/Cross-domain. |
| OpenAI Luna | xhigh | Exact steps or well-understood Complete direction; Local/Cross-domain. |
| OpenAI Sol | medium | Complete direction; Local/Cross-domain. |
| Claude Opus | low | Complete direction; Local/Cross-domain. |
| Claude Opus | medium | Partial direction; Cross-domain/Cross-system. |

## Implementation and research 🐒 Sidekick

| Model lineage | Thinking | Task signals |
|---------------|----------|--------------|
| OpenAI Luna | high | Exact steps or well-understood Complete direction; Local/Cross-domain. |
| OpenAI Luna | xhigh | Exact steps or well-understood Complete direction; Local/Cross-domain. |
| OpenAI Luna | max | Exact steps or well-understood Complete direction; Local/Cross-domain. |
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

Complete when one row is selected for the role, it is not an unauthorized `User must authorize` row, and the lineage rule for review in `SKILL.md` still holds.
