# 2026-10-06 skill-authoring plugin

New plugin `skill-authoring` 0.1.0; `shravan-dev-workflow` 2.71.0.

- `skills-creation` and `skill-audit` leave `shravan-dev-workflow` and become five skills in `skill-authoring`: `skill-orchestrator` (the lifecycle), `skill-creation` (renamed; the craft and the skill spec), `skill-review` (several reviewer agents plus lint), `skill-pressure-testing` (proof and scenario method), `skill-audit`.
- The skill spec format moves out of the reviewer's file into `skill-creation/references/skill-spec.md` and gains run status.
- `shravan-dev-workflow` no longer classifies skill packages: the `runtime-skill-package` route is gone from every phase, and `ready-for-review` always means `implementation-review`. `spec-program-review` loses its skill-authoring guard step.
- Neither plugin names the other. Workflow-plugin practices (trace, decision brief, humanizer, role catalog) become "ask the user" in `skill-authoring`.
- Manifests: all three for both plugins, three marketplace entries; `AGENTS.md` skill-work SOP and skills table; `plugins/README.md`.
- Validation: `claude plugin validate` passed for the marketplace and both plugins; Codex `quick_validate.py` passed for all five skills; `tests/skills` static contract tests 124 passed (one assertion moved to the new convergence-rule home, one updated for the removed classification); `tsc --noEmit` passed.
- Pressure scenarios and the new runner arrive in the next change; behavior proof is pending.
- Codex and Claude cache refresh: not run.
