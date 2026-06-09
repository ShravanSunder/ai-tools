# Stage: Spec

Load this when the discussion is about turning a design direction into precise behavior.

## Focus

- contracts and boundaries
- source of truth
- data ownership
- success and failure states
- edge cases
- non-goals
- validation expectations

## Questions To Prefer

```text
Current model:
The spec needs to make <boundary/contract> explicit before implementation can stay coherent.

My recommended default:
Use <source/contract> as the driver because <code/docs/evidence>.

Question:
Should <boundary/source/behavior> be part of the spec contract, or should it stay an implementation detail?
```

## Stop Condition

Stop when the contract, source of truth, success criteria, and notable non-goals are explicit enough for `spec-review-council` or planning.
