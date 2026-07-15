# Skill Pressure Judge System

- Marketplace plugin: `shravan-dev-workflow`
- Plugin version: unchanged (`1.6.54`); the change is repo-owned test infrastructure and does not alter shipped skill behavior.

## User-Visible Changes

- Replaces the legacy pressure runner with one Vitest Evals entrypoint under `tests/test-utils/skill-pressure/` and owner-local scenarios under `tests/<plugin>/<skill>/scenarios/`.
- Requires schema-v3 scenarios to declare `improvement` or `non_regression`, preserving honest passing controls instead of relabeling them as baseline failures.
- Runs every authoritative subject and semantic judge through ACPX. Subjects and standard review default to Codex Luna/high; high-risk blind review requires provider-verified Claude Opus/xhigh.
- Runs three baseline subjects concurrently, then three treatment subjects concurrently, before semantic review.
- Installs the selected skill project-locally into fresh disposable Git repositories and receipts source, prompt, fixture, runtime, session, usage, cleanup, and pair identity.
- Evaluates complete named-artifact content before bounding persisted excerpts, fails closed above the content ceiling, and gives deterministic facts precedence over semantic approval.
- Adds scenario-declared write paths and tool allowlists for artifact-producing pressure tests, with deterministic failure for writes outside the declared repository paths.
- Reports exact selected, skipped, invalid, executed, passed, behavior-failed, inconclusive, infrastructure-error, and not-evaluated counts through bounded per-scenario and aggregate receipts.
- Persists reviewer command/session lifecycle evidence, treats incomplete cleanup as infrastructure failure, and verifies the full receipt tree before aggregation.
- Stores one owner-local current baseline receipt per calibrated scenario and replaces it in place; raw attempt, cleanup, repetition, review, and transcript evidence remains ignored under `tmp/`.
- Separates scenario execution from parent acceptance, promotion, and demotion so the runner cannot self-issue or revoke release authority.
- Adds an explicit parent-accepted aggregation step: gate execution first writes immutable unaccepted evidence, `accept-run` binds the parent decision to each exact scenario run, and `aggregate-accepted-run` revalidates those receipts into the release-authoritative aggregate.
- Exposes stable unit, integration, migration, schema, focused behavior, standard, high-risk, and checked smoke commands.

## Scope

- `tests/test-utils/skill-pressure/`
- Owner-local pressure scenarios under `tests/<plugin>/<skill>/scenarios/`
- `docs/specs/2026-07-13-skill-pressure-behavior-evaluation-system/2026-07-13-skill-pressure-behavior-evaluation-system.md`
- `docs/plans/2026-07-13-skill-pressure-judge-system-implementation.md`
- `docs/changelog/README.md`

## Validation

- Local gates: schema `1/1`, unit `308/308`, mutation `33/33`, authority `57/57`, integration `42/42`, smoke `42/42`, migration `4/4`, TypeScript typecheck, and `git diff --check` passed.
- Prior focused Luna/xhigh/five-repetition results are stale after the policy and master-source cutover and are not release authority.
- Fresh Luna/high `3 + 3` improvement and non-regression controls passed and replaced their owner-local current baseline receipts in place. The non-regression semantic reviewer classified all six repetitions as passing.
- A security/cache-boundary high-risk probe verified six Luna/high subjects plus Claude Opus/xhigh review, but its no-skill baseline passed `3/3`; the runner truthfully reduced it to `not_evaluated` and left it diagnostic instead of fabricating improvement.
- The replacement high-risk gate, `orchestrator-goal-default-pr-ready-terminal`, produced baseline failure `3/3` and treatment success `3/3`, with six verified Luna/high subjects, verified Claude Opus/xhigh review, and zero retries.
- The final standard gate used 14 model prompts and 14 ACPX commands across two scenarios, observed 467,093 tokens, and had zero retries. Its parent-accepted aggregate granted release authority to `2/2` scenarios with zero incomplete accounting or untraced requirements (`tmp/skill-pressure-evals/1784115055679-45398/aggregate-receipt.parent-accepted.json`).
- The final high-risk gate used 7 model prompts and 10 ACPX commands, observed 284,032 tokens, and had zero retries. Its parent-accepted aggregate granted release authority to `1/1` scenario with zero incomplete accounting or untraced requirements (`tmp/skill-pressure-evals/1784115055678-45397/aggregate-receipt.parent-accepted.json`).
- The complete 110-scenario model suite was not run; the accepted proof scope is the deterministic corpus plus the three focused live controls above.

## Refresh Status

- Codex installed-cache refresh: not run; not authorized and not required for runner proof.
- Claude installed-cache refresh: not run; not authorized and not required for runner proof.
