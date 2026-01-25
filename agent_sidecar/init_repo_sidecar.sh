#!/bin/bash
# =============================================================================
# init_repo_sidecar.sh - Initialize .agent_sidecar in a repository
# =============================================================================
# Creates the .agent_sidecar directory with template configuration files
# and adds appropriate .gitignore entries.
#
# Usage: init_repo_sidecar.sh [--local-only]
#   --local-only  Only create .local files (for personal setup, all gitignored)
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Find repo root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

SIDECAR_DIR="$REPO_ROOT/.agent_sidecar"
LOCAL_ONLY=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --local-only)
            LOCAL_ONLY=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

echo "🚀 Initializing Agent Sidecar in: $REPO_ROOT"
mkdir -p "$SIDECAR_DIR"

# =============================================================================
# Create .gitignore
# =============================================================================
GITIGNORE="$SIDECAR_DIR/.gitignore"
if [ ! -f "$GITIGNORE" ]; then
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
if [ "$LOCAL_ONLY" = false ]; then
    REPO_CONF="$SIDECAR_DIR/sidecar.repo.conf"
    if [ ! -f "$REPO_CONF" ]; then
        cat > "$REPO_CONF" << 'EOF'
# =============================================================================
# sidecar.repo.conf - Agent Sidecar Configuration
# =============================================================================
# Team configuration for this repository. Committed to version control.
# For personal overrides, use sidecar.local.conf (gitignored).
#
# See sidecar.base.conf in ai-tools for all available options.
# =============================================================================

# -----------------------------------------------------------------------------
# Extra APT Packages (installed at Docker build time)
# -----------------------------------------------------------------------------
# Space-separated list. Requires --reset to rebuild when changed.
# Example: EXTRA_APT_PACKAGES="htop tree postgresql-client"
# EXTRA_APT_PACKAGES=""

# -----------------------------------------------------------------------------
# Dockerfile Variant (default: node-py)
# -----------------------------------------------------------------------------
# Available: node-py, rust (TODO), python (TODO)
# DOCKERFILE_VARIANT="node-py"

# -----------------------------------------------------------------------------
# Extra Mounts
# -----------------------------------------------------------------------------
# Additional Docker volume mounts (space-separated).
# Default: -v $HOME/.aws:/home/node/.aws:ro -v $HOME/.config/micro:/home/node/.config/micro
# EXTRA_MOUNTS=""
EOF
        echo "   Created: sidecar.repo.conf"
    fi
fi

# =============================================================================
# Create sidecar.local.conf template (personal config)
# =============================================================================
LOCAL_CONF="$SIDECAR_DIR/sidecar.local.conf"
if [ ! -f "$LOCAL_CONF" ]; then
    cat > "$LOCAL_CONF" << 'EOF'
# =============================================================================
# sidecar.local.conf - Personal Agent Sidecar Overrides
# =============================================================================
# Personal configuration (gitignored). Overrides sidecar.repo.conf.
# =============================================================================

# Example: Add personal mounts
# EXTRA_MOUNTS="-v $HOME/.aws:/home/node/.aws:ro -v $HOME/.ssh:/home/node/.ssh:ro"

# Example: Personal apt packages
# EXTRA_APT_PACKAGES="neovim"
EOF
    echo "   Created: sidecar.local.conf (gitignored)"
fi

# =============================================================================
# Create firewall-allowlist-extra.repo.txt template (team firewall additions)
# =============================================================================
if [ "$LOCAL_ONLY" = false ]; then
    FIREWALL_REPO="$SIDECAR_DIR/firewall-allowlist-extra.repo.txt"
    if [ ! -f "$FIREWALL_REPO" ]; then
        cat > "$FIREWALL_REPO" << 'EOF'
# =============================================================================
# firewall-allowlist-extra.repo.txt - Team Firewall Additions
# =============================================================================
# Domains to allow for this repository. Merged with base allowlist.
# One domain per line. Comments start with #.
#
# Naming: -extra suffix indicates additive (all tiers merged together)
# =============================================================================

# Example: Allow project-specific APIs
# api.myproject.com
# *.myproject.io
EOF
        echo "   Created: firewall-allowlist-extra.repo.txt"
    fi
fi

# =============================================================================
# Create firewall-allowlist-extra.local.txt template (personal firewall additions)
# =============================================================================
FIREWALL_LOCAL="$SIDECAR_DIR/firewall-allowlist-extra.local.txt"
if [ ! -f "$FIREWALL_LOCAL" ]; then
    cat > "$FIREWALL_LOCAL" << 'EOF'
