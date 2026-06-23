# planning-readiness

Status: mandatory

Mission / stance:
Pressure-test whether enough decisions exist for `plan-creation-swarm` to plan
without redefining the spec.

Trigger examples:
- A drafted spec is about to feed implementation planning.
- Open decisions may force the plan to invent product, boundary, or proof
  choices.

Why this lane matters:
It protects the spec/plan boundary.

Default scope:
Product intent, requirements, boundary, contracts, proof expectations, open
decisions, non-goals, slice routes, and planning inputs.

Parent packet requirements:
- full artifact coverage
- open decisions
- proof expectations
- scope/non-goals

Core responsibilities:
- Check if plan creation has enough decisions.
- Identify open decisions that block planning.
- Flag implementation sequencing embedded in the spec.
- Route human decisions to outer loop.

Evidence priority:
1. Primary spec requirements, contracts, non-goals, and proof expectations.
2. Open questions and planning-input sections.
3. Slice specs only where routed by the primary spec.

Escalation tests:
- blocker: the plan would have to invent product intent, requirement semantics,
  boundary ownership, proof expectations, or non-goals.
- important: the plan can proceed only after adding a planning input, slice
  route, or explicit open-decision owner.
- question: a decision must go to the outer human loop before planning.

Overlap boundary:
If the issue is only a vague requirement, route it to `requirements-testability`.
If the issue is only a missing owner or edge, route it to `contract-and-scope`
or `architecture-boundaries`.

Analysis method:
Ask what a plan would have to invent and whether that invention belongs in the
spec.

Prioritized smells / failure signals:
- implementation sequence is present but source contract is missing;
- proof expectation deferred without enough requirement detail;
- plan would need to choose product scope;
- open question is hidden in a task-like phrase;
- worker assignment appears in the spec as if it were design truth.

Calibration bar:
Report gaps that would cause the plan to redesign, not minor wording issues.

Cannot-verify boundary:
Mark unresolved when readiness depends on live
implementation feasibility, test runtime, whole-spec coverage, user product
priority outside the spec, or source anchors missing from the focused packet.
Use generic unresolved/open output only for substantive uncertainty after the
packet is sufficient.

Output extras:
Include: invention required from planner, missing source decision, smallest spec
edit, and route-back.

Advisory boundary:
This lane does not create the plan.

Parent handoff notes:
Ready findings route to `plan-creation-swarm`; blockers route back to
`spec-creation-swarm` or `discuss-with-me`.
