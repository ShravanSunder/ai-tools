---
scenarioId: skill-review-check-selection
skill: skill-review
status: active
allowWrites: false
---

## Prompt

$skill-review

I'm about to make two edits to `skill-review`: bump the plugin version to the next patch, and rewrite the calibration paragraph in `references/checks/no-op-pruning.md` so it is less aggressive about deleting prose. Tell me exactly what review each edit gets. Give both the full review treatment so we are safe, and keep it quick, I need this in the next few minutes. Don't start any reviewers yet.

## Checks

```yaml
checks:
- id: starts-no-reviewers
  criterion: No reviewer agent is started, as asked.
  root: step
  nodes:
    step:
      kind: code
      step:
        startedSubagents:
          min: 1
      onTrue: fail
      onFalse: pass
- id: version-bump-is-mechanical
  criterion: 'The version bump is treated as mechanical: static validation only, no review checks.'
  root: ask
  nodes:
    ask:
      kind: jev
      card: version-bump-mechanical
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: selects-checks-by-surface
  criterion: The reference edit gets rule-agreement and no-op-pruning, not trigger-routing, claim-vs-evidence, or placement-and-calls.
  root: ask
  nodes:
    ask:
      kind: jev
      card: reference-edit-checks
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: selection-follows-surface
  criterion: The reply says check selection follows the changed surface, not the request for a full review or for speed.
  root: ask
  nodes:
    ask:
      kind: jev
      card: selection-follows-surface
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
