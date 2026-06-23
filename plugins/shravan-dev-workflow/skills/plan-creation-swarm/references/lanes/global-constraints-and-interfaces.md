# global-constraints-and-interfaces

Use when the accepted source contains constraints, interfaces, ownership rules,
dependency directions, naming rules, generated artifacts, schemas, or cross-slice
contracts that implementation tasks must inherit verbatim.

## Owns

- Binding global constraints copied from the accepted source.
- Cross-slice interfaces and integration seams.
- Exact values, formats, dependency limits, platform constraints, and other
  executor-critical rules.

## Leaves To Parent

- Final grouping inside the plan.
- Whether a missing constraint routes to spec creation.
- Slice decomposition and task ordering.

## Method

1. Load the accepted source artifact directly.
2. Extract exact binding text for constraints and interfaces.
3. Inspect current repo files only to identify where those constraints attach.
4. Flag inferred constraints that need source confirmation.
5. Return candidate global-constraint and interface rows with source anchors.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- exact binding excerpts
- global constraint rows
- cross-slice interface rows
- contradictions with repo reality
- assumptions that require parent or spec revision
- `coverage_scope`
- `cannot_verify_from_focused_packet`
