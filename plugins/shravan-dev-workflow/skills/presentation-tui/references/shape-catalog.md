Shape Catalog — TUI Presentation Reference
══════════════════════════════════════════════════════════════════════

This reference owns: worked examples, geometry choices, and anti-patterns for the framed TUI shapes and six compositional applications.
Expected inputs: the shape selected by the SKILL.md picker and the content it must carry.
Return: the shape's geometry choices and its don't-use conditions, applied to the current block.
Complete when: the composed block matches the worked geometry, none of the shape's don't-use conditions hold, and every copyable atom follows the baseline's labels-versus-atoms boundary — where an example shows a full identifier or path inside a row, your real response keeps a short label in the row and the formatted atom outside it.

See also:

  ▸ SKILL.md — core rules, canvas-width discipline, shape vocabulary picker (quick reference)
  ▸ build-discipline.md — mechanics (build procedure, alignment recipes, indentation recipes, overflow, verification checklist)

Peer reference map (per shape — for deeper variants of the pattern):

  Shape 1 Framed card         ──►  ui-layouts, annotations-and-specs
  Shape 2 Sub-framed grid     ──►  ui-layouts.md
  Shape 3 Ruled card          ──►  ui-layouts.md
  Shape 4 Column-ruled        ──►  tables.md
  Shape 5 Pipeline box        ──►  architecture.md
  Shape 6 State diagram       ──►  sequence-and-state.md
  Shape 7 No-frame list       ──►  (no dedicated peer ref)

All examples below use canvas width 70 unless noted.


─── Shape catalog — full worked examples ────────────────────────────

Each shape with a realistic worked example, commentary on geometry choices, and notes on when NOT to use it.


─── Shape 1 — Framed card (titled) ──────────────────────────────────

```text
┌─ Scope — what this ticket actually changes ─────────────────────────┐
│                                                                     │
│  ✓ Drawer concept                                                   │
│    Add a bell icon to the drawer's trailing actions and a per-      │
│    drawer popover. Behavior: purely additive. No model change.      │
│                                                                     │
│  ✓ Pane focus tracker                                               │
│    Observe active-pane transitions via the focus tracker. Read-     │
│    only — doesn't mutate the model.                                 │
│                                                                     │
│  ✗ Drawer-pane lifecycle (orphan pool vs. backgrounded)             │
│    Not our problem to fix. Pre-existing design drift; file a        │
│    separate ticket.                                                 │
│                                                                     │
│  ✗ Dynamic Views, tab arrangements                                  │
│    Completely out of scope.                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Title lives inside the top border: `┌─ Title ─...─┐`.  Two fixed `─` chars before the title, one space, title, one space, fill `─` to column 69, then `┐` at column 70.

  ▸ Content rows: `│ ` at col 0 + space + 2 indent + content, padded to col 69, `│` at col 70.

  ▸ Blank row after `┌─┐` and before `└─┘` for breathing.

  ▸ Items use `✓` / `✗` markers as bullets — they carry meaning (in-scope / out-of-scope).

  ▸ Each item: marker + title line, continuation prose hang-indented under the title text (4 spaces).

  ▸ Blank line between items inside the frame.

Use when:

  ▸ Single concept deserves a title and a self-contained body
  ▸ Content is prose or a structured list, not a table or flow
  ▸ The reader should be able to skip the frame if not relevant

Don't use when:

  ▸ Content is a diagram (use a specific shape instead)
  ▸ Body is only 1-2 short lines (prose is lighter and works)

  ▸ Several parallel concepts deserve equal billing (use sub-framed grid)

─── Shape 2 — Sub-framed grid ───────────────────────────────────────

```text
┌─ Three kinds of keyboard modality ──────────────────────────────────┐
│                                                                     │
│   Kind 1: LAYER               Kind 2: KEY WINDOW                    │
│   ┌──────────────────┐        ┌──────────────────┐                  │
│   │ Rare, explicit,  │        │ AppKit owns it.  │                  │
│   │ modal.           │        │ Panel becomes    │                  │
│   │                  │        │ key: command bar,│                  │
│   │ Strong chrome    │        │ sheets, alerts.  │                  │
│   │ change.          │        │                  │                  │
│   └──────────────────┘        └──────────────────┘                  │
│                                                                     │
│   Kind 3: FOCUS-SCOPED KEYS                                         │
│   ┌──────────────────────────────────────────────────┐              │
│   │ Custom keys that fire when a surface has focus.  │              │
│   │ No stored mode — derived from visibility+focus.  │              │
│   │ This ticket. Uses shortcut modifiers + the       │              │
│   │ responder chain (calls relocated below).         │              │
│   └──────────────────────────────────────────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Parent frame canvas width: 70.
  ▸ Inner content width: 68 (70 minus two │ borders).

  ▸ Two sub-frames across in the first row: each 20 wide + 8 gap between + 2 left padding + 2 right padding = 52.  Remaining 16 cols are outer gutter padding inside the parent.

  ▸ Third sub-frame spans wider (54) for longer content — allowed because it's a standalone row.

  ▸ Sub-frame borders are ┌─┐ matching the parent style (single borders consistent).

  ▸ Blank rows inside parent frame around each sub-row.

