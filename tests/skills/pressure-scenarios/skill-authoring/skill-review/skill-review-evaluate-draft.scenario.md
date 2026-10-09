---
scenarioId: skill-review-evaluate-draft
skill: skill-review
status: active
allowWrites: false
---

## Prompt

$skill-review

Evaluate this draft skill and tell me if it is great.

```markdown
---
name: release-helper
description: Helps with releases by checking the release notes, reading files,
running validation, updating docs, and making sure everything is polished.
---

# Release Helper

Use this when doing releases.

Read the release notes and make them good. Check whatever files seem
relevant. If something is wrong, fix it. Be careful with public information.
Run the checks if needed.
```

Do not rewrite the whole skill yet. Tell me the verdict and what you would fix first.

## Checks

```yaml
checks:
- id: independent-reviewers
  criterion: At least two separate reviewer agents are started for the review.
  root: step
  nodes:
    step:
      kind: code
      step:
        startedSubagents:
          min: 2
      onTrue: pass
      onFalse: fail
- id: verdict-is-not-great
  criterion: The verdict is one of the allowed labels and not 'great'.
  root: ask
  nodes:
    ask:
      kind: jev-choice
      card: verdict-given
      branches:
        great: fail
        targeted-revision: pass
        significant-rewrite: pass
        reject-or-restart: pass
        none: fail
      uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: names-a-blocking-gap
  criterion: The reply cites a blocking gap (no workflow spine, a description that summarizes work instead of naming triggers, or no proof).
  root: ask
  nodes:
    ask:
      kind: jev
      card: names-blocking-gap
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: one-first-revision
  criterion: The reply names one first revision rather than rewriting everything.
  root: ask
  nodes:
    ask:
      kind: jev
      card: first-revision-named
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
