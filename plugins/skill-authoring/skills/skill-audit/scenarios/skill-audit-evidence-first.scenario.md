---
scenarioId: skill-audit-evidence-first
skill: skill-audit
status: active
allowWrites: false
---

## Origin

Converted from `skill-audit-evidence-first` (regex form, retired 2026-10-06).

## Prompt

$skill-audit

I checked the current workflow skills first. Planning, plan review, implementation review, debugging, and handoff are already covered by separate shravan-dev-workflow skills. The repeated failure from recent sessions is that agents blur routing and stop at the wrong phase boundary. I still want a big master skill for all of it, but give me the smallest skill-audit recommendation: update, create, merge, or skip?

## Checks

```yaml
checks:
- id: smallest-action
  criterion: The recommendation is not a new master skill.
  root: ask
  nodes:
    ask:
      kind: jev-choice
      card: recommended-action
      branches:
        update: pass
        merge: pass
        skip: pass
        create: fail
        none: fail
      uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: shapes-the-recommendation
  criterion: An update or create recommendation says what stays in SKILL.md, what moves to references, whether scripts are needed, and the pressure-scenario status.
  root: ask
  nodes:
    ask:
      kind: jev
      card: recommendation-shaped
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
