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

Evidence priority:
1. Primary spec file and its full routing map.
2. Slice specs named by the primary spec.
3. Evidence ledgers, lane files, and current repo anchors only as supporting
   evidence, not replacement contracts.
4. Focused lane outputs only as candidate evidence to cross-check.

Analysis method:
Read from top-level intent down to requirements, contracts, proof expectations,
and slices. Ask whether a later planning agent could implement the whole spec
without inventing missing cross-slice meaning.

Prioritized smells / failure signals:
- product intent, requirement, contract, or proof expectation has no matching
  artifact home;
- slice spec changes meaning without a primary-spec route;
- evidence file is required to understand the contract;
- focused lanes are locally ready but contradict each other globally;
- open question is hidden in a confident requirement or contract;
- proof expectations cannot cover all material requirements.

Calibration bar:
Report findings that affect whole-spec readiness, cross-slice coherence,
traceability, or later plan correctness.

Overlap boundary:
Focused lanes own local dimension depth. This lane owns cross-artifact
traceability, sibling-lane contradictions, primary-to-slice routing, and
whole-spec readiness. If a finding is purely local and already covered by one
focused lane, cite that lane instead of duplicating it.

Cannot-verify boundary:
Mark unresolved when whole-spec readiness depends on
implementation feasibility, plan sequencing, human product judgment not present
in the artifact, or source anchors missing from the review packet. Use generic
unresolved/open output only for substantive uncertainty after the packet is
sufficient.

Output extras:
Include trace row, cross-artifact contradiction or gap, smallest spec/slice
edit, affected focused lanes, and route-back.

Advisory boundary:
This lane does not decide accepted findings or rewrite the spec.

Parent handoff notes:
Focused lanes do not replace this lane. Parent reducer verifies candidate
whole-spec findings against the target artifact and source anchors before
routing accepted findings to `spec-creation-swarm`, `discuss-with-me`, or an
owner-facing handoff.
