#!/bin/bash
set -e

# =============================================================================
# AI Coder Sidecar - Repo-agnostic container launcher for AI coding agents
# =============================================================================
# Usage: run-agent-sidecar.sh [OPTIONS]
#   --reload        Recreate container (fast, keeps image, picks up config/mount changes)
#   --full-reset    Rebuild image + recreate container (slow, updates agent CLIs)
#   --no-run        Setup only, don't exec into container
#   --run <cmd>     Run specific command in container
#   --run-claude    Run Claude Code with --dangerously-skip-permissions
#   --run-gemini    Run Gemini CLI with --yolo
#   --run-codex     Run OpenAI Codex
#   --run-opencode  Run OpenCode
#   --run-cursor    Run Cursor
# =============================================================================

# Configuration - Use directory where this script lives
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Git-Native Path Discovery
WORK_DIR=$(git rev-parse --show-toplevel 2>/dev/null || pwd)
COMMON_GIT_DIR=$(git rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)
GIT_DIR_PATH=$(git rev-parse --absolute-git-dir 2>/dev/null || true)

# Derive repo name for container naming
REPO_NAME=$(basename "$WORK_DIR" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g')

# Prepare Git Mounts
# We mount Git metadata to their ORIGINAL host paths inside the container.
# This ensures that absolute paths stored in Git metadata (common in worktrees)
# resolve correctly without needing global environment variables that break sub-clones.
GIT_MOUNTS=""
if [ -n "$COMMON_GIT_DIR" ]; then
    if [ "$COMMON_GIT_DIR" = "$GIT_DIR_PATH" ]; then
        # Normal Repo: .git is a directory. Mount it as RO over the workspace mount.
        GIT_MOUNTS="-v $COMMON_GIT_DIR:$WORK_DIR/.git:ro"
    else
        # Worktree: .git is a file. Mount metadata to original host paths.
        GIT_MOUNTS="-v $COMMON_GIT_DIR:$COMMON_GIT_DIR:ro -v $GIT_DIR_PATH:$GIT_DIR_PATH:ro"
    fi
fi

# Generate a unique hash based on the worktree root path
DIR_HASH=$(echo -n "$WORK_DIR" | md5sum | cut -c1-8)

CONTAINER_NAME="agent-sidecar-${REPO_NAME}-${DIR_HASH}"
HISTORY_VOLUME="agent-sidecar-history-${DIR_HASH}"
LOCAL_CLAUDE_DIR="$HOME/.claude"
LOCAL_CLAUDE_CREDENTIALS="$HOME/.claude/.credentials.json"
LOCAL_ATUIN_DIR="$HOME/.config/atuin"
LOCAL_ATUIN_DATA_DIR="$HOME/.local/share/atuin"
LOCAL_ZSH_HISTORY="$HOME/.zsh_history"
LOCAL_CLAUDE_JSON="$HOME/.claude.json"
LOCAL_GEMINI_DIR="$HOME/.gemini"
LOCAL_CODEX_DIR="$HOME/.codex"
LOCAL_OPENCODE_DIR="$HOME/.config/opencode"

# Parse arguments
FULL_RESET=false
RELOAD=false
NO_RUN=false
RUN_CMD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --full-reset|-full-reset)
            FULL_RESET=true
            shift
            ;;
        --reload|-reload)
            RELOAD=true
            shift
            ;;
        --no-run|-no-run)
            NO_RUN=true
            shift
            ;;
        --run|-run)
            RUN_CMD="$2"
            shift 2
            ;;
        --run-claude|-run-claude)
            # --continue (or -c) loads the most recent conversation in the current directory
            RUN_CMD="claude --dangerously-skip-permissions --continue"
            shift
            ;;
        --run-gemini|-run-gemini)
            RUN_CMD="gemini --yolo"
            shift
            ;;
        --run-codex|-run-codex)
            # resume --last skips the picker and jumps to the most recent session
            RUN_CMD="codex --dangerously-bypass-approvals-and-sandbox resume --last"
            shift
            ;;
        --run-opencode|-run-opencode)
            # --continue (or -c) continues the last session
            RUN_CMD="opencode --yolo --continue"
            shift
            ;;
        --run-cursor|-run-cursor)
            # Cursor resumes the last state of the workspace automatically when opened via terminal in that directory
            RUN_CMD="cursor ."
            shift
            ;;
        *)
            shift
            ;;
    esac
