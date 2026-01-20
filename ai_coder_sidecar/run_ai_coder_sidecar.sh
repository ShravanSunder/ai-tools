#!/bin/bash
set -e

# =============================================================================
# AI Coder Sidecar - Repo-agnostic container launcher for AI coding agents
# =============================================================================
# Usage: run_ai_coder_sidecar.sh [OPTIONS]
#   --reset         Remove and recreate container
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
IMAGE_NAME="ai-coder-sidecar-image"

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

CONTAINER_NAME="ai-coder-sidecar-${REPO_NAME}-${DIR_HASH}"
HISTORY_VOLUME="ai-coder-bashhistory-${DIR_HASH}"
LOCAL_CLAUDE_DIR="$HOME/.claude"
LOCAL_ATUIN_DIR="$HOME/.config/atuin"
LOCAL_ZSH_HISTORY="$HOME/.zsh_history"
LOCAL_CLAUDE_JSON="$HOME/.claude.json"
LOCAL_GEMINI_DIR="$HOME/.gemini"
LOCAL_CODEX_DIR="$HOME/.codex"
LOCAL_OPENCODE_DIR="$HOME/.config/opencode"

# Parse arguments
RESET=false
NO_RUN=false
RUN_CMD=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --reset|-reset)
            RESET=true
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
# File Resolution - Use files from script's directory
# =============================================================================
resolve_file() {
    local filename="$1"
    local file_path="$SCRIPT_DIR/$filename"

    if [ -f "$file_path" ]; then
        echo "$file_path"
    else
        echo ""
    fi
}

DOCKERFILE=$(resolve_file "Dockerfile")
if [ -z "$DOCKERFILE" ]; then
    echo "❌ ERROR: Dockerfile not found in $SCRIPT_DIR/"
    exit 1
fi

# 1. Build the image
echo "📦 Building Docker image ($IMAGE_NAME)..."
docker build -t "$IMAGE_NAME" -f "$DOCKERFILE" "$SCRIPT_DIR"

# 2. Cleanup old container if reset is requested or it's not running
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    if [ "$RESET" = true ]; then
        echo "🧹 Reset requested. Removing existing container..."
        docker rm -f "$CONTAINER_NAME"
    fi
fi

# 3. Resolve paths with fallback (before container check)
FIREWALL_ALLOWLIST=$(resolve_file "init-firewall.allowlist.txt")
[ -z "$FIREWALL_ALLOWLIST" ] && FIREWALL_ALLOWLIST=$(resolve_file "init-firewall.allowlist.base.txt")

VENV_VOLUME="ai-coder-venv-${DIR_HASH}"
PNPM_STORE_VOLUME="ai-coder-pnpm-store-${DIR_HASH}"

# Discover all node_modules directories and create isolated volumes for each
# This shadows host node_modules so container gets Linux-native packages
NODE_MODULES_VOLUMES=""
for dir in $(find "$WORK_DIR" -name "node_modules" -type d -not -path "*/.*" 2>/dev/null); do
    PATH_HASH=$(echo -n "$dir" | md5sum | cut -c1-8)
    VOL_NAME="ai-coder-nm-${DIR_HASH}-${PATH_HASH}"
    docker volume create "$VOL_NAME" >/dev/null 2>&1 || true
    NODE_MODULES_VOLUMES="$NODE_MODULES_VOLUMES -v $VOL_NAME:$dir"
done

