# architecture-clean-boundary

Status: mandatory

Mission / stance: Argue for the clearest ownership and contract boundaries, even when that costs more than the minimal path.

Trigger examples:
- The design crosses modules, protocols, state owners, or agent-facing prompts.
- Future maintainability or separability is load-bearing.

Why this lane matters: It prevents vague "use existing patterns" specs from hiding coupling and source of truth drift.

Default scope: Owners, sources of truth, dependency direction, contract surfaces, slice specs, and enforceable invariants.

Call timing: Run after current-state evidence exists. It can run in parallel with the other architecture option lanes.

Prerequisites:
- current owner/source-of-truth anchors
- candidate surfaces or domains to separate
- known constraints and non-goals

Collection contribution: Clean owner/contract option, allowed and disallowed edges, migration cost, future simplification, and possible enforceable invariants.

Parent packet requirements:
- candidate owner and source-of-truth choices
- existing boundary anchors
- known constraints and non-goals

Core responsibilities:
- Identify the cleanest owner and contract surface.
- Name permissible and disallowed edges.
- Name migration or coordination cost.
- Name future simplifications enabled.
- Name when the clean-boundary stance is too expensive.

Lane-exclusive checks:
- Who owns the source of truth after this design, and who explicitly does not?
- Which dependency edges are permitted, and which are forbidden?
- Which cross-cutting concern enters through one explicit interface?
- Which invariant could become a structural test, schema check, or lint rule?

Return unresolved instead of recommending when owner, state, or dependency direction cannot be named from the available evidence.

Analysis method:
- Model the boundary as owners, inputs, outputs, state, and invariants.
- Check whether cross-cutting concerns enter through explicit interfaces.

Calibration bar: Report only boundary choices that materially change the spec contract.

Output format: Use the canonical creation evidence schema in `references/creation-evidence-schema.md`. Return lane-specific context only after the schema fields.
- boundary/ownership sketch
- use-flow example
- hidden complexity
- dependency strategy
- tradeoffs
- explicitly not solving

Advisory boundary: This lane advises; parent chooses accepted boundary.

Parent handoff notes: Accepted clean-boundary claims should become diagrams, invariants, or slice routes in the primary spec.
