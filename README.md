# AI Tools

Personal AI development tools and sandboxed environments.

## Agent Sidecar

Sandboxed Docker container for AI coding assistants (Claude Code, Codex, Gemini CLI) with network isolation.

### Quick Start

```bash
# From any git repository
~/dev/ai-tools/agent_sidecar/agent-sidecar-router.sh

# Or use the base sidecar directly
~/dev/ai-tools/agent_sidecar/run-agent-sidecar.sh
```

### Directory Structure

```
agent_sidecar/
├── node-py.base.dockerfile              # Base container image
├── run-agent-sidecar.sh                 # Main launch script
├── agent-sidecar-router.sh              # Routes to .agent_sidecar or base
├── sidecar-ctl.sh                       # Host-side control script
├── sidecar.base.conf                    # Base configuration
├── setup/
│   ├── firewall.sh                      # Egress firewall (runs in container)
│   ├── firewall-allowlist.base.txt      # Always-allowed domains
│   ├── firewall-allowlist-toggle.base.txt # Toggle base domains
│   ├── init-background.base.sh          # Background init (Xvfb, etc.)
│   ├── init-foreground.base.sh          # Shell init (Atuin, Zap)
│   └── .base.zshrc                      # Base zsh config
├── firewall-toggle-presets/             # Preset domain lists
│   ├── github-write.txt
│   ├── jira.txt
│   ├── linear.txt
│   ├── notion.txt
│   └── slack.txt
└── .generated/                          # Runtime files (gitignored)
    ├── firewall-allowlist.compiled.txt  # Merged allowlist
    └── firewall-allowlist-toggle.tmp.txt # Toggle state
```

### Host Control Script

The `sidecar-ctl.sh` script provides host-side control over running sidecars:

```bash
# Add agent_sidecar to PATH, or create an alias
export PATH="$PATH:$HOME/dev/ai-tools/agent_sidecar"
# or: alias sidecar-ctl="$HOME/dev/ai-tools/agent_sidecar/sidecar-ctl.sh"

# Check status (run from project directory)
cd ~/Documents/code/my-project
sidecar-ctl status

# Firewall commands
sidecar-ctl firewall list              # Show toggle allowlist
sidecar-ctl firewall allow notion      # Allow a preset
sidecar-ctl firewall allow api.foo.com # Allow a specific domain
sidecar-ctl firewall block notion      # Block a preset
sidecar-ctl firewall block api.foo.com # Block a specific domain
sidecar-ctl firewall toggle            # Enable all presets for 10m (default)
sidecar-ctl firewall toggle 15m        # Enable all presets for 15 minutes
sidecar-ctl firewall clear             # Clear all toggled domains
sidecar-ctl firewall reload            # Reload firewall rules
```

### Firewall Allowlists

**Three-tier allowlist system:**

1. **Base Allowlist** (`setup/firewall-allowlist.base.txt`): Domains always permitted
   - Package registries (npm, pypi, etc.)
   - AI services (anthropic, openai, etc.)
   - GitHub (read-only by default)
   - Common dev services

2. **Repo/Local Overrides**: Add domains per-project
   - `.agent_sidecar/firewall-allowlist.repo.txt` (team, committed)
   - `.agent_sidecar/firewall-allowlist.local.txt` (personal, gitignored)

3. **Toggle Presets**: Dynamically enabled/disabled via `sidecar-ctl`

**Presets** in `firewall-toggle-presets/`:
- `github-write` - GitHub push access
- `jira` - Atlassian Jira
- `notion` - Notion API
- `slack` - Slack API
- `linear` - Linear API

### Per-Project Customization

Create a `.agent_sidecar/` directory in your project:

```
.agent_sidecar/
├── README.md                            # Instructions (recommended)
├── .gitignore                           # Ignore local overrides
├── sidecar.repo.conf                    # Team config overrides (optional)
└── firewall-allowlist.repo.txt          # Extra domains for this repo (optional)
```

Override files follow the pattern: `{name}.repo.{ext}` (committed) or `{name}.local.{ext}` (gitignored).

**Force base sidecar:**
```bash
agent-sidecar-router.sh --use-router
```

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
