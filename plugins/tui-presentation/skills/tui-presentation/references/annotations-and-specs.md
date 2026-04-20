Annotations and Specs
══════════════════════════════════════════════════════════════════════

Deep-dive reference for annotation patterns — callouts on mockups,
variant series, visual specs with measurements, and titled frames
for design proposals.


─── Component with callouts from below ──────────────────────────────

```
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

```
Default:         [◫]                  (no number, no name)
Custom on #2:    [◫  2 · coding]      (number + name)
Long name:       [◫  2 · my-long-na…] (truncate name at 12 chars)
Focused:         ╔◫  2 · coding╗      (double border for focus)
```

Show all important variants together, one per line, label on the
left, annotation in parens on the right.


─── Visual spec with inline measurements ────────────────────────────

```
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

Diagram at top, bulleted spec below.  Keep names/values aligned as
columns.


─── State variants (Rest/Hover/Active/Pressed) ──────────────────────

```
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

Each state gets a labeled mockup, a brief right-side note
explaining the change.


─── Titled frame for a design proposal ──────────────────────────────

```
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

Double border (╔═╗ ║ ╚═╝) wraps the entire proposal.  Title on top
row.  Separator ╠═╣ between title and body.  Use for design
proposals that need to stand apart from surrounding chat — this is
a legitimate "rare focal emphasis" case per the core rules.
