# Local Branch State

Check local state before push, readiness, or merge.

## Required Checks

Run or equivalent:

```sh
git status --short
git branch --show-current
git rev-parse HEAD
git rev-parse --abbrev-ref --symbolic-full-name @{u}
```

Then compare local `HEAD` to the PR head SHA from GitHub.

## Gates

- Dirty worktree: not ready until committed, intentionally left out, or
  explicitly resolved by the user.
- Detached HEAD: not ready until branch/PR mapping is clear.
- Unpushed commits: not ready until pushed or intentionally excluded.
- Missing upstream: push/create PR intentionally; do not guess.
- Local `HEAD` differs from PR head: not ready unless the user explicitly
  decides to leave local-only work out of the PR.

Preserve worktrees after PR creation/update. Do not run destructive cleanup
unless the user explicitly requested it.
