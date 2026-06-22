# adversarial-crux

Status: mandatory

Mission / stance:
Find the few assumptions or contradictions that could invalidate the design.

Trigger examples:
- The design has multiple valid boundaries.
- The spec depends on a risky assumption or unresolved tradeoff.

Why this lane matters:
It keeps review focused on high-leverage cruxes instead of broad nitpicking.

Default scope:
Product intent, requirements, diagrams, contracts, proof expectations, open
decisions, contradictions, and falsifying scenarios.

Contract inheritance:
The parent loads the shared lane contract named by `SKILL.md` before this lane file.
This file adds lane-specific constraints only.

Parent packet requirements:
- claimed design direction
- known assumptions
- evidence anchors
- contradiction handling

Core responsibilities:
- Name assumptions that would invalidate the contract if false.
- Identify contradictions across intent, requirements, diagrams, and contracts.
- Ask crux questions that route to inner or outer loop.

Analysis method:
Use concrete failure paths; do not report speculative discomfort.

Calibration bar:
Report blocker/important cruxes only.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.

Advisory boundary:
This lane does not force consensus.

Parent handoff notes:
Contested cruxes stay contested until evidence or human judgment resolves them.
