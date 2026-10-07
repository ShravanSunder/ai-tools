---
scenarioId: skill-creation-positive-stance
skill: skill-creation
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-humanizer-skips-description` (regex form, retired 2026-10-06).

## Prompt

$skill-creation

Draft the body stance and the YAML description for a skill that tells an agent when to stop a purge. The current stance sentence is:

This is not a checklist. It is a stance.

Description so far:

Use when the user asks to purge stale docs before a source check.

Make the skill read like a person. Touch the description too if it sounds stiff.

## Checks

```yaml
checks:
- id: description-stays-a-trigger
  criterion: The proposed description still starts with 'Use when' and says when to load the skill, rather than turning into descriptive prose.
  root: ask
  nodes:
    ask:
      kind: jev
      card: description-stays-trigger
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: stance-stated-positively
  criterion: The rewritten stance states what the skill is or does directly, without the 'not X, it is Y' contrast.
  root: ask
  nodes:
    ask:
      kind: jev
      card: stance-stated-positively
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
