# Shravan Dev Workflow Whole-Picture Review Lanes

Plugin: `shravan-dev-workflow` 1.6.30

## User-visible behavior

- `spec-review-swarm` now requires a first-class `whole-spec-coverage` lane for
  substantial spec reviews. Focused lanes cannot replace the whole-spec pass.
- `plan-review-swarm` now requires a first-class `whole-plan-cohesion` lane for
  substantial plan reviews. Focused lanes cannot replace the source-to-plan
  cohesion pass.
- Review packets now explicitly carry primary artifact inputs and source
  anchors. Plan review packets carry the produced plan and accepted source
  spec/design/goal/handoff when one exists. Spec review packets carry the target
  spec and research/source artifacts that constrain it.
- Missing-artifact and shortcut responses must name the mandatory whole-picture
  lane instead of falling back to generic "coverage" language.
- Runtime swarm packet contracts are now skill-local. Workflow skills no
  longer import the old global `references/lane-contract.md`; packet anatomy,
  source-truth rules, receipts, parent reducer rules, and route-backs live in
  each owning skill reference.
- Spec review lane files now carry lane judgment guidance instead of thin
  route/schema boilerplate: where to look, how to inspect, good/bad signals,
  calibration, overlap boundaries, and exact refinement outputs.
- `plan-creation-swarm` now treats vertical slices as first-class plan units.
  Substantial plans must map source requirement -> behavior/capability ->
  likely touched files/interfaces -> checkpoint/integration gate -> proof
  layers/evidence.
- `spec-creation-swarm` and `plan-creation-swarm` now state lane orchestration
  order in `SKILL.md`: which lanes run early, which depend on earlier evidence,
  and how the parent collection pass reduces candidate lane outputs.
- Creation lane references now state call timing, prerequisites, and collection
  contribution so the parent can dispatch subagents deliberately instead of
  sending generic helper prompts.
- `plan-review-swarm` now tells review lanes to independently read the plan and
  accepted source artifact; controller summaries are routing hints, not source
  truth. Whole-plan/spec/testability lanes return a coverage ledger.
- Spec-review findings now require exact inspectable anchors, the smallest
  refinement target, and a validation note so parent reducers and spec creators
  do not inherit vague critique.

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/`
- `plugins/shravan-dev-workflow/skills/skill-audit/`
- `tests/skills/pressure-scenarios/`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- Added pressure scenarios for mandatory whole-picture review lanes.
- Added pressure scenarios for no global runtime lane contract, vertical-slice
  plan proof, creation-lane ordering/prerequisites, independent source/plan
  review coverage, and semantic spec-review lane judgment.
- Live Codex pressure before the patch failed the new
  `spec-review-swarm-whole-spec-coverage-lane` scenario because the installed
  skill only described whole-picture coverage generically.
- Focused fake pressure for the new/changed scenarios: 7 passed.
- Static grep for stale runtime lane-contract references under workflow skills:
  pass; only this changelog/pressure README contain historical or scenario
  wording.
- TypeScript pressure-test harness typecheck: pass.
- Pressure harness unit tests: 25 passed.
- Claude plugin marketplace validation: pass.
- Full fake fast pressure suite: 69 passed, 14 existing unrelated baseline
  failures.

## Refresh status

Plugin cache refresh not performed in this change. The live Codex pressure
runner uses the installed plugin cache, so green live pressure against 1.6.30
requires an explicit cache refresh/install step.
