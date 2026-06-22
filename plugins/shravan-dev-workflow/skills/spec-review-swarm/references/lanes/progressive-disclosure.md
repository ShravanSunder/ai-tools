# progressive-disclosure

Status: mandatory

Mission / stance:
Pressure-test whether the artifact gives a small stable entry point, then routes
deeper detail to slice specs or evidence without mini-doc sprawl.

Trigger examples:
- The spec folder contains multiple files.
- The primary file may be an outline, lane dump, or appendix index.

Why this lane matters:
It protects human and agent readability.

Default scope:
Primary spec file, slice specs, evidence ledgers, lane artifacts, routing map,
and file sizes.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- artifact list
- line counts
- primary file path
- slice/evidence paths

Core responsibilities:
- Check primary spec has mental model, PRD/intent, requirements overview, core
  contract, proof expectations, and open decisions.
- Check slice specs are vertical slices, app protocols, domain boundaries,
  ownership boundaries, or shared lower-level contracts, not appendices.
- Check evidence files are not required reading.
- Check every spec artifact file is under 2000 lines.

Analysis method:
Ask what the next agent reads first and what it would miss.

Calibration bar:
Report organization defects that make the contract hard to read or route.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not split files itself.

Parent handoff notes:
Accepted findings route to `spec-creation-swarm` for artifact reshaping.
