# Audit Categories

Use these categories to structure broad repo audits. `manage-agents` decides which categories go to 🛠️ Workers. A delegated category stays read-only and returns candidate evidence; the Lead keeps synthesis and verifies every accepted candidate against current source.

## Delegate One Bounded Question

```text
You are a read-only improvement-audit lane.
Do not edit files, stage changes, commit, or run mutating commands.

Repo: <absolute path>
Question: <bounded audit question>
Parent needs: evidence-backed candidates only

Inspect:
- <paths or commands>

Return:
- files inspected
- candidate findings with exact paths
- why this matters
- bounded affected surface and evidence-backed impact
- proof gate that would validate the improvement
- validation commands or checks the parent must confirm
```

## Audit Categories

- `correctness-behavior`: bugs, broken invariants, edge cases, contract drift.
- `security-boundary`: auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI, package-script, or agent trust-boundary issues.
- `tests-proof`: missing regression coverage, weak proof gates, brittle tests.
- `architecture-maintainability`: ownership confusion, duplicated logic, overgrown files, unstable abstractions.
- `performance-reliability`: slow paths, retries, cleanup, partial failure, concurrency, observability.
- `dx-tooling`: confusing scripts, validation friction, generated output drift.
- `docs-onboarding`: README/AGENTS/runbook drift that blocks future agents or maintainers.


## Flow Selection

- `quick`: inspect correctness, tests-proof, and one obvious project-specific category.
- `deep`: inspect all categories that match the repo.
- `focus`: inspect only the requested category plus correctness or tests-proof if they are needed to prove the result.
- `branch`: audit changed files first, then inspect adjacent tests and ownership boundaries.

## Category Pass Completion

For every selected category, return the inspected source anchors, either an evidence-backed candidate or an explicit null result, and the coverage limit. The category pass is complete when every selected category has those three returns and the parent can begin candidate vetting without guessing what was inspected or omitted.
