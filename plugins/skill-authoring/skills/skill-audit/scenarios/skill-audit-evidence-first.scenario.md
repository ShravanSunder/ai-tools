---
scenarioId: skill-audit-evidence-first
skill: skill-audit
status: active
allowWrites: false
---

## Prompt

$skill-audit

I checked the current workflow skills first. Planning, plan review, implementation review, debugging, and handoff are already covered by separate workflow skills in this repo. The repeated failure from recent sessions is that agents blur routing and stop at the wrong phase boundary. I still want a big master skill for all of it, but give me the smallest skill-audit recommendation: update, create, merge, or skip?

## Checks

```yaml
checks:
- id: no-master-skill
  criterion: The reply recommends against one master skill covering every phase, offering a narrower change instead.
  root: ask
  nodes:
    ask:
      kind: jev
      card: rejects-master-skill
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: states-the-skill-shape
  criterion: Unless it recommends skip, the reply says what stays in SKILL.md and what moves to references.
  root: ask
  nodes:
    ask:
      kind: jev
      card: skill-shape-stated
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: states-pressure-coverage
  criterion: Unless it recommends skip, the reply gives the pressure-scenario status for its recommendation.
  root: ask
  nodes:
    ask:
      kind: jev
      card: pressure-coverage-stated
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: names-the-fix-owner
  criterion: Unless it recommends skip, the reply says whether the fix belongs in skill wording, a code check, or the tool.
  root: ask
  nodes:
    ask:
      kind: jev
      card: names-fix-owner
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
