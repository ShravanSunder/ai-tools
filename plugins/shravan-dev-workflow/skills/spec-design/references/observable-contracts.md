# Observable Contracts

This reference owns externally observable contract and negative-space inspection.

Expected inputs: requirement inventory, consumers, external surfaces, compatibility constraints, and known failure policies.

Return: applicable contract slots per surface, unresolved policy decisions, examples/counterexamples, and requirement links.

For each load-bearing UI, API, CLI, protocol, schema/event, configuration, operator, or human/agent artifact surface, inspect:

```text
authority or public owner
consumer
inputs and preconditions
outputs and postconditions
state visible to the consumer
invariants
error and failure behavior
partial success
cancellation and timeout expectations
compatibility boundary
valid and boundary/invalid examples
explicitly undefined behavior
```

Only include fields that affect consumer interpretation. Do not fill an internal architecture template inside the specification.

## Good and Bad Signals

Good:

- names who can rely on the contract and which authority can change it;
- distinguishes rejection, retryable failure, partial success, timeout, and unknown outcome;
- says what duplicate, out-of-order, stale, empty, or malformed input does when material;
- identifies compatibility that must hold and nearby behavior intentionally left undefined;
- uses examples to disambiguate rules, not replace them.

Bad:

- “handle errors gracefully” without an externally visible outcome;
- “support existing behavior” without identifying which behavior is promised;
- only a happy-path example;
- exposing internal component names as public contract without an authoritative reason;
- claiming atomic success when partial external effects are possible.

## Negative Space

Name the nearest behavior a capable implementer may assume but must not build. Examples:

- no cross-account aggregation;
- no offline guarantee;
- no order preservation across independent streams;
- no compatibility promise for undocumented payload fields;
- no automatic recovery after an operator cancels the workflow.

Undefined behavior is not permission to violate an invariant. Say which freedom remains and which guarantees still constrain it.

Complete when: each load-bearing consumer can predict normal, boundary, failure, partial, cancellation, and compatibility behavior without guessing internal structure.
