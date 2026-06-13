# Plugins

AI tools distributed through the local marketplaces in this repository.

- Codex plugins: [`.agents/plugins/marketplace.json`](../.agents/plugins/marketplace.json)
- Claude Code plugins: [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json)
- Release notes: [`../docs/changelog/`](../docs/changelog/)

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

Visual UI testing for macOS apps using [Peekaboo CLI](https://github.com/openclaw/Peekaboo). An alternative to Playwright for native macOS app automation via the Accessibility API. Uses live CLI discovery, snapshot-scoped interaction, and progressive references for troubleshooting and headless mode.

### [quorum-counsel](quorum-counsel/)

Multi-model review orchestration. Provides:

- **counsel-reviewer** agent -- orchestrates Gemini + Codex in parallel for comprehensive plan/code review
- **codex-solver** agent -- delegates hard problems to OpenAI Codex as a background task
- `/review-plan` command -- trigger plan review
- CLI permission hooks for bash commands

### [shravan-dev-workflow](shravan-dev-workflow/)

Shravan's Codex-first development workflow plugin. Provides:

- **spec-design-swarm** skill -- shapes specs/designs with bounded codebase explorer, architecture, security, and adversarial lanes before implementation planning
- **discuss-with-me** skill -- manual lifecycle alignment for design, spec, plan, implementation-direction, and docs decisions before editing files
- **docs-maintain** skill -- reconciles docs, AGENTS.md, README.md, specs, plans, changelogs, and architecture docs against code and current decisions
- **spec-review-swarm** skill -- attacks drafted specs/designs with adversarial review lanes and accepted/contested/open synthesis before execution
- **spec-handoff** skill -- packages spec/design context for another agent before an implementation plan exists
- **plan-create** skill -- turns spec/design context into a written implementation plan without editing code
- **ops-security-review** skill -- routes explicit security scans to official Codex Security workflows instead of reimplementing audit-grade scanning
- **ops-observability-stack** skill -- guides shared local OpenTelemetry/Victoria stack use, producer boundaries, AgentStudio and Agent VM loops, resource naming, and Victoria proof queries
- **implementation-review-swarm** skill -- orchestrates bounded read-only reviewer lanes, uses Codex subagents as the default/majority backend, includes an `agy` external model lane for substantial reviews when available, and supports explicit user-requested Claude, Gemini, or extra `agy` adversarial lanes
- **debug-investigation** skill -- investigates bugs, failing tests, flaky behavior, crashes, regressions, and unexpected behavior before fixes
- **skill-audit** skill -- audits current skills, session evidence, and upstream inspirations before recommending create/update/merge/skip decisions
- **tui-presentation** skill -- presents design, architecture, comparison, flow, and multi-section chat output with progressive Unicode TUI structure while preserving semantic markdown for code, links, paths, URLs, and technical tokens
- **ops-linear-tracking** skill -- organizes Linear projects, milestones, issues, and dependencies using docs as the source of truth and tickets as tracking artifacts
- Evidence-first reducer workflow -- treats all subagent and external outputs as candidate findings until verified against the repo
- Oracle exclusion -- this workflow never invokes or suggests Oracle
