# TUI Progressive Disclosure Plan

Status: draft
Created: 2026-06-12
Owner skill: `shravan-dev-workflow:tui-presentation`
Review status: revised after `plan-review-swarm`
Next recommended skill: `shravan-dev-workflow:implementation-execute-plan`

## Goal

Teach `tui-presentation` to draw explanations in a way that helps the user
understand difficult systems through progressive disclosure, not through a
large Mermaid catalog or a larger `SKILL.md`.

The implementation should preserve the current semantic markdown boundary:
TUI owns document structure and spatial layout; markdown still owns fenced code
blocks, inline code spans, clickable file links, URLs, identifiers, and
copyable/runnable snippets.

## Source Coverage

Read or inspected before this plan:

- User design thread: requests around TUI semantic markdown, keyword/code/link
  treatment, version/marketplace updates, and progressive-disclosure examples
  from prior sessions.
- `shravan-dev-workflow:plan-create` skill: loaded as the planning workflow.
- `superpowers:writing-skills` skill: loaded because this plan changes skill
  behavior and requires pressure-scenario-first validation.
- `plugins/shravan-dev-workflow/skills/tui-presentation/SKILL.md`: current
  lean router, 111 lines.
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/`: current
  line counts show `shape-catalog.md` at 998 lines and the other references
  around 105-435 lines.
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/architecture.md`
  and `sequence-and-state.md`: current examples cover basic topology,
  sequence, and state patterns, but do not yet teach the richer disclosure
  ladder or research-lane visual pattern.
- `tests/skills/run-skill-pressure-tests.sh` and
  `tests/skills/pressure-scenarios/README.md`: pressure harness supports
  focused scenarios and currently has only one TUI scenario.
- Plugin release surfaces:
  `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`,
  `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`,
  `.agents/plugins/marketplace.json`, `.claude-plugin/marketplace.json`.
- Changelog rules in `docs/changelog/README.md`.

Current source version observation, refreshed during plan review:

- Codex plugin manifest: `1.6.16`
- Claude plugin manifest: `1.6.16`
- Claude marketplace entry: `1.6.16`
- Codex marketplace entry: source path only, no version field

Current worktree observation, refreshed during plan review:

- Only this plan file is currently untracked in the main worktree.
- Execution must still derive dirty overlaps from live `git status --short
  --untracked-files=all`, not from this observation.

## Requirements And Proof Matrix

| ID | Requirement | Implementation owner | Proof gate |
|----|-------------|----------------------|------------|
| R1 | `SKILL.md` stays a small router, not a catalog. | TUI skill entrypoint | `wc -l`; target <= 150 lines after edits. |
| R2 | Semantic markdown remains explicit: fenced code, inline code, file links, URLs, tokens, and runnable snippets stay markdown. | `SKILL.md`, `build-discipline.md`, pressure scenario | Static grep plus pressure scenario for code/link preservation. |
| R3 | Add disclosure-sequence guidance: one map, one selected slice, one small ledger, then detail. | New progressive-disclosure reference | Focused pressure scenario has non-leaking `expect_proof_regex` and fails RED / passes GREEN. |
| R4 | Add visual-family selection guidance for flow, sequence, state, quadrant/2D, and topology. Zoom is a disclosure move, not a visual family. | New visual-family selector plus existing architecture/sequence refs | Static grep for sections; pressure scenario separates family choice from disclosure sequence. |
| R5 | Avoid a Mermaid transition/catalog framing. Mermaid may be mentioned as an editor-supported rendering option, but the skill teaches how to draw understanding in chat first. | `SKILL.md`, pressure scenario | `rg -n "Mermaid translations|mermaid catalog"` has no active positive guidance; no-catalog scenario passes. |
| R6 | Keep workflow ownership clear: `spec-design-swarm` and `research-swarm` own research orchestration, `discuss-with-me` owns forcing questions, and `tui-presentation` owns visible structure. | `SKILL.md`, progressive ref, trigger eval docs | Research-lane-board pressure scenario renders handed-over lanes without claiming TUI runs agents or decides acceptance. |
| R7 | Reduce practical context weight by adding focused routing references without broad `shape-catalog.md` compaction in this slice. | New references, `SKILL.md`, existing refs | New refs stay capped; `shape-catalog.md` gets at most local link/duplicate cleanup or is deferred. |
| R8 | Update release metadata and public docs for the new plugin behavior. | Plugin manifests, marketplace, README, changelog | JSON validation, plugin CLI checks, changelog entry, installed-cache refresh proof, and manifest parity check. |

