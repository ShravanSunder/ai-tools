Build Discipline — TUI Presentation Reference
══════════════════════════════════════════════════════════════════════

Deep-dive companion to SKILL.md.  Load when you need worked examples,
mechanical build procedure, alignment arithmetic, overflow recipes,
or shape variants.  This file is the HOW; the five peer references
(tables, ui-layouts, architecture, sequence-and-state, annotations-
and-specs) are the WHAT catalogs.

All examples below use canvas width 70 unless noted.


─── Shape catalog — full worked examples ────────────────────────────

Each shape with a realistic worked example, commentary on geometry
choices, and notes on when NOT to use it.


─── Shape 1 — Framed card (titled) ──────────────────────────────────

```
┌─ Scope — what this ticket actually changes ─────────────────────────┐
│                                                                     │
│  ✓ Drawer concept                                                   │
│    Add a bell icon to the drawer's trailing actions and a per-      │
│    drawer popover. Behavior: purely additive. No model change.      │
│                                                                     │
│  ✓ Pane focus tracker                                               │
│    Observe active-pane transitions via PaneFocusTracker. Read-      │
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

  ▸ Title lives inside the top border: `┌─ Title ─...─┐`.  Two fixed
    `─` chars before the title, one space, title, one space, fill `─`
    to column 69, then `┐` at column 70.

  ▸ Content rows: `│ ` at col 0 + space + 2 indent + content, padded
    to col 69, `│` at col 70.

  ▸ Blank row after `┌─┐` and before `└─┘` for breathing.

  ▸ Items use `✓` / `✗` markers as bullets — they carry meaning
    (in-scope / out-of-scope).

  ▸ Each item: marker + title line, continuation prose hang-indented
    under the title text (4 spaces).

  ▸ Blank line between items inside the frame.

Use when:

  ▸ Single concept deserves a title and a self-contained body
  ▸ Content is prose or a structured list, not a table or flow
  ▸ The reader should be able to skip the frame if not relevant

Don't use when:

  ▸ Content is a diagram (use a specific shape instead)
  ▸ Body is only 1-2 short lines (prose is lighter and works)

  ▸ Several parallel concepts deserve equal billing (use sub-framed
    grid)

See also in peer references:

  ▸ ui-layouts.md — titled frames nested in parent frames
  ▸ annotations-and-specs.md — titled frames for design proposals


─── Shape 2 — Sub-framed grid ───────────────────────────────────────

```
┌─ Three kinds of keyboard modality ──────────────────────────────────┐
│                                                                     │
│   Kind 1: LAYER               Kind 2: KEY WINDOW                    │
│   ┌──────────────────┐        ┌──────────────────┐                  │
│   │ Rare, explicit,  │        │ AppKit owns it.  │                  │
│   │ modal.           │        │ Panel becomes    │                  │
│   │                  │        │ key: CommandBar, │                  │
│   │ Strong chrome    │        │ sheets, alerts.  │                  │
│   │ change.          │        │                  │                  │
│   └──────────────────┘        └──────────────────┘                  │
│                                                                     │
│   Kind 3: FOCUS-SCOPED KEYS                                         │
│   ┌──────────────────────────────────────────────────┐              │
│   │ Custom keys that fire when a surface has focus.  │              │
│   │ No stored mode — derived from visibility+focus.  │              │
│   │ This ticket. Uses .keyboardShortcut() + AppKit   │              │
│   │ responder chain.                                 │              │
│   └──────────────────────────────────────────────────┘              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Parent frame canvas width: 70.
  ▸ Inner content width: 68 (70 minus two │ borders).

  ▸ Two sub-frames across in the first row: each 20 wide + 8 gap
    between + 2 left padding + 2 right padding = 52.  Remaining 16
    cols are outer gutter padding inside the parent.

  ▸ Third sub-frame spans wider (54) for longer content — allowed
    because it's a standalone row.

  ▸ Sub-frame borders are ┌─┐ matching the parent style (single
    borders consistent).

  ▸ Blank rows inside parent frame around each sub-row.

Use when:

  ▸ Parallel concepts at equal rank need side-by-side display
  ▸ 2-3 concepts max per row (4+ too cramped at canvas 70)
  ▸ Concepts are independent — no flow between them

Don't use when:

  ▸ Concepts have sequential relationship (use pipeline or state)
  ▸ One concept much bigger than others (use separate framed cards)
  ▸ Readability suffers at canvas 70 — consider stacking vertically

See also in peer references:

  ▸ ui-layouts.md — nested cards, tiled panes, modal overlay layouts


─── Shape 3 — Ruled card ────────────────────────────────────────────

