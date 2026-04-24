---
name: tui-presentation
description: Use for in-chat design and explanatory responses on chat or TUI surfaces where markdown does not render — `#`, `**bold**`, `| col |`, and `- bullet` appear as literal text. Codex: MUST load for in-chat design. Covers design proposals, architecture, comparisons and tradeoffs, UI mockups, flows, state machines, debugging narratives, and multi-section explanations. Teaches a seven-shape Unicode vocabulary with cordoning, indentation, and alignment discipline. Skip for JSON/YAML/code-only output, schema-bound replies, or terse answers.
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
it.  Full worked examples in references/shape-catalog.md.

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

  ▸ Scoped concept with a title?         ──►  1  Framed card
  ▸ Multiple things side-by-side?        ──►  2  Sub-framed grid
  ▸ Multiple findings/concerns?          ──►  3  Ruled card

  ▸ Comparing options, alternatives, or  ──►  4  Column-ruled
    states at time N / N+1?

  ▸ Walking through numbered steps?      ──►  5  Pipeline box
  ▸ State machine with transitions?      ──►  6  State diagram
  ▸ Plain list, aligned columns?         ──►  7  No-frame list

Mermaid translations (when user asks for a Mermaid diagram — chat
has no Mermaid renderer, translate to the TUI equivalent):

```
User's ask                  TUI shape to use
─────────────────────       ─────────────────────────────────
flowchart (linear)          Shape 5 Pipeline box
flowchart (branching)       Shape 6 State diagram
graph LR / TD (system)      architecture.md patterns
sequenceDiagram             sequence-and-state.md → Sequence
stateDiagram                Shape 6 State diagram
classDiagram                Shape 1 Framed card w/ fields
erDiagram                   Shape 1 Framed card per entity
C4 / architecture           architecture.md → layered / fan-out
```

Anti-pattern: reaching for one big ╔═╗ box and cramming a flow +
table + prose inside it.  Pick the shape per content type.  One
shape per block.

Progressive disclosure: for per-shape worked examples with geometry
commentary, see shape-catalog.md ──► Shape catalog.  For six
compositional applications (phase-sequence, Q&A rationale, review
findings with severity, dual-tag title band, scope inventory with
subsections, file-tree content pattern), see shape-catalog.md ──►
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

Important — the title is YOUR response's topic, not the skill's name.
Never emit "TUI Presentation" as a title — that's the skill file's
own H1 (reference header), not a template for your response's
opening line.

  Wrong:  response begins with "TUI Presentation\n═══════..."
  Right:  response begins with your actual topic, e.g.
          "How we're handling the cache-invalidation race\n═══════..."


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

Any "no" ──► add cordoning.

Progressive disclosure: for a WRONG/RIGHT comparison showing what
over-framing looks like vs. splitting into appropriate shapes, see
shape-catalog.md ──► Shape anti-patterns.


─── Indentation — the horizontal hierarchy axis ─────────────────────

Vertical structure uses rules, frames, and blank lines.  Horizontal
structure uses indentation.  Both matter equally.  A response with
correct vertical structure but flat indentation collapses hierarchy
— the reader can't tell what's a label, what's sub-content, what's
continuation.

Indent rules:

  ▸ Label ──► PROSE content: indent content 2 spaces under the label

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
heading ──► body.  Pay the 2-4 characters — the cognitive savings
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

Common failure — prose-label with arrow sub-items:

  WRONG (ASCII `->` + no indent under label — rules 6 and 9 both):

    main pane
    -> grab handle
    -> live target appears immediately
    -> drop reorders / splits

  RIGHT (──► arrow + 2-space indent):

    main pane
      ──► grab handle
      ──► live target appears immediately
      ──► drop reorders / splits

Progressive disclosure: for WRONG/RIGHT worked examples of each
indent pattern (label ──► content, nested sub-items, code snippet
inline, continuation hang-indent), see build-discipline.md ──►
Indentation recipes.


─── Structural elements — atoms of a section ────────────────────────

Inside a section (between ─── label ─── rules) or inside a frame,
content uses one of these structural atoms.  Each has its own
indent, wrap, and arrow conventions.  Pick the atom by content
type — forcing one form when another fits better produces
choppy or flat output.

