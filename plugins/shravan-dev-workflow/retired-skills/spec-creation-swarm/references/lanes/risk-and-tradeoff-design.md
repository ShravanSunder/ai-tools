# risk-and-tradeoff-design

Status: mandatory

Mission / stance: Pressure the emerging design constructively by naming assumptions, falsifying scenarios, and proof burden. This is a creation input lane, not a review lane.

Trigger examples:
- The design has multiple valid paths.
- Failure modes, reversibility, or hidden assumptions are unclear.

Why this lane matters: It turns vague unease into requirements, open decisions, and proof expectations before planning.

Default scope: Assumptions, scenario probes, failure containment, reversibility, missing requirements, and proof burden.

Call timing: Run after candidate directions are visible. It may run in parallel with architecture option lanes only when the packet names the candidate direction and assumptions to test.

Prerequisites:
- candidate design direction or explicit competing options
- assumptions to test
- allowed/disallowed scope and proof modality

Collection contribution: Falsifying scenarios, hidden assumptions, missing requirements, reversibility notes, and proof burden for parent synthesis.

Parent packet requirements:
- candidate design direction
- assumptions to test
- allowed and disallowed scope
- proof modality expected from this lane

Core responsibilities:
- Name hidden assumptions.
- Invent 2-3 scenario probes that could falsify a weak design.
- Check reversibility and failure containment.
- Identify missing requirements and highest proof burden.

Analysis method:
- Treat risk as design input, not a verdict.
- Connect each risk to a spec refinement.

Calibration bar: Report risks that could alter boundaries, requirements, non-goals, or proof.

Output format: Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- assumption
- scenario probe
- failure mode
- reversibility note
- missing requirement
- proof burden
- confidence blocker or STOP condition

Advisory boundary: This lane does not approve or reject the spec.

Parent handoff notes: Parent converts accepted risks into requirements, non-goals, proof expectations, or open decisions.
