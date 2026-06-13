# 2026-06-13 Orchestrator Goal Closeout Audit

Plugin: `shravan-dev-workflow`
Version: `1.6.22`

## Summary

Added a mandatory `orchestrator-goal` closeout audit so goal completion accounts
for lifecycle gates, requirements/proof matrix rows, review/work cycles, and
remaining open or blocked work.

## Changes

- Added the Goal Closeout Audit to `orchestrator-goal`.
- Limited closeout statuses to `done`, `not-applicable`, `open`, and `blocked`.
- Required every closeout row to include gate, status, evidence, and next.
- Required `done` rows to have an evidence pointer, including `user assertion in
  this chat` when prior work is known only from the conversation.
- Clarified that mandatory closeout accounting does not rerun already-completed
  lifecycle skills.
- Added focused pressure coverage for closeout auditing.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.22`.

## Validation

- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed Codex to
  installed plugin version `1.6.22`.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-closeout-audit --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-proof-matrix-ownership --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-required-files-skill-name --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-create-matrix-handoff --timeout 900` passed.
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh` passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json` passed.
- `git diff --check` passed.
