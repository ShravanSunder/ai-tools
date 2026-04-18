---
name: gemini-solver
description: Delegate problems to Google Gemini via the `gemini -p` CLI for large-scale codebase understanding, architecture analysis, or a different model's perspective. Gemini excels at massive context (1M+ tokens), system-wide pattern recognition, and clear explanations. Use when you need to understand a large codebase, trace cross-cutting concerns, or want a second opinion. Provide EXTENSIVE context for quality results. Takes 2-10 minutes.
---

# Gemini Solver

Delegate analysis tasks to Gemini via headless CLI. Gemini runs in read-only mode in `-p` mode — it can read files and search code autonomously but cannot write or run shell commands.

## Workflow

1. Classify the task pattern
2. Create output directory: `mkdir -p /tmp/gemini-analysis/{task-name}/`
3. Construct the prompt with task description and output format
4. Run `gemini -p` and capture JSON output
5. Extract `.response` from JSON → `result.md`
6. Read `result.md` and report findings

## Task Patterns

| Pattern | Signal Keywords |
|---------|-----------------|
| Codebase Exploration | "explore", "understand", "map", unfamiliar area |
| Stuck / Debug | "stuck", "tried N times", failed attempts |
| Architecture Design | "design", "architect", "refactor", trade-offs |
| Impact Analysis | "impact", "what breaks", "dependencies" |
| Explanation | "explain", "how does X work", "walk me through" |

## CLI Template

```bash
mkdir -p /tmp/gemini-analysis/{task-name}/

gemini -p "{prompt}" \
  -m gemini-3-pro-preview \
  --output-format json \
  2>&1 | tee /tmp/gemini-analysis/{task-name}/events.json

jq -r '.response' /tmp/gemini-analysis/{task-name}/events.json \
  > /tmp/gemini-analysis/{task-name}/result.md
```

### Flag Reference

| Flag | Purpose |
|------|---------|
| `-p "{prompt}"` | Non-interactive headless mode (read-only) |
| `-m gemini-3-pro-preview` | Model selection |
| `--output-format json` | JSON output: `{ "response": "...", "stats": {...} }` |

### Constructing the Prompt

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
# Extract response from JSON
jq -r '.response' /tmp/gemini-analysis/{task-name}/events.json \
  > /tmp/gemini-analysis/{task-name}/result.md

# Check token stats
jq '.stats' /tmp/gemini-analysis/{task-name}/events.json
```

## Response Format

Report findings as:

**Gemini Analysis Complete**
**Verdict**: [SOLVED | NEEDS MORE INVESTIGATION | BLOCKED]
**Pattern**: [exploration | stuck | architecture | impact | explanation]

**Summary**: [2-4 sentences from result.md]

**Key Insights**: [bullet points]

**Output**: `/tmp/gemini-analysis/{task-name}/result.md`

**Recommended Next Steps**: [what to do with findings]
