Complete Response Walkthrough — TUI Presentation Reference
══════════════════════════════════════════════════════════════════════

Load this file when it helps to see how the skill should actually be
used in a real answer.  This is the "show me the form" reference: how
title, framing, sections, shapes, cordoning, and closing synthesis fit
together in one complete answer.

Use this file for:

  ▸ Seeing how to apply the skill in a real response
  ▸ Building a multi-section response from scratch
  ▸ Checking whether section rhythm feels right
  ▸ Choosing where prose ends and a shaped block begins
  ▸ Seeing how a closing "My read" should land after visual sections

For rules and specific mechanics, load:

  ▸ Per-shape geometry questions ──► shape-catalog.md
  ▸ Indentation, overflow, alignment, or verification ──►
    build-discipline.md
  ▸ Specialized table / layout / architecture / sequence patterns ──►
    peer reference files


─── Golden example — a complete response ─────────────────────────────

One holistic example of what a full TUI response looks like.  Shows
title, framing, multiple sections, multiple shapes, cordoning, and
closing synthesis — all composed.  Use as a template: swap the
content, keep the structure.

```
How we're handling the cache-invalidation race
══════════════════════════════════════════════

Short framing — 1-2 sentences on what this response is about.

─── Context ──────────────────────────────────────────────────────────

┌─ What's happening today ────────────────────────────────────────────┐
│                                                                     │
│  Writer commits.  Cache asynchronously invalidates on a separate    │
│  worker.  Reader between commit and invalidation sees stale data    │
│  — the classic TOCTOU window.                                       │
│                                                                     │
│  Rare under low load.  At scale, hits ~5% of reads.                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

─── Option comparison ────────────────────────────────────────────────

option A              option B                option C
──────────────        ────────────────        ──────────────────

synchronous           read-through with       version token on
invalidation          short TTL (30s)         every read

pro: consistent       pro: no writer          pro: writer-free;
                      latency cost            reads self-heal

con: writer           con: stale for          con: tokens leak
latency blows up      up to TTL               through the API

─── Decision flow ────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────┐
│ 1. write hits primary                                               │
├─────────────────────────────────────────────────────────────────────┤
│ 2. writer bumps version token atomically                            │
├─────────────────────────────────────────────────────────────────────┤
│ 3. cache write-through fires in the background                      │
├─────────────────────────────────────────────────────────────────────┤
│ 4. reader fetches                                                   │
│      token matches?    ──► serve cached                             │
│      token mismatch?   ──► bypass cache, serve from primary         │
└─────────────────────────────────────────────────────────────────────┘

─── My read ──────────────────────────────────────────────────────────

Option C.  Writer stays fast, reader is always consistent, and the
token leak is a one-time API hygiene cost we can fix later.  Option
B is tempting for simplicity but 30s of staleness is unacceptable
for our domain.  Option A pays the wrong cost on the wrong path.
```

What the example teaches:

  ▸ Title line + ═══ underline (H1-style), framing prose below
  ▸ ─── Section label ─── carries separator + heading (no stacked ---)
  ▸ Framed card (context) — prose body, title-in-border, breathing

  ▸ Column-ruled (comparison) — no vertical borders, whitespace gaps,
    ───── under each header, content stacks below

  ▸ Pipeline box (decision flow) — numbered steps with ├──┤ separators,
    sub-items indented with ──► arrows

  ▸ Closing "My read" synthesis — prose paragraph, not a frame

Important — the title is YOUR response's topic, not the skill's name.
Never emit "TUI Presentation" as a title — that's the skill file's
own H1, not a template for the response's opening line.

  Wrong:  response begins with "TUI Presentation\n═══════..."
  Right:  response begins with the actual topic, e.g.
          "How we're handling the cache-invalidation race\n═══════..."
