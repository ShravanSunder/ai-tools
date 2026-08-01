# Program-Design Artifact and Self-Review

This reference owns view application, artifact navigation, simplification, trace-integrity verification, and author integration self-check. `SKILL.md` owns view selection and required semantic fields. `proof-architecture-and-traceability.md` owns construction of the requirement/design/proof trace; this reference consumes that trace.

Expected inputs: governing specification, accepted requirements set, confirmed boundary, current/target models, decisions, debt, proof map, selected rendering results, and repo documentation conventions.

Return in workflow order: first the artifact structure/view application, artifact identity, verification of the consumed requirement/design/proof trace, view-verification result, and pruned elements; after the caller runs the complete integration self-check stage, return the self-check gaps.

## Apply Required Views

Consume the selected predicates and required semantic fields from the `SKILL.md` Required Views table without restating them. Consume the shared rendering result for every firing and reject missing fields, failed visual checks, or unresolved fallbacks.

For call graph/sequence views, consume the current-to-proposed delta from `state-calls-and-flows.md` rather than copying a raw stack trace. Keep the current and proposed paths or explicit no-predecessor case; owner crossings; sync/async/event edges; state reads/writes or side effects; result/error propagation; evidence anchors; and added/removed/changed/intentionally-unchanged markers visible.

Diagrams do not replace behavioral interface or failure prose. Paths may anchor current evidence; do not turn the design into a future file/task list.

For a substantial design, lead with the smallest integrated overview composed from already-fired views, then reveal detail. Make every selected call or flow view representative of the actual boundary crossing. The view must preserve the semantic fields selected by the caller; format never excuses a missing owner, edge status, state/effect, result/error path, or evidence anchor.

Good: the smallest set of views lets a reader simulate composition, execution, and the riskiest failure.

Bad: prose labeled as a diagram, decorative boxes with no semantic owners, every possible view emitted mechanically, syntax chosen before the relationship is understood, or a passed result claimed with missing semantic fields.

## Simplify

For every heading, paragraph, list, table, component, interface, state, mechanism, and view, ask:

```text
which requirement/constraint/failure/proof need does it serve:
what complexity does it hide:
who consumes it:
what breaks if deleted:
```

Removal is valid only when it changes no human confirmation, correction, decision, trace, failure simulation, proof path, accepted-requirements coverage, or later authoritative lookup. Remove pass-through components, duplicate owners, unused seams, premature concurrency, process/review/PR narration, repeated companion ownership recitals, obscure headings, summaries that merely repeat the preceding model, and views that add no decision clarity. Preserve authoritative provenance and negative space; owners, interfaces, state, calls/flows, failure/recovery, trust, cutover, and proof decisions; and accepted debt with payer and revisit signal. After a deletion or simplification pass, report accepted-requirements coverage as one compact row per stable identity with `covered | owner-authorized supersession | gap` plus its anchor, reusing the existing coverage view. Identities may share a row only when every member identity is enumerated and all share the same disposition and anchor; a bare "coverage intact" assertion is not a report.

Choose the clearest expression: concise prose for one rule or rationale, a component tree for ownership, a call or sequence view for entrypoint-to-effect behavior, a state table or machine for lifecycle, a flow for data/failure/recovery, a comparison table for alternatives, and a concrete example when an interface remains abstract. Make headings say what the human will learn, such as “How Each Requirement Works and How We Verify It,” rather than compressed workflow jargon.

Remove an “Architecture documentation impact” section when it only lists post-implementation documentation or PR cleanup; route that work to planning or `docs-maintain`. Remove a “Design completion boundary” section when it only repeats acceptance, review, or planning gates. Preserve any actual system obligation and keep the useful readiness result—whether planning can proceed without inventing owners, interfaces, state, failure behavior, or proof seams—in the returned self-check.

## Integration Self-Check

Re-read the whole artifact:

- integrated overview matches detailed models;
- ownership is singular and dependency rules consistent;
- interfaces match state and flows;
- every applicable current/proposed call-path delta exposes all four edge markers;
- happy/failure/recovery/concurrency paths agree;
- cross-cutting obligations map to structure/failure/proof;
- every requirement has realization and seam;
- every accepted requirement remains covered or has owner-authorized supersession;
- every design element has a legitimate basis;
- every reader-facing element passes the human deletion test;
- progressive disclosure leads from specification obligation through owner, call/state/failure behavior, and proof without scratch or process notes;
- boundary check 2 exposes complexity spent and every deviation from boundary check 1;
- no planner-owned sequence/command detail leaked in;
- no missing Why/What was invented;
- two capable implementers would build the same structural behavior.

Run the self-check against the current program design and governing specification. Keep target classification, source/review coverage, readiness, acceptance, planning, PR, and release state in the returned result rather than durable program-design prose. A source pointer may remain when later readers need it for authoritative lookup. The self-check is not independent review.

Complete when: the artifact composes as one proportional executable mental model; every fired view has a passed rendering result with preserved semantics; current/proposed call deltas, accepted-requirements coverage, and boundary check 2 are visible; unnecessary structure is pruned; and every known gap is exact.
