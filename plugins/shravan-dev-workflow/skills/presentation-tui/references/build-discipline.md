Build Discipline — Presentation: TUI Reference
══════════════════════════════════════════════════════════════════════

This reference owns: the mechanics of building clean TUI output —
step-by-step build procedure, alignment arithmetic, indentation
recipes, overflow handling, and verification.
Expected inputs: the shape and content selected by the SKILL.md
caller.
Return: the alignment arithmetic applied and the verification
checklist result.
Complete when: every checklist item passes on the composed block.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ shape-catalog.md — full worked examples for the seven shapes, six compositional applications (phase-sequence, Q&A rationale, review findings, dual-tag title, scope inventory, file-tree), and shape anti-patterns
  ▸ Peer references — per-shape pattern catalogs (tables, ui-layouts, architecture, sequence-and-state, annotations)

All examples below use canvas width 70 unless noted.


─── Build procedure — step by step with snapshots ───────────────────

Follow this procedure when drawing a framed card.  Other shapes use the same discipline with shape-specific adjustments.

Canvas = 70 by default.

Step 1 — Commit canvas width.  State the width (or keep it in a mental note).  Default 70.  Widen deliberately when the block clearly benefits.  Do not change mid-block.

Output so far: (nothing)

Step 2 — Emit the top border.

For a titled frame: `┌─ [title] ─...─┐`

▸ 2 fixed `─` chars after `┌`
▸ one space
▸ title
▸ one space
▸ fill `─` up to column 68
▸ `┐` at column 69

```text
┌─ Example section title ─────────────────────────────────────────────┐
```

Step 3 — Emit breathing row.

```text
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
```

`│` at col 0, 68 spaces, `│` at col 69.

Step 4 — Emit content row.  Content indented 2 spaces from left │. Right-pad to col 69 with spaces, then `│`.

```text
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
```

Step 5 — Emit blank row between semantic groups (when needed).

```text
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
│                                                                     │
│  Second group starts here, visually distinct from the first.        │
```

Step 6 — Emit closing breathing row and bottom border.

```text
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
│                                                                     │
│  Second group starts here, visually distinct from the first.        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Step 7 — Verify.

▸ Every row's right edge lands at col 69 (the │ or ┐ or ┘)
▸ Total line length = 70 chars
▸ No markup inside fixed-width rows (it drifts the border — relocate
  technical content per the baseline's fixed-width-row resolution)
▸ Single borders only (no ╔═╗ mixed in)
▸ Identifier content not truncated mid-token

If any row's right edge doesn't land at col 69: pad with spaces, or apply overflow policy (shorten/wrap/widen).


─── Alignment recipes ───────────────────────────────────────────────

Cell-width arithmetic for tables.  For a K-cell row at canvas N:

```text
  w1 + w2 + ... + wK + (K + 1) = N
                       ↑
                       K+1 separator chars: one │ between each cell
                       plus the two │ borders
```

Example: 3-cell table at canvas 70 ──► `w1 + w2 + w3 + 4 = 70` ──► sum
of cell widths = 66.  Distribute: e.g. 20 / 30 / 16, or 15 / 25 / 26.

Junction character selection.  Pick by which sides connect:

```text
  ┌ ┐       corners: 2 sides (horizontal + vertical)
  ├ ┤       T-junction: 3 sides (vertical + horizontal to one side)
  ┬ ┴       T-junction: 3 sides (horizontal + vertical one direction)
  ┼         cross: 4 sides
  └ ┘       corners
