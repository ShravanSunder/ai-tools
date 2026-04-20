---
name: tui-presentation
description: MUST USE for VISUAL / EXPLANATORY chat responses where no markdown renderer exists — design, architecture, comparisons, tradeoffs, UI mockups, flows, state machines, debugging narratives, multi-section explanations that benefit from diagrams. Teaches seven-shape vocabulary, document structure, cordoning, indentation, and build discipline using Unicode box-drawing (chat has no markdown parser; `#`, `**bold**`, `| col |` render literally). DO NOT use when user requested a specific format (JSON, YAML, markdown, code block), response is schema-bound or machine-readable, response is code/config generation, or response is a single terse answer. User-specified format always wins over this skill's defaults. Triggers on "draw it out", "show me", "compare", "design", "architecture", "explain", "structure", "flow", "layout", "tradeoff", "how would X look".
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

Use for:

  ▸ "Draw / show / compare / explain / design" prompts
  ▸ Architecture proposals, state machines, data flows, pipelines
  ▸ Tradeoff analyses, review syntheses, debugging explanations
  ▸ Multi-section explanations that benefit from visual structure
  ▸ Any sequential process (lifecycle, close-pipeline, build order)

Do NOT use for:

  ▸ User-requested specific format (JSON, YAML, markdown, code block)
  ▸ Schema-bound or machine-readable output (API specs, config files)
  ▸ Code or config generation — let the code speak
  ▸ Single-line answers, simple Q&A — over-application hurts
  ▸ Terse reviews or status updates where plain prose is enough

User-specified format ALWAYS wins over this skill's defaults.


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

  ▸ Comparing options, alternatives, or  →  4  Column-ruled
    states at time N / N+1?

  ▸ Walking through numbered steps?      →  5  Pipeline box
  ▸ State machine with transitions?      →  6  State diagram
  ▸ Plain list, aligned columns?         →  7  No-frame list

Anti-pattern: reaching for one big ╔═╗ box and cramming a flow +
table + prose inside it.  Pick the shape per content type.  One
shape per block.

Progressive disclosure: for per-shape worked examples with geometry
commentary, see build-discipline.md → Shape catalog.  For six
compositional applications (phase-sequence, Q&A rationale, review
findings with severity, dual-tag title band, scope inventory with
subsections, file-tree content pattern), see build-discipline.md →
Shape variants and applications.


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

Important — cordon bracket ≠ section rule above.  A section rule
`─── Section ───` sitting above your block does NOT count as the
cordon bracket.  Cordon brackets are DEDICATED `───` rules that
bracket JUST the diagram (one immediately above, one immediately
below, with no intervening prose or other rules).  When in doubt,
use a frame `┌─┐` — unambiguous.

Spacing rules:

  ▸ Around a frame: blank line before, blank line after
  ▸ Inside a frame: blank row after ┌─┐, blank row before └─┘
  ▸ Between items in a frame: blank row between semantic groups
  ▸ Between sections: ─── label ─── with blank lines above and below

  ▸ Section rule format: `─── LABEL ` followed by `─` chars filling
    to canvas width.  Nothing else on that line — no content, no
    trailing words, no mid-line text wraps.

  ▸ Between paragraphs: always a blank line — prose never stacks
    directly against prose

  ▸ Between items in a list (bulleted ▸ or numbered 1. 2. 3.): blank
    line when items are substantial (>1 line each); no blank when
    items are single short lines — keep them tight

  ▸ After a bullet list: blank line before the next paragraph or block

Cramped output is unreadable.  Whitespace IS cognitive rest.  Pay
the tokens — breathing is always worth it.

Skim test (run before finishing):

  ▸ Can each section boundary be identified at a glance?
  ▸ Do diagrams visually separate from surrounding prose?
  ▸ Do parallel concepts look parallel (aligned widths and positions)?
  ▸ Does one concept end clearly before the next begins?

Any "no" → add cordoning.

Progressive disclosure: for a WRONG/RIGHT comparison showing what
over-framing looks like vs. splitting into appropriate shapes, see
build-discipline.md → Shape anti-patterns.


─── Indentation — the horizontal hierarchy axis ─────────────────────

Vertical structure uses rules, frames, and blank lines.  Horizontal
structure uses indentation.  Both matter equally.  A response with
correct vertical structure but flat indentation collapses hierarchy
— the reader can't tell what's a label, what's sub-content, what's
continuation.

Indent rules:

  ▸ Label → PROSE content: indent content 2 spaces under the label

       What you expect:

         drawer drag
           ──► only drawer rearrange active
           ──► main panes stay inert

  ▸ Continuation of a wrapped line: hang-indent 2 spaces under the
    line's starting column (NOT under the first word after a colon —
    that would be traditional publishing hang-indent, not our style)

       Problem: the drawer pane publishes frames into both the
         drawer-local map AND the main tab container map, which
         explains the hover leak.

  ▸ Code/identifier inline with prose: indent 4 spaces to set it off

       In PaneLeafContainer, when a pane is in the drawer:

           useDrawerFramePreference == true

       and it publishes both DrawerPaneFramePreferenceKey and
       PaneFramePreferenceKey.

  ▸ Nested sub-items: indent 2 more spaces per nesting level

       Current ownership:

         drag starts on drawer pane
           drawer overlay receives the update
             routes to DrawerSplitContainerDropCaptureOverlay
           main tab overlay receives the update
             routes to SplitContainerDropCaptureOverlay

    (Tree-drawing with ├── / │ / └── is a separate convention — those
    characters supply their own visual hierarchy; don't combine them
    with 2-per-level indent rules in the same block.)

  ▸ Inside a frame: content indents 2 spaces from the left │ (already
    embedded in framed-card alignment)

