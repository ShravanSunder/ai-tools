# Discuss-with-me lifecycle alignment

## Summary

- Plugin: `shravan-dev-workflow`
- Version: `1.6.2`
- Change type: skill rename and behavior refinement

## User-visible changes

- Renamed `grill-interview` to `discuss-with-me`.
- Reframed the skill from a fixed grill/interview posture into manual lifecycle alignment for design, spec, plan, implementation-direction, and docs decisions.
- Added progressive-disclosure references for:
  - design
  - spec
  - plan
  - implementation model breaks
  - docs source-of-truth decisions
  - question patterns
  - workflow handoff routing
  - trigger eval scenarios
- Kept debugging, security, code review, plan/spec review, broad research, docs editing, and publishing out of the skill's primary scope.

## Manifests touched

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`
- `.agents/plugins/marketplace.json`

## Active docs touched

- `README.md`
- `plugins/README.md`
- `agents.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`
- `plugins/shravan-dev-workflow/skills/spec-design-swarm/references/discuss-with-me.md`
- `plugins/shravan-dev-workflow/skills/docs-maintain/references/workflows.md`

## Validation

- `jq -e` parsed the Codex plugin manifest, Claude plugin manifest, Claude marketplace manifest, and Codex marketplace manifest.
- `claude plugin validate .`: passed.
- `codex plugin add shravan-dev-workflow@ai-tools --json`: refreshed installed Codex cache to `1.6.2`.
- `codex plugin list --marketplace ai-tools --available --json`: confirmed `shravan-dev-workflow` installed and enabled at `1.6.2`.
- Cache smoke: `~/.codex/plugins/cache/ai-tools/shravan-dev-workflow/1.6.2/skills/discuss-with-me/SKILL.md` exists and the old cached `skills/grill-interview` directory does not.
- `rg` stale-name scan across active docs/manifests/plugin files: no `shravan-dev-workflow:grill-interview`, `skills/grill-interview`, or `Use grill-interview` references remain.
- Directory smoke: `plugins/shravan-dev-workflow/skills/discuss-with-me` exists and `plugins/shravan-dev-workflow/skills/grill-interview` does not.
