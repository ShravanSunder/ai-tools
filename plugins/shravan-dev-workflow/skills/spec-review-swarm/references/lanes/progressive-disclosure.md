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

Evidence priority:
1. Primary spec file.
2. Slice specs or child specs named by the primary routing map.
3. Evidence ledgers and lane files only as optional source trail.
4. File sizes and headings as readability proof.

Analysis method:
Ask what the next agent reads first, what it can understand without hunting,
where it is routed next, and what it would mistakenly treat as required truth.

Prioritized smells / failure signals:
- primary spec is a table of contents, outline, or lane dump;
- evidence file is required to understand the contract;
- appendix-style split replaces vertical-slice or ownership split;
- routing map missing or stale;
- file exceeds the 2000-line cap without a slice reason;
- details are split by reading depth instead of concern boundary.

Calibration bar:
Report organization defects that make the contract hard to read or route.

Overlap boundary:
If the issue is mainly missing contract detail, route it to
`contract-and-scope`. If it is mainly requirements/proof traceability, route it
to `requirements-testability` or `validation-and-testability`. If it is a
global cross-slice contradiction, route it to `whole-spec-coverage`.

Cannot-verify boundary:
Mark unresolved when a split requires product/ownership
decisions, whole-spec coverage, a complete artifact inventory, or source anchors
missing from the focused packet. Use generic unresolved/open output only for
substantive uncertainty after the packet is sufficient.

Output extras:
Include: first-read path, missing routing, evidence-as-contract risk, smallest
artifact reshape, and confidence.

Advisory boundary:
This lane does not split files itself.

Parent handoff notes:
Accepted findings route to `spec-creation-swarm` for artifact reshaping.
