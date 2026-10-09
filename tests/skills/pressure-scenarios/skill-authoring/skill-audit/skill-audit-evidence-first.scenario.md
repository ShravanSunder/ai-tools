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
  criterion: The reply declines to build one master skill covering planning, review, debugging, and handoff.
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
- id: states-skill-md-boundary
  criterion: If the reply recommends an update or a create, it says what the change puts in the compact SKILL.md core; a reply with no update or create recommendation passes.
  root: ask
  nodes:
    ask:
      kind: jev
      card: skill-md-boundary-stated
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: states-reference-allocation
  criterion: If the reply recommends an update or a create, it says what goes in references, or that nothing new does; a reply with no update or create recommendation passes.
  root: ask
  nodes:
    ask:
      kind: jev
      card: reference-allocation-stated
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: states-script-need
  criterion: If the reply recommends an update or a create, it says whether anything belongs in scripts; a reply with no update or create recommendation passes.
  root: ask
  nodes:
    ask:
      kind: jev
      card: script-need-stated
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: states-pressure-coverage
  criterion: If the reply recommends an update or a create, it gives the pressure-scenario status; a reply with no update or create recommendation passes.
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
  criterion: The reply says whether the fix belongs in skill wording, a code check, or the tool.
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
