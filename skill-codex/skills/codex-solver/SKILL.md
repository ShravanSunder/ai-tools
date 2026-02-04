---
name: codex-solver
description: Delegate hard problems to OpenAI Codex using Task tool with run_in_background:true (REQUIRED). Use when Claude is stuck, needs deep codebase exploration, backend architecture reasoning, code review, or a second opinion. Codex excels at autonomous exploration and deep reasoning. Proactively invoke when facing multi-file analysis, architectural decisions, debugging dead ends, or thorough code review. ALWAYS spawn as background agent via Task tool so you can continue helping user while Codex works autonomously.
---

# Codex Problem Solver

Delegate hard problems to OpenAI Codex (GPT-5.2) as a **background task**. Codex runs autonomously, writes findings to tmp files, and reports back.

## CRITICAL: Always Use Background Agent

**You MUST use the Task tool with `run_in_background: true`** to invoke Codex. Never call `mcp__codex__codex` directly - it takes 5-30 minutes and will block the conversation.

```
Task tool:
  subagent_type: "general-purpose"
  run_in_background: true  ← REQUIRED
  prompt: [see templates below]
```

This lets you continue helping the user while Codex works. Check back later with `TaskOutput` or read the output files.

## When to Use Codex (and Why)

### Codex Strengths (Use For These)

| Situation | Why Codex is Better |
|-----------|---------------------|
| Claude is stuck (2+ failed attempts) | Different reasoning approach, fresh perspective |
| Deep codebase exploration | Autonomous 15-30 min sessions, reads everything |
| Backend architecture design | GPT-5.2 excels at backend patterns, API design |
| Code review of subsections | Thorough analysis, catches edge cases Claude missed |
| Hard algorithmic problems | GPT-5.2 reasoning superior for math/algorithms |
| Multi-file dependency tracing | Better at following chains across many files |
| Need second opinion | Different model catches different issues |

### Why Codex Works Here
- **Cost efficient**: ~50% cheaper per token than Claude, uses 3x fewer tokens for same task
- **Autonomous**: Can work 15-30 min without interruption or guidance
- **Thorough**: Explores more code paths, considers more alternatives
- **Backend specialist**: Training emphasizes backend patterns, APIs, data flows

### Claude Strengths (Don't Use Codex)

| Situation | Why Claude is Better |
|-----------|----------------------|
| Quick fixes, simple changes | Claude is faster, interactive |
| Terminal/DevOps tasks | Claude scores 11.7% higher on Terminal-Bench |
| Strict TDD workflows | Claude better at test-first discipline |
| Tasks requiring exact instruction following | Codex may diverge from spec |
| Production code with strict style | Claude more consistent with guidelines |

## Core Pattern: Background Agent + Progressive Disclosure

Codex is **SLOW** (5-30 minutes). Use background agent pattern:

```
1. Claude spawns background Task agent
2. Agent invokes Codex MCP
3. Codex writes detailed analysis to /tmp/codex-analysis/
4. Agent reports back: summary + file paths
5. Claude reads files as needed, synthesizes for user
```

### Output Rules (CRITICAL)
- Codex **MUST NOT** modify actual code files
- All output goes to `/tmp/codex-analysis/{timestamp}/`
- Response has **summary + links** to files
- Files contain full details, summary is concise

## Invocation

### Step 1: Spawn Background Agent

```
Task tool with:
  - subagent_type: "general-purpose"
  - run_in_background: true
  - prompt: [see template below]
```

### Step 2: Agent Prompt Template

```
You are managing a Codex task for Claude. Use the mcp__codex__codex tool.

TASK: [describe the problem]

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: [project directory]
- config: {"model_reasoning_effort": "[low|medium|high]"}

DEVELOPER INSTRUCTIONS (pass to Codex):
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/{timestamp}/
3. Create structured markdown files for your analysis
4. Return a brief summary (under 300 words) with file paths

Create these files:
- /tmp/codex-analysis/{timestamp}/summary.md - Executive summary
- /tmp/codex-analysis/{timestamp}/[topic-specific].md - Detailed findings
"""

PROMPT FOR CODEX:
[detailed task description]

After Codex completes, report back with:
1. Brief summary of findings
2. List of files created with paths
3. Key insights worth highlighting
```

### Step 3: Check Results Later

```bash
# Check if Codex finished
ls /tmp/codex-analysis/

# Read summary
cat /tmp/codex-analysis/{timestamp}/summary.md
```

## Reasoning Effort Guidelines

Claude chooses effort based on problem:

| Problem Type | Effort | When |
|--------------|--------|------|
| Codebase exploration | `low` | Broad search, many files |
| Code review | `medium` | Systematic analysis |
| Bug analysis | `medium` | Trace and diagnose |
| Architecture design | `high` | Complex trade-offs |
| Claude is stuck | `high` | Need maximum reasoning |

Pass via config: `{"model_reasoning_effort": "high"}`

## Example: Claude is Stuck on a Bug

```
Claude: "I've checked auth middleware 3 times, can't find why tokens expire early."

[Spawn background agent with prompt:]

TASK: Debug token expiration issue that Claude couldn't solve

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: /path/to/project
- config: {"model_reasoning_effort": "high"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/token-debug-20260202/
3. Create structured markdown files

Create:
- /tmp/codex-analysis/token-debug-20260202/summary.md
- /tmp/codex-analysis/token-debug-20260202/token-lifecycle.md
- /tmp/codex-analysis/token-debug-20260202/suspects.md
"""

PROMPT:
Trace the complete token lifecycle from creation to validation.
- Find all places where expiry is set, checked, or modified
- Identify any time zone issues, clock skew, or edge cases
- Claude already checked: [list what Claude tried]
- Look for what Claude might have missed
```

## Example: Code Review Subsection

```
[Spawn background agent with prompt:]

TASK: Review payment processing module for edge cases

CODEX CONFIGURATION:
- model: gpt-5.2
- sandbox: workspace-write
- approval-policy: untrusted
- cwd: /path/to/project
- config: {"model_reasoning_effort": "medium"}

DEVELOPER INSTRUCTIONS:
"""
OUTPUT RULES - FOLLOW EXACTLY:
1. NEVER modify any source code files
2. Write ALL findings to /tmp/codex-analysis/payment-review-20260202/

Create:
- /tmp/codex-analysis/payment-review-20260202/summary.md
- /tmp/codex-analysis/payment-review-20260202/issues.md
- /tmp/codex-analysis/payment-review-20260202/recommendations.md
"""

PROMPT:
Review src/payments/ for:
- Error handling completeness
- Edge cases (refunds, partial payments, currency)
- Security considerations
- Race conditions in concurrent payments
```

## Interpreting Results

When Codex returns:
1. Read `summary.md` first for overview
2. Read detailed files based on what's relevant
3. **Verify key claims** by reading referenced code
4. Synthesize with Claude's own analysis
5. Present consolidated findings to user

## Reference Files

| Need | Reference |
|------|-----------|
| MCP tool parameters | `references/codex-mcp-reference.md` |
| More prompt templates | `references/prompt-patterns.md` |