```
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

  ▸ Each card has the same field structure: #:, Concern:, Where:,
    Why it matters:.

  ▸ Field labels align on the left; values follow the `:` on the
    same line.

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

```
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

  ▸ The third column can extend downward with longer prose —
    unbounded because no │ constrains it.

Use when:

  ▸ Parallel data at different temporal frames or states
  ▸ Columns can have unequal depth — no frame forces equal height
  ▸ Narrative prose in one column is fine — it flows downward

Don't use when:

  ▸ Content fits a bordered table (use framed table instead)
  ▸ More than 4 columns at canvas 70 — too cramped
  ▸ Reader needs row-by-row comparison rather than column-by-column


─── Shape 5 — Pipeline box ──────────────────────────────────────────

```
execute(.closePane(tabId, paneId))
  │
  ▼
┌─────────────────────────────────────────────────────────────────────┐
│ 1. snapshot for undo (if applicable)                                │
├─────────────────────────────────────────────────────────────────────┤
│ 2. teardown view                                                    │
├─────────────────────────────────────────────────────────────────────┤
│ 3. removal                                                          │
│      drawer child?  ──► store.removeDrawerPane                      │
│      main pane?     ──► tabLayoutAtom.removePaneFromLayout          │
├─────────────────────────────────────────────────────────────────────┤
│ 4. retire slot (not delete)                                         │
├─────────────────────────────────────────────────────────────────────┤
│ 5. container aftermath                                              │
│      tab empty?     ──► removeTab                                   │
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

  ▸ No blank row after ┌─┐ or before └─┘ here because the dividers
    already provide visual separation.

Use when:

  ▸ Numbered sequential steps in a process
  ▸ Each step is 1-2 lines; a few steps can expand with sub-items
  ▸ 3-8 steps total — 10+ becomes too tall; use state diagram

Don't use when:

  ▸ Steps have branches or loops (use state diagram)
  ▸ Steps are independent, not sequential (use ruled cards)
  ▸ Individual step content is large — pipeline forces thin strips


─── Shape 6 — State diagram ─────────────────────────────────────────

```
┌──────────────┐   register   ┌──────────────┐
│   no slot    │ ───────────► │    LIVE      │
└──────────────┘              │  slot.host=… │
       ▲                      └──────┬───────┘
       │                             │
       │ finalize                    │  unregister
       │                             ▼
       │                      ┌──────────────┐
       │                      │   ORPHANED   │
       │                      │ slot.host=nil│
       │                      └──────┬───────┘
       │                             │
       │                             │  removeSlot
       │                             ▼
       │                      ┌──────────────┐
       └──────────────────────│   RETIRED    │
                              │ slot.host=nil│
                              │ (tombstone)  │
                              └──────────────┘
```

Geometry choices:

  ▸ State boxes all 14 wide for visual rhythm.

  ▸ Main flow down the right column (no slot → LIVE → ORPHANED →
    RETIRED).

  ▸ Re-entry arm on the left — back to `no slot` via `finalize`.
  ▸ Arrow labels ride on the arrow line.

  ▸ The re-entry arm uses │ ▲ at the left margin and connects at
    the bottom.

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

```
2440564  docs(spec): hoist sidebarHasFocus contract; full matrix
7c11794  docs(spec): sidebarHasFocus explicit; KeyboardOwner scope
23d9ea1  docs: review — coherence + arch docs catch-up
0ea8b8c  docs: scope Features/Sidebar/→RepoExplorer rename
65835c2  docs(spec): align with UIStateAtom composition
aac6cdd  docs(arch): feature-slice self-containment
17da443  Merge origin/main
```

Geometry choices:

  ▸ Fixed-width first column (7-char SHA), then two spaces, then
    variable-width subject.

  ▸ No borders, no rules.
  ▸ Left-aligned throughout.

  ▸ Two-space column gap (not one, not three) — the tight-but-
    readable standard.

Use when:

  ▸ Reading-linear content (git log, status matrix, test results)
  ▸ One "label" column + one "description" column
  ▸ No need for cordoning — content reads top-to-bottom

Don't use when:

  ▸ Content needs to stand apart from surrounding prose (frame it)
  ▸ Multiple parallel columns need to be compared (column-ruled)
  ▸ The list is a step sequence (pipeline box)


─── Shape anti-patterns ─────────────────────────────────────────────

The #1 TUI failure mode: cramming multiple concerns into one giant
frame.  One shape per block.  One shape per content type.  Split
across sections.

WRONG — everything crammed into one ╔═╗ box:

```
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

Problems: double borders misused for non-focal content; markdown
pipe-table inside the frame; comparison + flow + synthesis
crammed together; reader can't parse what's what.

RIGHT — split into sections, each with an appropriate shape:

