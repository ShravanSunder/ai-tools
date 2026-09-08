Complete Response Walkthrough — Presentation: TUI Reference
══════════════════════════════════════════════════════════════════════

This reference owns: one complete hybrid response, composed — title,
framing, sections, shapes, markdown mixing, cordoning, and closing
synthesis in one worked example.
Expected inputs: the response content being composed.
Return: the section rhythm and closing-synthesis placement applied to
the current response.
Complete when: the response follows the heading → block → heading
rhythm with one shape per block and a prose synthesis at the end.

See also (routing stays with the SKILL.md callers; this file opens no
other reference):

  ▸ per-shape geometry — shape-catalog.md
  ▸ indentation, overflow, alignment, verification — build-discipline.md
  ▸ markdown set, bright line, table threshold — ../../../shared-references/markdown-presentation-baseline.md


─── Golden example — a complete hybrid response ─────────────────────

Use as a template: swap the content, keep the structure.

````markdown
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

| | A: sync invalidation | B: read-through TTL | C: version token |
|---|---|---|---|
| pro | consistent | no writer latency | writer-free; reads self-heal |
| con | writer latency blows up | stale up to 30s | tokens leak through API |

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

The reader-side check is two lines in `CacheClient.fetch`:

```ts
const cached = await cache.get(key);
return cached?.token === head.token ? cached : primary.fetch(key);
```

─── My read ──────────────────────────────────────────────────────────

**Option C.** Writer stays fast, reader is always consistent, and the
token leak is a one-time API hygiene cost we can fix later.  Option B
is tempting for simplicity but 30s of staleness is unacceptable for
our domain.  Option A pays the wrong cost on the wrong path.
````

What the example teaches:

  ▸ Title line + ═══ underline (H1-style), framing prose below
  ▸ ─── Section label ─── carries separator + heading (no stacked ---)
  ▸ Framed card (context) — prose body, title-in-border, breathing
  ▸ GFM table (comparison) — the default comparison medium; standalone,
    never inside a frame; narrow enough to stay readable
  ▸ Pipeline box (decision flow) — numbered steps with ├──┤ separators,
    sub-items indented with ──► arrows; short plain labels only
  ▸ Fenced code with a language tag for the copyable atom, placed
    outside the frames with an inline-code pointer (`CacheClient.fetch`)
  ▸ Closing "My read" synthesis — prose with bold on the verdict only

Important — the title is YOUR response's topic, not the skill's name. Never emit "Presentation: TUI" as a title.

  Wrong:  response begins with the skill name as its title.
  Right:  response begins with the actual topic, e.g. "How we're
          handling the cache-invalidation race".
