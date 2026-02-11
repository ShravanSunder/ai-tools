<!-- AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/ShravanSunder/ai-tools/blob/master/agent_sidecar/INSTRUCTIONS.md -->

# Agent Sidecar

Sandboxed Docker containers for AI coding assistants (Claude Code, Codex, Gemini CLI, OpenCode) with network isolation via iptables/dnsmasq firewall. This file is a concise usage reference for agents working in this repository.

## Configuration

Config files are resolved in priority order (highest first):

1. **Local** (`.local.` suffix) -- personal overrides, gitignored
2. **Repo** (`.repo.` suffix) -- team overrides in `.agent_sidecar/`
3. **Base** (`.base.` suffix) -- defaults in `agent_sidecar/` or `setup/`

| Behavior | Pattern | Examples |
|----------|---------|----------|
| **Override** (pick one: local > repo > base) | `{name}.{tier}.{ext}` | `sidecar.repo.conf`, `node-py.local.dockerfile` |
| **Additive** (merge all that exist) | `{name}-extra.{tier}.{ext}` | `firewall-allowlist-extra.repo.txt`, `extra.repo.zshrc` |

### Config Keys

Set in `sidecar.repo.conf` or `sidecar.local.conf`:

| Key | Default | Description |
|-----|---------|-------------|
| `EXTRA_APT_PACKAGES` | `""` | Space-separated apt packages. Triggers overlay image build. Requires `--full-reset`. |
| `DOCKERFILE_VARIANT` | `node-py` | Dockerfile variant. Resolution: `.local` > `.repo` > `.base` dockerfile. |
| `EXTRA_MOUNTS` | `""` | Additional Docker `-v` mounts. See [Mounts](#mounts) below. |
| `SIDECAR_ENV_OVERRIDES` | `""` | Space-separated `KEY=VALUE` pairs applied at shell init. Use for `localhost` to `host.docker.internal`. |
| `PLAYWRIGHT_EXTRA_HOSTS` | `""` | Comma-separated hostnames to allow in Playwright/Chromium (default: localhost only). |

Custom Dockerfiles in `.agent_sidecar/` **must** start with:

```dockerfile
ARG BASE_IMAGE=agent-sidecar-base:node-py
FROM ${BASE_IMAGE}
```

### Mounts

The container automatically mounts:

| Mount | Container Path | Mode | Notes |
|-------|---------------|------|-------|
| Git repo (workspace) | `$WORK_DIR` (same path as host) | rw | Your project files |
| `.git/` | `$WORK_DIR/.git` | **ro** | Prevents repo corruption |
| `.agent_sidecar/` | `$WORK_DIR/.agent_sidecar` | **tmpfs (empty)** | Shadowed -- agent cannot read configs |
| `.agent_sidecar/` (real) | `/etc/agent-sidecar` | ro | System scripts read config from here |
| `.venv/` | `$WORK_DIR/.venv` | rw | Persistent named volume |
| `node_modules/` | per-package | rw | Persistent named volumes |
| `~/.aws` | `/home/node/.aws` | ro | AWS credentials |
| `~/.claude`, `~/.codex`, `~/.gemini` | `/home/node/.{tool}` | rw | Agent CLI configs |
| pnpm store, uv cache, npm cache | `/home/node/.local/share/...` | rw | Persistent named volumes |

**`EXTRA_MOUNTS`** adds to these (does not replace). Use standard Docker `-v` syntax. Prefer `:ro` unless the agent needs write access.

`WORK_DIR` is available in config files (set to the git repo root before config loads). Use `${WORK_DIR%/*}` for the parent directory (pure bash, no subshell).

```bash
# Mount a single sibling repo (read-only)
_SIBLING="${WORK_DIR%/*}"
EXTRA_MOUNTS="-v ${_SIBLING}/other-repo:${_SIBLING}/other-repo:ro"

# Mount multiple sibling repos
_SIBLING="${WORK_DIR%/*}"
EXTRA_MOUNTS=""
for _repo in sibling-a sibling-b sibling-c; do
    EXTRA_MOUNTS="${EXTRA_MOUNTS} -v ${_SIBLING}/${_repo}:${_SIBLING}/${_repo}:ro"
done
```

Requires `--reload` to pick up mount changes.

## Files

Files in `.agent_sidecar/`:

| File | Description | Committed |
|------|-------------|-----------|
| `INSTRUCTIONS.md` | This file (auto-synced, always overwritten on init) | Yes |
| `.gitignore` | Ignores `.local.*` files and `.generated/` | Yes |
| `sidecar.repo.conf` | Team config overrides | Yes |
| `sidecar.local.conf` | Personal config overrides | No (gitignored) |
| `firewall-allowlist-extra.repo.txt` | Team firewall domain additions | Yes |
| `firewall-allowlist-extra.local.txt` | Personal firewall domain additions | No (gitignored) |
| `build-extra.repo.sh` | Custom build-time installations | Yes |
| `init-background-extra.repo.sh` | Team background init commands | Yes |
| `init-foreground-extra.repo.sh` | Team foreground init commands | Yes |

## Firewall

Network access is deny-by-default. Three tiers of allowlists are merged at startup:

1. **Base** (`setup/firewall-allowlist-extra.base.txt`) -- package registries, AI services, GitHub read-only, common dev services
2. **Repo** (`.agent_sidecar/firewall-allowlist-extra.repo.txt`) -- team additions
3. **Local** (`.agent_sidecar/firewall-allowlist-extra.local.txt`) -- personal additions

One domain per line. Wildcards supported (`*.example.com`). Comments start with `#`.

### Toggle Presets

Dynamically enable/disable via `sidecar-ctl`:

| Preset | Domains |
|--------|---------|
| `github-write` | GitHub push access (git push controlled via read-only `.git/` mount) |
| `notion` | notion.so, *.notion.so, notion.com, *.notion.com, api.notion.com |
| `linear` | linear.app, api.linear.app |

```bash
sidecar-ctl firewall allow notion       # Allow a preset
sidecar-ctl firewall allow api.foo.com  # Allow a specific domain
sidecar-ctl firewall block notion       # Block a preset
sidecar-ctl firewall toggle             # Enable all presets for 10m (default)
sidecar-ctl firewall toggle 15m         # Enable all presets for 15 minutes
sidecar-ctl firewall clear              # Clear all toggled domains
sidecar-ctl firewall reload             # Reload firewall rules
sidecar-ctl firewall list               # Show toggle allowlist
```

## Build Extra

`build-extra.repo.sh` (or `.local.sh`) runs as **root** at Docker build time with full network access. Use for installing AppImages, binaries, or tools that the agent needs but cannot download at runtime.

- Resolution: `.local` > `.repo` (no base)
- Script is deleted after running (agent cannot access it)
- Requires `--full-reset` to rebuild when changed

## Init Scripts

Extra init scripts run **in addition** to base init scripts (additive, not replacement):

| Script | Shell | Runs | Purpose |
|--------|-------|------|---------|
| `init-background-extra.repo.sh` | bash | Background at startup | Pre-build deps, start services |
| `init-background-extra.local.sh` | bash | Background at startup | Personal background tasks |
| `init-foreground-extra.repo.sh` | zsh | Foreground (blocking) at startup | Aliases, env setup |
| `init-foreground-extra.local.sh` | zsh | Foreground (blocking) at startup | Personal shell setup |

## Container Lifecycle

```bash
run-agent-sidecar.sh [options]
```

| Flag | Base Image | Per-Repo Image | Container | Speed | Use Case |
|------|-----------|---------------|-----------|-------|----------|
| *(no flag)* | Reuse (or build if missing) | Skip if no customizations | Reuse existing | ~0-3s | Day-to-day re-entry |
| `--reload` | Skipped | Skipped | Recreate | ~5-10s | Pick up config/mount changes |
| `--full-reset` | Rebuild (cache bust) | Rebuild if needed | Recreate | ~2-5min | Update CLIs, Dockerfile, apt packages |

`--full-reset` updates all agent CLIs to latest versions. Named volumes (history, venv, pnpm, node_modules, cache, uv) survive both `--reload` and `--full-reset`.

## Launch Options

```bash
run-agent-sidecar.sh --run-claude    # Claude Code (--dangerously-skip-permissions)
run-agent-sidecar.sh --run-codex     # OpenAI Codex
run-agent-sidecar.sh --run-gemini    # Gemini CLI (--yolo)
run-agent-sidecar.sh --run-opencode  # OpenCode
run-agent-sidecar.sh --run-cursor    # Cursor
run-agent-sidecar.sh --no-run        # Setup only, don't exec into shell
run-agent-sidecar.sh --run <cmd>     # Run specific command
```

## Host Control

Run from the project directory on the host:

```bash
sidecar-ctl status                  # Check container status
sidecar-ctl containers              # List all sidecar containers
sidecar-ctl cleanup                 # Clean up Docker resources
```

## Security

| Resource | Agent Access | Notes |
|----------|--------------|-------|
| `.agent_sidecar/` | **None** | Shadowed with empty tmpfs; config at `/etc/agent-sidecar` for system scripts |
| APT/Debian repos | **None** | Packages installed at build time only, firewall blocks apt repos |
| Network | **Allowlist only** | Firewall blocks all except explicitly allowed domains |
| `.git/` | **Read-only** | Mounted read-only to prevent repo corruption |
| Playwright/Chromium | **Localhost only** | Can only access 127.0.0.1 by default; use `PLAYWRIGHT_EXTRA_HOSTS` to allow more |

## Debugging

```bash
sidecar-ctl status                                     # Check container status
sidecar-ctl containers                                 # List all sidecar containers
run-agent-sidecar.sh --no-run                          # Setup only
docker exec -it agent-sidecar-{name}-{hash} zsh        # Enter container manually
sidecar-ctl cleanup                                    # Clean up Docker resources
```

Container naming: `agent-sidecar-{repo-name}-{dir-hash}`

---

Full documentation: <https://github.com/ShravanSunder/ai-tools/blob/master/agent_sidecar/README.md>