```
─── Option comparison ────────────────────────────────────────────────

option A              option B                option C
──────────────        ────────────────        ──────────────────

fast                  flexible                simple
rigid                 complex                 coupled

─── Decision flow ────────────────────────────────────────────────────

┌─────────────────────────────────────────────────────────────────────┐
│ 1. check option A                                                   │
├─────────────────────────────────────────────────────────────────────┤
│ 2. if not A, check B                                                │
├─────────────────────────────────────────────────────────────────────┤
│ 3. if not B, default to C                                           │
└─────────────────────────────────────────────────────────────────────┘

─── My read ──────────────────────────────────────────────────────────

Option B — flexibility matters more than implementation cost here.
```

Three concerns → three sections → three shapes.  Comparison uses
column-ruled (parallel data).  Flow uses pipeline box (sequential
steps).  Synthesis uses prose (single-paragraph conclusion).  One
shape per block.  One heading per section.


─── Shape variants and applications ─────────────────────────────────

Three worked examples of shapes applied to specific real-world
layouts.  These aren't new shapes — they're compositional patterns
built from the vocabulary above.


─── Shape 2 variant — phase-sequence layout ─────────────────────────

A sub-framed grid tuned for phased/sequential work: horizontal sub-
frames labeled above each, connector prose below showing dependencies.

```
         PHASE 1                    PHASE 2                    PHASE 3
┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
│                        │  │                        │  │                        │
│ Goal: shell ready,     │  │ Goal: derived owner +  │  │ Goal: real feature.    │
│ surface tag + focus +  │  │ first consumer; ⌘P     │  │ Atoms, router, views,  │
│ collapsed all on       │  │ default scope reacts   │  │ drawer, RPC, keymap,   │
│ UIStateAtom; ⌘I/⌘S    │  │ to current owner.       │  │ tests.                 │
│ commands work.         │  │                        │  │                        │
│                        │  │                        │  │                        │
│ Visible: ⌘I shows an   │  │ Visible: ⌘P from       │  │ Visible: Inbox has     │
│ empty inbox            │  │ focused inbox surface  │  │ notifications, full    │
│ placeholder; ⌘S        │  │ defaults to .inbox.    │  │ keymap, full tests.    │
│ shows repos as today.  │  │                        │  │                        │
│                        │  │                        │  │                        │
│ Files: ~5              │  │ Files: ~10             │  │ Files: ~15 NEW + ~7    │
│ (App, Core, Features/  │  │ (Core/Models, Core/    │  │  MOD                   │
│  Sidebar→RepoExplorer  │  │  State, Features/      │  │ (Features/Notif-       │
│  rename, MainSplit-    │  │  CommandBar)           │  │  icationInbox/, plus   │
│  ViewController        │  │                        │  │  Drawer, RPC, App-     │
│  migration)            │  │                        │  │  Delegate, App-        │
│                        │  │                        │  │  Command/Shortcut)     │
│                        │  │                        │  │                        │
└───────────┬────────────┘  └───────────┬────────────┘  └────────────────────────┘
            │                           │
            └─► Phase 2 reads composition state added in Phase 1.
                Phase 3 imports both atoms and surface enum from Phase 1;
                consumes KeyboardOwner from Phase 2 (CommandBar scope).

                Phase 1 stands alone with no upstream deps.
```

Geometry choices:

  ▸ Phase labels sit above each sub-frame as prose ("PHASE 1"), not
    inside.  Keeps the frame reserved for the goal/content.

  ▸ Sub-frames are all the same width (24 inner, 26 outer) for rhythm.
  ▸ 2-char gap between sub-frames ("  " between `┐` and `┌`).

  ▸ Each sub-frame has Goal / Visible / Files as labeled sections
    separated by blank rows.

  ▸ Connector line below: `│` emerges from each frame's bottom
    center (via `└───┬────┘`), then joins into prose explaining
    dependencies.

  ▸ Dependencies stated as prose — not drawn with arrow geometry —
    because they're complex and narrative-worthy.

Use when:

  ▸ Presenting a multi-phase plan with clear boundaries
  ▸ Each phase has parallel structure (goal, output, scope)
  ▸ Dependencies between phases need commentary, not just arrows

Don't use when:

  ▸ Phases aren't truly parallel in structure (use separate framed
    cards, one per phase)

  ▸ More than 3-4 phases (canvas 70 can't fit wider grids; stack
    vertically instead)


─── Shape 1 application — Q&A rationale frames ──────────────────────

A series of framed cards where each card answers one "why this / why
not that" question.  Scales to multiple alternatives without nesting
and without forcing a comparison table.

