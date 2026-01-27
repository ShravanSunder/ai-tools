---
name: scaffold-project
description: This skill should be used when the user asks to "scaffold a new project", "initialize a new repo", "set up a new TypeScript/Python project", "add linting configs", "retrofit an existing project with configs", "update project templates", "add vitest", "add playwright", "add browser testing", "add e2e tests", "set up testing", or mentions setting up biome, ruff, basedpyright, vitest, playwright, cursor rules, or CLAUDE.md. Provides guided project scaffolding with standard dev configs.
version: 0.1.0
---

# Project Scaffolding

Scaffold new projects or retrofit existing ones with standardized development configurations including linters, type checkers, testing setup, IDE hooks, and AI assistant configs.

## Overview

This skill guides through three modalities:

1. **Scaffold new project** - Create a new repo with full config stack
2. **Retrofit existing project** - Add missing configs to an existing repo
3. **Update base templates** - Refresh templates with latest tool standards

## Supported Configurations

| Category | TypeScript | Python |
|----------|------------|--------|
| **Linter** | Biome | Ruff |
| **Type Checker** | TypeScript strict | BasedPyright |
| **Testing** | Vitest (+ browser mode, Playwright) | Pytest (+ marks) |
| **Package Manager** | pnpm | uv |
| **IDE Hooks** | Cursor afterFileEdit | Cursor afterFileEdit |
| **AI Hooks** | Claude PostToolUse | Claude PostToolUse |

## Project Types

- **Single-package TypeScript** - Simple TS library or app
- **Single-package Python** - Simple Python package
- **Monorepo TypeScript** - pnpm workspaces with apps/packages/services
- **Monorepo Python** - uv workspaces with packages/services
- **Monorepo Both** - Combined Python + TypeScript monorepo

## Scaffolding Workflow

### Step 1: Detect Context

Determine if scaffolding a new project or retrofitting an existing one:

```bash
# Check for existing project indicators
ls -la package.json pyproject.toml 2>/dev/null
```

If files exist, ask user whether to retrofit or start fresh.

### Step 2: Gather Project Info

Ask user for project details using AskUserQuestion:

1. **Project type**: Single-package or monorepo?
2. **Languages**: TypeScript, Python, or both?
3. **Project name**: kebab-case name for the project
4. **Description**: Brief description of the project
5. **Testing options**:
   - Python: pytest with custom marks (default: yes)
   - TypeScript: vitest (default: yes), browser mode (optional), playwright e2e (optional)

### Step 3: Execute Scaffolding

Run the appropriate scaffold scripts:

```bash
# Main orchestrator
bash ${CLAUDE_PLUGIN_ROOT}/scripts/scaffold/scaffold-project.sh \
  --name "project-name" \
  --type "monorepo-both" \
  --author "Name" \
  --email "email@example.com"
```

