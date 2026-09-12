# 2026-09-11 Stop-review scheduled-wake wait

## What changed

- Classifier now treats a user-authorized scheduled wake that [last] has already saved or verified as `stop_ok`.
- Retrieving later is the wait. Unfinished review or proof does not force `continue_work` when the next check is gated by that wake.
- Deferred-feature “wake on event can be a follow up” with docs still unreviewed now stays `continue_work`.

## Source of truth

`agent-scripts/stop-review/classifier-prompt.md`

## Files touched

- `agent-scripts/stop-review/classifier-prompt.md`
- `agent-scripts/stop-review/tests/eval_cases.jsonl`
- `agent-scripts/stop-review/tests/fixtures/router-2142-scheduled-wake-wait.window.txt`
- `docs/changelog/2026-09-11-stop-review-scheduled-wake-wait.md`
- `docs/changelog/README.md`

## Validation

- Window unit tests: 18/18.
- Targeted Luna: `router-2142` stop_ok after RED continue_work; `router-1357` and `oauth-1405` stay continue_work.
- Full Luna suite 26/30. The four misses also fail or flake on the pre-change prompt.

## refresh/reinstall

Not a plugin. Home runtime is a deployed copy; re-run `bash agent-scripts/stop-review/deploy-home-hook.sh` after merge if the live Codex Stop hook should pick this up.