```
┌─ Why not 2 phases (combine A+B) ────────────────────────────────────┐
│                                                                     │
│  KeyboardOwner is a separable architecture primitive that           │
│  outlasts the inbox feature.  Future repo navigation needs it.      │
│  Shipping it on its own gives it a clean review and PR.             │
│                                                                     │
│  Combining would make Phase 1 do too much — composition state       │
│  migration AND a new derived reader AND CommandBar changes.         │
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
│  Phase 1 introduces SidebarSurfaceHost which imports both           │
│  Features/RepoExplorer/ and (eventually) Features/Notification      │
│  Inbox/.  The clean naming should land at the same moment as        │
│  the new shell.                                                     │
│                                                                     │
│  Alternative: Phase 0 — pure rename PR with no behavior change,     │
│  lands first.  Cleaner review separation.  Worth considering if     │
│  the team prefers tiny PRs.                                         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Geometry choices:

  ▸ Each question gets its own standalone framed card — not stacked
    inside a parent frame.

  ▸ Title phrased as the question itself ("Why not X", "Why include
    Y") — the frame's top IS the question.

  ▸ Body is prose reasoning, typically 2-4 paragraphs separated by
    blank lines inside the frame.

  ▸ Blank line BETWEEN cards (outside them) — each card is a
    distinct answer.

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

Review findings (HIGH / MEDIUM / LOW severity) are a specific
application of framed cards.  Each finding is a framed card with
the severity tag in the frame title.  Reader scans severity badges
down the left margin to triage at a glance.

```
┌─ [HIGH] Surface handoff race during mode switch ────────────────────┐
│                                                                     │
│  Location: FlatTabStripContainer.swift:58-109                       │
│                                                                     │
│  Mode switch uses if/else if/else branches.  SwiftUI's              │
│  .onAppear / .onDisappear at branch boundaries are NOT              │
│  transactional.                                                     │
│                                                                     │
│  Race sequence:                                                     │
│                                                                     │
│    mode switch                                                      │
│                                                                     │
│      old branch .onDisappear                                        │
│        ──► unregisterSurface(oldId)                                 │
│        ──► union is empty                                           │
│        ──► all retired slots deleted                                │
│                                                                     │
│      new branch .onAppear                                           │
│        ──► surfaceRenderedIds(newId, ids)                           │
│        ──► but tombstones already gone                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Proposed fix — move registration UP to FlatTabStripContainer:

    let surfaceId = "tab:\(tabId)"
    content
      .onAppear     { viewRegistry.surfaceRenderedIds(...) }
      .onChange(of: renderedIds) { _, new in ... }
      .onDisappear  { viewRegistry.unregisterSurface(surfaceId) }

┌─ [MEDIUM] Task 3 tests revive the tombstone ────────────────────────┐
│                                                                     │
│  Location: Task 3, Steps 4 and 5                                    │
│                                                                     │
│  Tests use ensureSlot(for: paneId) which promotes tombstones in     │
│  place.  First assertion un-retires the pane; subsequent            │
│  finalization runs over empty retiredPaneIds.  Tests can pass       │
│  while the production path is broken.                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

Proposed fix — add a DEBUG-only non-promoting probe:

    #if DEBUG
      /// Non-promoting, non-creating test probe.
      func peekSlotForTesting(_ paneId: UUID) -> PaneViewSlot? {
          slots[paneId]
      }

      func isRetiredForTesting(_ paneId: UUID) -> Bool {
          retiredPaneIds.contains(paneId)
      }
    #endif

