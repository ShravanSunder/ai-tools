# State, Calls, and Flows

This reference owns state/lifecycle models, normal end-to-end flows, and compatibility/migration/cutover phases.

Expected inputs: component/ownership/interface model, requirements, external boundaries, and current-system constraints.

Return in workflow order: first the applicable state/lifecycle model; after the caller draws normal flows, return the state model, control/data/call flows, migration phase model, authority rules, and gaps.

## State and Lifecycle

For each material state:

```text
owner and lifetime/storage
valid states
initiator and transition guard
before/after invariant
persisted vs derived vs cached
reset/cancel/dispose/recovery
illegal transitions and handling
```

Use a state machine when timing/order changes correctness; use a state table when compact. In UI, prefer render-derived values over synchronized copies when ownership permits.

## End-to-End Flow

Trace each requirement:

```text
consumer -> entry -> coordinator -> owner -> external boundary
            result / event / state change returns on named path
```

Include async callbacks, jobs, events, storage, caches, and proof paths when they alter semantics. Separate control flow from data authority.

## Migration and Cutover

For each coexistence phase, name:

```text
authoritative state
permitted readers/writers
compatibility/version skew
transition/reconciliation owner
cutover and rollback conditions
failure/recovery behavior
proof seam
```

A temporary dual path is one coordination boundary with an authority rule per phase, not two sources of truth.

Complete when: every material requirement reaches an owner and observable outcome; state writes cannot bypass owners; and each migration phase has explicit authority, transition, rollback, failure, and proof.