done

echo "🚀 Setting up AI Coder Sidecar Environment..."
echo "   Repo: $REPO_NAME ($WORK_DIR)"

# =============================================================================
# File Resolution - Three-tier: .local > .repo > .base
# =============================================================================
# Naming convention:
#   .base  = Source of truth (ai-tools)
#   .repo  = Team overrides (committed to repo's .agent_sidecar/)
#   .local = Personal overrides (gitignored)
#
# Usage: resolve_file "basename" "ext"
#   e.g., resolve_file "init-background" "sh"
#   Returns first found: init-background.local.sh > init-background.repo.sh > init-background.base.sh
# =============================================================================
REPO_SIDECAR="$WORK_DIR/.agent_sidecar"

if [ ! -d "$REPO_SIDECAR" ]; then
    echo "❌ Error: .agent_sidecar/ not found in $WORK_DIR"
    echo "   Run: $SCRIPT_DIR/init_repo_sidecar.sh --default"
    exit 1
fi

resolve_file() {
    local basename="$1"  # e.g., "init-background" or "dockerfile-image"
    local ext="$2"       # e.g., "sh" or "txt" (empty for no extension)
    
    # Build suffix: ".sh" or "" (for files without extensions)
    local suffix=""
    if [ -n "$ext" ]; then
        suffix=".${ext}"
    fi
    
    # 1. Local override (gitignored)
    local local_file="$REPO_SIDECAR/${basename}.local${suffix}"
    if [ -f "$local_file" ]; then
        echo "$local_file"
        return
    fi
    
    # 2. Repo override (checked in)
    local repo_file="$REPO_SIDECAR/${basename}.repo${suffix}"
    if [ -f "$repo_file" ]; then
        echo "$repo_file"
        return
    fi
    
    # 3. Base (ai-tools/setup/)
    local base_file="$SCRIPT_DIR/setup/${basename}.base${suffix}"
    if [ -f "$base_file" ]; then
        echo "$base_file"
        return
    fi
    
    echo ""
}

# =============================================================================
# Default Configuration - Set before loading configs so they can be overridden
# =============================================================================
IMAGE_NAME="agent-sidecar-image"
DOCKERFILE_VARIANT="node-py"
# Core mounts - always included (not configurable)
CORE_MOUNTS="-v $HOME/.aws:/home/node/.aws:ro -v $HOME/.config/micro:/home/node/.config/micro"
# Extra mounts - per-repo additions (empty by default, purely additive)
EXTRA_MOUNTS=""
EXTRA_APT_PACKAGES=""
PLAYWRIGHT_EXTRA_HOSTS=""

# =============================================================================
# Configuration Loading - Three-tier: .local > .repo > .base
# =============================================================================
load_config() {
    # Load base config (can override defaults above)
    if [ -f "$SCRIPT_DIR/sidecar.base.conf" ]; then
        source "$SCRIPT_DIR/sidecar.base.conf"
    fi
    
    # Load repo overrides (checked in)
    if [ -f "$REPO_SIDECAR/sidecar.repo.conf" ]; then
        source "$REPO_SIDECAR/sidecar.repo.conf"
    fi
    
    # Load local overrides (gitignored)
    if [ -f "$REPO_SIDECAR/sidecar.local.conf" ]; then
        source "$REPO_SIDECAR/sidecar.local.conf"
    fi
}

