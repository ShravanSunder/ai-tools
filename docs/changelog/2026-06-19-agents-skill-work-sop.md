# Agents Skill Work SOP

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.25`

## User-visible changes

- Promoted skill work guidance in `agents.md` / `AGENTS.md` into a first-class
  `Skill Work SOP` section.
- Clarified that `agents.md` is the repo operating map / table of contents, not
  the full skill-writing manual.
- Routed skill work to the owning meta-skills:
  `shravan-dev-workflow:skill-audit`, `superpowers:writing-skills`,
  `skill-creator`, `tests/skills/README.md`, and `docs-maintain`.
- Tightened `skill-audit` so update/create recommendations include progressive
  skill shape and pressure-coverage guidance.
- Extended `skill-audit-evidence-first` pressure coverage to catch missing
  progressive-shape and pressure-proof recommendations.

## Affected files

- `agents.md`
- `AGENTS.md`
- `plugins/shravan-dev-workflow/skills/skill-audit/SKILL.md`
- `tests/skills/pressure-scenarios/skill-audit-evidence-first.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- RED baseline before `skill-audit` update:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-evidence-first --timeout 360`
  failed on proof assertion 1 as expected.
- GREEN pressure proof after `skill-audit` update:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-evidence-first --timeout 360`
  passed 1 scenario / 0 failed.
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/skill-audit`
  passed.
- Docs identity and reference checks passed:
  `cmp -s agents.md AGENTS.md`, `readlink CLAUDE.md`, and `rg` checks for
  `Skill Work SOP`, `skill-audit`, `superpowers:writing-skills`,
  `skill-creator`, and the local pressure-test command.
- Plugin metadata validation passed:
  `jq empty ...` and
  `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/shravan-dev-workflow`.
- Diff and shell hygiene passed:
  `git diff --check` and
  `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh`.
- Installed cache refresh status is captured in PR closeout because the goal
  terminal is merge-ready PR, not local validation alone.