Important — rule 9 applies to bullets and numbered lists too.

Under a prose label, bullet / numbered items indent 2 spaces:

  Use for:

    ▸ bullet 1
    ▸ bullet 2

The marker (▸ or 1.) sits at the indent position — it IS the first
content character at that indented level.

What's EXEMPT from rule 9 (doesn't need the +2):

  ▸ Tables (│ borders supply their own offset)
  ▸ Framed cards (┌─┐ borders supply their own offset)
  ▸ Fenced code blocks (clearly-marked sub-regions)
  ▸ Top-level content with no prose label above it

Indent is load-bearing.  Without it, "What you expect:" and the
expected behavior look like two unrelated lines instead of
heading → body.  Pay the 2-4 characters — the cognitive savings
for the reader are enormous.

Three label patterns — don't conflate them:

This is the single most common ambiguity in TUI output.  Each
pattern has DIFFERENT indent behavior.  Mixing them produces
"heading with unrelated content below" that breaks readability.

Pattern 1: Section rule (canvas-wide)

Section rules always start at canvas column 0.  Content flows
flush-left below — no indent.  The ─── rule IS the separator;
the content doesn't need additional visual offset.

─── My read ──────────────────────────────────────────────────────────

Closing synthesis at col 0, not indented under anything.  Another
paragraph here would also start at col 0.

Use when: top-level section boundaries, closing synthesis.

Pattern 2: Subsection heading (inside a frame)

The example below is shown inside a parent frame (e.g. a PHASE 1
scope inventory).  The 2-space offset from canvas col 0 comes from
being nested inside that parent frame's inner content area.

  │  IN SCOPE                                         │
  │  ─────────                                        │
  │                                                   │
  │  Content at same indent as the label.             │

Content:  SAME indent as the label (e.g. 2 spaces from left │).
Use when: named regions inside a parent frame (scope inventory,
component spec, phase plan).

Pattern 3: Prose label (inline)

Problem:

  the drawer pane publishes frames into both maps,
  which explains the hover leak.

Content:  INDENTED 2 spaces under the label (rule 9).
Use when: inline labeling inside prose flow.

Biggest trap: writing "My read:" (prose-label form) when you meant
Section rule.  "My read:" triggers rule 9 (indent content 2 spaces).
For closing synthesis, always use Pattern 1 — `─── My read ───`
with flush-left prose below.

Progressive disclosure: for WRONG/RIGHT worked examples of each
indent pattern (label → content, nested sub-items, code snippet
inline, continuation hang-indent), see build-discipline.md →
Indentation recipes.


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

Progressive disclosure: for cell-width arithmetic, junction-character
selection, padding rules, consistency-rule enforcement, and a
Before/After drift-repair example, see build-discipline.md →
Alignment recipes.


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
    long responses.  Use `─── My read ───` section rule form with
    flush-left prose below.  Do NOT write "My read:" as a prose
    label — that form triggers rule 9 (indent content) and reads
    as a mid-discussion bullet, not a response-closing block.


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
│  8.  Identifiers never truncate mid-token.  Wrap to next line.      │
│  9.  Indent content under its label.  2 spaces minimum.  Continua-  │
│      tion lines hang-indent.  Sub-items nest deeper.                │
│ 10.  Every diagram / flow / code block is cordoned — framed, OR     │
│      bracketed with ─── rules above/below, OR indented 4 spaces     │
│      under its label.  Never loose in prose.                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


─── Overflow policy ──────────────────────────────────────────────────

Canvas width is non-negotiable.  Every row ends at column 70 (or
whatever canvas is committed for the block).  When content exceeds
a cell width, choose one of (in preference order):

  1. Shorten non-identifier prose with `…` — preferred, no reflow

       "a very long descriptive phrase"  →  "a very long descriptive…"

  2. Wrap to next line — required when an identifier is present or
     prose is too long to shorten meaningfully

     ```
     │ Problem: the drawer pane publishes frames into both the     │
     │   drawer-local map AND the main tab container map, which    │
     │   explains the hover leak.                                  │
     ```

     Continuation hang-indents 2-4 spaces under the first content
     character of the wrapped line.

  3. Widen the column — reflow the whole block, only if shorten
     loses meaning AND wrap is ugly

Identifier rule: code identifiers (function names, file:line refs,
type names) are NEVER truncated mid-token.  Wrap them onto the next
line so canvas width stays intact.  Do NOT let an identifier extend
past the right border — that breaks the frame contract.  Geometry
stays fixed; wrap the identifier instead.

Progressive disclosure: for worked shorten / wrap / widen examples
and the identifier-wrap before/after demonstration, see
build-discipline.md → Overflow recipes.


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
    recipes, verification checklist.  Also six framed-card applica-
    tions: phase-sequence, Q&A rationale, review findings w/ severity,
    dual-tag title band, scope inventory w/ subsections, file-tree
    content pattern.

  ▸ references/tables.md — table patterns deep-dive
  ▸ references/ui-layouts.md — sidebar/main, tiled, modal, nested
  ▸ references/architecture.md — client/API/DB, pub/sub, layered
  ▸ references/sequence-and-state.md — sequences, state machines
  ▸ references/annotations-and-specs.md — callouts, variants, specs
