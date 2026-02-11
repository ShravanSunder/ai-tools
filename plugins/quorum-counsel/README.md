# Quorum Counsel

Multi-model review orchestration plugin for Claude Code. Runs Gemini and Codex in parallel for comprehensive plan and code reviews.

## Installation

```bash
/plugin marketplace add ShravanSunder/ai-tools
/plugin install quorum-counsel@ai-tools
```

## Agents

### counsel-reviewer

Orchestrates Gemini 3 and Codex GPT-5.3 in parallel, then synthesizes findings into a unified review with consensus issues and model-specific insights. Always runs as a background task.

**Use for:**
- Plan review -- validate approach, gaps, edge cases, alternatives
- Code review -- bugs, security, test gaps, quality

**Requires a Context Bundle:**
- Requirements and constraints
- Plan or code artifacts
- Specific review questions

### codex-solver

Delegates hard problems to OpenAI Codex via the `codex exec` CLI. Runs as a background task (5-30 minutes).

**Use when:**
- Stuck after 2+ failed attempts
- Need to trace dependencies across many files
- Architecture design with trade-off analysis
- Impact analysis of a proposed change
- Want a second opinion on a hard problem

**Requires detailed context:** exact file paths, function/class names, code snippets, error messages, what you've tried.

## Commands

- `/review-plan` -- trigger a plan review with counsel-reviewer

## Hooks

- **bash-allow** -- PreToolUse hook that auto-approves safe bash commands (git read-only, gemini/codex CLI, `/tmp/` ops) for background subagents
- **review-gate** -- Stop hook that blocks Claude from stopping after Write/Edit/MultiEdit tool usage unless counsel-reviewer was already spawned. Greps the transcript JSONL for `"type": "tool_use"` + `"name": "Write|Edit|MultiEdit"` (Anthropic API format, not `"tool_name"`). Uses `stop_hook_active` field and a `/tmp/` session marker for loop prevention. See "Hook Development Gotchas" in the repo CLAUDE.md for transcript format details.

## Directory Structure

```
quorum-counsel/
├── .claude-plugin/plugin.json
├── agents/
│   ├── counsel-reviewer.md    # Multi-model review orchestrator
│   └── codex-solver.md        # Codex delegation agent
├── commands/
│   └── review-plan.md         # Plan review command
└── hooks/
    ├── hooks.json             # Hook configuration
    ├── bash-allow.sh          # Bash command validation
    └── review-gate.sh         # Review gate stop hook
```
