# Presentation Skills Restructure — Multi-Run Skill-Change Spec

Status: revision r4 — accepted-to-implement. r1 reviewed (4 lanes, targeted-revision) → r2 fixes; r3 user decisions (names, TUI unknown-default, simplified D18, D12 shared); r3 delta re-reviewed (4 lanes, all complete) → r4 incorporates the 7 accepted delta findings verbatim from reviewer proposals.
Date: 2026-08-30 (r3: 2026-09-02; r4 accepted: 2026-09-03).

## Targets and owner plugin

Owner plugin: `shravan-dev-workflow`.

Both runs are slices of **one atomic changeset** (r4, from rule-agreement): Run 1 is non-landable on its own — the branch merges only after Run 2 completes, so the first landable tree has two active-skill consumers for every shared reference and carries the single version bump and changelog entry. Runs in sequence; each run names exactly one skill target:

1. **Run 1 — `presentation-tui`** (rename + rewrite of `tui-presentation`). Creates the shared references it consumes (`markdown-presentation-baseline.md`, `diagram-semantics.md`, `mermaid-usage.md`), executes the surface-aware cutover of every active `tui-presentation` consumer, and rewrites its pressure scenarios.
2. **Run 2 — `presentation-webui`** (create). Consumes the shared references, adds its pressure scenarios (the medium label set is final after Run 1 per D19 r4 — no webui label), and lands version bump + changelog for the whole restructure.

## Problem and evidence

- As of Aug 2026, Codex CLI, Claude Code CLI, and Cursor CLI all render a common Markdown set: ATX headings, bold, italic, inline code, fenced code, `-` bullets, ordered lists, nested lists, blockquotes, links, `---` rules, and GFM tables. Source: user-supplied renderer analysis (2026-08-30 conversation); the user directs us to treat this set as universally supported with no per-CLI exceptions.
- The current `tui-presentation` skill assumes markdown is unreliable for document structure (its description says so verbatim) and restricts markdown to "code, file links, URLs, and tokens" (SKILL.md core rule 8). Pressure scenarios enforce the old world: `monospace-structure.md` treats markdown headings and pipe tables as failure signals.
- Technical content (JSON, commands, config, identifiers) rendered as undifferentiated plain text inside frames is harder to scan and copy than inline code / fenced blocks. Source: user observation of current outputs. The skill's own examples show the failure: `shape-catalog.md`'s review-findings application renders proposed-fix Swift code as unfenced indented plain text, violating `build-discipline.md`'s own fencing rule — worked examples teach the plain-text habit even where the rule says otherwise. Run 1 fixes the examples along with the rules.
- The skill under-fires: its trigger is TUI-workaround-shaped, so presentation judgment is not applied in the places it would help. Source: user statement ("I really want to make sure the skill is used… the entry point is more generic").
- The upstream `humanlayer/skills` `show-me` skill demonstrates a compact, judgment-led, media-menu presentation skill ("pick the smallest view that makes the key point clear"). Source inspiration only; no prose copied (repo rule).

## Success definition

When an agent produces a substantial explanatory response, it loads the entry skill matching its rendering surface (identified per D17) and produces output where: document structure uses the supported Markdown set; technical content is always inline code or fenced blocks, never plain text (subject to the D6 fixed-width-row resolution); comparisons default to GFM tables; and TUI box-drawing serves the relationships it is genuinely better at.

Skeleton precedence (r2, from spec review): on monospace surfaces the TUI box-drawing/glyph skeleton is the default layout (D5); the "only where it beats markdown" test governs individual constructs inside and around that skeleton, and governs the skeleton itself only on rendered chat surfaces, where markdown is the skeleton and box-drawing appears only inside fences when it wins the fit test.

Pressure tests pass with the new polarity.

## Decisions table

Defaults taken with rationale; strike any row to change it.

