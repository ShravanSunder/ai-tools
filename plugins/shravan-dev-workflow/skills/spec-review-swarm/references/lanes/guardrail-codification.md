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

Evidence priority:
1. Repeated failure modes named in the spec, research, review report, or memory.
2. Requirements that protect future agent behavior.
3. Existing lint/schema/test/quality-doc patterns in the repo.

Analysis method:
Ask what could be enforced mechanically or tracked durably later, then classify
the right guardrail form: lint, schema, structural test, pressure scenario,
quality doc, tracker item, or explicit non-goal.

Prioritized smells / failure signals:
- repeated agent failure left as prose only;
- requirement can be checked mechanically but has no future guardrail route;
- "remember to" instruction guards a high-risk invariant;
- lint/test/schema opportunity is deferred with no reason;
- guardrail would enforce the wrong layer or obsolete source truth.

Calibration bar:
Report guardrails that would materially reduce agent drift or regression risk.

Overlap boundary:
If the issue is mainly requirement clarity, route it to
`requirements-testability`. If it is mainly proof modality, route it to
`validation-and-testability`. If it changes architecture ownership, route it to
`architecture-boundaries`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when evaluating the guardrail requires
implementation, CI changes, repo policy, whole-spec coverage, or source anchors
missing from the focused packet. Use generic unresolved/open output only for
substantive uncertainty after the packet is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: repeated failure, candidate guardrail, owning artifact, smallest next
step, and overfit risk.

Advisory boundary:
This lane names guardrail candidates; `plan-creation-swarm` decides mechanics.

Parent handoff notes:
Accepted guardrail findings become requirements, proof expectations, or planning
inputs.
