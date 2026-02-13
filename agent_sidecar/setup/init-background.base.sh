#!/bin/zsh
# .agent_sidecar/init-background.sh
# Infrastructure Sync: Raw dependency installation without shell overhead

echo "📦 Syncing infrastructure..."

# 0. XVFB: Start virtual display for Playwright headed mode (Electron, screenshots)
# This runs as a background daemon - DISPLAY=:99 is set in Dockerfile ENV
if command -v Xvfb &> /dev/null; then
    if ! pgrep -x Xvfb > /dev/null; then
        echo "  - Starting Xvfb virtual display on :99..."
        Xvfb :99 -screen 0 1920x1080x24 > /dev/null 2>&1 &
    else
        echo "  - Xvfb already running"
    fi
fi

# 1. Sync Node modules (auto-detect package manager by lockfile)
# Use --frozen-lockfile explicitly to prevent modifying the lockfile on the
# shared bind mount, which would impact the host's node_modules state.
if [ -f pnpm-lock.yaml ]; then
	echo "  - Syncing Node modules (pnpm)..."
	pnpm install --frozen-lockfile || true
elif [ -f package-lock.json ]; then
	echo "  - Syncing Node modules (npm)..."
	npm ci || true
elif [ -f yarn.lock ]; then
	echo "  - Syncing Node modules (yarn)..."
	yarn install --frozen-lockfile || true
elif [ -f package.json ]; then
	echo "  - Skipping Node modules: no lockfile found (run pnpm/npm/yarn install manually)"
else
	echo "  - Skipping Node modules: no package.json found"
fi

# 2. Sync Python environment (uv)
if [ -f pyproject.toml ]; then
	echo "  - Syncing Python environment (uv)..."
	uv sync --all-packages || true
else
	echo "  - Skipping Python environment (uv): pyproject.toml not found"
fi

echo "✅ Infrastructure sync complete."

# 4. EXTRA SCRIPTS: Run repo + local additions (additive, not replacement)
# These run IN ADDITION to this base script, not instead of it
# SIDECAR_CONFIG_DIR is set by run-agent-sidecar.sh (agent cannot access .agent_sidecar directly)
CONFIG_DIR="${SIDECAR_CONFIG_DIR:-$WORK_DIR/.agent_sidecar}"
for tier in repo local; do
    EXTRA_SCRIPT="$CONFIG_DIR/init-background-extra.${tier}.sh"
    if [ -f "$EXTRA_SCRIPT" ] && [ -x "$EXTRA_SCRIPT" ]; then
        echo "📦 Running init-background-extra.${tier}.sh..."
        "$EXTRA_SCRIPT" || true
    fi
done