Use when:

  ▸ Parallel concepts at equal rank need side-by-side display
  ▸ 2-3 concepts max per row (4+ too cramped at canvas 70)
  ▸ Concepts are independent — no flow between them

Don't use when:

  ▸ Concepts have sequential relationship (use pipeline or state)
  ▸ One concept much bigger than others (use separate framed cards)
  ▸ Readability suffers at canvas 70 — consider stacking vertically

─── Shape 3 — Ruled card ────────────────────────────────────────────

```text
#: 1
Concern: Everything on @MainActor
Where: ViewRegistry, PaneCloseTransitionCoordinator, atoms
Why it matters: No actor hops inside the close pipeline. A single
  render turn is already tight; a nonisolated async hop would make
  "one transition frame" unbounded. Keep afterCloseSettled as
  @MainActor () -> Void.
────────────────────────────────────────────────────────────────────
#: 2
Concern: PaneCloseTransitionCoordinator owns a Task per pane
Where: pendingCloseTasks[paneId]
Why it matters: The task sleeps on the injected clock, then hops
  back to MainActor.run. Cancellation (e.g. deinit) means
  afterCloseSettled is never called — slot stays tombstoned. Pick
  a policy: cancel the finalizer too, or accept a tombstone leak
  on window close.
────────────────────────────────────────────────────────────────────
#: 3
Concern: isolated deinit cancels pending tasks
Where: PaneCloseTransitionCoordinator.swift:21-26
Why it matters: This is the Swift 6.2 pattern. If we add
  afterCloseSettled, cancellation must NOT invoke it (user never
  saw the close) OR must invoke synchronously. Pick deliberately.
────────────────────────────────────────────────────────────────────
```

Geometry choices:

  ▸ No frame borders — the cards are separated by ──── rules only.

  ▸ Each card has the same field structure: #:, Concern:, Where:, Why it matters:.

  ▸ Field labels align on the left; values follow the `:` on the same line.

  ▸ Multi-line values hang-indent 2 spaces from the label column.
  ▸ Separator rule width matches the canvas (here 68).

Use when:

  ▸ Sequence of similar items with parallel structure
  ▸ Each item has the same field schema
  ▸ 2-6 items — 7+ becomes hard to scan

Don't use when:

  ▸ Items have different structures (use framed cards)
  ▸ Items need visual separation beyond a rule (use framed cards)
  ▸ Content is 1-2 lines per item (use a no-frame list)

─── Shape 4 — Column-ruled ──────────────────────────────────────────

```text
frame N         frame N+1 (transition)        frame N+2
───────────     ──────────────────────        ──────────────

model:          model:                        model:
  drawer=[A]      drawer=[]                     drawer=[]

registry:       registry:                     registry:
  slots=[A]       slots=[]   ◄── too eager      slots=[]

view:           view:                         view:
  renders A       SwiftUI still paints ONE      nothing asks
                  last frame of "A leaving"     about A
                  → FlatPaneStripContent
                    reads slot(A)
                  → lazy-fallback path
                    (DEBUG assert fires)
```

Geometry choices:

  ▸ Three columns, no │ vertical borders.  Whitespace is the separator.
  ▸ Column starts at cols 0, 16, 46 (picked by longest content).
  ▸ ───── under each header matches or exceeds header width.
  ▸ Content stacks below each header, left-aligned to column start.
  ▸ Row groups (model: / registry: / view:) separated by blank lines.
  ▸ Embedded callout ◄── too eager rides on the data line, inline.

  ▸ The third column can extend downward with longer prose — unbounded because no │ constrains it.

Use when:

  ▸ Parallel data at different temporal frames or states
  ▸ Columns can have unequal depth — no frame forces equal height
  ▸ Narrative prose in one column is fine — it flows downward

