# tui-presentation

Always-on presentation skill for visual-first chat: tables, diagrams, annotated components, and structured design layouts using Unicode box-drawing.

## What this plugin does

Teaches the agent to present information visually whenever it would land faster than prose — comparisons, design proposals, architecture, UI mockups, flows, and variant series. The skill fires on design/comparison/explanation turns as a strong user preference.

## Platforms

- **Claude Code** — via `.claude-plugin/plugin.json`
- **Codex CLI** — via `.codex-plugin/plugin.json`

Enable in both via the respective tool's plugin config (see `~/.claude/settings.json` and `~/.codex/config.toml`).

## Skill contents

- `SKILL.md` — core principles, five patterns, response layout
- `references/tables.md` — comparison, drift, highlighted rows, feature matrix
- `references/ui-layouts.md` — sidebar, tiled, modal, nested cards, chips
- `references/architecture.md` — client/API/DB, pub/sub, layered stacks
- `references/sequence-and-state.md` — sequences, state machines, decision trees
- `references/annotations-and-specs.md` — callouts, variants, specs, titled frames