| # | Decision | Choice | Basis / rationale |
|---|---|---|---|
| D1 | Supported markdown set | Headings, bold, italic, inline code, fenced code, bullets, ordered/nested lists, blockquotes, links, `---` rules, GFM tables; keep tables reasonably narrow; no per-CLI exceptions | User-confirmed |
| D2 | Architecture | Thin entry skills + shared references (pattern of `shared-references/`) | User-confirmed ("move what's generic out") |
| D3 | Entry skills | Two now: `presentation-tui`, `presentation-webui` | User-confirmed |
| D4 | Split predicate | Rendering surface: monospace terminal → `presentation-tui`; proportional/rendered chat → `presentation-webui` | User-confirmed; observability of the predicate is owned by D17 |
| D5 | TUI layout stance | Hybrid: on monospace surfaces the TUI skeleton is the **default** layout; markdown constructs mix inside and around it. The "beats markdown" fit test applies per construct, not to the skeleton (see Success definition precedence) | User-confirmed; precedence added in r2 (mental-model-fit finding) |
| D6 | Technical content | JSON, JSON Schema, code, config, commands, structured data, identifiers always render as inline code or fenced blocks — bright line, both entry skills. **Fixed-width-row resolution (r2):** technical content that cannot safely render as semantic markdown inside a fixed-width framed/table row (hidden-markup drift) moves **outside** that row into inline code or a fence — the row carries a short plain label pointing at it; plain-text identifier wrapping inside rows is no longer taught | User-confirmed; conflict resolution added in r2 (rule-agreement blocker) |
| D7 | Tables | GFM tables are the default comparison medium; box-drawn tables only when annotation/alignment needs exceed GFM. `markdown-presentation-baseline.md` owns the default and the fallback threshold; the `presentation-tui` shape picker and fast picks are re-labeled to cite it (comparison rows → GFM default, column-ruled/box = annotated fallback) | User-confirmed; picker re-polarization added in r2 (mental-model-fit + rule-agreement) |
| D8 | Trigger reposition | Entry descriptions drop the "markdown is unreliable" premise; skills exist for presentation judgment and visual structure. Both descriptions **retain the shipped Skip list**: user-requested exact formats, schema-bound output, code-only replies, terse answers | User-confirmed; Skip retention added in r2 (trigger-routing) |
| D9 | Files/HTML entry point | Deferred; shared references designed so a `presentation-files`/show-me-style entry plugs in later | User-confirmed |
| D10 | Names | `presentation-tui`, `presentation-webui` | User-confirmed (r3: user chose these names explicitly, superseding the earlier present-* candidates) |
| D11 | `diagram-rendering-and-fallbacks.md` | Stays a separate shared contract; updated for the markdown baseline and the new medium labels; not absorbed | Default — design-skill consumers' contract should not churn |
| D12 | Mermaid stance | Understanding-first, anti-catalog. **Single shared owner: `mermaid-usage.md`** — created in Run 1; named active consumers: `presentation-tui` (cites it to emit fenced Mermaid source only when the user will render it elsewhere), `presentation-webui` (Run 2, primary consumer), and `diagram-rendering-and-fallbacks.md`. `diagram-semantics.md` stays renderer-neutral (families only); entry skills cite `mermaid-usage.md` instead of restating the stance | User-confirmed r3 ("common"); single-owner allocation from rule-agreement |
| D13 | Rename mechanics | Hard cutover, no forwarding stubs; historical docs keep original paths. **Consumer call sites are not 1:1 renamed** — see D18 | Repo rule; refined in r2 (trigger-routing blocker) |
| D14 | Research-lane rendering rule | "Presentation renders lanes, does not run agents or decide acceptance" carries into `presentation-tui` unchanged | Default — existing scenario still applies |
| D15 | Reviewer staffing | Spec-review lanes staffed with `claude-fable-5-thinking-medium`, `gpt-5.6-sol-high`, `cursor-grok-4.6-high` | User-confirmed (closest available to requested variants) |
| D16 | Codex agent config | `agents/openai.yaml` moves with the renamed skill **and is rewritten** (r4): `display_name`, `short_description`, and `default_prompt` reference `$presentation-tui`; nothing invokes the dead `$tui-presentation` name. Run 2 adds a sibling for `presentation-webui` and static-asserts no active agent config invokes `$tui-presentation` | Codex parity; rewrite obligation added r4 (rule-agreement blocker) |
| D17 | Surface identification (r2, revised r3) | Primary invocation is the **user naming the skill**. When the agent self-routes, it identifies the surface from **host identity**, not the user prompt and not renderer probing: CLI/terminal hosts (Codex CLI, Claude Code CLI, Cursor CLI, raw monospace streams) → `presentation-tui`; IDE/web chat hosts (Cursor IDE chat, Claude.ai, ChatGPT, any session rendering markdown as a formatted document) → `presentation-webui`; **host identity that cannot be determined → `presentation-tui`** (user decision r3). Rationale (r4): rendered chat hosts self-identify in session context (Cursor IDE chat, Claude.ai, ChatGPT announce themselves); a host the agent cannot identify is itself evidence of a raw monospace stream, so "unknown" is not symmetric between the two surfaces. Host cues appear in both descriptions | trigger-routing blocker; unknown-default and user-invocation emphasis user-confirmed r3; rationale added r4 (mental-model-fit) |
| D18 | Consumer routing (r2, simplified r3) | Active call sites that name `tui-presentation` — these are only the **in-chat rendering** call sites in `discuss-pathfinding`, `spec-design`, `program-design`, plus `diagram-rendering-and-fallbacks.md` — are rewritten to: "use the `presentation-*` skill matching the current surface; honor an exact user-requested format instead." The agent picks between the two via D17. No consumer frontmatter/trigger changes | trigger-routing blocker; simplified wording user-confirmed r3 |
| D19 | Medium label set (r2, revised r4) | `diagram-rendering-and-fallbacks.md`'s Return Shape is the single label-set owner; the contract test is its exact mirror. Final set, landed once in Run 1: `mermaid \| markdown-table \| presentation-tui \| fenced-plain-text`. Denotations: each label names an output **medium**, not a skill — `presentation-tui` denotes a box-drawn/glyph TUI layout block (built with `presentation-tui` craft). **No `presentation-webui` medium label exists**: webui output is composed of the other media (`mermaid`, `markdown-table`, fences), so a webui view is labeled by its actual medium. Surface routing is D17/D18's job, not the label set's | r4 — resolves mental-model-fit level-conflation finding; also dissolves the r2 two-run staging problem |

