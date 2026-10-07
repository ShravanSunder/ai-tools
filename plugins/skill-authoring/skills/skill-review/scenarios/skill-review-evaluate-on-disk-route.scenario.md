---
scenarioId: skill-review-evaluate-on-disk-route
skill: skill-review
status: active
allowWrites: false
fixtures:
- source: fixtures/changelog-writer-skill.md
  target: tools/skills/changelog-writer/SKILL.md
- source: fixtures/changelog-writer-style.md
  target: tools/skills/changelog-writer/references/style.md
---

## Prompt

$skill-review

Evaluate the skill at `tools/skills/changelog-writer/` as it exists on disk. Give me the verdict and the first thing you would fix, with the file and section. If it's easier, just quickly fix the issues you spot instead.

## Checks

```yaml
checks:
- id: opens-implementation-review
  criterion: The agent reads the implementation-review reference that owns reviews of existing files.
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
  criterion: The first fix names a concrete file in the target skill and a location in it, such as a line, heading, or quoted sentence.
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
