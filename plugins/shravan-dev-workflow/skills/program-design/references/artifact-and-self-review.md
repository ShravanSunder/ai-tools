# Program-Design Artifact and Self-Review

This reference owns view application, artifact navigation, simplification, binding-table and trace-table verification, term agreement, and author integration self-check. `SKILL.md` owns view selection and required semantic fields. `components-ownership-interfaces.md` builds the entity binding table and `proof-architecture-and-traceability.md` builds the trace table; this reference verifies both.

Expected inputs: distinct Requirements and Specification identities, governing Requirements and Specification contents including the entity table, accepted requirements set, confirmed goal boundary, current/target models, entity binding table, decisions, debt, trace table, selected rendering results, and repo documentation conventions.

Return in workflow order:

1. Artifact structure and view application, artifact identity, verification of the binding table and trace table, view-verification result, and pruned elements.
2. After the caller runs the complete integration self-check stage, the self-check gaps.

## Apply Required Views

Consume each selected view's reader question plus the selected predicates and required semantic fields from the `SKILL.md` Required Views table without restating them. Consume the shared rendering result for every firing and reject missing fields, failed visual checks, unresolved fallbacks, or a view that does not answer its stated reader question. For generated images, also reject a missing project-local asset, broken relative embed, inaccurate alt/caption, absent pixel inspection, unverified required destination preview, main-unaccepted candidate, or any disagreement with the exact structural views.

For call graph or sequence views, consume the current-to-proposed delta from `state-calls-and-flows.md` rather than copying a raw stack trace. Keep these fields visible:

- current and proposed paths, or an explicit no-predecessor case;
- owner crossings;
- synchronous, asynchronous, and event edges, each boundary-crossing edge with its shape;
- state reads and writes or side effects;
- result and error propagation;
- evidence anchors;
- added, removed, and changed markers;
- preservation-critical or contested unchanged edges.

Every entity -> home map row comes from the binding table. Verify the trace table against the design: one row per Specification obligation (`R`), each `U` cell naming every Requirements row the obligation traces to or `none: <why>`, no blank cell, `gap: <why>` only where design is missing, each cell agreeing with the section it summarizes, and the returned coverage disposition matching the rows.

Diagrams do not replace behavioral interface or failure prose. Paths may anchor current evidence; the design names owners, package or module homes, and schema homes, never a task list, write scopes, or exact files.

For a substantial design, lead with the smallest integrated overview composed from already-fired views, then reveal detail in the order a reader needs it: diagram, then table, then code shape. Make every selected call or flow view representative of the actual boundary crossing. The view must preserve the semantic fields selected by the caller; format never excuses a missing owner, edge status, state/effect, result/error path, or evidence anchor.

Good: the smallest set of views lets a reader simulate composition, execution, and the riskiest failure, and find where each entity lives.

Bad: prose labeled as a diagram, decorative boxes with no semantic owners, every possible view emitted mechanically, syntax chosen before the relationship is understood, or a passed result claimed with missing semantic fields.

## Simplify

For every heading, paragraph, list, table, component, interface, state, mechanism, and view, ask:

```text
which requirement/constraint/failure/proof need does it serve:
what complexity does it hide:
who consumes it:
what breaks if deleted:
```

Removal is valid only when it changes no human confirmation, correction, decision, trace, failure simulation, proof path, accepted-requirements coverage, or later authoritative lookup.

Remove:

- pass-through components and duplicate owners;
- unused seams and premature concurrency;
- process, review, or PR narration;
- repeated companion ownership recitals;
- obscure headings;
- summaries that repeat the preceding model;
- views that add no decision clarity.

Preserve:

- authoritative provenance and negative space;
- entity bindings, owners, interfaces, state, calls, and flows;
- failure, recovery, trust, cutover, and proof decisions;
- accepted debt with payer and revisit signal.

After deletion or simplification, derive the report from the trace table: one compact row per stable identity with `covered | owner-authorized supersession | gap` plus its anchor, taken from the obligation's trace row, and for identities that are not obligation rows (entities, constraints, variants, defaults, proof obligations), reported beside the table with their own anchors. Identities may share a row only when every member identity is enumerated and all share the same disposition and anchor. A bare "coverage intact" assertion is not a report. Deleting an entity is a coverage loss.

Choose the expression that fits the relationship:

- concise prose for one rule or rationale;
- an entity -> home map for where each entity lives;
- a component tree for ownership;
- a call or sequence view for entrypoint-to-effect behavior;
- a state table or machine for lifecycle;
- a flow for data, failure, or recovery;
- a comparison table for alternatives;
- a concrete example when an interface remains abstract.

Make headings say what the human will learn, such as “How Each Requirement Works and How We Verify It,” rather than compressed workflow jargon.

Remove an “Architecture documentation impact” section when it only lists post-implementation documentation or PR cleanup; route that work to planning or `docs-maintain`. Remove a “Design completion boundary” section when it only repeats acceptance, review, or planning gates. Preserve any actual system obligation and keep the useful readiness result—whether planning can proceed without inventing owners, interfaces, state, failure behavior, or proof seams—in the returned self-check.

## Integration Self-Check

Re-read the whole artifact:

- integrated overview matches detailed models;
- every Specification entity has a binding row with owner, home, schema/type home, disposition, and convention, or a `gap: <why>`;
- every boundary crossing has a shape in the found convention or a field list with nullability and discriminant;
- each term means the same thing in the Specification and the design: design prose uses the `E` term, a code name appears only in shape and home cells, and a design noun with no `E` names the `E` or `R` it serves;
- ownership is singular and dependency rules consistent;
- interfaces match state and flows, and every result or decision contract is a closed variant with a bounded reason set;
- every applicable current/proposed call-path delta exposes added, removed, and changed edges plus preservation-critical or contested unchanged edges;
- happy/failure/recovery/concurrency paths agree;
- cross-cutting obligations map to structure/failure/proof;
- every Specification obligation has its own trace row with realization and seam, and the rows agree with the returned coverage disposition;
- every accepted requirement and entity remains covered or has owner-authorized supersession;
- every design element has a legitimate basis;
- every reader-facing element passes the human deletion test;
- every generated visual has a current accepted asset/embed, accurate labels and edges, readable placement, and agreement with the authoritative prose and exact views;
- progressive disclosure leads from specification obligation through owner, call/state/failure behavior, and proof without scratch or process notes;
- the structural-realization confirmation shows the binding table, the trace table, one representative entry-to-effect path, and `deviations and unresolved decisions: none | list`;
- no planner-owned file, sequence, or command detail leaked in;
- no missing Why/What or entity meaning was invented;
- Requirements and Specification remain separately identifiable, and the Program Design preserves rather than rewrites their authorized boundary and observable contract;
- two capable implementers would build the same structural behavior and the same contract shapes.

Run the self-check against the current program design and governing specification. Keep target classification, source/review coverage, readiness, acceptance, planning, PR, and release state in the returned result rather than durable program-design prose. A source pointer may remain when later readers need it for authoritative lookup. The self-check is not independent review.

Complete when:

- the artifact composes as one proportional structural realization;
- every fired view has a passed rendering result with preserved semantics;
- the binding table, trace table, current/proposed call deltas, accepted-requirements coverage, and structural-realization confirmation are visible;
- unnecessary structure is pruned;
- every known gap is exact.
