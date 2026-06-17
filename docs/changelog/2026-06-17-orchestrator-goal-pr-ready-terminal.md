# Orchestrator Goal PR-Ready Terminal

## Plugin

- Marketplace-facing plugin: `shravan-dev-workflow`
- Version: `1.6.24`

## User-Visible Behavior

- `orchestrator-goal` now treats implementation goals as full delivery
  lifecycles by default: start from the first unproven gate, continue through
  implementation proof, implementation review, and PR readiness.
- Existing spec, plan, diff, review, or PR artifacts move the starting point
  forward; they do not silently narrow the terminal condition.
- The default implementation terminal is PR created or updated and proven ready,
  but not merged.
- `implementation-pr-wrapup` is now an explicit orchestrator route for PR
  open/update/checks/comments/review-thread/readiness proof.
- Goal contracts can carry an `Orchestration rules applied:` line naming the
  durable lifecycle rules:
  `default implementation terminal`, `mutable starting point`,
  `pr-ready non-merge boundary`, `full proof loop`, and
  `checkpoint commit rule`.
- Goal contracts now explicitly call out checkpoint commits at verified
  lifecycle checkpoints when scoped files changed and repo policy permits.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/orchestrator-goal/SKILL.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/codex-goal.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/goal-contract.md`
- `plugins/shravan-dev-workflow/skills/orchestrator-goal/references/routing-map.md`
- `tests/skills/pressure-scenarios/orchestrator-goal-default-pr-ready-terminal.md`
- `tests/skills/pressure-scenarios/orchestrator-goal-stale-terminal-override.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- RED pressure:
  `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-default-pr-ready-terminal --timeout 360`
  failed before the skill patch because the current skill did not expose the
  named durable rules.
- GREEN pressure:
  `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-default-pr-ready-terminal --timeout 360`
  passed after the skill/reference updates.
- Regression pressure:
  `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-stale-terminal-override --timeout 360`
  passed after the updates.
- Full orchestrator pressure sweep:
  `orchestrator-goal-clarity-gate`,
  `orchestrator-goal-closeout-audit`,
  `orchestrator-goal-default-pr-ready-terminal`,
  `orchestrator-goal-plan-create-matrix-handoff`,
  `orchestrator-goal-plan-review-transition`,
  `orchestrator-goal-proof-matrix-ownership`,
  `orchestrator-goal-required-files-skill-name`,
  `orchestrator-goal-stale-terminal-override`, and
  `orchestrator-goal-transition-single-writer` all passed with
  `CODEX_PRESSURE_REASONING_EFFORT=low`.
- Structural validation:
  `python3 -m json.tool` for changed JSON files, `bash -n` for the pressure
  runner helpers, `git diff --check`, and `claude plugin validate .` passed.

## Refresh Status

- Codex cache refreshed locally with:
  `codex plugin add shravan-dev-workflow@ai-tools --json`
- Installed Codex cache reported `shravan-dev-workflow` version `1.6.24` after
  the version bump.
