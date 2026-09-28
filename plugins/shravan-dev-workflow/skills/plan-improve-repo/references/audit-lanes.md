# Audit Categories

Use these categories to structure broad repo audits. They are coverage dimensions: the parent owns each one, keeps synthesis, and verifies every accepted candidate against current source.

Delegation happens by evidence unit, never by category. After recon, the parent may cut a selected category into independently bounded units: one owner, one question, pinned paths or commands. A unit that passes Workhorse fit (`../../manage-agents/references/model-catalog.md`) goes to a Workhorse 🛠️ Worker through `manage-agents` with the job pins (`../../manage-agents/references/agent-job-packet.md`); a unit that fails fit is re-cut or stays in-parent, and leaves the Workhorse tier only with a recorded reason (Leaving the Workhorse tier in the catalog). A security or architecture category as a whole usually leaves the approach open, so it is not itself a Workhorse unit. Agent availability, `deep`, or category count does not justify a cut. A delegated unit stays read-only and returns candidate evidence only.

## Evidence Unit Packet

Fill this for each unit, alongside the job pins (output file, VERIFY, TIMEBOX, REPORT).

```text
You are a read-only improvement-audit evidence unit.
Do not edit files, stage changes, commit, or run mutating commands.

Repo: <absolute path>
Category: <the category this unit covers part of>
Question: <one bounded audit question, one owner>
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
- null result, if nothing was found, with what was searched
- coverage limit: what this unit did not inspect
```

## Audit Categories

- `correctness-behavior`: bugs, broken invariants, edge cases, contract drift.
- `security-boundary`: auth, secrets, parsing, filesystem, network, subprocess, plugin, MCP, CI, package-script, or agent trust-boundary issues.
- `tests-proof`: missing regression coverage, weak proof gates, brittle tests.
- `architecture-maintainability`: ownership confusion, duplicated logic, overgrown files, unstable abstractions.
- `performance-reliability`: slow paths, retries, cleanup, partial failure, concurrency, observability.
- `dx-tooling`: confusing scripts, validation friction, generated output drift.
- `docs-onboarding`: README/AGENTS/runbook drift that blocks future agents or maintainers.

The parent owns every category. Do not turn the category list into a swarm.

## Flow Selection

- `quick`: inspect correctness, tests-proof, and one obvious project-specific category.
- `deep`: inspect all categories that match the repo.
- `focus`: inspect only the requested category plus correctness or tests-proof if they are needed to prove the result.
- `branch`: audit changed files first, then inspect adjacent tests and ownership boundaries.

## Category Pass Completion

For every selected category, return the inspected source anchors, either an evidence-backed candidate or an explicit null result, and the coverage limit. When units were cut from the category, combine each verified unit return (anchors, candidates or null result, limits) with the parent's own inspection into these three returns. The category pass is complete when every selected category has those three returns and the parent can begin candidate vetting without guessing what was inspected or omitted.
