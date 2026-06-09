# 2026-06-09 Shravan Dev Workflow Skill System References

These excerpts are intentionally small. Use the paths and rollout ids for deeper retrieval.

## Memory Evidence

- `MEMORY.md` task group: workflow/local-and-cross-repo / full-plan loading and read-only plan validation.
  - Repeated rule: resolve exact target file, count lines, read all chunks, then compare against code/docs.
  - Symptom: skimmed plan review misses contradictions.
- `MEMORY.md` task group: ai-tools Shravan workflow plugin updates.
  - Repeated rule: skills should be plugin-native; version and cache state must be checked before claiming visibility.
- `MEMORY.md` task group: AgentStudio release docs.
  - Repeated rule: keep `AGENTS.md` concise; put durable release facts there, not long runbooks.
- `MEMORY.md` task group: AgentStudio Bridge docs reconciliation.
  - Repeated rule: stale branch plans must be reconciled against current `main` and current code/docs before reuse.
- `MEMORY.md` task group: agent-vm credentialed-actions and MCP Portal.
  - Repeated rule: current package/code contracts beat stale external docs or stale plans.

## Local Repo Evidence

- `agent-vm` docs use progressive disclosure from README to docs map to architecture/subsystem docs.
- `agent-studio` docs distinguish architecture docs from tickets/plans.
- `agent-vm` superpowers plan/spec indexes label status so filename date does not imply current truth.
- Bridge handoff artifacts include canonical plan, supporting plan, hard constraints, first reads, and validation anchors.

## Upstream Skill References

- Obra Superpowers:
  - `brainstorming`
  - `writing-plans`
  - `requesting-code-review`
  - `receiving-code-review`
  - `subagent-driven-development`
  - `verification-before-completion`
- Matt Pocock skills:
  - `grill-me`
  - `grill-with-docs`
  - `handoff`
- Cursor Agent Skills:
  - `interview-me`
  - `idea-refine`
  - `documentation-and-adrs`
  - `doubt-driven-development`
- OpenAI Codex Security:
  - `security-scan`
  - `security-diff-scan`
  - `deep-security-scan`
  - `fix-finding`

## Retrieval Pointers

- Memory registry: `/Users/shravansunder/.codex/memories/MEMORY.md`
- Rollout summaries: `/Users/shravansunder/.codex/memories/rollout_summaries/`
- Local admired skills: `/Users/shravansunder/Documents/dev/open-source/ai-dev/`
- Plugin source: `/Users/shravansunder/dev/ai-tools/plugins/shravan-dev-workflow/`
