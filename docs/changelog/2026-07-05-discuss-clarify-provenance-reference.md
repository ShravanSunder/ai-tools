# Discuss Clarify Mental Models: Provenance Reference

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.40` -> `1.6.41`

## User-Visible Behavior Changes

- Added `references/provenance-decomposition.md` for the hard branch where
  `inherited_frame`, `first_principles`, and `assumptions` collapse into one
  vague caveat.
- Added explicit `SKILL.md` branch-reference pointers so agents know when to
  load `model-shapes.md` versus `provenance-decomposition.md`.
- Tightened the map-building pressure scenario so the provenance-collapse path
  must use the provenance guide's "what the evidence does not prove" check
  instead of only naming the guide.
- Tightened reconvergence wording so branch-selection questions use
  existing contract fields instead of reviving the old `forcing question`
  label or introducing an undocumented output slot.
- Tightened drift-interrupt wording so `countercase` names the load-bearing
  assumption or tradeoff before work resumes.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/SKILL.md`
- `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/references/provenance-decomposition.md`
- `tests/skills/pressure-scenarios/discuss-clarify-mental-models-map-building.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- RED proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-map-building --serial --timeout 900`
  failed after adding the branch-guide assertion against the current skill; the
  agent named generic provenance decomposition but not a concrete branch guide.
- Review follow-up:
  `implementation-review-swarm` accepted three P2 findings: duplicate slot
  definitions in the reference, an undocumented `open_questions` slot, and a
  filename-only pressure assertion. The reference now points back to `SKILL.md`
  for slot definitions, branch questions stay inside existing fields, and the
  pressure scenario asserts report-as-claim/not-proof behavior.
- GREEN proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-map-building --serial --timeout 900`
  passed after adding the reference and `SKILL.md` load pointer, 1/1.
- Parity proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-reconverge --serial --timeout 900`
  passed after closing the old `forcing question` label leak, 1/1.
- Parity proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-drift-interrupt --serial --timeout 900`
  passed after tightening the load-bearing countercase wording, 1/1.
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
