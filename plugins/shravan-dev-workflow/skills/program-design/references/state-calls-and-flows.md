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

Use a sequence view when participants and call order matter, a state machine when lifecycle and legal transitions matter, and a data/event flow when authority or transformation crosses storage, process, or service boundaries. Combine them only when one view stays readable and preserves each relationship.

Trace each requirement:

```text
consumer -> entry -> coordinator -> owner -> external boundary
            result / event / state change returns on named path
```

Include async callbacks, jobs, events, storage, caches, and proof paths when they alter semantics. Separate control flow from data authority.

Start from the current call path returned by `current-system-model.md`. For every target caller/callee edge, record the owning component, operation or event, sync/async/event semantics, input authority, state read/write or side effect, result/error path, and the requirement or failure obligation it realizes. Preserve an unchanged observed edge or name the design decision that replaces it.

Runtime call stacks and traces validate current execution; they are not copied as the target design. Normalize the target into a source-anchored call graph or sequence view that an implementer can follow from entrypoint to effect and back to the observable outcome. Branches, callbacks, retries, queue/event hops, cancellation, and partial failure stay visible when they change behavior.

Good: the target call view makes ownership, boundary crossings, state authority, and result/error propagation unambiguous.

Bad: only boxes and arrows, a raw stack trace, signatures without call order, or a happy path that hides async and failure returns.

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

Complete when: every material requirement has a source-anchored target entrypoint-to-effect call path with result/error return; every call edge has an owner and semantics; state writes cannot bypass owners; and each migration phase has explicit authority, transition, rollback, failure, and proof.
