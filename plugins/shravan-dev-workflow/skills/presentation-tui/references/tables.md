Tables
══════════════════════════════════════════════════════════════════════

This reference owns: box-table and ledger craft applied after the
baseline's fallback threshold is already met.
Expected inputs: the comparison or status content, and the specific
annotation or alignment the GFM rendering would destroy.
Return: the box-table or ledger layout with the annotation it carries.
Complete when: the layout renders the named annotation and passes the
build-discipline verification checklist.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ ../../../shared-references/diagram-semantics.md — ledger placement in the disclosure sequence
  ▸ shape-catalog.md ──► column-ruled — bordered table vs. column-ruled (no-border) style
  ▸ build-discipline.md ──► Alignment recipes — cell-width arithmetic, junction characters, padding, before/after drift repair


─── Named-target ledger ─────────────────────────────────────────────

Use a ledger when the reader needs state, not a full table.  The
alignment IS the annotation: label column and reading column stay
fixed so the eye scans vertically.

```text
target      current read
skill       router stays small
reference   examples move out of SKILL.md
proof       red/green pressure scenario
open        installed-cache refresh status
```

Keep rows short.  If cells need paragraphs, switch to a ruled list.
Copyable atoms never sit in ledger rows — keep a short label and put
the formatted atom outside, per the baseline's labels-versus-atoms
boundary.


─── Research lane board ────────────────────────────────────────────

Render research lanes you are handed; do not claim presentation runs
the research or decides acceptance.

```text
lane          evidence          parent status
code          current files      accepted
logs          prior sessions     needs freshness check
outside view  taste concern      open
```

Use this after orchestration skills have produced lane outputs.


─── Multi-line cells with row separators ────────────────────────────

The annotation here: wrapped multi-line cells stay visually paired
row by row, which GFM renderers break by reflowing:

```text
┌─────────────┬─────────────────────────┬────────────────────────────────┐
│ Option      │ Pro                     │ Con                            │
├─────────────┼─────────────────────────┼────────────────────────────────┤
│ Index "2"   │ Maps 1:1 to ⌘2 muscle   │ Meaningless without a mental   │
│ (current)   │ memory, uniform shape   │ map of which number = layout   │
├─────────────┼─────────────────────────┼────────────────────────────────┤
│ Named       │ Self-explanatory,       │ Variable width, breaks visual  │
│             │ teaches the app         │ rhythm                         │
└─────────────┴─────────────────────────┴────────────────────────────────┘
```

Row separators (├─┼─┤) between entries when cells wrap.  Pad shorter cells with spaces to match the row's line count.


─── Drift / diff table with cell callouts ───────────────────────────

The annotation here: an embedded callout arrow riding the exact cell
that caused the problem — destroyed by GFM reflow:

```text
┌────────────────────────────┬──────────────┬──────────────┐
│ Field                      │ Current      │ Target       │
├────────────────────────────┼──────────────┼──────────────┤
│ review model               │ 5.3          │ 5.4          │
│ status line                │ 4 items      │ 4 items ✓    │
│ notify hook                │ set          │ (missing)    │ ◄── outage cause
│ approvals reviewer         │ guardian     │ (missing)    │
└────────────────────────────┴──────────────┴──────────────┘
```

Use (missing), (added), or ✓ to show state clearly.  Avoid raw empty
cells.  Rows carry plain labels; the exact config keys and values the
reader would copy belong outside the table as inline code.


─── Highlighted "sweet spot" row ────────────────────────────────────

The annotation is the ★ marker anchoring the recommended row at a
fixed column — alignment that is part of the meaning:

```text
┌────────┬──────────────────────────┬───────────────────────────┐
│ Cap    │ Examples                 │ Result                    │
├────────┼──────────────────────────┼───────────────────────────┤
│ 8      │ "coding"                 │ Cuts too much             │
│ 12 ★   │ "full-screen", "coding"  │ Fits whole, truncates long│
│ 15+    │ "planning-design"        │ Dominates tab bar         │
└────────┴──────────────────────────┴───────────────────────────┘
```


─── Feature matrix ──────────────────────────────────────────────────

The annotation here: marker columns stay character-aligned for
vertical scanning across many rows:

```text
┌────────────────┬──────────┬──────────┬──────────┐
│ Feature        │ Claude   │ Codex    │ Cursor   │
├────────────────┼──────────┼──────────┼──────────┤
│ Plugins        │ ✓        │ ✓        │ ─        │
│ MCP servers    │ ✓        │ ✓        │ ✓        │
│ Hooks          │ ✓        │ ✓        │ ─        │
│ Skills         │ ✓        │ ✓        │ ─        │
└────────────────┴──────────┴──────────┴──────────┘
```

Markers:

  ▸ ✓  yes
  ▸ ✗  no
  ▸ ─  n/a
  ▸ ◐  partial


─── Column-width rules ──────────────────────────────────────────────

▸ Header row sets the minimum column width
▸ 1-space padding on each side of content minimum
▸ Wrap long content to multiple lines rather than expanding a column

▸ Align all row borders character-exact — a single off-by-one breaks the grid
