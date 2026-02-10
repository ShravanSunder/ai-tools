# AI Scaffold - Claude Code Plugin

A Claude Code plugin for scaffolding new projects or retrofitting existing ones with standardized development configurations.

## Installation

```bash
/plugin marketplace add ShravanSunder/ai-tools
/plugin install ai-scaffold@ai-tools
```

### Managing Plugins

```bash
/plugin                    # List installed plugins
/plugin disable <name>     # Temporarily disable
/plugin enable <name>      # Re-enable
/plugin uninstall <name>   # Remove completely
```

Restart Claude Code after installation.

## Usage

### Commands

- `/scaffold-project` - Interactive project scaffolding
- `/scaffold-project-update-templates` - Update base templates with latest standards

### Natural Language

Just ask Claude:
- "Scaffold a new TypeScript monorepo called my-platform"
- "Scaffold a new Swift/SwiftUI app"
- "Add playwright e2e testing to this project"
- "Retrofit this repo with standard configs"
- "Add vitest browser mode for React component tests"

## Supported Configurations

| Category | TypeScript | Python | Swift |
|----------|------------|--------|-------|
| **Linter** | Biome | Ruff | SwiftLint (strict) |
| **Formatter** | Biome | Ruff | SwiftFormat |
| **Type Checker** | TypeScript strict | BasedPyright | Swift compiler |
| **Testing** | Vitest (+browser, +Playwright) | Pytest (+marks) | Swift Testing |
| **Package Manager** | pnpm | uv | SPM |
| **IDE Hooks** | Cursor afterFileEdit | Cursor afterFileEdit | Cursor afterFileEdit |
| **AI Hooks** | Claude PostToolUse | Claude PostToolUse | Claude PostToolUse |

## Project Types

- `single-ts` - Single-package TypeScript project
- `single-py` - Single-package Python project
- `single-swift` - Single Swift/SwiftUI package (SPM)
- `monorepo-ts` - TypeScript monorepo (pnpm workspaces)
- `monorepo-py` - Python monorepo (uv workspaces)
- `monorepo-ts-py` - Combined Python + TypeScript monorepo
- `monorepo-swift-ts` - Swift + TypeScript monorepo (SwiftUI + React webviews)
- `monorepo-both` - Alias for `monorepo-ts-py` (backwards compat)

## What Gets Created

### Common Files
- `CLAUDE.md` - AI assistant instructions
- `AGENTS.md` → `CLAUDE.md` (symlink for cross-tool compatibility)
- `.gitignore` - Comprehensive ignore patterns
- `.config/wt.toml` - Worktrunk configuration

### Cursor Integration
- `.cursor/rules/*.md` - Coding standards (source of truth)
- `.cursor/rules/*.mdc` → `*.md` (symlinks for Cursor discovery)
- `.cursor/hooks/` - afterFileEdit hooks for linting

### Claude Code Integration
- `.claude/hooks/check.sh` - PostToolUse linting hook
- `.claude/settings.local.json` - Permissions and hook config

### TypeScript
- `biome.json` - Biome linter/formatter
- `tsconfig.json` - Strict TypeScript config
- `package.json` - Dependencies
- `vitest.config.ts` - Test runner

### Python
- `ruff.toml` - Ruff linter (ALL rules enabled)
- `pyrightconfig.json` - BasedPyright strict mode
- `pyproject.toml` - uv-managed project
- `conftest.py` - Pytest shared fixtures

### Swift
- `Package.swift` - Swift Package Manager manifest
- `.swiftlint.yml` - SwiftLint strict configuration
- `.swiftformat` - SwiftFormat configuration

## Testing Conventions

### File Naming (TypeScript)

| Pattern | Environment | Location |
|---------|-------------|----------|
| `*.test.ts` | Node (default) | Colocated in `src/` |
| `*.node.test.ts` | Node (explicit) | Colocated in `src/` |
| `*.browser.test.ts` | Browser (Playwright) | Colocated or `tests/integration/` |
| `*.spec.ts` | Playwright E2E | `tests/e2e/` |

### Python
- `*_test.py` - Colocated with source files
- Markers: `integration_llm`, `integration_db`, `integration_api`

### Swift
- `Tests/` directory following SPM convention
- Swift Testing framework (`@Test`, `@Suite`)

## Manual Script Usage

The scaffold script can also be run directly:

```bash
bash ~/dev/ai-tools/plugins/ai-scaffold/scripts/scaffold/scaffold-project.sh \
  --name "my-project" \
  --type "monorepo-ts-py" \
  --description "My awesome project" \
  --target "/path/to/project" \
  --playwright \
  --vitest-browser
```

### Options

| Flag | Description |
|------|-------------|
| `--name NAME` | Project name (kebab-case) |
| `--type TYPE` | Project type (see above) |
| `--description DESC` | Project description |
| `--author NAME` | Author name |
| `--email EMAIL` | Author email |
| `--target DIR` | Target directory |
| `--overwrite` | Overwrite existing files |
| `--vitest-browser` | Include vitest browser mode |
| `--playwright` | Include Playwright E2E |
| `--no-vitest` | Skip vitest setup |
| `--no-pytest` | Skip pytest setup |

## Directory Structure

```
ai-scaffold/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/
│   ├── scaffold-project.md  # Main command
│   └── scaffold-project-update-templates.md
├── skills/
│   └── scaffold-project/
│       ├── SKILL.md         # Skill documentation
│       └── references/
│           └── template-inventory.md
├── scripts/
│   └── scaffold/
│       └── scaffold-project.sh  # Main script
└── templates/
    ├── common/              # CLAUDE.md, .gitignore, etc.
    ├── typescript/          # TS configs (single/monorepo)
    ├── python/              # Python configs (single/monorepo)
    ├── swift/               # Swift configs (single)
    ├── testing/             # Vitest/Playwright configs
    ├── cursor/              # Cursor rules (.md) and hooks
    ├── claude/              # Claude hooks and settings
    └── monorepo/            # Monorepo structure templates
```
