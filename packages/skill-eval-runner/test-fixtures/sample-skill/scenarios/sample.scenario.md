---
scenarioId: sample-scenario
skill: sample-skill
status: active
allowWrites: false
followUps: []
---

## Prompt

Please read the sample skill and explain its workflow in one sentence.

## Checks

```yaml
checks:
  - id: skill-loaded
    criterion: The sample skill was read before answering.
    root: loaded
    nodes:
      loaded:
        kind: code
        step:
          loadedSkill: sample-skill
        onTrue: pass
        onFalse: fail
        onUnavailable: inconclusive
  - id: answer-quality
    criterion: The response addresses the request.
    root: answer
    nodes:
      answer:
        kind: judge
        evidence: [finalMessage]
```
