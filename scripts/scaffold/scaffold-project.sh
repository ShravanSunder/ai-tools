#!/usr/bin/env bash
# scaffold-project.sh - Main orchestrator for project scaffolding
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
TEMPLATES_DIR="$PLUGIN_ROOT/templates"

# Default values
PROJECT_NAME=""
PROJECT_TYPE=""  # single-ts, single-py, monorepo-ts, monorepo-py, monorepo-both
PROJECT_DESCRIPTION=""
AUTHOR_NAME=""
AUTHOR_EMAIL=""
TARGET_DIR="."
SKIP_EXISTING=true
INCLUDE_VITEST=true
INCLUDE_VITEST_BROWSER=false
INCLUDE_PLAYWRIGHT=false
INCLUDE_PYTEST=true

usage() {
    cat <<EOF
Usage: scaffold-project.sh [OPTIONS]

Scaffold a new project with standard dev configurations.

Options:
    --name NAME           Project name (kebab-case)
    --type TYPE           Project type: single-ts, single-py, monorepo-ts, monorepo-py, monorepo-both
    --description DESC    Project description
    --author NAME         Author name
    --email EMAIL         Author email
    --target DIR          Target directory (default: current directory)
    --overwrite           Overwrite existing files (default: skip)
    --no-vitest           Skip vitest setup
    --vitest-browser      Include vitest browser mode
    --playwright          Include playwright e2e
    --no-pytest           Skip pytest setup
    -h, --help            Show this help

Examples:
    scaffold-project.sh --name my-app --type single-ts
    scaffold-project.sh --name my-monorepo --type monorepo-both --playwright
EOF
    exit 0
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --name) PROJECT_NAME="$2"; shift 2 ;;
        --type) PROJECT_TYPE="$2"; shift 2 ;;
        --description) PROJECT_DESCRIPTION="$2"; shift 2 ;;
        --author) AUTHOR_NAME="$2"; shift 2 ;;
        --email) AUTHOR_EMAIL="$2"; shift 2 ;;
        --target) TARGET_DIR="$2"; shift 2 ;;
        --overwrite) SKIP_EXISTING=false; shift ;;
        --no-vitest) INCLUDE_VITEST=false; shift ;;
        --vitest-browser) INCLUDE_VITEST_BROWSER=true; shift ;;
        --playwright) INCLUDE_PLAYWRIGHT=true; shift ;;
        --no-pytest) INCLUDE_PYTEST=false; shift ;;
        -h|--help) usage ;;
        *) echo "Unknown option: $1"; exit 1 ;;
    esac
done

# Validate required args
if [[ -z "$PROJECT_NAME" ]]; then
    echo "Error: --name is required"
    exit 1
fi

if [[ -z "$PROJECT_TYPE" ]]; then
    echo "Error: --type is required"
    exit 1
fi

# Set defaults from git config if not provided
if [[ -z "$AUTHOR_NAME" ]]; then
    AUTHOR_NAME=$(git config user.name 2>/dev/null || echo "Author")
fi
if [[ -z "$AUTHOR_EMAIL" ]]; then
    AUTHOR_EMAIL=$(git config user.email 2>/dev/null || echo "author@example.com")
fi
if [[ -z "$PROJECT_DESCRIPTION" ]]; then
    PROJECT_DESCRIPTION="A ${PROJECT_TYPE} project"
fi

# Determine what to include based on project type
INCLUDE_TS=false
INCLUDE_PY=false
IS_MONOREPO=false

case "$PROJECT_TYPE" in
    single-ts) INCLUDE_TS=true ;;
    single-py) INCLUDE_PY=true ;;
    monorepo-ts) INCLUDE_TS=true; IS_MONOREPO=true ;;
    monorepo-py) INCLUDE_PY=true; IS_MONOREPO=true ;;
    monorepo-both) INCLUDE_TS=true; INCLUDE_PY=true; IS_MONOREPO=true ;;
    *) echo "Error: Invalid project type: $PROJECT_TYPE"; exit 1 ;;
esac

