---
name: grill-interview
description: Use only when the user explicitly asks to be grilled, interviewed, questioned, or stress-tested on an idea, spec, design, plan, decision, or implementation direction. Manual trigger only; ask one material question at a time with the agent's recommended answer and tradeoff.
---

# Grill Interview

Use this skill as a manual thinking partner inside any spec-driven workflow. It clarifies intent before a spec, attacks unresolved branches during design, and pressure-tests plans before execution.

This skill does not write code, specs, or plans by itself. Its output is shared understanding, a decision, or a copy-pasteable question packet.

Core loop:

```text
user asks to be grilled/interviewed
  -> inspect known code/docs if the answer is discoverable
  -> state current hypothesis and confidence
  -> ask one blocking question with a recommended answer
  -> update the model from the answer
  -> stop when intent/decision is explicit
```

## Core Rules

- Manual trigger only. Do not invoke just because a request is vague.
- Ask one question at a time and wait.
- Every question must include the agent's current guess or recommended answer.
- Prefer code/docs inspection over asking when the answer is discoverable.
- Ask about the real decision, not a survey of preferences.
- Keep confidence visible when intent is still unclear.
- Use `tui-presentation` when explaining a decision tree, alternatives, or a multi-section synthesis.
- Do not accept "whatever you think" as convergence. Offer two concrete defaults and ask the user to choose.
- If the interview produces a durable decision, suggest the next workflow: `spec-design-swarm`, `spec-review-council`, `plan-handoff`, `plan-review`, or `docs-maintain`.

## Workflow

1. Classify the grill:
   - intent interview before design
   - design decision branch
   - plan/spec stress test
   - documentation/source-of-truth conflict
   - implementation closeout question
2. Build the starting hypothesis:
   - one-sentence current read
   - confidence percentage
   - what is missing
3. Inspect before asking:
   - relevant code paths
   - docs, specs, plans, README, AGENTS
   - previous decisions if the repo keeps them
4. Ask one question:
   - decision needed
   - current read
   - why it matters
   - single question
5. After the answer:
   - update the hypothesis
   - record what changed
   - ask the next one only if a material branch remains
6. Finish with:
   - confirmed intent or decision
   - explicit non-goals
   - next skill or artifact

## Progressive Disclosure

- Load `references/question-forms.md` before asking the first question when the context is broad or politically/technically loaded.
- Load `references/spec-workflow-integration.md` when using this inside design, plan, review, or handoff workflows.
- Load `references/source-inspirations.md` when updating this skill or explaining what it borrows from admired skill sources.

## Output Shape

For the live question:

```text
Hypothesis:
<one sentence>

Confidence:
<percentage and what is missing>

Decision needed:
<one sentence>

My current read:
<recommended answer and why>

Why it matters:
<what changes>

Question:
<one focused question>
```

For the closeout:

- confirmed decision or intent
- confidence
- non-goals
- open branches, if any
- recommended next workflow