# =============================================================================
# Two-Tier Image Architecture
# =============================================================================
# Tier 1 (Base): Shared image with OS, tools, agent CLIs, Playwright
#   - Built once, reused by all repos for a given variant
#   - Image: agent-sidecar-base:{variant}
#   - Dockerfile: $SCRIPT_DIR/{variant}.base.dockerfile
#
# Tier 2 (Overlay/Custom): Per-repo customizations on top of base
#   - Only built when customizations exist (EXTRA_APT_PACKAGES, build-extra.sh, extra zshrc)
#   - Or when a custom Dockerfile exists in .agent_sidecar/
#   - Image: agent-sidecar:{repo-name}
#   - Custom Dockerfiles must FROM agent-sidecar-base:{variant}
#
# If no customizations exist, the base image is used directly (no overlay build).
# =============================================================================

# Load configuration
load_config

VARIANT="${DOCKERFILE_VARIANT:-node-py}"
BASE_IMAGE_NAME="agent-sidecar-base:${VARIANT}"
BASE_DOCKERFILE="$SCRIPT_DIR/${VARIANT}.base.dockerfile"
OVERLAY_DOCKERFILE="$SCRIPT_DIR/${VARIANT}.overlay.dockerfile"

if [ ! -f "$BASE_DOCKERFILE" ]; then
    echo "❌ ERROR: Base Dockerfile not found: $BASE_DOCKERFILE"
    exit 1
fi

# Resolve build-extra script (.local > .repo, no base)
BUILD_EXTRA_SCRIPT=""
if [ -f "$REPO_SIDECAR/build-extra.local.sh" ]; then
    BUILD_EXTRA_SCRIPT="$REPO_SIDECAR/build-extra.local.sh"
elif [ -f "$REPO_SIDECAR/build-extra.repo.sh" ]; then
    BUILD_EXTRA_SCRIPT="$REPO_SIDECAR/build-extra.repo.sh"
fi

# Detect if per-repo build-time customizations exist
has_repo_customizations() {
    [ -n "${EXTRA_APT_PACKAGES:-}" ] && return 0
    # Check for real build-extra script (not the no-op template)
    # The template contains "No custom installations" -- if that marker is absent, it's been customized
    if [ -n "$BUILD_EXTRA_SCRIPT" ] && [ -f "$BUILD_EXTRA_SCRIPT" ]; then
        if ! grep -q "No custom installations" "$BUILD_EXTRA_SCRIPT"; then
            return 0
        fi
    fi
    [ -f "$REPO_SIDECAR/extra.repo.zshrc" ] && return 0
    [ -f "$REPO_SIDECAR/extra.local.zshrc" ] && return 0
    return 1
}

# Check for custom Dockerfile override (.local > .repo)
resolve_custom_dockerfile() {
    if [ -f "$REPO_SIDECAR/${VARIANT}.local.dockerfile" ]; then
        echo "$REPO_SIDECAR/${VARIANT}.local.dockerfile"
    elif [ -f "$REPO_SIDECAR/${VARIANT}.repo.dockerfile" ]; then
        echo "$REPO_SIDECAR/${VARIANT}.repo.dockerfile"
    fi
}

# Validate that a custom Dockerfile FROMs the base image
validate_custom_dockerfile() {
    local df="$1"
    if ! head -10 "$df" | grep -qE 'FROM.*agent-sidecar-base|FROM.*\$\{?BASE_IMAGE'; then
        echo "❌ ERROR: Custom Dockerfile must FROM agent-sidecar-base:${VARIANT}"
        echo "   File: $df"
        echo "   Add these lines at the top:"
        echo "     ARG BASE_IMAGE=agent-sidecar-base:${VARIANT}"
        echo '     FROM ${BASE_IMAGE}'
        exit 1
    fi
}

