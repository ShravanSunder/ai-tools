# Implementation Writing Tests

## Plugin

- `shravan-dev-workflow` `1.6.44`

## User-visible change

- Added `shravan-dev-workflow:implementation-writing-tests`.
- The new skill owns the testing/proof slice of implementation work: writing,
  changing, auditing, repairing, removing, and reviewing tests as trustworthy
  proof.
- It covers public seams, domain boundaries, critical invariants,
  illegal-state strategy, guard/precondition/assertion points, IO-boundary
  cases, independent oracles, proof-layer definitions, project proof-layer
  overrides, RED/GREEN evidence, property-style checks, weak-test antipatterns,
  existing-test audit, and safe test removal.
- `plan-creation-swarm`, `plan-review-swarm`, `implementation-execute-plan`,
  and `implementation-review-swarm` now route test-proof decisions to the new
  skill instead of duplicating the doctrine.
- `implementation-review-swarm` has a dedicated implementation-writing-tests
  review lane for false-green test proof.

## Affected surfaces

- New skill:
  `plugins/shravan-dev-workflow/skills/implementation-writing-tests/`
- Updated workflow skills:
  `plan-creation-swarm`, `plan-review-swarm`, `implementation-execute-plan`,
  and `implementation-review-swarm`
- Updated pressure scenarios under `tests/skills/pressure-scenarios/`
- Updated plugin manifests, README files, and `AGENTS.md`

## Source adaptation

- Obra SDD, Matt Pocock TDD, and Addy test-engineer materials were used as
  concept inspiration only.
- No full prompt/manual text or upstream examples were copied into the public
  repo.
- New examples are local invented snippets.

## Validation

- Manifest JSON parse passed for `.agents/plugins/marketplace.json`,
  `.claude-plugin/marketplace.json`, and both `shravan-dev-workflow` plugin
  manifests.
- Codex skill quick validation passed for `implementation-writing-tests`,
  `plan-creation-swarm`, `plan-review-swarm`, `implementation-execute-plan`,
  and `implementation-review-swarm`.
- `pnpm --dir tests/skills run test:unit` passed.
- `pnpm --dir tests/skills run typecheck` passed.
- `claude plugin validate .` passed.
- `codex plugin list --marketplace ai-tools --available --json` succeeded, but
  installed `shravan-dev-workflow` still reported `1.6.43` because cache refresh
  was intentionally not run.
- Focused fake-backend pressure scenarios passed for all nine new/changed
  scenarios:
  `implementation-writing-tests-false-proof-antipatterns`,
  `implementation-writing-tests-existing-test-audit`,
  `implementation-writing-tests-project-layer-override`,
  `implementation-writing-tests-stale-proof-freshness-guard`,
  `implementation-writing-tests-invariant-boundary-proof`,
  `plan-creation-swarm-implementation-writing-tests-proof`,
  `plan-review-swarm-implementation-writing-tests-proof`,
  `implementation-execute-plan-implementation-writing-tests-proof`, and
  `implementation-writing-tests-implementation-review-swarm-false-test-proof`.
- Broad fake-backed `tests/skills/run-skill-pressure-tests.sh --fast --serial`
  failed on older unrelated pressure-scenario leaks: 88 passed, 20 failed. All
  `implementation-writing-tests` scenarios passed in that broad run.
- Live Codex pressure proof remains blocked before scenario judgment:
  `AuthorizationRequired` plus Codex usage limit until July 11, 2026 9:49 AM.
  Latest probe artifact:
  `tmp/skill-pressure-evals/2026-07-08T104028363Z-implementation-writing-tests-invariant-boundary-proof/`.
- Evaluator lanes using `skills-creation` returned `ready_with_fixes`; accepted
  same-scope fixes were applied before final validation.

## Refresh status

- Installed Codex and Claude plugin caches were not refreshed. Cache refresh is
  a home-level mutation and remains a separate release/readback step.
