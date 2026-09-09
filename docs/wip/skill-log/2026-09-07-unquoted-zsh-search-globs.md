# Unquoted search globs abort zsh commands

- Observed: 2026-09-07
- Status: captured
- Skill/workflow: source investigation using Codex exec_command; no skill defect established
- Task context: CI diagnosis and feature-removal source inspection
- Expected behavior: Pass glob patterns literally to ripgrep and inspect all command results.
- Observed behavior: Unquoted patterns were expanded by zsh; unmatched patterns aborted searches before ripgrep ran.
- Evidence: `-g virtio*.ts` produced `zsh: no matches found: virtio*.ts`; `scripts/*vitest*` and a guessed `*system-config*` path produced the same class of error. Quoting ripgrep's glob argument and discovering paths with `rg --files` allowed the intended lookup.
- Recurrence: At least three distinct command shapes in one task; the glob mistake recurred after an initial correction.
- Impact: Wasted lookups and incomplete batched output; no source mutation or data loss from these commands.
- Suspected cause: Agent command construction treated ripgrep globs as shell globs and guessed paths before inventory.
- Follow-up: Keep patterns quoted, discover unknown paths first, and preserve per-command errors when batching. Logging does not authorize a skill change.
