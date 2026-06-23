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

Parent packet requirements:
- implementation/prototype evidence
- spec sections to compare
- known accepted/rejected behavior

Core responsibilities:
- Identify hidden implementation decisions missing from the spec.
- Distinguish by-design behavior from accidental implementation detail.
- Phrase differences as missing decisions, constraints, examples, or proof.

Analysis method:
Compare behavior to spec claims; do not treat current code as final authority.

Calibration bar:
Report differences that would cause a reimplementation-from-spec to diverge.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not decide whether current behavior should be preserved.

Parent handoff notes:
Human judgment may be needed when current behavior and desired contract conflict.
