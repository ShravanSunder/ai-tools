# AI Tools

Local Codex and Claude Code plugins for AI-assisted development workflows. This
repo also includes Agent Sidecar, a Docker-based sandbox for running coding
agents with network isolation.

## Plugins

Install through the local ai-tools marketplaces.

```bash
codex plugin marketplace add ~/dev/ai-tools
/plugin marketplace add ShravanSunder/ai-tools
```

Then install individual plugins with `codex plugin add <name>@ai-tools` in Codex or `/plugin install <name>@ai-tools` in Claude Code.

| Plugin | Description |
|--------|-------------|
| [`ai-scaffold`](plugins/ai-scaffold/) | Project scaffolding with standard dev configs (biome, ruff, vitest, pytest, cursor rules, claude hooks) |
| [`skill-peekaboo`](plugins/skill-peekaboo/) | Visual UI testing for macOS apps using Peekaboo CLI |
| [`quorum-counsel`](plugins/quorum-counsel/) | Multi-model review orchestration -- counsel-reviewer and codex-solver background agents |
| [`shravan-dev-workflow`](plugins/shravan-dev-workflow/) | Codex-first spec, plan, implementation, review, handoff, debugging, TUI presentation, and ops Linear tracking workflows |

See [`plugins/`](plugins/) for full details.

Release notes live in [`docs/changelog/`](docs/changelog/).

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
│   ├── ai-scaffold/             # Project scaffolding
│   ├── skill-peekaboo/          # macOS visual UI testing
│   ├── quorum-counsel/          # Manual multi-model counsel
│   └── shravan-dev-workflow/    # Spec, review, docs, TUI, Linear workflow skills
├── agent_sidecar/               # Docker sidecar system
└── CLAUDE.md                    # Agent instructions
```
