# AI Tools - Agent Instructions

This repository contains Claude Code plugins and the Agent Sidecar system for running AI coding assistants in sandboxed Docker containers.

## Repository Overview

**Purpose**: AI development tools distributed as Claude Code plugins, plus isolated Docker environments for AI agents.

## Repository Variants

This repo has two variants maintained separately:

- `~/dev/ai-tools` -- Personal projects (this repo, public)
- `~/dev/relay-ai-tools` -- Work projects (private fork)

Work repos should use `relay-ai-tools`. Personal repos should use `ai-tools`.

### Differences Between Variants

| Feature | ai-tools (personal) | relay-ai-tools (work) |
|---------|---------------------|----------------------|
| Firewall presets | github-write, notion, linear | github-write, notion, jira, slack |
| OpenCode support | Yes (`--run-opencode`) | No (removed) |
| Agent CLIs | Claude, Codex, Gemini, OpenCode, Cursor | Claude, Codex, Gemini, Cursor |

### Keeping Variants in Sync

The repos are maintained separately. When making changes to shared sidecar functionality (scripts, dockerfiles, firewall logic), sync the changes to the other variant:

- Copy updated files manually, or set up git remotes
- The `agent_sidecar/` directory is the primary sync target
- Plugin-related files (`plugins/`, `.claude-plugin/`) are NOT synced (personal-only)

## Repository Structure

```
ai-tools/
├── .claude-plugin/marketplace.json   # Plugin marketplace manifest
├── plugins/                          # Claude Code plugins
│   ├── ai-scaffold/                  # Project scaffolding (biome, ruff, vitest, pytest)
│   ├── skill-peekaboo/               # macOS visual UI testing via Peekaboo CLI
│   └── quorum-counsel/               # Multi-model review (counsel-reviewer + codex-solver)
├── skills/                           # Standalone Codex/common skills
│   ├── claude-solver/                # Delegates to claude -p (Opus) for analysis
│   ├── gemini-solver/                # Delegates to gemini -p for analysis
│   └── counsel-reviewer/             # Orchestrates claude + gemini in parallel for review
├── bin/                              # Discovery and sync scripts
│   └── list-codex-skills.sh          # Lists all skill paths for Codex sync
├── agent_sidecar/                    # Docker sidecar system
│   ├── run-agent-sidecar.sh          # Main launch script
│   ├── sidecar-ctl.sh                # Host-side firewall control
│   ├── sidecar.base.conf             # Base configuration
│   ├── init_repo_sidecar.sh          # Initialize .agent_sidecar/ in repos
│   ├── setup/                        # Firewall, init scripts, zsh config
│   └── firewall-toggle-presets/      # Toggle preset domain lists
├── agents.md                         # Agent instructions (this file)
└── CLAUDE.md → agents.md             # Symlink for Claude Code
```

## Skills (Codex / Cross-Tool)

The `skills/` directory contains standalone skills that are NOT part of any Claude Code plugin. These are primarily used by Codex but use the same SKILL.md format that works across tools.

### Skills vs Plugins

- **Plugins** (`plugins/`): Claude Code-specific. Have agents, hooks, slash commands, and optionally skills. Installed via `claude plugin install`.
- **Skills** (`skills/`): Tool-agnostic SKILL.md files. Delivered to Codex via `bin/list-codex-skills.sh` and the sync script in devfiles.

### How Skills Get Delivered to Codex

1. `bin/list-codex-skills.sh` discovers all skills (from `plugins/*/skills/*/` and `skills/*/`)
2. `~/.agents/sync-skills.sh` (in devfiles) calls the discovery script
3. Skills are symlinked into `~/.agents/skills/` for Codex to find

### Current Skills

| Skill | Location | Purpose |
|-------|----------|---------|
| claude-solver | `skills/claude-solver/` | Delegates to `claude -p` (Opus) for analysis — Codex-specific |
| gemini-solver | `skills/gemini-solver/` | Delegates to `gemini -p` for large codebase analysis |
| counsel-reviewer | `skills/counsel-reviewer/` | Orchestrates claude + gemini in parallel for code/plan review |
| peekaboo | `plugins/skill-peekaboo/skills/peekaboo/` | macOS visual UI testing (common — works in both Claude and Codex) |
| scaffold-project | `plugins/ai-scaffold/skills/scaffold-project/` | Project scaffolding (common) |

### Relationship to quorum-counsel

The `skills/` versions of claude-solver, gemini-solver, and counsel-reviewer are the **Codex counterparts** of the Claude Code agents in `plugins/quorum-counsel/agents/`. Each skill's README.md documents the relationship and differences. The key difference: quorum-counsel agents call `codex exec` + `gemini -p` (Claude is orchestrator), while these skills call `claude -p` + `gemini -p` (Codex is orchestrator).

