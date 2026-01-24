#!/bin/zsh
# .devcontainer/init-background.sh
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

# 1. Sync Node modules (pnpm)
if [ -f package.json ]; then
	echo "  - Syncing Node modules (pnpm)..."
	CI=true pnpm install || true
else
	echo "  - Skipping Node modules (pnpm): package.json not found"
fi

# 2. Sync Python environment (uv)
if [ -f pyproject.toml ]; then
	echo "  - Syncing Python environment (uv)..."
	uv sync --all-packages || true
else
	echo "  - Skipping Python environment (uv): pyproject.toml not found"
fi

echo "✅ Infrastructure sync complete."
