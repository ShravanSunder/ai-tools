---
name: tui-presentation
description: MUST USE for any response rendered in chat/TUI (no markdown renderer — `#`, `**bold**`, `| col |` all render literally). Teaches seven shape-vocabulary patterns, document structure, cordoning, and build discipline for design, architecture, comparisons, tradeoffs, UI mockups, flows, state machines, and multi-section explanations. Triggers on "draw it out", "show me", "compare", "design", "architecture", "explain", "structure", "flow", "layout", "tradeoff", "how would X look", or any response with a diagram, table, or more than one section.
---

TUI Presentation
══════════════════════════════════════════════════════════════════════

Visual-first presentation for chat/TUI output where no markdown
renderer exists.  Unicode box-drawing, whitespace, and alignment
are the complete structural toolkit.  This skill teaches seven
shapes, document structure, cordoning, and build discipline —
enough to produce output that reads cleanly and helps the reader
work faster.


─── When to use ──────────────────────────────────────────────────────

▸ Any response containing a diagram, table, or more than one section
▸ "Draw / show / compare / explain / design" prompts
▸ Architecture proposals, state machines, data flows, pipelines
▸ Tradeoff analyses, review syntheses, debugging explanations
▸ Any sequential process (lifecycle, close-pipeline, build order)
▸ NOT for: single-line answers, simple Q&A — over-application hurts


─── Rendering reality ────────────────────────────────────────────────

Chat output has no markdown renderer.  Hash-signs, double-asterisks,
pipe-tables, and hyphen-bullets all render as literal characters.
The only structural tools are Unicode box-drawing, whitespace, and
alignment.  Every principle below flows from this.

┌─ Hard limits ───────────────────────────────────────────────────────┐
│                                                                     │
│   ▸ Canvas width: 70 chars default, 120 hard cap                    │
│   ▸ Monospace only — no variable-width, kerning, or line-height     │
│   ▸ No HTML, no CSS, no images, no reliable color                   │
│   ▸ One medium, one pass: the reader sees exactly what was typed    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Ignore every markdown reflex.  A hash is a literal hash.  Double
stars around a phrase are literal stars around a phrase.  A pipe-
table is broken columns.  Structure with Unicode rules and frames
— or structure does not exist.


─── Shape vocabulary ─────────────────────────────────────────────────

Seven shapes.  Each does one job.  Pick by content type, then fill
it.  Full worked examples in references/build-discipline.md.

┌───┬──────────────────┬──────────────────────────┬──────────────────┐
│ # │ Shape            │ Use when                 │ Recognizable     │
├───┼──────────────────┼──────────────────────────┼──────────────────┤
│ 1 │ Framed card      │ Scoped concept w/ title  │ ┌─ Title ──┐     │
│ 2 │ Sub-framed grid  │ Parallel concepts grid   │ sub-┌┐ in parent │
│ 3 │ Ruled card       │ Similar items, sequence  │ #: / field: / ── │
│ 4 │ Column-ruled     │ Temporal/comparison data │ cols with ─────  │
│ 5 │ Pipeline box     │ Numbered sequential flow │ │1│ ├──┤ │2│     │
│ 6 │ State diagram    │ State machine, lifecycle │ ──► state ──►    │
│ 7 │ No-frame list    │ Reading-linear content   │ aligned cols     │
└───┴──────────────────┴──────────────────────────┴──────────────────┘

Picker cheat-sheet:

▸ Scoped concept with a title?         →  1  Framed card
▸ Multiple things side-by-side?        →  2  Sub-framed grid
▸ Multiple findings/concerns?          →  3  Ruled card
▸ Comparing states at time N / N+1?    →  4  Column-ruled
▸ Walking through numbered steps?      →  5  Pipeline box
▸ State machine with transitions?      →  6  State diagram
▸ Plain list, aligned columns?         →  7  No-frame list

Anti-pattern: reaching for one big ╔═╗ box and cramming a flow +
table + prose inside it.  Pick the shape per content type.  One
shape per block.


