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

Evidence priority:
1. Load-bearing product, boundary, proof, or security claims.
2. Contradictions between primary spec, slice specs, diagrams, and evidence.
3. Current code/docs only where they can falsify a claimed assumption.

Analysis method:
Identify one to three crux assumptions. For each, name the falsifier, concrete
failure path, smallest refinement input, and whether resolution belongs to the
inner spec loop or outer human decision loop.

Prioritized smells / failure signals:
- plan or implementation depends on an unstated assumption;
- two spec sections imply different owners, contracts, or proof expectations;
- a tradeoff has no cost, falsifier, or route-back;
- proof expectations cannot falsify the design risk;
- human product or ownership choice is hidden as technical certainty.

Calibration bar:
Report blocker/important cruxes only.

Overlap boundary:
If the issue is mainly missing contract fields, route it to
`contract-and-scope`. If it is mainly proof modality, route it to
`validation-and-testability`. If it requires whole-artifact traceability across
many sections or slices, route it to `whole-spec-coverage`.

Cannot-verify boundary:
Set `cannot_verify_from_focused_packet` when the crux needs implementation
proof, whole-plan execution analysis, whole-spec coverage, or source artifacts
missing from the focused packet. Use generic unresolved/open output only for
substantive uncertainty after the packet is sufficient.

Output format:
Use the canonical per-finding schema from `references/finding-schema.md`. Return lane-specific context only after the schema fields.
Include: crux assumption, falsifier, failure path, smallest artifact edit or
decision needed, loop route, and confidence.

Advisory boundary:
This lane does not force consensus.

Parent handoff notes:
Contested cruxes stay contested until evidence or human judgment resolves them.
