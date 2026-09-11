# 2026-09-11 Stop-review home deploy

## What changed

- Added `agent-scripts/stop-review/deploy-home-hook.sh` to copy the Stop-review runtime into `~/.agents/stop-review`.
- Codex Stop hooks cannot read `~/dev/ai-tools`. The chezmoi wrapper must call the local deploy copy with `--run-hook`.
- `--run-hook` only execs the subfolder classifier. It refuses the chezmoi wrapper and any path that would recurse. Luna still uses isolated `~/.codex-reviewer` with no `--profile`.

## Source of truth

`agent-scripts/stop-review/` remains the classifier source. Home runtime is a deployed copy, not a live exec of the repo tree.

## Files touched

- `agent-scripts/stop-review/deploy-home-hook.sh`
- `agent-scripts/stop-review/tests/test_deploy_home_hook.sh`
- `AGENTS.md`
- `docs/changelog/2026-09-11-stop-review-home-deploy.md`
- `docs/changelog/README.md`

## Validation

- `bash agent-scripts/stop-review/tests/test_deploy_home_hook.sh`
- `bash agent-scripts/stop-review/deploy-home-hook.sh` (local home install)

## refresh/reinstall

Not a plugin. Re-run `deploy-home-hook.sh` after classifier source changes. Devfiles wrapper must exec the local deploy script, not `~/dev/ai-tools`.