─── Golden example — a complete response ─────────────────────────────

One holistic example of what a full TUI response looks like.  Shows
title, framing, multiple sections, multiple shapes, cordoning, and
closing synthesis — all composed.  Use as a template: swap the
content, keep the structure.

Per-shape deep-dives with commentary live in build-discipline.md
and the peer references (tables, ui-layouts, architecture,
sequence-and-state, annotations-and-specs).

```
How we're handling the cache-invalidation race
══════════════════════════════════════════════

Short framing — 1-2 sentences on what this response is about.

─── Context ──────────────────────────────────────────────────────────

┌─ What's happening today ────────────────────────────────────────────┐
│                                                                     │
│  Writer commits.  Cache asynchronously invalidates on a separate    │
│  worker.  Reader between commit and invalidation sees stale data    │
│  — the classic TOCTOU window.                                       │
│                                                                     │
│  Rare under low load.  At scale, hits ~5% of reads.                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

─── Option comparison ────────────────────────────────────────────────

option A              option B                option C
──────────────        ────────────────        ──────────────────

synchronous           read-through with       version token on
invalidation          short TTL (30s)         every read

pro: consistent       pro: no writer          pro: writer-free;
                      latency cost            reads self-heal

con: writer           con: stale for          con: tokens leak
latency blows up      up to TTL               through the API

─── Decision flow ────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────┐
│ 1. write hits primary                                               │
├─────────────────────────────────────────────────────────────────────┤
│ 2. writer bumps version token atomically                            │
├─────────────────────────────────────────────────────────────────────┤
│ 3. cache write-through fires in the background                      │
├─────────────────────────────────────────────────────────────────────┤
│ 4. reader fetches                                                   │
│      token matches?    ──► serve cached                             │
│      token mismatch?   ──► bypass cache, serve from primary         │
└─────────────────────────────────────────────────────────────────────┘

─── My read ──────────────────────────────────────────────────────────

Option C.  Writer stays fast, reader is always consistent, and the
token leak is a one-time API hygiene cost we can fix later.  Option
B is tempting for simplicity but 30s of staleness is unacceptable
for our domain.  Option A pays the wrong cost on the wrong path.
```

What the example teaches:

▸ Title line + ═══ underline (H1-style), framing prose below
▸ ─── Section label ─── carries separator + heading (no stacked ---)
▸ Framed card (context) — prose body, title-in-border, breathing
▸ Column-ruled (comparison) — no vertical borders, whitespace gaps,
  ───── under each header, content stacks below
▸ Pipeline box (decision flow) — numbered steps with ├──┤ separators,
  sub-items indented with ──► arrows
▸ Closing "My read" synthesis — prose paragraph, not a frame


─── Separation & cordoning ───────────────────────────────────────────

Boxes bound concepts.  Rules separate concerns.  Whitespace gives
breathing.  A reader should identify each major concern in 2
seconds of scanning — the skim test.  When concerns blur together,
the response hurts velocity rather than helping it.  This is load-
bearing, not polish.

Four separation weights:

┌──────────┬────────────────────────────┬───────────────────────────┐
│ Weight   │ Signals                    │ Tool                      │
├──────────┼────────────────────────────┼───────────────────────────┤
│ Heaviest │ Extreme separation (title  │ ═══ canvas-wide rule      │
│          │ underline, topic change,   │ or === underline          │
│          │ very long response)        │                           │
├──────────┼────────────────────────────┼───────────────────────────┤
│ Standard │ Section boundary (common   │ ─── label ────            │
│          │ case — use this unless you │ or --- unlabeled          │
│          │ have reason not to)        │                           │
├──────────┼────────────────────────────┼───────────────────────────┤
│ Light    │ Block boundary within a    │ blank line                │
│          │ section                    │                           │
├──────────┼────────────────────────────┼───────────────────────────┤
│ Lightest │ Grouped items within a     │ 1-char gap / indent       │
│          │ block                      │                           │
└──────────┴────────────────────────────┴───────────────────────────┘