# =============================================================================
# firewall-allowlist-extra.local.txt - Personal Firewall Additions
# =============================================================================
# Personal domains to allow (gitignored). Merged with repo and base allowlists.
#
# Naming: -extra suffix indicates additive (all tiers merged together)
# =============================================================================

# Example: Personal services
# my-private-api.example.com
EOF
    echo "   Created: firewall-allowlist-extra.local.txt (gitignored)"
fi

# =============================================================================
# Create build-extra.repo.sh template (team build-time script)
# =============================================================================
if [ "$LOCAL_ONLY" = false ]; then
    BUILD_EXTRA_REPO="$SIDECAR_DIR/build-extra.repo.sh"
    if [ ! -f "$BUILD_EXTRA_REPO" ]; then
        cat > "$BUILD_EXTRA_REPO" << 'EOF'
#!/bin/bash
# =============================================================================
# build-extra.repo.sh - Custom Build-Time Installations
# =============================================================================
# Runs as root at Docker build time with FULL NETWORK ACCESS.
# Use for: AppImages, binaries, tools that agent needs but can't download.
#
# This script is:
#   - Executed during `docker build` (host-controlled)
#   - Deleted after running (agent cannot access it)
#   - NOT subject to firewall restrictions
#
# Requires: --reset to rebuild when changed
# =============================================================================

set -e

# Example: Install an AppImage (architecture-aware)
# ARCH=$(dpkg --print-architecture)
# case "$ARCH" in
#     amd64) URL="https://example.com/app-amd64.AppImage" ;;
#     arm64) URL="https://example.com/app-arm64.AppImage" ;;
# esac
#
# apt-get update && apt-get install -y --no-install-recommends squashfs-tools
# curl -L "$URL" -o /tmp/app.AppImage
# cd /tmp
# OFFSET=$(LC_ALL=C grep -aobF 'hsqs' app.AppImage | head -1 | cut -d: -f1)
# tail -c +$((OFFSET + 1)) app.AppImage > app.squashfs
# unsquashfs -d /opt/myapp app.squashfs
# ln -s /opt/myapp/myapp /usr/local/bin/myapp
# rm /tmp/app.AppImage /tmp/app.squashfs
# apt-get clean && rm -rf /var/lib/apt/lists/*

echo "ℹ️  build-extra.repo.sh: No custom installations configured"
EOF
        chmod +x "$BUILD_EXTRA_REPO"
        echo "   Created: build-extra.repo.sh (template)"
    fi
fi

# =============================================================================
# Create init script templates
# =============================================================================
if [ "$LOCAL_ONLY" = false ]; then
    # init-background-extra.repo.sh
    INIT_BG="$SIDECAR_DIR/init-background-extra.repo.sh"
    if [ ! -f "$INIT_BG" ]; then
        cat > "$INIT_BG" << 'EOF'
#!/bin/bash
# =============================================================================
# init-background-extra.repo.sh - Team Background Init
# =============================================================================
# Runs IN ADDITION to base init-background.sh (not replacement).
# Executes in background at container startup.
# =============================================================================

# Example: Pre-build project dependencies
# cd "$WORK_DIR" && pnpm install --frozen-lockfile

echo "ℹ️  init-background-extra.repo.sh: No team background init configured"
EOF
        chmod +x "$INIT_BG"
        echo "   Created: init-background-extra.repo.sh (template)"
    fi

    # init-foreground-extra.repo.sh
    INIT_FG="$SIDECAR_DIR/init-foreground-extra.repo.sh"
    if [ ! -f "$INIT_FG" ]; then
        cat > "$INIT_FG" << 'EOF'
#!/bin/zsh
# =============================================================================
# init-foreground-extra.repo.sh - Team Foreground Init
# =============================================================================
# Runs IN ADDITION to base init-foreground.sh (not replacement).
# Executes in foreground (blocking) at container startup.
# =============================================================================

# Example: Set up project-specific aliases
# alias dev="pnpm run dev"
# alias test="pnpm run test"

echo "ℹ️  init-foreground-extra.repo.sh: No team foreground init configured"
EOF
        chmod +x "$INIT_FG"
        echo "   Created: init-foreground-extra.repo.sh (template)"
    fi
fi

echo ""
echo "✅ Agent Sidecar initialized in: $SIDECAR_DIR"
echo ""
echo "📋 Next steps:"
echo "   1. Edit sidecar.repo.conf to configure team settings"
echo "   2. Edit firewall-allowlist-extra.repo.txt to add allowed domains"
echo "   3. Edit build-extra.repo.sh for custom build-time installations"
echo "   4. Run: run-agent-sidecar.sh --reset"
echo ""
echo "📚 Documentation: See CLAUDE.md and sidecar.base.conf in ai-tools"