## Non-Goals

- Do not create a standalone Mermaid skill.
- Do not add every Mermaid diagram type.
- Do not rewrite the seven-shape vocabulary unless a pressure test proves a
  real failure in the current vocabulary.
- Do not change runtime code, sidecar behavior, MCP integrations, or agent
  role prompts.
- Do not move this back into the old standalone `tui-presentation` plugin.
  The source of truth remains `shravan-dev-workflow`.
- Do not use private session transcripts as public examples. Convert lessons
  into sanitized, generic patterns.

## Proposed File Surfaces

New files:

- `plugins/shravan-dev-workflow/skills/tui-presentation/references/progressive-disclosure.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/visual-family-selection.md`
- `tests/skills/pressure-scenarios/tui-presentation-progressive-disclosure.md`
- `tests/skills/pressure-scenarios/tui-presentation-research-lane-board.md`
- `tests/skills/pressure-scenarios/tui-presentation-visual-family-selection.md`
- `tests/skills/pressure-scenarios/tui-presentation-semantic-markdown-boundary.md`
- `tests/skills/pressure-scenarios/tui-presentation-no-mermaid-catalog.md`
- `docs/changelog/2026-06-12-tui-progressive-disclosure.md`

Edited files:

- `plugins/shravan-dev-workflow/skills/tui-presentation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/architecture.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/sequence-and-state.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/tables.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/ui-layouts.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/build-discipline.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `docs/changelog/README.md`

Conditional file:

- `.agents/plugins/marketplace.json`: edit only if the description/metadata
  needs a marketplace-facing wording update. It has no version field for this
  plugin today.
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/shape-catalog.md`:
  edit only for local link/duplicate cleanup directly caused by the new refs.
  Broader compaction is a separate reviewed slice.

## Implementation Tasks

### 0. Preflight And Dirty-Worktree Guard

1. Run `git status --short --untracked-files=all`.
2. Derive the overlap set by intersecting live dirty files with this plan's
   proposed file surfaces.
3. If only this plan file is dirty, proceed.
4. If other overlapping files are dirty, inspect and preserve those changes
   before editing. If the existing edits conflict with this plan in the same
   paragraphs, stop and reconcile before editing.
5. Refresh the live version facts:

```bash
jq -r '.version' plugins/shravan-dev-workflow/.codex-plugin/plugin.json
jq -r '.version' plugins/shravan-dev-workflow/.claude-plugin/plugin.json
jq -r '.plugins[] | select(.name=="shravan-dev-workflow") | .version // "no-version-field"' .claude-plugin/marketplace.json .agents/plugins/marketplace.json
```

Current expected preflight is `1.6.16`, so this slice should target `1.6.17`.
If preflight shows a different current version, target the next patch after the
live preflight version and update this plan/changelog evidence accordingly.

### 1. RED: Add Pressure Scenarios First

Create the five TUI pressure scenarios before changing the skill docs.

Pressure targets:

1. `tui-presentation-progressive-disclosure.md`
   - User asks for a difficult architecture explanation.
   - Bad answer dumps one giant diagram or one giant table.
   - Good answer starts with a context ladder, then zooms into one or two
     selected slices, preserving named targets.
2. `tui-presentation-research-lane-board.md`
   - User asks to use agents/research and summarize results.
   - Bad answer hides lane state in prose or implies TUI runs agents.
   - Good answer renders lanes, evidence status, accepted findings, open
     questions, and parent-owned synthesis.
3. `tui-presentation-visual-family-selection.md`
   - User asks for drawing help without specifying a format.
   - Bad answer defaults to Mermaid or one generic table.
   - Good answer chooses between flow, sequence, state, quadrant/2D, topology,
     or another existing family based on the concept being explained, then
     applies zooming as disclosure sequence when useful.
4. `tui-presentation-semantic-markdown-boundary.md`
   - User includes code, file paths, URLs, command snippets, and data names.
   - Bad answer puts all of them into box drawing or strips markdown.
   - Good answer uses TUI for structure and markdown for code/link semantics.
5. `tui-presentation-no-mermaid-catalog.md`
   - User asks whether Mermaid diagrams should be added.
   - Bad answer proposes a large Mermaid translation catalog.
   - Good answer explains that only a few visual families matter and that the
     reference teaches understanding-first drawing.

