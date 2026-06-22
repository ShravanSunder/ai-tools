# Agents Skill Work SOP

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.25`

## User-visible changes

- Promoted skill work guidance in tracked `agents.md` into a first-class
  `Skill Work SOP` section. `CLAUDE.md` remains the tracked symlink to
  `agents.md`; local `AGENTS.md` is not a versioned repo artifact.
- Clarified that `agents.md` is the repo operating map / table of contents, not
  the full skill-writing manual.
- Routed skill work to the owning meta-skills:
  `shravan-dev-workflow:skill-audit`, `superpowers:writing-skills`,
  `skill-creator`, `tests/skills/README.md`, and `docs-maintain`.
- Tightened `skill-audit` so update/create recommendations include progressive
  skill shape and pressure-coverage guidance.
- Extended `skill-audit-evidence-first` pressure coverage to catch missing
  per-recommendation `SKILL.md`, `references/`, `scripts/`, and pressure
  coverage guidance.
- Clarified that implemented skill-work changes route through
  `implementation-review-swarm` and `implementation-pr-wrapup` before
  merge-ready completion; cache refresh is post-push/release proof, not a local
  substitute for PR readiness.

## Affected files

- `agents.md`
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
- First GREEN pressure proof after `skill-audit` update exposed stale cache risk:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-evidence-first --timeout 360`
  passed once, but implementation review found repeated runs still loaded the
  installed `1.6.24` cache and failed the new proof assertion.
- Codex cache refresh:
  `codex plugin marketplace remove ai-tools`, then
  `codex plugin marketplace add /Users/shravansunder/dev/ai-tools.agents-skill-work-sop --json`,
  then `codex plugin add shravan-dev-workflow@ai-tools --json` installed
  `shravan-dev-workflow` `1.6.25` from this worktree.
- Reproducible GREEN pressure proof after Codex cache refresh:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario skill-audit-evidence-first --timeout 360`
  passed twice consecutively, each with 1 scenario / 0 failed and all four proof
  assertions passing.
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/skill-audit`
  passed.
- Docs identity and reference checks passed:
  `readlink CLAUDE.md`, `git ls-files --stage agents.md CLAUDE.md`, and `rg`
  checks for `Skill Work SOP`, `skill-audit`, `superpowers:writing-skills`,
  `skill-creator`, the local pressure-test command, and the review / PR wrapup
  skills. Local `AGENTS.md` hardlink identity was checked with
  `cmp -s agents.md AGENTS.md`, but `AGENTS.md` is not tracked.
- Plugin metadata validation passed:
  `jq empty ...` and
  `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/shravan-dev-workflow`.
- Diff and shell hygiene passed:
  `git diff --check` and
  `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh`.
- Claude marketplace validation passed with `claude plugin validate .`.
- Claude installed refresh status: `claude plugin list` still reports
  `shravan-dev-workflow@ai-tools` `1.6.24` because the configured Claude
  `ai-tools` marketplace is GitHub-backed (`ShravanSunder/ai-tools`). Refresh is
  deferred until the source update is available through that marketplace.
