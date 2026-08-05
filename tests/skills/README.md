# Skill Pressure Tests

This harness pressure-tests Codex skills through Codex. Most scenarios cover
`shravan-dev-workflow`; plugin-specific skill scenarios may live here when they
need the same shortcut-resistance harness.

Default model transport: ACPX with the `codex` adapter

Default model: `gpt-5.6-luna`

Default subject reasoning effort: `high`

Default semantic judge: `gpt-5.6-terra` at `medium`

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
pnpm --dir tests/skills exec vitest run evals \
  --config vitest.config.ts \
  -t discuss-pathfinding-explain-meaningful-choice
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
  pnpm --dir tests/skills exec vitest run evals \
  --config vitest.config.ts \
  -t discuss-pathfinding-explain-meaningful-choice
```

Vitest owns selection and execution for the four-skill evaluator path; use
native `-t` test-name filtering for one scenario. The legacy path still accepts
`SKILL_PRESSURE_MODE=integration` and `SKILL_PRESSURE_SCENARIO=<scenario-id>`
during the focused cutover. Set `SKILL_PRESSURE_TIMEOUT_SECONDS=<seconds>` for
the ACPX subject timeout.

Vitest eval artifacts are written under `tmp/skill-pressure-evals/`.

Subject and judge execution both use ACPX. Override their model, effort, and timeout through `CODEX_PRESSURE_MODEL`, `CODEX_PRESSURE_REASONING_EFFORT`, `SKILL_PRESSURE_TIMEOUT_SECONDS`, `SKILL_PRESSURE_JUDGE_MODEL`, `SKILL_PRESSURE_JUDGE_REASONING_EFFORT`, and `SKILL_PRESSURE_JUDGE_TIMEOUT_SECONDS`.

Codex profiles do not currently apply when `codex-acp` starts app-server. As a temporary profile-equivalent bridge, `SKILL_PRESSURE_CODEX_CONFIG` accepts an explicit JSON object and `SKILL_PRESSURE_CODEX_MODEL_PROVIDER` selects a provider defined by that configuration. The harness does not read a local Codex profile automatically.

The model under test sees only the scenario's `## Prompt` section plus the
minimal metadata needed for its JSON report. `Expected Compliant Behavior`,
`Failure Signals`, and the `expect_*` assertions are grader-only; showing them
to the model lets it parrot compliance it never demonstrated.

Scenarios for retired skills use the same
`retired-pressure-scenarios/<plugin-name>/<skill-name>/<scenario-name>.md`
shape and are excluded from the active runner. They are preserved as historical
behavior records, not as proof for current runtime skills.

Limitations:

- Legacy scenarios still evaluate the agent's final self-reported JSON. The four
  in-scope skills use deterministic evaluators over stable evidence and one
  semantic judge for obligations that require understanding.
- For skill behavior changes, pair pressure runs with a baseline source or prior
  plugin check when possible so RED/GREEN proof does not rely only on a
  cooperative model answer.

Use `--integration` only for slower tests that create temporary projects or
exercise real files. Claude and `agy` are optional future backends, not the
default harness.

The Vitest eval path stores ACP events raw in the first implementation.
