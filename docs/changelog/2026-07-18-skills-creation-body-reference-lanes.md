# Skills Creation Body And Reference Lanes

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.60` -> `1.6.61`

## User-Visible Behavior Changes

- Defines the authored `SKILL.md` body as the always-loaded behavioral core: mental model, all-run spine, visible obligations and decisions, invariants, returns, and completion boundary.
- Separates literal `MUST load` guidance for always-required depth from `IF ... load` guidance for conditional branches.
- Separates reference loading from lane dispatch so authors do not confuse a long document or subagent execution with an independently packetable lane.
- Requires lane dispatch sites to name the bounded mission, prerequisites and context packet, authority boundary, expected receipt, and parent verification/reduction point.
- Adds `reference-lanes-design.md` as the owner for genuine lane design and shared lane shapes.
- Folds ordinary workflow guidance into `SKILL.md` and removes the standalone `workflow-topology.md` and `schema-design.md` files after migrating their guidance to the new owners.
- Updates skill spec and implementation review rubrics to verify body visibility, reference placement, and complete lane caller contracts.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/glossary.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-lanes-design.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-spec-review.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/skill-implementation-review.md`
- Removed `plugins/shravan-dev-workflow/skills/skills-creation/references/workflow-topology.md`
- Removed `plugins/shravan-dev-workflow/skills/skills-creation/references/schema-design.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `git diff --check`: exit 0.
- `jq empty` across both plugin manifests and both marketplace manifests: exit 0.
- Codex `skill-creator` quick validation with an ephemeral PyYAML environment: exit 0, skill valid.
- `claude plugin validate .`: exit 0, validation passed.
- `codex plugin list --marketplace ai-tools --available --json`: exit 0; the installed source remains `1.6.60` because cache refresh is intentionally not part of source PR preparation.
- `pnpm --dir tests/skills exec tsc --noEmit`: exit 0.
- `pnpm --dir tests/skills exec vitest run lib/pressure-assertions.test.ts --config vitest.config.ts`: exit 0, 11 tests passed.
- Source-backed implementation review found no correctness defects in the body/reference/lane contract after restoring one unrelated `spec-creation-swarm` line to `origin/master`.
- Behavioral proof gap accepted for this delivery split: PR1 adds no new pressure scenarios or harness changes and does not claim artifact-scoped GREEN. PR2 owns the required MUST/IF/LOAD/DISPATCH and lane-contract behavior cases after PR1 merges.

## Refresh Status

- Codex installed-cache refresh: not run. Cache refresh is a home-level mutation and is not required for source PR readiness.
- Claude installed-cache refresh: not run for the same reason.