# Assemble a per-build temporary directory with per-repo files for overlay builds.
# This avoids the race condition of using shared .generated/ across concurrent builds.
assemble_overlay_context() {
    local ctx
    ctx=$(mktemp -d)
    # Copy per-repo files into the temp build context
    if [ -n "$BUILD_EXTRA_SCRIPT" ] && [ -f "$BUILD_EXTRA_SCRIPT" ]; then
        cp "$BUILD_EXTRA_SCRIPT" "$ctx/build-extra.sh"
        chmod +x "$ctx/build-extra.sh"
    fi
    [ -f "$REPO_SIDECAR/extra.repo.zshrc" ] && cp "$REPO_SIDECAR/extra.repo.zshrc" "$ctx/"
    [ -f "$REPO_SIDECAR/extra.local.zshrc" ] && cp "$REPO_SIDECAR/extra.local.zshrc" "$ctx/"
    echo "$ctx"
}

# =============================================================================
# Build Images (skipped on --reload)
# =============================================================================
FINAL_IMAGE=""

if [ "$RELOAD" != true ]; then
    # Phase 1: Base image (shared across all repos for this variant)
    if [ "$FULL_RESET" = true ] || ! docker image inspect "$BASE_IMAGE_NAME" &>/dev/null; then
        echo "📦 Building base image ($BASE_IMAGE_NAME)..."
        CACHE_BUST_ARG=""
        if [ "$FULL_RESET" = true ]; then
            CACHE_BUST_ARG="--build-arg CACHE_BUST_AGENT_CLIS=$(date +%s)"
            echo "   Cache bust: Agent CLIs will be updated"
        fi
        docker build \
            $CACHE_BUST_ARG \
            -t "$BASE_IMAGE_NAME" \
            -f "$BASE_DOCKERFILE" \
            "$SCRIPT_DIR"
    else
        echo "✅ Reusing existing base image ($BASE_IMAGE_NAME)"
    fi

    # Phase 2: Per-repo image
    CUSTOM_DOCKERFILE=$(resolve_custom_dockerfile)

    if [ -n "$CUSTOM_DOCKERFILE" ]; then
        # Scenario 3: Custom Dockerfile override -- must FROM base
        echo "📋 Using custom Dockerfile: $CUSTOM_DOCKERFILE"
        validate_custom_dockerfile "$CUSTOM_DOCKERFILE"
        FINAL_IMAGE="agent-sidecar:${REPO_NAME}"
        BUILD_CONTEXT=$(assemble_overlay_context)
        trap "rm -rf $BUILD_CONTEXT" EXIT
        docker build \
            --build-arg BASE_IMAGE="$BASE_IMAGE_NAME" \
            --build-arg EXTRA_APT_PACKAGES="${EXTRA_APT_PACKAGES:-}" \
            -t "$FINAL_IMAGE" \
            -f "$CUSTOM_DOCKERFILE" \
            "$BUILD_CONTEXT"

    elif has_repo_customizations; then
        # Scenario 2: Auto overlay with per-repo customizations
        echo "📦 Building per-repo overlay ($REPO_NAME)..."
        if [ -n "$EXTRA_APT_PACKAGES" ]; then
            echo "   Extra APT packages: $EXTRA_APT_PACKAGES"
        fi
        FINAL_IMAGE="agent-sidecar:${REPO_NAME}"
        BUILD_CONTEXT=$(assemble_overlay_context)
        trap "rm -rf $BUILD_CONTEXT" EXIT
        docker build \
            --build-arg BASE_IMAGE="$BASE_IMAGE_NAME" \
            --build-arg EXTRA_APT_PACKAGES="${EXTRA_APT_PACKAGES:-}" \
            -t "$FINAL_IMAGE" \
            -f "$OVERLAY_DOCKERFILE" \
            "$BUILD_CONTEXT"

    else
        # Scenario 1: No customizations -- use base directly
        echo "✅ No per-repo customizations, using base image directly"
        FINAL_IMAGE="$BASE_IMAGE_NAME"
    fi

    # Respect IMAGE_NAME override from sidecar config
    if [ "${IMAGE_NAME:-agent-sidecar-image}" != "agent-sidecar-image" ]; then
        FINAL_IMAGE="$IMAGE_NAME"
    fi

    # Auto-cleanup dangling images from previous builds
    docker image prune -f 2>/dev/null || true
