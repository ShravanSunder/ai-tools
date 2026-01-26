# AI Tools

Personal AI development tools and sandboxed environments.

## Repository Variants

This repo has two variants for different contexts:

| Repo | Purpose | Firewall Presets |
|------|---------|------------------|
| `~/dev/ai-tools` | Personal projects | github-write, notion, linear |
| `~/dev/relay-ai-tools` | Work projects (Relay) | All above + jira, slack |

**Work repos** (voyager-ai, risk-process-integrations) should use `relay-ai-tools`.

To sync changes between them, copy updated files or set up git remotes.

## Agent Sidecar

Sandboxed Docker container for AI coding assistants (Claude Code, Codex, Gemini CLI) with network isolation.

### Setup

Add to your PATH in `~/.zshrc`:

```bash
export PATH="$PATH:$HOME/dev/ai-tools/agent_sidecar"
```

Then reload your shell or run `source ~/.zshrc`.

### Quick Start

```bash
# From any git repository
run-agent-sidecar.sh --run-claude
```

### Directory Structure

```
agent_sidecar/
├── node-py.base.dockerfile              # Base container image
├── run-agent-sidecar.sh                 # Main launch script
├── sidecar-ctl.sh                       # Host-side control script
├── sidecar.base.conf                    # Base configuration
├── init_repo_sidecar.sh                 # Initialize .agent_sidecar/ in repos
├── setup/
│   ├── firewall.sh                      # Egress firewall (runs in container)
│   ├── firewall-allowlist-extra.base.txt # Always-allowed domains (additive)
│   ├── firewall-allowlist-toggle.base.txt # Toggle base domains
│   ├── init-background.base.sh          # Background init (Xvfb, etc.)
│   ├── init-foreground.base.sh          # Shell init (Atuin, Zap)
│   ├── extra.base.zshrc                 # Base zsh config (additive)
│   └── playwright-wrapper.sh            # Chromium localhost restriction
├── firewall-toggle-presets/             # Preset domain lists
│   ├── github-write.txt
│   ├── notion.txt
│   └── linear.txt
└── .generated/                          # Runtime files (gitignored)
    ├── firewall-allowlist.compiled.txt  # Merged allowlist
    └── firewall-allowlist-toggle.tmp.txt # Toggle state
```

### Host Control Script

The `sidecar-ctl.sh` script provides host-side control over running sidecars:

```bash
# Check status (run from project directory)
cd ~/Documents/code/my-project
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

### Firewall Allowlists

**Three-tier allowlist system:**

1. **Base Allowlist** (`setup/firewall-allowlist-extra.base.txt`): Domains always permitted
   - Package registries (npm, pypi, etc.)
   - AI services (anthropic, openai, etc.)
   - GitHub (read-only by default)
   - Common dev services

2. **Repo/Local Overrides**: Add domains per-project (additive `-extra` pattern)
   - `.agent_sidecar/firewall-allowlist-extra.repo.txt` (team, committed)
   - `.agent_sidecar/firewall-allowlist-extra.local.txt` (personal, gitignored)

3. **Toggle Presets**: Dynamically enabled/disabled via `sidecar-ctl`

**Presets** in `firewall-toggle-presets/`:
- `github-write` - GitHub push access
- `notion` - Notion API
- `linear` - Linear API

### Per-Project Customization

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

Override files follow the pattern: `{name}.repo.{ext}` (committed) or `{name}.local.{ext}` (gitignored).

### Launch Options

```bash
run-agent-sidecar.sh [options]

Options:
  --reset         Remove existing container and create fresh
  --no-run        Setup only, don't exec into shell
  --run <cmd>     Run specific command
  --run-claude    Run Claude Code
  --run-codex     Run OpenAI Codex
  --run-gemini    Run Gemini CLI
  --run-opencode  Run OpenCode
  --run-cursor    Run Cursor
```
