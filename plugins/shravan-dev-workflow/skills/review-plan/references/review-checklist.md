# Plan Review Checklist

Load this for large, risky, stale, or implementation-facing plans.

## Coverage

- Exact target file or packet identified.
- `wc -l` captured for plan files.
- Chunk coverage has no gaps.
- Tail chunk read.
- Adjacent plans/worktrees explicitly excluded when out of scope.

## Grounding

- Current branch/base checked when branch freshness matters.
- Main package/module boundaries inspected.
- Referenced APIs, methods, schemas, and tests verified in live files.
- External docs checked only when current behavior depends on them.

## Plan Quality

- No placeholders: TODO, TBD, "add tests", "handle edge cases", "similar to above".
- Tasks have exact files, commands, expected output, and acceptance criteria.
- Execution order is dependency-safe.
- Validation gates prove behavior, not only formatting.
- Scope is narrow enough for one execution pass or clearly split.

## Adversarial Questions

- What breaks if the branch is stale?
- What claim is copied from an old design?
- What is under-specified enough for two agents to implement differently?
- What code path or API name is assumed but not real?
- What test would fail if the plan is wrong?
- What can an implementer overbuild because the boundary is vague?
- What needs a user decision before editing?

## Report Discipline

- Separate what the plan says from what the repo proves.
- Rank findings by execution risk.
- Ask questions only when the answer changes implementation.
- Keep the review read-only.
