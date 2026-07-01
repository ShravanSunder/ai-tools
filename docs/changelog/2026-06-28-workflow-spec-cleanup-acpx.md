# Workflow Spec Cleanup And ACPX Strategy

Plugin: `shravan-dev-workflow` 1.6.33

## User-visible behavior

- Consolidated the active workflow-design specs into three current specs:
  discussion requirement capture, plan DAG/subagent execution, and ACPX review
  transport.
- Removed Codex app-server thread control from the active strategy. Current
  planning and execution focus on DAG-shaped plans, parent-owned Codex
  subagents, and ACPX external review lanes.
- Made ACPX the selected external review transport strategy for Claude,
  Gemini/`agy`, Codex-compatible ACP agents, and other ACP agents.
- Moved broad source inspiration material out of the plugin `references/`
  surface into plugin docs so runtime skill references stay phase-specific.

## Affected surfaces

- `docs/specs/2026-06-28-discussion-requirement-capture-spec.md`
- `docs/specs/2026-06-28-plan-dag-subagent-execution-spec.md`
- `docs/specs/2026-06-28-acpx-review-transport-spec.md`
- `plugins/shravan-dev-workflow/docs/source-inspiration-catalog.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/skills/discuss-with-me/SKILL.md`
- `plugins/shravan-dev-workflow/skills/docs-maintain/SKILL.md`
- `plugins/shravan-dev-workflow/skills/skill-audit/SKILL.md`
- `plugins/shravan-dev-workflow/skills/spec-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/spec-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Local ACPX evidence

- `acpx --version`: `0.11.2`
- `acpx --help`: available and lists `codex`, `claude`, `gemini`,
  `compare`, and `flow`
- `acpx config show`: available; default agent `codex`, default permissions
  `approve-reads`
- `acpx compare --help`, `acpx flow --help`, and `acpx claude --help`: pass

## Validation

Validation for this change is recorded in the final handoff for the working
tree. Plugin cache refresh was not performed in this change.
