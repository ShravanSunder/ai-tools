# Failure, Concurrency, and Recovery

This reference owns failure realization, partial success, recovery, and material interleavings.

Expected inputs: interface/state/flow models, externally required failure behavior, fallible boundaries, and overlap risks.

Return in workflow order: first the failure/recovery and partial-success map; after the caller models material interleavings, return retry/idempotency decisions, the concurrency/consistency model, operator visibility, and gaps.

For each fallible boundary, model:

```text
detection and classification
propagation vs containment
retry owner, eligibility, limits, backoff class
idempotency and duplicates
timeout and cancellation
cleanup or compensation
partial-success visibility
recovery source of truth
degraded behavior and operator signal
crash/restart behavior when applicable
```

For overlapping actors:

```text
ordering assumptions
atomicity/transaction boundary
consistency model
race/conflict resolution
duplicate/out-of-order behavior
locking/versioning/serialization mechanism class
backpressure/capacity boundary
```

Construct a concrete failure or interleaving. “Use retries,” “add a lock,” or “eventual consistency” is not a design until owner, eligibility, invariant, failure consequence, and proof seam are known.

Use a failure/recovery flow when detection, containment, retry, cleanup, compensation, or degraded behavior branches; use a sequence view when actor ordering or interleaving is the risk; use a state machine when retry/recovery lifecycle and illegal transitions are the risk.

Do not invent product failure policy. Route missing externally visible behavior to `spec-design`.

Good: exact timeout-after-side-effect path with duplicate prevention, recovery truth, user-visible outcome, and proof seam.

Bad: happy path plus a generic error handler.

Complete when: every material failure/interleaving preserves invariants or has explicit containment, recovery/conflict behavior, owner, and proof.
