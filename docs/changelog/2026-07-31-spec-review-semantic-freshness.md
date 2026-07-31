# 2026-07-31 — Spec/program review semantic freshness

Plugin: `shravan-dev-workflow` 1.7.3

This release supersedes the exact-digest planning gate and any-edit review invalidation documented by the 1.7.0 routing cutover. Historical changelog entries remain unchanged as release history.

## User-visible behavior

- Review packets and results still record the exact snapshot inspected, but snapshot identifiers are process metadata and no longer belong in durable requirements, specification, or program-design prose.
- A parent semantic-diff check now decides freshness after edits. Semantic changes rerun the affected mode coverage and only focused lanes whose predicates are affected. Formatting, link, review-metadata, typo-only, and other non-semantic edits reuse existing coverage without model reviewer dispatch.
- Planning admission now requires semantically current pair-ready coverage instead of exact byte equality. Downstream artifacts are never edited merely to mirror upstream hashes, digests, versions, or snapshot metadata.
- Active callers and routing docs were cut over together: `spec-design`, `program-design`, `spec-program-review`, `skills-creation`, `spec-handoff`, `plan-creation-swarm`, `plan-improve-repo`, `orchestrator-goal`, `research-swarm`, `discuss-clarify-mental-models`, plugin trigger evals, README, and AGENTS guidance.

## Validation

- Existing Vitest unit suite: 7 files and 33 tests passed.
- TypeScript typecheck: passed with zero errors.
- Codex `skill-creator` quick validation: all 10 changed skill folders passed through an isolated PyYAML environment.
- `claude plugin validate .`: passed.
- `codex plugin list --marketplace ai-tools --available --json`: command passed and confirmed the installed cache remains at 1.7.2, as expected because refresh is deferred.
- Model pressure tests: not run; explicitly deferred for this urgent correction.

## Refresh status

Installed Codex and Claude caches were not refreshed. This PR changes source and marketplace metadata only.