Prose paragraph — DEFAULT for flowing argument or narrative.

  Full sentences, multi-clause OK, wrap at canvas 70.  Continuation
  at the same indent as the paragraph's start.  Blank line between
  paragraphs.  Use when the content is a connected argument or
  explanation — don't fragment an argument into label+bullet form
  just to look structured.

Glossary entry — term + indented definition, for name-value pairs.

  allowRepoResources
    controls whether controller reads `.agent-vm/resources.json`
    from repo

  externalResources
    trusted static registry compiled into Gondolin tcpHosts

  Term at col N.  Definition at col N+2.  Wrap continues at col N+2.
  Blank line between entries.  Use when defining multiple named
  things briefly.

Labeled callout — `Label:` + indented content, for a named section.

  Current limitation:
    convention-only.  No Zod manifest.  No catalog permission.
    No task selection.

  Label ends with `:`.  Content at col+2.  Content may be prose,
  glossary entries, lists, or a mix.  Use when naming a concept
  and providing its associated content.

Arrow-chain — label + sequence of causally-linked items.  Two
render forms:

  Form 1: Inline (compact)

    main pane
      ──► grab handle
      ──► live target appears immediately
      ──► drop reorders / splits

    Label at col N.  Arrow items at col N+2.  Wrap continues at
    the content char after the arrow (col N+6).  Use when 3-6
    short single-line items, compact context.

  Form 2: Vertical flow (breathing)

    task asks for resources
           │
           ▼
    delegator / upstream resolves them
           │
           ▼
    controller compiles boot overlay
           │
           ▼
    Gondolin boots

    Each step at col N on its own line.  `│` connector at a
    fixed column (pick one, stay consistent), `▼` on next line
    at same column.  Blank-line breathing between steps.  Use
    when 3-8 steps, longer descriptions, narrative-of-a-process
    that needs visual breathing.

  Never use `↓ ↑ → ⇒ ->` — see rule 6.  Always `▼ ──►`.

Bulleted list — `▸ item` at consistent indent.  See spacing rules.

Numbered list — `1. 2. 3.` with consistent-width numbers.  See
spacing rules.


─── When ──► is called for (vs. plain item) ─────────────────────────

Use `──►` (or `▼` for Form 2) when the item represents FLOW,
SEQUENCE, RESULT, or CONSEQUENCE.  Don't use for plain enumeration.

  With arrow (sequence):           Without arrow (property/fact):

    main pane                        main pane
      ──► grab handle                  has a grab handle
      ──► drop reorders panes          supports drop-to-reorder

If removing the arrow would lose the causal or sequential reading,
keep it.  If the item is just a property, use `▸` bullet or plain
indent.


─── Vertical flow WRONG / RIGHT ─────────────────────────────────────

```
WRONG (single-char ↓, no connector, ambiguous grouping):

  task asks for resources
    ↓
  delegator / upstream resolves them
    ↓
  controller receives resolved manifest

RIGHT (proper ▼ with │ connector and breathing):

  task asks for resources
         │
         ▼
  delegator / upstream resolves them
         │
         ▼
  controller receives resolved manifest
```


─── Wrap rules — indent under first content char ────────────────────

When a line wraps, the continuation lands under the first content
character of the original line:

  Prose paragraph       ──►  continuation at same indent as start
  Bullet (▸ item)       ──►  continuation under "i" of "item" (col+2)
  Arrow item (──► x)    ──►  continuation under "x" (col+6 from ──►)
  Labeled callout body  ──►  continuation stays at body indent
  Glossary definition   ──►  continuation stays at definition indent


─── Why this matters ────────────────────────────────────────────────

Same content can use multiple atoms, but one is always best:

  ▸ Connected argument or narrative       ──►  prose paragraph
  ▸ Definitions of named things           ──►  glossary entry
  ▸ Named section with mixed content      ──►  labeled callout
  ▸ Sequence or causal chain (short)      ──►  arrow-chain Form 1
  ▸ Sequence or causal chain (breathing)  ──►  arrow-chain Form 2
  ▸ Discrete items at same level          ──►  bulleted list
  ▸ Ordered steps                         ──►  numbered list

Pick by content type, not by what "feels structured."  An
argument forced into arrow-chain form reads choppy.  Definitions
written as prose bury what the reader wants to find.


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

