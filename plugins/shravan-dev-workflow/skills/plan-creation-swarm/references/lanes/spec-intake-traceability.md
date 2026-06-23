# spec-intake-traceability

Status: mandatory first lane when planning from a spec, design, requirement, or
goal contract.

Mission / stance:
Make planning start from source truth, not chat memory or a parent summary. This
lane loads the accepted artifact, finds the material obligations, and gives the
parent anchors that every plan slice must trace back to.

Trigger examples:
- Any plan is being created from an accepted spec, design, goal, PRD, or
  handoff.
- The source artifact has product intent, requirements, technical contract,
  non-goals, proof expectations, or open planning inputs.
- The parent summary may have compressed or rephrased source obligations.

Why this lane matters:
A plan can look detailed while silently dropping the actual spec. Source
anchors keep the plan honest and make later review possible.

Default scope:
Accepted source artifact, version/date/commit when available, product intent,
requirements, boundaries, non-goals, global constraints, proof expectations,
open questions, and drift-prone repo references.

Parent packet requirements:
- accepted source artifact path;
- repo root, current branch/worktree, and relevant commit/version context;
- any parent summary explicitly marked as non-evidence;
- draft plan path if a working plan already exists.

Evidence priority:
1. Accepted source artifact, loaded directly and completely enough for scope.
2. Source anchors for each material requirement, boundary, non-goal, and proof
   expectation.
3. Cheap live repo evidence only when source references may be stale.
4. Parent memory or chat only as routing context.

Analysis method:
Build a compact source map: product intent, material requirements, boundaries,
non-goals, proof expectations, planning inputs, and open decisions. For each
item, record the source anchor and whether planning can proceed, needs repo
verification, or must route back.

Prioritized smells / failure signals:
- plan starts from a summary while accepted source is not loaded;
- product intent or non-goal disappears before slices are drafted;
- proof expectation is present in source but absent from planning anchors;
- repo reference in source is likely stale and not checked;
- open source decision is converted into an implementation task;
- two source sections imply different obligations without parent resolution.

Escalation / materiality bar:
- blocker: source artifact is missing, stale, unreadable, or lacks a decision
  required before planning.
- important: planning can proceed but needs explicit anchors, drift checks, or
  route-back rows.
- question: accepted source has unresolved product or boundary ambiguity.

Overlap boundary:
Use sibling lanes to design slices, proof, ordering, and boundaries. This lane
owns source loading, source map, trace anchors, and source-vs-summary fidelity.

Cannot-verify boundary:
Mark unresolved when source validity depends on external state, missing files,
or human acceptance of the source artifact.

Output extras:
Return source item -> anchor -> planning consequence -> required slice/proof
trace -> drift check or route-back.

Advisory boundary:
This lane does not draft the whole plan. It provides the source map the parent
uses to draft and reduce the plan.

Parent handoff notes:
Accepted source gaps route to spec creation or human decision before the plan is
treated as ready.
