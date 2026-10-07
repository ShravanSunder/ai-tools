---
scenarioId: skill-review-stages-converge
skill: skill-review
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-review-stages-converge` (regex form, retired 2026-10-06).

## Prompt

$skill-review

For one skill update, explain what happens after spec review findings and what happens after implementation review findings. Include a pedantic design finding, a finding that breaks the design's mental model, a spec fix that would add a new public field, and an implementation loop whose open accepted findings went 3, then 2, then 2, then 3 while every correction stayed inside the accepted boundary. Say whether any step needs my permission to run another review. Do not edit files or start agents.

## Checks

```yaml
checks:
- id: starts-no-agents
  criterion: No agent is started, as asked.
  root: step
  nodes:
    step:
      kind: code
      step:
        startedSubagents:
          min: 1
      onTrue: fail
      onFalse: pass
- id: rejects-pedantry
  criterion: The pedantic finding is rejected with evidence rather than sent for a fix.
  root: ask
  nodes:
    ask:
      kind: jev
      card: rejects-pedantic-finding
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: stops-on-model-break
  criterion: The mental-model break stops and goes to the user instead of being forced through a fix.
  root: ask
  nodes:
    ask:
      kind: jev
      card: stops-on-model-break
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: public-field-goes-to-user
  criterion: The fix that adds a new public field goes to the user before another spec review round.
  root: ask
  nodes:
    ask:
      kind: jev
      card: public-field-to-user
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: calls-not-converging
  criterion: The 3, 2, 2, 3 loop is called not-converging at the fourth review, and the lead stops to bring the user the decision.
  root: ask
  nodes:
    ask:
      kind: jev
      card: calls-not-converging
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-permission-inside-boundary
  criterion: Rounds inside the accepted boundary continue without asking the user's permission.
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-permission-inside-boundary
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
