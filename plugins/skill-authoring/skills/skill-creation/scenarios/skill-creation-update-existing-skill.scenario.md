---
scenarioId: skill-creation-update-existing-skill
skill: skill-creation
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-update-existing-skill` (regex form, retired 2026-10-06).

## Prompt

$skill-creation

Update the existing `debug-investigation` skill so it is clearer about when to write a repo-local debug artifact versus staying in chat. I do wonder whether there are adjacent debugging skills we should merge someday, but do not do a broad inventory right now. I already know the wording problem, so just make the change and confirm it reads better.

## Checks

```yaml
checks:
- id: reads-the-target-skill
  criterion: The agent opens the current debug-investigation SKILL.md before saying anything about it.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: repo:plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md
      onTrue: pass
      onFalse: fail
- id: no-edit-before-spec
  criterion: The agent attempts no edit before a success definition and spec exist.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: treats-as-update
  criterion: The reply treats the request as an update to the existing skill, not a new skill.
  root: ask
  nodes:
    ask:
      kind: jev
      card: treats-as-update
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: defers-the-inventory
  criterion: The reply keeps the broad inventory or merge question out of this run.
  root: ask
  nodes:
    ask:
      kind: jev
      card: defers-inventory
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: success-before-edit
  criterion: Before changing wording, the reply states or asks for a success definition for the change.
  root: ask
  nodes:
    ask:
      kind: jev
      card: success-before-edit
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
