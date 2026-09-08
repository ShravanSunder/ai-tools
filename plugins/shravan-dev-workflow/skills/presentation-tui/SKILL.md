---
name: presentation-tui
description: >-
  Use when composing a substantial architecture, comparison, tradeoff, flow, mockup, state-machine, or multi-section response on a monospace terminal or CLI host (Codex CLI, Claude Code CLI, Cursor CLI, or any session whose output is a raw monospace stream), or when host identity cannot be determined. Especially "draw this out", "show me", "compare these", "explain the architecture". Not for rendered proportional-font chat (presentation-webui); not for authoring durable Requirements, Specification, or Program Design (spec-design, program-design). Skip for user-requested exact formats, schema-bound output, code-only replies, or terse answers.
---

# Presentation: TUI

On a monospace surface, the box-drawing skeleton is the default layout and markdown owns the atoms inside it. The skeleton is the top-level section framing, nothing more; every other box or glyph construct is used only where it beats its markdown equivalent at its job (a GFM table, a fence, a bullet list). Markdown atoms are governed by rules 5-7.

## Core rules

1. Pick one shape by content type before writing (picker below).
2. For hard explanations, pick a disclosure sequence before detail: one map, one selected slice, one small ledger, then technical detail.
3. Treat zoom as a disclosure move, not a visual family.
4. Render research as handed-over lanes plus parent synthesis; presentation does not run agents or decide acceptance.
5. Markdown mixes into the skeleton deliberately: **bold** for the few load-bearing words, *italic* sparingly, headings for long multi-section answers, `-` bullets where glyph alignment adds nothing. Never markup as decoration.
6. Technical content — code, JSON, config, commands, structured data, identifiers — is always inline code, a fenced block, or a navigational link, never undifferentiated plain text. Inside fixed-width rows, relocate rather than strip (the baseline owns the procedure and the labels-versus-atoms boundary).
7. Comparisons default to GFM tables; box-drawn tables fire only past the baseline's fallback threshold.
8. Use 70 columns for framed blocks by default; widen only when the content earns it.
9. Keep rows readable; wrap prose instead of shrinking or cramming.
10. Keep sections visually distinct, but do not nest frames deeply.
11. Verify the rendered shape before sending: alignment, overflow, row rhythm, right edges.

## Shape picker

| Shape | Use when | Signal |
|---|---|---|
| Framed card | scoped titled concept | `┌─ Title ──┐` |
| Sub-framed grid | parallel concepts | cells in frame |
| Ruled card | findings or sequences | `#:` / rule lines |
| GFM table (default) | comparisons, matrices, before/after | pipe table |
| Box table / column-ruled | comparison past the baseline's fallback threshold | `┌─┬─┐` or aligned columns |
| Pipeline box | numbered process | boxes + arrows |
| State diagram | states and transitions | `state ──► state` |
| No-frame list | linear scan path | aligned text |

The picker chooses the skeleton's shape and the standalone constructs around it; it never overrides the skeleton default or the GFM comparison default.

## Reference calls

MUST load `../../shared-references/markdown-presentation-baseline.md` and return the construct choices, every technical atom's rendering decision (inline, fenced, linked, or relocated out of a fixed-width row), and its before-send check result.

IF the response needs a diagram or a staged explanation of a hard system, load `../../shared-references/diagram-semantics.md` and return the selected primary visual family with its reason, the disclosure sequence, and the stop/simplify result.

IF Mermaid is requested or the drawing will be rendered outside this terminal, load `../../shared-references/mermaid-usage.md` to decide from the already-selected visual family and return the use-or-fallback decision with its trigger and the readability/semantics check result.

Load at most one local craft reference per response unless the user asks for broad exploration:

- IF choosing or composing a framed shape needs a worked example or anti-pattern, load `references/shape-catalog.md` and return the shape's geometry choices and its don't-use conditions.
- IF building a frame, aligning cells, or handling overflow, load `references/build-discipline.md` and return the alignment arithmetic applied and the verification checklist result.
- IF a comparison passed the baseline's fallback threshold, load `references/tables.md` and return the box-table or ledger layout with the annotation it carries.
- IF drawing a system map, boundary, or data/control flow, load `references/architecture.md` and return the pattern used and its labels.
- IF drawing a state machine, lifecycle, or sequence, load `references/sequence-and-state.md` and return the diagram's entry state, labeled transitions, and terminal states (or actors and messages).
- IF mocking a terminal UI, panel, or dashboard, load `references/ui-layouts.md` and return the layout pattern and focus treatment.
- IF annotating a mockup with callouts, measurements, or variants, load `references/annotations-and-specs.md` and return the annotation pattern applied.
- IF composing a full multi-section response for the first time, load `references/complete-response-walkthrough.md` and return the section rhythm and closing-synthesis placement.

## Output discipline

Before sending, in addition to the baseline's before-send check:

- every frame and rule line lands cleanly at its canvas width;
- row labels stay short (baseline's labels-versus-atoms boundary); ordinary prose shortens or wraps without breaking tokens; no identifier is truncated mid-token;
- markdown inside the skeleton is deliberate (rule 5), and nothing markup-bearing sits inside a fixed-width row;
- if deleting a frame or glyph construct would lose no relationship the reader needs, delete it and keep the markdown.

If the response is short, or the user asked for a normal markdown document or another exact format, skip the TUI treatment.
