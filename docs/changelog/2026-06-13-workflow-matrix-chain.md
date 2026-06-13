# 2026-06-13 Workflow Matrix Chain

Plugin: `shravan-dev-workflow`
Version: `1.6.19`

## Summary

Extended the goal proof-matrix rule through planning, plan handoff, and plan
execution so matrix owners, stale-proof guards, and parent verification survive
the workflow chain.

## Changes

- Updated `orchestrator-goal` to carry known matrix rows into `plan-create` and
  label missing implementation rows as `must be defined by plan-create`.
- Updated `plan-create` to require proof owners and stale-proof guards for
  non-trivial rows.
- Updated `plan-handoff` and its template to preserve matrix owners, stale-proof
  guards, split triggers, open gaps, and parent verification.
- Updated `implementation-execute-plan` validation/final-report guidance to
  cross-check matrix rows before completion claims.
- Added pressure scenarios for goal-to-plan routing, plan-handoff matrix
  preservation, and implementation execution matrix verification.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.19`.

## Validation

- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed Codex to
  installed plugin version `1.6.19`.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-create-matrix-handoff --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario plan-handoff-proof-matrix-preservation --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario implementation-execute-plan-matrix-verification --timeout 900` passed.
- Related regressions passed:
  `orchestrator-goal-proof-matrix-ownership`,
  `orchestrator-goal-clarity-gate`, `plan-handoff-full-packet`, and
  `implementation-execute-plan-validate-before-edits`.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --timeout 900` was run as an advisory full-suite check: 33 passed, 1 failed in unrelated `debug-investigation-background-monitoring` proof assertion 7 (`path/tool probe`).
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh` passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json` passed.
- `git diff --check` passed.