else
    echo "🔄 Reload requested. Skipping image build, reusing existing image..."
    # Determine FINAL_IMAGE for existing container
    CUSTOM_DOCKERFILE=$(resolve_custom_dockerfile)
    if [ -n "$CUSTOM_DOCKERFILE" ] || has_repo_customizations; then
        FINAL_IMAGE="agent-sidecar:${REPO_NAME}"
    else
        FINAL_IMAGE="$BASE_IMAGE_NAME"
    fi
    if [ "${IMAGE_NAME:-agent-sidecar-image}" != "agent-sidecar-image" ]; then
        FINAL_IMAGE="$IMAGE_NAME"
    fi
fi

echo "📋 Using image: $FINAL_IMAGE"

# 1.5. Claude OAuth credentials: Always re-export from macOS Keychain to keep token fresh
# Skip when using alternative auth (API key, Bedrock, or Vertex)
if [ "$(uname)" = "Darwin" ] && [ -z "${ANTHROPIC_API_KEY:-}" ] && [ -z "${CLAUDE_CODE_USE_BEDROCK:-}" ] && [ -z "${CLAUDE_CODE_USE_VERTEX:-}" ]; then
    echo "🔐 Exporting Claude OAuth credentials from macOS Keychain..."
    if security find-generic-password -s "Claude Code-credentials" -w > "$LOCAL_CLAUDE_CREDENTIALS" 2>/dev/null; then
        chmod 600 "$LOCAL_CLAUDE_CREDENTIALS"
        echo "   ✅ Credentials exported to $LOCAL_CLAUDE_CREDENTIALS"
    else
        echo "   ⚠️  No Claude credentials found in Keychain. Run 'claude' on host to login first."
    fi
fi

# 2. Cleanup old container if full-reset or reload is requested
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    if [ "$FULL_RESET" = true ]; then
        echo "🧹 Full reset requested. Removing existing container..."
        docker rm -f "$CONTAINER_NAME"
    elif [ "$RELOAD" = true ]; then
        echo "🔄 Reload requested. Removing existing container..."
        docker rm -f "$CONTAINER_NAME"
    fi
fi

# 3. Merge firewall allowlists (.base + .repo + .local)
# Require .agent_sidecar/ to exist - user must run init_repo_sidecar.sh first
if [ ! -d "$REPO_SIDECAR" ]; then
    echo "❌ ERROR: Project sidecar directory not found: $REPO_SIDECAR"
    echo ""
    echo "Run the initialization script first:"
    echo "  $SCRIPT_DIR/init_repo_sidecar.sh"
    echo ""
    echo "This creates the .agent_sidecar/ directory with firewall and config templates."
    exit 1
fi

FIREWALL_GENERATED_DIR="$REPO_SIDECAR/.generated"
# Container path (since $REPO_SIDECAR is mounted at /etc/agent-sidecar)
CONTAINER_FIREWALL_PATH="/etc/agent-sidecar/.generated/firewall-allowlist.compiled.txt"
mkdir -p "$FIREWALL_GENERATED_DIR"
COMPILED_FIREWALL_FILE="$FIREWALL_GENERATED_DIR/firewall-allowlist.compiled.txt"

