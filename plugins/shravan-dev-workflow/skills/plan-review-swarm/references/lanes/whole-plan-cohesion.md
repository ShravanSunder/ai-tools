# whole-plan-cohesion

Status: mandatory for substantial plan review.

Mission / stance:
Check whether the full produced plan implements the full accepted source
artifact as one coherent executable plan.

Trigger examples:
- Any substantial plan review.
- The plan was created from a spec, design, goal contract, or handoff packet.
- The plan has vertical slices, parallel work lanes, proof gates, or multiple
  implementation checkpoints.

Why this lane matters:
Focused lanes can each pass while the whole plan still misses a requirement,
duplicates a slice, orders work incorrectly, splits proof from the work it
proves, or drifts from the accepted source artifact.

Default scope:
Accepted source artifact, produced plan, source anchors,
requirements/proof matrix, vertical slices, task DAG, write scopes, checkpoints,
proof gates, manual validation, and route-back conditions.

Parent packet requirements:
- accepted source artifact path and coverage
- produced plan path and coverage
- compact binding excerpts from both artifacts
- parent routing summary marked as non-evidence
- supporting evidence checked separately from source truth
- source anchors linking requirements, boundaries, proof expectations, slices,
  and proof rows
- focused-lane list and contradiction handling

Core responsibilities:
- Check every material source requirement or boundary has a plan home.
- Check vertical slices compose into the full requested behavior.
- Check task order, parallelization, checkpoints, and integration gates are
  coherent together.
- Check proof gates prove the right source requirements and remain attached to
  the work they validate.
- Check each large ticket or plan section has a proof rubric that fits its
  requirement/risk rather than inheriting a generic pyramid checklist.
- Identify duplicated, missing, contradictory, too-broad, or unprovable plan
  units.

Evidence priority:
1. Accepted source artifact and full produced plan.
2. Requirements/proof matrix, vertical slices, DAG, checkpoints, and proof gates.
3. Supporting repo evidence only where source or plan claims depend on it.
4. Focused lane outputs only as candidate evidence to cross-check.

Analysis method:
Trace source artifact -> plan slice -> task/checkpoint -> proof gate. Then scan
sideways across slices for contradictions, gaps, dependency hazards, and proof
rubrics that are either missing, duplicated mechanically, or detached from the
section they claim to validate.

Prioritized smells / failure signals:
- source obligation appears in no slice, matrix row, checkpoint, or proof gate;
- two slices duplicate ownership or write surface;
- proof gate validates a different claim than the slice implements;
- proof rubric is absent for a material slice or is copied generically across
  slices without requirement/risk-specific value;
- parent plan package lacks a coverage matrix showing how ticket/slice proof
  rows cover the whole accepted source;
- parallel work depends on unresolved serial order;
- accepted source non-goal is violated by the plan as a whole;
- focused lanes are locally ready but their assumptions conflict.

Calibration bar:
Report candidate findings that affect whole-plan readiness, execution
coherence, source-to-plan traceability, or proof correctness.

Overlap boundary:
Focused lanes own local dimension depth. This lane owns accepted-source to
produced-plan coverage, cross-slice composition, dependency hazards, conflicting
focused-lane assumptions, and whole-plan readiness. If a finding is purely local
and already covered by one focused lane, cite that lane instead of duplicating
it.

Cannot-verify boundary:
Return unresolved when a finding requires implementation diff review, live
runtime proof, or a source decision absent from the accepted artifact.

Output extras:
Include source-to-plan trace row, cross-slice issue, smallest plan edit, and
focused lanes that should re-check the fix. For proof issues, include the
affected requirement/section, missing or mismatched proof-rubric field, and why
the gap affects whole-plan readiness.

Advisory boundary:
This lane returns candidate findings only. It does not accept findings, rewrite
the plan, or implement code.

Parent handoff notes:
Ready routes to `implementation-execute-plan`. Parent-accepted plan findings
route to `plan-creation-swarm`. Parent-accepted source-boundary findings route
to `spec-creation-swarm`, then back to `plan-creation-swarm`.
