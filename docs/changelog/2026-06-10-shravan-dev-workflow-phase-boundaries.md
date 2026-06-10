# 2026-06-10 Shravan Dev Workflow phase boundaries

## Plugin

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.9`

## User-visible changes

Added explicit spec and plan boundary skills so the workflow grammar is:

- spec: `spec-design-swarm`, `spec-review-swarm`, `spec-handoff`
- plan: `plan-create`, `plan-review-swarm`, `plan-handoff`
- implementation: `implementation-execute-plan`,
  `implementation-review-swarm`, `implementation-handoff`

`handoff` now means portability, not phase completion.

## Affected skills

- Added `spec-handoff`.
- Added `plan-create`.
- Narrowed `plan-handoff` to existing implementation-plan portability.
- Narrowed `implementation-handoff` to real implementation state.
- Tightened `implementation-execute-plan` to require a written implementation
  plan instead of executing directly from design/spec context.
- Updated routing in `discuss-with-me`, `orchestrator-goal`,
  `spec-design-swarm`, and `docs-maintain`.

## Pressure scenarios

Added RED-first pressure scenarios for:

- `spec-handoff-portable-design-context.md`
- `plan-create-from-spec-not-code.md`
- `plan-handoff-existing-plan-only.md`
- `implementation-handoff-requires-state.md`
- `implementation-execute-plan-rejects-design-only.md`

## Validation

- Focused RED checks before adding the new skills:
  - `tests/skills/run-skill-pressure-tests.sh --scenario spec-handoff-portable-design-context --timeout 300` failed as expected with `skill_invoked=false`.
  - `tests/skills/run-skill-pressure-tests.sh --scenario plan-create-from-spec-not-code --timeout 300` failed as expected with `skill_invoked=false`.
- Pre-change boundary controls passed:
  - `tests/skills/run-skill-pressure-tests.sh --scenario plan-handoff-existing-plan-only --timeout 300` passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario implementation-handoff-requires-state --timeout 300` passed.
  - `tests/skills/run-skill-pressure-tests.sh --scenario implementation-execute-plan-rejects-design-only --timeout 300` passed.
- Static checks passed:
  - `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .agents/plugins/marketplace.json .claude-plugin/marketplace.json`
  - `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/test-discuss-with-me-pressure.sh tests/skills/test-plan-review-swarm-pressure.sh`
  - `git diff --check`
- Codex plugin refresh passed:
  - `codex plugin add shravan-dev-workflow@ai-tools --json`
  - `codex plugin list --marketplace ai-tools --available --json` reported `codex version=1.6.9 enabled=true`.
- Focused GREEN checks passed after refresh:
  - `spec-handoff-portable-design-context`
  - `plan-create-from-spec-not-code`
  - `plan-handoff-existing-plan-only`
  - `implementation-handoff-requires-state`
  - `implementation-execute-plan-rejects-design-only`
- After clarifying `plan-create` read-only wording, the targeted
  `plan-create-from-spec-not-code` pressure scenario was rerun and passed with
  `Passed: 1`, `Failed: 0`.
- Full fast pressure suite passed:
  - `tests/skills/run-skill-pressure-tests.sh --fast --timeout 900`
  - Result: `Passed: 20`, `Failed: 0`
  - Non-fatal Slack MCP auth noise appeared in child Codex sessions.
- Claude marketplace validation passed:
  - `claude plugin validate .`
- Claude user-scope refresh passed after push:
  - `claude plugin update shravan-dev-workflow@ai-tools`
  - Result: updated from `1.6.8` to `1.6.9`; restart required to apply.
