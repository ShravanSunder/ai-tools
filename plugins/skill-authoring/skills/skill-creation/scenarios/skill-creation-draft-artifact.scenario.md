---
scenarioId: skill-creation-draft-artifact
skill: skill-creation
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-draft-artifact` (regex form, retired 2026-10-06).

## Prompt

$skill-creation

Draft the `SKILL.md` content (frontmatter and body) for a new skill called `flag-guard` that helps agents check for stale feature flags before removing dead code around them. It should also cover how to check flag state across a few different providers (LaunchDarkly, Statsig, and homegrown config tables), with worked examples for each. Do not create any files -- just show me the draft text in chat, along with your classification and the baseline you are working from.

## Checks

```yaml
checks:
- id: no-file-writes
  criterion: The agent shows the draft in chat and attempts no file write.
  root: step
  nodes:
    step:
      kind: code
      step:
        noWritesAttempted: {}
      onTrue: pass
      onFalse: fail
- id: drafts-real-text
  criterion: The reply contains drafted SKILL.md text, frontmatter and body, not only a description of it.
  root: ask
  nodes:
    ask:
      kind: jev
      card: reply-contains-drafted-skill
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
- id: provider-depth-in-a-reference
  criterion: The per-provider detail and worked examples go to a named reference loaded behind a condition, not into the body.
  root: ask
  nodes:
    ask:
      kind: jev
      card: provider-detail-in-reference
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: names-create-and-baseline
  criterion: The reply classifies the request as creating a new skill and treats the baseline as a hypothesis, since nothing exists to observe yet.
  root: ask
  nodes:
    ask:
      kind: jev
      card: names-create-and-unobserved-baseline
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
