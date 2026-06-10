# Skill Pressure Tests

This harness pressure-tests `shravan-dev-workflow` skills through Codex.

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

Full-suite runs execute scenarios in parallel by default (`CODEX_PRESSURE_JOBS=4`).
Use `--jobs N` to tune concurrency or `--serial` when debugging runner output.
Focused `--scenario NAME` runs stay serial.

Artifacts are written under `tmp/skill-pressure-tests/`.

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
