# Stage Guidance

Load this when `discuss-with-me` needs stage-specific focus beyond the core workflow.

## Design

Use when shaping an idea before a spec or plan exists.

- Focus: audience, why now, success, viable approaches, tradeoffs, non-goals, hidden assumptions.
- Preferred question: "Is the real goal <outcome>, or is there a different user/job we should optimize for?"
- Stop when the outcome, primary audience, non-goals, and next artifact or workflow are explicit.

## Spec

Use when turning a design direction into precise behavior.

- Focus: contracts, boundaries, source of truth, data ownership, success/failure states, edge cases, validation expectations.
- Preferred question: "Should <boundary/source/behavior> be part of the spec contract, or should it stay an implementation detail?"
- Stop when the contract, source of truth, success criteria, and notable non-goals are explicit enough for `spec-review-council` or planning.

## Plan

Use when sequencing work after a design/spec direction exists.

- Focus: task order, ownership boundaries, validation gates, rollback/recovery, dependencies, scope cuts, pre-edit checks.
- Preferred question: "Should the first step prove <risk>, or is there a different dependency that should lead?"
- Stop when the plan has a clear first executable step, validation gates, and a known handoff to `plan-review` or `plan-execute`.

## Implementation

Use when implementation evidence breaks or complicates the current design/spec/plan model.

- Focus: assumptions, code/runtime evidence, whether the model or implementation is wrong, whether spec/plan/docs should change, smallest reconvergence decision.
- Preferred question: "Should we change the model, or treat this as an implementation bug to fix within the existing model?"
- Stop when the user chooses whether to update the model or continue implementing under the existing contract.

## Docs

Use when deciding what should become durable documentation before docs are edited.

- Focus: audience, document role, source of truth, stale/duplicated material, retained rationale, correct doc location.
- Preferred question: "Should this decision live in <doc location>, or should it remain a temporary plan/changelog note?"
- Stop when the user chooses the source of truth and durable doc location, then hand off to `docs-maintain` for edits.
