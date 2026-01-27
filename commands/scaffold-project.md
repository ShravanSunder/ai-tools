---
name: scaffold-project
description: Scaffold a new project or retrofit existing one with standard dev configs
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - AskUserQuestion
---

# Scaffold Project

Initialize a new project or add standard configurations to an existing project.

## Usage

```
/scaffold-project [new|retrofit]
```

## Instructions

Load the scaffold-project skill and follow its workflow:

1. **Detect context** - Check if directory has existing project files
2. **Gather info** - Ask user about project type, languages, name, testing options
3. **Execute scaffolding** - Run shell scripts to copy and configure templates
4. **Handle conflicts** - For retrofit, ask about existing files
5. **Report results** - Show what was created/skipped

## Defaults

When user doesn't specify:
- **Project name**: Derive from current directory name
- **Author**: Use git config user.name and user.email
- **Testing**: vitest for TS, pytest with marks for Python
- **Conflict handling**: Skip existing files

## Examples

### New TypeScript project
```
/scaffold-project new
> Project type? Single-package TypeScript
> Name? my-cli-tool
> Testing? vitest (default)
```

### Retrofit existing Python project
```
/scaffold-project retrofit
> Detected: pyproject.toml exists
> How to handle conflicts? Skip existing
> Adding: ruff.toml, pyrightconfig.json, .cursor/rules/...
```
