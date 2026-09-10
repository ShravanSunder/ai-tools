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

2026-09-08 recurrence: primary source investigation again used unmatched guessed
Swift-path globs in zsh. Searches aborted with `no matches found`; corrected by
discovering filenames and using quoted ripgrep patterns. No mutations occurred
from the failed commands. The observed defect remains agent command construction,
not a confirmed skill implementation defect.

2026-09-09 recurrence: the primary used guessed native app-server and message-test path globs; zsh rejected them before rg ran. Corrected using rg --files. No source effects; this remains an agent command-construction failure.

Further 2026-09-09 recurrence during PR proof diagnosis: the primary again used an unmatched bounded-path glob and guessed nonexistent schema, command, and proof-log filenames despite an explicit discover-first instruction. These reads failed without mutation; subsequent rg --files inventories found the actual paths. At least four concrete guessed-path failures occurred in this continuation. This is an agent instruction-following/command-construction defect; no skill implementation cause established. Required correction remains inventory first, then read exact returned paths, with independent failures inspected before dependent calls.
