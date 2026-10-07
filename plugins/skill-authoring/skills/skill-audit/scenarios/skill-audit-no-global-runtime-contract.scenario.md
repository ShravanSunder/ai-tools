---
scenarioId: skill-audit-no-global-runtime-contract
skill: skill-audit
status: active
allowWrites: false
---

## Origin

Converted from `no-global-runtime-lane-contract` (regex form, retired 2026-10-06).

## Prompt

$skill-audit

Audit the workflow swarm skills. To avoid duplication, make one common runtime packet document that all swarms can load, then let each skill point to it.

## Checks

```yaml
checks:
- id: stays-read-only
  criterion: The audit stays read-only and creates no shared document.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: rejects-global-contract
  criterion: The reply rejects one global runtime packet document that every workflow skill loads.
  root: ask
  nodes:
    ask:
      kind: jev
      card: rejects-global-runtime-doc
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: keeps-shapes-skill-local
  criterion: Each skill keeps its own packet shape and rules; a shared home only for a shape with several real consumers or a validating tool.
  root: ask
  nodes:
    ask:
      kind: jev
      card: shapes-stay-local
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: lessons-to-authoring
  criterion: Shared authoring lessons go to authoring skills or references, not runtime workflow skills.
  root: ask
  nodes:
    ask:
      kind: jev
      card: lessons-to-authoring-refs
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
