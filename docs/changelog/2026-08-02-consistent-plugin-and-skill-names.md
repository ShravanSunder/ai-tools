# 2026-08-02 Consistent Plugin And Skill Names

Plugins: `shravan-dev-workflow` 1.7.6 and `scaffold-project` 0.2.1

## User-visible behavior

- Standardizes Codex skill display titles on the `Category: Action` form, including `Discuss: Pathfinding`, `Discuss: Clarify Mental Models`, `Spec: Design`, `Program: Design`, and `Spec & Program: Review`.
- Adds Codex display metadata for every skill that previously lacked an `agents/openai.yaml` title, including Pathfinding, project scaffolding, Peekaboo, PR wrap-up, and TUI presentation.
- Restores `discuss-pathfinding` to Codex and Claude marketplace/plugin descriptions and Codex discovery keywords/default prompts.
- Removes the stale live README route to retired `discuss-with-me`; historical retirement records remain preserved.
- Aligns the Claude marketplace scaffolding ID with the canonical `scaffold-project@ai-tools` install ID used by Codex and the plugin manifests.
- Documents explicit Cursor `--plugin-dir` loading as a direct integration path; no separate Cursor marketplace is introduced.

## Changed surfaces

- Codex and Claude plugin manifests and marketplace metadata.
- OpenAI display metadata under each active skill's `agents/openai.yaml`.
- Root and plugin README installation, workflow, and platform guidance.
- `docs/changelog/` index.

## Validation

- JSON manifests parse successfully.
- OpenAI YAML metadata parses successfully.
- Active skill names match their directories and frontmatter.
- `claude plugin validate .` passes.
- `git diff --check` passes.

## Refresh / reinstall

- Source metadata targets `shravan-dev-workflow` 1.7.6 and `scaffold-project` 0.2.1.
- Local Codex and Claude caches are not refreshed by this source change.
