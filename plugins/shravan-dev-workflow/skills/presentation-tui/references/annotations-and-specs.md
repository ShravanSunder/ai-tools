Annotations and Specs
══════════════════════════════════════════════════════════════════════

This reference owns: annotation patterns — callouts on mockups,
variant series, visual specs with measurements, and titled frames for
design proposals.
Expected inputs: the mockup or spec being annotated and the elements
the user asked about, selected by the SKILL.md caller.
Return: the annotation pattern applied.
Complete when: each requested or load-bearing element maps uniquely to
one annotation, and no annotation exists for anything else.

Annotate only requested or load-bearing elements.  Bad annotation:
callouts on every element, crossing connector lines, a measurement
the user asked for missing while decorative ones remain, or an
annotation whose target is ambiguous.  Stop when every requested
annotation reads unambiguously against its target.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, character palette
  ▸ shape-catalog.md ──► Shape 1 (Framed card) — title-in-top-border pattern for titled frames; Shape 1 applications (dual-tag, scope inventory) for richer frame title treatments
  ▸ ui-layouts.md — UI mockup patterns that annotations live under


─── Component with callouts from below ──────────────────────────────

```text
┌──────────────────────┐
│  ◫    2  ·  coding   │
│  ▲    ▲  ▲  ▲        │
│  │    │  │  └─ name: system(textXs, .regular), .secondary
│  │    │  └──── middot: .tertiary
│  │    └─────── index: system(textXs, .semibold), .secondary
│  └──────────── icon: compactIconSize, .secondary
└──────────────────────┘
```

Pattern: mockup at top, ▲ under each element, │ continuing down,
└─ branching to label text.  Each callout is one line.  Read top-
down.


─── Variant series ──────────────────────────────────────────────────

```text
Default:         [◫]                  (no number, no name)
Custom on #2:    [◫  2 · coding]      (number + name)
Long name:       [◫  2 · my-long-na…] (truncate name at 12 chars)
Focused:         ╔◫  2 · coding╗      (double border for focus)
```

Show all important variants together, one per line, label on the left, annotation in parens on the right.


─── Visual spec with inline measurements ────────────────────────────

```text
┌──────────────────────────────┐
│  ◫    2  ·  coding           │   22pt tall, capsule background
└──────────────────────────────┘

 Spec:
   gap(icon → text):   6pt
   gap(index · name):  4pt around middot
   padding:            6pt leading, 8pt trailing
   background:         AppStyle.fillMuted (rest) → fillPressed
   shape:              Capsule
```

Diagram at top, bulleted spec below.  Keep names/values aligned as columns.


─── State variants (Rest/Hover/Active/Pressed) ──────────────────────

```text
 Rest:      ┌──────────────────┐      fillMuted
            │  ◫   2 · coding  │
            └──────────────────┘

 Hover:     ┌──────────────────┐      fillMuted.hover
            │  ◫   2 · coding  │
            └──────────────────┘

 Active:    ╔══════════════════╗      fillActive (stays pressed)
            ║  ◫   2 · coding  ║
            ╚══════════════════╝
```

Each state gets a labeled mockup, a brief right-side note explaining the change.


─── Titled frame for a design proposal ──────────────────────────────

```text
╔═══════════════════════════════════════════════════════╗
║ Tab bar — proposed redesign                           ║
╠═══════════════════════════════════════════════════════╣
║                                                       ║
║   ┌────┐  ┌──────────────────────────────────┐        ║
║   │ ▤  │  │ agent-vm · master            ⌘1  │        ║
║   └────┘  └──────────────────────────────────┘        ║
║                                                       ║
║   [chip visible when arrangement is custom]           ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
```

Double border (╔═╗ ║ ╚═╝) wraps the entire proposal.  Title on top row.  Separator ╠═╣ between title and body.  Use for design proposals that need to stand apart from surrounding chat — this is a legitimate "rare focal emphasis" case per the core rules.
