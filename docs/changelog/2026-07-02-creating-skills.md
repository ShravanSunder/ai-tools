# Creating Skills Workflow

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.34`

## User-visible changes

- Added `shravan-dev-workflow:creating-skills` as the owned workflow for
  creating, updating, or evaluating one named skill or accepted draft.
- Made `creating-skills/SKILL.md` the operational workflow spine with shared
  authoring state, branch routing, placement audit, proof posture, and completion
  criteria.
- Added branch references for authoring intake, great-skill evaluation,
  invocation/description, progressive disclosure, steering/wording,
  pressure-testing, platform mechanics, pruning, source adaptation, and
  sensitive-resource review.
- Added focused pressure scenarios for workflow-spine behavior, deterministic
  draft evaluation, and sensitive-resource/cache-boundary behavior.
- Updated `AGENTS.md` routing so named skill authoring/evaluation routes through
  `creating-skills`; `skill-audit` remains the owner for broad portfolio audit.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.34` and synced the
  Claude marketplace version.

## Affected files

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/*.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/agents/openai.yaml`
- `tests/skills/pressure-scenarios/creating-skills-*.md`
- `AGENTS.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- T0 preflight captured branch/worktree state and baseline proof-gap status.
- `creating-skills` focused pressure scenarios were added before the skill body
  proof pass.
- Codex static validation passed by running the `skill-creator` quick validator
  for `plugins/shravan-dev-workflow/skills/creating-skills` with PyYAML
  available.
- Focused Codex pressure behavior proof passed for:
  `creating-skills-workflow-spine`,
  `creating-skills-evaluate-draft`, and
  `creating-skills-security-and-cache-boundary`.
- Harness/unit validation passed:
  `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`
  and `pnpm --dir tests/skills exec tsc --noEmit`.
- Claude plugin validation passed: `claude plugin validate .`.
- Codex marketplace visibility check completed to a validation artifact; source
  readback remains installed-cache stale until refresh.
- Full fast pressure suite was attempted, then stopped after unrelated existing
  pressure drift surfaced outside the creating-skills scope.
- Codex refresh/reinstall status: deferred; source validation only.
- Claude refresh/reinstall status: deferred; source validation only.
- Claude behavior proof: deferred; no Claude behavior harness is in scope.

## Notes

- Codex marketplace source/path metadata was not changed because no marketplace
  source/path/policy/category field changed.
- Installed-cache refresh remains a release/readback step and was not performed
  during source validation.
