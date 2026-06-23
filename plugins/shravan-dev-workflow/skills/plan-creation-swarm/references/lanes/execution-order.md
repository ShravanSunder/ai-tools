# execution-order

Use when tasks have dependencies, parallelizable work, integration points,
generated artifacts, migrations, or validation gates. This lane proposes the
slice DAG and parent checkpoints.

## Owns

- Candidate execution DAG.
- Dependency edges between slices.
- Parallelization opportunities and collision risks.
- Integration gates and handoff checkpoints.

## Leaves To Parent

- Final accepted task order.
- Write-scope conflict resolution.
- Proof acceptance.

## Method

1. Load the accepted source artifact directly.
2. Use candidate slices or source requirements to identify true dependencies.
3. Inspect likely files, generated outputs, data/state changes, and proof gates
   for collision risks.
4. Separate dependency edges from preferred order.
5. Return a candidate DAG with parent integration gates.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- slice DAG candidates
- parallel lanes and disjoint write assumptions
- integration gates
- validation gates
- contradictions or unknown dependencies
- `coverage_scope`
- `cannot_verify_from_focused_packet`
