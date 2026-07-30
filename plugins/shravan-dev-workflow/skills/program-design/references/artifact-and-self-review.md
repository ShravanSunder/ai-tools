# Program-Design Artifact and Self-Review

This reference owns view selection, artifact navigation, simplification, trace-integrity verification, and author integration self-check. `proof-architecture-and-traceability.md` owns construction of the requirement/design/proof trace; this reference consumes that trace.

Expected inputs: governing specification/digest, current/target models, decisions, debt, proof map, and repo documentation conventions.

Return in workflow order: first the artifact structure/view selection, artifact identity/digest, verification of the consumed requirement/design/proof trace, and pruned elements; after the caller runs the complete integration self-check stage, return the digest-bound self-check gaps.

## Select Views by Need

Use only views that expose a load-bearing relationship:

- component tree for ownership/composition;
- sequence/call graph for cross-owner or async control;
- proof call graph when harness boundaries differ;
- state machine/table for lifecycle/order;
- data/event flow for authority/transformation;
- failure/recovery flow for partial failure/retry;
- trust-boundary view for untrusted actors/input/secrets/processes;
- requirement/design/proof trace when relationships are non-obvious.

Diagrams do not replace behavioral interface or failure prose. Paths may anchor current evidence; do not turn the design into a future file/task list.

## Simplify

For every component, interface, state, mechanism, and view, ask:

```text
which requirement/constraint/failure/proof need does it serve:
what complexity does it hide:
who consumes it:
what breaks if deleted:
```

Remove pass-through components, duplicate owners, unused seams, premature concurrency, and views that add no decision clarity. Preserve accepted debt with payer and revisit signal.

## Integration Self-Check

Re-read the whole artifact:

- integrated overview matches detailed models;
- ownership is singular and dependency rules consistent;
- interfaces match state and flows;
- happy/failure/recovery/concurrency paths agree;
- cross-cutting obligations map to structure/failure/proof;
- every requirement has realization and seam;
- every design element has a legitimate basis;
- no planner-owned sequence/command detail leaked in;
- no missing Why/What was invented;
- two capable implementers would build the same structural behavior.

Bind the self-check to both artifact and governing-specification digests. It is not independent review.

Complete when: the artifact composes as one executable mental model, unnecessary structure is pruned, and every known gap is exact.
