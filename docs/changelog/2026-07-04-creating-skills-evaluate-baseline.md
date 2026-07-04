# Creating Skills Evaluate Baseline Contract

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.38` -> `1.6.39`

## User-Visible Behavior Changes

- Extended the `creating-skills` Authoring State `baseline` contract so
  `evaluate` runs have a legal value:
  `review target (evaluate) -- what is being judged`.
- Updated the evaluate-draft pressure scenario with a baseline assertion so
  future evaluate regressions cannot pass without exercising the field.
- Trimmed residual rule clauses from `creating-skills/references/glossary.md`
  so the glossary remains definitions-only and placement rules stay in
  `SKILL.md`.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/glossary.md`
- `tests/skills/pressure-scenarios/creating-skills-evaluate-draft.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- RED proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-evaluate-draft --serial --timeout 900`
  failed after adding the new assertion, with the pre-fix output still using
  `baseline: hypothesized` for an evaluate run.
- GREEN proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-evaluate-draft --serial --timeout 900`
  passed twice after the source update, 1/1 each.
- Parity proof:
  `tests/skills/run-skill-pressure-tests.sh --scenario creating-skills-update-existing-skill --serial --timeout 900`
  passed, 1/1.
- Codex `skill-creator` quick validator on `creating-skills` -- `Skill is
  valid!`.
- `claude plugin validate .` -- validation passed.
- `jq` over the plugin and marketplace JSON files -- all valid.
- `pnpm --dir tests/skills exec tsc --noEmit` -- passed.
- `git diff --check` -- passed.

## Refresh Status

- Codex installed-cache refresh: deferred; not run. Installed-cache refresh is
  an explicit post-release step, not source validation.
- Claude installed-cache refresh: deferred; not run, for the same reason.
