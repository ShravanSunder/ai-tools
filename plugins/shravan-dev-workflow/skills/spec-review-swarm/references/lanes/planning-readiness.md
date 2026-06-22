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

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

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

Calibration bar:
Report gaps that would cause the plan to redesign, not minor wording issues.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not create the plan.

Parent handoff notes:
Ready findings route to `plan-creation-swarm`; blockers route back to
`spec-creation-swarm` or `discuss-with-me`.
