# Sequence and state diagrams

## Sequence (actors + lifelines + messages)

```
Client          API           Auth          DB
  │              │             │             │
  │── POST ────▶ │             │             │
  │              │── verify ─▶ │             │
  │              │◀── token ── │             │
  │              │── query ──────────────▶   │
  │              │◀── rows ──────────────── │
  │◀── 201 ───── │             │             │
```

Actors in a header row, vertical lifelines with `│`, horizontal messages with labeled arrows. Time flows top to bottom.

## State machine

```
   ┌──────┐   start    ┌─────────┐   success   ┌────────┐
   │ idle │──────────▶ │ loading │────────────▶│ done   │
   └──────┘            └────┬────┘             └────────┘
       ▲                    │ error
       │ retry              ▼
       │               ┌────────┐
       └───────────────│ failed │
                       └────────┘
```

Boxes are states. Labeled arrows are transitions. Return arrows (`▲ │ └──`) for cycles.

## Decision tree

```
         ┌────────────────┐
         │ Request in?    │
         └──────┬─────────┘
                │
        yes ────┤──── no
                │
        ┌───────┴───────┐
        ▼               ▼
   ┌────────┐      ┌─────────┐
   │ Auth'd?│      │ 401     │
   └───┬────┘      └─────────┘
       │
 yes ──┤── no
       │
   ┌───┴────┐    ┌─────────┐
   ▼        ▼    │ 403     │
 [handle]       └─────────┘
```

Diamond-like split via labeled branches. Use `┬ ┴` for fork/merge.

## Event timeline

```
 t=0              t=1s            t=3s              t=5s
  │                │               │                 │
  ●────────────────●───────────────●─────────────────●
  start          parsed         validated         stored
```

Horizontal line of events (`●`) with timestamps above and labels below.

## State variants table

```
┌──────────┬──────────────────────────────────────┐
│ State    │ Visual                               │
├──────────┼──────────────────────────────────────┤
│ Rest     │ [◫  2 · coding]   (muted bg)         │
│ Hover    │ [◫  2 · coding]   (hover bg)         │
│ Active   │ [◫  2 · coding]   (active bg)        │
│ Pressed  │ [◫  2 · coding]   (pressed bg)       │
└──────────┴──────────────────────────────────────┘
```

Shows component appearance across interaction states.
