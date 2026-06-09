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
  2. Use 70 columns by default; widen only when the content earns it.
  3. Keep layout structural: borders, rules, arrows, indentation.
  4. Use semantic markdown only for code, file links, URLs, and tokens.
  5. Keep rows readable; wrap prose instead of shrinking or cramming.
  6. Keep sections visually distinct, but do not nest frames deeply.
  7. Verify the rendered shape before sending: alignment, overflow,
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


─── Progressive disclosure ──────────────────────────────────────────

Load only the reference needed for the response being built:

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
    State machines, lifecycles, transitions, Mermaid translations.

  ▸ `references/ui-layouts.md`
    Terminal UI layouts, panels, tool surfaces, compact dashboards.

  ▸ `references/annotations-and-specs.md`
    Callouts, constraints, specs, edge-case explanations.

  ▸ `references/complete-response-walkthrough.md`
    Full response construction example.


─── Output discipline ───────────────────────────────────────────────

Before sending:

  ▸ Check every frame/rule line lands cleanly.
  ▸ Check long labels wrap without breaking important tokens.
  ▸ Check code and structured data remain fenced code blocks.
  ▸ Check the visual shape helps the decision; if not, simplify.

If the response is short or the user asked for a normal markdown answer,
skip the TUI treatment.
