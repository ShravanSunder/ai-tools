Architecture Diagrams
══════════════════════════════════════════════════════════════════════

This reference owns: TUI patterns for system overviews, boundaries,
data flows, and pipeline diagrams.
Expected inputs: the system relationship selected by the SKILL.md
caller (and the visual family from diagram-semantics when loaded).
Return: the pattern used and its labels.
Complete when: the drawn pattern shows the load-bearing relationship
with ownership or flow labels on the edges that carry it.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ ../../../shared-references/diagram-semantics.md — map first, then selected slice; choose topology vs. flow vs. 2D map
  ▸ shape-catalog.md ──► Shape 5 (Pipeline box) — bordered pipeline with numbered steps; Shape 6 (State diagram) — full state-machine worked example
  ▸ build-discipline.md ──► Alignment recipes — positioning lifelines, arrow landings, junction characters
  ▸ sequence-and-state.md — state machines, sequence diagrams, decision trees, event timelines


─── Canonical path first ────────────────────────────────────────────

Show the normal path before exceptions.  This gives the reader a stable spine for later detail.

```text
user asks
  ──► controller chooses skill
  ──► skill routes to one reference
  ──► answer preserves markdown atoms
  ──► terminal surface renders readable structure
```

After the spine is clear, add one branch or failure state.


─── Boundary / ownership map ────────────────────────────────────────

Use topology when the question is "who owns what?"

```text
┌──────────────┐     layout contract      ┌──────────────┐
│ TUI skill    │─────────────────────────▶│ chat surface │
└──────┬───────┘                          └──────▲───────┘
       │       semantic atoms stay markdown       │
       └──────────────────────────────────────────┘
```

Keep ownership labels on arrows.  Do not imply a data flow where the real point is responsibility.


─── Two-axis map ────────────────────────────────────────────────────

Use a 2D map when two independent concerns explain the choice.

```text
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

```text
 ┌────────┐   HTTP    ┌────────┐   SQL     ┌──────────┐
 │ Client │ ────────▶ │ API    │ ────────▶ │ Database │
 └────────┘  ◀──────  └────────┘  ◀──────  └──────────┘
              JSON                 rows
```

Bidirectional flow with labels on both directions.


─── Pub/sub fan-out ─────────────────────────────────────────────────

```text
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

```text
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

```text
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

```text
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
