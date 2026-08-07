# Audit Categories

Use these categories to structure broad repo audits. The parent inspects them inline by default, keeps synthesis, and verifies every accepted candidate against current source.

Delegation is conditional, never a flow default. IF the user explicitly requests delegation, or inspected source reveals one concrete independently verifiable evidence question whose bounded handoff materially improves coverage, use `manage-agents` for that question. Agent availability, `deep`, or category count does not satisfy the predicate. A delegated question stays read-only and returns candidate evidence only.

## Lane Packet

```text
You are a read-only improvement-audit lane.
Do not edit files, stage changes, commit, or run mutating commands.

Repo: <absolute path>
Lane: <lane name>
Question: <bounded audit question>
Parent needs: evidence-backed candidates only
Flow: quick | deep | focus | branch

Inspect:
- <paths or commands>

Return:
- lane name
- files inspected
- candidate findings with exact paths
- why this matters
- smallest useful plan scope
- proof gate that would validate the improvement
- validation commands or checks the parent must confirm
- confidence: high | medium | low
```

## Audit Categories

- `correctness-behavior`: bugs, broken invariants, edge cases, contract drift.
- `security-boundary`: auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI, package-script, or agent trust-boundary issues.
- `tests-proof`: missing regression coverage, weak proof gates, brittle tests.
- `architecture-maintainability`: ownership confusion, duplicated logic, overgrown files, unstable abstractions.
- `performance-reliability`: slow paths, retries, cleanup, partial failure, concurrency, observability.
- `dx-tooling`: confusing scripts, validation friction, generated output drift.
- `docs-onboarding`: README/AGENTS/runbook drift that blocks future agents or maintainers.

Inspect these in-parent. Do not turn the category list into a default swarm.

## Flow Selection

- `quick`: inspect correctness, tests-proof, and one obvious project-specific category.
- `deep`: inspect all categories that match the repo.
- `focus`: inspect only the requested category plus correctness or tests-proof if they are needed to prove the result.
- `branch`: audit changed files first, then inspect adjacent tests and ownership boundaries.

## Category Pass Completion

For every selected category, return the inspected source anchors, either an evidence-backed candidate or an explicit null result, and the coverage limit. The category pass is complete when every selected category has those three returns and the parent can begin candidate vetting without guessing what was inspected or omitted.
