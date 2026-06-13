Progressive Disclosure
══════════════════════════════════════════════════════════════════════

Use this reference when the user needs to understand a difficult
system, investigation, implementation, or design.  The job is not to
show every fact.  The job is to reveal the right facts in an order the
reader can hold.

Default disclosure sequence:

  1. one map
  2. one selected slice
  3. one small ledger
  4. technical detail

Keep the first response easy to scan.  Add depth only after the reader
has a stable place to stand.


─── One Map ─────────────────────────────────────────────────────────

Start with the user's named target and current question.  Preserve the
nouns the user used, then place them in one small relationship map.

```
┌─ What Is Fighting? ─────────────────────────────────────────┐
│ Terminal surface ── constrains ──► model output             │
│        ▲                              │                    │
│        │                              ▼                    │
│  skill rules ◄──── route ───── semantic markdown atoms      │
└─────────────────────────────────────────────────────────────┘
```

The map should answer: what are the moving parts, and why are they in
tension?

Avoid:

  ▸ every subsystem in the repo
  ▸ every test case
  ▸ every reference file
  ▸ a table that hides the relationship


─── One Selected Slice ──────────────────────────────────────────────

After the map, pick one path through the system.  A slice is narrower
than the map and deeper than a label.

```
model output
  ──► TUI structure owns layout
  ──► semantic markdown owns code, paths, URLs, tokens
  ──► renderer shows both without losing copy/navigation behavior
```

Name why this slice was selected.  Good reasons:

  ▸ it is the user-visible failure
  ▸ it crosses the disputed boundary
  ▸ it proves the design tradeoff
  ▸ it explains the confusing state transition


─── One Small Ledger ────────────────────────────────────────────────

Use a compact ledger for status, not a second giant diagram.

```
known       semantic markdown already covers code and links
new         disclosure sequence chooses what to reveal first
open        exact visual family depends on the user's question
next proof  pressure scenario must fail red and pass green
```

For research synthesis, render handed-over lanes.  TUI does not define
lanes, run agents, decide acceptance, or replace parent synthesis.

```
lane             evidence           status
code reading     current files       accepted by parent
session logs     prior pattern       needs freshness check
outside view     taste concern       open question
```


─── Technical Detail ────────────────────────────────────────────────

Only after the map/slice/ledger should the answer name concrete files,
commands, code, data names, and URLs.  Keep those atoms in semantic
markdown:

  ▸ `SKILL.md`
  ▸ `tests/skills/run-skill-pressure-tests.sh --fast`
  ▸ `kind: "agent-channel-provider-health"`

Do not put copyable code or data inside a decorative table cell.  Use
fenced code blocks when the reader may copy, scan, or run the content.


─── Variants ────────────────────────────────────────────────────────

Debug narrative:

```
symptom
  ──► suspected boundary
  ──► proof gathered
  ──► decision
  ──► next validation
```

Design tradeoff:

```
goal
  ──► two viable options
  ──► cost paid by each option
  ──► recommended slice
  ──► proof gate
```

Review synthesis:

```
finding
  ──► evidence
  ──► failure mode
  ──► accepted / rejected / deferred
  ──► smallest edit
```


─── Red Flags ───────────────────────────────────────────────────────

Stop and simplify when:

  ▸ the first diagram tries to show everything
  ▸ the answer has three unrelated visuals before one clear map
  ▸ "zoom" is treated as a diagram family
  ▸ helper lanes are presented as truth without parent synthesis
  ▸ code, paths, URLs, or tokens are redrawn as box text
