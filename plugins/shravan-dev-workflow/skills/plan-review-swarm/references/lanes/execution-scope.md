# execution-scope

Status: default focused lane for substantial plan review.

Mission / stance:
Check whether the plan can be executed by an implementation worker without
ambiguous scope, unsafe ordering, or hidden expansion.

Default scope:
Produced plan, accepted source artifact, execution DAG, slice cards, write
scopes, disallowed edits, integration gates, route-back rules, worker packets,
and validation commands.

Core responsibilities:
- Verify task order and parallelization are dependency-safe.
- Verify every worker packet has exact allowed write scope and disallowed edit
  boundaries.
- Identify overbroad, under-specified, or conflicting implementation tasks.
- Verify integration gates occur before dependent slices.
- Verify route-back rules distinguish ready, plan findings, and
  source-boundary findings.
- Return `cannot_verify_from_focused_packet` for whole-plan coherence questions
  that require `whole-plan-cohesion`.

Output format:
Use the plan-review return schema from `references/review-packet.md`, including
the full completion receipt fields. Return candidate findings only.
