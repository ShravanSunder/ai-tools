# Skill Pressure Tests

This harness pressure-tests Codex skills through Codex. Most scenarios cover
`shravan-dev-workflow`; plugin-specific skill scenarios may live here when they
need the same shortcut-resistance harness.

Default backend: `codex exec`

Default model: `gpt-5.5`

Default reasoning effort: `low`

Default safety: read-only sandbox

The goal is not to ask whether an agent can summarize a skill. The goal is to
test whether it still follows the skill when the prompt pressures it to take a
shortcut.

Run:

```bash
tests/skills/run-skill-pressure-tests.sh --fast
```

Opt-in Vitest eval runner:

```bash
tests/skills/run-skill-pressure-tests.sh --vitest --scenario orchestrator-goal-closeout-audit
```

The Vitest runner lives in this directory as a standalone test package. Run its
unit checks with:

```bash
pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts
pnpm --dir tests/skills exec tsc --noEmit
```

Use the fake backend for cheap harness/report plumbing proof without invoking a
live agent:

```bash
SKILL_PRESSURE_BACKEND=fake \
tests/skills/run-skill-pressure-tests.sh --vitest --scenario orchestrator-goal-closeout-audit
```

Full-suite runs execute scenarios in parallel by default (`CODEX_PRESSURE_JOBS=4`).
Use `--jobs N` to tune concurrency or `--serial` when debugging runner output.
Focused `--scenario NAME` runs stay serial.

Artifacts are written under `tmp/skill-pressure-tests/`.
Vitest eval artifacts are written under `tmp/skill-pressure-evals/`.

The model under test sees only the scenario's `## Prompt` section plus the
minimal metadata needed for its JSON report. `Expected Compliant Behavior`,
`Failure Signals`, and the `expect_*` assertions are grader-only; showing them
to the model lets it parrot compliance it never demonstrated.

Limitations:

- The harness still evaluates the agent's final self-reported JSON. Scenario
  checks should include independent `expect_proof_regex` assertions for behavior
  that must not be satisfied by the broad decision-shape regex alone.
- For skill behavior changes, pair pressure runs with a baseline source or prior
  plugin check when possible so RED/GREEN proof does not rely only on a
  cooperative model answer.

Use `--integration` only for slower tests that create temporary projects or
exercise real files. Claude and `agy` are optional future backends, not the
default harness.

The Vitest eval path stores Codex event streams raw in the first implementation.
Deterministic assertions remain the pass/fail source of truth; model judges are
not part of the first runner.
