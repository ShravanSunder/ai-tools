#!/bin/bash
set -e

# =============================================================================
# AI Coder Sidecar Router
# =============================================================================
# Routes to local .devcontainer/ script if available, otherwise uses global.
#
# Priority order:
#   1. --use-router flag forces use of base sidecar (ignores .devcontainer)
#   2. .devcontainer/run_ai_coder_sidecar.sh in current repo (if exists)
#   3. Base run_ai_coder_sidecar.sh (fallback)
#
# Usage: ai_coder_sidecar_router.sh [OPTIONS]
#   --use-router    Force use of base router sidecar (ignore .devcontainer)
#   --help          Show this help message
#   All other options are passed through to the underlying script.
#
# Examples:
#   ai_coder_sidecar_router.sh                    # Auto-detect (prefers .devcontainer)
#   ai_coder_sidecar_router.sh --use-router       # Force base sidecar
#   ai_coder_sidecar_router.sh --run-claude       # Run Claude Code
#   ai_coder_sidecar_router.sh --use-router --run-claude  # Force base + run Claude
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_SCRIPT=".devcontainer/run-ai-coder-sidecar.sh"
GLOBAL_SCRIPT="$SCRIPT_DIR/run-ai-coder-sidecar.sh"

# Show help
show_help() {
    cat <<EOF
AI Coder Sidecar Router

Usage: $(basename "$0") [OPTIONS]

Router Options:
  --use-router    Force use of base router sidecar (ignore .devcontainer)
  --help          Show this help message

Sidecar Options (passed through):
  --reset         Remove and recreate container
  --no-run        Setup only, don't exec into container
  --run <cmd>     Run specific command in container
  --run-claude    Run Claude Code with --dangerously-skip-permissions
  --run-gemini    Run Gemini CLI with --yolo
  --run-codex     Run OpenAI Codex
  --run-opencode  Run OpenCode
  --run-cursor    Run Cursor

Priority Order:
  1. --use-router flag (forces base sidecar)
  2. .devcontainer/run_ai_coder_sidecar.sh (if exists in repo)
  3. Base sidecar (fallback)

Examples:
  $(basename "$0")                          # Auto-detect
  $(basename "$0") --use-router             # Force base sidecar
  $(basename "$0") --run-claude             # Run Claude Code
  $(basename "$0") --use-router --run-claude  # Force base + run Claude
EOF
}

# Check for help flag
for arg in "$@"; do
    if [[ "$arg" == "--help" || "$arg" == "-h" ]]; then
        show_help
        exit 0
    fi
done

# Check for --use-router flag
USE_ROUTER=false
REMAINING_ARGS=()

for arg in "$@"; do
    if [[ "$arg" == "--use-router" || "$arg" == "-use-router" ]]; then
        USE_ROUTER=true
    else
        REMAINING_ARGS+=("$arg")
    fi
done

# Route to appropriate script
if [ "$USE_ROUTER" = true ]; then
    echo "🔀 Using base sidecar (--use-router flag)"
    exec "$GLOBAL_SCRIPT" "${REMAINING_ARGS[@]}"
elif [ -f "$LOCAL_SCRIPT" ]; then
    echo "🔀 Using local .devcontainer sidecar"
    exec "$LOCAL_SCRIPT" "${REMAINING_ARGS[@]}"
else
    echo "🔀 Using base sidecar (no .devcontainer found)"
    exec "$GLOBAL_SCRIPT" "${REMAINING_ARGS[@]}"
fi