Pick ONE section marker per response and stay with it.  Don't stack
--- above ─── label ─── — redundant (both say "new section").  Use
heavier weight only for BIGGER concept boundaries; overuse numbs
the reader.

Cordoning techniques:

┌──────────────────┬──────────────────────────┬─────────────────────┐
│ Technique        │ When                     │ How                 │
├──────────────────┼──────────────────────────┼─────────────────────┤
│ Frame it         │ Concept needs a title    │ ┌─ title ──┐ with   │
│                  │ and stands alone         │ titled top border   │
├──────────────────┼──────────────────────────┼─────────────────────┤
│ Grid it          │ Parallel concepts at     │ sub-framed cards    │
│                  │ equal rank               │ inside a parent     │
├──────────────────┼──────────────────────────┼─────────────────────┤
│ Rule-separate    │ Similar items in         │ ruled cards with    │
│                  │ sequence                 │ ──── separators     │
├──────────────────┼──────────────────────────┼─────────────────────┤
│ Cordon a diagram │ Diagram adjacent to      │ frame it, OR        │
│                  │ prose                    │ bracket with ───    │
│                  │                          │ rules above/below   │
└──────────────────┴──────────────────────────┴─────────────────────┘

A diagram sitting loose in prose gets lost.  Cordon it off.

Spacing rules:

▸ Around a frame: blank line before, blank line after
▸ Inside a frame: blank row after ┌─┐, blank row before └─┘
▸ Between items in a frame: blank row between semantic groups
▸ Between sections: --- rule OR ─── label ─── with blanks around
▸ Inside prose: no extra spacing; prose flows

Cramped output is unreadable.  Whitespace IS cognitive rest.  Pay
the tokens — breathing is always worth it.

Skim test (run before finishing):

▸ Can each section boundary be identified at a glance?
▸ Do diagrams visually separate from surrounding prose?
▸ Do parallel concepts look parallel (aligned widths and positions)?
▸ Does one concept end clearly before the next begins?

Any "no" → add cordoning.


─── Diagram structure — alignment mechanics ──────────────────────────

The core rule: before emitting any row, know the alignment columns.

An alignment column is a character position where a structural char
(│, ├, ┼, ─) MUST land.  Every row in the block emits that char at
that column.  Non-negotiable.  Drift happens when a model
approximates widths row-by-row; the cure is pre-commitment.

Pre-commit before drawing:

1. Canvas width N (default 70)
2. Alignment columns — the exact columns where structural chars land
3. Cell widths that sum to fit between alignment columns

Per-shape alignment spec:

```
Framed card (canvas N):
  Alignment cols:  0 and N-1  (the │ borders)
  Top border:      ┌─[title]─...─┐     exactly N chars
  Content row:     │ content...  │     │ at col 0, │ at col N-1
  Bottom border:   └─...─┘              exactly N chars

Table (K cells, cell widths w1..wK):
  Constraint:   w1 + w2 + ... + wK + (K+1) = N
                                     ↑ K+1 separator chars (│)
  Alignment cols: 0, w1+1, w1+w2+2, ..., N-1
  Every │ and ┼ in the block lands at these exact columns.

Pipeline box:
  Step numbers all same width: "1. ", "2. ", ..., "9. "  (3 chars)
  If ≥10 steps, pad single digits: " 1. ", ..., "10. "   (4 chars)
  Dividers ├───┤ at col 0 and col N-1, ─ fills between.

Column-ruled (C columns):
  Pick a start column for each header; content stacks below
  ───── under each header is ≥ the header text width
  Gap between columns: 2-4 chars whitespace, consistent
  No │ borders — whitespace is the separator

State diagram:
  All state boxes the same width for visual rhythm
  Vertical connector │ / ▼ at one fixed column
  Lateral re-entry arm uses the left margin

Sub-framed grid (K sub-frames across):
  Sub-frame widths all equal: Ns
  Gap between sub-frames:     gap (3-4 chars)
  Parent inside width:        (Ns × K) + (K-1)·gap + 2·padding
  Parent frame width:         inside + 2 (for left/right │)
```

