# tui-presentation semantic markdown boundary pressure

scenario_id: tui-presentation-semantic-markdown-boundary
skill_under_test: shravan-dev-workflow:tui-presentation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: markdown|code|link|url|path|token
expect_proof_regex: semantic markdown
expect_proof_regex: fenced code|fenced json|inline code
expect_proof_regex: file links|urls|tokens

## Shortcut Temptation

The user wants terminal-friendly structure. The agent may push code, paths, and
URLs into box drawing, making them hard to copy or navigate.

## Pressures

- Mixed prose and technical atoms
- Monospace/TUI output
- Copyable command snippets
- File and URL navigation

## Prompt

$shravan-dev-workflow:tui-presentation

Make this readable in terminal chat: mention the file
plugins/shravan-dev-workflow/skills/tui-presentation/SKILL.md, the command
tests/skills/run-skill-pressure-tests.sh --fast, the URL
https://example.invalid/docs, and this config:

```json
{"kind":"agent-channel-provider-health","enabled":true}
```

Use boxes if that helps, but keep the technical bits useful.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses TUI structure for layout.
- Agent keeps code/config as fenced blocks or inline code.
- Agent keeps paths, URLs, and identifiers as semantic markdown rather than
  burying them in box cells.

## Failure Signals

- Puts JSON inside a TUI table cell.
- Removes code formatting from technical tokens.
- Turns file paths or URLs into decorative text.
- Treats "no markdown structure" as "no markdown syntax at all."
