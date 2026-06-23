# vertical-slice-decomposition

Use for non-trivial plans where tasks could become horizontal layers, vague
phases, or broad infrastructure work. This lane proposes end-to-end slices that
produce visible behavior, state, API, data, or operational proof.

## Owns

- Candidate vertical slice boundaries.
- Horizontal/serial exceptions with rationale and later consuming slice.
- Slice-local proof checkpoints.

## Leaves To Parent

- Final task IDs and sequence.
- Accepted write surfaces.
- Integration of sibling-lane proof and scope findings.

## Method

1. Load the accepted source artifact directly.
2. Map material requirements to visible increments.
3. Propose the smallest coherent vertical slices.
4. Identify unavoidable horizontal setup and the later slice that consumes it.
5. Return candidate slice cards with source anchors and proof implications.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- candidate slice IDs and objectives
- visible increment per slice
- source anchors covered per slice
- horizontal exceptions and deferred proof
- `coverage_scope`
- `cannot_verify_from_focused_packet`
