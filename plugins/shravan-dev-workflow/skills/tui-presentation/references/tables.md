Tables
══════════════════════════════════════════════════════════════════════

Deep-dive reference for table patterns.  All tables use Unicode
box-drawing; no markdown pipe-tables.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary
  ▸ progressive-disclosure.md — use ledgers after the first map/slice
  ▸ shape-catalog.md ──► Shape 4 (Column-ruled) — when to use a table
    with borders vs. column-ruled (no-border) style
  ▸ build-discipline.md ──► Alignment recipes — cell-width arithmetic,
    junction characters, padding, before/after drift repair


─── Named-target ledger ─────────────────────────────────────────────

Use a ledger when the reader needs state, not a full table.

```
target      current read
skill       router stays small
reference   examples move out of SKILL.md
proof       red/green pressure scenario
open        installed-cache refresh status
```

Keep rows short.  If cells need paragraphs, switch to a ruled list.


─── Research lane board ────────────────────────────────────────────

Render research lanes you are handed; do not claim TUI runs the
research or decides acceptance.

```
lane          evidence          parent status
code          current files      accepted
logs          prior sessions     needs freshness check
outside view  taste concern      open
```

Use this after orchestration skills have produced lane outputs.


─── Basic pros/cons (2-column) ───────────────────────────────────────

```
┌──────────────────┬──────────────────────────────────────┐
│ Pro              │ Con                                  │
├──────────────────┼──────────────────────────────────────┤
│ Compact          │ Loses context without a layout map   │
│ Fast to scan     │ Meaningless to new users             │
└──────────────────┴──────────────────────────────────────┘
```

Shortest form when only one option is being evaluated.


─── Three-column with multi-line cells ──────────────────────────────

```
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

Row separators (├─┼─┤) between entries when cells wrap.  Pad shorter
cells with spaces to match the row's line count.


─── Drift / diff table ──────────────────────────────────────────────

```
┌────────────────────────────┬──────────────┬──────────────┐
│ Field                      │ Current      │ Target       │
├────────────────────────────┼──────────────┼──────────────┤
│ review_model               │ gpt-5.3      │ gpt-5.4      │
│ status_line                │ 4 items      │ 4 items ✓    │
│ notify hook                │ set          │ (missing)    │
│ approvals_reviewer         │ guardian     │ (missing)    │
└────────────────────────────┴──────────────┴──────────────┘
```

Use (missing), (added), or ✓ to show state clearly.  Avoid raw
empty cells.


─── Highlighted "sweet spot" row ────────────────────────────────────

```
┌────────┬──────────────────────────┬───────────────────────────┐
│ Cap    │ Examples                 │ Result                    │
├────────┼──────────────────────────┼───────────────────────────┤
│ 8      │ "coding"                 │ Cuts too much             │
│ 12 ★   │ "full-screen", "coding"  │ Fits whole, truncates long│
│ 15+    │ "planning-design"        │ Dominates tab bar         │
└────────┴──────────────────────────┴───────────────────────────┘
```

Use ★ or similar marker to anchor the reader's eye on the
recommendation.


─── Feature matrix ──────────────────────────────────────────────────

```
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

▸ Align all row borders character-exact — a single off-by-one
  breaks the grid
