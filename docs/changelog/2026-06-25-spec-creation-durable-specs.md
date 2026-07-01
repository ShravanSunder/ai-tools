# Spec Creation Durable Specs

Plugin: `shravan-dev-workflow` 1.6.32

## User-visible behavior

- `spec-creation-swarm` now treats substantial primary specs as maintained repo
  artifacts under `docs/specs/` rather than tmp-only workflow scratch.
- Supporting research lane files, swarm ledgers, review reports, and planning
  scratch remain in repo-local `tmp/` by default unless explicitly promoted.
- The spec-creation packet reference now shows the primary spec under
  `docs/specs/` and the supporting swarm bundle under `tmp/spec-workflows/`.
- Plan lifecycle was not changed: plans do not become repo docs by default.

## Affected surfaces

- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/references/swarm-packets.md`
- `tests/skills/pressure-scenarios/spec-creation-swarm-durable-primary-spec.md`
- `tests/skills/pressure-scenarios/spec-creation-swarm-spec-folder-chunking.md`
- `docs/specs/2026-06-28-discussion-requirement-capture-spec.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario spec-creation-swarm-durable-primary-spec --timeout 900`: pass.
- `CODEX_PRESSURE_MODEL=gpt-5.5 CODEX_PRESSURE_REASONING_EFFORT=low tests/skills/run-skill-pressure-tests.sh --fast --scenario spec-creation-swarm-spec-folder-chunking --timeout 900`: pass.
- `pnpm --dir tests/skills test:unit`: 29 passed.
- `pnpm --dir tests/skills typecheck`: pass.

## Refresh status

Plugin cache refresh not performed in this change. This entry records source
behavior and pressure proof only.

## Supersession note

The original discussion-loop spec created during this change was later folded
into `docs/specs/2026-06-28-discussion-requirement-capture-spec.md` during the
workflow spec cleanup.
