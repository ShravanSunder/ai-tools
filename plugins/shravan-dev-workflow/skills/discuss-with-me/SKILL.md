---
name: discuss-with-me
description: Use when the user explicitly asks to discuss, talk through, reflect back, or align on design, spec, plan, implementation direction, or docs decisions without immediately editing files.
---

# Discuss With Me

Use this skill as a manual shared-understanding layer across the software artifact lifecycle:

```text
design -> spec -> plan -> implementation -> docs
```

This skill does not write code, specs, plans, or docs by itself. Its output is a clearer model, a decision, a narrowed question, or the next workflow to invoke.

## Core Rules

- Manual trigger only. Do not invoke just because a request is vague.
- Stay read-only unless the user explicitly switches to artifact creation or implementation.
- Classify the lifecycle stage before asking questions.
- Prefer code/docs/session evidence over asking when the answer is discoverable.
- Ask one material question at a time, and include the current recommended answer.
- Keep uncertainty visible with a short confidence note when the model is still forming.
- Do not accept "whatever you think" as convergence when a material branch remains.
- Use `tui-presentation` only when comparing options, showing a decision tree, or presenting multi-section synthesis.
- Hand off to the specific workflow skill when discussion becomes execution, review, security, debugging, or docs maintenance.

## Scope

Use for:

- `design`: intent, audience, user value, options, tradeoffs, non-goals
- `spec`: contracts, boundaries, source of truth, edge cases, success criteria
- `plan`: sequencing, ownership, validation, rollback, risk
- `implementation`: reconverging when code reality breaks the plan, spec, or model
- `docs`: deciding what should be durable, where it belongs, and what is stale

Do not use as the primary workflow for:

- debugging or root-cause work: use `debug-investigation`
- security scans or threat models: use `security-router`
- code/diff review: use `implementation-review-swarm`
- adversarial plan/spec review: use `plan-review` or `spec-review-council`
- broad design research with subagents: use `spec-design-swarm`
- docs editing: use `docs-maintain`
- skill audits: use `skill-audit`
- commit, push, PR, or merge work: use the execution/publishing workflow requested by the user

## Workflow

1. Classify the stage:
   - design
   - spec
   - plan
   - implementation
   - docs
2. Build the starting model:
   - current read
   - confidence
   - what evidence was checked
   - what is still missing
3. Load the stage reference only if stage-specific guidance is needed.
4. Ask one material question if the next decision cannot be inferred from evidence.
5. Stop when the decision, assumption, non-goal, or next workflow is explicit.

## Progressive Disclosure

- Load `references/stages.md` for stage-specific focus, preferred questions, and stop conditions.
- Load `references/question-patterns.md` before asking when the question is broad, high-stakes, or politically/technically loaded.
- Load `references/workflow-handoff-map.md` when deciding which skill should own the next step.
- Load `references/trigger-evals.md` when testing or updating this skill's trigger behavior.
- Load `../../references/source-inspirations.md` only when updating this skill or explaining source practices.

## Output Shape

For a live discussion:

```text
Stage:
<design / spec / plan / implementation / docs>

Current model:
<one sentence>

Confidence:
<high / medium / low, and what is missing>

My recommended default:
<answer and why>

Question:
<one focused question>
```

For a closeout:

```text
Confirmed:
<decision or shared understanding>

Assumptions:
<load-bearing assumptions>

Non-goals:
<what we are not doing>

Open:
<remaining material uncertainty, if any>

Next workflow:
<skill or action, if any>
```