merge_firewall_lists() {
    # Start fresh
    > "$COMPILED_FIREWALL_FILE"

    # Base always included (additive pattern: -extra.{tier}.txt)
    if [ -f "$SCRIPT_DIR/setup/firewall-allowlist-extra.base.txt" ]; then
        cat "$SCRIPT_DIR/setup/firewall-allowlist-extra.base.txt" >> "$COMPILED_FIREWALL_FILE"
    fi

    # Repo additions (.repo - checked in)
    if [ -f "$REPO_SIDECAR/firewall-allowlist-extra.repo.txt" ]; then
        echo "" >> "$COMPILED_FIREWALL_FILE"
        echo "# --- Repo-specific additions (.repo) ---" >> "$COMPILED_FIREWALL_FILE"
        cat "$REPO_SIDECAR/firewall-allowlist-extra.repo.txt" >> "$COMPILED_FIREWALL_FILE"
    fi

    # Local additions (.local - gitignored)
    if [ -f "$REPO_SIDECAR/firewall-allowlist-extra.local.txt" ]; then
        echo "" >> "$COMPILED_FIREWALL_FILE"
        echo "# --- Local additions (.local) ---" >> "$COMPILED_FIREWALL_FILE"
        cat "$REPO_SIDECAR/firewall-allowlist-extra.local.txt" >> "$COMPILED_FIREWALL_FILE"
    fi

    # Return the container-accessible path
    echo "$CONTAINER_FIREWALL_PATH"
}

FIREWALL_ALLOWLIST=$(merge_firewall_lists)

VENV_VOLUME="agent-sidecar-venv-${DIR_HASH}"
PNPM_STORE_VOLUME="agent-sidecar-pnpm-${DIR_HASH}"
CACHE_VOLUME="agent-sidecar-cache-${DIR_HASH}"
UV_CACHE_VOLUME="agent-sidecar-uv-${DIR_HASH}"

# Discover all node_modules directories and create isolated volumes for each
# This shadows host node_modules so container gets Linux-native packages
NODE_MODULES_VOLUMES=""
for dir in $(find "$WORK_DIR" -name "node_modules" -type d -not -path "*/.*" 2>/dev/null); do
    PATH_HASH=$(echo -n "$dir" | md5sum | cut -c1-8)
    VOL_NAME="agent-sidecar-nm-${DIR_HASH}-${PATH_HASH}"
    docker volume create "$VOL_NAME" >/dev/null 2>&1 || true
    NODE_MODULES_VOLUMES="$NODE_MODULES_VOLUMES -v $VOL_NAME:$dir"
done

# Also ensure root node_modules is covered even if it doesn't exist yet on host
ROOT_NM_VOL="agent-sidecar-nm-${DIR_HASH}-root"
docker volume create "$ROOT_NM_VOL" >/dev/null 2>&1 || true
# Only add if not already in the list
if ! echo "$NODE_MODULES_VOLUMES" | grep -qF "$WORK_DIR/node_modules"; then
    NODE_MODULES_VOLUMES="$NODE_MODULES_VOLUMES -v $ROOT_NM_VOL:$WORK_DIR/node_modules"
fi

# 4. Create Volumes and Prepare History Files
echo "💾 Preparing Volumes and History..."
docker volume create "$HISTORY_VOLUME" >/dev/null
docker volume create "$VENV_VOLUME" >/dev/null
docker volume create "$PNPM_STORE_VOLUME" >/dev/null
docker volume create "$CACHE_VOLUME" >/dev/null
docker volume create "$UV_CACHE_VOLUME" >/dev/null

# 5. Handle container state
# Remove container if it exists but isn't running (crashed/stopped)
EXISTING_CONTAINER=$(docker ps -aq -f name="^${CONTAINER_NAME}$")
if [ -n "$EXISTING_CONTAINER" ]; then
    RUNNING=$(docker ps -q -f name="^${CONTAINER_NAME}$")
    if [ -z "$RUNNING" ]; then
        echo "🧹 Found stopped/crashed container. Removing..."
        docker rm -f "$CONTAINER_NAME" >/dev/null
        EXISTING_CONTAINER=""
    fi
fi

# 6. Run the Sidecar
echo "🔥 Starting Sidecar Container..."

