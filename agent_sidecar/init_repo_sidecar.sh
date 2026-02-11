#!/bin/bash
# =============================================================================
# init_repo_sidecar.sh - Initialize .agent_sidecar in a repository
# =============================================================================
# Creates the .agent_sidecar directory with template configuration files
# and adds appropriate .gitignore entries.
#
# Usage: init_repo_sidecar.sh <--default | --repo-only | --local-only | --sync-docs> [--override]
#   --default     Create both .repo and .local files (full setup)
#   --repo-only   Create only .repo files (team setup, no personal overrides)
#   --local-only  Create only .local files (personal setup, all gitignored)
#   --sync-docs   Only sync INSTRUCTIONS.md (quick doc update for existing repos)
#   --override    Force-overwrite all files (combine with any mode)
#
# INSTRUCTIONS.md is always synced (overwritten) on every run.
# Config files are skipped if they already exist, unless --override is used.
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# =============================================================================
# Help
# =============================================================================
show_help() {
    echo "Usage: init_repo_sidecar.sh <--default | --repo-only | --local-only | --sync-docs> [--override]"
    echo ""
    echo "Initialize .agent_sidecar/ in the current git repository with template"
    echo "configuration files for the Agent Sidecar Docker environment."
    echo ""
    echo "Modes:"
    echo "  --default     Create both .repo and .local files (full setup)"
    echo "  --repo-only   Create only .repo files (team setup, no personal overrides)"
    echo "  --local-only  Create only .local files (personal setup, all gitignored)"
    echo "  --sync-docs   Only sync INSTRUCTIONS.md (quick doc update)"
    echo ""
    echo "Flags:"
    echo "  --override    Force-overwrite all files (combine with any mode)"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "INSTRUCTIONS.md is always synced on every run."
    echo "Config files are skipped if they already exist, unless --override is used."
}

# =============================================================================
# Parse arguments
# =============================================================================
MODE=""
OVERRIDE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --default)    MODE="default";    shift ;;
        --repo-only)  MODE="repo-only";  shift ;;
        --local-only) MODE="local-only"; shift ;;
        --sync-docs)  MODE="sync-docs";  shift ;;
        --override)   OVERRIDE=true;     shift ;;
        -h|--help)    MODE="help";       shift ;;
        *)
            echo "❌ Unknown option: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
done

if [ -z "$MODE" ] || [ "$MODE" = "help" ]; then
    show_help
    exit 0
fi

# Derive boolean guards from MODE
CREATE_REPO=false
CREATE_LOCAL=false

case "$MODE" in
    default)    CREATE_REPO=true; CREATE_LOCAL=true ;;
    repo-only)  CREATE_REPO=true ;;
    local-only) CREATE_LOCAL=true ;;
    sync-docs)  ;; # Only sync INSTRUCTIONS.md
esac

# Find repo root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

SIDECAR_DIR="$REPO_ROOT/.agent_sidecar"

echo "🚀 Initializing Agent Sidecar in: $REPO_ROOT (mode: $MODE$([ "$OVERRIDE" = true ] && echo ", override"))"
mkdir -p "$SIDECAR_DIR"

# =============================================================================
# Helper: should_write FILE
# Returns 0 (true) if file should be written: doesn't exist OR --override is set
# =============================================================================
should_write() {
    [ ! -f "$1" ] || [ "$OVERRIDE" = true ]
}

# =============================================================================
# Sync INSTRUCTIONS.md (always, in all modes -- always overwritten)
# =============================================================================
cp "$SCRIPT_DIR/INSTRUCTIONS.md" "$SIDECAR_DIR/INSTRUCTIONS.md"
echo "   Synced: INSTRUCTIONS.md"

# Exit early for sync-docs mode
if [ "$MODE" = "sync-docs" ]; then
    echo ""
    echo "✅ INSTRUCTIONS.md synced in: $SIDECAR_DIR"
    exit 0
fi

# =============================================================================
# Create .gitignore (always, in all modes)
# =============================================================================
GITIGNORE="$SIDECAR_DIR/.gitignore"
if should_write "$GITIGNORE"; then
    cat > "$GITIGNORE" << 'EOF'
# Local overrides (personal, not committed)
*.local.*
*.local.sh
sidecar.local.conf
firewall-allowlist-extra.local.txt
extra.local.zshrc

# Generated files
.generated/
EOF
    echo "   Created: .gitignore"
fi

# =============================================================================
# Create sidecar.repo.conf (team config)
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
    REPO_CONF="$SIDECAR_DIR/sidecar.repo.conf"
    if should_write "$REPO_CONF"; then
        cat > "$REPO_CONF" << 'EOF'
