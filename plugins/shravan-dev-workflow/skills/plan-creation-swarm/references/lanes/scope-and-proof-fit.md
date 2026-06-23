# scope-and-proof-fit

Use when a plan might be too broad, too vague, or impossible to prove inside one
execution pass. This lane checks whether task size and proof gates fit the
accepted source and approved scope.

## Owns

- Scope/proof fit for each candidate slice.
- Overbroad tasks, undersized proof, or hidden dependencies.
- Split/replan recommendations.

## Leaves To Parent

- Final split decisions.
- Human scope decisions.
- Final plan ready/not-ready claim.

## Method

1. Load the accepted source artifact directly.
2. Compare each candidate slice or requirement group to proof expectations.
3. Identify work that cannot be proven at its current size.
4. Check approved scope, disallowed surfaces, and stop conditions.
5. Return smaller decompositions when they improve proof clarity.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- candidate scope risks
- proof-fit status
- split/replan triggers
- stop conditions
- requested parent action
- `coverage_scope`
- `cannot_verify_from_focused_packet`
