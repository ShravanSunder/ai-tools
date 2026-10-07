---
scenarioId: skill-creation-workflow-spine
skill: skill-creation
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-workflow-spine` (regex form, retired 2026-10-06).

## Prompt

$skill-creation

I want to create one new repo skill called `release-note-reviewer` in `shravan-dev-workflow`. It should help agents review changelog entries before a release ships. I also keep wondering which other skills should exist in this repo, but do not do a huge inventory right now.

Tell me how you are classifying this request, what is in scope for this run, and draft the exact frontmatter `description:` line you would ship for the new skill.

## Checks

```yaml
checks:
- id: classifies-create
  criterion: The reply classifies the request as creating one new skill named release-note-reviewer.
  root: ask
  nodes:
    ask:
      kind: jev
      card: classifies-create
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: defers-the-inventory
  criterion: The reply keeps the broad which-skills-should-exist question out of this run.
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
- id: description-is-a-trigger
  criterion: The drafted description starts with 'Use when' and names triggering situations without narrating the workflow.
  root: ask
  nodes:
    ask:
      kind: jev
      card: drafted-description-is-trigger
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
