# 2026-10-06 skill-authoring plugin

New plugin `skill-authoring` 0.1.1; `shravan-dev-workflow` 2.71.0.

- `skills-creation` and `skill-audit` leave `shravan-dev-workflow` and become five skills in `skill-authoring`: `skill-orchestrator` (the lifecycle), `skill-creation` (renamed; the craft and the skill spec), `skill-review` (several reviewer agents), `skill-pressure-testing` (proof with fresh agent runs, read by hand), `skill-audit`.
- The skill spec format moves out of the reviewer's file into `skill-creation/references/skill-spec.md` and gains run status.
- `shravan-dev-workflow` no longer classifies skill packages: the `runtime-skill-package` route is gone from every phase, and `ready-for-review` always means `implementation-review`. `spec-program-review` loses its skill-authoring guard step.
- Neither plugin names the other. Workflow-plugin practices (trace, decision brief, humanizer, role catalog) become "ask the user" in `skill-authoring`.
- Manifests: all three for both plugins, three marketplace entries; `AGENTS.md` skill-work SOP and skills table; `plugins/README.md`.
- Validation (after the runner was stripped): `claude plugin validate` passed for the marketplace and both plugins; Codex `quick_validate.py` reported all five skills valid; `tests/skills` 124 tests passed (25 static contract tests over skill text, one assertion moved to the new convergence-rule home and one updated for the removed classification; the rest test the regex-form evaluator the next change removes); `tsc --noEmit` passed.
- No eval runner, stored scenarios, or lint ship: pressure testing is being redesigned (owner decision 2026-10-09), and the design docs mark that half withdrawn. Behavior proof of the five skills is an open gap.
- `shravan-dev-workflow` wording fixes from review: `plan-implementation` entry steps renumbered, `spec-program-review` chunking points at the right section, `implementation-handoff` names `implementation-review`.
- Codex and Claude cache refresh: not run.