# sidecar.repo.conf - Team config (committed). Personal overrides: sidecar.local.conf
# Docs: [Configuration](INSTRUCTIONS.md#configuration)
# EXTRA_APT_PACKAGES=""
# DOCKERFILE_VARIANT="node-py"
# EXTRA_MOUNTS=""
# SIDECAR_ENV_OVERRIDES=""
EOF
        echo "   Created: sidecar.repo.conf"
    fi
fi

# =============================================================================
# Create sidecar.local.conf template (personal config)
# =============================================================================
if [ "$CREATE_LOCAL" = true ]; then
    LOCAL_CONF="$SIDECAR_DIR/sidecar.local.conf"
    if should_write "$LOCAL_CONF"; then
        cat > "$LOCAL_CONF" << 'EOF'
# sidecar.local.conf - Personal config overrides (gitignored)
# Docs: [Configuration](INSTRUCTIONS.md#configuration)
# EXTRA_APT_PACKAGES=""
# EXTRA_MOUNTS=""
# SIDECAR_ENV_OVERRIDES=""
EOF
        echo "   Created: sidecar.local.conf (gitignored)"
    fi
fi

# =============================================================================
# Create firewall-allowlist-extra.repo.txt template (team firewall additions)
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
    FIREWALL_REPO="$SIDECAR_DIR/firewall-allowlist-extra.repo.txt"
    if should_write "$FIREWALL_REPO"; then
        cat > "$FIREWALL_REPO" << 'EOF'
# firewall-allowlist-extra.repo.txt - Team firewall domain additions (merged with base)
# Docs: [Firewall](INSTRUCTIONS.md#firewall)
EOF
        echo "   Created: firewall-allowlist-extra.repo.txt"
    fi
fi

# =============================================================================
# Create firewall-allowlist-extra.local.txt template (personal firewall additions)
# =============================================================================
if [ "$CREATE_LOCAL" = true ]; then
    FIREWALL_LOCAL="$SIDECAR_DIR/firewall-allowlist-extra.local.txt"
    if should_write "$FIREWALL_LOCAL"; then
        cat > "$FIREWALL_LOCAL" << 'EOF'
# firewall-allowlist-extra.local.txt - Personal firewall domain additions (gitignored)
# Docs: [Firewall](INSTRUCTIONS.md#firewall)
EOF
        echo "   Created: firewall-allowlist-extra.local.txt (gitignored)"
    fi
fi

# =============================================================================
# Create build-extra.repo.sh template (team build-time script)
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
    BUILD_EXTRA_REPO="$SIDECAR_DIR/build-extra.repo.sh"
    if should_write "$BUILD_EXTRA_REPO"; then
        cat > "$BUILD_EXTRA_REPO" << 'EOF'
#!/bin/bash
# build-extra.repo.sh - Custom build-time installations (runs as root at docker build)
# Docs: [Build Extra](INSTRUCTIONS.md#build-extra)
set -e
EOF
        chmod +x "$BUILD_EXTRA_REPO"
        echo "   Created: build-extra.repo.sh (template)"
    fi
fi

# =============================================================================
# Create init script templates
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
    # init-background-extra.repo.sh
    INIT_BG="$SIDECAR_DIR/init-background-extra.repo.sh"
    if should_write "$INIT_BG"; then
        cat > "$INIT_BG" << 'EOF'
#!/bin/bash
# init-background-extra.repo.sh - Team background init (runs after base init at startup)
# Docs: [Init Scripts](INSTRUCTIONS.md#init-scripts)
EOF
        chmod +x "$INIT_BG"
        echo "   Created: init-background-extra.repo.sh (template)"
    fi

    # init-foreground-extra.repo.sh
    INIT_FG="$SIDECAR_DIR/init-foreground-extra.repo.sh"
    if should_write "$INIT_FG"; then
        cat > "$INIT_FG" << 'EOF'
#!/bin/zsh
# init-foreground-extra.repo.sh - Team foreground init (runs after base init at startup)
# Docs: [Init Scripts](INSTRUCTIONS.md#init-scripts)
EOF
        chmod +x "$INIT_FG"
        echo "   Created: init-foreground-extra.repo.sh (template)"
    fi
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "✅ Agent Sidecar initialized in: $SIDECAR_DIR"
echo ""
echo "📋 Next steps:"
echo "   - See INSTRUCTIONS.md for usage documentation"
if [ "$CREATE_REPO" = true ]; then
    echo "   - Edit sidecar.repo.conf to configure team settings"
    echo "   - Edit firewall-allowlist-extra.repo.txt to add allowed domains"
fi
if [ "$CREATE_LOCAL" = true ]; then
    echo "   - Edit sidecar.local.conf for personal overrides"
fi
echo "   - Run: run-agent-sidecar.sh --reload"
echo ""
echo "📚 Full documentation: https://github.com/ShravanSunder/ai-tools/blob/master/agent_sidecar/README.md"
