# 2026-06-15 Orchestrator Goal State Transitions

Plugin: `shravan-dev-workflow`
Version: `1.6.23`

## Summary

Added a tiny goal-backed workflow state contract to `orchestrator-goal` so
multi-phase goals preserve exact file anchors, distinguish phase completion from
goal completion, and keep official workflow transitions parent-owned.

## Changes

- Added `goal_id`, `Current workflow`, `Next workflow`, `Terminal condition`,
  `State details`, and `Transition log` fields for multi-phase goal-backed
  workflows.
- Established `tmp/workflow-state/<goal_id>/details.md` as expanded context and
  `tmp/workflow-state/<goal_id>/events.jsonl` as the append-only transition
  ledger.
- Explicitly rejected `files.md` and `state.md` as separate sources of truth:
  exact spec, plan, review/report, and handoff paths stay in `/goal`.
- Made `orchestrator-goal` the only official workflow transition writer.
- Added the phase recommendation footer:
  `phase_result`, `evidence`, `recommended_next_workflow`, and
  `recommended_transition_reason`.
- Added precedence rules for `/goal`, `details.md`, and `events.jsonl`.
- Added pressure coverage for the plan-review-to-implementation transition and
  single-writer transition ownership.
- Bumped `shravan-dev-workflow` plugin metadata to `1.6.23`.

## Validation

- RED baseline against installed `shravan-dev-workflow` `1.6.22`:
  `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-review-transition --timeout 360`
  exited `1`, failing proof assertions for current workflow, terminal
  condition, `details.md`, and `events.jsonl`.
- RED baseline against installed `shravan-dev-workflow` `1.6.22`:
  `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-transition-single-writer --timeout 360`
  exited `1`, failing proof assertions for official transition ownership,
  `phase_result`, `recommended_next_workflow`, and latest-event precedence.
- GREEN focused pressure validation against refreshed Codex plugin `1.6.23`:
  each command exited `0` with `Passed 1 Failed 0`.
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-review-transition --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-transition-single-writer --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-clarity-gate --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-closeout-audit --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-plan-create-matrix-handoff --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-proof-matrix-ownership --timeout 360`
  - `CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario orchestrator-goal-required-files-skill-name --timeout 360`
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/orchestrator-goal`
  exited `0`: `Skill is valid!`.
- `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh`
  exited `0`.
- `python3 -m json.tool` passed for both plugin manifests and both marketplace
  manifests.
- `uv run --with pyyaml python /Users/shravansunder/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py plugins/shravan-dev-workflow`
  exited `0`: plugin validation passed.
- `claude plugin validate .` exited `0`: validation passed.
- `git diff --check` exited `0`.
- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed the local
  Codex install to `1.6.23`.
- `codex plugin list --marketplace ai-tools --available --json` showed
  `shravan-dev-workflow@ai-tools` installed at `1.6.23` from local source
  `/Users/shravansunder/dev/ai-tools/plugins/shravan-dev-workflow`.
- Before pushing this source change, `claude plugin update
  shravan-dev-workflow@ai-tools --scope user` still reported the GitHub-backed
  marketplace version as `1.6.22`; refresh requires the pushed marketplace
  commit.