if [ -z "$EXISTING_CONTAINER" ]; then
    docker run -d \
        -e ANTHROPIC_API_KEY \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        --cap-add=NET_ADMIN \
        --cap-add=NET_RAW \
        -v "$WORK_DIR":"$WORK_DIR":delegated \
        $GIT_MOUNTS \
        -v "$VENV_VOLUME":"$WORK_DIR/.venv" \
        $NODE_MODULES_VOLUMES \
        $CORE_MOUNTS \
        $EXTRA_MOUNTS \
        -v "$PNPM_STORE_VOLUME":/home/node/.local/share/pnpm \
        -v "$CACHE_VOLUME":/home/node/.cache \
        -v "$UV_CACHE_VOLUME":/home/node/.local/share/uv \
        -v "$LOCAL_CLAUDE_DIR":/home/node/.claude \
        -v "$LOCAL_CLAUDE_DIR":"$LOCAL_CLAUDE_DIR" \
        -v "$LOCAL_ATUIN_DIR":/home/node/.config/atuin \
        -v "$LOCAL_ATUIN_DATA_DIR":/home/node/.local/share/atuin \
        -v "$LOCAL_CLAUDE_JSON":/home/node/.claude.json \
        -v "$LOCAL_CLAUDE_JSON":"$LOCAL_CLAUDE_JSON" \
        -v "$LOCAL_GEMINI_DIR":/home/node/.gemini \
        -v "$LOCAL_GEMINI_DIR":"$LOCAL_GEMINI_DIR" \
        -v "$LOCAL_CODEX_DIR":/home/node/.codex \
        -v "$LOCAL_CODEX_DIR":"$LOCAL_CODEX_DIR" \
        -v "$LOCAL_OPENCODE_DIR":/home/node/.opencode \
        -v "$LOCAL_OPENCODE_DIR":"$LOCAL_OPENCODE_DIR" \
        -v "$HISTORY_VOLUME":/commandhistory \
        -v "$SCRIPT_DIR":"$SCRIPT_DIR":ro \
        -v "$REPO_SIDECAR":/etc/agent-sidecar:ro \
        --mount type=tmpfs,destination="$WORK_DIR/.agent_sidecar" \
        -e SIDECAR_CONFIG_DIR=/etc/agent-sidecar \
        -e CLAUDE_CONFIG_DIR="$LOCAL_CLAUDE_DIR" \
        -e OPENCODE_CONFIG_DIR="$LOCAL_OPENCODE_DIR" \
        -e CODEX_HOME="$LOCAL_CODEX_DIR" \
        -e DEVCONTAINER=true \
        -e SCRIPT_DIR="$SCRIPT_DIR" \
        -e WORK_DIR="$WORK_DIR" \
        -e FIREWALL_ALLOWLIST="$FIREWALL_ALLOWLIST" \
        -e PLAYWRIGHT_EXTRA_HOSTS="$PLAYWRIGHT_EXTRA_HOSTS" \
        -e SIDECAR_ENV_OVERRIDES="$SIDECAR_ENV_OVERRIDES" \
        -e VIRTUAL_ENV="$WORK_DIR/.venv" \
        -e PNPM_STORE_DIR="/home/node/.local/share/pnpm" \
        -e PATH="/home/node/.atuin/bin:/pnpm:$WORK_DIR/.venv/bin:/usr/local/share/npm-global/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
        -e GIT_CONFIG_COUNT=1 \
        -e GIT_CONFIG_KEY_0=safe.directory \
        -e GIT_CONFIG_VALUE_0=* \
        -w "$WORK_DIR" \
        "$FINAL_IMAGE" \
        sh -c "sudo FIREWALL_ALLOWLIST=\$FIREWALL_ALLOWLIST /usr/local/bin/firewall.sh && sleep infinity"
else
    # Existing container - reload firewall with updated allowlist
    echo "🔄 Reloading firewall with updated allowlist..."
    docker exec -u root "$CONTAINER_NAME" \
        sh -c "FIREWALL_ALLOWLIST=$FIREWALL_ALLOWLIST /usr/local/bin/firewall.sh --reload" || true
fi

