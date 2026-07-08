# Manage Agents Pattern Selector

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.44`

## User-visible changes

- Expanded `manage-agents` from ACPX-focused runtime guidance into a
  harness-neutral subordinate-agent orchestration skill.
- Added `references/orchestration-patterns.md` to choose between swarms,
  persistent sidekicks, advisors, ephemeral subagents, and workflow handoffs
  before selecting a provider or command.
- Added explicit advisor guidance for consult-on-demand, always-monitoring, and
  completion-check patterns while preserving parent-owned reduction.
- Added a pressure scenario that rejects provider-command-first answers when
  the user asks for generic harness pattern selection.

## Affected files

- `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/orchestration-patterns.md`
- `tests/skills/pressure-scenarios/manage-agents-pattern-selection.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `docs/changelog/README.md`

## Source notes

- Cognition's Devin Fusion post informed the persistent sidekick distinction:
  main agent keeps planning, ambiguity, delegation, and final review while a
  sidekick keeps a separate persistent context for delegated work.
- Anthropic's advisor-tool docs informed the advisor distinction: an executor
  can receive strategic plan or course-correction advice from another model,
  while the executor continues the task.

## Validation

- Focused pressure scenario passed:
  `manage-agents-pattern-selection`.
- Codex static validation passed for
  `plugins/shravan-dev-workflow/skills/manage-agents` using the Codex
  `skill-creator` quick validator with `PyYAML` supplied explicitly.
- `pnpm --dir tests/skills exec tsc --noEmit` passed.
- `pnpm --dir tests/skills exec vitest run lib --config vitest.config.ts`
  passed.
- `git diff --check` passed.
- JSON manifest validation passed for the changed plugin and marketplace
  manifests.
- `claude plugin validate .` passed.

## Refresh status

- Codex installed-cache refresh: not run; source validation only.
- Claude installed-cache refresh: not run; source validation only.
