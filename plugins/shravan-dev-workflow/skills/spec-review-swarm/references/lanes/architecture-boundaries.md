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

Analysis method:
Ask what boundary could drift and what enforcement or proof would catch it.

Calibration bar:
Report only boundary problems that change implementation responsibility,
contract shape, or proof.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not choose architecture; it pressure-tests stated boundaries.

Parent handoff notes:
Accepted findings normally route to `spec-creation-swarm` for boundary diagram
or contract revision.
