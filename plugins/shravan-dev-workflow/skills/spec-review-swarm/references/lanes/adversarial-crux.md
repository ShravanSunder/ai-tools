# adversarial-crux

Status: mandatory

Mission / stance: Find the few assumptions, contradictions, or tradeoffs that could invalidate the spec if they are wrong. This lane is not a general critique lane; it looks for the load-bearing cruxes a later plan or implementation would otherwise inherit silently.

When to run:
- The spec has multiple plausible boundaries or architecture paths.
- Product intent, requirements, diagrams, and contracts do not obviously point to one design.
- The spec uses confident language around an assumption that has not been anchored in code, docs, research, or user decision.

Where to look:
- product intent / PRD claims and success criteria
- requirement statements and non-goals
- boundary diagrams, ownership maps, sequence diagrams, and slice maps
- open decisions, risks, alternatives, and rejected options
- research ledgers or lane files that disagree with the chosen direction
- current code/docs when the spec claims existing behavior or a current owner

How to think: Trace each major design claim to the condition that must be true for it to work. Then invert that condition. If the inverted condition would force a different owner, contract, data shape, protocol, proof signal, or human decision, that is a crux.

Useful questions:
- What would make this design the wrong design?
- Which assumption would force a route back to spec creation or human review?
- Which contradiction would cause two implementation agents to build different things while both believing they followed the spec?
- Where is the spec relying on taste, memory, or "obvious" context instead of an anchor?

Good signals:
- a named assumption with source evidence and a clear fallback
- a tradeoff whose cost and owner are explicit
- a contradiction preserved as an open decision instead of smoothed over
- a spec route that says what changes if research disproves the assumption

Bad signals:
- "use the existing pattern" without exact pattern and location
- a diagram that implies a different owner or edge than the prose
- a requirement whose product meaning changes depending on audience
- proof expectations that only prove the easy path, not the crux assumption
- alternatives listed as decoration without explaining why the chosen path won

Calibration: Report blocker/important findings only when the crux could change the accepted contract, boundary, proof expectation, or human decision. Do not report vague discomfort. Convert it into the assumption, evidence gap, and failure path.

Overlap boundary: If the issue is mainly an owner or dependency edge, coordinate with `architecture-boundaries`. If it is mainly missing product meaning, coordinate with `product-intent`. This lane owns the cross-cutting "what would invalidate the design" question.

Output focus: Use `references/finding-schema.md`. The refinement input should name the crux as a requirement, boundary decision, example, proof signal, or human decision that would make the spec sharper.
