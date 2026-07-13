Architecture Diagrams
══════════════════════════════════════════════════════════════════════

Deep-dive reference for architecture-style diagrams.  Use these patterns for system overviews, data flows, and pipeline diagrams.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ progressive-disclosure.md — map first, then selected slice
  ▸ visual-family-selection.md — choose topology vs. flow vs. 2D map
  ▸ shape-catalog.md ──► Shape 5 (Pipeline box) — bordered pipeline with numbered steps; Shape 6 (State diagram) — full state-machine worked example
  ▸ build-discipline.md ──► Alignment recipes — positioning lifelines, arrow landings, junction characters
  ▸ sequence-and-state.md — state machines, sequence diagrams, decision trees, event timelines


─── Canonical path first ────────────────────────────────────────────

Show the normal path before exceptions.  This gives the reader a stable spine for later detail.

```
user asks
  ──► controller chooses skill
  ──► skill routes to one reference
  ──► answer preserves markdown atoms
  ──► terminal surface renders readable structure
```

After the spine is clear, add one branch or failure state.


─── Boundary / ownership map ────────────────────────────────────────

Use topology when the question is "who owns what?"

```
┌──────────────┐     layout contract      ┌──────────────┐
│ TUI skill    │─────────────────────────▶│ chat surface │
└──────┬───────┘                          └──────▲───────┘
       │       semantic atoms stay markdown       │
       └──────────────────────────────────────────┘
```

Keep ownership labels on arrows.  Do not imply a data flow where the real point is responsibility.


─── Two-axis map ────────────────────────────────────────────────────

Use a 2D map when two independent concerns explain the choice.

```
                     more visual structure
                              ▲
                              │
 compact explanation ◄────────┼────────► richer explanation
                              │
                              ▼
                     less visual structure
```

Axes must name real tradeoffs.  If the axes are vague, use a table or boundary map instead.


─── Client ──► API ──► DB with labels ─────────────────────────────

```
 ┌────────┐   HTTP    ┌────────┐   SQL     ┌──────────┐
 │ Client │ ────────▶ │ API    │ ────────▶ │ Database │
 └────────┘  ◀──────  └────────┘  ◀──────  └──────────┘
              JSON                 rows
```

Bidirectional flow with labels on both directions.


─── Pub/sub fan-out ─────────────────────────────────────────────────

```
  ┌──────────┐
  │ Producer │
  └─────┬────┘
        │ publish
        ▼
  ┌──────────┐
  │ Topic    │
  └─────┬────┘
        │
        ├──────────┬──────────┐
        ▼          ▼          ▼
   ┌─────────┐ ┌────────┐ ┌─────────┐
   │ Worker1 │ │ Worker2│ │ Worker3 │
   └─────────┘ └────────┘ └─────────┘
```

One producer, multiple consumers.  Fan-out via ├──┬──┐ junction.


─── Layered stack ───────────────────────────────────────────────────

```
 ┌──────────────────────────────────────┐
 │  UI Layer                            │
 │  (React components, routing)         │
 ├──────────────────────────────────────┤
 │  Service Layer                       │
 │  (business logic, orchestration)     │
 ├──────────────────────────────────────┤
 │  Data Layer                          │
 │  (repositories, ORM, migrations)     │
 ├──────────────────────────────────────┤
 │  Infrastructure                      │
 │  (Postgres, Redis, S3)               │
 └──────────────────────────────────────┘
```

Stacked rectangles sharing borders.  Each layer labeled and briefly described.


─── Pipeline with branches ──────────────────────────────────────────

```
 ┌───────┐   ┌─────────┐   ┌─────────┐   ┌────────┐
 │ Input │──▶│ Parse   │──▶│ Validate│──▶│ Output │
 └───────┘   └─────────┘   └────┬────┘   └────────┘
                                │ error
                                ▼
                          ┌──────────┐
                          │ Dead Ltr │
                          └──────────┘
```

Main path horizontal, branch drops down on condition.


─── Request roundtrip ───────────────────────────────────────────────

```
 Browser          CDN            Origin         DB
   │               │               │            │
   │── GET /x ────▶│               │            │
   │               │── miss ─────▶ │            │
   │               │               │── query ─▶ │
   │               │               │◀── rows ── │
   │               │◀── body ───── │            │
   │◀── 200 ────── │               │            │
   │               │── cache ──    │            │
```

Time flows down.  Lifelines vertical.  Dashed tail for async post- response work.
