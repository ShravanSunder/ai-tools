# 2026-06-13 Orchestrator Goal Prompt Anchoring

Plugin: `shravan-dev-workflow`
Version: `1.6.20`

## Summary

Tightened `orchestrator-goal` copy-paste goal contracts so future sessions keep
the governing skill name, exact plan/source files, and explicit unclear-goal
routing to `discuss-with-me`.

## Changes

- Required unclear goals to name `shravan-dev-workflow:discuss-with-me` as the
  next workflow.
- Required copy-paste goal text to include
  `shravan-dev-workflow:orchestrator-goal`.
- Required known plan/spec/handoff paths and related files to stay in the goal
  text instead of being collapsed into vague "plan/docs" wording.
- Added focused pressure coverage for exact file paths and skill-name anchoring.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.20`.

## Validation

- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed Codex to
  installed plugin version `1.6.20`.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-required-files-skill-name --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-clarity-gate --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-create-matrix-handoff --timeout 900` passed.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-proof-matrix-ownership --timeout 900` passed.
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh` passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json .agents/plugins/marketplace.json` passed.
- Scoped `git diff --check` passed for the orchestration files. Repo-wide
  `git diff --check` is currently blocked by unrelated Peekaboo edits in the
  parallel flow.
