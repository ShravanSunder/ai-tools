# 2026-06-12 Debug Investigation Background Monitoring

## Plugin

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.15`

## Why

Long-running debugging sessions need cheap, cancellable monitoring without
burning model tokens or leaking operational secrets. The previous
`debug-investigation` skill could build a bug packet and resist unsafe restarts,
but it did not teach the Claude/Codex-style background watcher contract:
deterministic machine loop, compact state, harness job visibility, bounded model
adjudication, and redacted secret handling.

## User-visible changes

- `debug-investigation` now routes long-running monitor/watch requests through a
  progressive reference: `references/background-monitoring.md`.
- The reference defines the monitor split: machine watches; model adjudicates.
- Watchers should use the agent harness background job system when available so
  status, output preview, runtime, and cancellation are visible.
- Monitor state uses `monitor.json`, `events.jsonl`, bounded redacted
  `stdout.log` / `stderr.log`, `watcher.pid`, and `stop.requested`.
- 1Password secrets use `op://`, `op run`, `op inject`, or ephemeral env
  handling; secret values are not persisted. Unavoidable temp files require
  strict permissions such as `chmod 600` and cleanup traps.
- Investigation monitors remain read-only. Restarting jobs or mutating infra
  requires explicit fix/ops approval.
- Added a pressure scenario for long-running background monitoring and updated
  the scenario matrix.

## Affected files

- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/debug-investigation/references/background-monitoring.md`
- `tests/skills/pressure-scenarios/debug-investigation-background-monitoring.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Evidence

See [reference evidence](references/2026-06-12-debug-investigation-background-monitoring.md).

## Validation

- RED baseline, installed `shravan-dev-workflow` `1.6.14`:
  `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario debug-investigation-background-monitoring --timeout 900`
  failed as expected.
- Refreshed Codex plugin cache:
  `codex plugin add shravan-dev-workflow@ai-tools --json` installed `1.6.15`.
- Targeted GREEN, installed `shravan-dev-workflow` `1.6.15`:
  `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario debug-investigation-background-monitoring --timeout 900`
  passed 12/12 proof assertions.
- Existing debug regression:
  `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario debug-investigation-no-blind-fix --timeout 900`
  passed.
- Full fast pressure suite:
  `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --timeout 900`
  passed 23/23 scenarios. Runner logs:
  `tmp/skill-pressure-tests/runner-20260612T185557Z`.
- Static reference term check for required monitor, secret, state, and stop
  vocabulary: passed.
- `jq empty plugins/shravan-dev-workflow/.codex-plugin/plugin.json plugins/shravan-dev-workflow/.claude-plugin/plugin.json .claude-plugin/marketplace.json`:
  passed.
- `git diff --check`: passed.
- `claude plugin validate .`: passed.
- `codex plugin list --marketplace ai-tools --available --json`: passed and
  reported installed `shravan-dev-workflow` `1.6.15`.
- `validate_plugin.py` and `quick_validate.py`: not run; no commands found on
  `PATH`.

## Refresh status

- Codex plugin refreshed locally to `1.6.15`.
- Claude marketplace metadata updated to `1.6.15`; validation recorded in the
  release proof.