The script handles:
- Creating directory structure (apps/, packages/, services/ for monorepos)
- Copying linter configs (biome.json, ruff.toml, pyrightconfig.json)
- Setting up cursor rules (.cursor/rules/*.mdc)
- Creating cursor hooks (.cursor/hooks/)
- Setting up Claude hooks (.claude/hooks/)
- Creating package.json/pyproject.toml with dependencies
- Setting up vitest/pytest configurations
- Creating CLAUDE.md and agents.md
- Setting up .gitignore
- Creating worktrunk config (.config/wt.toml)

### Step 4: Handle Conflicts (Retrofit Only)

When retrofitting, handle existing files:

1. **Skip existing** - Only add files that don't exist
2. **Prompt per file** - Ask user for each conflict

Ask user preference before proceeding.

### Step 5: Report Results

Show summary of what was created/skipped:

```
Created:
  - biome.json
  - .cursor/rules/ts-rules.mdc
  - .cursor/hooks/after-edit.sh
  ...

Skipped (already exists):
  - package.json
```

## Template Variables

Templates use these placeholders:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | kebab-case name | `my-awesome-app` |
| `{{PROJECT_DESCRIPTION}}` | Brief description | `A CLI tool for...` |
| `{{AUTHOR_NAME}}` | Author name | `Jane Doe` |
| `{{AUTHOR_EMAIL}}` | Author email | `jane@example.com` |
| `{{INCLUDE_TS}}` | Include TypeScript | `true` |
| `{{INCLUDE_PY}}` | Include Python | `true` |
| `{{MONOREPO}}` | Is monorepo | `true` |

## Update Templates Workflow

To update base templates with latest tool standards:

### Step 1: Ask Scope

Ask which templates to update:
- Biome config (latest rules)
- Ruff config (latest rules)
- Cursor rules (content updates)
- All templates

### Step 2: Research Latest Standards

Use web search and deepwiki to research:
- Latest biome.json recommended rules
- Latest ruff configuration best practices
- TypeScript strict mode updates
- BasedPyright configuration changes

### Step 3: Propose Changes

Show diff of proposed changes with explanations:

```diff
# biome.json changes
- "noExplicitAny": "error"
+ "noExplicitAny": "warn"  # Relaxed for gradual adoption
```

### Step 4: Apply with User Approval

For each change:
1. Show the diff
2. Explain the rationale
3. Ask user to accept/modify/reject
4. Apply accepted changes

### Step 5: Commit Changes

After all changes applied, commit to ai-tools repo:

```bash
git add templates/
git commit -m "chore: update templates with latest standards"
```

## Template Location

All templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`:

```
templates/
├── common/           # CLAUDE.md, agents.md, .gitignore, wt.toml
├── typescript/       # biome.json, tsconfig.json, package.json, vitest
│   ├── single/
│   └── monorepo/
├── python/           # ruff.toml, pyrightconfig.json, pyproject.toml
│   ├── single/
│   └── monorepo/
├── testing/          # vitest-browser, playwright configs
├── monorepo/         # apps/, packages/, services/ structure
├── cursor/           # rules/*.mdc, hooks/
└── claude/           # hooks/, settings template
```

## Additional Resources

### Reference Files

For detailed template inventory and configurations:
- **`references/template-inventory.md`** - Complete list of all templates and their contents

### Scripts

Shell scripts for scaffolding operations:
- **`${CLAUDE_PLUGIN_ROOT}/scripts/scaffold/scaffold-project.sh`** - Main orchestrator (handles all project types, TypeScript, Python, and common files)

## Quick Start Examples

### New TypeScript Monorepo

```
User: "Create a new TypeScript monorepo called my-platform"

1. Gather: name=my-platform, type=monorepo-ts, testing=vitest
2. Execute scaffold script
3. Result: Full monorepo with biome, vitest, cursor rules, etc.
```

### Retrofit Python Project

```
User: "Add my standard configs to this existing Python project"

1. Detect existing pyproject.toml
2. Ask: Skip existing or prompt per file?
3. Add missing: ruff.toml, pyrightconfig.json, .cursor/rules/, etc.
4. Report what was added
```

### Add Individual Testing Config

When user asks to add specific testing setup (vitest, playwright, browser tests), use the scaffold script with appropriate flags or copy individual templates:

```
User: "Add playwright e2e testing to this project"

1. Run scaffold script with --playwright flag, or:
2. Read template: ${CLAUDE_PLUGIN_ROOT}/templates/testing/playwright.config.ts.template
3. Substitute {{PROJECT_NAME}} with actual project name
4. Write to playwright.config.ts
5. Create tests/e2e/ directory
6. Add @playwright/test to devDependencies
7. Update .gitignore with tmp/, playwright-report/
```

```
User: "Add vitest browser mode for React component tests"

1. Run scaffold script with --vitest-browser flag, or:
2. Read template: ${CLAUDE_PLUGIN_ROOT}/templates/testing/vitest-multiproject.config.ts.template
3. Substitute {{PROJECT_NAME}}
4. Write appropriate vitest config (single or multiproject)
5. Create tests/integration/ directory
6. Add @vitest/browser-playwright to devDependencies
```

### File Naming Conventions for Testing

TypeScript test files use naming to determine environment:
- `*.test.ts` - Node environment (default)
- `*.node.test.ts` - Node environment (explicit)
- `*.browser.test.ts` - Browser environment via Playwright
- `*.spec.ts` - Playwright E2E tests (in tests/e2e/)

### Update Templates

```
User: "Update the biome template to latest standards"

1. Research latest biome recommended configuration
2. Show proposed changes with explanations
3. Apply approved changes
4. Commit to ai-tools
```