Per-shape alignment at a glance (full geometry in shape-catalog.md
worked examples):

```
Framed card      │ at col 0 and col N-1
Table            w1 + w2 + ... + wK + (K+1) = N
Pipeline box     ├──┤ at col 0 and col N-1; step nums same
                 width ("1. " = 3 chars, " 10. " = 4)
Column-ruled     no │ borders; whitespace separates cols
State diagram    state boxes same width; │/▼ at fixed col
Sub-framed grid  (Ns × K) + (K-1)·gap + 2·padding = inside
```

When in doubt: count characters.  If row 1's right edge is at col
70 and row 2's is at col 68, content drifted — pad with spaces or
trim with `…`.  Never silently ship mismatched widths.

Progressive disclosure: for per-shape alignment drilled through
worked examples, see shape-catalog.md ──► Shape catalog.  For cell-
width arithmetic, junction selection, padding rules, consistency-
rule enforcement, and a Before/After drift-repair example, see
build-discipline.md ──► Alignment recipes.


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

  ▸ Max 6 top-level sections.  7+ ──► break into a follow-up or ask
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
│  6.  Arrows: ──► ◄── ▼.  Never use `→ ⇒ -> ↓ ↑` or any other       │
│      single-char substitute.                                        │
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

       "a very long descriptive phrase"  ──►  "a very long descriptive…"

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
build-discipline.md ──► Overflow recipes.


─── Character palette ────────────────────────────────────────────────

ALLOWED characters.  Anything outside this list violates rule 6 or
rule 4.  Keep this palette strict — every character earns its place.

```
Single borders    ┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼
Double borders    ╔ ═ ╗ ║ ╚ ╝ ╠ ╣ ╦ ╩ ╬   (rare focal emphasis only)
Arrows            ──► ◄── ▼ │             (3-char horizontal, 1-char
                                           vertical connector + head)
Callout arrow     ◄──                      (always inline with data)
Markers           ✓ ✗ • ● ○ ◆ ▸ ▹ ★
Section rules     ═══   ───   ──────   ---
Overflow          …                         (ellipsis for shortening)
```

FORBIDDEN — common mistakes that violate the palette:

```
→ ⇒ -> ↓ ↑ ∨ ∧ ⟶ ⟵         wrong arrows.  Use ──► ◄── ▼
+ - (ASCII) for borders      wrong table chars.  Use ┌ ─ ┐ │ ...
# ## ###                     markdown headings.  Use ═══ or ───
**bold** *italic*            markdown emphasis.  Drop it OR frame it
- bullet                     ASCII bullet.  Use ▸ or • or 1.
| col | col |                markdown pipe-table.  Use ┌─┬─┐
` backtick` for emphasis     use framed callout or plain prose
```

Double borders (╔ ═ ╗ ║ ╚ ╝ ╠ ╣ ╦ ╩ ╬) — rare use only.  Reserved
for a single focal-emphasis block per response (e.g. one design
proposal that must stand apart).  Prefer single borders otherwise.

Keep the palette strict: if a character isn't on the ALLOWED list,
don't use it.  The vocabulary is small on purpose — a closed
vocabulary is scannable.


─── Progressive disclosure ───────────────────────────────────────────

For deeper work, load the matching reference:

  ▸ references/shape-catalog.md — full worked examples per shape
    (7 shapes: framed card, sub-framed grid, ruled card, column-
    ruled, pipeline box, state diagram, no-frame list), shape
    anti-patterns, and six compositional applications (phase-
    sequence, Q&A rationale, review findings with severity, dual-
    tag title band, scope inventory with subsections, file-tree
    content pattern).

  ▸ references/build-discipline.md — build mechanics: step-by-step
    procedure with output snapshots, alignment recipes (cell-width
    arithmetic, junctions, drift repair), indentation recipes
    (WRONG/RIGHT examples), overflow recipes (shorten/wrap/widen),
    and verification checklist.

  ▸ references/tables.md — table patterns deep-dive
  ▸ references/ui-layouts.md — sidebar/main, tiled, modal, nested
  ▸ references/architecture.md — client/API/DB, pub/sub, layered
  ▸ references/sequence-and-state.md — sequences, state machines
  ▸ references/annotations-and-specs.md — callouts, variants, specs
