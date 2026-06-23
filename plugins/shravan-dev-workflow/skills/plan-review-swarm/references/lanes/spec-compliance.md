# spec-compliance

Status: default focused lane for substantial plan review.

Mission / stance:
Disprove that the produced plan faithfully implements the accepted source
artifact. This lane looks for dropped source obligations, invented authority,
softened non-goals, and source questions smuggled into implementation choices.

Trigger examples:
- The plan claims it implements an accepted spec, design, goal, or handoff.
- The plan contains a requirements/proof matrix, source references, non-goals,
  route-back notes, or deferrals.
- The user is worried reviewers may look only at the plan.

Why this lane matters:
A plan can look executable while quietly omitting a requirement, weakening a
boundary, or adding work the accepted source never authorized.

Default scope:
Accepted source artifact, produced plan, requirements/proof matrix, non-goals,
constraints, route-back notes, and any plan sections that claim source coverage.

Parent packet requirements:
- accepted source artifact path and coverage
- produced plan path and coverage
- compact source-to-plan binding excerpts
- source non-goals and open source decisions
- parent routing summary marked as non-evidence

Evidence priority:
1. Accepted source artifact text.
2. Produced plan text.
3. Current repo evidence only where the plan cites it or the source requires it.
4. Parent summaries only as routing context, never as proof.

Analysis method:
Walk each material source obligation, boundary, non-goal, and proof expectation
to its plan home. Mark it as implemented by a plan slice, mapped to a matrix
row, explicitly deferred with source authority, or missing.

Prioritized smells / failure signals:
- source requirement has no plan home;
- plan adds an obligation with no source authority;
- source non-goal is softened or ignored;
- unresolved source question becomes an implementation task;
- proof expectation is detached from the source requirement it claims to prove;
- route-back points to implementation when the source boundary is missing.

Escalation / materiality bar:
- blocker: a load-bearing source obligation or boundary is dropped, contradicted,
  or invented.
- important: source coverage exists but is too vague for implementation without
  guessing.
- question: source intent is ambiguous and must be resolved before planning can
  be judged.

Overlap boundary:
If the issue is whole-plan slice composition or cross-slice duplication, route
it to `whole-plan-cohesion`. If the issue is module ownership or dependency
direction, route it to `architecture-assumptions`. If the issue is proof quality
only, route it to `testability-validation`.

Cannot-verify boundary:
Mark unresolved for whole-plan readiness, cross-slice
ordering, or complete proof-ladder adequacy. Name the exact source anchors that
the whole-plan lane must inspect.

Output extras:
In addition to the plan-review return schema, include a source-to-plan row:
source obligation -> plan home | missing | invented | deferred, with source
anchor, failure scenario, smallest plan edit, and confidence.

Advisory boundary:
This lane returns candidate findings only. Parent verification decides accepted
findings and route-back.

Parent handoff notes:
Parent-accepted missing or invented source obligations route to
`plan-creation-swarm`. Parent-accepted source-boundary defects route to
`spec-creation-swarm` first, then back to `plan-creation-swarm`.
