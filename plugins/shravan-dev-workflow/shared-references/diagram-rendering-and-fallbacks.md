# Diagram Rendering and Fallbacks

This shared runtime reference owns medium selection, rendering fallback, semantic-preservation inspection, and visual-check results for views whose predicate and required fields were selected by a consuming skill.

Expected inputs: destination, repository rendering capabilities, user-requested format when present, and one or more view requests containing the fired predicate plus required semantic fields. A generated-image request also supplies the artifact identity and main-authored visual brief or its source pointer.

Return per view: selected medium, fallback decision, semantic-preservation result, visual-check result, and exact gap when no supported medium passes.

## Choose the Medium

Honor an exact user-requested format when it can preserve the required semantics. Fenced plain text is not that format for a UI or Mermaid-bound view when the destination renders Mermaid. Otherwise the reader question picks the medium. Mermaid, a text tree, and a generated image are not interchangeable.

- A screen, page, or other UI surface the user sees: select Image Gen. The brief includes the current screen, or the exact words `no current UI`. load `generated-document-visuals.md` and return its capability/authority, durable asset/embed, semantic/readability inspection, preview, and exact-gap result. The image supplements normative prose and any precise view whose fields it cannot preserve.
- Ownership, calls, sequence, state lifecycle, flow, failure, or a trust boundary, when the destination renders Mermaid: select Mermaid. load `mermaid-usage.md` for the readability check only. Do not apply its fenced-text or prose fallback to a UI or Mermaid-bound view. An unreadable diagram becomes a smaller Mermaid or an exact gap. It does not become prose or a text fence marked pass.
- Dense comparison, coverage, or a single rule: use a Markdown table or prose (`markdown-presentation-baseline.md` owns the table default).
- For chat or terminal explanation, and only when visual structure materially helps, use the `presentation-*` skill matching the current surface.
- Fenced plain text is allowed only when no Mermaid renderer exists. For a UI or Mermaid-bound view, that result is a gap, not a pass.

The medium serves the relationship. Do not select syntax first and force the meaning into it.

## Preserve Semantics

Render every field supplied by the consuming skill's predicate contract. Format never excuses a missing class, owner, consumer, edge, state, transition, pain point, evidence anchor, result/error path, failure owner, or proof seam.

Good: the smallest view lets a reader follow the load-bearing relationship and locate every required semantic field without external explanation.

Bad: decorative boxes, prose labeled as a diagram, unreadable Mermaid, a table that hides order, or a view that silently drops a required field.

## Inspect and Fall Back

Inspect the rendered output rather than inferring success from a fenced block, valid-looking syntax, prompt or file path. A directly visible fenced plain-text view can be inspected as shown, and a UI or Mermaid-bound view still fails when the destination could have rendered Mermaid. A table can be inspected as shown only when its rendered cells or borders are visible at the destination. A generated image requires inspection of the actual project-local pixels plus its resolved Markdown embed and supported destination preview under `generated-document-visuals.md`. When the destination renderer is not observable in-session, accept only an actual repository or browser preview of the rendered diagram, or a local Mermaid renderer when available; source-text inspection alone is never a visual pass for a rendered medium. When no rendered inspection is available, return `visual check: unverified (no renderer available)` with the reason. For a UI or Mermaid-bound view, record an explicit gap, or a smaller Mermaid only when that smaller diagram can still be rendered and inspected. Plain text is not a completion fallback for those views. A comparison or coverage table may still be inspected as shown. Never record a bare pass. Check:

- every required semantic field is visible;
- labels and edges are readable at the destination;
- direction, order, grouping, and negative space preserve the intended relationship;
- the view adds decision clarity rather than decoration;
- normative meaning still has a prose or table home outside the diagram when the owning skill requires it.

Fallback when the first medium is unavailable, malformed, unreadable, decorative, or semantically lossy. For a UI or Mermaid-bound view, the next medium is a smaller Mermaid or an exact gap. Plain text and prose are not completion fallbacks for those views. For comparison or coverage, prefer the next simplest medium that preserves the relationship. If none passes, return the missing field or destination capability as an exact gap; do not mark the view complete.

## Return Shape

Each medium label names an output medium, not a skill: `presentation-tui` denotes a box-drawn/glyph TUI layout block (built with `presentation-tui` craft). There is no `presentation-webui` medium — webui output is composed of the other media (`mermaid`, `markdown-table`, fences), so a webui view is labeled by its actual medium. Surface routing is the presentation skills' job, not this label set's.

```text
view and fired predicate
required semantic fields
selected medium: generated-image | mermaid | markdown-table | presentation-tui | fenced-plain-text
format override: honored | not requested | unsupported, with reason
semantic preservation: preserved fields | missing fields
visual check: readable | unreadable | unverified, with observation
generated asset/embed/preview: project paths and inspection result, when selected
fallback: none | from -> to, with trigger
result: pass | gap
```

Complete when every fired view has a `pass` result with all required semantic fields preserved and readable, or the caller receives an exact gap that blocks its artifact-completion step.
