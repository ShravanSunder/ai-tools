# whole-plan-coverage

Status: focused creation lane for source-to-plan coverage during drafting.

Mission / stance:
Keep the working plan from dropping, inventing, or misplacing accepted source
obligations while the plan is being created. This lane helps draft coverage; it
does not replace `plan-review-swarm`'s later `whole-plan-cohesion` review.

Trigger examples:
- Planning is high-risk, multi-slice, multi-artifact, or coverage-sensitive.
- The parent has a working plan draft, slice map, or requirements/proof matrix.
- Source obligations span product intent, requirements, boundaries, non-goals,
  global constraints, proof expectations, and open planning inputs.

Why this lane matters:
Creation can drift before review ever starts. A lightweight whole-plan coverage
pass catches missing or invented obligations while the parent can still reshape
the draft cheaply.

Default scope:
Accepted source artifact, working plan draft, slice map, requirement/proof
matrix, parent plan package, ticket/slice inventory, checkpoints,
spec-return items, human-decision items, non-goals, global constraints, and
proof expectations.

Parent packet requirements:
- accepted source artifact and source map;
- working plan draft, slice map, or parent outline if one exists;
- parent plan package or ticket/slice inventory when the plan is split across
  large vertical artifacts;
- known source route-backs and human decisions;
- sibling lane outputs that propose slices, proof rows, or constraints.

Evidence priority:
1. Accepted source artifact and working plan draft.
2. Source map, slice map, matrix rows, checkpoints, and route-back items.
3. Sibling lane outputs as candidate coverage evidence.
4. Parent summary only as draft context.

Analysis method:
Trace each material source item to a plan home: slice, matrix row, proof gate,
global constraint, checkpoint, route-back, or human-decision item. Then scan the
plan for invented obligations that do not trace to source or verified repo
constraints. When the plan is a package, check the parent matrix against the
full ticket set so coverage does not disappear inside a slice file.

Prioritized smells / failure signals:
- source requirement has no slice, proof row, checkpoint, or route-back;
- source requirement appears in a ticket but is absent from the parent coverage
  matrix or plan-set checkpoint;
- ticket has a proof command but no source requirement, expected signal, or
  valuable-proof rationale;
- plan adds scope not present in source or repo evidence;
- source non-goal is contradicted by a task;
- proof expectation is detached from the source item it proves;
- open source decision is hidden inside a task;
- sibling lane output is accepted without source trace.

Escalation / materiality bar:
- blocker: material source obligation is dropped, contradicted, or replaced by
  invented scope.
- important: obligation exists in the plan but lacks source anchor, plan home,
  or proof attachment.
- question: source item needs human/spec decision before coverage can be judged.

Overlap boundary:
This lane is creation-side coverage. Later `plan-review-swarm` owns independent
whole-plan cohesion against the finished plan. Use `spec-intake-traceability`
for initial source map and `validation-proof` for proof detail.

Cannot-verify boundary:
Mark unresolved when the plan draft is absent, source coverage depends on
missing anchors, or judging coverage requires a human source decision.

Output extras:
Return source item -> current plan home -> missing/invented/deferred status ->
parent matrix/ticket coverage status -> smallest draft edit -> route-back or
human decision.

Advisory boundary:
This lane does not declare the plan ready. It helps the parent keep the draft
source-faithful before review.

Parent handoff notes:
Accepted coverage gaps become plan edits or source route-backs before plan
review.
