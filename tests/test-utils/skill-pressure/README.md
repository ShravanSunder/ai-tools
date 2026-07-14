# Behavioral Skill Pressure Tests

This package is the only authoritative skill pressure-test runner. Scenarios live with their owners under `tests/<plugin>/<skill>/scenarios/*.md`; the runner discovers them recursively and executes comparable RED/GREEN repetitions through ACPX and Vitest Evals.

The subject is Codex Luna/xhigh by default. Every scenario uses at least five fresh baseline repositories without the skill and five equivalent treatment repositories with only the project-scoped skill installation differing. The subject never receives the hidden rubric and never grades itself.

Run all scenarios:

```bash
tests/test-utils/skill-pressure/run-skill-pressure-tests.sh --fast
```

Run one global scenario ID:

```bash
tests/test-utils/skill-pressure/run-skill-pressure-tests.sh --scenario manage-agents-pattern-selection --serial
```

Control scenario concurrency with `--jobs N`; focused scenarios are always serial. `--timeout SECONDS` controls each ACPX subject attempt. Provider and transport failures are recorded as `infrastructure_error`, never behavioral passes.

Local structural proof does not call models:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:unit
pnpm --dir tests/test-utils/skill-pressure run test:integration
pnpm --dir tests/test-utils/skill-pressure run typecheck
pnpm --dir tests/test-utils/skill-pressure run schemas:check
```

Run live behavioral proof only through `test:evals` or the shell entrypoint above. Evidence is written below `tmp/skill-pressure-evals/`.