# Also ensure root node_modules is covered even if it doesn't exist yet on host
ROOT_NM_VOL="ai-coder-nm-${DIR_HASH}-root"
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
        -v "$PNPM_STORE_VOLUME":/home/node/.local/share/pnpm \
        -v "$LOCAL_CLAUDE_DIR":/home/node/.claude \
        -v "$LOCAL_CLAUDE_DIR":"$LOCAL_CLAUDE_DIR" \
        -v "$LOCAL_ATUIN_DIR":/home/node/.config/atuin \
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
        -e CLAUDE_CONFIG_DIR="$LOCAL_CLAUDE_DIR" \
        -e OPENCODE_CONFIG_DIR="$LOCAL_OPENCODE_DIR" \
        -e CODEX_HOME="$LOCAL_CODEX_DIR" \
        -e DEVCONTAINER=true \
        -e SCRIPT_DIR="$SCRIPT_DIR" \
        -e FIREWALL_ALLOWLIST="$FIREWALL_ALLOWLIST" \
        -e VIRTUAL_ENV="$WORK_DIR/.venv" \
        -e PNPM_STORE_DIR="/home/node/.local/share/pnpm" \
        -e PATH="/home/node/.atuin/bin:/pnpm:$WORK_DIR/.venv/bin:/usr/local/share/npm-global/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin" \
        -e GIT_CONFIG_COUNT=1 \
        -e GIT_CONFIG_KEY_0=safe.directory \
        -e GIT_CONFIG_VALUE_0=* \
        -w "$WORK_DIR" \
        "$IMAGE_NAME" \
        sh -c "sudo FIREWALL_ALLOWLIST=\$FIREWALL_ALLOWLIST /usr/local/bin/init-firewall.sh && sleep infinity"
fi

echo "🔄 Importing zsh history..."
docker cp "$LOCAL_ZSH_HISTORY" "$CONTAINER_NAME":/home/node/.zsh_history

# 5. Final Permissions Check
echo "🔓 Ensuring permissions..."
docker exec -u root "$CONTAINER_NAME" chown node:node /home/node/.zsh_history /home/node/.claude.json "$LOCAL_CLAUDE_JSON"
# Chown other directories normally
docker exec -u root "$CONTAINER_NAME" chown -R node:node /commandhistory /home/node/.config/atuin /home/node/.claude "$LOCAL_CLAUDE_DIR" /home/node/.gemini "$LOCAL_GEMINI_DIR" /home/node/.codex "$LOCAL_CODEX_DIR" /home/node/.opencode "$LOCAL_OPENCODE_DIR"
# Ensure the parent directories of the mirrored configs exist and are owned by node
docker exec -u root "$CONTAINER_NAME" mkdir -p "$(dirname "$LOCAL_CLAUDE_DIR")" "$(dirname "$LOCAL_OPENCODE_DIR")"
docker exec -u root "$CONTAINER_NAME" chown node:node "$(dirname "$LOCAL_CLAUDE_DIR")" "$(dirname "$LOCAL_OPENCODE_DIR")"
# Surgically chown workspace to avoid errors on the read-only .git mount
# We use the dynamic WORK_DIR here for path mirroring
docker exec -u root "$CONTAINER_NAME" sh -c "find \"$WORK_DIR\" -maxdepth 1 -not -name \".git\" -not -path \"$WORK_DIR\" -exec chown -R node:node {} +" 2>/dev/null || true

# 6. Warmup - with fallback resolution
echo "🚀 Triggering background init..."
INIT_BG_SCRIPT=$(resolve_file "init-background.sh")
[ -z "$INIT_BG_SCRIPT" ] && INIT_BG_SCRIPT=$(resolve_file "init-background.base.sh")
if [ -n "$INIT_BG_SCRIPT" ]; then
    docker exec -d -u node "$CONTAINER_NAME" "$INIT_BG_SCRIPT"
fi

echo "🚀 Triggering foreground init..."
INIT_FG_SCRIPT=$(resolve_file "init-foreground.sh")
[ -z "$INIT_FG_SCRIPT" ] && INIT_FG_SCRIPT=$(resolve_file "init-foreground.base.sh")
if [ -n "$INIT_FG_SCRIPT" ]; then
    docker exec -u node "$CONTAINER_NAME" "$INIT_FG_SCRIPT"
fi

# Execution Logic
if [ -n "$RUN_CMD" ]; then
    FULL_EXEC_CMD="docker exec -it $CONTAINER_NAME zsh -c \"$RUN_CMD\""
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
        exec docker exec -it "$CONTAINER_NAME" zsh -c "$RUN_CMD"
    else
        echo "🚗 Entering sidecar..."
        exec docker exec -it "$CONTAINER_NAME" zsh
    fi
fi