## Draft trigger descriptions (r2, from trigger-routing)

Both skills are model-invocable and user-invocable. Same content-type phrase in both; discrimination is by host/surface plus sibling and authoring boundaries; shipped Skip list retained.

`presentation-tui`:

> Use when composing a substantial architecture, comparison, tradeoff, flow, mockup, state-machine, or multi-section response on a monospace terminal or CLI host (Codex CLI, Claude Code CLI, Cursor CLI, or any session whose output is a raw monospace stream), or when host identity cannot be determined. Especially "draw this out", "show me", "compare these", "explain the architecture". Not for rendered proportional-font chat (presentation-webui); not for authoring durable Requirements, Specification, or Program Design (spec-design, program-design). Skip for user-requested exact formats, schema-bound output, code-only replies, or terse answers.

`presentation-webui`:

> Use when composing a substantial architecture, comparison, tradeoff, flow, mockup, state-machine, or multi-section response on a rendered proportional-font chat host (Cursor IDE chat, Claude.ai, ChatGPT, or any session whose markdown renders as a formatted document). Especially "draw this out", "show me", "compare these", "explain the architecture". Not for monospace terminal or CLI (presentation-tui); not for authoring durable Requirements, Specification, or Program Design (spec-design, program-design). Skip for user-requested exact formats, schema-bound output, code-only replies, or terse answers.

## Planned end-state file tree

