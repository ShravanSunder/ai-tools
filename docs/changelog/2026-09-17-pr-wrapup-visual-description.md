# Shravan Dev Workflow 2.14.3

- Wrap-up now publishes a reviewer-facing PR body: `## Why the change`, `## Special things to note`, `## Change outline`, with only the views the current diff needs.
- A Mini Worker drafts that body from `references/pr-description.md` (HumanLayer-style template plus `references/pr-outline-views.md` bullets and fences); the parent mechanical-verifies; a Mini Operator runs `gh pr edit --body-file`.
- Missing independent-review coverage is no longer a wrap-up ready gate. Fresh bug-finding still routes to `implementation-review`.
- Ready still requires green checks, threads, mergeability, HEAD, and a current public-safe template body — not a file-list changelog.
- Affected: `implementation-pr-wrapup` skill, merge/monitor references, plugin README, Codex/Claude/Cursor manifests and marketplace metadata `2.14.3`.
- Pressure: inverted `missing-implementation-review`; added file-list, choose-to-views, parent-inline-write, and ready-blocked-on-file-list-body scenarios.
- Static validation recorded in-session; pressure evals and cache refresh are not claimed.