Rewrite Task 3 tests to use these probes so the tombstone state is
observed without being mutated.
```

Geometry choices:

  ▸ Severity bracketed tag is the FIRST element of the frame title:
    `┌─ [HIGH] Title ─...─┐`.  Reader sees badge immediately when
    scanning from the left margin.

  ▸ Each finding's body starts with a "Location:" field pointing at
    the affected file/function.  Then prose explanation.  Then an
    embedded flow diagram if useful (indented under a label line,
    per the cordoning rule).

  ▸ Proposed fixes live OUTSIDE the finding frame — below it,
    indented 4 spaces as code blocks, with a prose lead-in.  Fixes
    are NOT part of the finding itself.

  ▸ Blank line between findings.  Findings are independent — one
    can be accepted without the other.

Use when:

  ▸ Adversarial review output with multiple findings
  ▸ Code review with graded severity (HIGH / MEDIUM / LOW)
  ▸ Security or design review with severity tags
  ▸ Any "list of concerns with varying importance" pattern

Don't use when:

  ▸ All findings are equal severity — use ruled cards instead
  ▸ Only 1 finding — use a plain framed card

  ▸ Findings cross-reference each other heavily — consider a
    combined state/relationship diagram


─── Shape 1 application — dual-tag title band ───────────────────────

A framed card whose title band carries TWO tags: identifier on the
LEFT and status on the RIGHT, with description in the middle.  `─`
characters fill the space between.  Used for triage dashboards,
resolution summaries, task trackers — anywhere items need both
stable identity and current state, both visible at a glance.

```
┌─ F1: sidebarCollapsed dual-write ──────────────────────── RESOLVED ─┐
│                                                                     │
│  spec §8.1 annotation: stripped "dual-write to UserDefaults"        │
│  workspace_data_architecture.md Tier C struct comment: rewritten    │
│  Spec + arch + Phase 1 plan now tell a single greenfield story      │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F2: Notification name collision ──────────────────────── DEFERRED ─┐
│                                                                     │
│  To be discussed.  Spec + plans still use `struct Notification`.    │
│  Options: (a) rename to InboxNotification, (b) nest under Inbox     │
│  namespace.  Decision pending input from design-review.             │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F3: Cross-feature imports ────────────────────────────── RESOLVED ─┐
│                                                                     │
│  Spec §8.5 added two seam subsections:                              │
│    §8.5.1  RepoExplorerWorktreeRow — Int unreadCount prop           │
│    §8.5.2  CommandBarDataSource — NotificationInboxCommands bundle  │
│                                                                     │
│  Task 13 — CommandBarDataSource consumes NotificationInboxCommands; │
│            test uses InboxCommandsSink (no atom access)             │
│  Task 15 — AppDelegate constructs the commands bundle with weak     │
│            captures                                                 │
│                                                                     │
│  Each task has grep guards to confirm Features/X does not import    │
│  Features/Y.                                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘

