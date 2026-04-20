Architecture Diagrams
══════════════════════════════════════════════════════════════════════

Deep-dive reference for architecture-style diagrams.  Use these
patterns for system overviews, data flows, and pipeline diagrams.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ build-discipline.md → Shape 5 (Pipeline box) — bordered pipeline
    with numbered steps; Shape 6 (State diagram) — full state-machine
    worked example
  ▸ sequence-and-state.md — state machines, sequence diagrams,
    decision trees, event timelines


─── Client → API → DB with labels ───────────────────────────────────

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

Stacked rectangles sharing borders.  Each layer labeled and briefly
described.


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

Time flows down.  Lifelines vertical.  Dashed tail for async post-
response work.
