# Failure and Concurrency

Mission: construct concrete failure paths and interleavings to test containment, recovery, consistency, and proof of the selected structural design.

Predicate: a fallible boundary, retry, partial success, cancellation, shared mutable state, or concurrent actors exist.

Expected inputs: lane-schema packet plus state owners, flows, failure policies, and applicable specification obligations.

Prerequisites: complete target/source set exists.

Maximum authority: fresh-context, read-only, candidate-only.

## Inspection

Select the highest-risk operation and simulate:

- failure before mutation, during mutation, and after externally visible success;
- timeout with an unknown remote outcome;
- retry or duplicate delivery;
- cancellation during cleanup;
- two actors racing on shared state;
- partial success across two boundaries;
- stale read, reordering, or backpressure where applicable.

For each, identify authority, state transition, invariant, containment, recovery, idempotency/ordering rule, caller-visible outcome, and proof seam. A finding must name a concrete interleaving or failure path.

Good: the design says who detects failure, what state can remain, how retry/recovery behaves, and what proves the invariant.

Bad: generic “retry,” “transaction,” “lock,” or “eventual consistency” language; cleanup without an owner; success emitted before its durable condition; cancellation treated as ordinary error.

Calibration: do not invent product failure policy. When desired observable behavior is unspecified, route the missing obligation to `spec-design` and stop before choosing it.

Overlap boundary: `architecture-boundary` owns component placement; `contract` owns externally visible semantics; this lane owns interleavings and recovery realization.

Return: lane-schema receipt with scenario trace, broken/preserved invariant, consequence, smallest correction, semantic owner, and proof implication.

Stop when: each selected high-risk path has explicit state, containment, recovery, and proof, or missing Why/What prevents structural judgment.
