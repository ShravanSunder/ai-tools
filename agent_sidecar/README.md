# Agent Sidecar

Sandboxed Docker containers for AI coding assistants (Claude Code, Codex, Gemini CLI) with network isolation via iptables/dnsmasq firewall.

## Setup

Add to your PATH in `~/.zshrc`:

```bash
export PATH="$PATH:$HOME/dev/ai-tools/agent_sidecar"
```

Then reload your shell or run `source ~/.zshrc`.

## Quick Start

```bash
# From any git repository
run-agent-sidecar.sh --run-claude
```

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
│                         │  │ Mounted: /workspace, volumes    ││ │
│                         │  │ for node_modules, .venv, pnpm   ││ │
│                         │  └─────────────────────────────────┘│ │
│                         └─────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration Hierarchy

Files are resolved in priority order (highest first):

1. **Local** (`.local.` suffix) -- personal overrides, gitignored
2. **Repo** (`.repo.` suffix) -- team overrides in `.agent_sidecar/`
3. **Base** (`.base.` suffix) -- defaults in `agent_sidecar/` or `setup/`

| Behavior | Pattern | Examples |
|----------|---------|----------|
| **Override** (pick one: local > repo > base) | `{name}.{tier}.{ext}` | `sidecar.repo.conf`, `node-py.local.dockerfile` |
| **Additive** (merge all that exist) | `{name}-extra.{tier}.{ext}` | `firewall-allowlist-extra.repo.txt`, `extra.repo.zshrc` |

## Two-Tier Image Architecture

1. **Base image** (`agent-sidecar-base:{variant}`) -- shared across all repos. Contains OS, tools, agent CLIs, Playwright. Built once.
2. **Per-repo overlay** (`agent-sidecar:{repo-name}`) -- only built when customizations exist (EXTRA_APT_PACKAGES, build-extra.sh, extra zshrc).
3. If no customizations, the base image is used directly (no overlay build).

## Host Control Script

```bash
# Check status (run from project directory)
sidecar-ctl status

# Firewall commands
sidecar-ctl firewall list              # Show toggle allowlist
sidecar-ctl firewall allow notion      # Allow a preset
sidecar-ctl firewall allow api.foo.com # Allow a specific domain
sidecar-ctl firewall block notion      # Block a preset
sidecar-ctl firewall toggle            # Enable all presets for 10m (default)
sidecar-ctl firewall toggle 15m        # Enable all presets for 15 minutes
sidecar-ctl firewall clear             # Clear all toggled domains
sidecar-ctl firewall reload            # Reload firewall rules
```

## Firewall Allowlists

**Three-tier allowlist system:**

1. **Base Allowlist** (`setup/firewall-allowlist-extra.base.txt`): Domains always permitted (package registries, AI services, GitHub read-only, common dev services)
2. **Repo/Local Overrides** (additive `-extra` pattern):
   - `.agent_sidecar/firewall-allowlist-extra.repo.txt` (team, committed)
   - `.agent_sidecar/firewall-allowlist-extra.local.txt` (personal, gitignored)
3. **Toggle Presets**: Dynamically enabled/disabled via `sidecar-ctl`

**Presets** in `firewall-toggle-presets/`:
- `github-write` -- GitHub push access
- `notion` -- Notion API
- `linear` -- Linear API

## Per-Project Customization

Use `init_repo_sidecar.sh` to set up a new project:

```bash
cd ~/path/to/my-project
/path/to/ai-tools/agent_sidecar/init_repo_sidecar.sh
```

This creates:

```
.agent_sidecar/
├── .gitignore                           # Ignore local overrides
├── sidecar.repo.conf                    # Team config overrides
├── sidecar.local.conf                   # Personal config (gitignored)
├── firewall-allowlist-extra.repo.txt    # Team firewall additions
├── firewall-allowlist-extra.local.txt   # Personal firewall additions (gitignored)
├── build-extra.repo.sh                  # Build-time script template
├── init-background-extra.repo.sh        # Team background init
└── init-foreground-extra.repo.sh        # Team foreground init
```

## Launch Options

```bash
run-agent-sidecar.sh [options]

Options:
  --reload      Recreate container with current image
  --full-reset  Rebuild base image + recreate container
  --no-run      Setup only, don't exec into shell
  --run <cmd>   Run specific command
  --run-claude  Run Claude Code
  --run-codex   Run OpenAI Codex
  --run-gemini  Run Gemini CLI
  --run-cursor  Run Cursor
```

| Flag | Base Image | Per-Repo Image | Container | Speed | Use Case |
|------|-----------|---------------|-----------|-------|----------|
| *(no flag)* | Reuse | Skip if no customizations | Reuse existing | ~0-3s | Day-to-day re-entry |
| `--reload` | Skipped | Skipped | Recreate | ~5-10s | Pick up config/mount changes |
| `--full-reset` | Rebuild | Rebuild if needed | Recreate | ~2-5min | Update CLIs, Dockerfile, apt packages |

`--full-reset` updates all agent CLIs to latest versions. Named volumes survive both `--reload` and `--full-reset`.

## Security Model

| Resource | Agent Access | Notes |
|----------|--------------|-------|
| `.agent_sidecar/` | **None** | Shadowed with empty tmpfs |
| APT/Debian repos | **None** | Packages installed at build time only |
| Network | **Allowlist only** | Firewall blocks all except explicitly allowed domains |
| `.git/` | **Read-only** | Mounted read-only to prevent repo corruption |
| Playwright/Chromium | **Localhost only** | Can only access 127.0.0.1 by default |

## Directory Structure

```
agent_sidecar/
├── run-agent-sidecar.sh                 # Main launch script
├── sidecar-ctl.sh                       # Host-side firewall control
├── sidecar.base.conf                    # Base configuration
├── init_repo_sidecar.sh                 # Initialize .agent_sidecar/ in repos
├── node-py.base.dockerfile              # Base container image
├── node-py.overlay.dockerfile           # Per-repo overlay image
├── setup/
│   ├── firewall.sh                      # Egress firewall (runs in container)
│   ├── firewall-allowlist-extra.base.txt # Always-allowed domains
│   ├── firewall-allowlist-toggle.base.txt # Toggle base domains
│   ├── init-background.base.sh          # Background init (Xvfb, etc.)
│   ├── init-foreground.base.sh          # Shell init (Atuin, Zap)
│   ├── extra.base.zshrc                 # Base zsh config
│   └── playwright-wrapper.sh            # Chromium localhost restriction
├── firewall-toggle-presets/
│   ├── github-write.txt
│   ├── notion.txt
│   └── linear.txt
└── .generated/                          # Runtime files (gitignored)
```

## Debugging

```bash
# Check container status
sidecar-ctl status

# List all sidecar containers
sidecar-ctl containers

# Enter container without running agent
run-agent-sidecar.sh --no-run
docker exec -it agent-sidecar-{name}-{hash} zsh

# Clean up Docker resources
sidecar-ctl cleanup
```
