# AI Tools - Agent Instructions

This repository contains the Agent Sidecar system for running AI coding assistants in sandboxed Docker containers with network isolation.

## Repository Overview

**Purpose**: Provide isolated, firewall-controlled Docker environments for AI agents (Claude Code, Codex, Gemini CLI, etc.) to safely work on codebases.

**Two variants exist**:
- `~/dev/ai-tools` - Personal projects (this repo)
- `~/dev/relay-ai-tools` - Work projects (fork with additional firewall presets for jira/slack)

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Host Machine                                                     │
│  ┌─────────────────┐    ┌─────────────────────────────────────┐ │
│  │ sidecar-ctl.sh  │───▶│ Docker Container (agent-sidecar-*)  │ │
│  │ (firewall mgmt) │    │  ┌─────────────────────────────────┐│ │
│  └─────────────────┘    │  │ firewall.sh (iptables/dnsmasq) ││ │
│                         │  └─────────────────────────────────┘│ │
│  ┌─────────────────┐    │  ┌─────────────────────────────────┐│ │
│  │ run-agent-      │───▶│  │ AI Agent (claude/codex/gemini) ││ │
│  │ sidecar.sh      │    │  └─────────────────────────────────┘│ │
│  └─────────────────┘    │  ┌─────────────────────────────────┐│ │
│                         │  │ Mounted: /workspace, ~/.aws,    ││ │
│                         │  │ ~/.config/micro, volumes for    ││ │
│                         │  │ node_modules, .venv, pnpm store ││ │
│                         │  └─────────────────────────────────┘│ │
│                         └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Key Components

### Scripts

| Script | Location | Purpose |
|--------|----------|---------|
| `run-agent-sidecar.sh` | `agent_sidecar/` | Main entry point, builds/starts container |
| `sidecar-ctl.sh` | `agent_sidecar/` | Host-side firewall control |
| `firewall.sh` | `agent_sidecar/setup/` | In-container iptables/dnsmasq management |

### Configuration Hierarchy

Files are resolved in priority order (highest first):

1. **Local** (`.local.` suffix) - Personal overrides, gitignored
2. **Repo** (`.repo.` suffix) - Team overrides in `.agent_sidecar/`
3. **Base** (`.base.` suffix) - Defaults in `agent_sidecar/` or `setup/`

Example resolution for Dockerfile:
```
1. .agent_sidecar/node-py.local.dockerfile  (personal, gitignored)
2. .agent_sidecar/node-py.repo.dockerfile   (team, committed)
3. agent_sidecar/node-py.base.dockerfile    (default)
```

### Firewall System

**Allowlist files** (merged at startup):
- `setup/firewall-allowlist.base.txt` - Always allowed (npm, pypi, AI APIs, etc.)
- `.agent_sidecar/firewall-allowlist.repo.txt` - Per-repo additions
- `.agent_sidecar/firewall-allowlist.local.txt` - Personal additions

**Toggle presets** (dynamic via `sidecar-ctl`):
- `firewall-toggle-presets/github-write.txt` - Push to GitHub
- `firewall-toggle-presets/notion.txt` - Notion API
- `firewall-toggle-presets/linear.txt` - Linear API
- (relay-ai-tools only) `jira.txt`, `slack.txt`

### Container Naming

Containers are named: `agent-sidecar-{repo-name}-{dir-hash}`

Example: `agent-sidecar-voyager-ai-b17378ea`

### Volume Management

Persistent volumes per workspace:
- `agent-sidecar-history-{hash}` - Shell history
- `agent-sidecar-venv-{hash}` - Python virtualenv
- `agent-sidecar-pnpm-{hash}` - pnpm store
- `agent-sidecar-nm-{hash}-*` - node_modules per package

### Debugging container issues

```bash
# Check container status
sidecar-ctl status

# List all sidecar containers
sidecar-ctl containers

# Reset container (fresh start)
run-agent-sidecar.sh --reset

# Enter container without running agent
run-agent-sidecar.sh --no-run
docker exec -it agent-sidecar-{name}-{hash} zsh
```

## File Locations

```
~/dev/ai-tools/                    # Personal variant
~/dev/relay-ai-tools/              # Work variant (fork)

~/Documents/code/voyager-ai/.agent_sidecar/         # Work repo config
~/Documents/code/risk-process-integrations/.agent_sidecar/  # Work repo config
```

## Important Notes

- Work repos should use `relay-ai-tools` (has jira/slack presets)
- Personal repos should use `ai-tools`
- The two repos are maintained separately; sync manually as needed
- All `.local.*` files are gitignored for personal customization
- The `.generated/` folder contains runtime files (compiled firewall lists)
