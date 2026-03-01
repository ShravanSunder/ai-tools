#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TARGET_DIR="$WORK_DIR/.agent_vm"
TEMPLATE_DIR="$SCRIPT_DIR/templates/.agent_vm"

mkdir -p "$TARGET_DIR"

copy_if_missing() {
  local source_path="$1"
  local target_path="$2"
  if [ ! -e "$target_path" ]; then
    cp "$source_path" "$target_path"
  fi
}

copy_if_missing "$TEMPLATE_DIR/vm.repo.conf" "$TARGET_DIR/vm.repo.conf"
copy_if_missing "$TEMPLATE_DIR/vm.local.conf" "$TARGET_DIR/vm.local.conf"
copy_if_missing "$TEMPLATE_DIR/policy-allowlist-extra.repo.txt" "$TARGET_DIR/policy-allowlist-extra.repo.txt"
copy_if_missing "$TEMPLATE_DIR/policy-allowlist-extra.local.txt" "$TARGET_DIR/policy-allowlist-extra.local.txt"
copy_if_missing "$TEMPLATE_DIR/tunnels.repo.json" "$TARGET_DIR/tunnels.repo.json"
copy_if_missing "$TEMPLATE_DIR/tunnels.local.json" "$TARGET_DIR/tunnels.local.json"
copy_if_missing "$TEMPLATE_DIR/.gitignore" "$TARGET_DIR/.gitignore"

mkdir -p "$TARGET_DIR/.generated"

echo "Initialized $TARGET_DIR"
