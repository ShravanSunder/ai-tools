# planning-readiness

Status: mandatory

Mission / stance: Pressure-test whether enough decisions exist for `plan-creation-swarm` to turn the spec into implementation units without redefining product intent, requirements, boundaries, or proof expectations.

When to run:
- A drafted spec is about to feed implementation planning.
- The spec includes open decisions, alternatives, unclear scope, or vague proof.
- The spec contains task sequencing, worker assignments, or plan language that belongs in the plan.

Where to look:
- product intent, requirements, non-goals, and success criteria
- technical contract, ownership boundaries, diagrams, and slice routes
- proof expectations and required evidence types
- open decisions and planning inputs
- research ledgers or review findings that constrain planning

How to inspect: Pretend you are creating the plan, but do not create it. For each material requirement or boundary, ask what the plan would need to know:
- What is the implementation unit or vertical slice?
- Which files or systems are likely touched?
- What proof would show the requirement works?
- What dependencies or gates are implied?
- What decision would the planner have to invent?

If the planner would need to choose product meaning, boundary ownership, contract semantics, proof expectations, or non-goals, the spec is not ready. If the planner only needs to choose task order, write scopes, exact commands, or parallelization, that belongs in plan creation and is fine.

Good signals:
- requirements are stable enough to map to work units
- proof expectations are declarative and source-anchored
- open decisions are explicitly marked as blocking or non-blocking
- slice routes indicate where deeper contracts live
- the spec does not prescribe implementation sequencing

Bad signals:
- the plan would need to decide what success means
- proof is deferred as "test appropriately" with no modality or requirement
- task order appears in the spec as if it were design truth
- non-goals are missing for obvious expansion paths
- source artifacts are summarized but not anchored

Calibration: Report gaps that would cause the plan to redesign, invent, or silently narrow the spec. Do not report minor wording issues that do not affect planning.

Overlap boundary: `contract-and-scope` owns missing contract fields. `requirements-testability` owns vague obligations. This lane owns the handoff boundary from spec to plan.

Output focus: Use `references/finding-schema.md`. The refinement input should name the specific decision, planning input, source anchor, slice route, or proof expectation required before plan creation.
