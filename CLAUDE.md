# AI Tools - Agent Instructions

This repository contains the Agent Sidecar system for running AI coding assistants in sandboxed Docker containers with network isolation.

## Repository Overview

**Purpose**: Provide isolated, firewall-controlled Docker environments for AI agents (Claude Code, Codex, Gemini CLI, etc.) to safely work on codebases.

**Two variants exist**:
- `~/dev/ai-tools` - Personal projects (this repo)
- `~/dev/relay-ai-tools` - Work projects (fork)

### Differences Between Variants

| Feature | ai-tools (personal) | relay-ai-tools (work) |
|---------|---------------------|----------------------|
| Firewall presets | github-write, notion, linear | github-write, notion, jira, slack |
| OpenCode support | Yes (`--run-opencode`) | No (removed) |
| Agent CLIs | Claude, Codex, Gemini, OpenCode, Cursor | Claude, Codex, Gemini, Cursor |

The repos are maintained separately - sync manually as needed.

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

**Naming Convention**:
| Behavior | Pattern | Examples |
|----------|---------|----------|
| **Override** (pick one: local > repo > base) | `{name}.{tier}.{ext}` | `sidecar.repo.conf`, `node-py.local.dockerfile` |
| **Additive** (merge all that exist) | `{name}-extra.{tier}.{ext}` or `extra.{tier}.{ext}` | `firewall-allowlist-extra.repo.txt`, `extra.repo.zshrc` |

### Two-Tier Image Architecture

Images use a shared base + optional per-repo overlay:

1. **Base image** (`agent-sidecar-base:{variant}`) - Shared across all repos. Contains OS, tools, agent CLIs, Playwright. Built once. Uses Python 3.13.
2. **Per-repo overlay** (`agent-sidecar:{repo-name}`) - Only built when customizations exist (EXTRA_APT_PACKAGES, build-extra.sh, extra zshrc).
3. If no customizations, the base image is used directly (no overlay build).

Custom Dockerfiles in `.agent_sidecar/` **must** `FROM agent-sidecar-base:{variant}`:
```dockerfile
ARG BASE_IMAGE=agent-sidecar-base:node-py
FROM ${BASE_IMAGE}
# ... your customizations ...
```

Resolution for custom Dockerfiles (override pattern):
```
1. .agent_sidecar/node-py.local.dockerfile  (personal, gitignored)
2. .agent_sidecar/node-py.repo.dockerfile   (team, committed)
3. (no override) -> base image used directly, or overlay if customizations exist
```

### Firewall System

**Allowlist files** (merged at startup, additive `-extra` pattern):
- `setup/firewall-allowlist-extra.base.txt` - Always allowed (npm, pypi, AI APIs, etc.)
- `.agent_sidecar/firewall-allowlist-extra.repo.txt` - Per-repo additions
- `.agent_sidecar/firewall-allowlist-extra.local.txt` - Personal additions

**Toggle presets** (dynamic via `sidecar-ctl`):
- `firewall-toggle-presets/github-write.txt` - Push to GitHub
- `firewall-toggle-presets/notion.txt` - Notion API
- `firewall-toggle-presets/linear.txt` - Linear API

### Extra APT Packages (per-repo)

Set `EXTRA_APT_PACKAGES` in `sidecar.repo.conf` or `sidecar.local.conf`:

```bash
# .agent_sidecar/sidecar.repo.conf
EXTRA_APT_PACKAGES="htop tree"
```

Setting `EXTRA_APT_PACKAGES` triggers a per-repo **overlay image** build on top of the shared base. Requires `--full-reset` to rebuild when changed.

### Build-Extra Script (per-repo)

For custom build-time installations (AppImages, binaries, etc.), create a build script:

```bash
# .agent_sidecar/build-extra.repo.sh
#!/bin/bash
# Install Obsidian (extracted AppImage, no libfuse2 needed)
curl -L "https://github.com/.../Obsidian-1.5.3.AppImage" -o /tmp/obsidian.AppImage
chmod +x /tmp/obsidian.AppImage
cd /opt && /tmp/obsidian.AppImage --appimage-extract
mv squashfs-root obsidian && ln -s /opt/obsidian/obsidian /usr/local/bin/obsidian
rm /tmp/obsidian.AppImage
```

- Runs as **root** at Docker build time (full network access)
- Script is deleted after running (agent cannot access it)
- Resolution: `.local` > `.repo` (no base)
- Requires `--full-reset` to rebuild when changed

### Init Script Extras

