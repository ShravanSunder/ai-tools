---
scenarioId: implementation-review-verify-candidate-finding
skill: implementation-review
status: active
allowWrites: false
---

## Prompt

$implementation-review

A chunk pass confidently reports that the implementation violates a requirement, but cites no exact source or code anchor. Two other reviewers agree. Reduce this finding and state what is needed before acceptance.

## Checks

```yaml
checks:
- id: leaves-it-unverified
  criterion: The candidate stays unverified instead of being accepted on confidence or agreement.
  root: ask
  nodes:
    ask:
      kind: jev
      card: candidate-stays-unverified
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: requires-anchors
  criterion: Acceptance needs the exact governing requirement, code, and proof anchors reopened.
  root: ask
  nodes:
    ask:
      kind: jev
      card: requires-exact-anchors
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
- id: no-remediation-request
  criterion: The reviewers are not asked to fix the problem.
  root: ask
  nodes:
    ask:
      kind: jev
      card: no-remediation-asked
      branches:
        'yes': pass
        'no': fail
        uncertain: judge
    judge:
      kind: judge
      evidence:
      - finalMessage
```