# Escape special characters for sed replacement (handles /, &, \, and newlines)
escape_sed() {
    printf '%s' "$1" | sed -e 's/[\/&\\]/\\&/g' -e ':a' -e 'N' -e '$!ba' -e 's/\n/\\n/g'
}

# Helper to copy file with variable substitution
copy_template() {
    local src="$1"
    local dest="$2"

    if [[ -f "$dest" ]] && [[ "$SKIP_EXISTING" == "true" ]]; then
        echo "SKIP: $dest (exists)"
        return 0
    fi

    mkdir -p "$(dirname "$dest")"

    if [[ "$src" == *.template ]]; then
        # Escape user-provided values for safe sed substitution
        local escaped_name escaped_desc escaped_author escaped_email
        escaped_name="$(escape_sed "$PROJECT_NAME")"
        escaped_desc="$(escape_sed "$PROJECT_DESCRIPTION")"
        escaped_author="$(escape_sed "$AUTHOR_NAME")"
        escaped_email="$(escape_sed "$AUTHOR_EMAIL")"

        # Process template: substitute variables first
        local content
        content="$(sed -e "s/{{PROJECT_NAME}}/$escaped_name/g" \
            -e "s/{{PROJECT_DESCRIPTION}}/$escaped_desc/g" \
            -e "s/{{AUTHOR_NAME}}/$escaped_author/g" \
            -e "s/{{AUTHOR_EMAIL}}/$escaped_email/g" \
            "$src")"

        # Handle conditional blocks using perl (more reliable for multiline on macOS)
        # Process innermost conditionals first (MONOREPO), then outer ones
        # This handles nested conditionals like {{#if INCLUDE_PY}}...{{#if MONOREPO}}...{{/if}}...{{/if}}

        # Step 1: Process MONOREPO (innermost, no nesting expected)
        if [[ "$IS_MONOREPO" != "true" ]]; then
            content="$(printf '%s' "$content" | perl -0777 -pe 's/\{\{#if MONOREPO\}\}[^\{]*\{\{\/if\}\}//gs')"
        else
            content="$(printf '%s' "$content" | sed 's/{{#if MONOREPO}}//g')"
        fi

        # Step 2: Process INCLUDE_TS (may contain resolved MONOREPO content)
        if [[ "$INCLUDE_TS" != "true" ]]; then
            # Remove entire line if it contains only this conditional block
            content="$(printf '%s' "$content" | perl -0777 -pe 's/^[^\S\n]*\{\{#if INCLUDE_TS\}\}[^\n]*\{\{\/if\}\}[^\S\n]*\n?//gm')"
            # Remove remaining inline/multiline blocks
            content="$(printf '%s' "$content" | perl -0777 -pe 's/\{\{#if INCLUDE_TS\}\}.*?\{\{\/if\}\}\n?//gs')"
        else
            content="$(printf '%s' "$content" | sed 's/{{#if INCLUDE_TS}}//g')"
        fi

        # Step 3: Process INCLUDE_PY (may contain resolved MONOREPO content)
        if [[ "$INCLUDE_PY" != "true" ]]; then
            # Remove entire line if it contains only this conditional block
            content="$(printf '%s' "$content" | perl -0777 -pe 's/^[^\S\n]*\{\{#if INCLUDE_PY\}\}[^\n]*\{\{\/if\}\}[^\S\n]*\n?//gm')"
            # Remove remaining inline/multiline blocks
            content="$(printf '%s' "$content" | perl -0777 -pe 's/\{\{#if INCLUDE_PY\}\}.*?\{\{\/if\}\}\n?//gs')"
        else
            content="$(printf '%s' "$content" | sed 's/{{#if INCLUDE_PY}}//g')"
        fi

        # Remove remaining {{/if}} markers
        content="$(printf '%s' "$content" | sed 's/{{\/if}}//g')"

        # Write processed content
        printf '%s\n' "$content" > "$dest"

        # Remove .template suffix from dest if present
        local final_dest="${dest%.template}"
        if [[ "$final_dest" != "$dest" ]]; then
            mv "$dest" "$final_dest"
            dest="$final_dest"
        fi
    else
        cp "$src" "$dest"
    fi

    echo "CREATE: $dest"
}

