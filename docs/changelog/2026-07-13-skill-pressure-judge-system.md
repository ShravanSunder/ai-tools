# Skill Pressure Judge System

- Marketplace plugin: `shravan-dev-workflow`
- Plugin version: unchanged (`1.6.51`); the change is repo-owned test infrastructure and does not alter shipped skill behavior.

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
- Exposes stable unit, integration, migration, schema, focused behavior, standard, high-risk, and checked smoke commands.

## Scope

- `tests/test-utils/skill-pressure/`
- Owner-local pressure scenarios under `tests/<plugin>/<skill>/scenarios/`
- `docs/specs/2026-07-10-skill-pressure-judge-system-spec.md`
- `docs/plans/2026-07-13-skill-pressure-judge-system-implementation.md`
- `docs/changelog/README.md`

## Validation

- Local gates: 42 unit files / 285 tests, 3 integration files / 41 tests, 6 authority files / 64 tests, 3 smoke files / 36 tests, 3 mutation files / 28 tests, 1 migration file / 4 tests, schema parity, TypeScript typecheck, and `git diff --check` passed.
- Prior focused Luna/xhigh/five-repetition results are stale after the policy and master-source cutover and are not release authority.
- Fresh Luna/high three-repetition focused results will be recorded in the PR proof after the final implementation head is fixed.
- High-risk and complete suite results are recorded in the final PR proof rather than asserted before those gates complete.

## Refresh Status

- Codex installed-cache refresh: not run; not authorized and not required for runner proof.
- Claude installed-cache refresh: not run; not authorized and not required for runner proof.
