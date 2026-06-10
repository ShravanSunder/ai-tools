# 2026-06-10 Shravan Dev Workflow namespace renames

## Plugin

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.8`

## User-visible changes

Renamed workflow skills so names follow a clearer namespace/purpose pattern and
reserve `swarm` for workflows that dispatch independent lanes and reduce their
candidate outputs.

## Rename map

- `orchestrate-goal` -> `orchestrator-goal`
- `spec-review-council` -> `spec-review-swarm`
- `plan-review` -> `plan-review-swarm`
- `plan-execute` -> `implementation-execute-plan`
- `security-router` -> `ops-security-review`
- `pm-linear-work` -> `ops-linear-tracking`

## Affected files

- Updated `plugins/shravan-dev-workflow/skills/` directories, frontmatter, agent
  prompts, and cross-skill routing references.
- Updated `agents.md`, `plugins/README.md`, and
  `plugins/shravan-dev-workflow/README.md`.
- Updated Codex and Claude plugin manifests plus the Claude marketplace entry.
- Updated skill pressure scenario filenames and `skill_under_test` values.

## Validation

- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json
  plugins/shravan-dev-workflow/.claude-plugin/plugin.json
  .agents/plugins/marketplace.json .claude-plugin/marketplace.json` passed.
- `bash -n tests/skills/run-skill-pressure-tests.sh
  tests/skills/test-discuss-with-me-pressure.sh
  tests/skills/test-plan-review-swarm-pressure.sh` passed.
- Stale-name scan passed for the live plugin, marketplace, agent instruction,
  and pressure-test surfaces. The only old-name hits are this entry's rename map.
- `tests/skills/run-skill-pressure-tests.sh --fast --timeout 900` passed:
  15 passed, 0 failed. The child Codex sessions emitted Slack MCP authorization
  noise, but all pressure scenario assertions passed.
- `claude plugin validate .` passed.
- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed the local
  Codex plugin cache to `1.6.8`.
- `codex plugin list --marketplace ai-tools --available --json` reported
  `shravan-dev-workflow` installed and enabled at `1.6.8`.
- After pushing `master`, `claude plugin update shravan-dev-workflow@ai-tools`
  updated the user-scope Claude plugin from `1.6.3` to `1.6.8`; Claude Code
  needs a restart to apply the refreshed plugin.
- `validate_plugin.py` and `quick_validate.py` were attempted from the installed
  system skill/plugin validators. They require `PyYAML`; the local Python lacks
  it, and `uv run --with pyyaml ...` could not fetch it because
  `files.pythonhosted.org` connections were refused.
