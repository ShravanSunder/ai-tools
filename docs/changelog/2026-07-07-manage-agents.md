# Manage Agents Skill

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.43`

## User-visible changes

- Added `manage-agents`, a new workflow skill for spawning, calling, resuming,
  steering, queueing, monitoring, and reducing subordinate AI-agent work.
- Added ACPX-focused references for runtime control, session ledgers,
  automation and flows, existing agent registry/configuration, building custom
  ACP agents, and provider-specific notes for Claude, Codex, and Cursor.
- Clarified that queueing is not steering, ACPX JSON automation consumes raw
  ACP JSON-RPC NDJSON, exit codes belong in automation handling, and child
  agent output remains candidate evidence until parent verification.
- Added pressure scenarios for queue/steer confusion, JSON/flows/exit-code
  handling, session-ledger reduction, and custom-command versus adapter-building
  boundaries.
- Added pointer-only integration in spec, plan, implementation, debug, and docs
  workflow skills so they route agent-call/session mechanics to `manage-agents`
  without copying ACPX or provider how-to guidance into those skills.

## Affected files

- `plugins/shravan-dev-workflow/skills/manage-agents/**`
- `tests/skills/pressure-scenarios/manage-agents-*.md`
- `tests/skills/pressure-scenarios/implementation-review-swarm-manage-agents-pointer.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/debug-investigation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/docs-maintain/SKILL.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.agents/plugins/marketplace.json`
- `.claude-plugin/marketplace.json`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `AGENTS.md`

## Validation

- Codex static validation passed for
  `plugins/shravan-dev-workflow/skills/manage-agents` using the Codex
  `skill-creator` quick validator with `PyYAML` supplied explicitly.
- Focused manage-agents pressure scenarios passed:
  `manage-agents-queue-vs-steer`,
  `manage-agents-json-flows-exit-codes`,
  `manage-agents-session-ledger-reduction`, and
  `manage-agents-custom-agent-boundary`.
- Focused pointer pressure scenario passed:
  `implementation-review-swarm-manage-agents-pointer`.
- `pnpm --dir tests/skills exec tsc --noEmit` passed.
- `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`
  passed.
- `git diff --check` passed.
- `claude plugin validate .` passed.
- `codex plugin list --marketplace ai-tools --available --json` completed;
  installed source still reports `shravan-dev-workflow` at `1.6.42` because
  installed-cache refresh was not run.
- Full `tests/skills/run-skill-pressure-tests.sh --fast --timeout 900` was
  attempted and stopped after unrelated non-target failures in
  `debug-investigation-background-monitoring`,
  `implementation-execute-plan-matrix-verification`, and multiple
  `implementation-pr-wrapup` scenarios.

## Refresh status

- Codex installed-cache refresh: not run; source validation only.
- Claude installed-cache refresh: not run; source validation only.
