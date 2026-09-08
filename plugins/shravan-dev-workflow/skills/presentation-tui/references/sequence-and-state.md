Sequence and State Diagrams
══════════════════════════════════════════════════════════════════════

This reference owns: TUI patterns for time-ordered flows and state
machines — sequence when the story is "who talks to whom in what
order," state when it is "what states exist and how do we transition."
Expected inputs: the lifecycle or interaction selected by the SKILL.md
caller.
Return: the diagram's entry state, labeled transitions, and terminal
states — or its actors and messages.
Complete when: every required transition or message is drawn and
labeled, including the recovery or failure path when one exists.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ ../../../shared-references/diagram-semantics.md — choose sequence vs. state before drawing
  ▸ shape-catalog.md ──► Shape 6 (State diagram) — full state-machine worked example with re-entry arm
  ▸ build-discipline.md ──► Alignment recipes — positioning lifelines, arrow landings, junction selection
  ▸ architecture.md — pipeline with branches, pub/sub fan-out, request roundtrip


─── Sequence (actors + lifelines + messages) ────────────────────────

```text
Client          API           Auth          DB
  │              │             │             │
  │── POST ────▶ │             │             │
  │              │── verify ─▶ │             │
  │              │◀── token ── │             │
  │              │── query ──────────────▶   │
  │              │◀── rows ──────────────── │
  │◀── 201 ───── │             │             │
```

Actors in a header row, vertical lifelines with │, horizontal messages with labeled arrows.  Time flows top to bottom.

Use sequence when participants matter.  Each message should answer:

  ▸ who sends?
  ▸ who receives?
  ▸ what is the message?
  ▸ what returns, retries, or fails?

If a retry changes ownership, draw the retry as a real message, not a footnote.


─── State machine ───────────────────────────────────────────────────

```text
   ┌──────┐   start    ┌─────────┐   success   ┌────────┐
   │ idle │──────────▶ │ loading │────────────▶│ done   │
   └──────┘            └────┬────┘             └────────┘
       ▲                    │ error
       │ retry              ▼
       │               ┌────────┐
       └───────────────│ failed │
                       └────────┘
```

Boxes are states.  Labeled arrows are transitions.  Return arrows (▲ │ └──) for cycles.

Each state diagram should identify:

  ▸ entry state
  ▸ transition labels
  ▸ terminal states
  ▸ recovery path, if one exists

Do not use a state diagram for a simple call order; use sequence.


─── Decision tree ───────────────────────────────────────────────────

```text
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

Diamond-like split via labeled branches.  Use ┬ ┴ for fork/merge.


─── Event timeline ──────────────────────────────────────────────────

```text
 t=0              t=1s            t=3s              t=5s
  │                │               │                 │
  ●────────────────●───────────────●─────────────────●
  start          parsed         validated         stored
```

Horizontal line of events (●) with timestamps above and labels below.


─── State variants table ────────────────────────────────────────────

```text
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