Each scenario must include concrete metadata, not only prose rubrics:

| Scenario | Required proof shape |
|----------|----------------------|
| `tui-presentation-progressive-disclosure.md` | `expect_decision_regex` mentions layered explanation; `expect_proof_regex` requires overview/map plus selected slice/detail without those exact rubric tokens leaking into the prompt. |
| `tui-presentation-research-lane-board.md` | `expect_proof_regex` requires handed-over lanes, parent synthesis, and no claim that TUI runs agents or decides acceptance. |
| `tui-presentation-visual-family-selection.md` | `expect_proof_regex` requires separation between disclosure sequence and visual family; choosing `zoom` as the primary family must fail. |
| `tui-presentation-semantic-markdown-boundary.md` | `expect_proof_regex` requires fenced code or inline code plus file links/URLs/tokens staying semantic markdown rather than box content. |
| `tui-presentation-no-mermaid-catalog.md` | `expect_proof_regex` requires understanding-first selection and rejects broad Mermaid catalog language. |

The prompt body for each scenario must avoid satisfying its own
`expect_proof_regex`; the harness' `assert_prompt_does_not_leak` gate must stay
green.

Run targeted RED baselines against the current installed/source skill:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-progressive-disclosure --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-research-lane-board --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-visual-family-selection --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-semantic-markdown-boundary --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-no-mermaid-catalog --timeout 900 --serial
```

Expected RED result:

- Each scenario must have explicit pass/fail criteria through
  `expect_decision_regex` and `expect_proof_regex`.
- The current skill must fail at least the progressive-disclosure,
  visual-family-selection, research-lane-board, and no-Mermaid-catalog
  scenarios before reference/SKILL edits.
- If a scenario passes RED, tighten the scenario metadata before changing skill
  docs. Do not accept "weak evidence" as a RED result.

### 2. Add Focused References

Add `progressive-disclosure.md` with a compact reference contract. In this
reference, "progressive disclosure" means the explanation technique. In
`SKILL.md`, rename the existing "Progressive disclosure" section to
"Reference loading" so one skill does not use the same label for two contracts.

Default skeleton:

- one map
- one selected slice
- one small ledger
- then technical detail

- Start with the user's named target and current question.
- Show the "map before territory": one context ladder or lane board before
  details.
- Use overview -> zoom -> detail:
  - overview names the whole system and primary moving parts.
  - zoom selects one vertical slice or fault line.
  - detail shows code/file/command specifics using semantic markdown.
- Prefer one primary visual plus a small ledger over many competing diagrams.
- Use progressive disclosure for research:
  - evidence lanes
  - named-target ledger
  - accepted / contested / open
  - next proof gate
  - TUI renders a board it is handed; it does not define lanes, run agents,
    decide acceptance, or replace the parent synthesis.
- Use progressive disclosure for implementation/debug narratives:
  - symptom
  - suspected boundary
  - proof gathered
  - decision
  - next validation

Add `visual-family-selection.md` with a capped selector contract. This file
chooses the visual family; existing references own worked examples.

- Flow chart: use when the concept is ordered decisions or work progression.
- Sequence diagram: use when the concept is "who talks to whom, in what
  order."
- State diagram: use when lifecycle states and transitions are the concept.
- Quadrant/2D map: use when two independent axes clarify tradeoffs or
  priorities.
- Topology map: use when boundaries, ownership, or communication paths matter.
- Zoom is not a visual family. It is a disclosure move owned by
  `progressive-disclosure.md`.

Reference ownership:

| File | Owns | Does not own |
|------|------|--------------|
| `SKILL.md` | trigger, defaults, and reference routing | worked examples or catalogs |
| `progressive-disclosure.md` | explanation sequence and zooming | visual-family catalog or research orchestration |
| `visual-family-selection.md` | family choice and routing to existing refs | worked examples |
| `architecture.md`, `sequence-and-state.md`, `tables.md`, `ui-layouts.md` | worked examples for their domains | global selection rules |
| `build-discipline.md` | alignment, overflow, and semantic markdown mechanics | disclosure sequence |

Size cap:

- Keep `progressive-disclosure.md` under roughly 180 lines.
- Keep `visual-family-selection.md` under roughly 120 lines.
- If either file wants more room, split examples into existing domain refs
  instead of expanding the selector.

### 3. Refactor Existing TUI References

Update existing references narrowly:

1. `architecture.md`
   - Add canonical-path-first examples.
   - Add boundary/topology examples that keep app/API/runtime/storage concerns
     separate.
   - Add an axes split example for two independent concerns.
2. `sequence-and-state.md`
   - Strengthen actual sequence diagrams with participants, ordered messages,
     retries/errors, and ownership of each transition.
   - Strengthen state diagrams with entry, transition labels, terminal states,
     and recovery paths.
3. `tables.md`
   - Add named-target ledger and research-lane board examples.
   - Keep tables for scan/comparison data, not code blocks.
4. `ui-layouts.md`
   - Add preview/detail and quiet-success/loud-failure presentation patterns.
5. `build-discipline.md`
   - Tighten semantic markdown wording if needed.
   - Avoid duplicating the full progressive reference.
6. `shape-catalog.md`
   - No broad compaction in this slice.
   - Only add local links or remove tiny duplicate guidance directly superseded
     by the new refs.
   - Broader catalog cleanup requires a separate reviewed plan.

### 4. Update `SKILL.md` As A Router

Keep `SKILL.md` short. Add only routing and default behavior:

- Before choosing a shape, choose the disclosure sequence.
- Preserve user nouns and named targets in the first visual.
- Use TUI structure for the explanation scaffold.
- Use semantic markdown for technical atoms: code, paths, URLs, identifiers,
  command snippets, and copyable blocks.
- Load `progressive-disclosure.md` for hard explanations, research synthesis,
  session-log synthesis, implementation narratives, and "draw this out" asks.
- Load `visual-family-selection.md` when the user asks for visual explanation,
  diagrams, mental models, architecture maps, state/sequence/flow, or
  alternatives to a flat table.
- Load one of the two new references first, then at most one domain example ref
  unless the user explicitly asks for broader catalog-style exploration.
- Rename the current "Progressive disclosure" reference-loading section to
  "Reference loading."
- Replace the current `SKILL.md` "Mermaid translations" note with
  understanding-first language.

Post-edit guard:

```bash
wc -l plugins/shravan-dev-workflow/skills/tui-presentation/SKILL.md
rg -n "semantic markdown|fenced code|inline code|file links|URLs|Mermaid translations" plugins/shravan-dev-workflow/skills/tui-presentation
```

### 5. Update Plugin Docs And Release Metadata

Version:

- Bump `shravan-dev-workflow` from the live preflight version to the next patch.
  Current expected target is `1.6.17` because `1.6.16` is already present in
  source manifests and marketplace metadata.
- Update:
  - `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
  - `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
  - `.claude-plugin/marketplace.json`
- Do not invent a version field in `.agents/plugins/marketplace.json`.
- Reconcile manifest keywords/descriptions intentionally. Codex and Claude
  plugin manifests should both include the TUI-facing keywords chosen for this
  release, such as `progressive-disclosure`, `visual-family`, and
  `semantic-markdown`, unless a difference is documented.

Docs:

- Update `plugins/shravan-dev-workflow/README.md` and `plugins/README.md` to
  describe the TUI skill as progressive-disclosure and semantic-markdown aware.
- Update `plugins/shravan-dev-workflow/references/trigger-evals.md` with the
  new TUI trigger/evaluation language.
- Update `plugins/shravan-dev-workflow/references/source-inspirations.md` with
  a concise note that TUI presentation now includes progressive disclosure,
  visual-family selection, and semantic-markdown separation.

Changelog:

- Add `docs/changelog/2026-06-12-tui-progressive-disclosure.md`.
- Update `docs/changelog/README.md` newest-first.
- Include:
  - plugin name and new version
  - affected skill/reference/test/doc/manifest files
  - user-visible behavior
  - pressure-test RED/GREEN evidence
  - plugin validation
  - Codex/Claude refresh status

Public-safety check:

- New examples must use sanitized patterns only.
- Before release, scan new TUI references and changelog entries for private
  session IDs, real local paths, and transcript-derived names. Record either a
  clean scan or the sanitized replacements in the changelog evidence.

### 6. GREEN Validation

Run focused TUI scenarios:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-progressive-disclosure --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-research-lane-board --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-visual-family-selection --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-semantic-markdown-boundary --timeout 900 --serial
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-no-mermaid-catalog --timeout 900 --serial
```

