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

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/spec-review-swarm/`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/`
- `tests/skills/pressure-scenarios/`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- Added pressure scenarios for mandatory whole-picture review lanes.
- Live Codex pressure before the patch failed the new
  `spec-review-swarm-whole-spec-coverage-lane` scenario because the installed
  skill only described whole-picture coverage generically.
- Full validation status is recorded in the implementation closeout for the
  branch.

## Refresh status

Plugin cache refresh not performed in this change. The live Codex pressure
runner uses the installed plugin cache, so green live pressure against 1.6.30
requires an explicit cache refresh/install step.
