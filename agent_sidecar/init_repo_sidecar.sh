#!/bin/bash
# =============================================================================
# init_repo_sidecar.sh - Initialize .agent_sidecar in a repository
# =============================================================================
# Creates the .agent_sidecar directory with template configuration files
# and adds appropriate .gitignore entries.
#
# Usage: init_repo_sidecar.sh <--default | --repo-only | --local-only>
#   --default     Create both .repo and .local files (full setup)
#   --repo-only   Create only .repo files (team setup, no personal overrides)
#   --local-only  Create only .local files (personal setup, all gitignored)
#
# No arguments shows help. Files are never overwritten if they already exist.
# =============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# =============================================================================
# Help
# =============================================================================
show_help() {
    echo "Usage: init_repo_sidecar.sh <--default | --repo-only | --local-only>"
    echo ""
    echo "Initialize .agent_sidecar/ in the current git repository with template"
    echo "configuration files for the Agent Sidecar Docker environment."
    echo ""
    echo "Options:"
    echo "  --default     Create both .repo and .local files (full setup)"
    echo "  --repo-only   Create only .repo files (team setup, no personal overrides)"
    echo "  --local-only  Create only .local files (personal setup, all gitignored)"
    echo "  -h, --help    Show this help message"
    echo ""
    echo "Files are never overwritten if they already exist."
}

# =============================================================================
# Parse arguments
# =============================================================================
MODE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --default)    MODE="default";    shift ;;
        --repo-only)  MODE="repo-only";  shift ;;
        --local-only) MODE="local-only"; shift ;;
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
esac

# Find repo root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$REPO_ROOT" ]; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

SIDECAR_DIR="$REPO_ROOT/.agent_sidecar"

echo "🚀 Initializing Agent Sidecar in: $REPO_ROOT (mode: $MODE)"
mkdir -p "$SIDECAR_DIR"

# =============================================================================
# Create .gitignore (always, in all modes)
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
if [ "$CREATE_REPO" = true ]; then
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
# Extra APT Packages (installed at Docker build time via overlay image)
# -----------------------------------------------------------------------------
# Space-separated list. Triggers a per-repo overlay build on top of the shared base.
# Requires --full-reset to rebuild when changed.
# Example: EXTRA_APT_PACKAGES="htop tree postgresql-client"
# EXTRA_APT_PACKAGES=""

# -----------------------------------------------------------------------------
# Dockerfile Variant (default: node-py)
# -----------------------------------------------------------------------------
# Available: node-py, rust (TODO), python (TODO)
# Base image: agent-sidecar-base:{variant} (shared, built once)
# DOCKERFILE_VARIANT="node-py"

# -----------------------------------------------------------------------------
# Custom Dockerfile Override
# -----------------------------------------------------------------------------
# Place a custom Dockerfile in .agent_sidecar/:
#   {variant}.repo.dockerfile  (team, committed)
#   {variant}.local.dockerfile (personal, gitignored)
#
# IMPORTANT: Custom Dockerfiles MUST start with:
#   ARG BASE_IMAGE=agent-sidecar-base:node-py
#   FROM ${BASE_IMAGE}

# -----------------------------------------------------------------------------
# Extra Mounts
# -----------------------------------------------------------------------------
# Additional Docker volume mounts. ADDED to core mounts (aws, micro).
#
# Mount options: :ro (read-only, recommended) or :rw (read-write).
# Prefer :ro unless the agent needs to write to the mounted path.
#
# WORK_DIR is set before config loads (git repo root).
# Use ${WORK_DIR%/*} to get the parent directory (pure bash, no subshell).
#
# Example - mount a single sibling repo (read-only):
#   _SIBLING="${WORK_DIR%/*}"
#   EXTRA_MOUNTS="-v ${_SIBLING}/other-repo:${_SIBLING}/other-repo:ro"
#
# Example - mount multiple sibling repos (loop, read-only):
#   _SIBLING="${WORK_DIR%/*}"
#   EXTRA_MOUNTS=""
#   for _repo in sibling-a sibling-b sibling-c; do
#       EXTRA_MOUNTS="${EXTRA_MOUNTS} -v ${_SIBLING}/${_repo}:${_SIBLING}/${_repo}:ro"
#   done
#
# Example - mount read-write (when agent needs to write):
#   EXTRA_MOUNTS="-v ${_SIBLING}/shared-output:${_SIBLING}/shared-output:rw"
# EXTRA_MOUNTS=""

# -----------------------------------------------------------------------------
# Environment Overrides (applied at shell init inside container)
# -----------------------------------------------------------------------------
# Space-separated KEY=VALUE pairs - use for localhost → host.docker.internal
# Example: SIDECAR_ENV_OVERRIDES="DATABASE_HOST=host.docker.internal REDIS_HOST=host.docker.internal"
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
    if [ ! -f "$LOCAL_CONF" ]; then
        cat > "$LOCAL_CONF" << 'EOF'
# =============================================================================
# sidecar.local.conf - Personal Agent Sidecar Overrides
# =============================================================================
# Personal configuration (gitignored). Overrides sidecar.repo.conf.
# =============================================================================

# Mount options: :ro (read-only, recommended) or :rw (read-write).
#
# Example - mount sibling repos (read-only, WORK_DIR is the git repo root):
#   _SIBLING="${WORK_DIR%/*}"
#   EXTRA_MOUNTS=""
#   for _repo in sibling-a sibling-b; do
#       EXTRA_MOUNTS="${EXTRA_MOUNTS} -v ${_SIBLING}/${_repo}:${_SIBLING}/${_repo}:ro"
#   done

# Example: Personal apt packages
# EXTRA_APT_PACKAGES="neovim"
EOF
        echo "   Created: sidecar.local.conf (gitignored)"
    fi
fi

# =============================================================================
# Create firewall-allowlist-extra.repo.txt template (team firewall additions)
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
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
if [ "$CREATE_LOCAL" = true ]; then
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
fi

# =============================================================================
# Create build-extra.repo.sh template (team build-time script)
# =============================================================================
if [ "$CREATE_REPO" = true ]; then
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
if [ "$CREATE_REPO" = true ]; then
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

# =============================================================================
# Summary
# =============================================================================
echo ""
echo "✅ Agent Sidecar initialized in: $SIDECAR_DIR"
echo ""
echo "📋 Next steps:"
if [ "$CREATE_REPO" = true ]; then
    echo "   1. Edit sidecar.repo.conf to configure team settings"
    echo "   2. Edit firewall-allowlist-extra.repo.txt to add allowed domains"
    echo "   3. Edit build-extra.repo.sh for custom build-time installations"
fi
if [ "$CREATE_LOCAL" = true ]; then
    echo "   - Edit sidecar.local.conf for personal overrides"
    echo "   - Edit firewall-allowlist-extra.local.txt for personal domains"
fi
echo "   - Run: run-agent-sidecar.sh --reload"
echo ""
echo "📚 Documentation: See CLAUDE.md and sidecar.base.conf in ai-tools"
