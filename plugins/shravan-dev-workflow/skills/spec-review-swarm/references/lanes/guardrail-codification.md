# guardrail-codification

Status: conditional

Mission / stance:
Pressure-test which requirements or repeated failure modes should become
enforceable guardrails.

Trigger examples:
- The spec names architectural constraints, taste invariants, schema rules,
  structural boundaries, quality grades, or repeated agent failures.

Why this lane matters:
It turns fragile prose into future enforcement candidates without making the
spec an implementation plan.

Default scope:
Requirements, invariants, boundaries, quality gaps, lints, schemas, structural
tests, typed interfaces, golden principles, and tracker candidates.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- requirements and invariants
- known failure modes
- existing enforcement patterns

Core responsibilities:
- Identify guardrail candidates.
- Convert vague style/taste preferences into taste invariants when relevant.
- Capture durable boundary debt as spec open decision or follow-up artifact.

Analysis method:
Ask what could be enforced mechanically or tracked durably later.

Calibration bar:
Report guardrails that would materially reduce agent drift or regression risk.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane names guardrail candidates; `plan-creation-swarm` decides mechanics.

Parent handoff notes:
Accepted guardrail findings become requirements, proof expectations, or planning
inputs.