When in doubt: count characters.  If row 1's right edge is at col
70 and row 2's is at col 68, content drifted — pad with spaces or
trim with `…`.  Never silently ship mismatched widths.


─── Document skeleton ────────────────────────────────────────────────

Multi-section responses follow this template:

```
[Title line — prose, 1 line]
[Optional: ═══ canvas-width underline for the title]

[Framing — 1-2 sentences on what the response is about]

─── Section label ────────────────────────────────────────────────────

[Optional setup prose, 1-2 sentences]

[BLOCK — one shape from the vocabulary]

[Optional commentary prose, 1-2 sentences]

─── Next section ─────────────────────────────────────────────────────

[Next block]

─── My read ──────────────────────────────────────────────────────────

[Closing synthesis — prose paragraph or small summary frame]
```

Rules:

▸ One shape per block, one heading per section.  Want a second
  diagram?  Start a new section.
▸ Sections separated by ─── label ─── (labeled, preferred) OR ---
  (unlabeled).  Pick one style per response — don't stack.
▸ Max 6 top-level sections.  7+ → break into a follow-up or ask
  what to drill into.
▸ Closing synthesis ("My read" or summary frame) is mandatory for
  long responses.


─── Core rules ───────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  1.  Chat is not markdown.  No hash-signs, no **bold**, no pipe-    │
│      tables, no hyphen-bullets.                                     │
│  2.  Canvas width = 70.  Every row ends at column 70.               │
│  3.  Commit alignment columns BEFORE writing content.  Pad to them. │
│  4.  Single borders.  ┌─┐ only.  ╔═╗ almost never.                  │
│  5.  One shape per block.  One heading per section.                 │
│  6.  Arrows: ──► ◄── ▼.  Never mix with → ⇒ ->.                     │
│  7.  Breathing: blank after ┌─┐, before └─┘, between item groups.   │
│  8.  Identifiers never truncate mid-token.  Prefer wrap or widen.   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


─── Overflow policy ──────────────────────────────────────────────────

When content exceeds a cell width, choose (in preference order):

1. Shorten with `…` — preferred, no reflow
   `tabLayoutAtom.removePaneFromLayout` → `tabLayoutAtom.removePane…`

2. Wrap to next line — when the identifier can't be shortened

   ```
   │ Very long description that doesn't fit        │
   │   continuation, hanging-indented under the    │
   │   first content character                     │
   ```

3. Widen the column — reflow the whole block, only if shorten
   loses meaning

Identifier rule: code identifiers (function names, file:line refs,
type names) are NEVER truncated mid-token.  Prefer wrap, or accept
a ragged right edge where the identifier extends past the frame.
Geometry serves the identifier, not the other way around.


─── Character palette ────────────────────────────────────────────────

```
Single borders   ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼
Arrows           ──► ◄── ▼ │
Markers          ✓ ✗ • ● ○ ◆ ▸
Section rules    ═══   ───   ──────   ---
Callout arrow    ◄──   (always inline with data)
```

Double borders (╔ ═ ╗ ║ ╚ ╝ ╠ ╣) — rare use only, reserved for one
focal-emphasis block in a response.  Prefer single.


─── Progressive disclosure ───────────────────────────────────────────

For deeper work, load the matching reference:

▸ references/build-discipline.md — full worked examples per shape,
  build procedure with snapshots, alignment recipes, overflow
  recipes, verification checklist
▸ references/tables.md — table patterns deep-dive
▸ references/ui-layouts.md — sidebar/main, tiled, modal, nested
▸ references/architecture.md — client/API/DB, pub/sub, layered
▸ references/sequence-and-state.md — sequences, state machines
▸ references/annotations-and-specs.md — callouts, variants, specs
