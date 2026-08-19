# 2026-08-19 Stop-review Luna low Fast

## What changed

- Nested Luna classify defaults to `gpt-5.6-luna`, `model_reasoning_effort=low`, and Codex Fast mode (`service_tier=fast`).
- Defaults live in `agent-scripts/stop-review/config.sh`. Env `CODEX_STOP_REVIEW_*` still overrides. `SERVICE_TIER=off` or `default` disables Fast.

## Source of truth

`agent-scripts/stop-review/config.sh`

## Files touched

- `agent-scripts/stop-review/config.sh`
- `agent-scripts/stop-review/stop-review-hook.sh`
- `docs/changelog/2026-08-19-stop-review-luna-low-fast.md`
- `docs/changelog/README.md`

## Validation

- Window unit tests: run in this change.
- Live wrapper smoke: Luna Fast + low returned `continue_work` / Codex `decision: block` in ~5.4s.
- Spark was slower on the same window and was not selected.

## refresh/reinstall

Not a plugin. `~/.agents/stop-review-hook.sh` already execs this tree; no Codex/Claude plugin refresh.