### Adding a New Skill

1. Create `skills/{skill-name}/SKILL.md` with YAML frontmatter (`name`, `description`)
2. Add `skills/{skill-name}/README.md` documenting purpose and relationships
3. Run `bin/list-codex-skills.sh` to verify it's discovered
4. Run `~/.agents/sync-skills.sh` to symlink it (it writes into `~/.agents/skills/`)

## Plugin Development

### Marketplace

Plugins are distributed via `.claude-plugin/marketplace.json`. Each plugin entry needs a `name` and `source` (relative path to the plugin directory).

```bash
# Validate marketplace manifest
claude plugin validate .
```

### Plugin Structure

Each plugin lives under `plugins/` and follows the standard Claude Code plugin layout:

```
plugins/<plugin-name>/
├── .claude-plugin/plugin.json    # Plugin manifest (name, version, description)
├── commands/                     # Slash commands (*.md files)
├── agents/                       # Agent definitions (*.md with YAML frontmatter)
├── skills/                       # Skills (subdirs with SKILL.md)
│   └── <skill-name>/
│       ├── SKILL.md
│       └── references/           # Supporting docs for the skill
├── hooks/                        # Hook definitions (hooks.json + scripts)
└── README.md
```

### Key Rules

- Plugin `source` paths in `marketplace.json` must use `./plugins/<name>` format (explicit relative paths)
- `${CLAUDE_PLUGIN_ROOT}` resolves to the cached install path at runtime -- use it in hooks and scripts
- Path traversal (`..`) is NOT allowed in source paths
- Plugin `name` is the cache key for consumers -- changing it breaks existing installs
- Run `claude plugin validate .` after any marketplace changes

### Hook Development Gotchas

- **Transcript vs stdin**: The `transcript_path` JSONL file uses Anthropic API format -- tool usage is `{"type": "tool_use", "name": "Write", "input": {...}}` inside a `content` array. The field is `"name"`, NOT `"tool_name"`. The `"tool_name"` field only exists in hook stdin input. Do not grep the transcript for `"tool_name"`.
- **Display names differ from tool names**: Terminal shows `Create(file)` but the transcript stores `"name": "Write"`. Similarly, `MultiEdit` is a separate tool name.
- **Cache versioning**: Plugin files are cached by `version` in `plugin.json`. Changing hook scripts or config without bumping the version means Claude Code uses stale cached files. Always bump version after changes.
- **Stop hooks**: Require `"matcher": "*"` in `hooks.json`. Use `bash ${CLAUDE_PLUGIN_ROOT}/hooks/script.sh` (with `bash` prefix) to ensure execution even if permissions are stripped during caching. Check `stop_hook_active` and exit 0 when true to prevent infinite loops. Exit code 2 blocks the stop; stderr is fed back to Claude as the reason.
- **Debugging hooks**: Run `claude --debug`, check logs at `~/.claude/debug/`, grep for `Hook Stop` to see hook output and exit codes.

### Adding a New Plugin

1. Create `plugins/<name>/` with `.claude-plugin/plugin.json`
2. Add commands, agents, skills, or hooks as needed
3. Add an entry to `.claude-plugin/marketplace.json`
4. Add a `README.md` in the plugin directory
5. Update `plugins/README.md` with the new plugin listing
6. Validate: `claude plugin validate .`

## Agent Sidecar

Sandboxed Docker containers for AI coding assistants with network isolation. See `agent_sidecar/README.md` for full documentation.

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

Example: `agent-sidecar-my-project-a1b2c3d4`

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
init_repo_sidecar.sh --default          # Full setup (both .repo and .local files)
init_repo_sidecar.sh --repo-only        # Team setup only
init_repo_sidecar.sh --local-only       # Personal setup only
init_repo_sidecar.sh --sync-docs        # Only sync INSTRUCTIONS.md (quick doc update)
init_repo_sidecar.sh --default --override  # Force-overwrite all files
```

Every run copies `agent_sidecar/INSTRUCTIONS.md` into `.agent_sidecar/INSTRUCTIONS.md` (always overwritten). This gives agents in target repos a concise usage reference with links to config docs. Config files are only created if they don't exist, unless `--override` is used. See [`agent_sidecar/INSTRUCTIONS.md`](agent_sidecar/INSTRUCTIONS.md) for the full usage guide that gets synced.

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

- All `.local.*` files are gitignored for personal customization
- The `.generated/` folder contains runtime files (compiled firewall lists)
