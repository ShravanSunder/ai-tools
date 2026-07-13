# Merge Gates

Before saying "ready", "merge-clear", "green", "fixed", or "complete", name the fresh command/API query that proves the claim and compare it to this gate list.

## Ready-To-Merge Gates

- Local branch/worktree state inspected.
- Local `HEAD` equals PR head SHA, unless the user explicitly leaves local-only work out.
- Branch is pushed.
- PR exists and is not draft unless draft is intended.
- PR `baseRefName` matches the user's intended base branch, or the repo-default base when no specific base was requested.
- Required checks are green from a fresh query.
- Comments and review threads have been inspected from fresh GitHub state.
- Unresolved threads are fixed and resolved, rejected with evidence and replied to, or explicitly left open by user decision.
- Mergeability is clean, not blocked or conflicting.
- One quiet poll passed after all gates first became clear.
- Final re-fetch confirms checks, comments, threads, mergeability, and head SHA.

If the PR base branch is wrong or uncertain, stop and ask or update the PR base before claiming readiness.

## Authorization Gate

Ready-to-merge is not allowed-to-merge. Merge only when:

- the user explicitly says to merge now; or
- the user previously gave an exact condition such as "merge when green and comments are handled", and every condition is satisfied by fresh evidence.
