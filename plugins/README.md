# Plugins

AI tools distributed through the local marketplaces in this repository.

- Codex plugins: [`.agents/plugins/marketplace.json`](../.agents/plugins/marketplace.json)
- Claude Code plugins: [`.claude-plugin/marketplace.json`](../.claude-plugin/marketplace.json)
- Release notes: [`../docs/changelog/`](../docs/changelog/)

## Installation

```bash
# Add the marketplace
/plugin marketplace add ShravanSunder/ai-tools

# Install a plugin (use the IDs in the client table below)
/plugin install <plugin-name>@ai-tools
```

Client install IDs:

```text
Codex       scaffold-project@ai-tools   dev-workflow-tools@ai-tools   shravan-dev-workflow@ai-tools
Claude Code scaffold-project@ai-tools   dev-workflow-tools@ai-tools   shravan-dev-workflow@ai-tools
Cursor      agent --plugin-dir <plugin-directory>
```

Cursor loads these Claude-format plugin directories through its explicit
`--plugin-dir` path; it does not install them from this repository's Codex or
Claude marketplace manifests.

### Managing Plugins

```bash
/plugin                    # List installed plugins
/plugin disable <name>     # Temporarily disable
/plugin enable <name>      # Re-enable
/plugin uninstall <name>   # Remove completely
```

## Available Plugins

### [scaffold-project](ai-scaffold/)

AI Scaffold (`scaffold-project`) provides project scaffolding with standard dev configs. Supports TypeScript (biome, vitest, Playwright), Python (ruff, basedpyright, pytest), and Swift (swiftlint, swiftformat). Includes cursor rules and Claude hooks.

Install it as `scaffold-project@ai-tools` in both Codex and Claude Code. The directory remains `ai-scaffold` for source organization.

- `/scaffold-project` -- scaffold a new project or retrofit an existing one
- `/scaffold-project-update-templates` -- update templates with latest standards

### [dev-workflow-tools](dev-workflow-tools/)

Common development tool skills that work across Codex, Claude Code, and Cursor's explicit `--plugin-dir` loading path.
Currently includes `peekaboo`, an alternative to Playwright for native macOS
app automation via the Accessibility API. The Peekaboo skill uses live CLI
discovery, snapshot-scoped interaction, and progressive references for
troubleshooting and headless mode.

### [shravan-dev-workflow](shravan-dev-workflow/)

Shravan's Codex-first development workflow plugin. Provides:

- **spec-design** skill -- defines authoritative Why/What, observable obligations, and proof obligations before program design
- **program-design** skill -- turns settled obligations into source-grounded structural How, including ownership, interfaces, calls, state, failure, and proof seams
- **spec-program-review** skill -- independently reviews current specification/program-design meaning and reuses coverage only for parent-verified non-semantic edits
- **discuss-clarify-mental-models** skill -- reconverges unstable shared mental models before artifact work without the old one-question grill shape
- **discuss-pathfinding** skill -- Extract unwritten understanding from the user — requirements, tacit process knowledge, domain terms, design decisions — via batched grilling with attached reads, live challenge, and decision/process/glossary records as they crystallize.
- **manage-agents** skill -- coordinates advisors, sidekicks, delegates, operators, subagents, and swarms across model categories and native or ACPX runtimes, with ACP adapter implementation kept separate
- **docs-maintain** skill -- reconciles docs, AGENTS.md, README.md, specs, plans, changelogs, and architecture docs against code and current decisions
- **spec-handoff** skill -- packages spec/design context for another agent before an implementation plan exists
- **plan-handoff** skill -- packages an existing implementation plan for another agent without pretending design context is a plan
- **ops-security-review** skill -- routes explicit security scans to official Codex Security workflows instead of reimplementing audit-grade scanning
- **ops-observability-stack** skill -- guides shared local OpenTelemetry/Victoria stack use, producer boundaries, AgentStudio and Agent VM loops, resource naming, and Victoria proof queries
- **implementation-pr-wrapup** skill -- finishes the GitHub PR lifecycle with fresh checks, comments, review-thread, and mergeability gates without merging without authorization
- **debug-investigation** skill -- investigates bugs, failing tests, flaky behavior, crashes, regressions, and unexpected behavior before fixes
- **skills-creation** skill -- creates, updates, or evaluates one named skill or accepted draft with YAML trigger design, `SKILL.md` mental model and main path, reference depth, steering language, pressure proof, platform validation, and source-adaptation boundaries
- **skill-audit** skill -- audits current skills, session evidence, and upstream inspirations before recommending create/update/merge/skip decisions
- **tui-presentation** skill -- presents design, architecture, comparison, flow, and multi-section chat output with progressive Unicode TUI structure while preserving semantic markdown for code, links, paths, URLs, and technical tokens
- **ops-linear-tracking** skill -- organizes Linear projects, milestones, issues, and dependencies using docs as the source of truth and tickets as tracking artifacts
- Evidence-first reducer workflow -- treats all subagent and external outputs as candidate findings until verified against the repo
- Oracle exclusion -- this workflow never invokes or suggests Oracle
