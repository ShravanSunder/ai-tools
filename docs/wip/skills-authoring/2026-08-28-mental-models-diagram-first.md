# Spec: discuss-clarify-mental-models becomes diagram-first with a plain-language surface

Status: revision r4 — accepted to implement. r1 and r2 spec reviews (four lanes each) returned targeted-revision; r3 folded all findings; dual-lineage delta verification (Claude Fable + OpenAI Sol) confirmed 17/17 resolutions and surfaced one proof-plan runner conflict plus wording residue, folded here as r4. This doc is working memory for one skills-creation update run; after the run lands, `docs/wip/` rules and `docs-maintain` own its disposition.

## Targets and owner plugin

- Target skill: `discuss-clarify-mental-models` (plugin `shravan-dev-workflow`, currently v2.2.0)
- Runs in sequence: one run. This spec is single-slice; the run edits `SKILL.md` (frontmatter description + body), reworks `references/model-shapes.md`, rewrites the assertion surface of the three existing pressure scenarios, adds one new pressure scenario, bumps the plugin version, and adds a changelog entry.
- Explicit non-targets: `discuss-pathfinding` (donor of ideas only; its step-7 borrow is protected by the definitions-home rule below), `shared-references/diagram-rendering-and-fallbacks.md` (consumed as-is), `references/provenance-decomposition.md` (semantics unchanged; its pointer is protected by the definitions-home rule below), `tui-presentation` (adjacent; not edited this run — see decision 12).

## Problem and evidence

The skill's output surface is its own bookkeeping. The current contract instructs the agent to display a ten-field template (`model`, `evidence_checked`, `inherited_frame`, `first_principles`, `assumptions`, `branches`, `countercase`, `rebuilt_model`, `open_or_confirmed`, `next_workflow`) in full at first response, at material change, and at close (`SKILL.md` "Output Contract"). The user must learn skill vocabulary (`inherited_frame`, `countercase`, "provenance decomposition") to read the result. Source: user-reported failure in this session — "It's not meant to be pedantic... we're using common terminology words to explain what's going on and to really draw it out." Classified as user-directed intent, not a reproduced observed failure.

Secondary evidence: drawing is currently an exceptional branch ("Load `references/model-shapes.md` when drawing the chosen shape would help"), and the worked examples in `model-shapes.md` are labeled text lists, not drawings. The skill never shows the two models side by side, even though its whole job is repairing a divergence between two maps.

## Success definition (user-approved 2026-08-28)

> When drift is detected, the agent draws the two pictures side by side in everyday language — matches, splits, and unchecked spots — and resolves each split by showing what would settle it and asking branch-selecting questions; the skill's category and rigor obligations are tracked privately, never displayed as a template or in skill jargon.

## Design

### Mental model / stance change

The lens becomes: *a colleague at a whiteboard*. The agent holds one picture, the user holds another; the skill's job is to draw both pictures next to each other so the splits are visible, then settle each split with evidence or a question. Rigor (provenance categories, countercase, dispositions) is the agent's private discipline, like pathfinding's "keep method labels and bookkeeping private."

### The workflow walks the map (r2, from mental-model-fit)

The Workflow section of `SKILL.md` is reorganized around the map, not re-worded around the old field sequence. The new route: **draw the two pictures** (elements, statuses, origin annotations) → **settle splits in leverage order** via show-then-ask → **close with the final map plus route**. The current five steps' completion checks fold into the private coverage ledger (below) rather than surviving as the walked step sequence. The map is the procedure, not a display bolted onto the old procedure.

### The divergence map

The map is drawn at three firing points — first response, material model change, and close (called **map points** in the skill text; this term replaces the old "full-contract point"). The Drift Signals section survives unchanged, and after a mid-session self-invocation the next response is that invocation's first map point (r3, from rule-agreement observation). Interim turns may update named rows or splits in place without redrawing the whole map (r2, from mental-model-fit minor); an interim in-place update must keep the changed row's applicable required fields visible (status, confirmation state, origin, settling question as applicable), and full inspection re-runs at the next map point (r3, from depth-coverage — interim updates otherwise had no inspection owner).

Default view, side by side:

- one row or region per model element, in the user's own words;
- each element marked as: same picture / we split here / unchecked or blank spot;
- each split annotated in plain words with where each side's belief came from ("we both got this from the old design doc — never verified") and what evidence or answer would settle it;
- **confirmation state on the user's column** (r2, from mental-model-fit): until the user confirms or corrects, the user-picture column is labeled as the agent's current read ("here's what I think you're picturing — correct me"), mirroring the evidence-checked-vs-inferred discipline. Confirmation state is a required semantic field, not a courtesy.

