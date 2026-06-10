---
name: discuss-with-me
description: Use when the user explicitly asks to discuss, talk through, reflect back, grill, steelman, stress-test, clarify thinking, or align on design, spec, plan, implementation direction, or docs decisions without immediately editing files.
---

# Discuss With Me

Use this skill as a manual thinking-clarifier across the software artifact lifecycle:

```text
design -> spec -> plan -> implementation -> docs
```

Its job is to help the model teach back, stress, and clarify the user's thinking before action. It does not write code, specs, plans, or docs by itself. Its output is a sharper shared model, a user-owned decision, a narrowed question, or the next workflow to invoke.

## Core Rules

- Manual trigger only. Do not invoke just because a request is vague.
- Stay read-only unless the user explicitly switches to artifact creation or implementation.
- Classify the lifecycle stage before asking questions.
- Prefer code/docs/session evidence over asking when the answer is discoverable.
- Ask one material question at a time, and include the current recommended answer.
- Keep uncertainty visible with a short confidence note when the model is still forming.
- Use lightweight intent handles: `reflect-back`, `grill-me`, `steelman`, `stress-test`, `assumption-check`, `boundary-check`, `source-of-truth`, and `reconverge`.
- When multiple real branches exist, steelman the strongest competing path before converging.
- Name the boundary, tradeoff, or load-bearing assumption under pressure before asking the user to decide.
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
- security scans or threat models: use `ops-security-review`
- code/diff review: use `implementation-review-swarm`
- adversarial plan/spec review: use `plan-review-swarm` or `spec-review-swarm`
- broad design research with subagents: use `spec-design-swarm`
- spec/design portability: use `spec-handoff`
- implementation plan creation: use `plan-create`
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
   - intent handle
   - current read
   - confidence
   - what evidence was checked
   - what is still missing
3. If the request hides multiple independent decisions, ask which decision to settle first instead of grilling all of them at once.
4. Load the stage reference only if stage-specific guidance is needed.
5. Load question patterns when the answer needs steelman, stress-test, assumption, terminology, or boundary pressure.
6. Ask one material question if the next decision cannot be inferred from evidence.
7. Stop when the decision, assumption, non-goal, or next workflow is explicit.

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

Intent handle:
<reflect-back / grill-me / steelman / stress-test / assumption-check / boundary-check / source-of-truth / reconverge>

Current model:
<one sentence>

Confidence:
<high / medium / low, and what is missing>

Boundary or assumption under pressure:
<what must be true, what is excluded, or who pays the tradeoff cost>

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

Boundary / tradeoff:
<what was accepted, rejected, or left outside scope>

Non-goals:
<what we are not doing>

Open:
<remaining material uncertainty, if any>

Next workflow:
<skill or action, if any>
```
