# AI Tools

Personal AI development tools and sandboxed environments.

## AI Coder Sidecar

Sandboxed Docker container for AI coding assistants (Claude Code, Codex, Gemini CLI) with network isolation.

### Quick Start

```bash
# From any git repository
~/dev/ai-tools/ai_coder_sidecar/ai-coder-sidecar-router.sh

# Or use the base sidecar directly
~/dev/ai-tools/ai_coder_sidecar/run-ai-coder-sidecar.sh
```

### Directory Structure

```
ai_coder_sidecar/
├── Dockerfile                           # Base container image
├── run-ai-coder-sidecar.sh              # Main launch script
├── ai-coder-sidecar-router.sh           # Routes to .devcontainer or base
├── firewall.sh                          # Egress firewall (runs in container)
├── firewall-allowlist-always.base.txt   # Always-allowed domains
├── firewall-allowlist-toggle.base.txt   # Dynamically toggled domains
├── firewall-presets/                    # Preset domain lists
│   ├── github-write.txt
│   ├── jira.txt
│   ├── linear.txt
│   ├── notion.txt
│   └── slack.txt
├── host-scripts/
│   └── sidecar-ctl.sh                   # Host-side control script
├── init-background.base.sh              # Background init (Xvfb, etc.)
├── init-foreground.base.sh              # Shell init (Atuin, Zap)
└── .base.zshrc                          # Base zsh config
```

### Host Control Script

The `sidecar-ctl.sh` script provides host-side control over running sidecars:

```bash
# Add to PATH or alias
alias sidecar-ctl='~/dev/ai-tools/ai_coder_sidecar/host-scripts/sidecar-ctl.sh'

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

**Two-tier allowlist system:**

1. **Always Allowlist** (`firewall-allowlist-always.base.txt`): Domains always permitted
   - Package registries (npm, pypi, etc.)
   - AI services (anthropic, openai, etc.)
   - GitHub (read-only by default)
   - Common dev services

2. **Toggle Allowlist** (`firewall-allowlist-toggle.base.txt`): Dynamically enabled/disabled
   - Managed via `sidecar-ctl firewall allow/block`
   - Auto-reverts with `toggle` command timeout

**Presets** in `firewall-presets/`:
- `github-write` - GitHub push access
- `jira` - Atlassian Jira
- `notion` - Notion API
- `slack` - Slack API
- `linear` - Linear API

### Per-Project Customization

Create a `.devcontainer/` directory in your project with:

```
.devcontainer/
├── Dockerfile                           # Extend base or custom
├── run-ai-coder-sidecar.sh              # Custom launch script
├── firewall.sh                          # Copy from base
├── firewall-allowlist-always.base.txt   # Project-specific always-allowed
├── firewall-allowlist-toggle.base.txt   # Project-specific toggles
└── .zshrc                               # Additional shell config (optional)
```

The router script (`ai-coder-sidecar-router.sh`) will automatically use `.devcontainer/run-ai-coder-sidecar.sh` if present.

**Force base sidecar:**
```bash
ai-coder-sidecar-router.sh --use-router
```

### Launch Options

```bash
run-ai-coder-sidecar.sh [options]

Options:
  --reset     Remove existing container and create fresh
  --no-run    Setup only, don't exec into shell
  --rebuild   Force rebuild Docker image
```
