---
name: tui-presentation
description: >-
  Use for in-chat design or explanatory responses where markdown is unreliable for document structure, especially architecture, comparisons, tradeoffs, UI mockups, flows, state machines, debugging narratives, review syntheses, and multi-section explanations. Skip for user-requested formats, schema-bound output, code-only replies, or terse answers.
---

TUI Presentation
══════════════════════════════════════════════════════════════════════

Use this skill when the answer needs visual structure in a monospace
chat surface. Unicode box drawing and whitespace own layout. Markdown
still owns fenced code blocks, inline code, file links, and URLs.


─── Trigger boundary ────────────────────────────────────────────────

Use for:

  ▸ design, architecture, comparison, and tradeoff explanations
  ▸ pipelines, state machines, sequence flows, and lifecycle views
  ▸ UI mockups, structured reviews, and multi-section synthesis
  ▸ "draw it out", "show me", "compare", "explain", "how would it look"

Do not use for:

  ▸ user-requested JSON, YAML, markdown, code, or another exact format
  ▸ schema-bound or machine-readable output
  ▸ simple one-paragraph answers
  ▸ generated code/config where a fenced code block is the right shape

User-specified format always wins.


─── Core rules ──────────────────────────────────────────────────────

  1. Pick one shape by content type before writing.
  2. For hard explanations, pick a disclosure sequence before detail:
     one map, one selected slice, one small ledger, then technical detail.
  3. Treat zoom as a disclosure move, not a visual family.
  4. Render research as handed-over lanes plus parent synthesis; TUI
     does not run agents or decide acceptance.
  5. Keep Mermaid requests understanding-first: use a small set of
     visual families, not a catalog.
  6. Use 70 columns by default; widen only when the content earns it.
  7. Keep layout structural: borders, rules, arrows, indentation.
  8. Use semantic markdown only for code, file links, URLs, and tokens.
  9. Keep rows readable; wrap prose instead of shrinking or cramming.
 10. Keep sections visually distinct, but do not nest frames deeply.
 11. Verify the rendered shape before sending: alignment, overflow,
     row rhythm, and right edges.


─── Shape picker ────────────────────────────────────────────────────

┌───┬──────────────────┬──────────────────────────┬──────────────────┐
│ # │ Shape            │ Use when                 │ Signal           │
├───┼──────────────────┼──────────────────────────┼──────────────────┤
│ 1 │ Framed card      │ Scoped titled concept    │ ┌─ Title ──┐     │
│ 2 │ Sub-framed grid  │ Parallel concepts        │ cells in frame   │
│ 3 │ Ruled card       │ Findings or sequences    │ #: / rule lines  │
│ 4 │ Column-ruled     │ Comparisons or timelines │ aligned columns  │
│ 5 │ Pipeline box     │ Numbered process         │ boxes + arrows   │
│ 6 │ State diagram    │ States and transitions   │ state ──► state  │
│ 7 │ No-frame list    │ Linear scan path         │ aligned text     │
└───┴──────────────────┴──────────────────────────┴──────────────────┘

Fast picks:

  ▸ one scoped idea                         ──►  framed card
  ▸ several comparable ideas                ──►  sub-framed grid
  ▸ review findings or concern groups       ──►  ruled card
  ▸ option matrix or before/after           ──►  column-ruled
  ▸ ordered work or data flow               ──►  pipeline box
  ▸ branching lifecycle                     ──►  state diagram
  ▸ compact status or synthesis             ──►  no-frame list


─── Reference loading ───────────────────────────────────────────────

Load only the reference needed for the response being built:

  ▸ `references/progressive-disclosure.md`
    Disclosure sequence for hard explanations, research synthesis,
    debug narratives, and "draw this out" asks.

  ▸ `references/visual-family-selection.md`
    Visual family choice: flow, sequence, state, quadrant/2D, topology.
    Use before domain examples when the best family is unclear.

  ▸ `references/shape-catalog.md`
    Worked examples and anti-patterns for all seven shapes.

  ▸ `references/build-discipline.md`
    Alignment arithmetic, indentation recipes, overflow handling,
    verification checklist.

  ▸ `references/tables.md`
    Column-ruled comparisons, status matrices, timelines.

  ▸ `references/architecture.md`
    System maps, component boundaries, data/control flow.

  ▸ `references/sequence-and-state.md`
    State machines, lifecycles, transitions, sequence flows.

  ▸ `references/ui-layouts.md`
    Terminal UI layouts, panels, tool surfaces, compact dashboards.

  ▸ `references/annotations-and-specs.md`
    Callouts, constraints, specs, edge-case explanations.

  ▸ `references/complete-response-walkthrough.md`
    Full response construction example.

Load one of `progressive-disclosure.md` or `visual-family-selection.md`
first when needed, then at most one domain example reference unless the
user explicitly asks for broad catalog exploration.


─── Output discipline ───────────────────────────────────────────────

Before sending:

  ▸ Check every frame/rule line lands cleanly.
  ▸ Check long labels wrap without breaking important tokens.
  ▸ Check code and structured data remain fenced code blocks.
  ▸ Check the visual shape helps the decision; if not, simplify.

If the response is short or the user asked for a normal markdown answer,
skip the TUI treatment.
