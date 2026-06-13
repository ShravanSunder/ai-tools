Visual Family Selection
══════════════════════════════════════════════════════════════════════

Use this reference when the user asks for a diagram, visual model, or
"draw this out" answer and the best family is not obvious.  This file
chooses the family.  Domain references own worked examples.

Zoom is not a visual family.  Zoom is a disclosure move: start broad,
select one slice, then show detail.

For Mermaid requests, stay understanding-first.  Pick from a small set
of visual families before deciding whether an editor-rendered diagram
helps.  Do not build or recommend a broad Mermaid catalog.


─── Family Picker ───────────────────────────────────────────────────

```
ordered work or decision path      ──► flow
who talks to whom, in what order   ──► sequence
lifecycle states and transitions   ──► state
two independent axes               ──► quadrant / 2D
ownership and communication paths  ──► topology
```

Pick one primary family first.  Compose only when the secondary family
clarifies a local subproblem.


─── Flow ────────────────────────────────────────────────────────────

Use flow when the concept is ordered work, branching decisions, or a
pipeline.

```
input ──► parse ──► validate ──► output
                    │
                    ▼
                  error
```

Route worked examples to `architecture.md` or `shape-catalog.md`.


─── Sequence ────────────────────────────────────────────────────────

Use sequence when the story is who talks to whom, in what order.

```
controller      plugin          model
    │             │              │
    │── request ─▶│              │
    │             │── prompt ───▶│
    │             │◀─ output ─── │
    │◀─ render ── │              │
```

Route worked examples to `sequence-and-state.md`.


─── State ───────────────────────────────────────────────────────────

Use state when lifecycle, recovery, terminal states, or transitions are
the concept.

```
ready ──start──► rendering ──ok──► complete
  ▲                 │
  └──── retry ◄─────┘ failed
```

Route worked examples to `sequence-and-state.md`.


─── Quadrant / 2D ───────────────────────────────────────────────────

Use quadrant/2D when two independent axes explain the tradeoff.

```
                    high clarity
                         ▲
                         │
low effort ◄─────────────┼─────────────► high effort
                         │
                         ▼
                    low clarity
```

Use labels that are real tradeoff dimensions, not decorative axes.
Route fuller examples to `architecture.md` or `ui-layouts.md`.


─── Topology ────────────────────────────────────────────────────────

Use topology when boundaries, ownership, dependencies, or communication
paths matter more than order.

```
┌────────────┐       owns layout       ┌────────────┐
│ TUI skill  │───────────────────────▶│ chat surface│
└────────────┘                         └────────────┘
       │                                      ▲
       └──── routes semantics ───────────────┘
```

Route worked examples to `architecture.md`.


─── Red Flags ───────────────────────────────────────────────────────

Wrong family signals:

  ▸ using flow when ownership boundaries are the point
  ▸ using state when only message order matters
  ▸ using sequence when there are no participants
  ▸ using quadrant because it looks tidy, not because two axes matter
  ▸ choosing Mermaid before choosing the user's visual family
