# Mermaid Usage

This shared runtime reference owns the Mermaid decision: when a Mermaid diagram earns its place, how to check the result, and when to fall back. Consumers: `presentation-webui` (primary), `presentation-tui` (fenced Mermaid source only when the user will render it elsewhere), and `shared-references/diagram-rendering-and-fallbacks.md`.

The stance is understanding-first and anti-catalog: choose the visual family for the relationship first (`diagram-semantics.md`), then ask whether Mermaid is the best renderer for that family on this surface. Never build or recommend a broad Mermaid syntax catalog, a diagram-type inventory, or a Mermaid-translation table.

Expected inputs: the selected visual family, the required semantic fields, and the destination (rendered chat, durable markdown file, or terminal).

Return: use-Mermaid or fallback, with the trigger; and the readability/semantics check result.

## When Mermaid Earns Its Place

Use Mermaid only when all three hold. Availability is never a reason: "the surface renders Mermaid" satisfies condition 2 only — a diagram justified by the surface rather than the relationship is decoration, and a two-or-three-node relationship a sentence or table can carry fails condition 1 outright. Match the medium to the reader's question: a *what-changes* question is delta-shaped and takes a diff, tree, or table — drawing the surrounding topology to display a delta fails condition 1 however many nodes it has; topology earns a diagram only when *how the parts talk* is itself the question.

1. **The relationship is load-bearing** — topology, flow, sequence, or state carries the meaning the reader needs; a list or table would hide it.
2. **A renderer exists at the destination** — rendered chat panes and Mermaid-enabled repositories render it; a raw terminal does not. On a terminal, emit fenced Mermaid source only when the user will paste it somewhere that renders (say so), otherwise draw the relationship in the surface's native medium.
3. **The diagram stays readable at the destination** — few enough nodes and labels that edges can be followed without zooming.

## Check the Result

Inspect the rendered output rather than inferring success from valid-looking syntax:

- every required semantic field (owner, edge, state, transition, failure path) is visible;
- labels and direction read correctly; grouping and negative space preserve the intended relationship;
- the diagram adds decision clarity — it changes what the reader concludes or does next.

Decorative-Mermaid bad signals: a diagram restating what one sentence already said; nodes without meaningful edges; a flowchart wrapping a simple list; unreadable label soup; syntax that fails to render silently treated as success.

## Fallback

Fall back when any check fails: prefer the next simplest medium that preserves the relationship — a GFM table for comparison-shaped meaning, a fenced plain-text sketch for spatial meaning, prose for a single relationship. Name the trigger when falling back. If no medium preserves the required fields, return the exact gap instead of shipping a lossy view.

Complete when the diagram passed all three earn-its-place conditions and the rendered check, or the fallback and its trigger are named.
