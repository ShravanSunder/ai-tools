# Model Shapes: Drawing the Map

How to draw a divergence or re-anchor map that actually exposes the split.

## Choosing the Layout

Two questions pick the layout:

1. **What kind of drift fired?** Belief-vs-belief drift gets the two-column divergence map (your picture / my picture). Work-vs-goal drift gets the re-anchor map (goal and boundaries on one side, in-flight work compared against them). Never force work-vs-goal into belief columns — the goal is not a belief the user holds, and a fake second column hides the mismatch.
2. **What is unstable?** The shape word — terms, boundary, flow, state, ownership, constraint, tradeoff — picks what the rows or regions are. Rows are the things the user would name, in their words, not the skill's categories.

Drift without its own shape maps onto these: a disputed source of truth draws as ownership rows over the disputed facts ("who or what decides X"); competing framings draw as side-by-side pictures at the split, one per framing, on whatever shape the elements take; swarm work (what another agent did or claims) draws as a re-anchor map whose elements are the agent's reported claims, with origins that say "the report claims this" until direct evidence is read.

## Construction Rules

- **Elements the user will recognize.** Each row or region is something the user has said or seen: a component, a term, a step, an owner. If the user would not recognize the row name, the map is about your model only.
- **Statuses are visible, not implied.** Mark every element: same picture / we split here / unchecked. An element you have no belief about is an honest blank, not an omission.
- **Origins in plain words, next to the element.** "We both got this from the old design doc — never verified", "the code shows this (worker.py:88)", "we're assuming this." An origin that cites a read names the thing read; when nothing was read, the caption says so ("this is from memory").
- **Confirmation state on the first divergence map.** Until the user confirms, their column is your read: say "here's what I think you're picturing — correct me", or mark the column equivalent.
- **The split under discussion carries its settling line.** What evidence or answer would settle it, right there, so the user can answer from the map.

## Shape Layouts

Each example shows the divergence layout for one shape. Rows change; the discipline does not.

### Terms

```text
                     you                     me
  "session"          browser tab lifetime    server-side auth window   <- we split here
                                             (we both inherited "session" from the
                                              old API docs; the code uses it both ways)
  "user"             account record          account record            = same picture
  what would settle it: auth.ts:40 defines the timeout owner
```

### Boundary

```text
                     you                     me
  inside the change  parser, validator       parser only               <- we split here
  outside            CLI flags               CLI flags, validator      <- mirror of the same split
                     (my read of your boundary comes from your last message — correct me)
  unchecked          error formatting        error formatting          ? neither of us has looked
  what would settle it: does the ticket name the validator?
```

### Flow

```text
  you:   request -> queue -> worker -> DB
  me:    request -> worker -> queue -> DB
                    ^^^^^^^^^^^^^^^
                    we split on ordering; the queue config (max_receive=5)
                    is why my picture puts the queue first
  what would settle it: the enqueue call site in handler.ts
```

### State

```text
                     you                     me
  draft -> review    automatic               manual approval           <- we split here
                                             (yours comes from the old workflow;
                                              mine from the current admin UI)
  review -> live     manual                  manual                    = same picture
  rollback path      exists                  (I had nothing)           <- blank spot in mine
```

### Ownership

```text
                     you                     me
  retries            worker owns             queue owns                <- we split here
  dedup              queue                   queue                     = same picture
  poison messages    DLQ + manual            (I had nothing)           <- blank spot in mine
  what would settle it: worker.py:88 has no retry loop; queue sets max_receive=5
```

### Constraint

```text
                     you                     me
  hard limit         50ms p99                50ms p95                  <- we split here
                                             (the SLA doc says p95; your number may be
                                              from the older internal target)
  memory budget      512MB                   512MB                     = same picture
```

### Tradeoff

```text
                     you                        me
  favored option     trust the report (speed)   verify first (confidence)   <- we split here
  cost you accept    false-readiness risk       time and context
  what would settle it: how expensive is a wrong "done" here?
```

### Re-anchor (work vs goal)

```text
  the goal we confirmed          the work in flight              verdict
  migrate auth, keep sessions    auth migrated                   on track (diff d41f2 shows it)
  don't touch billing            billing untouched               on track (no billing files in diff)
  sessions preserved             session table renamed           <- exact mismatch: rename was
                                                                    never agreed; came from the
                                                                    migration script's default
```

No belief columns, no confirmation state; verdicts carry their evidence whether aligned or mismatched.

## Good vs Decorative

Decorative (columns drawn, divergence hidden):

```text
                you            me
  the system    has retries    has retries too, mostly
  the queue     works          works
```

Nothing splits, nothing is unchecked, no origins, nothing to settle — this is prose wearing a table. The honest version of the same conversation:

```text
                you                me
  retries       worker does 3x    queue does 5x     <- we split here: two retry layers
                (from the runbook) (from queue config) would multiply attempts
  what would settle it: does worker.py wrap calls in a retry loop at all?
```

## Completion Checks

- **Divergence map**: done when a reader can point to every split, say where each side's belief came from, see what would settle the split under discussion, and — on a first map — see that the user's column is your read awaiting correction. All without any skill vocabulary.
- **Re-anchor map**: done when a reader can point to each aligned or mismatched element, read the exact mismatch, and see the evidence behind both kinds of verdict.
