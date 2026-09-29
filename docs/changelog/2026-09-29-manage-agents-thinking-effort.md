# 2026-09-29 manage-agents Thinking Effort

`shravan-dev-workflow` 2.69.0.

- `manage-agents` now names its role-table column `Thinking Effort` and treats each cell as the allowed value or inclusive range. A single value permits only that value.
- The shared 🛠️ Worker / 🐒 Sidekick Claude Opus range is `medium to xhigh`. Other model values and role criteria stay as they were.
- A pressure scenario covers Opus medium and rejects a lower unlisted Operator effort.

Validation: skills unit tests 123/123, typecheck, Codex skill quick validation, `claude plugin validate .`, and `git diff --check` passed. The live pressure run is pending: the current ACP adapter rejected the configured `reasoning_effort` after the test runner's default model was unavailable. Codex and Claude installed caches were not refreshed; refresh follows the post-push or release step.
