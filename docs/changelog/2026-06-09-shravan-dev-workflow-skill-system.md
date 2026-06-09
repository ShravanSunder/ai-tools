# 2026-06-09 Shravan Dev Workflow Skill System

## Scope

`shravan-dev-workflow` moved from a review-focused plugin into a broader Codex-first workflow system for spec design, manual questioning, docs maintenance, plan review/execution, implementation review, handoffs, debugging, security routing, TUI presentation, and PM Linear work.

## What Changed

- Added `spec-design-swarm` for pre-plan design formation with bounded explorer, architecture, security, and adversarial lanes.
- Added `spec-adversarial-council-design` for post-draft, pre-execution adversarial spec/design review.
- Added `security-scan-router` to route authorized security scans to the official Codex Security workflows.
- Added `grill-interview` as a manual-only one-question-at-a-time interview/grill skill.
- Added `maintain-docs` for docs, README, AGENTS, specs, plans, changelog, and architecture reconciliation.
- Added `docs/changelog/` as the public-safe local memory layer for plugin and meta-workflow changes.

## Why

Repeated sessions showed the same workflow failures:

- plans and specs were sometimes skimmed instead of fully loaded;
- stale plans could displace current architecture by looking newer;
- `AGENTS.md` could balloon when runbook detail belonged in docs;
- plugin visibility depended on version bumps and cache refreshes;
- manual grill/interview behavior was useful but only when explicitly requested;
- security scan behavior should route to Codex Security instead of being reimplemented as a normal review lane.

## Source-Of-Truth Decision

- `README.md` is human-facing orientation.
- `AGENTS.md` is compact durable agent guidance.
- `docs/changelog/` records meta-workflow history.
- `docs/changelog/references/` stores evidence snippets and retrieval pointers.
- Skill source lives under `plugins/shravan-dev-workflow/skills/`.
- Plugin version lives in `.codex-plugin/plugin.json` and `.claude-plugin/plugin.json`.

## Version

- `shravan-dev-workflow` 1.5.9: spec design, council review, and security scan routing.
- `shravan-dev-workflow` 1.6.0: manual grill/interview and maintain-docs.

## Validation

- Skill validation: `quick_validate.py` for all `shravan-dev-workflow` skills.
- Plugin validation: `validate_plugin.py plugins/shravan-dev-workflow`.
- Claude marketplace validation: `claude plugin validate .`.
- Codex marketplace visibility: `codex plugin list --marketplace ai-tools --available --json`.
- Codex cache refresh: `codex plugin add shravan-dev-workflow@ai-tools`.

## References

- [Evidence excerpts](references/2026-06-09-shravan-dev-workflow-skill-system.md)
- [Plugin release checklist](references/plugin-release-checklist.md)
