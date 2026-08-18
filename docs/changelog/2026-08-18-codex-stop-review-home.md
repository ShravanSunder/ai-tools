# 2026-08-18 Codex Stop-review lives in ai-tools

## What changed

- Stop-review (window extractor, Luna prompt/schema, command hook) is now in this repo at `agent-scripts/stop-review/`.
- User and assistant windows have separate token budgets: user text is reserved and not truncated away by a long `[last]` assistant message.
- Chezmoi still owns only a thin `~/.agents/stop-review-hook.sh` that execs this tree. Codex `hooks.json` is unchanged.

## Source of truth

`agent-scripts/stop-review/` in this repo. Not a plugin; not marketplace-cached.

## Files touched

- `agent-scripts/stop-review/stop-review-hook.sh`
- `agent-scripts/stop-review/extract_stop_review_window.py`
- `agent-scripts/stop-review/classifier-prompt.md`
- `agent-scripts/stop-review/output-schema.json`
- `agent-scripts/stop-review/tests/`
- `AGENTS.md`
- `.gitignore`
- `docs/changelog/2026-08-18-codex-stop-review-home.md`
- `docs/changelog/README.md`

## Validation

- `python3 agent-scripts/stop-review/tests/test_extract_stop_review_window.py -v`

## refresh/reinstall

Not a plugin. Personal Codex uses the chezmoi wrapper in `devfiles`.
