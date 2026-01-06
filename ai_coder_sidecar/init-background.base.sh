#!/bin/zsh
# .devcontainer/init-background.sh
# Infrastructure Sync: Raw dependency installation without shell overhead

echo "📦 Syncing infrastructure..."

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
