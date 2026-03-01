---
name: codex-solver
description: "**Not for use from Codex.** This skill calls `codex exec`. Codex cannot self-nest via CLI. Delegate problems to OpenAI Codex via the `codex exec` CLI for autonomous multi-file analysis, backend architecture reasoning, or a different model's perspective. Use when stuck on debugging, need codebase exploration, architecture design, or impact analysis. Provide EXTENSIVE context — exact file paths, code snippets, error messages, what you've tried — for quality results. Takes 5-30 minutes."
---

# Codex Solver

Delegate analysis tasks to OpenAI Codex via the `codex exec` CLI. Codex runs in sandbox mode — it can read source files and write analysis output to `/tmp` only.

## Workflow

1. Classify the task pattern and determine reasoning effort
2. Create output directory: `mkdir -p /tmp/codex-analysis/{task-name}/`
3. Construct the prompt with developer instructions and task description
4. Run `codex exec` and capture output
5. Read output files from `/tmp/codex-analysis/`
6. Report structured summary with key findings

## Task Patterns

| Pattern | Effort | Signal Keywords |
|---------|--------|-----------------|
| Codebase Exploration | `low` | "explore", "understand", "map", unfamiliar area |
| Stuck / Debug | `high` | "stuck", "tried N times", failed attempts |
| Architecture Design | `high` | "design", "architect", "refactor", trade-offs |
| Impact Analysis | `medium` | "impact", "what breaks", "dependencies" |

## CLI Template

```bash
mkdir -p /tmp/codex-analysis/{task-name}/

codex exec \
  --model gpt-5.3-codex \
  --sandbox workspace-write \
  --full-auto \
  --json \
  -o /tmp/codex-analysis/{task-name}/result.md \
  "{prompt_with_developer_instructions}" \
  2>&1 | tee /tmp/codex-analysis/{task-name}/events.jsonl
```

### Flag Reference

| Flag | Value | Purpose |
|------|-------|---------|
| `--model` | `gpt-5.3-codex` | Model to use for analysis |
| `--sandbox` | `workspace-write` | Read source + write to /tmp only |
| `--full-auto` | (no value) | Autonomous execution, no approval prompts |
| `--json` | (no value) | Stream JSONL events to stdout |
| `-o` | `/tmp/codex-analysis/{task}/result.md` | Capture final message to file |

### Constructing the Prompt

Build a single prompt string with developer instructions and the task:

```
DEVELOPER INSTRUCTIONS - MANDATORY, NO EXCEPTIONS:
FILE WRITE POLICY:
- You may ONLY write files to /tmp/codex-analysis/{task-name}/
- You must NEVER create, edit, modify, rename, move, or delete ANY file outside /tmp/codex-analysis/{task-name}/
- Treat the entire project as READ-ONLY. Your only output is markdown analysis files in /tmp.

OUTPUT RULES:
1. Write ALL detailed findings to /tmp/codex-analysis/{task-name}/
2. Create structured markdown files for your analysis
3. Return a brief summary (under 300 words) with the file paths you created

Create these output files:
- /tmp/codex-analysis/{task-name}/summary.md - Executive summary
- /tmp/codex-analysis/{task-name}/{pattern-specific files}

TASK:
{the actual task description from the incoming prompt}

CONTEXT:
{any relevant context: what was tried, cwd, constraints}
```

### Prompt Quality

Analysis quality depends entirely on context provided. Always include:
1. Exact file paths, function/class names, line numbers
2. Complete relevant code snippets (not summaries)
3. Error messages, test output, behavior descriptions
4. What was tried and why it failed
5. Architecture constraints and requirements

## Pattern-Specific Output Files

Request different files based on the pattern:

- **Exploration**: `summary.md`, `architecture.md`, `key-files.md`, `data-flow.md`
- **Stuck/Debug**: `summary.md`, `analysis.md`, `solution.md`, `alternatives.md`
- **Architecture**: `summary.md`, `architecture.md`, `tradeoffs.md`, `implementation.md`
- **Impact Analysis**: `summary.md`, `dependents.md`, `dependencies.md`, `risks.md`

## Handling Long-Running Tasks

The Bash tool may have a timeout. For tasks that may exceed it:

1. Run the codex command in the background
2. Check periodically if the task completed
3. Once complete, read the output files

For most tasks (exploration, review, impact), 10 minutes is sufficient.

## Reading Results

```bash
# List output files
ls /tmp/codex-analysis/{task-name}/

# Read summary first
cat /tmp/codex-analysis/{task-name}/summary.md

# Read detailed files as needed
cat /tmp/codex-analysis/{task-name}/result.md
```

## Response Format

Report findings as:

**Codex Analysis Complete**
**Verdict**: [SOLVED | NEEDS MORE INVESTIGATION | BLOCKED]
**Pattern**: [exploration | stuck | architecture | impact]
**Effort**: [low | medium | high]

**Summary**: [2-4 sentences from summary.md]

**Key Insights**: [bullet points]

**Output Files**:
- `/tmp/codex-analysis/{task}/summary.md` - [brief description]
- `/tmp/codex-analysis/{task}/[other].md` - [brief description]

**Recommended Next Steps**: [what to do with findings]
