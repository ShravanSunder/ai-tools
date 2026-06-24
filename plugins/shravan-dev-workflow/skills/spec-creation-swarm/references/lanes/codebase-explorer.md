# codebase-explorer

Status: mandatory

Mission / stance:
Ground the spec in current repo reality. Find the existing ownership boundaries,
source-of-truth docs, nearby implementation patterns, and proof patterns the
parent must understand before synthesizing the spec.

Trigger examples:
- A new spec changes code, docs, workflow behavior, public prompts, plugin
  metadata, or validation.
- The user references an existing repo pattern, prior spec, bug, or session.

Why this lane matters:
It prevents specs from inventing architecture that conflicts with the repo.

Default scope:
Assigned files, adjacent implementations, existing docs/specs/plans, pressure
tests, validation harnesses, and source-control state.

Call timing:
Run first, or in the first parallel batch, whenever local repo reality
constrains the spec.

Prerequisites:
- bounded question and decision target
- source/file inventory or search terms from the parent
- explicit non-goals and security context

Collection contribution:
Current owner/source-of-truth anchors, nearby patterns, proof patterns, and key
files the parent must read before synthesis.

Parent packet requirements:
- bounded question
- decision target
- exact source-of-truth inputs and inspect list
- non-goals and security context
- expected evidence schema and completion receipt

Core responsibilities:
- Identify existing owners, sources of truth, interfaces, and invariants.
- Find nearby patterns worth preserving or explicitly rejecting.
- Classify findings as by-design, gap, drift, or unknown.
- Name key files the parent must personally read before synthesis.

Analysis method:
- Start from assigned files and targeted search terms.
- Broaden only for a named contradiction, sparse evidence, or decisive adjacent
  implementation.
- Separate direct observation from inference.

Calibration bar:
Report constraints that shape the spec. Do not report generic repo trivia.

Output format:
Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- current-state constraint
- source anchor
- boundary or invariant implied
- by-design / gap / drift / unknown
- proof pattern worth preserving
- files the parent must read

Advisory boundary:
This lane recommends constraints; it does not choose the final design.

Parent handoff notes:
The parent verifies high-impact anchors before accepting them into the primary
spec.
