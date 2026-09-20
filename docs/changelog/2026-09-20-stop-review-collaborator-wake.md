# 2026-09-20 Stop-review collaborator wake

## What changed

- Stop-review treats a CLI/MCP wake as a wait only when `[last]` reports it saved/verified/active. Tool calls are not in the window.
- When remaining implement/prove is on a named collaborator and no saved wake is reported, `continue_work` orders setting that wake and stopping, not resume implement/prove.
- `manage-agents` Waiting: set one authorized `agent-collaboration` wake (unless a listener is armed) and say it is saved/active before yielding.

## Source of truth

`agent-scripts/stop-review/classifier-prompt.md` and `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`

## Files touched

- `agent-scripts/stop-review/classifier-prompt.md`, `tests/eval_cases.jsonl`, `tests/fixtures/nav-1017-collaborator-wait.window.txt`, `tests/fixtures/nav-1019-collaborator-wake.window.txt`
- `plugins/shravan-dev-workflow` `2.18.0` (`manage-agents`, plugin/marketplace manifests)
- `docs/changelog/2026-09-20-stop-review-collaborator-wake.md`

## Validation

- Window unit tests: 18/18.
- Targeted Luna: `nav-1017` continue_work with set-wake reason; `nav-1019`/`router-2142` stop_ok; `router-1357`/`oauth-1003`/`control-1315` stay continue_work.
- Full Luna 30/32. Two misses (`router-1353`, `review-0618`) also flake on the pre-change prompt.

## refresh/reinstall

Stop-review is not a plugin. Re-run `bash agent-scripts/stop-review/deploy-home-hook.sh` after merge for the live Codex Stop hook. Reinstall `shravan-dev-workflow` 2.18.0 for the Waiting wording.
