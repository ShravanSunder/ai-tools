# AI Tools

Local Codex and Claude Code plugins for AI-assisted development workflows. This
repo also includes Agent Sidecar, a Docker-based sandbox for running coding
agents with network isolation.

## Core Plugins

Install through the local ai-tools marketplaces.

```bash
codex plugin marketplace add ~/dev/ai-tools
/plugin marketplace add ShravanSunder/ai-tools
```

The plugin IDs below are shared across Codex and Claude Code.

| Client | Scaffolding | Dev workflow | Dev tools |
|--------|-------------|--------------|-----------|
| Codex | `scaffold-project@ai-tools` | `shravan-dev-workflow@ai-tools` | `dev-workflow-tools@ai-tools` |
| Claude Code | `scaffold-project@ai-tools` | `shravan-dev-workflow@ai-tools` | `dev-workflow-tools@ai-tools` |

```bash
codex plugin add <name>@ai-tools
/plugin install <name>@ai-tools
```

| Plugin | Description |
|--------|-------------|
| [`shravan-dev-workflow`](plugins/shravan-dev-workflow/) | Codex-first spec, program design, pathfinding, plan, implementation, PR wrap-up, review, handoff, debugging, TUI presentation, and ops workflows |
| [`dev-workflow-tools`](plugins/dev-workflow-tools/) | Common development tool skills, including native macOS UI testing with Peekaboo CLI |
| [`scaffold-project`](plugins/ai-scaffold/) | AI Scaffold project scaffolding with standard dev configs (biome, ruff, vitest, pytest, cursor rules, claude hooks) |

See [`plugins/`](plugins/) for full details.

Release notes live in [`docs/changelog/`](docs/changelog/).

### Shravan Dev Workflow

The main workflow plugin is organized by namespace and phase boundary:

```mermaid
flowchart LR
    pathfinding["Discuss: Pathfinding<br/>unwritten requirements and decisions"]
    clarify["Discuss: Clarify Mental Models<br/>shared-model reconvergence"]
    spec["spec-*<br/>design, review, handoff"]
    plan["plan-handoff<br/>existing plan portability"]
    impl["implementation-*<br/>PR wrap-up, handoff"]

    pathfinding --> spec
    clarify --> spec
    clarify --> plan
```

Operations skills such as `ops-security-review` and `ops-linear-tracking` sit
outside the main phase path.

### Shared Observability

`observability/` owns the shared local OpenTelemetry collector plus
VictoriaMetrics, VictoriaLogs, and VictoriaTraces stack. Use
`shravan-dev-workflow:ops-observability-stack` for producer boundaries,
AgentStudio and Agent VM loops, resource naming, and Victoria query recipes.

Start with [`plugins/shravan-dev-workflow/README.md`](plugins/shravan-dev-workflow/)
for the full workflow map, phase diagrams, and skill boundaries.

---

## Agent Sidecar

Agent Sidecar runs coding agents inside a Docker container with a deny-by-default
egress firewall. Use it when an agent needs to execute commands with tighter
network and workspace boundaries than a normal host session.

```bash
# From any git repository
run-agent-sidecar.sh --run-claude    # Start Claude Code in sidecar
run-agent-sidecar.sh --run-codex     # Start Codex
run-agent-sidecar.sh --run-gemini    # Start Gemini CLI
run-agent-sidecar.sh --reload        # Recreate container (~5s)
run-agent-sidecar.sh --full-reset    # Rebuild image + recreate (~2-5min)

sidecar-ctl firewall allow notion    # Allow Notion API
sidecar-ctl firewall toggle 15m      # Enable all presets for 15 minutes
sidecar-ctl firewall clear           # Revoke all toggle access
sidecar-ctl status                   # Show container + firewall state
```

See [`agent_sidecar/README.md`](agent_sidecar/README.md) for setup,
architecture, configuration, firewall presets, lifecycle, and debugging docs.
Use [`agent_sidecar/INSTRUCTIONS.md`](agent_sidecar/INSTRUCTIONS.md) as the
concise file copied into repos that initialize sidecar support.

---

## Repository Structure

```
ai-tools/
├── plugins/                     # Codex and Claude Code plugins
│   ├── shravan-dev-workflow/    # Spec, plan, implementation, review, handoff workflows
│   ├── dev-workflow-tools/      # Common tool skills, including Peekaboo UI testing
│   └── ai-scaffold/             # Project scaffolding
├── agent_sidecar/               # Docker sidecar system
├── observability/               # Shared local OTel/Victoria stack
├── AGENTS.md                    # Maintainer and agent instructions
└── CLAUDE.md                    # Claude Code alias for AGENTS.md
```