```text
plugins/shravan-dev-workflow/
├── shared-references/
│   ├── markdown-presentation-baseline.md      (new, Run 1; consumers: presentation-tui, presentation-webui, diagram-rendering-and-fallbacks)
│   ├── diagram-semantics.md                   (new, Run 1; consumers: presentation-tui, presentation-webui; renderer-neutral)
│   ├── mermaid-usage.md                       (new, Run 1; consumers: presentation-tui, presentation-webui, diagram-rendering-and-fallbacks)
│   └── diagram-rendering-and-fallbacks.md     (updated per D18/D19)
└── skills/
    ├── presentation-tui/                           (renamed from tui-presentation; hybrid style per D5)
    │   ├── SKILL.md
    │   ├── agents/openai.yaml
    │   └── references/                        (TUI craft only; generic content moved to shared)
    └── presentation-webui/                          (new, Run 2; markdown-first per D17/D5 precedence)
        ├── SKILL.md
        └── agents/openai.yaml
```

## Shared-reference teaching contracts (r2, from depth-coverage)

Shape-only references are ceremony; each shared reference below is a **teaching owner** and must carry what to inspect, what good and bad look like, and when to stop.

- **`markdown-presentation-baseline.md`** owns the supported markdown set, the D6 bright line with its fixed-width-row resolution, and the D7 table default + fallback threshold. It must **teach**, not list: which relationships each construct fits (when a heading vs a bold lead-in vs a list vs a blockquote vs a table); candidate-content inspection for the D6 bright line; inline-vs-fence criteria; good/bad examples (preserving `build-discipline.md`'s current good/bad inline-code atoms and hidden-markup caveat as the seed); and a "fix before sending" stop check. Deleting it must cost the agent a procedure, not a vocabulary list.
- **`diagram-semantics.md`** merges `progressive-disclosure.md` and `visual-family-selection.md` and must preserve, per family (flow, sequence, state, quadrant/2D, topology): the inspection question, one worked example, the wrong-family red flags, the one-primary-family rule, and the stop/simplify condition — plus the full disclosure sequence (map → slice → ledger → detail), its variants, and its red flags. A five-label picker is a failed transfer.
- **`mermaid-usage.md`** owns the Mermaid stance (D12) and must teach the decision without a syntax catalog: whether the relationship is load-bearing, renderer availability, semantic-preservation and readability checks, decorative-Mermaid bad signals, fallback, and completion.

## Per-run surface allocation

### Run 1 — `presentation-tui`

- **Trigger:** `name: presentation-tui`; description per the r2 draft above. Model- and user-invocable.
- **Main path:** keep the shape-picker mental model with the picker's comparison and fast-pick rows re-labeled per D7 (GFM default; column-ruled/box = annotated fallback, citing the baseline); state the D5 skeleton-default precedence inline; D6 bright line with the fixed-width-row resolution, citing the baseline as owner; drop core rule 8's markdown restriction; keep the research-lane rendering rule (D14); cite `mermaid-usage.md` for the Mermaid stance instead of restating core rule 5; keep the before-send output discipline.
- **Depth:** create the three shared references per their teaching contracts; re-home the reference tree per the disposition table below; update `diagram-rendering-and-fallbacks.md` per D18/D19 Run-1 state.
- **Cutover (same changeset, surface-conditional wording per D18):** `discuss-pathfinding/SKILL.md` (step 4 + Routes), `spec-design/SKILL.md`, `program-design/SKILL.md`, `shared-references/diagram-rendering-and-fallbacks.md`, `AGENTS.md` skill table, `plugins/README.md`, `plugins/shravan-dev-workflow/README.md`, `tests/skills/lib/spec-program-design-user-requirements-contract.test.ts` (mirror of the D19 Run-1 label set), `tests/skills/pressure-scenarios/README.md`, `tests/skills/pressure-scenarios/shravan-dev-workflow/skills-creation/evaluate-on-disk-route.md`. Historical changelog/wip/spec docs keep original text.
- **Old-polarity disposition (complete home list, r2):** SKILL.md description + core rule 8; `build-discipline.md` step-7 verify "No markdown-as-layout inside" (~line 83), semantic-boundary "TUI owns structure; semantic markdown owns technical atoms" (~lines 236-240 — rewritten to the D5/D6 stance), fixed-width-row caveat (~261-265 — rewritten per D6 resolution), plain-identifier wrap recipe (~340-367 — rewritten per D6 resolution), verification checklist markdown items (~370-395 — the rewritten before-send checklist must explicitly check deliberate D5 markdown mixing, D6 inline/fenced treatment, and relocation of unsafe technical content outside fixed-width rows with a short pointer, fixing any failure before sending — r4, depth-coverage); `tables.md:4` headline (deleted); `shape-catalog.md` anti-pattern wording (pipe-table-inside-a-frame stays wrong; standalone GFM tables are not); `complete-response-walkthrough.md` golden example (rewritten hybrid); the six pressure scenarios. No unqualified "No markdown-as-layout" or "TUI owns structure" survives in the active tree.
- **Proof:** rewrite `tests/skills/pressure-scenarios/shravan-dev-workflow/presentation-tui/` (renamed folder): flip `monospace-structure.md` polarity and encode the D5 precedence; strengthen `semantic-markdown-boundary.md` with a long-identifier-under-frame-pressure case rejecting both raw identifier text and hidden-markup border drift; update `progressive-disclosure.md`, `visual-family-selection.md`, `no-mermaid-catalog.md`, `research-lane-board.md` — fixtures renamed and expectations updated; note (claim-vs-evidence, 2026-09-03): legacy evaluation asserts response text only, not which shared reference was loaded, so shared-owner load is not behavior-asserted by these scenarios. Add an annotated-table case proving the box-table fallback still fires. Run `pnpm --dir tests/skills run test:evals` and the pinned contract test.

### Run 2 — `presentation-webui`

- **Trigger:** `name: presentation-webui`; description per the r2 draft above. Model- and user-invocable.
- **Main path:** markdown-first skeleton per D5 precedence (markdown is the skeleton on rendered chat); an inline **media-selection rubric** (r2): for each medium — pseudocode, call tree, file tree, diff, GFM table, Mermaid, fenced box layout — the inspection target it fits, one good/bad signal, and the stop-at-the-smallest-sufficient-view condition; D6 bright line citing the baseline; Mermaid via `mermaid-usage.md`; disclosure via `diagram-semantics.md`; an inline **before-send completion check** (r2) covering hierarchy, technical fencing, medium fitness, disclosure size, and rendered readability, requiring simplification or correction on any failure.
- **Depth:** shared references only (created in Run 1); chat-local references only if a call site demands depth during authoring.
- **Label set:** none — per D19 (r4) the label set is final after Run 1; no `presentation-webui` medium label exists.
- **Proof (r5, corrected to harness capability):** new `tests/skills/pressure-scenarios/shravan-dev-workflow/presentation-webui/` scenarios: (a) markdown-first structure with technical-content fencing under a "just write it plain" temptation; (b) `rendered-surface-layout` — the same "draw it out" ask on a stated rendered host must keep markdown as the skeleton (named proof gap: real surface routing / exactly-one-skill loading is not assertable — the legacy harness force-invokes the named skill and subjects physically run in a CLI); (c) smallest-view pressure where a non-Mermaid medium is the correct smallest view; (d) exact-format precedence — the invoked skill defers to a user-requested exact format (named proof gap: no-load near-misses are not assertable for the same harness reason). Run evals.
- **Ship (whole restructure):** bump `shravan-dev-workflow` plugin version once; `docs/changelog/2026-08-30-*.md` entry (≤20 lines, public-safe) + README index; `claude plugin validate .`; `codex plugin list --marketplace ai-tools --available --json`; AGENTS.md skill-table rows for both skills.

## Existing reference disposition (Run 1)

| Current reference | Disposition |
|---|---|
| `progressive-disclosure.md` | → shared `diagram-semantics.md` per its teaching contract; lane rule also stays visible in `presentation-tui` (D14) |
| `visual-family-selection.md` | → shared `diagram-semantics.md` per its teaching contract; Mermaid stance lines seed `mermaid-usage.md` |
| `shape-catalog.md` | Stays; anti-pattern rewording per old-polarity disposition; unfenced Swift example fenced; comparison examples show GFM default with box fallback |
| `build-discipline.md` | Stays (TUI mechanics); all five old-polarity homes rewritten per the disposition list; semantic-boundary section becomes seed text for the baseline and then cites it |
| `tables.md` | Headline deleted; GFM guidance → baseline; ledger/lane-board and box-table craft stay as the annotated fallback |
| `architecture.md` | Stays; chat equivalents live in `presentation-webui` via shared references, not duplicated |
| `sequence-and-state.md` | Same as `architecture.md` |
| `ui-layouts.md` | Stays unchanged in substance |
| `annotations-and-specs.md` | Stays (monospace-geometry-bound) |
| `complete-response-walkthrough.md` | Rewritten hybrid golden example: TUI skeleton + markdown emphasis/inline code/fences + one GFM table |

## Authoring basis and proof plan

- Authoring basis: **user-directed intent** (both runs) — drafted from the approved success definition; no RED reproduction required. Old-behavior pressure scenarios double as characterization of the previous polarity.
- Proof posture per run: flipped/new pressure scenarios via `pnpm --dir tests/skills run test:evals`, the pinned contract test after each run, plus platform static validation. Behavior proof = eval results, not static file inspection.

## Coordination

- Base: worktree `ai-tools.presentation-skills-restructure`, branch `feat/presentation-skills-restructure` off `master` @ `3f3dfb6`.
- Pending edits: none elsewhere touching these files.
- Version + changelog land once, in Run 2.
- Marketplace manifests unchanged (plugin name is the cache key); installed-cache refresh is a post-release step.

### Run 2 record (2026-09-04, complete)

- Implementation: `presentation-webui` skill + `agents/openai.yaml` created per the accepted r4 trigger and allocation; four pressure scenarios; ship surface landed (2.5.0 both manifests + marketplace entry, AGENTS/README rows, changelog + evidence reference); D16 static assert passes.
- Implementation review: 6 dispatches covering all 8 lanes (trigger-routing and mental-model-fit clean; rule-agreement, placement-and-calls, combined steering/no-op/depth, claim-vs-evidence findings accepted) → remediation pass 1 → focused refresh (combined 4-lane + rule-agreement; trigger and placement not re-dispatched: frontmatter untouched, placement fixes applied verbatim and parent-verified — recorded narrowing) → remediation pass 2 (spec-honesty + tui label-wrap fix + Mermaid availability bright line) → pass 3 (delta-shaped-question rule in mermaid-usage.md).
- Behavior proof: 4/4 scenarios GREEN with fresh ACPX Codex subjects. Two genuine skill failures were caught and fixed by the smallest-view campaign (Mermaid chosen on availability, then on inflated topology rationale); the final subjects rejected Mermaid citing the taught delta-shaped rule. Claim boundary as in Run 1 (single-run GREEN = characterization at keyword-grader strength); named proof gaps: surface routing and no-load near-misses not assertable in this harness.
- Ship status: atomic changeset complete; source-only in the worktree pending commit/PR authorization.

### Run 1 record (2026-09-04, complete)

- Implementation: rename + rewrite landed per spec; three shared references created; D18 cutover done; statics green (106 unit tests incl. pinned contract test; `claude plugin validate` pass; zero stale names on active surfaces).
- Implementation review: 8 lanes round 1 (union rule) → remediation pass 1 → 8-lane refresh → remediation pass 2 → focused 3-lane final refresh (narrowed from 8; recorded deviation: untouched lanes' surfaces received only their own verbatim-accepted fixes) → remediation pass 3 (wrap-recipe fix; example atom surgery; rejected citations recorded: mockup depictions, UI labels, short edge names per the diagram-labels clause). Remediation limit reached; no further passes without user permission.
- Behavior proof: all 7 pressure scenarios GREEN with fresh ACPX Codex subjects. Claim boundary (recorded verbatim from claim-vs-evidence): single-run GREEN is characterization at keyword-grader strength, not repeated regression evidence; five initial REDs were grader-vocabulary repairs on compliant subjects; two scenario premises were corrected (research-lane disclosure demand exceeded the skill's rule; table-medium's callout was GFM-carryable until re-premised on a sub-row annotation — both re-premised runs then proved the intended behavior); shared-reference loading is not behavior-asserted by legacy evaluation.
- Reviewer runtime deviations: Fable and Grok 4.6 outside the `manage-agents` Delegate table (user-directed); `cursor-grok-4.6-high` became unavailable mid-run, downgraded to medium for implementation-review lanes.

## Non-goals

- No files/HTML/canvas entry skill in this change (D9).
- No change to research/lane ownership semantics, review contracts, or design-skill view predicates beyond the D18 routing wording.
- No per-CLI markdown capability matrix or renderer feature detection (D17 uses host identity, not probing).
- No absorption of `diagram-rendering-and-fallbacks.md` (D11).
- No router skill.
- No copying of upstream `show-me` prose (inspiration only).

## Spec-review record

- Reviewed revision: r1 (2026-08-30). This r2 incorporates every accepted finding; smallest fixes were taken verbatim from lane proposals where given.
- Lanes and receipts: `mental-model-fit` (claude-fable-5-thinking-medium) complete; `trigger-routing` (cursor-grok-4.6-high) complete; `rule-agreement` (gpt-5.6-sol-high) complete; `depth-coverage` (gpt-5.6-sol-high) complete. Reviewer-runtime deviations recorded: Fable and Grok 4.6 are user-directed models outside the `manage-agents` Delegate table.
- Verdict on r1: `targeted-revision`. Blocker overrides triggered: trigger not an observable loading condition (fixed by D17), sibling collision without boundaries (fixed by draft descriptions), consumer misrouting under 1:1 rename (fixed by D18), D6 vs fixed-width-row contradiction (fixed by D6 resolution), GFM default vs retained picker (fixed by D7 re-polarization).
- Accepted findings: all 13 verified findings across four lanes (2 mental-model-fit important; 3 trigger-routing blockers + 1 important; 2 rule-agreement blockers + 3 important; 6 depth-coverage important). Rejected: none. One mental-model-fit observation merged into the trigger-routing surface-identification blocker.
- Semantic coverage: full spec.
- r3 user decisions (2026-09-02): names `presentation-tui`/`presentation-webui`; unknown-surface default flipped to `presentation-tui`; D18 wording simplified to "use the presentation-* skill matching the current surface"; D12 shared ownership confirmed; remaining defaults delegated to the parent session.
- Delta re-review of r3 (2026-09-02/03): `mental-model-fit` (fable-5-thinking-medium) complete — 2 important accepted (D17 rationale, D19 label denotation), 2 observations; `trigger-routing` (grok-4.6-high) complete — 1 important accepted ("host identity cannot be determined" wording), D18 and names confirmed clean; `rule-agreement` (sol-high) complete — 2 blockers accepted (webui Mermaid trigger clause, openai.yaml rewrite), 2 important accepted (jointly resolved by the atomic-changeset rule); `depth-coverage` (sol-high) complete — six r1 gaps confirmed closed, 1 important accepted (hybrid before-send checklist), D17 needs no body owner.
- Acceptance (r4, 2026-09-03): **accepted-to-implement**. All r4 edits are the reviewers' own proposed smallest fixes with no new design decisions; parent verified each against the files before applying. Reviewer-runtime deviations recorded: Fable and Grok 4.6 outside the Delegate table (user-directed).
