#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if command -v brew >/dev/null 2>&1; then
	echo "Installing host prerequisites from Brewfile..."
	brew bundle --file "$SCRIPT_DIR/Brewfile"
	export PATH="/opt/homebrew/opt/e2fsprogs/sbin:/opt/homebrew/opt/e2fsprogs/bin:/usr/local/opt/e2fsprogs/sbin:/usr/local/opt/e2fsprogs/bin:$PATH"
else
	echo "Homebrew is required to install host prerequisites listed in $SCRIPT_DIR/Brewfile" >&2
	exit 1
fi

if [ ! -d "$SCRIPT_DIR/node_modules" ]; then
	echo "Installing dependencies..."
	pnpm --dir "$SCRIPT_DIR" install
fi

if [ ! -d "$SCRIPT_DIR/dist" ]; then
	echo "Building agent_vm..."
	pnpm --dir "$SCRIPT_DIR" build
fi
