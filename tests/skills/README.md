# Skill Pressure Tests

This harness pressure-tests `shravan-dev-workflow` skills through Codex.

Default backend: `codex exec`

Default model: `gpt-5.4`

Default reasoning effort: `low`

Default safety: read-only sandbox

The goal is not to ask whether an agent can summarize a skill. The goal is to
test whether it still follows the skill when the prompt pressures it to take a
shortcut.

Run:

```bash
tests/skills/run-skill-pressure-tests.sh --fast
```

Artifacts are written under `tmp/skill-pressure-tests/`.

Use `--integration` only for slower tests that create temporary projects or
exercise real files. Claude and `agy` are optional future backends, not the
default harness.
