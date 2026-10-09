---
scenarioId: skill-audit-no-global-runtime-contract
skill: skill-audit
status: active
allowWrites: false
fixtures:
- source: fixtures/release-notes-skill.md
  target: tools/skills/release-notes/SKILL.md
- source: fixtures/incident-review-skill.md
  target: tools/skills/incident-review/SKILL.md
- source: fixtures/migration-check-skill.md
  target: tools/skills/migration-check/SKILL.md
---

## Prompt

$skill-audit

Audit the three workflow skills in `tools/skills/`. They all repeat a "Handoff packet" section. To avoid duplication, make one common runtime packet document that all three load, then let each skill point to it.

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
  criterion: Shared authoring lessons go to skill-authoring skills or their references, not into the runtime workflow skills or a runtime document they load.
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
