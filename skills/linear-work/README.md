# linear-work

Standalone skill for organizing work in Linear following the **docs-are-truth, tickets-are-tracking** paradigm.

## Purpose

Provides procedural knowledge for managing Linear projects, milestones, and issues where architecture documents in the repo are the source of truth and Linear tickets track progress and dependencies.

## Tool Routing

- **MCP tools** (`mcp__plugin_linear_linear__*`) — primary interface for reads, creates, updates
- **Linear CLI** (`linear`) — surgical relation management (`relation add/delete`), deletion, and `issue start`

## Structure

```
linear-work/
├── SKILL.md                              # Core paradigm, tool routing, common workflows
├── README.md                             # This file
└── references/
    ├── mcp-tool-reference.md             # MCP tool parameters and patterns
    ├── cli-reference.md                  # CLI commands for gap operations
    └── ticket-templates.md               # Ticket templates and anti-patterns
```

## Relationship to Other Skills

This is a standalone skill (not part of any Claude Code plugin). It is delivered to Codex via `bin/list-codex-skills.sh` and works in any tool that supports SKILL.md format.

## Prerequisites

- Linear MCP server configured (provides `mcp__plugin_linear_linear__*` tools)
- Linear CLI installed (`linear`, v1.10.0+)
- Linear authentication configured (`linear auth`)
