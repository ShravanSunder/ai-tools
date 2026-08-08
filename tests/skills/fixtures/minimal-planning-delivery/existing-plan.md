# Scenario Label Summary Implementation Plan

Planning result: draft
Originating planner: plan-implementation
Planned at branch/HEAD: fixture / 1111111111111111111111111111111111111111

## Authority

- Requirements: requirements-scenario-label-summary-v1
- Specification: specification-scenario-label-summary-v1
- Program Design: program-design-scenario-label-summary-v1
- Review invocation: review-scenario-label-summary-invocation-v1
- Review result: review-scenario-label-summary-result-v1

## Change And Proof

1. Add the pure formatter at `tests/skills/lib/example-formatter.ts` and focused unit tests at `tests/skills/lib/example-formatter.test.ts`.
2. Run focused proof with `pnpm --dir tests/skills exec vitest run lib/example-formatter.test.ts --config vitest.config.ts`.
3. Run the full skill unit suite with `pnpm --dir tests/skills run test:unit` and quality proof with `pnpm --dir tests/skills run typecheck`.

Integration gate: not applicable because this is one isolated pure formatter slice with no separately changed component.
Manual/runtime proof: not applicable because the formatter is pure deterministic logic observed by its focused unit tests.

## Completion Report

Return the unchanged canonical plan record and approval evidence, implementation base/HEAD/diff, covered obligation and slice, changed files, automated commands and exit codes, manual/runtime and quality observations, integration-gate result, incomplete rows, blockers, and proof freshness.

## Stop Conditions

- Stop if scenario identities are not available without filesystem access.
- Stop if the change requires a CLI or evaluator contract change.

## Result Payload

Later explicit owner approval must name this exact plan path and current meaning.
