# Stage: Plan

Load this when the discussion is about sequencing work after a design/spec direction exists.

## Focus

- task order
- ownership boundaries
- validation gates
- rollback or recovery
- dependencies
- scope cuts
- what must be checked before editing

## Questions To Prefer

```text
Current model:
The plan is viable if <assumption> holds.

My recommended default:
Validate <highest-risk assumption> first because it can invalidate the rest of the sequence.

Question:
Should the first step prove <risk>, or is there a different dependency that should lead?
```

## Stop Condition

Stop when the plan has a clear first executable step, validation gates, and a known handoff to `plan-review` or `plan-execute`.