Don't use when:

  ▸ Content fits a bordered table (use framed table instead)
  ▸ More than 4 columns at canvas 70 — too cramped
  ▸ Reader needs row-by-row comparison rather than column-by-column

─── Shape 5 — Pipeline box ──────────────────────────────────────────

```text
execute(.closePane(tabId, paneId))
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 1. snapshot for undo (if applicable)                                │
├─────────────────────────────────────────────────────────────────────┤
│ 2. teardown view                                                    │
├─────────────────────────────────────────────────────────────────────┤
│ 3. removal                                                          │
│      drawer child?  ──► drawer-removal store call (below)           │
│      main pane?     ──► layout-removal atom call (below)            │
├─────────────────────────────────────────────────────────────────────┤
│ 4. retire slot (not delete)                                         │
├─────────────────────────────────────────────────────────────────────┤
│ 5. container aftermath                                              │
│      tab empty?     ──► remove the tab                              │
│      drawer empty?  ──► keep expanded, show empty-drawer screen     │
├─────────────────────────────────────────────────────────────────────┤
│ 6. undo GC                                                          │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Entry point execute(...) sits above the box in prose with a
    │ / ▼ connector.

  ▸ Single bordered box, canvas width 70.
  ▸ Numbered steps use consistent `N. ` width (3 chars for 1-9).
  ▸ Dividers ├──────────────────┤ at col 0 and col 69, ─ fills.

  ▸ Step 3 and Step 5 have sub-items inside the same step —
    indented 5 spaces from the │, with ──► arrows aligning substeps.

  ▸ No blank row after ┌─┐ or before └─┘ here because the dividers already provide visual separation.

Use when:

  ▸ Numbered sequential steps in a process
  ▸ Each step is 1-2 lines; a few steps can expand with sub-items
  ▸ 3-8 steps total — 10+ becomes too tall; use state diagram

Don't use when:

  ▸ Steps have branches or loops (use state diagram)
  ▸ Steps are independent, not sequential (use ruled cards)
  ▸ Individual step content is large — pipeline forces thin strips

─── Shape 6 — State diagram ─────────────────────────────────────────

```text
┌──────────────┐   register   ┌──────────────┐
│   no slot    │ ───────────► │    LIVE      │
└──────────────┘              │  host set    │
       ▲                      └──────┬───────┘
       │                             │
       │ finalize                    │  unregister
       │                             ▼
       │                      ┌──────────────┐
       │                      │   ORPHANED   │
       │                      │ host cleared │
       │                      └──────┬───────┘
       │                             │
       │                             │  retire slot
       │                             ▼
       │                      ┌──────────────┐
       └──────────────────────│   RETIRED    │
                              │ host cleared │
                              │ (tombstone)  │
                              └──────────────┘
```

Geometry choices:

  ▸ State boxes all 14 wide for visual rhythm.

  ▸ Main flow down the right column (no slot ──► LIVE ──► ORPHANED ──► RETIRED).

  ▸ Re-entry arm on the left — back to `no slot` via `finalize`.
  ▸ Arrow labels ride on the arrow line.

  ▸ The re-entry arm uses │ ▲ at the left margin and connects at the bottom.

  ▸ Long labels hang-indent under the main label.

Use when:

  ▸ State machine with distinct states and labeled transitions
  ▸ 3-6 states — more becomes tangled
  ▸ Includes loopbacks or re-entry

Don't use when:

  ▸ Linear flow with no branching (use pipeline box)
  ▸ States are just labels with no real transitions (use a list)
  ▸ Transitions more important than states (use sequence diagram)

─── Shape 7 — No-frame list ─────────────────────────────────────────

```text
2440564  docs(spec): hoist sidebarHasFocus contract; full matrix
7c11794  docs(spec): sidebarHasFocus explicit; KeyboardOwner scope
23d9ea1  docs: review — coherence + arch docs catch-up
0ea8b8c  docs: scope Features/Sidebar/→RepoExplorer rename
65835c2  docs(spec): align with UIStateAtom composition
aac6cdd  docs(arch): feature-slice self-containment
17da443  Merge origin/main
```

Geometry choices:

  ▸ Fixed-width first column (7-char SHA), then two spaces, then variable-width subject.

  ▸ No borders, no rules.
  ▸ Left-aligned throughout.

  ▸ Two-space column gap (not one, not three) — the tight-but- readable standard.

Use when:

  ▸ Reading-linear content (git log, status matrix, test results)
  ▸ One "label" column + one "description" column
  ▸ No need for cordoning — content reads top-to-bottom

Don't use when:

  ▸ Content needs to stand apart from surrounding prose (frame it)
  ▸ Multiple parallel columns need to be compared (column-ruled)
  ▸ The list is a step sequence (pipeline box)


─── Shape anti-patterns ─────────────────────────────────────────────

The #1 TUI failure mode: cramming multiple concerns into one giant frame.  One shape per block.  One shape per content type.  Split across sections.

WRONG — everything crammed into one ╔═╗ box:

```text
╔══════════════════════════════════════════════════════════════════╗
║ Feature comparison and decision flow                             ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║ Option A | Option B | Option C                                   ║
║ fast     | flexible | simple                                     ║
║ rigid    | complex  | coupled                                    ║
║                                                                  ║
║ Decision flow:                                                   ║
║ 1. check option A                                                ║
║ 2. if not A, check B                                             ║
║ 3. if not B, default to C                                        ║
║                                                                  ║
║ My read: Option B is better because of flexibility.              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

