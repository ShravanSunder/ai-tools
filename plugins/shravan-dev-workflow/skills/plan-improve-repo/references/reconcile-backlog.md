# Reconcile Backlog

Use this when old improvement plans exist.

## Status Values

- `proposed`: still looks valid, not started.
- `needs-refresh`: repo drift changed paths, commands, or task order.
- `done`: current code already satisfies the plan's proof gate.
- `blocked`: still valuable but blocked by a named dependency.
- `rejected`: obsolete, superseded, or no longer worth doing.

## Reconcile Loop

1. Read the plan and its planned-at SHA.
2. Inspect current git state and changed target files.
3. Re-run only read-only evidence checks.
4. Update the plan status or write a replacement plan.
5. Do not implement while reconciling.

Report stale assumptions explicitly instead of silently refreshing them.
