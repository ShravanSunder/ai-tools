# Audit Lanes

Use these lanes for broad repo audits. Keep each lane read-only and bounded.

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

## Default Lanes

- `correctness-behavior`: bugs, broken invariants, edge cases, contract drift.
- `security-boundary`: auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI, package-script, or agent trust-boundary issues.
- `tests-proof`: missing regression coverage, weak proof gates, brittle tests.
- `architecture-maintainability`: ownership confusion, duplicated logic, overgrown files, unstable abstractions.
- `performance-reliability`: slow paths, retries, cleanup, partial failure, concurrency, observability.
- `dx-tooling`: confusing scripts, validation friction, generated output drift.
- `docs-onboarding`: README/AGENTS/runbook drift that blocks future agents or maintainers.

For small repos, run these locally instead of spawning every lane.

## Flow Selection

- `quick`: run correctness, tests-proof, and one obvious project-specific lane.
- `deep`: run all lanes that match the repo.
- `focus`: run only the requested lane plus correctness or tests-proof if they are needed to prove the result.
- `branch`: audit changed files first, then inspect adjacent tests and ownership boundaries.
