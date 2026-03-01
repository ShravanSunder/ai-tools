#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
TARGET_DIR="$WORK_DIR/.agent_vm"
TEMPLATE_DIR="$SCRIPT_DIR/templates/.agent_vm"
DOC_SOURCE="$SCRIPT_DIR/INSTRUCTIONS.md"
DOC_TARGET="$TARGET_DIR/INSTRUCTIONS.md"

MODE="default"
OVERRIDE=false

show_help() {
	cat <<'EOF'
Usage: init_repo_vm.sh [options]

Options:
  --default       Initialize both repo + local templates (default)
  --repo-only     Initialize only repo-scoped templates
  --local-only    Initialize only local-scoped templates
  --sync-docs     Only sync INSTRUCTIONS.md into .agent_vm/
  --override      Overwrite existing files
  --help          Show this help
EOF
}

copy_template() {
	local source_path="$1"
	local target_path="$2"
	if [ "$OVERRIDE" = true ] || [ ! -e "$target_path" ]; then
		cp "$source_path" "$target_path"
	fi
}

for arg in "$@"; do
	case "$arg" in
		--default) MODE="default" ;;
		--repo-only) MODE="repo-only" ;;
		--local-only) MODE="local-only" ;;
		--sync-docs) MODE="sync-docs" ;;
		--override) OVERRIDE=true ;;
		--help)
			show_help
			exit 0
			;;
		*)
			echo "Unknown option: $arg" >&2
			show_help
			exit 1
			;;
	esac
done

mkdir -p "$TARGET_DIR" "$TARGET_DIR/.generated"

case "$MODE" in
	default|repo-only)
		copy_template "$TEMPLATE_DIR/build.project.json" "$TARGET_DIR/build.project.json"
		copy_template "$TEMPLATE_DIR/vm-runtime.repo.json" "$TARGET_DIR/vm-runtime.repo.json"
		copy_template "$TEMPLATE_DIR/tcp-services.repo.json" "$TARGET_DIR/tcp-services.repo.json"
		copy_template "$TEMPLATE_DIR/policy-allowlist-extra.repo.txt" "$TARGET_DIR/policy-allowlist-extra.repo.txt"
		;;
esac

case "$MODE" in
	default|local-only)
		copy_template "$TEMPLATE_DIR/vm-runtime.local.json" "$TARGET_DIR/vm-runtime.local.json"
		copy_template "$TEMPLATE_DIR/tcp-services.local.json" "$TARGET_DIR/tcp-services.local.json"
		copy_template "$TEMPLATE_DIR/policy-allowlist-extra.local.txt" "$TARGET_DIR/policy-allowlist-extra.local.txt"
		;;
esac

copy_template "$TEMPLATE_DIR/.gitignore" "$TARGET_DIR/.gitignore"

# Always sync docs so in-repo agents get current usage guidance.
cp "$DOC_SOURCE" "$DOC_TARGET"

echo "Initialized $TARGET_DIR ($MODE)"
echo "Next steps:"
echo "  1. Review .agent_vm/build.project.json and vm-runtime.repo.json"
echo "  2. Run: pnpm --dir \"$SCRIPT_DIR\" build"
echo "  3. Start VM: pnpm --dir \"$SCRIPT_DIR\" exec run-agent-vm --no-run"
