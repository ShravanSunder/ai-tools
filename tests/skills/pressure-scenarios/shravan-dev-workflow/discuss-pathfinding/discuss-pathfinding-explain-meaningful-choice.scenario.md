---
scenarioId: discuss-pathfinding-explain-meaningful-choice
skill: discuss-pathfinding
status: active
allowWrites: false
---

## Prompt

$discuss-pathfinding

Help me decide our downtime tolerance, then return that clarified constraint to `program-design`; do not design components or mechanisms. We considered the current allowance of up to five minutes against a zero-downtime cutover that would require parallel infrastructure and delay the urgent migration. I confirm the owner policy: preserve backward compatibility, accept up to two minutes of planned downtime, and do not add parallel infrastructure solely to eliminate that downtime. Explain the boundary clearly, use a compact diagram if it helps, and return it to the exact owner.

## Checks

```yaml
checks:
- id: returns-to-program-design
  criterion: The clarified constraint goes back to program-design as owner meaning.
  root: ask
  nodes:
    ask:
      kind: jev-choice
      card: constraint-destination
      branches:
        program-design: pass
        spec-design: fail
        requirements-record: fail
        none: fail
      uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: explains-the-boundary
  criterion: The reply explains how the two-minute backward-compatible boundary differs from the five-minute allowance and from zero downtime, with the cost of each.
  root: ask
  nodes:
    ask:
      kind: jev
      card: explains-downtime-boundary
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-architecture
  criterion: No migration components, interfaces, or cutover mechanisms are chosen.
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-mechanism-chosen
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-reask
  criterion: The confirmed decision is recorded without asking the user to choose again.
  root: ask
  nodes:
    ask:
      kind: jev
      card: decision-not-reasked
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
