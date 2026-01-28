# AI Scaffold - Claude Code Plugin

A Claude Code plugin for scaffolding new projects or retrofitting existing ones with standardized development configurations.

## Installation

Add this plugin to Claude Code:

```bash
# Open Claude Code settings
claude config

# Add the plugin path under "plugins":
~/dev/ai-tools/ai_scaffold
```

Or add directly to `~/.claude/settings.json`:

```json
{
  "plugins": [
    "~/dev/ai-tools/ai_scaffold"
  ]
}
```

Restart Claude Code after adding the plugin.

## Usage

### Commands

- `/scaffold-project` - Interactive project scaffolding
- `/scaffold-project-update-templates` - Update base templates with latest standards

### Natural Language

Just ask Claude:
- "Scaffold a new TypeScript monorepo called my-platform"
- "Add playwright e2e testing to this project"
- "Retrofit this repo with standard configs"
- "Add vitest browser mode for React component tests"

## Supported Configurations

| Category | TypeScript | Python |
|----------|------------|--------|
| **Linter** | Biome | Ruff |
| **Type Checker** | TypeScript strict | BasedPyright |
| **Testing** | Vitest (+browser, +Playwright) | Pytest (+marks) |
| **Package Manager** | pnpm | uv |
| **IDE Hooks** | Cursor afterFileEdit | Cursor afterFileEdit |
| **AI Hooks** | Claude PostToolUse | Claude PostToolUse |

## Project Types

- `single-ts` - Single-package TypeScript project
- `single-py` - Single-package Python project
- `monorepo-ts` - TypeScript monorepo (pnpm workspaces)
- `monorepo-py` - Python monorepo (uv workspaces)
- `monorepo-both` - Combined Python + TypeScript monorepo

## What Gets Created

### Common Files
- `CLAUDE.md` - AI assistant instructions
- `agents.md` - Agent-specific rules
- `.gitignore` - Comprehensive ignore patterns
- `.config/wt.toml` - Worktrunk configuration

### Cursor Integration
- `.cursor/rules/ts-rules.mdc` - TypeScript coding standards
- `.cursor/rules/python-rules.mdc` - Python coding standards
- `.cursor/rules/monorepo-rules.mdc` - Monorepo structure rules
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

## Manual Script Usage

The scaffold script can also be run directly:

```bash
bash ~/dev/ai-tools/ai_scaffold/scripts/scaffold/scaffold-project.sh \
  --name "my-project" \
  --type "monorepo-both" \
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
ai_scaffold/
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
    ├── common/              # CLAUDE.md, agents.md, etc.
    ├── typescript/          # TS configs (single/monorepo)
    ├── python/              # Python configs (single/monorepo)
    ├── testing/             # Vitest/Playwright configs
    ├── cursor/              # Cursor rules and hooks
    ├── claude/              # Claude hooks and settings
    └── monorepo/            # Monorepo structure templates
```
