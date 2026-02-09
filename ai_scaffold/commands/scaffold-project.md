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

**IMPORTANT: Ask ALL questions FIRST, then execute ONCE.**

1. **Detect context** - Silently check for existing project files
2. **Ask ALL questions upfront** - Use AskUserQuestion to gather:
   - Project type (single/monorepo, TS/Python/Swift)
   - Directory structure preferences (for monorepos)
   - Testing features (vitest, browser mode, playwright, pytest)
   - Additional configs (claude hooks, cursor hooks, worktrunk)
   - Conflict handling (for retrofit)
3. **Execute ONCE** - Run scaffold script with all collected options
4. **Report results** - Show what was created/skipped

This approach saves time by getting all preferences upfront instead of manual corrections after.

## Defaults

When user doesn't specify:
- **Project name**: Derive from current directory name
- **Author**: Use git config user.name and user.email
- **Testing**: vitest for TS, pytest with marks for Python, Swift Testing for Swift
- **Conflict handling**: Skip existing files

## Examples

### New TypeScript Monorepo
```
/scaffold-project

Claude asks (all at once):
  "What type of project?" → Monorepo TypeScript
  "Top-level directories?" → [apps, packages]
  "Testing features?" → [Vitest unit, Vitest browser mode]
  "Additional configs?" → [Claude hooks]

Claude executes ONCE with all options, creates full project.
```

### Retrofit existing Python project
```
/scaffold-project

Claude detects pyproject.toml, asks:
  "Include pytest with markers?" → Yes
  "Handle existing files?" → Skip existing

Claude executes ONCE, adds only missing configs.
```