**Extra scripts** (run AFTER base init scripts, additive pattern):
- `.agent_sidecar/init-background-extra.repo.sh` - Team background commands
- `.agent_sidecar/init-background-extra.local.sh` - Personal background commands
- `.agent_sidecar/init-foreground-extra.repo.sh` - Team shell setup
- `.agent_sidecar/init-foreground-extra.local.sh` - Personal shell setup

These run IN ADDITION to base scripts. The original `init-{bg,fg}.{repo,local}.sh` replacement pattern still works for full overrides.

### Container Naming

Containers are named: `agent-sidecar-{repo-name}-{dir-hash}`

Example: `agent-sidecar-voyager-ai-b17378ea`

### Volume Management

Persistent volumes per workspace:
- `agent-sidecar-history-{hash}` - Shell history
- `agent-sidecar-venv-{hash}` - Python virtualenv
- `agent-sidecar-pnpm-{hash}` - pnpm store
- `agent-sidecar-cache-{hash}` - pnpm/npm cache (persists across container recreation)
- `agent-sidecar-uv-{hash}` - uv Python downloads and cache
- `agent-sidecar-nm-{hash}-*` - node_modules per package

### Initialize a Repository

Use `init_repo_sidecar.sh` to set up `.agent_sidecar/` with template files:

```bash
# From any repo directory
/path/to/ai-tools/agent_sidecar/init_repo_sidecar.sh

# Creates:
#   .agent_sidecar/
#   ├── .gitignore
#   ├── sidecar.repo.conf                   # Team config
#   ├── sidecar.local.conf                  # Personal config (gitignored)
#   ├── firewall-allowlist-extra.repo.txt   # Team firewall additions
#   ├── firewall-allowlist-extra.local.txt  # Personal firewall additions (gitignored)
#   ├── build-extra.repo.sh                 # Build-time script template
#   ├── init-background-extra.repo.sh
#   └── init-foreground-extra.repo.sh
```

### Debugging container issues

```bash
# Check container status
sidecar-ctl status

# List all sidecar containers
sidecar-ctl containers

# Reload container (recreate with current image, picks up config/mount changes)
run-agent-sidecar.sh --reload

# Full reset (rebuild base image + recreate container, updates agent CLIs to latest)
run-agent-sidecar.sh --full-reset

# Enter container without running agent
run-agent-sidecar.sh --no-run
docker exec -it agent-sidecar-{name}-{hash} zsh

# Clean up Docker resources (dangling images, old build cache, orphaned volumes)
sidecar-ctl cleanup
```

**Container lifecycle flags**:

| Flag | Base Image | Per-Repo Image | Container | Speed | Use Case |
|------|-----------|---------------|-----------|-------|----------|
| *(no flag)* | Reuse (or build if missing) | Skip if no customizations | Reuse existing | ~0-3s | Day-to-day re-entry |
| `--reload` | Skipped | Skipped | Recreate | ~5-10s | Pick up config/mount changes |
| `--full-reset` | Rebuild (cache bust) | Rebuild if needed | Recreate | ~2-5min | Update CLIs, Dockerfile, apt packages |

**Note**: `--full-reset` updates all agent CLIs (Claude, Codex, Gemini, etc.) to their latest versions. Named volumes (history, venv, pnpm, node_modules, cache, uv) survive both `--reload` and `--full-reset`.

## File Locations

```
~/dev/ai-tools/                    # Personal variant
~/dev/relay-ai-tools/              # Work variant (fork)

~/Documents/code/voyager-ai/.agent_sidecar/         # Work repo config
~/Documents/code/risk-process-integrations/.agent_sidecar/  # Work repo config
```

## Security Model

The agent inside the container has limited access by design:

| Resource | Agent Access | Notes |
|----------|--------------|-------|
| `.agent_sidecar/` | **None** | Shadowed with empty tmpfs; config at `/etc/agent-sidecar` for system scripts |
| APT/Debian repos | **None** | Packages installed at build time only, firewall blocks apt repos |
| Network | **Allowlist only** | Firewall blocks all except explicitly allowed domains |
| `.git/` | **Read-only** | Mounted read-only to prevent repo corruption |
| Playwright/Chromium | **Localhost only** | Can only access 127.0.0.1 by default; use `PLAYWRIGHT_EXTRA_HOSTS` to allow more |

## Important Notes

- Work repos should use `relay-ai-tools`
- Personal repos should use `ai-tools`
- All `.local.*` files are gitignored for personal customization
- The `.generated/` folder contains runtime files (compiled firewall lists)
