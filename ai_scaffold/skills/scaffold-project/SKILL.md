---
name: scaffold-project
description: This skill should be used when the user asks to "scaffold a new project", "initialize a new repo", "set up a new TypeScript/Python project", "add linting configs", "retrofit an existing project with configs", "update project templates", "add vitest", "add playwright", "add browser testing", "add e2e tests", "set up testing", or mentions setting up biome, ruff, basedpyright, vitest, playwright, cursor rules, or CLAUDE.md. Provides guided project scaffolding with standard dev configs.
version: 0.1.0
---

# Project Scaffolding

Scaffold new projects or retrofit existing ones with standardized development configurations including linters, type checkers, testing setup, IDE hooks, and AI assistant configs.

## CRITICAL: Ask First, Execute Once

**DO NOT** run the scaffold script immediately. Follow this flow:

1. **Detect** - Silently check if new project or retrofit
2. **Ask ALL questions** - Use AskUserQuestion to gather ALL preferences
3. **Execute ONCE** - Run scaffold script with all collected options
4. **Report** - Show what was created

This saves time by avoiding manual corrections after the fact.

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

**IMPORTANT**: Ask ALL questions FIRST, collect ALL preferences, THEN execute ONCE.

### Step 1: Detect Context

Silently check if scaffolding a new project or retrofitting:

```bash
ls -la package.json pyproject.toml .git 2>/dev/null
```

### Step 2: Ask All Questions Upfront

Use AskUserQuestion to collect ALL preferences before executing anything. Ask in batches:

**Batch 1: Project Basics**
```
Question 1: "What type of project are you creating?"
Options:
- Single-package TypeScript
- Single-package Python
- Monorepo TypeScript (pnpm workspaces)
- Monorepo Python (uv workspaces)
- Monorepo Both (TypeScript + Python)

Question 2: "What is the project name?" (kebab-case)
```

**Batch 2: Directory Structure** (for monorepos)
```
Question: "What top-level directories do you want?"
Options (multiSelect: true):
- apps/ (Recommended) - Deployable applications
- packages/ (Recommended) - Shared libraries
- services/ - Backend services
- tools/ - CLI tools and scripts
```

**Batch 3: Testing Setup**
```
Question (TypeScript): "Which testing features do you need?"
Options (multiSelect: true):
- Vitest unit tests (Recommended)
- Vitest browser mode - for React/DOM component tests
- Playwright E2E - for full browser automation tests

Question (Python): "Include pytest with integration markers?"
Options:
- Yes (Recommended) - includes integration_llm, integration_db, integration_api markers
- No - skip pytest setup
```

**Batch 4: Additional Options**
```
Question: "Any additional configurations?"
Options (multiSelect: true):
- Claude hooks - lint on file edit
- Cursor hooks - lint on file edit
- Worktrunk config - git worktree management
```

**Batch 5: Conflict Handling** (retrofit only)
```
Question: "How should we handle existing files?"
Options:
- Skip existing files (Recommended) - only add missing configs
- Overwrite all - replace existing with scaffold templates
```

### Step 3: Execute Scaffolding (ONCE)

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

Claude asks (AskUserQuestion batch):
  Q1: "What type of project?" → Monorepo TypeScript
  Q2: "Top-level directories?" → [apps, packages, services]
  Q3: "Testing features?" → [Vitest unit, Playwright E2E]
  Q4: "Additional configs?" → [Claude hooks, Cursor hooks]

AFTER all answers collected, execute ONCE:
  bash scaffold-project.sh --name my-platform --type monorepo-ts --playwright

Result: Full monorepo created with all selected options.
```

### Retrofit Python Project

```
User: "Add my standard configs to this existing Python project"

Claude detects: pyproject.toml exists (retrofit mode)

Claude asks (AskUserQuestion batch):
  Q1: "Include pytest with markers?" → Yes
  Q2: "Additional configs?" → [Claude hooks, Worktrunk]
  Q3: "Handle existing files?" → Skip existing

AFTER all answers, execute ONCE:
  bash scaffold-project.sh --name existing-project --type single-py

Result: Missing configs added, existing files preserved.
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
