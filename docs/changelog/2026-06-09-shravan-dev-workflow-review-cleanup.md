# 2026-06-09 Shravan Dev Workflow Review Cleanup

Plugin: `shravan-dev-workflow`
Version: `1.6.3`

## Summary

Addressed a full-suite skill review focused on trigger ambiguity, progressive disclosure, stale names, provenance drift, and oversized always-loaded skill bodies.

## Affected Skills

- `spec-review-swarm`
- `plan-review-swarm`
- `implementation-review-swarm`
- `discuss-with-me`
- `docs-maintain`
- `spec-design-swarm`
- `tui-presentation`
- `ops-linear-tracking`
- `ops-security-review`

## Changes

- Narrowed review-trio ownership:
  - `spec-review-swarm`: drafted specs/designs/architecture before a plan exists.
  - `plan-review-swarm`: implementation plans and handoffs before execution.
  - `implementation-review-swarm`: code, diff, PR, commit, and file review only.
- Added plugin-level `references/trigger-evals.md` for review-trio routing scenarios.
- Collapsed five `discuss-with-me` stage references into `references/stages.md`.
- Removed per-skill `source-inspirations.md` files and kept provenance in the plugin-level map.
- Removed private-project-flavored provenance from the public source-inspiration map.
- Shrunk `tui-presentation/SKILL.md` into a compact trigger/rules/picker/disclosure entrypoint.
- Moved implementation-review packet and review-reception details into reference files.
- Moved plan-review-swarm reception detail into the existing review checklist reference.
- Fixed stale README skill names and aligned `spec-review-swarm` display name.
- Added load-bearing notes for the cross-skill `plan-review-swarm` to `ops-security-review` threat-model reference.

## Manifests

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- `jq -e` passed for plugin and marketplace manifests.
- `claude plugin validate .` passed.
- `git diff --check` passed.
- `codex plugin add shravan-dev-workflow@ai-tools --json` refreshed Codex cache to `1.6.3`.
- `codex plugin list --marketplace ai-tools --available --json` reports `shravan-dev-workflow@ai-tools` installed at `1.6.3`.
- `claude plugin update shravan-dev-workflow@ai-tools` refreshed Claude to `1.6.3` after publishing this source update to the GitHub-backed `ai-tools` marketplace.
- Claude cache `1.6.3` and Codex cache `1.6.3` both contain `skills/discuss-with-me`; neither contains `grill-interview`.
- Active source and refreshed Codex cache have no stale skill names: `maintain-docs`, `security-scan-router`, `implementation-subagent-review`, `spec-adversarial-council-design`, `plan-validate-execute`, or `Spec Adversarial Council`.
- No per-skill `references/source-inspirations.md` or old `references/stage-*.md` files remain.
- Trigger eval files now exist at:
  - `plugins/shravan-dev-workflow/references/trigger-evals.md`
  - `plugins/shravan-dev-workflow/skills/discuss-with-me/references/trigger-evals.md`
