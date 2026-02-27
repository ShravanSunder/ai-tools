---
name: scaffold-project-update-templates
description: Update base scaffold templates with latest tool standards
allowed-tools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - AskUserQuestion
---

# Update Scaffold Templates

Update the base templates in ai-tools with the latest tool standards and best practices.

## Usage

```
/scaffold-project-update-templates [oxc|ruff|cursor|all]
```

## Instructions

Load the scaffold-project skill and follow its update-templates workflow:

1. **Ask scope** - Which templates to update (oxc, ruff, cursor rules, all)
2. **Research** - Look up latest standards using web search and deepwiki
3. **Propose changes** - Show diffs with explanations for each change
4. **Apply with approval** - User accepts/modifies/rejects each change
5. **Commit** - Commit approved changes to ai-tools repo

## Research Sources

- Oxlint: https://oxc.rs/docs/guide/usage/linter/config
- Oxfmt: https://oxc.rs/docs/guide/usage/formatter/config
- Ruff: https://docs.astral.sh/ruff/configuration/
- BasedPyright: https://docs.basedpyright.com/
- Vitest: https://vitest.dev/config/
- SwiftLint: https://realm.github.io/SwiftLint/rule-directory.html
- SwiftFormat: https://github.com/nicklockwood/SwiftFormat/blob/main/Rules.md

## Examples

### Update OXC config
```
/scaffold-project-update-templates oxc
> Researching latest oxlint/oxfmt recommendations...
> Proposed changes:
>   + Enable new correctness rule
>   + Update category severity
> Accept these changes? [y/n/modify]
```

### Update all templates
```
/scaffold-project-update-templates all
> Updating .oxlintrc.json + .oxfmtrc.json...
> Updating ruff.toml...
> Updating cursor rules...
> Commit changes? [y/n]
```
