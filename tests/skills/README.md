# Skill Pressure Tests

This harness pressure-tests Codex skills through Codex. Most scenarios cover
`shravan-dev-workflow`; plugin-specific skill scenarios may live here when they
need the same shortcut-resistance harness.

Default backend: `codex exec`

Default model: `gpt-5.6-luna`

Default reasoning effort: `xhigh`

Default safety: read-only sandbox

The goal is not to ask whether an agent can summarize a skill. The goal is to
test whether it still follows the skill when the prompt pressures it to take a
shortcut.

Active scenarios live at
`pressure-scenarios/<plugin-name>/<skill-name>/<scenario-name>.md`. The
`skill_under_test` metadata must match those plugin and skill folders. Select a
scenario by its stable `scenario_id`, not by its file path.

Run the fast Vitest eval suite:

```bash
pnpm --dir tests/skills run test:evals
```

Run one scenario:

```bash
SKILL_PRESSURE_SCENARIO=orchestrator-goal-closeout-audit \
  pnpm --dir tests/skills run test:evals
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
SKILL_PRESSURE_SCENARIO=orchestrator-goal-closeout-audit \
  pnpm --dir tests/skills run test:evals
```

Vitest owns selection and execution. Set `SKILL_PRESSURE_MODE=integration` for
integration scenarios, `SKILL_PRESSURE_SCENARIO=<scenario-id>` for one case,
and `SKILL_PRESSURE_TIMEOUT_SECONDS=<seconds>` for its timeout.

Vitest eval artifacts are written under `tmp/skill-pressure-evals/`.

The model under test sees only the scenario's `## Prompt` section plus the
minimal metadata needed for its JSON report. `Expected Compliant Behavior`,
`Failure Signals`, and the `expect_*` assertions are grader-only; showing them
to the model lets it parrot compliance it never demonstrated.

Scenarios for retired skills use the same
`retired-pressure-scenarios/<plugin-name>/<skill-name>/<scenario-name>.md`
shape and are excluded from the active runner. They are preserved as historical
behavior records, not as proof for current runtime skills.

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
