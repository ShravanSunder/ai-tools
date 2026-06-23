# spec-difference

Status: conditional

Mission / stance:
Use current implementation, prototype, session logs, traces, or behavior as
boundary-discovery material. Find hidden decisions absent from the spec.

Trigger examples:
- A working prototype or current implementation exists.
- The spec was distilled from code or prior session behavior.

Why this lane matters:
It turns implementation-derived knowledge into reproducible spec contracts.

Default scope:
Existing code, prototypes, traces, logs, session artifacts, generated outputs,
or observed behavior assigned by the parent.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- implementation/prototype evidence
- spec sections to compare
- known accepted/rejected behavior

Core responsibilities:
- Identify hidden implementation decisions missing from the spec.
- Distinguish by-design behavior from accidental implementation detail.
- Phrase differences as missing decisions, constraints, examples, or proof.

Evidence priority:
1. Current implementation, prototype, traces, logs, or session behavior named by
   the parent packet.
2. Spec claims that should reproduce or intentionally change that behavior.
3. Tests/docs only where they distinguish intentional from accidental behavior.

Analysis method:
Compare behavior to spec claims; do not treat current code as final authority.
Classify each difference as intentional contract, accidental behavior, open
decision, or out-of-scope.

Prioritized smells / failure signals:
- implementation behavior required for success but absent from spec;
- spec contradicts current behavior without naming migration intent;
- prototype convenience copied as contract without rationale;
- test encodes hidden requirement not visible in spec;
- difference review tries to bless implementation wholesale.

Calibration bar:
Report differences that would cause a reimplementation-from-spec to diverge.

Overlap boundary:
If the difference is mainly a missing contract field, route it to
`contract-and-scope`. If it is mainly boundary ownership, route it to
`architecture-boundaries`. If it requires whole-spec traceability, route it to
`whole-spec-coverage`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when behavior cannot be observed from
provided anchors, requires executing the system outside review scope, needs
whole-spec coverage, or depends on source anchors missing from the focused
packet. Use generic unresolved/open output only for substantive uncertainty
after the packet is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: observed behavior, spec claim, hidden decision, keep/change/drop
recommendation, and proof route.

Advisory boundary:
This lane does not decide whether current behavior should be preserved.

Parent handoff notes:
Human judgment may be needed when current behavior and desired contract conflict.
