---
scenarioId: skill-creation-update-existing-skill
skill: skill-creation
status: active
allowWrites: false
fixtures:
- source: fixtures/debug-notes-skill.md
  target: tools/skills/debug-notes/SKILL.md
---

## Prompt

$skill-creation

Update the existing `debug-notes` skill at `tools/skills/debug-notes/` so it is clearer about when to write a repo-local notes file versus staying in chat. I do wonder whether there are adjacent debugging skills we should merge someday, but do not do a broad inventory right now. I already know the wording problem, so just make the change and confirm it reads better.

## Checks

```yaml
checks:
- id: reads-the-target-skill
  criterion: The agent reads the current SKILL.md of the skill it was asked to update.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: repo:tools/skills/debug-notes/SKILL.md
      onTrue: pass
      onFalse: fail
- id: review-before-edit
  criterion: 'Judged from the agent''s tool calls and replies: it attempts no file edit, or it obtains an independent spec review from separate reviewer agents before its first edit attempt.'
  root: ask
  nodes:
    ask:
      kind: jev
      card: review-before-edit
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - conversation
      - toolCalls
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