Problems: double borders misused for non-focal content; a pipe table crammed *inside* a fixed-width frame (markup inside fixed-width rows drifts borders — a standalone GFM table outside the frame is the correct default for this comparison); comparison + flow + synthesis crammed together; reader can't parse what's what.

RIGHT — split into sections, each with an appropriate shape.  The
comparison is a standalone GFM table (the default comparison medium
per the shared baseline); the flow keeps its pipeline box:

─── Option comparison ────────────────────────────────────────────────

| | option A | option B | option C |
|---|---|---|---|
| strength | fast | flexible | simple |
| cost | rigid | complex | coupled |

─── Decision flow ────────────────────────────────────────────────────

```text
┌─────────────────────────────────────────────────────────────────────┐
│ 1. check option A                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ 2. if not A, check B                                                │
├─────────────────────────────────────────────────────────────────────┤
│ 3. if not B, default to C                                           │
└─────────────────────────────────────────────────────────────────────┘
```

─── My read ──────────────────────────────────────────────────────────

Option B — flexibility matters more than implementation cost here.

Three concerns ──► three sections ──► three shapes.  Comparison uses
a GFM table (default; column-ruled only past the annotation
threshold in the shared baseline).  Flow uses pipeline box
(sequential steps).  Synthesis uses prose (single-paragraph
conclusion).  One shape per block.  One heading per section.


─── Shape variants and applications ─────────────────────────────────

Three worked examples of shapes applied to specific real-world layouts.  These aren't new shapes — they're compositional patterns built from the vocabulary above.


─── Shape 2 variant — phase-sequence layout ─────────────────────────

A sub-framed grid tuned for phased/sequential work: horizontal sub- frames labeled above each, connector prose below showing dependencies.

```text
         PHASE 1                    PHASE 2                    PHASE 3
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│                        │  │                        │  │                        │
│ Goal: shell ready,     │  │ Goal: derived owner +  │  │ Goal: real feature.    │
│ surface tag + focus +  │  │ first consumer; ⌘P     │  │ Atoms, router, views,  │
│ collapsed all on       │  │ default scope reacts   │  │ drawer, RPC, keymap,   │
│ UIStateAtom; ⌘I/⌘S    │  │ to current owner.       │  │ tests.                 │
│ commands work.         │  │                        │  │                        │
│                        │  │                        │  │                        │
│ Visible: inbox key     │  │ Visible: palette from  │  │ Visible: Inbox has     │
│ shows an empty         │  │ focused inbox surface  │  │ notifications, full    │
│ placeholder; repos     │  │ defaults to the inbox  │  │ keymap, full tests.    │
│ key shows repos.       │  │ scope.                 │  │                        │
│                        │  │                        │  │                        │
│ Files: ~5              │  │ Files: ~10             │  │ Files: ~15 NEW + ~7    │
│ (app shell, core       │  │ (core models, core     │  │  MOD                   │
│  models, explorer      │  │  state, command-bar    │  │ (inbox feature, plus   │
│  rename, split-view    │  │  feature)              │  │  drawer, transport,    │
│  controller            │  │                        │  │  app delegate, app     │
│  migration)            │  │                        │  │  commands and          │
│                        │  │                        │  │  shortcuts)            │
│                        │  │                        │  │                        │
└───────────┬────────────┘  └───────────┬────────────┘  └────────────────────────┘
            │                           │
            └─► Phase 2 reads composition state added in Phase 1.
                Phase 3 imports both atoms and surface enum from Phase 1;
                consumes KeyboardOwner from Phase 2 (CommandBar scope).

                Phase 1 stands alone with no upstream deps.
```

