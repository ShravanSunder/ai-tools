# 2026-06-13 Orchestrator Goal Proof Matrix

Plugin: `shravan-dev-workflow`
Version: `1.6.18`

## Summary

Hardened `orchestrator-goal` so long-horizon goals carry an explicit
requirements/proof matrix and keep completion parent-owned when subagents,
reviewers, UI drivers, or telemetry sources provide evidence.

## Changes

- Added proof-matrix discipline to `orchestrator-goal`.
- Expanded the goal contract reference with row shape, owner, and stale-proof
  guard fields.
- Updated copy-paste goal prompts so handoffs carry the matrix and parent
  verification rule.
- Added pressure coverage for clear multi-agent goals where child-lane success
  is tempting but insufficient.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.18`.

## Validation

- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-proof-matrix-ownership --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-clarity-gate --timeout 900` passed.
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh` passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json` passed.
- `git diff --check` passed.