echo "🔄 Importing zsh history..."
docker cp "$LOCAL_ZSH_HISTORY" "$CONTAINER_NAME":/home/node/.zsh_history

# 5. Final Permissions Check
echo "🔓 Ensuring permissions..."
docker exec -u root "$CONTAINER_NAME" chown node:node /home/node/.zsh_history /home/node/.claude.json "$LOCAL_CLAUDE_JSON"
# Chown other directories normally
docker exec -u root "$CONTAINER_NAME" chown -R node:node /commandhistory /home/node/.config/atuin /home/node/.local/share/atuin /home/node/.claude "$LOCAL_CLAUDE_DIR" /home/node/.gemini "$LOCAL_GEMINI_DIR" /home/node/.codex "$LOCAL_CODEX_DIR" /home/node/.opencode "$LOCAL_OPENCODE_DIR"
# Ensure the parent directories of the mirrored configs exist and are owned by node
docker exec -u root "$CONTAINER_NAME" mkdir -p "$(dirname "$LOCAL_CLAUDE_DIR")" "$(dirname "$LOCAL_OPENCODE_DIR")"
docker exec -u root "$CONTAINER_NAME" chown node:node "$(dirname "$LOCAL_CLAUDE_DIR")" "$(dirname "$LOCAL_OPENCODE_DIR")"
# Setup alternate Claude config location (some versions look in ~/.config/claude-code/)
docker exec -u root "$CONTAINER_NAME" mkdir -p /home/node/.config/claude-code
docker exec -u root "$CONTAINER_NAME" chown -R node:node /home/node/.config/claude-code
# Symlink credentials to alternate location if they exist
if [ -f "$LOCAL_CLAUDE_CREDENTIALS" ]; then
    docker exec -u node "$CONTAINER_NAME" ln -sf /home/node/.claude/.credentials.json /home/node/.config/claude-code/auth.json 2>/dev/null || true
fi
# Surgically chown workspace to avoid errors on the read-only .git mount
# We use the dynamic WORK_DIR here for path mirroring
docker exec -u root "$CONTAINER_NAME" sh -c "find \"$WORK_DIR\" -maxdepth 1 -not -name \".git\" -not -path \"$WORK_DIR\" -exec chown -R node:node {} +" 2>/dev/null || true

# 6. Warmup - init scripts (.local > .repo > .base)
echo "🚀 Triggering background init..."
INIT_BG_SCRIPT=$(resolve_file "init-background" "sh")
if [ -n "$INIT_BG_SCRIPT" ]; then
    echo "   Using: $INIT_BG_SCRIPT"
    docker exec -d -u node "$CONTAINER_NAME" "$INIT_BG_SCRIPT"
fi

echo "🚀 Triggering foreground init..."
INIT_FG_SCRIPT=$(resolve_file "init-foreground" "sh")
if [ -n "$INIT_FG_SCRIPT" ]; then
    echo "   Using: $INIT_FG_SCRIPT"
    docker exec -u node "$CONTAINER_NAME" "$INIT_FG_SCRIPT"
fi

# Execution Logic
if [ -n "$RUN_CMD" ]; then
    # Use zsh -i -c to source .zshrc (for PATH to include ~/.local/bin)
    FULL_EXEC_CMD="docker exec -it $CONTAINER_NAME zsh -i -c \"$RUN_CMD\""
else
    FULL_EXEC_CMD="docker exec -it $CONTAINER_NAME zsh"
fi

if [ "$NO_RUN" = true ]; then
    echo "✅ Sidecar is ready!"
    echo ""
    echo "👉 To use zsh:"
    echo "   $FULL_EXEC_CMD"
else
    if [ -n "$RUN_CMD" ]; then
        echo "🚀 Starting agent..."
        exec docker exec -it "$CONTAINER_NAME" zsh -i -c "$RUN_CMD"
    else
        echo "🚗 Entering sidecar..."
        exec docker exec -it "$CONTAINER_NAME" zsh
    fi
fi
