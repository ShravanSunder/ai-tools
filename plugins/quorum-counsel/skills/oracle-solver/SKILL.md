---
name: oracle-solver
description: "**NEVER invoke automatically — only when the user EXPLICITLY asks.** Delegate problems to GPT-5.4 Pro via `pnpx @steipete/oracle` CLI in browser mode. Oracle is a heavy hitter: expensive (ChatGPT Pro subscription), slow (10-30 minutes per run), and must be loaded with maximum context. Oracle starts empty — it cannot read your codebase, so you MUST bundle ALL relevant files via `--file` flags. Use only when the user says \"ask Oracle\", \"consult Oracle\", \"run Oracle\", or similar. Always run in background."
---

# Oracle Solver

Delegate analysis tasks to GPT-5.4 Pro via `pnpx @steipete/oracle` CLI in browser mode. Oracle automates ChatGPT via Chrome DevTools Protocol — it is slow (10-30 min), expensive, and must be explicitly requested by the user.

**NEVER invoke this skill automatically.** Only when the user explicitly asks.

## Workflow

1. Analyze the incoming prompt to understand what Oracle needs to answer
2. Use Glob to gather ALL relevant source files, configs, tests, docs
3. Create output directory: `mkdir -p /tmp/oracle-analysis/{task-name}/`
4. Construct the CLI command with detailed prompt and `--file` flags for every relevant file
5. Run `pnpx @steipete/oracle` in background (10-30 min runtime)
6. Read `/tmp/oracle-analysis/{task-name}/result.md` when complete
7. Report structured summary with key findings

## File Gathering (Critical)

Oracle cannot read your codebase — you must feed it everything via `--file` flags:

- Include all source files matching the task area (directories and globs work)
- Include test files, config files, documentation
- Include project metadata (`CLAUDE.md`, `package.json`, `pyproject.toml`)
- Aim for comprehensive coverage — Oracle handles up to ~196k tokens of input
- Use `!pattern` exclusions for irrelevant files (`!node_modules`, `!*.lock`)

More context = better results. Err on the side of too much.

## CLI Template

```bash
mkdir -p /tmp/oracle-analysis/{task-name}/

pnpx @steipete/oracle \
  -p "{prompt}" \
  --file "src/**/*.ts" \
  --file "tests/**/*.ts" \
  --file "!node_modules" \
  --file "CLAUDE.md" \
  --slug "{task-name}" \
  2>&1 | tee /tmp/oracle-analysis/{task-name}/result.md
```

**IMPORTANT**: Always run the oracle command in background — it takes 10-30 minutes.

### Flag Reference

| Flag | Purpose |
|------|---------|
| `-p "{prompt}"` | Prompt text for GPT-5.4 Pro |
| `--file "paths..."` | Files/dirs/globs to attach (repeatable, `!` to exclude) |
| `--slug "{task-name}"` | Memorable 3-5 word session identifier |

Config at `~/.oracle/config.json` handles browser flags (engine, manualLogin, autoReattach).

### Constructing the Prompt

Oracle works best with extensive context and specific questions:

```
PROJECT BRIEFING:
- Project: {name and purpose}
- Stack: {languages, frameworks, key dependencies}

TASK:
{task description with full context}

CONTEXT:
{what was tried, constraints, background}

SPECIFIC QUESTIONS:
1. {first specific question}
2. {second specific question}

OUTPUT FORMAT:
## Summary (2-4 sentences)
## Key Findings (numbered, with file references, severity)
## Detailed Analysis
## Recommendations (actionable, priority-ordered)
```

### Prompt Quality

Analysis quality depends entirely on context provided. Always include:
1. Complete file context via `--file` flags — directories and globs
2. Project briefing — stack, architecture, constraints
3. Specific questions — not "review this" but targeted analysis requests
4. What was tried and why it failed
5. Architecture constraints and requirements

## Session Management

If Oracle disconnects or times out, reattach:
```bash
pnpx @steipete/oracle session {slug}
```

Never start a second Oracle session while one is running.

## First-Time Setup

If Oracle has never been run, the user must do a one-time browser login:
```bash
pnpx @steipete/oracle --engine browser --browser-manual-login --browser-keep-browser -p "HI"
```

## Response Format

Report findings as:

**Oracle Analysis Complete**
**Verdict**: [SOLVED | NEEDS MORE INVESTIGATION | BLOCKED]
**Model**: GPT-5.4 Pro (browser mode)
**Duration**: [approximate time taken]

**Summary**: [2-4 sentences from result.md]

**Key Insights**: [bullet points]

**Output**: `/tmp/oracle-analysis/{task-name}/result.md`

**Recommended Next Steps**: [what to do with findings]
