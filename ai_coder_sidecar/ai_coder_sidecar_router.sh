#!/bin/bash
set -e

# =============================================================================
# AI Coder Sidecar Router
# =============================================================================
# Routes to local .devcontainer/ script if available, otherwise uses global.
# Usage: ai_coder_sidecar_router.sh [OPTIONS]
#   All options are passed through to the underlying script.
# =============================================================================

LOCAL_SCRIPT=".devcontainer/run_ai_coder_sidecar.sh"
GLOBAL_SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/run_ai_coder_sidecar.sh"

if [ -f "$LOCAL_SCRIPT" ]; then
    exec "$LOCAL_SCRIPT" "$@"
else
    exec "$GLOBAL_SCRIPT" "$@"
fi
