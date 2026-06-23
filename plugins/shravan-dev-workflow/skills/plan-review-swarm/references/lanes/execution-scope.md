# execution-scope

Status: default focused lane for substantial plan review.

Mission / stance:
Check whether implementation workers can execute the plan without ambiguous
scope, unsafe ordering, hidden expansion, or unclear stop criteria.

Trigger examples:
- The plan contains execution DAGs, slice cards, worker packets, write scopes,
  integration gates, route-back rules, or validation commands.
- Work is parallelized across subagents.
- The plan says "update related files", "fix any fallout", or "validate later".

Why this lane matters:
Even a correct design fails in execution when workers share write surfaces,
depend on unordered prerequisites, or receive task packets that require guessing.

Default scope:
Produced plan, accepted source artifact, execution DAG, slice cards, write
scopes, disallowed edits, integration gates, route-back rules, worker packets,
and validation commands.

Parent packet requirements:
- accepted source artifact path and relevant execution constraints
- produced plan path and execution-flow anchors
- allowed write scopes and disallowed edits
- route-back conditions and integration gates
- parent routing summary marked as non-evidence

Evidence priority:
1. Produced plan execution DAG, slice cards, and worker packet text.
2. Accepted source constraints that affect order or scope.
3. Current repo file ownership and write surfaces named by the plan.
4. Supporting test/tool docs only when they affect stop criteria.

Analysis method:
Simulate execution: worker receives packet -> edits allowed files -> reaches
integration gate -> runs proof -> route-back decision. Look for the first point
where ambiguity, shared write surface, or missing stop criteria would cause
churn.

Prioritized smells / failure signals:
- broad write scope or unnamed "related files";
- parallel slices touch the same files without sequencing;
- integration gate appears after a dependent slice;
- worker packet lacks source anchors or proof obligations;
- route-back conditions collapse spec, plan, implementation, and review issues;
- validation gate has no failure meaning or next action;
- task size too large to prove inside the slice.

Escalation / materiality bar:
- blocker: execution order or write scope can cause conflicting edits, data loss,
  or implementation from an unresolved source/plan decision.
- important: task is executable only if a future worker infers missing packet
  details.
- question: user decision is needed to choose a cutover or scope boundary.

Overlap boundary:
If the issue is source obligation coverage, route to `spec-compliance`. If it
is proof adequacy, route to `testability-validation`. If it is whole-plan slice
composition, route to `whole-plan-cohesion`.

Cannot-verify boundary:
Return `cannot_verify_from_focused_packet` for final readiness, implementation
diff correctness, or whole-plan composition.

Output extras:
Include an execution row: plan slice -> write scope -> dependency -> gate ->
failure mode -> smallest plan edit.

Advisory boundary:
This lane does not execute the plan or modify worker packets. It returns
candidate execution-scope findings.

Parent handoff notes:
Parent-accepted execution findings route to `plan-creation-swarm`. If the plan
cannot be made executable without changing source boundaries, route to
`spec-creation-swarm`.
