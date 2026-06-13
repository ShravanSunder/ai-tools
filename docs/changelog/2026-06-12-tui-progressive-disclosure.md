# 2026-06-12 TUI Progressive Disclosure

- Marketplace plugin: `shravan-dev-workflow`
- Version: `1.6.17`

## User-Visible Change

`tui-presentation` now teaches agents to explain difficult systems through a
disclosure sequence: one map, one selected slice, one small ledger, then
technical detail. It also separates visual-family selection from diagram
catalogs, treats zoom as a disclosure move rather than a diagram type, and
keeps semantic markdown responsible for code, file links, URLs, identifiers,
and copyable snippets.

Mermaid remains optional/editor-specific context, not the skill's primary
abstraction.

## Affected Surfaces

- `plugins/shravan-dev-workflow/skills/tui-presentation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/progressive-disclosure.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/visual-family-selection.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/architecture.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/sequence-and-state.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/tables.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/ui-layouts.md`
- `plugins/shravan-dev-workflow/skills/tui-presentation/references/build-discipline.md`
- `tests/skills/pressure-scenarios/tui-presentation-*.md`
- `tests/skills/pressure-scenarios/README.md`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `plugins/shravan-dev-workflow/references/trigger-evals.md`
- `plugins/shravan-dev-workflow/references/source-inspirations.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

RED baseline:

- `tui-presentation-progressive-disclosure`: failed on old skill proof regexes.
- `tui-presentation-research-lane-board`: failed on old skill proof regexes.
- `tui-presentation-visual-family-selection`: failed on old skill proof regexes.
- `tui-presentation-semantic-markdown-boundary`: passed because the old skill
  already preserved semantic markdown.
- `tui-presentation-no-mermaid-catalog`: failed on old skill proof regexes.

GREEN and release validation:

- Focused TUI pressure suite passed:
  - `tui-presentation-progressive-disclosure`: exit `0`
  - `tui-presentation-research-lane-board`: exit `0`
  - `tui-presentation-visual-family-selection`: exit `0`
  - `tui-presentation-semantic-markdown-boundary`: exit `0`
  - `tui-presentation-no-mermaid-catalog`: exit `0`
  - `tui-presentation-monospace-structure`: exit `0`
- `git diff --check`: exit `0`
- `jq empty` for Codex manifest, Claude manifest, Claude marketplace, and
  Codex marketplace: exit `0`
- Codex and Claude manifest keyword parity: exit `0`
- Size caps:
  - `SKILL.md`: 130 lines
  - `progressive-disclosure.md`: 142 lines
  - `visual-family-selection.md`: 117 lines
- Stale wording scan for old Mermaid-transition/catalog labels and deprecated
  zoom-map labels: clean.
- Public-safety scan for private paths, run ids, conversation-log markers, and
  generated-memory markers in the new public examples/changelog: clean.
- `claude plugin validate .`: exit `0`
- `validate_plugin.py`: unavailable on PATH in this environment.
- `quick_validate.py`: unavailable on PATH in this environment.
- `codex plugin list --marketplace ai-tools --available --json`: reports
  `shravan-dev-workflow` version `1.6.17`.
- Full pressure suite advisory run was attempted, but the harness remained
  header-only after the long wait window and was terminated. Scoped TUI gates
  above are the blocking gates for this slice.

## Refresh Status

- Codex cache refreshed with `codex plugin add shravan-dev-workflow@ai-tools
  --json`; installed version is `1.6.17`.
- `codex plugin list --json` reports installed `shravan-dev-workflow@ai-tools`
  version `1.6.17`.
- Claude marketplace validation passed locally, but the installed Claude cache
  still reports `1.6.16` before this release commit is pushed. The Claude
  marketplace is GitHub-backed, so local Claude refresh requires updating the
  marketplace after the pushed commit is available.
