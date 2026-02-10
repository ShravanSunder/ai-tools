# Plugins

Claude Code plugins distributed via the [ai-tools marketplace](../.claude-plugin/marketplace.json).

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
