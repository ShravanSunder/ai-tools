# Program-Design Artifact and Self-Review

This reference owns view application, artifact navigation, simplification, trace-integrity verification, and author integration self-check. `SKILL.md` owns view selection and required semantic fields. `proof-architecture-and-traceability.md` owns construction of the requirement/design/proof trace; this reference consumes that trace.

Expected inputs: governing specification/digest, current/target models, decisions, debt, proof map, and repo documentation conventions.

Return in workflow order: first the artifact structure/view application, artifact identity/digest, verification of the consumed requirement/design/proof trace, and pruned elements; after the caller runs the complete integration self-check stage, return the digest-bound self-check gaps.

## Apply Required Views

Consume the selected predicates and required semantic fields from the `SKILL.md` Required Views table without restating them. Consume the shared rendering result for every firing and reject missing fields, failed visual checks, or unresolved fallbacks.

For call graph/sequence views, normalize current call-stack and call-path evidence into a source-anchored entrypoint-to-effect chain rather than copying a raw stack trace. Keep owner crossings, sync/async/event edges, state reads/writes or side effects, result/error propagation, and evidence anchors visible.

Diagrams do not replace behavioral interface or failure prose. Paths may anchor current evidence; do not turn the design into a future file/task list.

For a substantial design, lead with the integrated component/ownership view and render each additional view whose predicate fired. Make every selected call or flow view representative of the actual boundary crossing. The view must preserve the semantic fields selected by the caller; format never excuses a missing owner, edge, state, result/error path, or evidence anchor.

Good: the smallest set of views lets a reader simulate composition, execution, and the riskiest failure.

Bad: prose labeled as a diagram, decorative boxes with no semantic owners, every possible view emitted mechanically, syntax chosen before the relationship is understood, or a passed result claimed with missing semantic fields.

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

Complete when: the artifact composes as one executable mental model, every fired view has a passed rendering result with preserved semantics, unnecessary structure is pruned, and every known gap is exact.
