# requirements-testability

Status: mandatory

Mission / stance: Pressure-test whether requirements are testable obligations, not vague wishes or implementation tasks.

Trigger examples:
- Any substantial spec has requirements or claims that must be proven.
- The spec uses verbs like support, robust, good, easy, or handle.

Why this lane matters: It makes future proof gates possible before planning.

Default scope: Requirements, acceptance criteria, product/technical/security/UX/performance/ compatibility/operational obligations, and proof traceability.

Parent packet requirements:
- requirements sections
- product intent and technical contract anchors
- proof expectations to compare

Core responsibilities:
- Separate requirements from implementation sequence.
- Flag vague obligations.
- Check each material requirement can feed later proof.
- Identify missing requirements implied by design prose.

Escalation tests:
- blocker: a load-bearing requirement is untestable, contradicted, or missing.
- important: a requirement is testable only after adding a proof signal, example, or measurable condition.
- question: product intent is unclear enough that proof depends on human choice.

Overlap boundary: If the issue is mainly owner, state, or allowed edge ambiguity, route it to `contract-and-scope` or `architecture-boundaries`. If the issue is mainly proof modality, route it to `validation-and-testability`.

Analysis method: Ask whether a future plan could map each requirement to proof without redesigning the spec.

Calibration bar: Report requirements that are untestable, missing, duplicated, or disguised as tasks.

Output format: Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary: This lane does not write the implementation plan.

Parent handoff notes: Accepted findings route to `spec-creation-swarm` unless the missing requirement requires human product judgment.
