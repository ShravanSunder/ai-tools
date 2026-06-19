# Vitest Evals Skill Runner

## Plugin

- Marketplace-facing plugin: `shravan-dev-workflow`
- Version: unchanged in this change; this adds an opt-in test runner and does
  not change installed runtime skill behavior.

## User-Visible Behavior

- `tests/skills/` now has an opt-in Vitest/Vitest Evals runner for skill
  pressure scenarios.
- The existing shell pressure runner remains the default path.
- `run-skill-pressure-tests.sh --vitest` runs one scenario through the new
  package while preserving the legacy shell contract for normal runs.
- The new runner writes structured per-run artifacts under
  `tmp/skill-pressure-evals/`, including prompt, raw model response, parsed
  result, assertion summary, and final JSON.

## Affected Surfaces

- `tests/skills/package.json`
- `tests/skills/pnpm-lock.yaml`
- `tests/skills/tsconfig.json`
- `tests/skills/vitest.config.ts`
- `tests/skills/evals/skill-pressure.eval.ts`
- `tests/skills/lib/*`
- `tests/skills/run-skill-pressure-tests.sh`
- `tests/skills/README.md`
- `tests/skills/.gitignore`

## Validation

- `pnpm --dir tests/skills run test`
- `pnpm --dir tests/skills exec tsc --noEmit`
- `SKILL_PRESSURE_BACKEND=fake tests/skills/run-skill-pressure-tests.sh --vitest --scenario orchestrator-goal-closeout-audit --timeout 900`
- `tests/skills/run-skill-pressure-tests.sh --vitest --scenario orchestrator-goal-closeout-audit --timeout 900`
- `tests/skills/run-skill-pressure-tests.sh --scenario orchestrator-goal-closeout-audit --timeout 900`
- Prompt artifact safety check confirmed the latest real Vitest prompt artifact
  did not include expected-answer fields such as `Expected Compliant Behavior`,
  `Failure Signals`, or assertion regex internals.

## Refresh Status

- No Codex or Claude plugin cache refresh is required until this branch is
  merged or installed manually.