Run required scoped checks:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --scenario tui-presentation-monospace-structure --timeout 900 --serial
```

Run broader skill checks as advisory repo-wide health:

```bash
tests/skills/run-skill-pressure-tests.sh --fast --timeout 900
```

If the full suite fails outside the agreed TUI skill/docs surface, stop code
edits, report the unrelated failure separately, and do not fix unrelated skills
inside this slice. The scoped TUI gates remain the blocking gates for this
change.

Run static validation:

```bash
git add -N plugins/shravan-dev-workflow/skills/tui-presentation/references/progressive-disclosure.md plugins/shravan-dev-workflow/skills/tui-presentation/references/visual-family-selection.md tests/skills/pressure-scenarios/tui-presentation-progressive-disclosure.md tests/skills/pressure-scenarios/tui-presentation-research-lane-board.md tests/skills/pressure-scenarios/tui-presentation-visual-family-selection.md tests/skills/pressure-scenarios/tui-presentation-semantic-markdown-boundary.md tests/skills/pressure-scenarios/tui-presentation-no-mermaid-catalog.md docs/changelog/2026-06-12-tui-progressive-disclosure.md
git diff --check
jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json
diff <(jq -S '.keywords // []' plugins/shravan-dev-workflow/.codex-plugin/plugin.json) <(jq -S '.keywords // []' plugins/shravan-dev-workflow/.claude-plugin/plugin.json)
claude plugin validate .
validate_plugin.py plugins/shravan-dev-workflow
quick_validate.py plugins/shravan-dev-workflow/skills/tui-presentation
codex plugin list --marketplace ai-tools --available --json
```

Run release refresh/proof:

```bash
codex plugin add shravan-dev-workflow@ai-tools --json
codex plugin list --json
```

The `codex plugin add` output or installed plugin list must prove the installed
`shravan-dev-workflow` version/path. `codex plugin list --marketplace ai-tools
--available --json` is marketplace availability only; it is not installed-cache
proof.

For Claude, follow the existing changelog checklist and run the
`shravan-dev-workflow` post-refresh smoke from
`docs/changelog/references/shravan-dev-workflow-smoke.md`. If remote
publication is required before Claude can see the target version, record that
exact blocker and do not claim Claude refresh is complete.

### 7. Commit And Push

Only after validation:

1. Review `git diff --stat` and `git diff`.
2. Commit the scoped plan execution changes.
3. Push the branch if the user has not told us to avoid pushing.
4. Report:
   - commit hash
   - pushed branch
   - validation commands and exit status
   - installed Codex plugin version
   - Claude refresh status

## Split Or Stop Conditions

Stop and reconverge if:

- Pressure tests require harness changes. That is test infrastructure scope,
  not TUI skill behavior.
- Existing dirty changes conflict with the same manifest/doc paragraphs and the
  intended ownership is unclear.
- `SKILL.md` grows beyond 150 lines.
- `visual-family-selection.md` becomes a broad diagram catalog instead of a
  concise selector.
- Work on `shape-catalog.md` grows beyond local link/duplicate cleanup. Split
  broader catalog compaction into its own reviewed plan.
- A validation failure is outside the agreed TUI skill/docs surface. Report it
  separately and ask before changing unrelated infrastructure or skills.

## Risks

- The biggest risk is solving the wrong problem by adding diagram types instead
  of teaching disclosure sequence.
- The second risk is duplicating behavior across `spec-design-swarm`,
  `discuss-with-me`, and `tui-presentation`. The implementation must keep
  orchestration, questioning, and rendering separate.
- Public docs must not expose private session logs. Use sanitized pattern names
  and generic examples.
- Plugin cache behavior can make a source update look stale. Changelog evidence
  must distinguish source version, Codex installed version, and Claude refresh
  status.

## Open Questions

Recommended defaults:

- Use `visual-family-selection.md` as the new selector reference.
- Use plugin version `1.6.17`, the next patch after the current live
  `1.6.16`.
- Treat focused TUI pressure scenarios, existing TUI pressure coverage, plugin
  validators, manifest parity, and refresh proof as required. Treat the full
  pressure suite as advisory repo-wide health unless failures are in the TUI
  surface.

Questions for review:

- Should the changelog call out that the old standalone cached
  `tui-presentation` plugin is not the source of truth anymore, or is that too
  much cache/internal detail for public docs?
