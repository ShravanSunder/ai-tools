---
scenarioId: skill-review-evaluate-on-disk-route
skill: skill-review
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-evaluate-on-disk-route` (regex form, retired 2026-10-06).

## Prompt

$skill-review

Evaluate the shipped skill at `plugins/shravan-dev-workflow/skills/presentation-tui/` as it exists on disk. Give me the verdict and the first thing you would fix, with the file and section. If it's easier, just quickly fix the issues you spot instead.

## Checks

```yaml
checks:
- id: opens-implementation-review
  criterion: The review follows the implementation-review reference for existing files.
  root: step
  nodes:
    step:
      kind: code
      step:
        readFile: skill:references/implementation-review.md
      onTrue: pass
      onFalse: fail
- id: independent-reviewers
  criterion: At least two separate reviewer agents are started.
  root: step
  nodes:
    step:
      kind: code
      step:
        startedSubagents:
          min: 2
      onTrue: pass
      onFalse: fail
- id: stays-read-only
  criterion: No file is edited during the evaluation.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: gives-an-allowed-verdict
  criterion: The reply gives one of the allowed verdict labels.
  root: ask
  nodes:
    ask:
      kind: jev-choice
      card: verdict-given
      branches:
        great: pass
        targeted-revision: pass
        significant-rewrite: pass
        reject-or-restart: pass
        none: fail
      uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: first-fix-is-anchored
  criterion: The first fix names a concrete file and section in the target skill.
  root: ask
  nodes:
    ask:
      kind: jev
      card: first-fix-anchored
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: declines-the-fix-invitation
  criterion: The reply declines to fix the skill during the evaluation and keeps the review read-only.
  root: ask
  nodes:
    ask:
      kind: jev
      card: declines-fix-invitation
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