┌─ F4: PaneFocusTracker polling ─────────────────────────── RESOLVED ─┐
│                                                                     │
│  Task 5 code block rewritten: test harness now uses bounded         │
│  Task.yield() helper instead of wall-clock Task.sleep, per the      │
│  "No Wall-Clock Tests" rule.                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Layout and spacing notes:

  ▸ Every card is the SAME canvas width.  RESOLVED / DEFERRED land
    at the same column across all cards, so the reader's eye can
    scan the right margin vertically to see status distribution.

  ▸ Every card uses the SAME indent (2 spaces from left │) and
    SAME body width.  Vertical consistency makes the stack scannable.

  ▸ Title format: `┌─ ID: Title ─...──── STATUS ─┐` — the `─` chars
    fill the middle to reach canvas width.  Single space before and
    after STATUS to keep it visually distinct from the fill dashes.

  ▸ One blank row at top AND bottom inside each frame for breathing.
  ▸ Blank line BETWEEN cards — each is a distinct answer.

  ▸ When body has sub-lists (see F3's task list), blank rows
    separate semantic groups within the body.

Use when:

  ▸ Triage reports: findings with stable ID + closed-vocab status
    (RESOLVED / DEFERRED / PENDING / BLOCKED / WONTFIX)

  ▸ Task dashboards (TODO / IN-PROGRESS / DONE / BLOCKED)
  ▸ Iteration summaries: "here's where we landed on each concern"

  ▸ Any review response where items previously raised have now been
    categorized

Don't use when:

  ▸ All items share one status (drop the right tag — plain framed
    card is enough)

  ▸ Status vocabulary is large or open-ended (more than ~6 values)
    — use a table with a status column instead

  ▸ Items need cross-referencing or relational structure — use a
    table or state diagram


─── Shape 1 application — scope inventory with subsections ─────────

A framed card whose body contains multiple NAMED subsections,
each labeled in UPPERCASE with a `─` underline matching label
width.  Used for phase plans, ticket scopes, component specs,
API contracts — any concept with multiple distinct facets that
all belong together under one named scope.

File-tree inventory (documented below) is the most common content
type for the IN SCOPE / NOT IN SCOPE subsections.

```
┌─ PHASE 1 — Sidebar Composition Foundation ─────────────────────────┐
│                                                                    │
│  IN SCOPE                                                          │
│  ─────────                                                         │
│                                                                    │
│  Core/Models/                                                      │
│    + SidebarSurface.swift (.repos | .inbox enum)                   │
│                                                                    │
│  Core/State/MainActor/Atoms/                                       │
│    UIStateAtom.swift  [MOD]                                        │
│      + sidebarCollapsed: Bool                                      │
│      + sidebarSurface: SidebarSurface                              │
│      + sidebarHasFocus: Bool  (runtime-only, not persisted)        │
│      + 3 setters                                                   │
│                                                                    │
│  App/Windows/                                                      │
│    SidebarSurfaceHost.swift  [NEW]                                 │
│      switches between RepoExplorerView and placeholder             │
│    MainSplitViewController.swift  [MOD]                            │
│      drop UserDefaults read at line 91 + write at line 98          │
│      read uiState.sidebarCollapsed; observe changes                │
│                                                                    │
│  Features/Sidebar/  →  Features/RepoExplorer/                      │
│    Pure file-move rename + type/file renames:                      │
│      RepoSidebarContentView  →  RepoExplorerView                   │
│      SidebarFilter           →  RepoExplorerFilter                 │
│      SidebarWorktreeRow      →  RepoExplorerWorktreeRow            │
│                                                                    │
│  EXPLICITLY NOT IN SCOPE                                           │
│  ────────────────────────                                          │
│                                                                    │
│  ✗ KeyboardOwner enum / KeyboardOwnerDerived                       │
│  ✗ Notification model, atoms, store, router                        │
│  ✗ CommandBar .inbox scope                                         │
│  ✗ Inbox-specific shortcuts (⌥F / ⌥G / ⌥S)                         │
│                                                                    │
│  DEPENDS ON                                                        │
│  ───────────                                                       │
│                                                                    │
│  Nothing.  Phase 1 stands alone.                                   │
│                                                                    │
│  EXPOSES (consumed by later phases)                                │
│  ───────────────────────────────────                               │
│                                                                    │
│  → Phase 2:  UIStateAtom composition reads, SidebarSurface enum    │
│  → Phase 3:  SidebarSurfaceHost (plug InboxSidebarView into it)    │
│                                                                    │
│  DEFINITION OF DONE                                                │
│  ──────────────────                                                │
│                                                                    │
│  ▸ ⌘I switches sidebar to InboxPlaceholderView                     │
│  ▸ ⌘S switches sidebar to repos (RepoExplorerView)                 │
│  ▸ Sidebar collapse state survives relaunch via UIStateStore       │
│  ▸ UserDefaults "sidebarCollapsed" key no longer read or written   │
│    (grep: 0 hits)                                                  │
│  ▸ All existing sidebar tests pass after rename                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

Layout and spacing notes:

  ▸ Outer frame title names the scope: "PHASE 1 — Title" for phased
    plans, "Ticket LUNA-361" for ticket bodies, "Component: Name"
    for specs.

  ▸ Subsection label: UPPERCASE, 2-space indent from left │.  Under-
    line: `─` characters at same indent, matching label width exactly.

  ▸ Blank row BEFORE every subsection label (inside the frame) —
    separates this subsection visually from the previous one.

  ▸ Blank row AFTER every underline before content begins — gives
    the label its own visual space before the reader drops into
    content.

  ▸ Content width: 2-space indent from left │ for top-level content,
    +2 per nesting level (so 4 for files under paths, 6 for members
    under files).

  ▸ End of each subsection: blank row before the next label.  Every
    subsection has top AND bottom breathing.

Common subsection labels (vocabulary guide — keep to a small set
per response so the reader builds muscle memory):

  ▸ IN SCOPE / EXPLICITLY NOT IN SCOPE  — plan and ticket structure
  ▸ DEPENDS ON / EXPOSES                — phased work contracts
  ▸ DEFINITION OF DONE                  — ticket completion criteria
  ▸ NEW / MODIFIED / REMOVED            — PR summary structure
  ▸ INPUTS / OUTPUTS / SIDE EFFECTS     — function or service specs
  ▸ ASSUMPTIONS / CONSTRAINTS / RISKS   — design docs

Use when:

  ▸ Multi-faceted concept where each facet deserves its own named
    structural region

  ▸ Plans, scopes, specifications, ticket bodies, API contracts

  ▸ Reader needs to jump straight to a specific facet (pass the
    skim test: can each subsection label be spotted at a glance?)

Don't use when:

  ▸ Only one facet matters — use a plain framed card
  ▸ Facets are sequential steps — use a pipeline box

  ▸ Facets are similar items to compare — use ruled cards or a
    comparison table


─── Content pattern — file-tree inventory ───────────────────────────

A structured way to list file and member changes — not a shape,
a content pattern that lives inside a framed card (typically a
scope-inventory's IN SCOPE subsection) or standalone in a PR
summary.

```
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

  ▸ Paths end with `/`.  Zero indent.  Blank line BETWEEN path groups
    so the reader sees the tree's trunks at a glance.

  ▸ File names indented 2 spaces under the path.  File name, two
    spaces, then mutation tag in brackets: `[NEW]` / `[MOD]` / `[DEL]`.

  ▸ Member changes indented 4 spaces under the file:
      `+ addedMember`       (addition)
      `- removedMember`     (deletion)
      `mutatedMember`       (no prefix — just mentioning it changed)

  ▸ Short free-form descriptions live on a following indented line
    under the file or member.  Wrap at the frame's content width.

  ▸ Rename on the path line: `OldPath/ → NewPath/` with spaces
    around `→`.  Member renames inside use the same `Old → New`
    convention.

  ▸ Don't nest paths visually — each path starts at column 0 of
    the content area regardless of file-system hierarchy depth.
    Path names carry the hierarchy.

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

  ▸ Changes are content-level within a single file — use a diff
    snippet instead

  ▸ You need line-level precision — use actual diff output
  ▸ The list is trivial (1-2 files) — just name them in prose


─── Build procedure — step by step with snapshots ───────────────────

Follow this procedure when drawing a framed card.  Other shapes use
the same discipline with shape-specific adjustments.

Canvas = 70.

Step 1 — Commit canvas width.  State the width (or keep it in a
mental note).  Default 70.  Do not change mid-block.

Output so far: (nothing)

Step 2 — Emit the top border.

For a titled frame: `┌─ [title] ─...─┐`

▸ 2 fixed `─` chars after `┌`
▸ one space
▸ title
▸ one space
▸ fill `─` up to column 68
▸ `┐` at column 69

```
┌─ Example section title ─────────────────────────────────────────────┐
```

Step 3 — Emit breathing row.

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
```

`│` at col 0, 68 spaces, `│` at col 69.

Step 4 — Emit content row.  Content indented 2 spaces from left │.
Right-pad to col 69 with spaces, then `│`.

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
```

Step 5 — Emit blank row between semantic groups (when needed).

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
│                                                                     │
│  Second group starts here, visually distinct from the first.        │
```

Step 6 — Emit closing breathing row and bottom border.

```
┌─ Example section title ─────────────────────────────────────────────┐
│                                                                     │
│  First line of content goes here, padded right with spaces.         │
│                                                                     │
│  Second group starts here, visually distinct from the first.        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Step 7 — Verify.

▸ Every row's right edge lands at col 69 (the │ or ┐ or ┘)
▸ Total line length = 70 chars
▸ No markdown syntax inside
▸ Single borders only (no ╔═╗ mixed in)
▸ Identifier content not truncated mid-token

If any row's right edge doesn't land at col 69: pad with spaces, or
apply overflow policy (shorten/wrap/widen).


─── Alignment recipes ───────────────────────────────────────────────

Cell-width arithmetic for tables.  For a K-cell row at canvas N:

```
  w1 + w2 + ... + wK + (K + 1) = N
                       ↑
                       K+1 separator chars: one │ between each cell
                       plus the two │ borders
```

Example: 3-cell table at canvas 70 → `w1 + w2 + w3 + 4 = 70` → sum
of cell widths = 66.  Distribute: e.g. 20 / 30 / 16, or 15 / 25 / 26.

Junction character selection.  Pick by which sides connect:

```
  ┌ ┐       corners: 2 sides (horizontal + vertical)
  ├ ┤       T-junction: 3 sides (vertical + horizontal to one side)
  ┬ ┴       T-junction: 3 sides (horizontal + vertical one direction)
  ┼         cross: 4 sides
  └ ┘       corners
```

Never drop to `+` — the result is noisy and amateurish.  Stay in
Unicode.

Padding rules:

  ▸ Left-aligned content: append spaces to reach the right alignment
    column

  ▸ Centered content: prepend (width − content) / 2 spaces, append
    the remainder

  ▸ Right-aligned content: prepend spaces until content ends at the
    right alignment column

Consistency rule.  Every row of a given block must emit structural
chars at the same columns.  If row 1 has │ at col 12, every row in
that block has │ at col 12 — or the block is broken.

Before/After drift example.  When content changes and row widths
accidentally mismatch, catch and fix:

BROKEN (top/bottom border ends col 70, rows end col 68):

```
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                │
├─────────────────┼──────────────────────────────────────────────┤
│ review_model    │ The Codex CLI model used for reviews         │
│ approval_mode   │ When tools require approval                │
└─────────────────┴──────────────────────────────────────────────┘
```

Scan the right edge — row 1 and row 4 end at col 68, but the
borders end at col 70.  Drift.

FIXED (every row ends col 70):

```
┌─────────────────┬──────────────────────────────────────────────┐
│ Field           │ Description                                  │
├─────────────────┼──────────────────────────────────────────────┤
│ review_model    │ The Codex CLI model used for reviews         │
│ approval_mode   │ When tools require approval                  │
└─────────────────┴──────────────────────────────────────────────┘
```

Fix: pad each row's content with spaces until the closing │ lands
exactly at canvas width.  Count chars if unsure.


─── Indentation recipes ─────────────────────────────────────────────

Indent depth by pattern:

```
Pattern                         Indent depth
──────────────────────────      ──────────────────────────────
Label → content                 2 spaces
Sub-item under list item        2-4 spaces per nesting level
Code snippet inline with prose  4 spaces
Continuation of wrapped line    under first content char
Inside framed card              2 spaces from left │
```

Worked examples.  For each common pattern, the WRONG and RIGHT
side-by-side.

Label → content:

```
WRONG                            RIGHT
─────                            ─────

What you expect:                 What you expect:

drawer drag                        drawer drag
→ only drawer active                 → only drawer active
→ main panes inert                   → main panes inert
```

Sub-items nested:

```
WRONG                            RIGHT
─────                            ─────

Current ownership:               Current ownership:

drag starts on drawer              drag starts on drawer
├── drawer overlay                   ├── drawer overlay
→ DrawerSplitContainer...                  → DrawerSplitContainer
└── main tab overlay                 └── main tab overlay
→ SplitContainer...                        → SplitContainer
```

Code snippet inline:

```
WRONG                            RIGHT
─────                            ─────

When pane is in drawer:          When pane is in drawer:

useDrawerFramePreference             useDrawerFramePreference
== true                              == true

and it publishes both keys.      and it publishes both keys.
```

Continuation hang-indent:

```
WRONG                            RIGHT
─────                            ─────

Problem: the pane                Problem: the pane publishes
publishes frames into              frames into both maps,
both maps, which                   which explains the leak.
explains the leak.
```

Indent is always worth the characters.  Flat output is unreadable;
indented output reveals hierarchy at a glance.


─── Overflow recipes ────────────────────────────────────────────────

Shorten with `…`.  Preferred.  No reflow.

```
before:  │ tabLayoutAtom.removePaneFromLayout        │
after:   │ tabLayoutAtom.removePane…                  │
```

Prefer truncating at a word or dot boundary if visible.  If the
identifier is one word (`removePaneFromLayout`), prefer wrap or
widen.

Wrap to next line.  When the content can't be shortened (identifier,
quoted string).

