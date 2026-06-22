# architecture-pragmatic

Status: mandatory

Mission / stance:
Argue for the most shippable balanced design without hiding accepted debt.

Trigger examples:
- Minimal is too weak, but clean-boundary may be too costly.
- A near-term delivery path must preserve future refinement.

Why this lane matters:
It keeps the spec honest about compromises and follow-up boundaries.

Default scope:
Acceptable compromises, operational simplicity, debt, proof, and revisit
triggers.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- desired outcome
- cost constraints
- proof expectations
- non-goals and accepted risk vocabulary

Core responsibilities:
- Identify the smallest acceptable compromise.
- Name operational simplicity gained.
- Name technical debt accepted.
- Name what must be revisited later.
- Name when the pragmatic stance becomes irresponsible.

Lane-exclusive checks:
- What compromise is accepted because it reduces delivery or proof cost?
- What behavior, metric, failure, or usage growth should trigger revisiting it?
- Which clean-boundary concern is intentionally deferred, and where is it recorded?
- What proof still demonstrates the compromise did not leak into user behavior?

Return unresolved instead of recommending when the compromise cannot name its
revisit trigger, proof burden, or accepted debt.

Analysis method:
- Compare delivery cost against boundary and proof risk.
- Turn debt into named open decisions or guardrail candidates.

Calibration bar:
Report compromises only when they would change requirements, boundaries, proof,
or follow-up tracking.

Output format:
Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- boundary/ownership sketch
- use-flow example
- hidden complexity
- dependency strategy
- tradeoffs
- explicitly not solving

Advisory boundary:
This lane does not bury debt in final wording; parent decides whether to accept
or reject it.

Parent handoff notes:
Accepted pragmatic debt should appear as non-goal, open decision, or tracker
candidate.
