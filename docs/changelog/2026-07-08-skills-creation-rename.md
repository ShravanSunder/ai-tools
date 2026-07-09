# Skills Creation Rename

## Plugin

- `shravan-dev-workflow` `1.6.49`

## User-visible change

- Renamed `shravan-dev-workflow:creating-skills` to
  `shravan-dev-workflow:skills-creation`.
- Moved the source skill folder from
  `plugins/shravan-dev-workflow/skills/creating-skills/` to
  `plugins/shravan-dev-workflow/skills/skills-creation/`.
- Updated current repo routing docs, plugin metadata, README references,
  Codex UI metadata, and pressure-scenario identifiers to use
  `skills-creation`.

## Validation

- Codex skill quick validation from the active installation against
  `plugins/shravan-dev-workflow/skills/skills-creation`
  passed: `Skill is valid!`
- `claude plugin validate .` passed.
- `codex plugin list --marketplace ai-tools --available --json` completed and
  read the marketplace manifest.
- `pnpm --dir tests/skills exec tsc --noEmit` passed.
- `pnpm --dir tests/skills exec vitest run lib/pressure-assertions.test.ts --config vitest.config.ts`
  passed: 10 tests.
- Focused live pressure eval attempts for `skills-creation-workflow-spine` and
  `skills-creation-evaluate-draft` did not execute because the child Codex
  process failed before scenario execution with `AuthorizationRequired`.
- Behavior proof is not required: this is a mechanical rename and plugin
  version bump, not a workflow behavior change.

## Refresh status

- Installed Codex and Claude plugin caches were not refreshed. Cache refresh is
  a home-level mutation and remains a separate release/readback step.
