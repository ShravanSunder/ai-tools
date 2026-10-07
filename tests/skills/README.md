# Skill Contract Tests

Static tests that check the text contracts of the `shravan-dev-workflow` and `skill-authoring` skills: required wording, single homes for shared rules, retired-skill provenance, and design-artifact contracts. They read skill files; they do not run agents.

```bash
pnpm --dir tests/skills install
pnpm --dir tests/skills test
pnpm --dir tests/skills typecheck
```

Behavior proof for skills lives elsewhere: pressure scenarios sit beside each skill in `scenarios/`, and the `packages/skill-eval-runner` package runs them (`pnpm --config.dlx-cache-max-age=0 dlx file:./packages/skill-eval-runner run ...`). The `skill-authoring:skill-pressure-testing` skill owns how to write and run them. The regex-form pressure runner that used to live here was removed on 2026-10-06; `docs/wip/skills-authoring/2026-10-06-unconverted-scenarios.md` lists its scenarios that were not converted.
