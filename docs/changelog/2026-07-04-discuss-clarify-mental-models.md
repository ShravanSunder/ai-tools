# Discuss Clarify Mental Models

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.36` -> `1.6.37`

## Affected Surfaces

- Added `plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models/`
  with a compact `SKILL.md` and Codex UI metadata.
- Added
  `tests/skills/pressure-scenarios/discuss-clarify-mental-models-reconverge.md`
  for the new mental-model reconvergence behavior.
- Updated `tests/skills/pressure-scenarios/README.md` to list the new pressure
  scenario.
- Updated `plugins/shravan-dev-workflow/README.md`, `plugins/README.md`, and
  `AGENTS.md` to list the new skill.
- Updated `.agents/plugins/marketplace.json` discovery text.
- Bumped `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`,
  `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`, and
  `.claude-plugin/marketplace.json` to `1.6.37`.

## User-Visible Behavior Changes

- New skill: `discuss-clarify-mental-models`.
- The skill owns read-only reconvergence when terms, boundaries, assumptions,
  source-of-truth questions, or tradeoffs are unstable before specs, plans,
  docs, or code.
- It uses a fixed obligation set (`model`, `assumptions`, `branches`,
  `countercase`, `evidence_checked`, `recommended_default`,
  `open_or_confirmed`, `next_workflow`) without forcing the old exactly-one
  question grill shape.
- It routes broad evidence to `research-swarm`, durable contracts to
  `spec-creation-swarm`, sequencing to `plan-creation-swarm`, current manual
  owner-decision pressure to `discuss-with-me`, and keeps blocked/broken-model
  cases open when no shipped owner exists yet. It explicitly avoids routing to
  future discussion-surface names until those skills exist.

## Validation

- `tests/skills/run-skill-pressure-tests.sh --scenario discuss-clarify-mental-models-reconverge --serial --timeout 900` -- passed, 1 test / 1 scenario, 32.74s. The first sandboxed attempt failed before assertions because the nested Codex subprocess could not initialize its local app-server client; the rerun with the same scoped command and normal subprocess permissions passed. A same-session review fix removed a stale future-skill route target and old "forcing question" wording from the new skill before the final green run.
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/discuss-clarify-mental-models` -- `Skill is valid!`. The first sandboxed attempt failed when `uv` could not access its user cache; rerun with normal cache access passed.
- `claude plugin validate .` -- validation passed.
- `pnpm --dir tests/skills exec tsc --noEmit` -- passed.
- `jq . plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json` -- passed.
- `git diff --check` -- passed.
- `codex plugin list --marketplace ai-tools --available --json` -- command succeeded; installed cache still reported `shravan-dev-workflow` as `1.6.36`, as expected because cache refresh was intentionally deferred.

## Refresh Status

- Codex installed-cache refresh: deferred; not run. Installed-cache refresh is
  an explicit post-release step, not source validation.
- Claude installed-cache refresh: deferred; not run, for the same reason.
