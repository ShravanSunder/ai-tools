# 2026-08-23 Stop-review classifier prefix

## What changed

- Continue `reason` injected into the main agent is prefixed with `From Stop-review classifier agent:` and a newline, then the Luna order.
- Extractor still skips that envelope so it does not become a later USER TURN.

## Source of truth

`agent-scripts/stop-review/stop-review-hook.sh`

## Files touched

- `agent-scripts/stop-review/stop-review-hook.sh`
- `agent-scripts/stop-review/extract_stop_review_window.py`
- `agent-scripts/stop-review/tests/test_extract_stop_review_window.py`
- `docs/changelog/2026-08-23-stop-review-classifier-prefix.md`
- `docs/changelog/README.md`

## Validation

- Window unit tests: 15/15.

## refresh/reinstall

Not a plugin. Live wrapper already execs this tree.
