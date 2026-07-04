# Discuss Clarify Mental Models: Map-Building Upgrade

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.39` -> `1.6.40`

## User-Visible Behavior Changes

- Upgraded `discuss-clarify-mental-models` from an alignment drift card into a
  mental-model reconstruction card.
- Replaced the old 8-field output contract with a 10-field map-building
  contract:
  `model`, `evidence_checked`, `inherited_frame`, `first_principles`,
  `assumptions`, `branches`, `countercase`, `rebuilt_model`,
  `open_or_confirmed`, and `next_workflow`.
- Added explicit provenance decomposition so agent reports, prior names, habits,
  and analogies do not get collapsed into direct evidence or assumptions.
- Added swarm-work territory: an agent's summary of its own work is inherited
  framing until the parent reads artifacts, diffs, task state, or run output.
- Added `references/model-shapes.md` with compact examples for terms, boundary,
  flow, state, ownership, constraint, tradeoff, and swarm-work maps.
- Renamed `recommended_default` to `rebuilt_model` so the skill carries forward
  a clarified map instead of merely recommending a next choice.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md`
- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/agents/openai.yaml`
- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/references/model-shapes.md`
- `tests/skills/pressure-scenarios/discuss-clarify-mental-models-map-building.md`
- `tests/skills/pressure-scenarios/discuss-clarify-mental-models-reconverge.md`
- `tests/skills/pressure-scenarios/discuss-clarify-mental-models-drift-interrupt.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- RED proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-map-building --serial --timeout 900`
  failed against the old skill contract with six assertion failures: missing map
  shape, `inherited_frame`, `first_principles`, and `rebuilt_model` behavior.
- GREEN proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-map-building --serial --timeout 900`
  passed twice after the source update, 1/1 each.
- Parity proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-reconverge --serial --timeout 900`
  passed, 1/1.
- Parity proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-drift-interrupt --serial --timeout 900`
  passed, 1/1.
- Codex `skill-creator` quick validator on `discuss-clarify-mental-models` --
  `Skill is valid!`.
- `claude plugin validate .` -- validation passed.
- `jq` over the plugin and marketplace JSON files -- all valid.
- `pnpm --dir tests/skills exec tsc --noEmit` -- passed.
- `git diff --check` -- passed.

## Refresh Status

- Codex installed-cache refresh: deferred; not run. Installed-cache refresh is
  an explicit post-release step, not source validation.
- Claude installed-cache refresh: deferred; not run, for the same reason.
