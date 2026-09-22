# 2026-09-21 Stop-review JEV default

## What changed

- Codex Stop review classifies with JEV Nouls by default.
- JEV runs through `uv run --no-project --script` with PEP 723 deps and `jev_classifier.py.lock`.
- A JEV crash or unreadable decision falls back to Luna, then fails open if Luna also fails.
- `CODEX_STOP_REVIEW_BACKEND=luna` still forces Luna with no JEV call.

## Source of truth

`agent-scripts/stop-review/config.sh` and `agent-scripts/stop-review/stop-review-hook.sh`

## Files touched

- `agent-scripts/stop-review/config.sh`, `stop-review-hook.sh`, `deploy-home-hook.sh`, `jev_classifier.py`, `jev_classifier.py.lock`, `tests/test_deploy_home_hook.sh`
- `docs/changelog/2026-09-21-stop-review-jev-default.md`

## Validation

- `bash agent-scripts/stop-review/tests/test_deploy_home_hook.sh` → 25 passed
- `bash agent-scripts/stop-review/deploy-home-hook.sh`
- Live classify of `hermes-2013` via deployed `uv run --script` → `continue_work`

## refresh/reinstall

Stop-review is not a plugin. Live Codex uses the home copy from deploy. Requires `uv` on PATH. No plugin reinstall.
