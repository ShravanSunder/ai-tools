# whole-spec-coverage

Status: mandatory for substantial spec review

Mission / stance:
Check whether the full spec works as one contract, not only whether focused
sections look reasonable.

Trigger examples:
- Any substantial spec review.
- The spec has multiple files, vertical slices, app protocols, or research lane
  evidence.
- Focused lanes could each pass while the overall contract is incomplete.

Why this lane matters:
It catches cross-lane gaps: product intent that does not trace to requirements,
requirements that do not trace to contracts, slice specs that contradict the
primary spec, proof expectations that miss core obligations, or boundaries that
look clear locally but conflict globally.

Default scope:
Primary spec artifact, slice specs, product intent / PRD, requirements,
technical contract, diagrams, boundaries, non-goals, proof expectations, open
decisions, research ledger, lane evidence, and source anchors.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane
file. This file adds lane-specific constraints only.

Parent packet requirements:
- target spec/design artifact path and coverage
- source anchors and research lane files or ledger entries that constrain the spec
- product intent, requirements, contract, boundary, and proof-expectation anchors
- slice spec or linked artifact inventory when present
- contradiction handling and parent reducer boundary

Core responsibilities:
- Check whether the full spec satisfies the intended product/user outcome.
- Check requirements trace to the technical contract and proof expectations.
- Check boundaries, non-goals, ownership, and invariants are coherent across
  all slices.
- Identify missing global constraints that focused lanes could miss.
- Report contradictions between primary spec, slice specs, research evidence,
  user decisions, and focused-lane findings.

Analysis method:
Read from top-level intent down to requirements, contracts, proof expectations,
and slices. Ask whether a later planning agent could implement the whole spec
without inventing missing cross-slice meaning.

Calibration bar:
Report findings that affect whole-spec readiness, cross-slice coherence,
traceability, or later plan correctness.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`.
Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not decide accepted findings or rewrite the spec.

Parent handoff notes:
Focused lanes do not replace this lane. Parent reducer verifies candidate
whole-spec findings against the target artifact and source anchors before
routing accepted findings to `spec-creation-swarm`, `discuss-with-me`, or an
owner-facing handoff.
