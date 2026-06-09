# Discuss With Me Mechanics

Use this reference when a spec/design needs user decisions before it can converge.

## Rules

- Ask one material question at a time.
- Include the agent's current guess or recommended answer.
- Explain what changes if the user chooses differently.
- Inspect code/docs before asking if the answer is discoverable.
- Do not accept vague approval as convergence when a material branch remains.
- Keep the discussion scoped to design/spec/plan/implementation/docs decisions; route review, debug, security, and execution work to their own skills.

## Question Shape

```text
Decision needed:
<one sentence>

My current read:
<recommended answer and confidence>

Why it matters:
<what architecture, scope, validation, docs, or implementation direction changes>

Question:
<single question>
```

## Use In Non-Interactive Handoffs

When the next agent cannot ask the user directly, list open branches instead:

```text
Open decision:
<question>

Recommended default:
<answer>

If wrong:
<cost or required redesign>
```
