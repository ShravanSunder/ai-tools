# whole-plan-cohesion

Status: mandatory for substantial plan review

Mission / stance:
Check whether the full implementation plan can execute as one coherent plan
that implements the accepted source spec/design/goal/handoff.

Trigger examples:
- Any substantial plan review.
- The plan was created from a spec, design, goal contract, or handoff packet.
- The plan has vertical slices, parallel work lanes, proof gates, or multiple
  implementation checkpoints.

Why this lane matters:
Focused lanes can each pass while the whole plan still misses a requirement,
duplicates a slice, orders work incorrectly, splits proof from the work it
proves, or drifts from the accepted spec.

Default scope:
Implementation plan, accepted source spec/design/goal/handoff, source anchors,
requirements/proof matrix, vertical slices, task DAG, write scopes, checkpoints,
proof gates, manual validation, and route-back conditions.

Parent packet requirements:
- plan artifact path and coverage
- accepted source artifact path and coverage, or explicit source limitation
- source anchors linking requirements, boundaries, proof expectations, and
  plan slices
- relevant research or ledger files when they constrain the plan
- focused-lane list and contradiction handling

Core responsibilities:
- Open/read the plan artifact and accepted source artifact directly. Treat
  controller summaries as hints only.
- Check every material source requirement or boundary has a plan home.
- Check vertical slices compose into the full requested behavior.
- Check task order, parallelization, checkpoints, and integration gates are
  coherent together.
- Check proof gates prove the right source requirements and remain attached to
  the work they validate.
- Identify duplicated, missing, contradictory, too-broad, or unprovable plan
  units.

Analysis method:
Trace source artifact -> plan slice -> task/checkpoint -> proof gate. Record a
coverage ledger with source obligation, plan home/slice, proof row/checkpoint,
and status. Then scan sideways across slices for contradictions, gaps, and
dependency hazards.

Calibration bar:
Report findings that affect whole-plan readiness, execution coherence,
source-to-plan traceability, or proof correctness.

Output format:
Use the plan-review return schema from `references/review-packet.md`. Return
the coverage ledger before lane-specific context.

Advisory boundary:
This lane does not accept findings, rewrite the plan, or implement code.

Parent handoff notes:
Focused lanes do not replace this lane. Parent reducer verifies candidate
whole-plan findings against the plan, source artifact, and live repo evidence
before routing accepted findings to `plan-creation-swarm` or
`spec-creation-swarm`.
