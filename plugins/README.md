# Plugins

AI tools distributed through the local marketplaces in this repository.

- Codex plugins: [`.agents/plugins/marketplace.json`](../.agents/plugins/marketplace.json)
- Claude Code plugins: [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json)

## Installation

```bash
# Add the marketplace
/plugin marketplace add ShravanSunder/ai-tools

# Install a plugin
/plugin install <plugin-name>@ai-tools
```

### Managing Plugins

```bash
/plugin                    # List installed plugins
/plugin disable <name>     # Temporarily disable
/plugin enable <name>      # Re-enable
/plugin uninstall <name>   # Remove completely
```

## Available Plugins

### [ai-scaffold](ai-scaffold/)

Project scaffolding with standard dev configs. Supports TypeScript (biome, vitest, Playwright), Python (ruff, basedpyright, pytest), and Swift (swiftlint, swiftformat). Includes cursor rules and claude hooks.

- `/scaffold-project` -- scaffold a new project or retrofit an existing one
- `/scaffold-project-update-templates` -- update templates with latest standards

### [skill-peekaboo](skill-peekaboo/)

Visual UI testing for macOS apps using [Peekaboo CLI](https://github.com/nickthedude/peekaboo). An alternative to Playwright for native macOS app automation via the Accessibility API. Supports headless mode for CI/CD.

### [quorum-counsel](quorum-counsel/)

Multi-model review orchestration. Provides:

- **counsel-reviewer** agent -- orchestrates Gemini + Codex in parallel for comprehensive plan/code review
- **codex-solver** agent -- delegates hard problems to OpenAI Codex as a background task
- `/review-plan` command -- trigger plan review
- CLI permission hooks for bash commands

### [shravan-dev-workflow](shravan-dev-workflow/)

Shravan's Codex-first development workflow plugin. Provides:

- **subagent-review** skill -- orchestrates read-only Codex reviewer lanes, includes `agy` counsel for substantial reviews when available, and supports explicit user-requested Claude, Gemini, or extra `agy` adversarial lanes
- **tui-presentation** skill -- presents design, architecture, comparison, flow, and multi-section chat output with Unicode TUI structure while preserving semantic markdown for code, links, paths, URLs, and technical tokens
- **linear-work** skill -- organizes Linear projects, milestones, issues, and dependencies using docs as the source of truth and tickets as tracking artifacts
- Evidence-first reducer workflow -- treats all subagent and external outputs as candidate findings until verified against the repo
- Oracle exclusion -- this workflow never invokes or suggests Oracle
