# Reconcile Backlog

Use this when old improvement plans exist.

## Receipt Verdicts

- `ready`: the plan's claims, paths, and proof gates remain current.
- `needs-refresh`: repo drift changed paths, commands, or task order.
- `blocked`: a named dependency prevents current use.
- `rejected`: the plan is obsolete, duplicate, already satisfied, or no longer valuable.

These verdicts live only in a separate current-state reconciliation receipt. They never replace or mutate the canonical `draft | revision-requested | blocked` planning result.

## Reconcile Loop

1. Read the plan and its planned-at SHA.
2. Inspect current git state and changed target files.
3. Re-run only read-only evidence checks.
4. Return the separate current-state receipt while preserving the plan record and approval record unchanged.
5. IF correction is required, route it to the recorded originating planner with the exact requested correction. The planner may create a corrected plan at a new path; reconciliation never edits the old completed plan in place.
6. Do not implement while reconciling.

Report stale assumptions explicitly instead of silently refreshing them. When no corrected completed plan exists, do not fabricate one.
