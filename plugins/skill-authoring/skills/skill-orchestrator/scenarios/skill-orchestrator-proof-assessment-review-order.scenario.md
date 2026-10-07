---
scenarioId: skill-orchestrator-proof-assessment-review-order
skill: skill-orchestrator
status: active
allowWrites: false
---

## Origin

Converted from `skills-creation-proof-main-assessment-review-order` (regex form, retired 2026-10-06).

## Prompt

$skill-orchestrator

Chat only; route the next steps without running tools or starting agents. The skill spec and plan for this change are accepted. The implementer finished the named run but has not run its pressure scenarios. A teammate wants an independent implementation review now, then proof only after review changes settle. State the required sequence, what you must inspect, and how accepted corrections return.

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
- id: proof-before-review
  criterion: Proof runs before the independent review; review does not substitute for missing proof.
  root: ask
  nodes:
    ask:
      kind: jev
      card: proof-before-review
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: assessment-before-review
  criterion: The diff and proof are assessed against the need and accepted spec before review.
  root: ask
  nodes:
    ask:
      kind: jev
      card: assessment-before-review
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: corrections-get-fresh-proof
  criterion: Accepted corrections get fresh proof and reassessment before review refreshes.
  root: ask
  nodes:
    ask:
      kind: jev
      card: corrections-fresh-proof
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
