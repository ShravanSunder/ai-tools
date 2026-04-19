---
name: tui-presentation
description: MUST USE whenever presenting design, architecture, comparisons, options, tradeoffs, explanations, UI mockups, data flows, system structure, or any complex idea that benefits from visual clarity. Strong user preference — reach for tables, diagrams, annotated components, and structured layouts instead of dense prose. Triggers on "how would X look", "compare", "design", "architecture", "explain", "options", "proposal", "tradeoff", "structure", "flow", "layout", or whenever two or more items need comparison or a system needs to be shown.
---

# Presenting Information

Visual-first presentation for design, comparisons, architecture, and explanations. Monospace Unicode box-drawing. Diagram first, prose supports.

## When to use

- Comparing two or more options (pros/cons, feature matrix, drift table)
- Proposing a design (UI mockup, architecture, component spec)
- Explaining structure (layouts, flows, state transitions)
- Showing variants or states (Default/Custom/Edge, Rest/Hover/Active)
- Any answer where a visual would land faster than prose

## Core principles

- **Visual first.** Show the diagram before the explanation. Don't narrate what the reader will see — show it, then caption in one line.
- **Caption below, not narration above.** One line of what it is, not three paragraphs about what you're about to draw.
- **One-line insight.** After the caption, state the key tradeoff or decision in one sentence.
- **Offer next move.** End with a concrete option the user can pick or redirect.
- **Monospace-safe.** Assume no proportional rendering.
- **Prefer vertical over wide.** Max 80 chars per line; stack vertically when content wants more width.

## Character palette

```
┌ ─ ┐ │ └ ┘ ├ ┤ ┬ ┴ ┼        single borders (structure)
╔ ═ ╗ ║ ╚ ╝ ╠ ╣ ╦ ╩ ╬        double borders (emphasis / titled frames)
▶ ▷ ◀ ◁ ▲ ▽ → ← ↑ ↓ ↔        arrows
● ○ ◆ ◇ ■ □ ▸ ▹ ★ ✓ ✗        markers
```

Never mix with plain ASCII `+--+ | |` — pick Unicode and stay there.

## Five core patterns

### 1. Comparison table

```
┌─────────────┬──────────────────────┬──────────────────────┐
│ Option      │ Pro                  │ Con                  │
├─────────────┼──────────────────────┼──────────────────────┤
│ Index "2"   │ Maps to ⌘2 muscle    │ Meaningless without  │
│ (current)   │ memory, uniform      │ layout map           │
├─────────────┼──────────────────────┼──────────────────────┤
│ Named       │ Self-explanatory,    │ Variable width       │
│             │ teaches the app      │ breaks rhythm        │
└─────────────┴──────────────────────┴──────────────────────┘
```

For depth: `references/tables.md`

### 2. UI mockup with annotation

```
┌──────────────────────┐
│  ◫   2 · coding      │
│  ▲   ▲   ▲           │
│  │   │   └─ name: .secondary, truncate at 12 chars
│  │   └───── index: .semibold, shortcut anchor
│  └───────── icon: compactIconSize
└──────────────────────┘
```

For depth: `references/ui-layouts.md`, `references/annotations-and-specs.md`

### 3. Architecture with labeled arrows

```
 ┌────────┐   HTTP    ┌────────┐   queue   ┌────────┐
 │ Client │ ────────▶ │ API    │ ────────▶ │ Worker │
 └────────┘           └───┬────┘           └────────┘
                          │
                          ▼
                     ┌────────┐
                     │ Cache  │
                     └────────┘
```

For depth: `references/architecture.md`

### 4. Sequence / time-ordered flow

```
Client          API           DB
  │              │             │
  │── request ─▶ │             │
  │              │── query ──▶ │
  │              │◀─ rows ──── │
  │◀── 200 ───── │             │
```

For depth: `references/sequence-and-state.md`

### 5. Variant series

```
Default:         [◫]
Custom on #2:    [◫  2 · coding]
Long name:       [◫  2 · my-long…]
```

For depth: `references/annotations-and-specs.md`

## Titled frames

Wrap a design proposal in a double-border frame so it stands apart from surrounding chat:

```
╔═══════════════════════════════════════════════════════╗
║ Tab bar — proposed state                              ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   [mockup here]                                       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Use for: a complete design proposal, an important state snapshot, anything the user should visually anchor on.

## The three hard parts

These are where quality most often breaks. Discipline here matters more than palette choice.

### Column-width discipline (tables)

Build the grid first, fill content second:

```
Step 1: decide column widths (count characters)
Step 2: draw top border, separators, bottom with identical widths
Step 3: fill each cell, pad with spaces to match cell width
Step 4: verify every row has the same total character count
```

Multi-line cells: pad shorter cells with spaces so all cells in a row have equal line count.

### Junction characters (boxes and tables)

Pick the junction by which sides connect:

```
┌  ┐       corners (2 sides)
├  ┤       T-junctions (3 sides, horizontal to right/left)
┬  ┴       T-junctions (3 sides, vertical down/up)
┼          cross (4 sides)
```

Never drop to `+` mid-diagram.

### Arrow landing

Arrows need to land on a character, not float:

```
┌─────┐   label   ┌─────┐       good — label rides the line
│  A  │──────────▶│  B  │
└─────┘           └─────┘

┌─────┐           ┌─────┐       bad — arrow floats, label orphaned
│  A  │     →     │  B  │
└─────┘           └─────┘
```

## Response layout

Structure every design-chat response this way:

```
1. Diagram                    (the proposal itself)
2. One-line caption           (what it shows)
3. Insight or tradeoff        (why this shape — one sentence)
4. Next move                  (options for user to pick or redirect)
```

Prose supports the visual; it does not replace it.

## Progressive disclosure

Load the matching reference when you need depth:

- `references/tables.md` — comparison, drift/diff, feature matrix, highlighted rows
- `references/ui-layouts.md` — sidebar/main, tiled, modal, nested cards, chips
- `references/architecture.md` — client/API/DB, pub/sub, layered stacks, pipelines
- `references/sequence-and-state.md` — sequence diagrams, state machines, decision trees
- `references/annotations-and-specs.md` — callouts, variant series, visual specs, titled frames
