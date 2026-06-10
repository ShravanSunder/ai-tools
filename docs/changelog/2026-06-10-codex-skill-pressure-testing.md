# 2026-06-10 Codex Skill Pressure Testing

## Summary

Added a Codex-first pressure-test harness for workflow skills.

## Changes

- Added `tests/skills/` runner, helpers, JSON schema, and a pressure scenario
  matrix covering all 15 `shravan-dev-workflow` skills.
- Added scenario metadata assertions for skill name, invocation, read-only
  behavior, artifact expectation, shortcut resistance, and decision shape.
- Fixed the pressure-test reducer so any failed assertion makes the scenario
  fail instead of being masked by later passing assertions.
- Defaulted the harness to `gpt-5.4` with low reasoning effort, overridable through environment variables.
- Documented that Claude and `agy` are optional future backends, not the default pressure-test path.

## Validation

- `bash -n tests/skills/run-skill-pressure-tests.sh`
- `bash -n tests/skills/lib/test-helpers.sh`
- `bash -n tests/skills/test-discuss-with-me-pressure.sh`
- `bash -n tests/skills/test-plan-review-pressure.sh`
- `CODEX_PRESSURE_MODEL=gpt-5.4 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --timeout 900`

Latest full fast run: 15 passed, 0 failed.