# Helper to copy directory
copy_dir() {
    local src="$1"
    local dest="$2"

    mkdir -p "$dest"

    for file in "$src"/*; do
        if [[ -f "$file" ]]; then
            local filename=$(basename "$file")
            copy_template "$file" "$dest/$filename"
        fi
    done
}

echo "=== Scaffolding $PROJECT_NAME ($PROJECT_TYPE) ==="
echo "Target: $TARGET_DIR"
echo ""

cd "$TARGET_DIR"

# Create monorepo structure
if [[ "$IS_MONOREPO" == "true" ]]; then
    echo "--- Creating monorepo structure ---"
    mkdir -p apps packages services
    copy_template "$TEMPLATES_DIR/monorepo/apps/.gitkeep" "apps/.gitkeep"
    copy_template "$TEMPLATES_DIR/monorepo/packages/.gitkeep" "packages/.gitkeep"
    copy_template "$TEMPLATES_DIR/monorepo/services/.gitkeep" "services/.gitkeep"
fi

# Common files
echo ""
echo "--- Common files ---"
copy_template "$TEMPLATES_DIR/common/CLAUDE.md.template" "CLAUDE.md"
copy_template "$TEMPLATES_DIR/common/agents.md.template" "agents.md"
copy_template "$TEMPLATES_DIR/common/gitignore.template" ".gitignore"
mkdir -p .config
copy_template "$TEMPLATES_DIR/common/config/wt.toml.template" ".config/wt.toml"

# Cursor rules
echo ""
echo "--- Cursor rules ---"
mkdir -p .cursor/rules .cursor/hooks

if [[ "$INCLUDE_TS" == "true" ]]; then
    copy_template "$TEMPLATES_DIR/cursor/rules/ts-rules.mdc" ".cursor/rules/ts-rules.mdc"
fi
if [[ "$INCLUDE_PY" == "true" ]]; then
    copy_template "$TEMPLATES_DIR/cursor/rules/python-rules.mdc" ".cursor/rules/python-rules.mdc"
fi
if [[ "$IS_MONOREPO" == "true" ]]; then
    copy_template "$TEMPLATES_DIR/cursor/rules/monorepo-rules.mdc" ".cursor/rules/monorepo-rules.mdc"
fi

# Cursor hooks
copy_template "$TEMPLATES_DIR/cursor/hooks/hooks.json" ".cursor/hooks/hooks.json"
copy_template "$TEMPLATES_DIR/cursor/hooks/after-edit.sh.template" ".cursor/hooks/after-edit.sh"
chmod +x ".cursor/hooks/after-edit.sh" 2>/dev/null || true

# Claude hooks
echo ""
echo "--- Claude hooks ---"
mkdir -p .claude/hooks
copy_template "$TEMPLATES_DIR/claude/hooks/check.sh.template" ".claude/hooks/check.sh"
chmod +x ".claude/hooks/check.sh" 2>/dev/null || true
copy_template "$TEMPLATES_DIR/claude/settings.local.json.template" ".claude/settings.local.json"

# TypeScript files
if [[ "$INCLUDE_TS" == "true" ]]; then
    echo ""
    echo "--- TypeScript configuration ---"

    if [[ "$IS_MONOREPO" == "true" ]]; then
        copy_template "$TEMPLATES_DIR/typescript/monorepo/biome.json" "biome.json"
        copy_template "$TEMPLATES_DIR/typescript/monorepo/package.json.template" "package.json"
        if [[ "$INCLUDE_VITEST" == "true" ]]; then
            copy_template "$TEMPLATES_DIR/typescript/monorepo/vitest.config.ts.template" "vitest.config.ts"
            copy_template "$TEMPLATES_DIR/testing/vitest-setup.ts.template" "vitest.setup.ts"
        fi
    else
        copy_template "$TEMPLATES_DIR/typescript/single/biome.json" "biome.json"
        copy_template "$TEMPLATES_DIR/typescript/single/tsconfig.json" "tsconfig.json"
        copy_template "$TEMPLATES_DIR/typescript/single/package.json.template" "package.json"
        if [[ "$INCLUDE_VITEST" == "true" ]]; then
            copy_template "$TEMPLATES_DIR/typescript/single/vitest.config.ts.template" "vitest.config.ts"
            copy_template "$TEMPLATES_DIR/testing/vitest-setup.ts.template" "vitest.setup.ts"
        fi
        mkdir -p src
    fi

    if [[ "$INCLUDE_VITEST_BROWSER" == "true" ]]; then
        copy_template "$TEMPLATES_DIR/testing/vitest-browser.config.ts.template" "vitest.browser.config.ts"
        mkdir -p tests/integration
        # Add vitest browser dependencies to package.json
        if [[ -f "package.json" ]] && command -v jq >/dev/null 2>&1; then
            local tmp_pkg
            tmp_pkg=$(jq '.devDependencies["@vitest/browser"] = "^3.0.0" | .devDependencies["@vitest/browser-playwright"] = "^3.0.0" | .devDependencies["playwright"] = "^1.49.0"' package.json)
            printf '%s\n' "$tmp_pkg" > package.json
            echo "UPDATE: package.json (added vitest-browser deps)"
        fi
    fi

    if [[ "$INCLUDE_PLAYWRIGHT" == "true" ]]; then
        copy_template "$TEMPLATES_DIR/testing/playwright.config.ts.template" "playwright.config.ts"
        mkdir -p tests/e2e
        # Add playwright dependencies to package.json
        if [[ -f "package.json" ]] && command -v jq >/dev/null 2>&1; then
            local tmp_pkg
            tmp_pkg=$(jq '.devDependencies["@playwright/test"] = "^1.49.0" | .scripts["test:e2e"] = "playwright test"' package.json)
            printf '%s\n' "$tmp_pkg" > package.json
            echo "UPDATE: package.json (added playwright deps)"
        fi
    fi
fi

# Python files
if [[ "$INCLUDE_PY" == "true" ]]; then
    echo ""
    echo "--- Python configuration ---"

    if [[ "$IS_MONOREPO" == "true" ]]; then
        copy_template "$TEMPLATES_DIR/python/monorepo/ruff.toml" "ruff.toml"
        copy_template "$TEMPLATES_DIR/python/monorepo/pyrightconfig.json" "pyrightconfig.json"
        copy_template "$TEMPLATES_DIR/python/monorepo/pyproject.toml.template" "pyproject.toml"
        if [[ "$INCLUDE_PYTEST" == "true" ]]; then
            copy_template "$TEMPLATES_DIR/python/monorepo/conftest.py.template" "conftest.py"
        fi
    else
        copy_template "$TEMPLATES_DIR/python/single/ruff.toml" "ruff.toml"
        copy_template "$TEMPLATES_DIR/python/single/pyrightconfig.json" "pyrightconfig.json"
        copy_template "$TEMPLATES_DIR/python/single/pyproject.toml.template" "pyproject.toml"
        if [[ "$INCLUDE_PYTEST" == "true" ]]; then
            copy_template "$TEMPLATES_DIR/python/single/conftest.py.template" "conftest.py"
        fi
        mkdir -p src tests
    fi
fi

# Create scaffold tracking file
cat > ".scaffold-project.json" <<EOF
{
  "version": "0.1.0",
  "scaffolded_at": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "project_type": "$PROJECT_TYPE",
  "project_name": "$PROJECT_NAME"
}
EOF
echo "CREATE: .scaffold-project.json"

echo ""
echo "=== Scaffolding complete! ==="
echo ""
echo "Next steps:"
if [[ "$INCLUDE_TS" == "true" ]]; then
    echo "  pnpm install"
fi
if [[ "$INCLUDE_PY" == "true" ]]; then
    echo "  uv sync"
fi
echo "  git init (if not already a repo)"
