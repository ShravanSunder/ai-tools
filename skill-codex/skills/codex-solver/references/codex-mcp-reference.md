# Codex MCP Reference

## Tool: `mcp__codex__codex`

Start a new Codex session.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | **Yes** | Initial task description |
| `model` | string | No | Model name: `gpt-5.2`, `gpt-5.2-codex` |
| `sandbox` | enum | No | `read-only`, `workspace-write`, `danger-full-access` |
| `approval-policy` | enum | No | `untrusted`, `on-failure`, `on-request`, `never` |
| `cwd` | string | No | Working directory for session |
| `developer-instructions` | string | No | Instructions injected as developer role |
| `base-instructions` | string | No | Override default instructions |
| `config` | object | No | Override config.toml settings |
| `profile` | string | No | Named profile from config.toml |
| `compact-prompt` | string | No | Prompt for conversation compacting |

### Standard Configuration for This Skill

Always use these settings:

```json
{
  "model": "gpt-5.2",
  "sandbox": "workspace-write",
  "approval-policy": "untrusted",
  "cwd": "[project directory]",
  "config": {
    "model_reasoning_effort": "[low|medium|high]"
  },
  "developer-instructions": "[output rules - see below]"
}
```

### Developer Instructions Template

```
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files in the project
2. Write ALL findings to /tmp/codex-analysis/{task-name}-{timestamp}/
3. Create structured markdown files for your analysis
4. Return a brief summary (under 300 words) with file paths

Create these files:
- /tmp/codex-analysis/{dir}/summary.md - Executive summary with key findings
- /tmp/codex-analysis/{dir}/[topic].md - Detailed analysis files
```

## Tool: `mcp__codex__codex-reply`

Continue an existing Codex conversation.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | **Yes** | Follow-up message |
| `threadId` | string | **Yes** | Thread ID from previous session |

### When to Use Reply

- Ask clarifying questions about Codex's findings
- Request deeper analysis on specific areas
- Ask Codex to explore alternative approaches

## Reasoning Effort Levels

Pass via `config.model_reasoning_effort`:

| Level | Tokens | Speed | Use For |
|-------|--------|-------|---------|
| `low` | Minimal | Fast | Broad exploration, file discovery |
| `medium` | Moderate | Balanced | Code review, systematic analysis |
| `high` | Maximum | Slow | Hard problems, architecture, stuck issues |

### How to Choose

```
Exploration/search → low
Review/analysis → medium
Stuck/hard problem → high
```

## Model Options

| Model | Best For |
|-------|----------|
| `gpt-5.2` | General problem solving, architecture |
| `gpt-5.2-codex` | Code-specific tasks, implementation analysis |

Default to `gpt-5.2` for most tasks.

## Sandbox Modes

| Mode | Can Do | Use When |
|------|--------|----------|
| `read-only` | Read files only | Pure analysis, no output needed |
| `workspace-write` | Read + write to workspace/tmp | **Default for this skill** |
| `danger-full-access` | Everything | Never use in this skill |

## Approval Policies

| Policy | Behavior | Use When |
|--------|----------|----------|
| `untrusted` | Prompts for everything | **Default for this skill** - safest |
| `on-failure` | Prompts only if blocked | Faster but less safe |
| `on-request` | Prompts for network/external | Middle ground |
| `never` | No prompts | CI/CD only, never interactive |
