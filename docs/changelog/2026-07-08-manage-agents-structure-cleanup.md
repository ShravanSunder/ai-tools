# Manage Agents Structure Cleanup

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.45`

## User-visible changes

- Tightened `manage-agents/SKILL.md` into the agent-facing steering surface:
  relationship choice, packet writing, runtime choice, continuity tracking, and
  parent reduction.
- Moved domain definitions into `references/glossary.md` so the main skill no
  longer carries glossary prose.
- Added `references/agent-job-packet.md` as the shared slot/template contract
  for dispatch prompts, advisor notes, workflow handoffs, and result
  reductions.
- Removed defensive opening wording and kept provider/runtime detail behind
  reference routing.

## Affected files

- `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/orchestration-patterns.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/glossary.md`
- `plugins/shravan-dev-workflow/skills/manage-agents/references/agent-job-packet.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `docs/changelog/README.md`

## Validation

- Focused pressure scenario passed:
  `manage-agents-pattern-selection`.
- Codex static validation passed for
  `plugins/shravan-dev-workflow/skills/manage-agents` using the Codex
  `skill-creator` quick validator with `PyYAML` supplied explicitly.
- `git diff --check` passed.
- JSON manifest validation passed for the changed plugin and marketplace
  manifests.
- `claude plugin validate .` passed.

## Refresh status

- Codex installed-cache refresh: not run; source validation only.
- Claude installed-cache refresh: not run; source validation only.
