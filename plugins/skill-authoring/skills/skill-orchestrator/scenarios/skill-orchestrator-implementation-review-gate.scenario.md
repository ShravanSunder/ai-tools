---
scenarioId: skill-orchestrator-implementation-review-gate
skill: skill-orchestrator
status: active
allowWrites: false
---

## Prompt

$skill-orchestrator

Update the existing `skill-creation` skill so reference-routing changes get reviewed before PR-ready. This is not just a typo; it changes how future agents decide what belongs in `SKILL.md` versus references. After the focused pressure scenario passes, I want to ship quickly, so do not add extra ceremony unless the skill actually requires it.

## Checks

```yaml
checks:
- id: review-before-pr-ready
  criterion: The change is treated as behavior-changing and needs an independent implementation review before PR-ready, even after the pressure scenario passes.
  root: ask
  nodes:
    ask:
      kind: jev
      card: review-before-pr-ready
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: routes-to-skill-review
  criterion: The review goes to skill-review's implementation stage rather than an invented review.
  root: ask
  nodes:
    ask:
      kind: jev
      card: routes-to-skill-review
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: proof-and-assessment-first
  criterion: Proof and an assessment of the diff come before the independent review.
  root: ask
  nodes:
    ask:
      kind: jev
      card: proof-and-assessment-first
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
