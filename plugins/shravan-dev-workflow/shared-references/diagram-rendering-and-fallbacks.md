# Diagram Rendering and Fallbacks

This shared runtime reference owns medium selection, rendering fallback, semantic-preservation inspection, and visual-check results for views whose predicate and required fields were selected by a consuming skill.

Expected inputs: destination, repository rendering capabilities, user-requested format when present, and one or more view requests containing the fired predicate plus required semantic fields.

Return per view: selected medium, fallback decision, semantic-preservation result, visual-check result, and exact gap when no supported medium passes.

## Choose the Medium

Honor an exact user-requested format when it can preserve the required semantics. Otherwise choose by the relationship and destination:

- use Mermaid in durable Markdown when the repository renders it and topology, flow, sequence, or state is load-bearing;
- use a Markdown table for dense ownership, matrix, state, transition, or coverage data where comparison matters more than topology or time;
- use `tui-presentation` for chat or terminal explanation only when visual structure materially helps and no exact user-requested format overrides it;
- use readable fenced plain text when no renderer exists or Mermaid/table structure would hide the relationship.

The medium serves the relationship. Do not select syntax first and force the meaning into it.

## Preserve Semantics

Render every field supplied by the consuming skill's predicate contract. Format never excuses a missing class, owner, consumer, edge, state, transition, pain point, evidence anchor, result/error path, failure owner, or proof seam.

Good: the smallest view lets a reader follow the load-bearing relationship and locate every required semantic field without external explanation.

Bad: decorative boxes, prose labeled as a diagram, unreadable Mermaid, a table that hides order, or a view that silently drops a required field.

## Inspect and Fall Back

Inspect the rendered output rather than inferring success from a fenced block or valid-looking syntax. When the destination renderer is not observable in-session, accept only an actual repository or browser preview of the rendered diagram, or a local Mermaid renderer when available; source-text inspection alone is never a visual pass for a rendered medium. When no rendered inspection is available, return `visual check: unverified (no renderer available)` with the reason, and either apply the required plain-text/table fallback or record the rendered result as an explicit gap — never a bare pass. Check:

- every required semantic field is visible;
- labels and edges are readable at the destination;
- direction, order, grouping, and negative space preserve the intended relationship;
- the view adds decision clarity rather than decoration;
- normative meaning still has a prose or table home outside the diagram when the owning skill requires it.

Fallback when the first medium is unavailable, malformed, unreadable, decorative, or semantically lossy. Prefer the next simplest medium that preserves the relationship. If none passes, return the missing field or destination capability as an exact gap; do not mark the view complete.

## Return Shape

```text
view and fired predicate
required semantic fields
selected medium: mermaid | markdown-table | tui-presentation | fenced-plain-text
format override: honored | not requested | unsupported, with reason
semantic preservation: preserved fields | missing fields
visual check: readable | unreadable | unverified, with observation
fallback: none | from -> to, with trigger
result: pass | gap
```

Complete when every fired view has a `pass` result with all required semantic fields preserved and readable, or the caller receives an exact gap that blocks its artifact-completion step.