```

Never drop to `+` — the result is noisy and amateurish.  Stay in Unicode.

Padding rules:

  ▸ Left-aligned content: append spaces to reach the right alignment column

  ▸ Centered content: prepend (width − content) / 2 spaces, append the remainder

  ▸ Right-aligned content: prepend spaces until content ends at the right alignment column

Consistency rule.  Every row of a given block must emit structural chars at the same columns.  If row 1 has │ at col 12, every row in that block has │ at col 12 — or the block is broken.

Before/After drift example.  When content changes and row widths accidentally mismatch, catch and fix:

BROKEN (top/bottom border ends col 70, rows end col 68):

```text
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                │
├─────────────────┼──────────────────────────────────────────────┤
│ review model    │ The Codex CLI model used for reviews         │
│ approval mode   │ When tools require approval                │
└─────────────────┴──────────────────────────────────────────────┘
```

Scan the right edge — row 1 and row 4 end at col 68, but the borders end at col 70.  Drift.

FIXED (every row ends col 70):

```text
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                  │
├─────────────────┼──────────────────────────────────────────────┤
│ review model    │ The Codex CLI model used for reviews         │
│ approval mode   │ When tools require approval                  │
└─────────────────┴──────────────────────────────────────────────┘
```

Fix: pad each row's content with spaces until the closing │ lands exactly at canvas width.  Count chars if unsure.


─── Indentation recipes ─────────────────────────────────────────────

Indent depth by pattern:

```text
Pattern                         Indent depth
──────────────────────────      ──────────────────────────────
Label → content                 2 spaces
Sub-item under list item        2-4 spaces per nesting level
Code snippet inline with prose  4 spaces
Continuation of wrapped line    under first content char
Inside framed card              2 spaces from left │
```

Worked examples.  For each common pattern, the WRONG and RIGHT side-by-side.

Label ──► content:

```text
WRONG                            RIGHT
─────                            ─────

What you expect:                 What you expect:

drawer drag                        drawer drag
→ only drawer active                 → only drawer active
→ main panes inert                   → main panes inert
```

Sub-items nested:

```text
WRONG                            RIGHT
─────                            ─────

Current ownership:               Current ownership:

drag starts on drawer              drag starts on drawer
├── drawer overlay                   ├── drawer overlay
→ DrawerSplitContainer...                  → DrawerSplitContainer
└── main tab overlay                 └── main tab overlay
→ SplitContainer...                        → SplitContainer
```

Code snippet inline:

```text
WRONG                            RIGHT
─────                            ─────

When pane is in drawer:          When pane is in drawer:

useDrawerFramePreference             useDrawerFramePreference
== true                              == true

and it publishes both keys.      and it publishes both keys.
```

Actual code-like block:

Use inline snippet treatment for short code-like tokens or tiny expressions inside prose.  Prefer inline code spans when the surface preserves them cleanly: variable names, property names, field names, type names, enum cases, file names, commands, config keys, and short expressions or literal values.  Switch to a fenced code block as soon as the reader would reasonably treat the content as code-like structure to copy, scan, or run: source code, typed data models, schemas, or structured definitions.  Do not redraw that content as a Unicode layout.

```text
WRONG                            RIGHT
─────                            ─────

