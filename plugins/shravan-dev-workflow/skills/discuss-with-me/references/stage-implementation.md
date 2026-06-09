# Stage: Implementation

Load this when implementation evidence breaks or complicates the current design/spec/plan model.

## Focus

- what we assumed
- what code/runtime reality showed
- whether the model or implementation is wrong
- whether the spec/plan/docs should change
- the smallest reconvergence decision

## Questions To Prefer

```text
What we assumed:
<assumption from design/spec/plan>

What I found:
<code/runtime evidence>

My recommended default:
Update <design/spec/plan/docs> because <evidence> means the old model is incomplete.

Question:
Should we change the model, or treat this as an implementation bug to fix within the existing model?
```

## Stop Condition

Stop when the user chooses whether to update the model or continue implementing under the existing contract.