```
before:  │ Some very long prose that doesn't fit in the available width │
                                                                       ↑ drift

after:   │ Some very long prose that doesn't fit in the available     │
         │   width (hanging-indented continuation)                     │
```

Continuation hang-indents 2-4 spaces under the first content char.

Widen the column.  Only when shorten loses meaning AND wrap is ugly.
Reflows the whole block.

```
before:  │ col1 │ col2 │ col3 │     cells are 8 chars each
after:   │ col1     │ col2 │ col3 │   col1 widened to 12 chars
```

Widen the column that has the longest content.  Recompute all
alignment columns.

Identifier wrap rule.  Code identifiers never truncate mid-token.
When an identifier won't fit in a cell, wrap the entire line so the
identifier stays intact AND the frame border stays at canvas width:

WRONG (ragged right, breaks frame contract):

```
│ 3. removal                              │
│      drawer child?  ──► store.removeDrawerPane
│      main pane?     ──► tabLayoutAtom.removePaneFromLayout
├─────────────────────────────────────────┤
```

RIGHT (wrap the identifier onto its own line):

```
│ 3. removal                                                        │
│      drawer child?                                                │
│        ──► store.removeDrawerPane                                 │
│      main pane?                                                   │
│        ──► tabLayoutAtom.removePaneFromLayout                     │
├───────────────────────────────────────────────────────────────────┤
```

