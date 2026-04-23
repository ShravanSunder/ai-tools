Build Discipline — TUI Presentation Reference
══════════════════════════════════════════════════════════════════════

Deep-dive reference for the MECHANICS of building clean TUI output:
step-by-step build procedure, alignment arithmetic, indentation
recipes, overflow handling, and verification.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ shape-catalog.md — full worked examples for the seven shapes,
    six compositional applications (phase-sequence, Q&A rationale,
    review findings, dual-tag title, scope inventory, file-tree),
    and shape anti-patterns
  ▸ Peer references — per-shape pattern catalogs (tables,
    ui-layouts, architecture, sequence-and-state, annotations)

All examples below use canvas width 70 unless noted.


─── Build procedure — step by step with snapshots ───────────────────

Follow this procedure when drawing a framed card.  Other shapes use
the same discipline with shape-specific adjustments.

Canvas = 70.

Step 1 — Commit canvas width.  State the width (or keep it in a
mental note).  Default 70.  Do not change mid-block.

Output so far: (nothing)

Step 2 — Emit the top border.

For a titled frame: `┌─ [title] ─...─┐`

▸ 2 fixed `─` chars after `┌`
▸ one space
▸ title
▸ one space
▸ fill `─` up to column 68
▸ `┐` at column 69

```
┌─ Example section title ─────────────────────────────────────────────┐
```

Step 3 — Emit breathing row.

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
```

`│` at col 0, 68 spaces, `│` at col 69.

Step 4 — Emit content row.  Content indented 2 spaces from left │.
Right-pad to col 69 with spaces, then `│`.

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
```

Step 5 — Emit blank row between semantic groups (when needed).

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
│                                                                     │
│  Second group starts here, visually distinct from the first.        │
```

Step 6 — Emit closing breathing row and bottom border.

```
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
▸ No markdown syntax inside
▸ Single borders only (no ╔═╗ mixed in)
▸ Identifier content not truncated mid-token

If any row's right edge doesn't land at col 69: pad with spaces, or
apply overflow policy (shorten/wrap/widen).


─── Alignment recipes ───────────────────────────────────────────────

Cell-width arithmetic for tables.  For a K-cell row at canvas N:

```
  w1 + w2 + ... + wK + (K + 1) = N
                       ↑
                       K+1 separator chars: one │ between each cell
                       plus the two │ borders
```

Example: 3-cell table at canvas 70 ──► `w1 + w2 + w3 + 4 = 70` ──► sum
of cell widths = 66.  Distribute: e.g. 20 / 30 / 16, or 15 / 25 / 26.

Junction character selection.  Pick by which sides connect:

```
  ┌ ┐       corners: 2 sides (horizontal + vertical)
  ├ ┤       T-junction: 3 sides (vertical + horizontal to one side)
  ┬ ┴       T-junction: 3 sides (horizontal + vertical one direction)
  ┼         cross: 4 sides
  └ ┘       corners
```

Never drop to `+` — the result is noisy and amateurish.  Stay in
Unicode.

Padding rules:

  ▸ Left-aligned content: append spaces to reach the right alignment
    column

  ▸ Centered content: prepend (width − content) / 2 spaces, append
    the remainder

  ▸ Right-aligned content: prepend spaces until content ends at the
    right alignment column

Consistency rule.  Every row of a given block must emit structural
chars at the same columns.  If row 1 has │ at col 12, every row in
that block has │ at col 12 — or the block is broken.

Before/After drift example.  When content changes and row widths
accidentally mismatch, catch and fix:

BROKEN (top/bottom border ends col 70, rows end col 68):

```
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                │
├─────────────────┼──────────────────────────────────────────────┤
│ review_model    │ The Codex CLI model used for reviews         │
│ approval_mode   │ When tools require approval                │
└─────────────────┴──────────────────────────────────────────────┘
```

Scan the right edge — row 1 and row 4 end at col 68, but the
borders end at col 70.  Drift.

FIXED (every row ends col 70):

```
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                  │
├─────────────────┼──────────────────────────────────────────────┤
│ review_model    │ The Codex CLI model used for reviews         │
│ approval_mode   │ When tools require approval                  │
└─────────────────┴──────────────────────────────────────────────┘
```

Fix: pad each row's content with spaces until the closing │ lands
exactly at canvas width.  Count chars if unsure.


─── Indentation recipes ─────────────────────────────────────────────

