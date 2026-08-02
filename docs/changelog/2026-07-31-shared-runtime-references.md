# 2026-07-31 Shared Runtime References

Plugin: `shravan-dev-workflow` 1.7.2

## What Changed

- Replaced the ambiguous plugin-level `references/` bucket with `shared-references/` for model-readable procedures used by multiple active skills.
- Moved the review-feedback procedure to the specific runtime name `shared-references/code-review-feedback-handling.md` and cut over both `implementation-review-swarm` and `implementation-pr-wrapup` together.
- Deleted the unused skill-local forwarding pointer and the obsolete source-inspiration compatibility pointer. The maintained source-inspiration catalog remains under `plugins/shravan-dev-workflow/docs/`.
- Deleted the README-linked manual trigger/routing matrix after confirming that no Vitest or other automated harness discovered, parsed, or executed it. This intentionally removes the manual matrix without claiming equivalent automated replacement coverage; future skill-selection eval work is deferred to a separate worktree.
- Added the shared-reference admission and naming boundary to `AGENTS.md`: shared runtime procedures require multiple active consumers and specific domain/action names, while skill-local contracts, maintainer docs, and repository tests retain their own homes.

## Documentation Reconciliation

- Updated current runtime call sites, plugin README resources, AGENTS guidance, and post-refresh smoke guidance.
- Inspected repository-wide occurrences of the retired paths. Historical changelogs, plans, specs, and retired-skill records remain unchanged because they describe earlier source layouts rather than current routing.

## Validation

- Both changed skills passed the Codex skill quick validator.
- `claude plugin validate .` passed.
- Four JSON manifests and 22 active OpenAI YAML metadata files parsed.
- The pressure-harness unit suite passed: 7 test files and 33 tests. TypeScript validation passed with pnpm 11.8.0.
- Both active skill-relative paths resolve to `shared-references/code-review-feedback-handling.md`; current runtime and maintainer surfaces contain no old plugin-level reference paths.
- Full model pressure tests were not run by user direction. The shared feedback-ownership clarification has static and reviewer evidence only, and skill-selection eval work is deferred to a separate worktree; neither is presented as behavioral proof.

## Refresh Status

- Source metadata targets `1.7.2`.
- No Codex or Claude refresh/reinstall was performed.
- The post-refresh shared-reference smoke check remains pending.
