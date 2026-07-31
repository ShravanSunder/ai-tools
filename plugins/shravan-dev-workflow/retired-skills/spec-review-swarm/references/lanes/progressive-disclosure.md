# progressive-disclosure

Status: mandatory

Mission / stance: Pressure-test whether the spec artifact is readable as a contract: a stable primary entry point first, deeper vertical-slice/spec files only where they map to real ownership boundaries, and evidence files as optional anchors rather than required reading.

When to run:
- The spec folder contains multiple files.
- The primary file might be an outline, lane dump, index, research summary, or appendix map instead of a spec.
- A file approaches the 2000-line cap or details are split by reading depth instead of concern.

Where to look:
- primary spec file and its table of contents/headings
- slice specs, protocol specs, ownership/domain specs, and lower-level contract files
- evidence ledgers, lane artifacts, research notes, and review reports
- links between primary spec and child files
- line counts for every spec artifact file

How to inspect: Read the primary spec as the next implementation planner would. The first pass should give the mental model, product intent when load-bearing, requirements overview, core contract, boundary map, slice routing, proof expectations, non-goals, and open decisions. Child files should exist because a vertical slice, app protocol, ownership boundary, domain boundary, or shared lower-level contract deserves its own contract surface, not because the author wanted an appendix.

Good signals:
- one obvious file to open first
- the primary file is useful without reading lane evidence
- child files are split by vertical slice or ownership concern
- evidence/research links are absolute or inspectable and optional
- no spec artifact exceeds 2000 lines
- diagrams sit near the contracts they clarify

Bad signals:
- primary file is only a table of contents or research outline
- child files are "requirements appendix", "contracts appendix", "evidence appendix" when the real concern is a vertical slice or protocol
- lane artifacts are required to understand the spec
- mini-file sprawl where each tiny file holds one heading
- detail duplicated across files with no owner
- links point to session chatter instead of durable artifacts

Calibration: Report organization defects that make the contract hard to read, route, or trust. Do not ask for a documentation system; ask for the smallest readable artifact set that preserves the contract.

Overlap boundary: `whole-spec-coverage` owns whether all source obligations are represented. This lane owns whether the representation is loadable and navigable.

Output focus: Use `references/finding-schema.md`. The refinement input should name the file split, merge, routing map, primary-spec content, slice boundary, or evidence demotion needed.
