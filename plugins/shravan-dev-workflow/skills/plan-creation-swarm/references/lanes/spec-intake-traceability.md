# spec-intake-traceability

Use when turning an accepted spec, design, product requirement, or goal contract
into a plan. This lane verifies that planning starts from source truth, not from
chat memory or a parent summary.

## Owns

- Accepted source artifact coverage, freshness, and drift checks.
- Missing requirements, boundaries, non-goals, proof expectations, or planning
  inputs that block safe planning.
- Source anchors that every plan slice must cite.

## Leaves To Parent

- Final plan wording.
- Whether missing source material routes to `spec-creation-swarm` or human
  decision.
- Acceptance of candidate source anchors.

## Method

1. Load the accepted spec/design/goal artifact directly.
2. Record line count, chunk coverage, version/date/commit when available.
3. Identify product intent, requirements, technical contract, global
   constraints, proof expectations, non-goals, and open questions.
4. Compare source claims to cheap live repo evidence when drift is plausible.
5. Return source coverage, blockers, and candidate anchors for the plan.

## Return Focus

- `primary_sources_loaded`
- `supporting_evidence_checked`
- `source_truth_distinction_checked`
- source coverage and omitted sections
- drift or contradiction
- missing planning inputs
- candidate source anchors for slice cards and matrix rows
- `coverage_scope`
- `cannot_verify_from_focused_packet`
