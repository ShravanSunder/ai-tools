# Program-Design Artifact and Self-Review

This reference owns view selection, artifact navigation, simplification, trace-integrity verification, and author integration self-check. `proof-architecture-and-traceability.md` owns construction of the requirement/design/proof trace; this reference consumes that trace.

Expected inputs: governing specification and inspected snapshot, current/target models, decisions, debt, proof map, and repo documentation conventions.

Return in workflow order: first the artifact structure/view selection, artifact identity, process-level snapshot metadata, verification of the consumed requirement/design/proof trace, and pruned elements; after the caller runs the complete integration self-check stage, return the snapshot-bound self-check gaps. Keep snapshot metadata in the workflow result; do not add it to the program-design prose.

## Select Views by Need

Use only views that expose a load-bearing relationship:

- component tree for ownership/composition;
- source-anchored sequence/call graph for cross-owner or async control, normalized from current call-stack/call-path evidence rather than copied as a raw stack trace;
- proof call graph when harness boundaries differ;
- state machine/table for lifecycle/order;
- data/event flow for authority/transformation;
- failure/recovery flow for partial failure/retry;
- trust-boundary view for untrusted actors/input/secrets/processes;
- requirement/design/proof trace when relationships are non-obvious.

Diagrams do not replace behavioral interface or failure prose. Paths may anchor current evidence; do not turn the design into a future file/task list.

## Render for the Destination

- Prefer Mermaid for durable Markdown when the repository renders it.
- Use `tui-presentation` for chat or terminal explanation.
- Use a table when dense ownership, states, transitions, or comparisons matter more than topology or time.
- Use readable plain text when no renderer exists.

For a substantial design, lead with the integrated component/ownership view and render each additional view whose predicate fired. Show a representative call or flow view when control crosses owners or async boundaries. The view must preserve the semantic fields selected by the caller; format never excuses a missing owner, edge, state, result/error path, or evidence anchor.

Good: the smallest set of views lets a reader simulate composition, execution, and the riskiest failure.

Bad: prose labeled as a diagram, decorative boxes with no semantic owners, every possible view emitted mechanically, or Mermaid/TUI syntax chosen before the relationship is understood.

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

Bind the self-check to both inspected artifact snapshots in process state. It is not independent review.

Complete when: the artifact composes as one executable mental model, unnecessary structure is pruned, and every known gap is exact.
