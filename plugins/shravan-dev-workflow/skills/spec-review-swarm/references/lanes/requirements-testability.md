# requirements-testability

Status: mandatory

Mission / stance:
Pressure-test whether requirements are testable obligations, not vague wishes
or implementation tasks.

Trigger examples:
- Any substantial spec has requirements or claims that must be proven.
- The spec uses verbs like support, robust, good, easy, or handle.

Why this lane matters:
It makes future proof gates possible before planning.

Default scope:
Requirements, acceptance criteria, product/technical/security/UX/performance/
compatibility/operational obligations, and proof traceability.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- requirements sections
- product intent and technical contract anchors
- proof expectations to compare

Core responsibilities:
- Separate requirements from implementation sequence.
- Flag vague obligations.
- Check each material requirement can feed later proof.
- Identify missing requirements implied by design prose.

Evidence priority:
1. Requirements and acceptance criteria.
2. Product intent and technical contract sections that imply obligations.
3. Proof expectations only after the requirement itself is clear.

Escalation tests:
- blocker: a load-bearing requirement is untestable, contradicted, or missing.
- important: a requirement is testable only after adding a proof signal,
  example, or measurable condition.
- question: product intent is unclear enough that proof depends on human choice.

Overlap boundary:
If the issue is mainly owner, state, or allowed edge ambiguity, route it to
`contract-and-scope` or `architecture-boundaries`. If the issue is mainly proof
modality, route it to `validation-and-testability`.

Analysis method:
Ask whether a future plan could map each requirement to proof without
redesigning the spec.

Prioritized smells / failure signals:
- vague verbs such as support, robust, easy, good, handle, or seamless;
- requirement is actually an implementation step;
- proof signal depends on unstated state, data, UI, metric, or log;
- requirement duplicated with different wording;
- design prose implies an obligation absent from requirements.

Calibration bar:
Report requirements that are untestable, missing, duplicated, or disguised as
tasks.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when the obligation needs product
choice, current behavior measurement, plan-level validation detail,
whole-spec coverage, or source anchors missing from the focused packet. Use
generic unresolved/open output only for substantive uncertainty after the packet
is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: requirement text, missing measurable condition, implied proof signal,
smallest requirement edit, and confidence.

Advisory boundary:
This lane does not write the implementation plan.

Parent handoff notes:
Accepted findings route to `spec-creation-swarm` unless the missing requirement
requires human product judgment.