Geometry choices:

  ▸ Phase labels sit above each sub-frame as prose ("PHASE 1"), not inside.  Keeps the frame reserved for the goal/content.

  ▸ Sub-frames are all the same width (24 inner, 26 outer) for rhythm.
  ▸ 2-char gap between sub-frames ("  " between `┐` and `┌`).

  ▸ Each sub-frame has Goal / Visible / Files as labeled sections separated by blank rows.

  ▸ Connector line below: `│` emerges from each frame's bottom center (via `└───┬────┘`), then joins into prose explaining dependencies.

  ▸ Dependencies stated as prose — not drawn with arrow geometry — because they're complex and narrative-worthy.

Use when:

  ▸ Presenting a multi-phase plan with clear boundaries
  ▸ Each phase has parallel structure (goal, output, scope)
  ▸ Dependencies between phases need commentary, not just arrows

Don't use when:

  ▸ Phases aren't truly parallel in structure (use separate framed cards, one per phase)

  ▸ More than 3-4 phases (canvas 70 can't fit wider grids; stack vertically instead)


─── Shape 1 application — Q&A rationale frames ──────────────────────

A series of framed cards where each card answers one "why this / why not that" question.  Scales to multiple alternatives without nesting and without forcing a comparison table.

```text
┌─ Why not 2 phases (combine A+B) ────────────────────────────────────┐
│                                                                     │
│  The keyboard-owner reader is a separable architecture piece        │
│  outliving the inbox.  Future repo navigation needs it.             │
│  Shipping it on its own gives it a clean review and PR.             │
│                                                                     │
│  Combining would make Phase 1 do too much — composition state       │
│  migration AND a new derived reader AND command-bar changes.        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ Why not 4 (split C into data + views) ─────────────────────────────┐
│                                                                     │
│  The inbox data layer (atoms + router + store) has nothing to       │
│  test against without UI.  Tests would be meaningful only via       │
│  integration through the views.  Splitting just delays the          │
│  real validation.                                                   │
│                                                                     │
│  Tradeoff: Phase 3 is the biggest.  But it's all one feature,       │
│  reviewed as one feature.                                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ Why include the RepoExplorer rename in Phase 1 ────────────────────┐
│                                                                     │
│  Phase 1 introduces the sidebar surface host, which imports         │
│  the repo-explorer feature and (eventually) the notification        │
│  inbox.  The clean naming should land at the same moment as         │
│  the new shell.                                                     │
│                                                                     │
│  Alternative: Phase 0 — pure rename PR with no behavior change,     │
│  lands first.  Cleaner review separation.  Worth considering if     │
│  the team prefers tiny PRs.                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Each question gets its own standalone framed card — not stacked inside a parent frame.

  ▸ Title phrased as the question itself ("Why not X", "Why include Y") — the frame's top IS the question.

  ▸ Body is prose reasoning, typically 2-4 paragraphs separated by blank lines inside the frame.

  ▸ Blank line BETWEEN cards (outside them) — each card is a distinct answer.

  ▸ No numbering needed; cards stand on their own.

Use when:

  ▸ Multiple alternatives or objections need addressing
  ▸ Each answer is prose reasoning, not tabular
  ▸ Answers don't need cross-referencing (if they did, use table)

Don't use when:

  ▸ A single table row captures the comparison (use table)
  ▸ You only have one answer (prose paragraph is enough)
  ▸ The answers are very short (1 line each — use a bulleted list)


─── Shape 1 application — review findings with severity ─────────────

Review findings (HIGH / MEDIUM / LOW severity) are a specific application of framed cards.  Each finding is a framed card with the severity tag in the frame title.  Reader scans severity badges down the left margin to triage at a glance.

````markdown
┌─ [HIGH] Surface handoff race during mode switch ────────────────────┐
│                                                                     │
│  Location: strip container, mode-switch branches (path below)       │
│                                                                     │
│  Mode switch uses exclusive branches.  The framework's              │
│  appear / disappear hooks at branch boundaries are NOT              │
│  transactional.                                                     │
│                                                                     │
│  Race sequence:                                                     │
│                                                                     │
│    mode switch                                                      │
│                                                                     │
│      old branch .onDisappear                                        │
│        ──► unregister the old surface                               │
│        ──► union is empty                                           │
│        ──► all retired slots deleted                                │
│                                                                     │
│      new branch .onAppear                                           │
│        ──► register the new surface ids                             │
│        ──► but tombstones already gone                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Location atom, relocated per the baseline: `FlatTabStripContainer.swift:58-109`.

Proposed fix — move registration UP to FlatTabStripContainer:

```swift
let surfaceId = "tab:\(tabId)"
content
  .onAppear     { viewRegistry.surfaceRenderedIds(...) }
  .onChange(of: renderedIds) { _, new in ... }
  .onDisappear  { viewRegistry.unregisterSurface(surfaceId) }
```

┌─ [MEDIUM] Task 3 tests revive the tombstone ────────────────────────┐
│                                                                     │
│  Location: Task 3, Steps 4 and 5                                    │
│                                                                     │
│  Tests use the ensure-slot helper, which promotes tombstones in     │
│  place.  First assertion un-retires the pane; subsequent            │
│  finalization runs over an empty retired set.  Tests can pass       │
│  while the production path is broken.                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Proposed fix — add a DEBUG-only non-promoting probe:

```swift
#if DEBUG
  /// Non-promoting, non-creating test probe.
  func peekSlotForTesting(_ paneId: UUID) -> PaneViewSlot? {
      slots[paneId]
  }

  func isRetiredForTesting(_ paneId: UUID) -> Bool {
      retiredPaneIds.contains(paneId)
  }
#endif
```

Rewrite Task 3 tests to use these probes so the tombstone state is
observed without being mutated.
````

Geometry choices:

  ▸ Severity bracketed tag is the FIRST element of the frame title: `┌─ [HIGH] Title ─...─┐`.  Reader sees badge immediately when scanning from the left margin.

  ▸ Each finding's body starts with a "Location:" field carrying a short plain label; the exact copyable path and line range sit immediately below the frame as inline code (labels-versus-atoms).  Then prose explanation.  Then an embedded flow diagram if useful (indented under a label line, per the cordoning rule).

  ▸ Proposed fixes live OUTSIDE the finding frame — below it, shown as fenced code blocks with a prose lead-in.  Fixes are NOT part of the finding itself.

  ▸ Blank line between findings.  Findings are independent — one can be accepted without the other.

Use when:

  ▸ Adversarial review output with multiple findings
  ▸ Code review with graded severity (HIGH / MEDIUM / LOW)
  ▸ Security or design review with severity tags
  ▸ Any "list of concerns with varying importance" pattern

Don't use when:

  ▸ All findings are equal severity — use ruled cards instead
  ▸ Only 1 finding — use a plain framed card

  ▸ Findings cross-reference each other heavily — consider a combined state/relationship diagram


─── Shape 1 application — dual-tag title band ───────────────────────

A framed card whose title band carries TWO tags: a short ID tag on the LEFT (F1, T3 — a label, never a copyable identifier) and status on the RIGHT, with description in the middle.  `─` characters fill the space between.  Used for triage dashboards, resolution summaries, task trackers — anywhere items need both stable identity and current state, both visible at a glance.

```text
┌─ F1: collapse-state dual-write ────────────────────────── RESOLVED ─┐
│                                                                     │
│  spec annotation: stripped the user-defaults dual-write note        │
│  data-architecture doc, tier-C struct comment: rewritten            │
│  Spec + arch + Phase 1 plan now tell a single greenfield story      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F2: Notification name collision ──────────────────────── DEFERRED ─┐
│                                                                     │
│  To be discussed.  Spec + plans still use the bare notification     │
│  struct name.  Options: (a) rename it inbox-specific, (b) nest      │
│  it.  Decision pending input from design-review.                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F3: Cross-feature imports ────────────────────────────── RESOLVED ─┐
│                                                                     │
│  Spec §8.5 added two seam subsections:                              │
│    seam 1  explorer worktree row — unread-count property            │
│    seam 2  command-bar data source — inbox commands bundle          │
│                                                                     │
│  Task 13 — the command-bar data source consumes that bundle;        │
│            its test uses a commands sink (no atom access)           │
│  Task 15 — the app delegate constructs the bundle with weak         │
│            captures                                                 │
│                                                                     │
│  Each task has grep guards to confirm one feature does not          │
│  import the other.                                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F4: focus-tracker polling ────────────────────────────── RESOLVED ─┐
│                                                                     │
│  Task 5 code block rewritten: test harness now uses bounded         │
│  yield-based waiting instead of wall-clock sleeps, per the          │
│  "No Wall-Clock Tests" rule.                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Layout and spacing notes:

  ▸ Every card is the SAME canvas width.  RESOLVED / DEFERRED land at the same column across all cards, so the reader's eye can scan the right margin vertically to see status distribution.

  ▸ Every card uses the SAME indent (2 spaces from left │) and SAME body width.  Vertical consistency makes the stack scannable.

  ▸ Title format: `┌─ ID: Title ─...──── STATUS ─┐` — the `─` chars fill the middle to reach canvas width.  Single space before and after STATUS to keep it visually distinct from the fill dashes.

  ▸ One blank row at top AND bottom inside each frame for breathing.
  ▸ Blank line BETWEEN cards — each is a distinct answer.

  ▸ When body has sub-lists (see F3's task list), blank rows separate semantic groups within the body.

Use when:

  ▸ Triage reports: findings with stable ID + closed-vocab status (RESOLVED / DEFERRED / PENDING / BLOCKED / WONTFIX)

  ▸ Task dashboards (TODO / IN-PROGRESS / DONE / BLOCKED)
  ▸ Iteration summaries: "here's where we landed on each concern"

  ▸ Any review response where items previously raised have now been categorized

Don't use when:

  ▸ All items share one status (drop the right tag — plain framed card is enough)

  ▸ Status vocabulary is large or open-ended (more than ~6 values) — use a table with a status column instead

  ▸ Items need cross-referencing or relational structure — use a table or state diagram


─── Shape 1 application — scope inventory with subsections ─────────

A framed card whose body contains multiple NAMED subsections, each labeled in UPPERCASE with a `─` underline matching label width.  Used for phase plans, ticket scopes, component specs, API contracts — any concept with multiple distinct facets that all belong together under one named scope.

File-tree inventory (documented below) is the most common content type for the IN SCOPE / NOT IN SCOPE subsections — per the baseline's labels-versus-atoms boundary, the frame carries a short summary label per area and the full copyable tree sits in a fenced block right after the frame:

```text
┌─ PHASE 1 — Sidebar Composition Foundation ─────────────────────────┐
│                                                                    │
│  IN SCOPE (full file tree below the frame)                         │
│  ─────────                                                         │
│                                                                    │
│  core models       new sidebar-surface enum                        │
│  composition atoms one modified atom, three new fields + setters   │
│  app windows       new surface host; split-view controller reads   │
│                    composition state instead of user defaults      │
│  feature rename    sidebar feature folder → repo-explorer names    │
│                                                                    │
│  EXPLICITLY NOT IN SCOPE                                           │
│  ────────────────────────                                          │
│                                                                    │
│  ✗ keyboard-owner derivation                                       │
│  ✗ notification model, atoms, store, router                        │
│  ✗ command-bar inbox scope and inbox shortcuts                     │
│                                                                    │
│  DEPENDS ON                                                        │
│  ───────────                                                       │
│                                                                    │
│  Nothing.  Phase 1 stands alone.                                   │
│                                                                    │
│  EXPOSES (consumed by later phases)                                │
│  ───────────────────────────────────                               │
│                                                                    │
│  → Phase 2:  composition reads and the surface enum                │
│  → Phase 3:  the surface host (inbox view plugs into it)           │
│                                                                    │
│  DEFINITION OF DONE                                                │
│  ──────────────────                                                │
│                                                                    │
│  ▸ inbox shortcut switches the sidebar to the placeholder view     │
│  ▸ repos shortcut switches it back                                 │
│  ▸ collapse state survives relaunch via the ui-state store         │
│  ▸ the legacy user-defaults key is no longer read or written       │
│    (grep: 0 hits)                                                  │
│  ▸ all existing sidebar tests pass after rename                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Immediately after the frame, the copyable inventory:

```text
Core/Models/
  + SidebarSurface.swift (.repos | .inbox enum)

Core/State/MainActor/Atoms/
  UIStateAtom.swift  [MOD]
    + sidebarCollapsed: Bool
    + sidebarSurface: SidebarSurface
    + sidebarHasFocus: Bool  (runtime-only, not persisted)

App/Windows/
  SidebarSurfaceHost.swift  [NEW]
  MainSplitViewController.swift  [MOD]

Features/Sidebar/  →  Features/RepoExplorer/
```

Layout and spacing notes:

  ▸ Outer frame title names the scope: "PHASE 1 — Title" for phased plans, "Ticket LUNA-361" for ticket bodies, "Component: Name" for specs.

  ▸ Subsection label: UPPERCASE, 2-space indent from left │.  Under- line: `─` characters at same indent, matching label width exactly.

  ▸ Blank row BEFORE every subsection label (inside the frame) — separates this subsection visually from the previous one.

  ▸ Blank row AFTER every underline before content begins — gives the label its own visual space before the reader drops into content.

  ▸ Content width: 2-space indent from left │ for top-level content, +2 per nesting level (so 4 for files under paths, 6 for members under files).

  ▸ End of each subsection: blank row before the next label.  Every subsection has top AND bottom breathing.

Common subsection labels (vocabulary guide — keep to a small set per response so the reader builds muscle memory):

  ▸ IN SCOPE / EXPLICITLY NOT IN SCOPE  — plan and ticket structure
  ▸ DEPENDS ON / EXPOSES                — phased work contracts
  ▸ DEFINITION OF DONE                  — ticket completion criteria
  ▸ NEW / MODIFIED / REMOVED            — PR summary structure
  ▸ INPUTS / OUTPUTS / SIDE EFFECTS     — function or service specs
  ▸ ASSUMPTIONS / CONSTRAINTS / RISKS   — design docs

Use when:

  ▸ Multi-faceted concept where each facet deserves its own named structural region

  ▸ Plans, scopes, specifications, ticket bodies, API contracts

  ▸ Reader needs to jump straight to a specific facet (pass the skim test: can each subsection label be spotted at a glance?)

Don't use when:

  ▸ Only one facet matters — use a plain framed card
  ▸ Facets are sequential steps — use a pipeline box

  ▸ Facets are similar items to compare — use ruled cards or a comparison table


─── Content pattern — file-tree inventory ───────────────────────────

A structured way to list file and member changes — not a shape, a content pattern. Because its content is copyable paths and members, emit it as a fenced `text` block (standalone, or referenced from a frame with a short label), never as raw rows inside a frame — the baseline's bright line applies to every path and member in it.

```text
Core/Models/
  + SidebarSurface.swift (.repos | .inbox enum)

Core/State/MainActor/Atoms/
  UIStateAtom.swift  [MOD]
    + sidebarCollapsed: Bool
    + sidebarSurface: SidebarSurface
    + 3 setters

App/Windows/
  SidebarSurfaceHost.swift  [NEW]
    switches between RepoExplorerView and a placeholder inbox view
    based on uiState.sidebarSurface
  MainSplitViewController.swift  [MOD]
    drop UserDefaults read at line 91 + write at line 98
    read uiState.sidebarCollapsed; observe changes
  AppDelegate.swift  [MOD]
    await UIStateStore.load() before opening windows

App/Commands/
  AppCommand.swift  [MOD]
    + .showNotificationInbox
    + .showWorktreeSidebar
  AppShortcut.swift  [MOD]
    bind ⌘I  →  .showNotificationInbox
    bind ⌘S  →  .showWorktreeSidebar

Features/Sidebar/  →  Features/RepoExplorer/
  Pure file-move rename + type/file renames:
    RepoSidebarContentView  →  RepoExplorerView
    SidebarFilter           →  RepoExplorerFilter
    SidebarWorktreeRow      →  RepoExplorerWorktreeRow
```

Layout and spacing notes:

  ▸ Paths end with `/`.  Zero indent.  Blank line BETWEEN path groups so the reader sees the tree's trunks at a glance.

  ▸ File names indented 2 spaces under the path.  File name, two spaces, then mutation tag in brackets: `[NEW]` / `[MOD]` / `[DEL]`.

  ▸ Member changes indented 4 spaces under the file: `+ addedMember`       (addition) `- removedMember`     (deletion) `mutatedMember`       (no prefix — just mentioning it changed)

  ▸ Short free-form descriptions live on a following indented line under the file or member.  Wrap at the frame's content width.

  ▸ Rename on the path line: `OldPath/ → NewPath/` with spaces around `→`.  Member renames inside use the same `Old → New` convention.

  ▸ Don't nest paths visually — each path starts at column 0 of the content area regardless of file-system hierarchy depth. Path names carry the hierarchy.

Mutation tag vocabulary (keep closed):

  ▸ [NEW]  — file is being created
  ▸ [MOD]  — file has modifications
  ▸ [DEL]  — file is being deleted
  ▸ [REN]  — file is being renamed (prefer `old → new` on path line)

Use when:

  ▸ PR summaries listing file-level changes
  ▸ Ticket IN SCOPE lists inside a scope-inventory frame
  ▸ Phase plan inventories showing what each phase touches
  ▸ Design docs enumerating affected modules

Don't use when:

  ▸ Changes are content-level within a single file — use a diff snippet instead

  ▸ You need line-level precision — use actual diff output
  ▸ The list is trivial (1-2 files) — just name them in prose
