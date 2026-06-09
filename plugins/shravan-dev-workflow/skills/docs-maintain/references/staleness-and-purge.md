# Staleness And Purge

Use this before deleting, archiving, or rewriting old plans/specs.

## Classification

- `current`: still describes the active architecture or executable plan.
- `substrate`: not the current plan, but contains accepted ideas to preserve.
- `superseded`: replaced by a newer doc with the same scope.
- `obsolete`: no longer matches current code or direction and has no useful decisions.
- `unknown`: insufficient evidence.
- `historical`: useful record, but must not be linked as current.

## Proposal Shape

```text
Candidate:
<path>

Classification:
<current / substrate / superseded / obsolete / unknown>

Evidence:
<code/docs/session evidence>

Proposed action:
<keep / link / extract decisions / archive / delete>

Preserve:
<decisions or links that should survive>
```

## Safety Rules

- Do not delete old ADRs; supersede them.
- Do not delete old plans/specs just because they are old.
- Do not infer status from filename date alone.
- Do not rewrite history to hide uncertainty; label it.
- Do not let stale docs drive code without user confirmation.
- Do not keep a stale doc linked as current.
- Do not replay stale branch shape; replay only useful decisions onto current code/docs.

## Common Failure Modes

- A newer plan displaces the actual execution plan because it looks fresher.
- A stale branch doc is replayed without checking current `main`.
- `AGENTS.md` grows into a runbook and becomes hard for agents to load.
- README starts carrying internal agent workflow details instead of human orientation.
- Ticket text duplicates architecture docs and then drifts.
- A newer design note displaces the actual executable plan because it looks fresher.
