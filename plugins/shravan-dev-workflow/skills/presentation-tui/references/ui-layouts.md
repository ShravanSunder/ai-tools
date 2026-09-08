UI Layouts
══════════════════════════════════════════════════════════════════════

This reference owns: TUI mockup patterns for interface composition,
panel arrangements, modal overlays, and dashboards.
Expected inputs: the interface being described and its focal target,
selected by the SKILL.md caller.
Return: the layout pattern and focus treatment.
Complete when: the layout relationship is unambiguous and any real
focal target is marked exactly once.

Focus treatment — inspect before drawing: what should the reader's
eye land on first?  One focal target gets one emphasis device (double
border, FAILED row, or an arrow — never several at once).  Bad focus:
every panel equally loud, an invented focal target the content does
not name, or emphasis devices mixed in one mockup.  If no element is
genuinely focal, use plain single borders everywhere and stop.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ ../../../shared-references/diagram-semantics.md — preview/detail and staged explanation
  ▸ shape-catalog.md ──► Shape 1 (Framed card) and Shape 2 (Sub-framed grid) — worked examples and geometry for nested frames
  ▸ build-discipline.md ──► Alignment recipes — mechanics for multi- cell frames and sub-frame sizing
  ▸ annotations-and-specs.md — callouts on mockups, visual specs with measurements


─── Preview / detail ────────────────────────────────────────────────

Use preview/detail when the user needs a quick orientation plus one focused inspection area.

```text
┌─ Preview ───────────────────────────┐
│ controller ──► plugin ──► renderer  │
└─────────────────────────────────────┘

Detail:
  selected slice  plugin ──► semantic markdown boundary
  proof           code stays fenced; links stay clickable
```

Do not put the detailed code/config inside the preview frame.


─── Quiet success / loud failure ────────────────────────────────────

Use quiet success when most rows are normal and one failure needs the eye.

```text
ok       reference loaded
ok       shape selected
FAILED   code was redrawn as table text
next     keep code fenced and rerun pressure scenario
```

Avoid styling every row as equally urgent.


─── Sidebar + main content ──────────────────────────────────────────

```text
┌─────────────────────────────────────────┐
│  ┌──────────┐   ┌────────────────────┐  │
│  │ Sidebar  │   │ Main Content       │  │
│  │          │   │                    │  │
│  │ ▸ Home   │──▶│  Active Panel      │  │
│  │ ▸ Search │   │                    │  │
│  │ ▸ Config │   │                    │  │
│  └──────────┘   └────────────────────┘  │
└─────────────────────────────────────────┘
```

Classic two-pane.  Arrow shows focus relationship between nav and content.


─── Tiled panes (split view) ────────────────────────────────────────

```text
┌─────────────────────┬─────────────────────┐
│ Editor              │ Preview             │
│                     │                     │
│ file.ts             │ [rendered output]   │
│ ...                 │                     │
├─────────────────────┼─────────────────────┤
│ Terminal            │ Logs                │
│ $ pnpm test         │ [tail -f output]    │
└─────────────────────┴─────────────────────┘
```

Four-pane quadrant.  Use ├─┼─┤ for the interior junction.


─── Modal overlay (double border for modal) ─────────────────────────

```text
┌──────────────────────────────────────────┐
│ Base view (dimmed)                       │
│                                          │
│       ╔════════════════════════╗         │
│       ║ Confirm action         ║         │
│       ╠════════════════════════╣         │
│       ║ Delete 3 items?        ║         │
│       ║                        ║         │
│       ║  [Cancel]   [Delete]   ║         │
│       ╚════════════════════════╝         │
│                                          │
└──────────────────────────────────────────┘
```

Double border elevates the modal above the single-border base. Emphasis through border weight.  This is a legitimate use of ╔═╗ per the "rare focal emphasis" rule.


─── Nested cards with focus ─────────────────────────────────────────

```text
┌─ Workspace ─────────────────────────────┐
│                                         │
│  ┌─ Projects ──────────────────────┐    │
│  │  ┌─────────┐  ┌─────────┐       │    │
│  │  │ Project │  │ Project │       │    │
│  │  │   A     │  │   B     │       │    │
│  │  └─────────┘  └─────────┘       │    │
│  │  ╔═════════╗                    │    │
│  │  ║ Project ║  ← focused         │    │
│  │  ║   C     ║                    │    │
│  │  ╚═════════╝                    │    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

Titles inline on the border (`─ Title ─`).  Focus shown with double border on the specific item.


─── Tab bar / chip variants ─────────────────────────────────────────

```text
Default:        ┌──────┐
                │  ◫   │
                └──────┘

Custom name:    ┌──────────────────────┐
                │  ◫   2 · coding      │
                └──────────────────────┘

Long name:      ┌──────────────────────┐
                │  ◫   2 · my-long-na… │
                └──────────────────────┘
```

Show the component's states as a vertical series, labels on the left.
