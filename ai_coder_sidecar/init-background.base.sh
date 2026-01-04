#!/bin/zsh
# .devcontainer/init-background.sh
# Infrastructure Sync: Raw dependency installation without shell overhead

echo "📦 Syncing infrastructure..."

# 1. Sync Node modules (pnpm)
echo "  - Syncing Node modules (pnpm)..."
CI=true pnpm install || true

# 2. Sync Python environment (uv)
echo "  - Syncing Python environment (uv)..."
uv sync --all-packages || true

echo "✅ Infrastructure sync complete."
