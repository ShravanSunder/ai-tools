# 2026-08-21 Stop-review five-turn window and design continue

## What changed

- Conversation window keeps the last 5 user turns. Each user turn is capped at 400 tokens. `[last]` stays 1600 tokens. Other assistant lines stay 200 characters. Tool calls remain excluded.
- Classifier names job mode. Design `continue_work` reasons must resume design/discussion and must not order implementation. Codex injects `reason` as the next user prompt.

## Source of truth

`agent-scripts/stop-review/classifier-prompt.md`
`agent-scripts/stop-review/extract_stop_review_window.py`

## Files touched

- `agent-scripts/stop-review/extract_stop_review_window.py`
- `agent-scripts/stop-review/tests/test_extract_stop_review_window.py`
- `agent-scripts/stop-review/classifier-prompt.md`
- `agent-scripts/stop-review/output-schema.json`
- `agent-scripts/stop-review/stop-review-hook.sh`
- `docs/changelog/2026-08-21-stop-review-five-turn-design-continue.md`
- `docs/changelog/README.md`

## Validation

- Window unit tests: 15/15.

## refresh/reinstall

Not a plugin. Live wrapper already execs this tree.
