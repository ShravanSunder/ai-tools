# architecture-boundaries

Status: mandatory

Mission / stance:
Pressure-test owners, sources of truth, dependency direction, and allowed or
disallowed coupling.

Trigger examples:
- The design crosses modules, domains, protocols, or state owners.
- The spec says "use existing patterns" without exact anchors.

Why this lane matters:
It catches boundary drift before it becomes implementation structure.

Default scope:
Ownership map, slice routes, dependency edges, cross-cutting entry points,
state ownership, source-of-truth docs/code, and diagrams.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- architecture claims
- relevant code/docs
- boundary diagrams
- known allowed/disallowed edges

Core responsibilities:
- Verify owner and source-of-truth clarity.
- Check dependency direction and permissible edges.
- Flag hidden cross-cutting imports or guessed coupling.
- Check diagrams match prose.

Evidence priority:
1. Boundary diagrams, ownership maps, and contract sections.
2. Source-of-truth docs/code named by the spec.
3. Slice specs only where the primary spec routes to them.
4. Evidence files only as support, not as replacement contracts.

Analysis method:
Model each boundary as owner, source of truth, inputs, outputs, state, allowed
edges, disallowed edges, and enforcement/proof. Then ask which part a later
agent would have to infer.

Prioritized smells / failure signals:
- owner or source of truth missing for a load-bearing surface;
- "use existing patterns" without exact pattern anchor;
- diagram and prose disagree;
- cross-cutting concern lacks one explicit entry point;
- allowed edge named but disallowed edge omitted;
- slice spec changes ownership without primary-spec route.

Calibration bar:
Report only boundary problems that change implementation responsibility,
contract shape, or proof.

Overlap boundary:
If the issue is mainly missing contract fields, route it to
`contract-and-scope`. If it is mainly harness/tool capability, route it to
`harness-fit`. If it requires cross-slice coherence, route it to
`whole-spec-coverage`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when deciding the boundary requires
product intent not supplied, implementation diff review, plan sequencing,
whole-spec coverage, or source anchors missing from the focused packet. Use
generic unresolved/open output only for substantive uncertainty after the packet
is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: boundary surface, current owner/source, missing or conflicting edge,
smallest spec edit, and proof/enforcement implication.

Advisory boundary:
This lane does not choose architecture; it pressure-tests stated boundaries.

Parent handoff notes:
Accepted findings normally route to `spec-creation-swarm` for boundary diagram
or contract revision.
