# 2026-10-06 skill-eval-runner

New package `packages/skill-eval-runner` (0.1.1, local; run with `pnpm --config.dlx-cache-max-age=0 dlx file:"$PWD/packages/skill-eval-runner"` from the repo root; pnpm dlx needs an absolute path).

- Commands: `validate`, `run`, `lint`, `done-bar`. Deno from the package's own `deno` dependency; ACPX as a library; subjects `gpt-6-luna` medium, judge leaves `gpt-6-luna` high.
- Each Run gets a snapshot of the repository (skills' `scenarios/` stripped, fixtures placed), the skill set under `.agents/skills/`, and an isolated Codex home; the runner refuses to start inside a Codex sandbox.
- Checks are decision trees: code steps over recorded actions, Jev cards (no engine yet, so always uncertain), judge leaves. Missing evidence is inconclusive; a fail is never hidden by a later pass.
- The regex-form pressure runner, its scenarios, schemas, and fixtures are removed from `tests/skills`, which keeps 24 static contract tests. The 16 `skill-authoring` scenarios and a proving set of four `shravan-dev-workflow` scenarios use the new form; 317 others are listed as not running in `docs/wip/skills-authoring/2026-10-06-unconverted-scenarios.md`.
- Validation: runner `deno test` 30 passed, fmt/check/lint clean; `tests/skills` 24 passed, `tsc` clean; `validate` loads all 20 new-form scenarios; `lint` finds nothing in `skill-authoring`. Known-bad proof: code and judge checks each failed for the intended reason, then the compliant run passed. Live batch results: see the PR.
- `new-from-intent` done bars return `not-evaluable (jev-lint-unavailable)` until the Jev tool exists.
