# validation-and-testability

Status: mandatory

Mission / stance:
Pressure-test whether proof expectations can feed a later requirements/proof
matrix.

Trigger examples:
- Any substantial spec will become an implementation plan.
- The spec claims behavior without naming proof modality.

Why this lane matters:
It keeps validation from being invented too late in planning.

Default scope:
Proof expectations, tests, manual UX/visual proof, data/DB/state checks, logs,
traces, metrics, smoke/e2e/CI/PR/release proof, and not-applicable rationale.

Parent packet requirements:
- requirements
- proof expectations
- validation constraints
- relevant existing tests/harnesses

Core responsibilities:
- Check requirement-to-proof trace.
- Flag unverifiable requirements.
- Ensure proof modalities are named without exact command sequencing.
- Identify missing higher-layer proof when ready-to-use behavior is implied.

Analysis method:
Ask whether `plan-creation-swarm` could build a proof matrix without redefining
the spec.

Calibration bar:
Report missing proof modality, stale proof assumptions, or proof layer mismatch.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not choose exact commands or execution sequence.

Parent handoff notes:
Accepted proof findings route to spec creation; plan creation operationalizes
them later.
