#!/bin/bash
set -e

# =============================================================================
# Agent Sidecar Router
# =============================================================================
# Routes to local .agent_sidecar/ script if available, otherwise uses global.
#
# Priority order:
#   1. --use-router flag forces use of base sidecar (ignores .agent_sidecar)
#   2. .agent_sidecar/run-agent-sidecar.sh in current repo (if exists)
#   3. Base run-agent-sidecar.sh (fallback)
#
# Usage: agent-sidecar-router.sh [OPTIONS]
#   --use-router    Force use of base router sidecar (ignore .agent_sidecar)
#   --help          Show this help message
#   All other options are passed through to the underlying script.
#
# Examples:
#   agent-sidecar-router.sh                    # Auto-detect (prefers .agent_sidecar)
#   agent-sidecar-router.sh --use-router       # Force base sidecar
#   agent-sidecar-router.sh --run-claude       # Run Claude Code
#   agent-sidecar-router.sh --use-router --run-claude  # Force base + run Claude
# =============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_SCRIPT=".agent_sidecar/run-agent-sidecar.sh"
GLOBAL_SCRIPT="$SCRIPT_DIR/run-agent-sidecar.sh"

# Show help
show_help() {
    cat <<EOF
Agent Sidecar Router

Usage: $(basename "$0") [OPTIONS]

Router Options:
  --use-router    Force use of base router sidecar (ignore .agent_sidecar)
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
  2. .agent_sidecar/run-agent-sidecar.sh (if exists in repo)
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
    echo "🔀 Using local .agent_sidecar sidecar"
    exec "$LOCAL_SCRIPT" "${REMAINING_ARGS[@]}"
else
    echo "🔀 Using base sidecar (no .agent_sidecar found)"
    exec "$GLOBAL_SCRIPT" "${REMAINING_ARGS[@]}"
fi
