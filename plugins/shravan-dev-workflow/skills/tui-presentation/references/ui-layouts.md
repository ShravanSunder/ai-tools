UI Layouts
══════════════════════════════════════════════════════════════════════

Deep-dive reference for UI mockup layouts.  Use these patterns when describing interface composition, panel arrangements, and modal overlays.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ progressive-disclosure.md — preview/detail and staged explanation
  ▸ shape-catalog.md ──► Shape 1 (Framed card) and Shape 2 (Sub-framed grid) — worked examples and geometry for nested frames
  ▸ build-discipline.md ──► Alignment recipes — mechanics for multi- cell frames and sub-frame sizing
  ▸ annotations-and-specs.md — callouts on mockups, visual specs with measurements


─── Preview / detail ────────────────────────────────────────────────

Use preview/detail when the user needs a quick orientation plus one focused inspection area.

```
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

```
ok       reference loaded
ok       shape selected
FAILED   code was redrawn as table text
next     keep code fenced and rerun pressure scenario
```

Avoid styling every row as equally urgent.


─── Sidebar + main content ──────────────────────────────────────────

```
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

```
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

```
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

```
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

```
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