Canvas width stays intact on every line.  Identifier stays intact
on its own row.  Both contracts honored — no tradeoff needed.  If
the wrap makes the block too tall, widen the block's canvas width
instead of breaking the frame.


─── Verification checklist ──────────────────────────────────────────

Run this before shipping a response.  Every item must pass.

```
  [ ] Canvas width committed and consistent across the block?
  [ ] Every rule/border exactly canvas-width?
  [ ] Every content row right-padded to the right alignment column?
  [ ] Right edges line up when you scan vertically?
  [ ] No markdown syntax inside (#, **bold**, | col |, - bullet)?
  [ ] No identifier truncated mid-token?
  [ ] Breathing room present (blank row after ┌─┐, before └─┘,
      between semantic groups)?
  [ ] One shape per block (no nested nesting beyond sub-framed grid)?
  [ ] Shape choice matches content type from the vocabulary picker?
  [ ] Sections have heading → block → heading rhythm?
  [ ] Closing synthesis ("My read" or summary) present for long
      responses?
  [ ] Arrows consistent (──► ◄── ▼ only; no → ⇒ -> mixing)?
  [ ] Single borders (╔═╗ used only for rare focal emphasis)?
```

Any "no" → fix before shipping.  The difference between readable
TUI output and unreadable mess is this checklist.
