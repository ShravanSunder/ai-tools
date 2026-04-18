---
name: claude-solver
description: Delegate problems to Claude (Opus) via the `claude -p` CLI for a second opinion, deep analysis, or when stuck. Use when you need a different model's perspective on debugging, architecture design, codebase exploration, or impact analysis. Provide EXTENSIVE context — exact file paths, code snippets, error messages, what you've tried — for quality results. Takes 2-10 minutes.
---

# Claude Solver

Delegate analysis tasks to Claude (Opus) via headless CLI. Claude runs read-only — it can read files and search code but cannot modify anything.

## Workflow

1. Classify the task pattern and set output directory name
2. Create output directory: `mkdir -p /tmp/claude-analysis/{task-name}/`
3. Construct the prompt with task description and output format instructions
4. Run `claude -p` and capture JSON output
5. Extract `.result` from JSON → `result.md`
6. Read `result.md` and report findings

## Task Patterns

| Pattern | Signal Keywords |
|---------|-----------------|
| Codebase Exploration | "explore", "understand", "map", unfamiliar area |
| Stuck / Debug | "stuck", "tried N times", failed attempts |
| Architecture Design | "design", "architect", "refactor", trade-offs |
| Impact Analysis | "impact", "what breaks", "dependencies" |

## CLI Template

```bash
mkdir -p /tmp/claude-analysis/{task-name}/

claude -p "{prompt}" \
  --model opus \
  --output-format json \
  --tools "Read,Glob,Grep,Bash" \
  --allowedTools "Read,Glob,Grep,Bash(git *),Bash(ls *)" \
  --dangerously-skip-permissions \
  --no-session-persistence \
  --max-turns 30 \
  > /tmp/claude-analysis/{task-name}/result.json 2>&1

jq -r '.result' /tmp/claude-analysis/{task-name}/result.json \
  > /tmp/claude-analysis/{task-name}/result.md
```

### Flag Reference

| Flag | Purpose |
|------|---------|
| `--model opus` | Use Claude Opus for deep analysis |
| `--tools "Read,Glob,Grep,Bash"` | Restrict available tools (no Write/Edit) |
| `--allowedTools "Read,Glob,Grep,Bash(git *),Bash(ls *)"` | Auto-approve only safe read-only commands |
| `--dangerously-skip-permissions` | No interactive prompts (headless) |
| `--no-session-persistence` | Don't save session to disk |
| `--max-turns 30` | Cap agent turns to prevent runaway |
| `--output-format json` | JSON output: `{ "result": "...", "is_error": false, ... }` |

### Constructing the Prompt

Build a single prompt string with task and output format:

```
You are an expert code analyst. Analyze the codebase and provide detailed findings.

TASK:
{task description with full context}

CONTEXT:
{relevant context: cwd, what was tried, constraints}

OUTPUT FORMAT:
Structure your response as markdown with:
## Summary (2-4 sentences)
## Key Findings (numbered, with file:line references, severity)
## {Pattern-specific section}
## Recommendations (actionable, priority-ordered)
```

### Prompt Quality

Analysis quality depends entirely on context provided. Always include:
1. Exact file paths, function/class names, line numbers
2. Complete relevant code snippets (not summaries)
3. Error messages, test output, behavior descriptions
4. What was tried and why it failed
5. Architecture constraints and requirements

## Reading Results

```bash
# Check for errors
jq -r '.is_error' /tmp/claude-analysis/{task-name}/result.json

# Read the analysis
cat /tmp/claude-analysis/{task-name}/result.md

# Check cost and turns
jq '{cost: .total_cost_usd, turns: .num_turns, duration_ms: .duration_ms}' \
  /tmp/claude-analysis/{task-name}/result.json
```

## Response Format

Report findings as:

**Claude Analysis Complete**
**Verdict**: [SOLVED | NEEDS MORE INVESTIGATION | BLOCKED]
**Pattern**: [exploration | stuck | architecture | impact]

**Summary**: [2-4 sentences from result.md]

**Key Insights**: [bullet points]

**Output**: `/tmp/claude-analysis/{task-name}/result.md`

**Recommended Next Steps**: [what to do with findings]
