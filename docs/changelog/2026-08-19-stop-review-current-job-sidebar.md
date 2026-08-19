# 2026-08-19 Stop-review current-job vs sidebar

## What changed

- Classifier prompt now treats the latest user turn as the current job unless it is a sidebar. A new primary request (explain, storyboard, discuss/wait) replaces earlier implement work.
- Asking follow-up questions after finishing that request is `stop_ok`. Fake permission-to-continue on already-ordered work stays `continue_work`.
- Session eval gold labels for Vite discussion and Atom-deviation Q&A are `stop_ok`.

## Source of truth

`agent-scripts/stop-review/classifier-prompt.md`

## Files touched

- `agent-scripts/stop-review/classifier-prompt.md`
- `agent-scripts/stop-review/tests/eval_cases.jsonl`
- `docs/changelog/2026-08-19-stop-review-current-job-sidebar.md`
- `docs/changelog/README.md`

## Validation

- Window unit tests: 14/14.
- Luna session evals: 10/10 after prompt + gold relabel.
- Live chezmoi wrapper already execs this tree.

## refresh/reinstall

Not a plugin. Wrapper path unchanged.
