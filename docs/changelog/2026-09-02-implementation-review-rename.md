# 2026-09-02: Rename review-implementation to implementation-review

Plugin: `shravan-dev-workflow` 2.10.0 (released with the coordinator-lanes entry after merging master, which had reached 2.9.0)

- Renamed the `review-implementation` skill to `implementation-review` as a hard cutover, joining the namespace-first `implementation-*` family (`implementation-pr-wrapup`, `implementation-handoff`).
- Moved the skill folder, frontmatter `name`, `agents/openai.yaml` prompt, and the pressure-scenario folder; updated cross-references in all active skills, shared references, plugin README (family table row moved under `implementation-*`), both plugin manifests (keywords and Codex defaultPrompt), tests, and the AGENTS.md skills table, SOP routing sentence, and retired-swarm disambiguation.
- Recorded the namespace-first naming convention in AGENTS.md skill-authoring guidance.
- The renamed skill's description text, workflow behavior, and review contracts are unchanged in this release (sibling descriptions changed only by the name swap, e.g. `implementation-pr-wrapup`); the coordinator-lanes redesign lands in later runs of the accepted spec (`docs/wip/skills-authoring/2026-08-30-review-skills-rails-and-coordination.md`).
- Historical docs (`docs/changelog/`, `docs/specs/`, `docs/wip/`) and `retired-skills/` intentionally keep the old name.
- Validation: repo-wide grep for `review-implementation` empty outside historical homes; `claude plugin validate .`; skills contract tests pass.
- Refresh/reinstall: pending next plugin cache refresh for Codex and Claude.