Indent depth by pattern:

```
Pattern                         Indent depth
──────────────────────────      ──────────────────────────────
Label → content                 2 spaces
Sub-item under list item        2-4 spaces per nesting level
Code snippet inline with prose  4 spaces
Continuation of wrapped line    under first content char
Inside framed card              2 spaces from left │
```

Worked examples.  For each common pattern, the WRONG and RIGHT
side-by-side.

Label ──► content:

```
WRONG                            RIGHT
─────                            ─────

What you expect:                 What you expect:

drawer drag                        drawer drag
→ only drawer active                 → only drawer active
→ main panes inert                   → main panes inert
```

Sub-items nested:

```
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

```
WRONG                            RIGHT
─────                            ─────

When pane is in drawer:          When pane is in drawer:

useDrawerFramePreference             useDrawerFramePreference
== true                              == true

and it publishes both keys.      and it publishes both keys.
```

Continuation hang-indent:

```
WRONG                            RIGHT
─────                            ─────

Problem: the pane                Problem: the pane publishes
publishes frames into              frames into both maps,
both maps, which                   which explains the leak.
explains the leak.
```

Indent is always worth the characters.  Flat output is unreadable;
indented output reveals hierarchy at a glance.


─── Overflow recipes ────────────────────────────────────────────────

Shorten with `…`.  Preferred.  No reflow.

```
before:  │ tabLayoutAtom.removePaneFromLayout        │
after:   │ tabLayoutAtom.removePane…                  │
```

Prefer truncating at a word or dot boundary if visible.  If the
identifier is one word (`removePaneFromLayout`), prefer wrap or
widen.

Wrap to next line.  When the content can't be shortened (identifier,
quoted string).

```
before:  │ Some very long prose that doesn't fit in the available width │
                                                                       ↑ drift

after:   │ Some very long prose that doesn't fit in the available     │
         │   width (hanging-indented continuation)                     │
```

Continuation hang-indents 2-4 spaces under the first content char.

Widen the column.  Only when shorten loses meaning AND wrap is ugly.
Reflows the whole block.

```
before:  │ col1 │ col2 │ col3 │     cells are 8 chars each
after:   │ col1     │ col2 │ col3 │   col1 widened to 12 chars
```

Widen the column that has the longest content.  Recompute all
alignment columns.

Identifier wrap rule.  Code identifiers never truncate mid-token.
When an identifier won't fit in a cell, wrap the entire line so the
identifier stays intact AND the frame border stays at canvas width:

WRONG (ragged right, breaks frame contract):

```
│ 3. removal                              │
│      drawer child?  ──► store.removeDrawerPane
│      main pane?     ──► tabLayoutAtom.removePaneFromLayout
├─────────────────────────────────────────┤
```

RIGHT (wrap the identifier onto its own line):

```
│ 3. removal                                                        │
│      drawer child?                                                │
│        ──► store.removeDrawerPane                                 │
│      main pane?                                                   │
│        ──► tabLayoutAtom.removePaneFromLayout                     │
├───────────────────────────────────────────────────────────────────┤
```

Canvas width stays intact on every line.  Identifier stays intact
on its own row.  Both contracts honored — no tradeoff needed.  If
the wrap makes the block too tall, widen the block's canvas width
instead of breaking the frame.


─── Verification checklist ──────────────────────────────────────────

Run this before shipping a response.  Every item must pass.

```
  [ ] Canvas width committed and consistent across the block?
  [ ] Every rule/border exactly canvas-width?
  [ ] Every content row right-padded to the right alignment column?
  [ ] Right edges line up when you scan vertically?
  [ ] No markdown syntax inside (#, **bold**, | col |, - bullet)?
  [ ] No identifier truncated mid-token?
  [ ] Breathing room present (blank row after ┌─┐, before └─┘,
      between semantic groups)?
  [ ] One shape per block (no nested nesting beyond sub-framed grid)?
  [ ] Shape choice matches content type from the vocabulary picker?
  [ ] Sections have heading → block → heading rhythm?
  [ ] Closing synthesis ("My read" or summary) present for long
      responses?
  [ ] Arrows consistent (──► ◄── ▼ only; no → ⇒ -> mixing)?
  [ ] Single borders (╔═╗ used only for rare focal emphasis)?
```

Any "no" ──► fix before shipping.  The difference between readable
TUI output and unreadable mess is this checklist.