Implementation:                 Implementation:

  handler() {                     ```ts
    if (!ready) {                 function handler(): void {
      return;                       if (!ready) {
    }                                  return;
  }                                }
                                   }
                                 ```
```

Fence the code block cleanly under its label or between section rules.
Keep the surrounding explanation in TUI form; keep the code-like
content itself in its native fenced form.

Markdown boundary on this surface:

The shared baseline (`../../../shared-references/markdown-presentation-baseline.md`)
owns the bright line, the labels-versus-atoms boundary, and the
Fixed-Width-Row Resolution.  Every check below is an application of
that resolution to frame geometry, not a second rule.

Continuation hang-indent:

```text
WRONG                            RIGHT
─────                            ─────

Problem: the pane                Problem: the pane publishes publishes frames into              frames into both maps, both maps, which                   which explains the leak. explains the leak.
```

Indent is always worth the characters.  Flat output is unreadable;
indented output reveals hierarchy at a glance.

Vertical-flow geometry:

Use vertical `│` / `▼` flow only when each step is short enough to
visually own the connector column.  If the first or widest step is
long, the connector detaches from the phrase and reads like stray
punctuation.

```text
WRONG (long first step, detached connector):

prompt asks for design / explanation / comparison / architecture
│
▼ skill metadata triggers

RIGHT (compact arrow-chain owns the long labels):

prompt asks for design / explanation / comparison / architecture
  ──► skill metadata triggers
  ──► agent loads core TUI rules
  ──► agent picks one shape
```

For a longer step-by-step process, use a pipeline box instead of
vertical flow.  Pick the shape that preserves visual ownership of the
sequence.


─── Overflow recipes ────────────────────────────────────────────────

Shorten with `…`.  Preferred for prose labels.  No reflow.

```text
before:  │ removes the pane from the layout tree      │ after:   │ removes the pane from layout…              │
```

Never shorten a technical atom: identifiers, commands, and paths
follow the Identifier relocation rule below instead.

Wrap to next line.  For prose that can't be shortened.  Identifiers
and other technical atoms never wrap inside rows — they always use
the Identifier relocation rule below.

```text
before:  │ Some very long prose that doesn't fit in the available width │ ↑ drift

after:   │ Some very long prose that doesn't fit in the available     │
         │   width (hanging-indented continuation)                     │
```

Continuation hang-indents 2-4 spaces under the first content char.

Widen the column.  Only when shorten loses meaning AND wrap is ugly.
Reflows the whole block.

```text
before:  │ col1 │ col2 │ col3 │     cells are 8 chars each after:   │ col1     │ col2 │ col3 │   col1 widened to 12 chars
```

Widen the column that has the longest content.  Recompute all
alignment columns.

Identifier relocation rule.  Code identifiers never truncate
mid-token, and per the baseline's bright line they do not sit as raw
plain text inside rows either.  When an identifier or code atom
belongs to a framed row, keep a short plain label in the row and
relocate the technical content outside the frame as inline code or a
fence:

WRONG (ragged right, breaks frame contract):

```text
│ 3. removal                              │
│      drawer child?  ──► store.removeDrawerPane
│      main pane?     ──► tabLayoutAtom.removePaneFromLayout
├─────────────────────────────────────────┤
```

RIGHT (short labels in the frame; atoms relocated below it):

```text
│ 3. removal                                                        │
│      drawer child?  ──► store call, below                         │
│      main pane?     ──► layout call, below                        │
├───────────────────────────────────────────────────────────────────┤
```

Immediately after the frame: drawer child removal calls
`store.removeDrawerPane`; main panes use
`tabLayoutAtom.removePaneFromLayout`.

Canvas width stays intact, identifiers stay intact and copyable, and
the frame carries only what fits it.  If relocation makes the block
read poorly, prefer a no-frame list or a GFM table over the frame.


─── Verification checklist ──────────────────────────────────────────

Run this before shipping a response.  Every item must pass.

```text
  [ ] Canvas width committed and consistent across the block?
  [ ] Every rule/border exactly canvas-width?
  [ ] Every content row right-padded to the right alignment column?
  [ ] Right edges line up when you scan vertically?
  [ ] Markdown mixed in deliberately (bold on load-bearing words,
      headings/bullets only where they change what a reader can find)?
  [ ] Every technical atom inline code, fenced, or relocated —
      none left as raw plain text (baseline bright line)?
  [ ] No markup inside fixed-width rows; relocated content sits
      immediately before or after its frame with a row pointer?
  [ ] Comparisons use a GFM table, or the specific annotation GFM
      cannot carry is named?
  [ ] No identifier truncated mid-token?
  [ ] Breathing room present (blank row after ┌─┐, before └─┘, between semantic groups)?
  [ ] One shape per block (no nested nesting beyond sub-framed grid)?
  [ ] Shape choice matches content type from the vocabulary picker?
  [ ] Multi-line code, JSON, or config shown as a fenced block with a
      language tag — never indented plain text or box-drawing?
  [ ] Sections have heading → block → heading rhythm?
  [ ] Closing synthesis ("My read" or summary) present for long responses?
  [ ] Arrows consistent (──► ◄── ▼ only; no → ⇒ -> mixing)?
  [ ] Vertical flow used only when connector columns visually belong to each step?
  [ ] Single borders (╔═╗ used only for rare focal emphasis)?
```

Any "no" — geometry, markdown-mixing, or bright-line — is fixed
before sending.