### Private coverage ledger (r2, from rule-agreement + depth-coverage)

Naming rule (r3): the skill text uses exactly two artifact names — the **definitions section** (the retained field definitions) and the **coverage ledger** (the obligation-to-carrier table); this doc now uses only those names.

`SKILL.md` **retains the ten field definitions verbatim in the clearly marked definitions section**; `references/provenance-decomposition.md`'s pointer ("The slot definitions live in `SKILL.md`") and `discuss-pathfinding` step 7's borrow of the four provenance names both resolve to that section. The section states: these are coverage obligations and internal vocabulary, never surface display shapes **on this skill's conversational surface; borrowers own their own surface policy** (r3, from rule-agreement — pathfinding step 7 displays those names to its own user and must not inherit this skill's ban through the borrow).

The provenance teaching reference keeps a live call site in the new body (r3, from rule-agreement — a kept reference with no caller is unreachable): IF the plain-words origin annotations start collapsing into one vague caveat, load `references/provenance-decomposition.md` and return the distinct origins.

Every retained obligation gets an explicit carrier — map annotation, resolution step, or close check:

| private obligation | carrier |
|---|---|
| `model` (shape word, what the map hides, repair target) | the map's layout choice + a plain-words caption naming what the drawing leaves out and what broke |
| `evidence_checked` incl. honest "none — answering from session memory" | origin annotations cite reads; when nothing was read, the map caption says so in plain words ("I haven't checked anything yet — this is from memory") |
| `inherited_frame` / `first_principles` / `assumptions` | plain-words origin annotations per element/split ("we got this from the old doc", "the code shows this", "we're assuming this") |
| `branches` | competing pictures at a split, drawn or named side by side; when only one picture is live, the plain-words reason why ("there's really only one way to read this, because...") (r3, from depth-coverage — single-branch reason was uncarried) |
| `countercase` (map-level) + challenge dispositions | a map-level "what would break my picture" statement at close, plus the per-split discriminating evidence or settling question under discussion (r3: one name — the view field's wording — replaces "fragility line"); each raised challenge tracked privately to one of the four dispositions and reflected as a map repair, a noted gap, an added element, or a plain dismissal |
| re-anchor comparison | the re-anchor map variant (below) with an explicit "on track" / exact-mismatch verdict; aligned verdicts carry their supporting evidence the same way mismatches do (r3, from depth-coverage) |
| `rebuilt_model` incl. canonical-term replacement | the close map plus plain-words notes of any term whose meaning changed, naming both the new meaning and the old one it replaces ("when we say X now, we mean A — not B like before") (r3) |
| `open_or_confirmed` | plain-words verdict at close ("we're agreed" / "still open: ...") — stated before the route sentence, never after (r3, from depth-coverage — ordering was an existing obligation) |
| `next_workflow` + the decision it improves | one plain route sentence at close, after the verdict, naming the next skill and what decision the repaired map improves |
| load-bearing assumption | named in plain words on the close map ("everything above leans on ...") |
| rendering bookkeeping (medium, fallback, semantic-preservation, visual-check results) | private working state only; never displayed. Only the drawn map reaches the conversational surface; a rendering gap surfaces as a plain-words caveat ("I can't draw this cleanly here, so bear with the rough layout") (r3, from mental-model-fit — the rendering return block otherwise leaks as a new template) |

### Interactive resolution (imported from discuss-pathfinding)

For each split, in leverage order: show the current read, the strongest credible alternative, and the discriminating evidence or settling question (the view contract's exact phrase; r4 — one name for this field everywhere) — on or beside the map — then ask one to three related questions that select a branch. Follow the branch the answer opens. Dependent questions wait. This adapts pathfinding's step-4 wording; it does not import pathfinding's extraction contract, records, or stop test.

### Diagram rendering contract

Per the repo's design-view ownership split (AGENTS.md): this skill's `SKILL.md` owns its view predicates and required semantic fields; `shared-references/diagram-rendering-and-fallbacks.md` owns medium selection, fallback, semantic preservation, and visual checks.

Two view variants, both declared in `SKILL.md` (r2, from rule-agreement — the re-anchor case is a declared variant, not an undeclared exception):

```text
view: divergence map (model vs model)
fires: at each map point (first response, material model change, close), when the drift is belief-vs-belief
required semantic fields:
- each model element, named in the user's words
- per-element status: same picture | split | unchecked
- user-column confirmation state: agent's read | user-confirmed
- per-split plain-words origin of each side's belief
- per-split discriminating evidence or settling question (for the split under discussion)
- close map only: the shared close fields (below)

view: re-anchor map (work vs goal)
fires: at each map point when the comparison is in-flight work against the confirmed goal
  (user asks "are we on the rails?", artifact-to-goal displacement detected)
required semantic fields:
- the confirmed goal and governing boundaries, in the user's words
- the in-flight work elements compared against them
- per-element verdict: aligned | exact mismatch | unchecked
- plain-words origin and supporting evidence of each verdict, aligned or mismatched
- close map only: the shared close fields (below), with the verdict stated as
  "on track" or the exact mismatch list

shared close fields (every session's close map carries these regardless of which
variant fired — r3, from mental-model-fit: a pure re-anchor session otherwise loses
countercase and load-bearing coverage):
- map-level "what would break this picture"
- the load-bearing assumption in plain words
- plain-words verdict, then the route sentence (verdict before route)
```

Medium and inspection calls (r2, from depth-coverage blocker — the shared reference is the sole owner of semantic-preservation and visual checks, so it loads on every fired view):

- MUST load `shared-references/diagram-rendering-and-fallbacks.md` for every fired view and return the selected medium, fallback decision, semantic-preservation result, and visual-check result. **That return is private working state** (see the coverage ledger's rendering-bookkeeping row): only the drawn map reaches the conversational surface, and a rendering gap surfaces as a plain-words caveat (r3, from mental-model-fit). In chat the selected medium will normally be readable fenced plain text or `tui-presentation` structure per that reference's own medium rules; this skill does not restate those rules (r2, from rule-agreement minor — no second home for medium selection or the preservation rule).
- Using `tui-presentation` as the rendering medium never substitutes for this skill's semantic obligations; the medium carries the map, it does not own the repair (r2, from trigger-routing observation).

### references/model-shapes.md rework (r2, from depth-coverage — teaching reference, not a layout gallery)

Reworked into a teaching reference that owns *how to draw a good map*, with:

- selection rules: when the two-column model-vs-model layout applies, when the re-anchor work-vs-goal layout applies, and how each named shape (`terms`, `boundary`, `flow`, `state`, `ownership`, `constraint`, `tradeoff`, swarm-work) carries rows, regions, and edges;
- construction guidance: how to choose elements the user will recognize, how to write honest plain-words origin annotations, how to place confirmation state and settling questions;
- good/bad contrasts: at least one decorative-two-column-template counterexample (columns drawn, divergence not actually exposed) and one honest map beside it;
- variant-specific completion checks (r3, from depth-coverage): the divergence map is done when a reader can point to every split, say where each side's belief came from, see what would settle the split under discussion, and see the confirmation state on a first map — without any skill vocabulary; the re-anchor map is done when a reader can point to each aligned or mismatched element, read the exact mismatch, and see the evidence behind both kinds of verdict.

Load predicate (observable): IF the fired view's layout for the chosen shape is not already drawn in this conversation — first map of a session, a shape change, or a re-anchor variant firing for the first time — load `references/model-shapes.md` and return the layout and construction rules for that shape and variant.

### Steering, red flags, completion blockers

- Bright line, one home, with its boundary stated (r2+r3, from rule-agreement): the ten field labels and method terms (`inherited_frame`, `first_principles`, `assumptions`, `countercase`, `provenance`, `rebuilt_model`, and the other field names) are agent-introduced vocabulary that never appears on this skill's conversational surface; the user's words carry the map. The ban governs the conversational surface only. **Exempt**: route-target skill names (`research-swarm`, `spec-design`, ...) in the close route sentence; the plain-words verdict; a banned word the user introduced in this conversation, which may be echoed as an element name (the ban governs agent-introduced vocabulary, not the user's own words); the phrase "divergence map", which is user-facing vocabulary taught by the description; and agent-to-agent packets such as the divergent-reviewer dispatch, which keep their field-name wording. Failure form: wrong output shape.
- New red-flag rows: "I displayed the template, so the model is inspectable" (a template is not a drawing); "prose explains it fine" (a split you can see beats a paragraph); "the jargon is more precise" (precision the user cannot read repairs nothing); "the columns are drawn, so the divergence is shown" (a two-column template that hides the actual split is decoration).
- Completion blockers updated: a model presentation with no drawn map at a map point; skill jargon (including rendering-bookkeeping labels such as `selected medium:` / `visual check:`) on the surface outside the stated exemptions; a split raised without its origin annotation or settling question; a first **divergence map** whose user column carries no confirmation state (scoped to that variant — the re-anchor map has no belief column; r3, from rule-agreement); a coverage-ledger obligation with no carrier at close. Existing blockers re-worded to the private-obligation framing (coverage still required, display not).
- Surviving rigor: provenance decomposition (reference untouched, with its live call site named in the ledger section), challenge dispositions, re-anchor comparison, read-only stance, route targets, and the divergent-reviewer dispatch branch all survive. The reviewer branch keeps its agent-facing wording including field-name references — covered by the bright line's packet exemption — with only its "displayed template" references reworded (r2, from rule-agreement minor: the prior "survives as-is" phrasing is dropped).

### Frontmatter description change (r2, from trigger-routing — strikes r1 decision 1)

The description gains drawing vocabulary so the skill's most visible new behavior is reachable by the words users will learn to ask for it with. After "rebuild a shared map," insert: "draw the two pictures side by side (what you think vs what I think — a divergence map of where our models match or split)," (r3, from trigger-routing minor: the "what you think vs what I think" phrasing is the user vocabulary the clause was built for). The "Not for" clause is unchanged. Verified collision: `tui-presentation`'s trigger block claims "draw it out", "show me", "compare" — without this clause, divergence-map requests route to the presentation skill and skip the repair rigor.

## Decisions table

| # | Decision | Default taken | Rationale |
|---|----------|---------------|-----------|
| 1 | Trigger/description | One clause added: "draw the two pictures side by side (what you think vs what I think — a divergence map of where our models match or split)" after "rebuild a shared map"; rest unchanged | r1 default (unchanged) struck by verified trigger-routing finding: tui-presentation affirmatively claims drawing vocabulary; without the clause, the new signature behavior misroutes. |
| 2 | Ten contract fields | All retained; definitions kept verbatim in the definitions section of SKILL.md; every obligation has a named carrier (coverage ledger above) | User asked for less pedantry, not less rigor. The definitions section is the resolution target for provenance-decomposition.md's pointer and discuss-pathfinding step 7's borrow — both non-targets stay intact. |
| 3 | Map framing | Two declared view variants: model-vs-model (two-column) and re-anchor (work-vs-goal), each with its own predicate and required fields | The skill's job is divergence; two columns make it visible. Re-anchor compares work to goal, where belief columns are artificial — so it gets its own declared contract instead of an undeclared exception. |
| 4 | Surface language | User's words only; ten field labels + method terms banned from the surface; exemptions per the bright line in "Steering" (route-target names, plain-words verdict, user-echoed words, the phrase "divergence map", agent-to-agent packets) | Direct user instruction. The bright line is the single owner of the exemption list; this row cites it (r4 — the r3 row had a stale two-item inventory). |
| 5 | Shared diagram reference load mode | MUST load for every fired view | r1 default (IF-branch) struck by depth-coverage blocker: the shared reference exclusively owns semantic-preservation and visual checks, so the default path must reach it. The reference is short; the per-view cost is accepted. |
| 6 | model-shapes.md | Reworked in place into a teaching reference (selection rules, construction guidance, good/bad contrasts, completion check), observable load predicate | The failure mode is a decorative template; only teaching prevents it. Same file name, same shape vocabulary. |
| 7 | provenance-decomposition.md | Untouched | It teaches the private discipline, which survives; its SKILL.md pointer resolves to the retained definitions section (decision 2). |
| 8 | Interactive import scope | Show-then-ask + 1–3 batched branch-selecting questions only | User selected "interactive" only; layers/records/write-as-crystallizes were offered and not selected. |
| 9 | Proof | New scenario `diagram-first-surface.md`; all four scenarios move to a `cases.ts` semantic-criteria registry (single proof home, scoped to the user-facing response); legacy regex lines removed; run `pnpm --dir tests/skills run test:evals` | r1 underestimated the rewrite; r4 corrected the mechanism: `cases.ts` and legacy regexes are mutually exclusive in the runner, so inversion via `expect_forbidden_regex` would be dead or mis-scoped. Details in the proof plan below. |
| 10 | Release | Bump plugin to 2.3.0; changelog entry under `docs/changelog/` | User-visible behavior change; repo changelog rule. |
| 11 | Workflow organization | The SKILL.md Workflow section walks the map (draw → settle splits in leverage order → close); old step checks fold into the private ledger | mental-model-fit: keeping the field-sequence steps would make the map decoration on the old procedure. |
| 12 | tui-presentation counterpart edit | Not this run | Its "Skip for" list gaining a mental-model-divergence pointer would help routing, but the file is a non-target; the description clause (decision 1) carries the boundary from this side. Revisit if misroutes are observed after release. |

## Per-run surface allocation

Single run:

- **Trigger**: description clause per decision 1.
- **Main path** (`SKILL.md`): stance rewrite; map-walking workflow (decision 11); two view contracts; private-obligation definitions section + coverage ledger; show-then-ask resolution; MUST-load rendering call; scoped jargon ban; updated red flags and completion blockers.
- **Depth** (`references/`): `model-shapes.md` teaching rework; `provenance-decomposition.md` untouched; shared diagram reference consumed, not edited.
- **Proof** (tests): new scenario + assertion inversion of `drift-interrupt.md`, `map-building.md`, `reconverge.md`.

## Authoring basis and proof plan

- Classification: `update`, behavior-changing (alters trigger, main path, steering, completion, reference allocation). Not scoped.
- Authoring basis: `user-directed intent` — drafting from the approved success definition, no RED required. No reproduction attempted; the failure is user-reported style/surface, not a mis-executed run.
- Proof posture: scenario-based behavior proof (r2 expanded per rule-agreement + depth-coverage; r3 corrected for runner reality):
  - New scenario `diagram-first-surface.md` asserts: a drawn side-by-side structure appears before split resolution begins (route order, decision 11); per-element statuses present; at least one origin annotation in plain words; a settling question or discriminating evidence for the split under discussion; user-column confirmation state or an explicit invitation to correct on the first map; a named route target at close, after the verdict. Forbidden surface (r3, exact target per rule-agreement + mental-model-fit): the ten `label:` colon-forms (e.g. `assumptions:`, `inherited_frame:`), the old ten-field template block, and the rendering-return labels (`selected medium:`, `semantic preservation:`, `visual check:`). The phrase "divergence map" is **not** forbidden — it is user-facing vocabulary taught by the description. The scenario includes a prompt where the user says "assumption" so forbidden regexes are tuned to agent-introduced label forms, not the user's own words.
  - Runner reality (r3/r4, from depth-coverage and dual-lineage delta verification — verified against `parse-scenario-fixture.ts`, `legacy-pressure-assertions.ts`, `load-scenario-cases.ts`, `scenario-contract-evaluator.ts`): legacy `expect_proof_regex`/`expect_forbidden_regex` scan the whole JSON result including private execution evidence, and once a `cases.ts` exists in the scenario folder, every scenario there must be registered in it and legacy regex evaluation is switched off entirely. The two mechanisms are mutually exclusive, so **`cases.ts` is the single home for all four scenarios' checks** (r4): forbidden-label criteria scoped to the user-facing decision/response (the ten `label:` colon-forms, the old template block, rendering-return labels), plus the meaning-dependent observables (route order, honest map structure, disposition coverage). Legacy regex lines are removed from the scenario files, not inverted. The registry must define all four scenarios; the first suite run proves they load and the forbidden criteria actually evaluate — including one fixture pair proving the evaluator passes a banned term in private evidence and fails one in the user-facing decision. Anything the harness cannot express is a manual-only proof gap requiring a recorded transcript-inspection receipt before any GREEN claim. Multi-turn material-change/close behavior is recorded as a named proof gap unless the harness is extended.
  - The three existing scenarios keep their scenario intent (drift interrupt, map building, reconverge) but their label assertions become `cases.ts` criteria per the runner-reality bullet: each scenario names the plain-words observable that replaces each old label assertion (e.g. `inherited_frame:` → an origin-annotation pattern; `next_workflow:` → a route-sentence pattern naming a real skill), and the ten labels become forbidden criteria on the user-facing surface. Drift-interrupt's four existing plain-words checks carry over in criteria form. `drift-interrupt.md`'s retest exercises the re-anchor map variant specifically and asserts no confirmation-state artifact appears on the work-vs-goal map.
  - Coverage cases the new+updated scenarios must include: no-evidence honesty ("from memory" caption), a raised challenge needing a disposition, a single-live-branch reason, a renamed canonical term with its old meaning, an aligned re-anchor verdict with evidence, and a close that must state the verdict before routing.
  - Routing probes (r3, from trigger-routing — the description change ships with evidence, not hope): (a) true prompt — "draw what you think vs what I think side by side so we can see where we differ" must select `discuss-clarify-mental-models` over `tui-presentation`; (b) near miss — "draw the auth flow out for me as a diagram" (no drift, no second model) must select `tui-presentation` only. Run against the shipped descriptions after the edit lands.
  - Static proof: `claude plugin validate .` after version bump.

## Coordination

- Base: worktree `/Users/shravan.sunder/.cursor/worktrees/ai-tools/z6zg`, branch `cursor/871068d7`, commit `0621f148` ("Default Stop-review Luna to low reasoning and Fast tier.").
- Pending edits in worktree: one pre-existing uncommitted `AGENTS.md` modification (removes the `relay-ai-tools` variant line) — not part of this change; do not fold it into this run's commits without user direction.
- Version/changelog landing: plugin.json 2.2.0 → 2.3.0 and `docs/changelog/` entry land in the same changeset as the skill edits.
- Sync note: `discuss-clarify-mental-models` exists only in the personal `ai-tools` variant surface; no relay-ai-tools sync obligation for plugin files.

## Non-goals

- No change to `discuss-pathfinding` (ideas borrowed, contract untouched; its step-7 borrow resolves to the retained definitions section).
- No change to `shared-references/diagram-rendering-and-fallbacks.md`, `references/provenance-decomposition.md`, `tui-presentation`, or any other skill's view contracts.
- No change to the skill's read-only stance, route targets, or its boundary with `discuss-pathfinding` (extraction vs. repair).
- No new lane, subagent, or shared shape; the existing divergent-reviewer branch survives with only its displayed-template references reworded.
- No artifact-writing capability; records stay chat-only per the skill's existing rules.

## Spec-review record

r1 (initial draft):

- lanes: mental-model-fit, trigger-routing, rule-agreement, depth-coverage (one-shot Delegates, fresh context, read-only; depth-coverage ran on a different model lineage — OpenAI Sol)
- receipts: 4/4 complete (mental-model-fit re-emitted in contract shape on request)
- verdict: targeted-revision (all four lanes)
- parent verification: all load-bearing claims checked against sources (provenance-decomposition.md pointer, pressure-scenario regexes, tui-presentation trigger block, pathfinding step 7); no findings rejected
- disposition: every accepted finding folded into r2; r1 decisions 1 and 5 struck and replaced

r2:

- lanes: mental-model-fit, trigger-routing, rule-agreement, depth-coverage (fresh one-shot Delegates, read-only; depth-coverage on OpenAI Sol lineage)
- receipts: 4/4 complete (mental-model-fit re-emitted in contract shape on request)
- verdict: targeted-revision (all four lanes) — all findings bounded scoping/wording fixes; structural design held
- parent verification: rendering return shape, re-anchor close fields, tui trigger block, provenance pointer, and scenario regexes checked against sources directly; runner-internals findings accepted on cited file/line evidence; no findings rejected
- disposition: every accepted finding folded into r3 (17 fold-ins; see r3-tagged passages)

r3 → r4 (delta verification and acceptance):

- lanes: dual-lineage delta verification — one Claude Fable verifier, one OpenAI Sol verifier, fresh context, read-only — instead of a third full four-lane round (process deviation, recorded on the run note; the r3 delta was scoping/wording resolution of twice-reviewed semantics)
- receipts: 2/2 complete
- verdict: targeted-revision — 17/17 r2 resolutions confirmed; one new conflict (cases.ts vs legacy expect_forbidden_regex are mutually exclusive in the runner) plus exemption-inventory, naming, and per-split-wording residue
- disposition: all folded as r4 (cases.ts becomes the single proof home; decision 4 cites the bright line; one name per artifact; view-field wording unified)
- accepted revision label: r4 (2026-08-30)
- semantic coverage: full doc — trigger clause, map-walking workflow, two view contracts + shared close fields, definitions section + coverage ledger, surface-language bright line, model-shapes teaching rework, cases.ts proof surface, release route
- acceptance: accepted-to-implement (user directed implementation 2026-08-30; the delta-verification deviation stands accepted by that instruction)
