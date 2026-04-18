---
name: counsel-reviewer
description: Orchestrate parallel code review or plan review using both Claude (Opus) and Gemini. Use after creating implementation plans (plan review) or after completing implementation (code review). Spawns both models in parallel, then synthesizes findings with confidence scoring and consensus detection. Provides 42-48% better bug detection vs single model. Use for substantial work — not quick fixes.
---

# Counsel Reviewer

Orchestrate parallel review from Claude (Opus) and Gemini, then synthesize findings into a unified review with confidence scoring.

> **Codex-specific version.** The Claude Code counterpart lives in `plugins/quorum-counsel/agents/counsel-reviewer.md` and calls `codex exec` + `gemini -p`. This version calls `claude -p` + `gemini -p` since Codex is the orchestrator.

## Review Types

| Type | When | Focus |
|------|------|-------|
| Plan Review | After creating implementation plans | Architecture, gaps, edge cases, alternatives |
| Code Review | After completing implementation | Bugs, security, logic errors, test gaps |

## Workflow

1. Determine review type (plan-review or code-review)
2. Create output directory: `mkdir -p /tmp/counsel-review/{task-id}/{claude,gemini}`
3. Gather data (diffs, PR metadata, plan files)
4. Write context file and model-specific prompts
5. Launch Claude + Gemini in parallel
6. Wait for both to complete
7. Read outputs, synthesize with weighted aggregation
8. Write summary and report

## Step 1: Gather Data

**Code review with PR number:**
```bash
TASK_ID=$(date +%s)
mkdir -p /tmp/counsel-review/$TASK_ID/{claude,gemini}

gh pr diff {PR_NUMBER} > /tmp/counsel-review/$TASK_ID/changeset.diff
gh pr view {PR_NUMBER} --json title,body,labels,headRefName,baseRefName \
  > /tmp/counsel-review/$TASK_ID/pr-metadata.json
gh pr diff {PR_NUMBER} --name-only > /tmp/counsel-review/$TASK_ID/changed-files.txt
git log --oneline -10 > /tmp/counsel-review/$TASK_ID/recent-commits.txt
```

**Code review without PR (local changes):**
```bash
git diff HEAD > /tmp/counsel-review/$TASK_ID/changeset.diff
git diff >> /tmp/counsel-review/$TASK_ID/changeset.diff
git diff --stat > /tmp/counsel-review/$TASK_ID/diff-stat.txt
git log --oneline -10 > /tmp/counsel-review/$TASK_ID/recent-commits.txt
```

**Plan review:**
```bash
cp {PLAN_FILE_PATH} /tmp/counsel-review/$TASK_ID/plan.md
```

## Step 2: Write Context and Prompts

Write the context (requirements, constraints, intent) to `/tmp/counsel-review/$TASK_ID/context.md`.

Write model-specific prompts to:
- `/tmp/counsel-review/$TASK_ID/claude-prompt.txt`
- `/tmp/counsel-review/$TASK_ID/gemini-prompt.txt`

### Claude Prompt Focus (Bugs & Security)

Claude (Opus) excels at: logic errors, security vulnerabilities, silent failures, error handling gaps, test coverage.

Include in prompt:
- Read context and diff/plan files from `/tmp/counsel-review/$TASK_ID/`
- Restate requirements (R1..Rn) and map coverage
- Focus: bugs, security audit (OWASP), silent failure hunting, error handling, test gaps
- Confidence scoring: 0-100 per finding, only report >= 80
- Output format: `[Confidence: XX] [P0/P1/P2/P3] [category] Description — file:line`

### Gemini Prompt Focus (Architecture & Patterns)

Gemini excels at: architectural implications, system-wide impacts, pattern recognition, large context understanding.

Include in prompt:
- Read context and diff/plan files from `/tmp/counsel-review/$TASK_ID/`
- Restate requirements and map coverage
- Focus: architecture fit, cross-file consistency, integration issues, maintainability, CLAUDE.md compliance
- Confidence scoring: 0-100 per finding, only report >= 80
- Same output format as Claude

### Severity Rubric (use in BOTH prompts)

- **P0 / CRITICAL**: Security exploits, data loss, authz bypass, crash in common path
- **P1 / HIGH**: High-likelihood bugs, major perf regression, broken API contract
- **P2 / MEDIUM**: Edge-case bugs, maintainability risk, incomplete error handling
- **P3 / LOW**: Minor cleanup, nits that materially improve clarity

## Step 3: Launch in Parallel

```bash
claude -p "$(cat /tmp/counsel-review/$TASK_ID/claude-prompt.txt)" \
  --model opus \
  --output-format json \
  --tools "Read,Glob,Grep" \
  --dangerously-skip-permissions \
  --no-session-persistence \
  --max-turns 30 \
  > /tmp/counsel-review/$TASK_ID/claude/result.json 2>&1 &
CLAUDE_PID=$!

gemini -p "$(cat /tmp/counsel-review/$TASK_ID/gemini-prompt.txt)" \
  -m gemini-3-pro-preview \
  --output-format json \
  > /tmp/counsel-review/$TASK_ID/gemini/result.json 2>&1 &
GEMINI_PID=$!

wait $CLAUDE_PID $GEMINI_PID
```

## Step 4: Extract Results

```bash
jq -r '.result' /tmp/counsel-review/$TASK_ID/claude/result.json \
  > /tmp/counsel-review/$TASK_ID/claude/review.md

jq -r '.response' /tmp/counsel-review/$TASK_ID/gemini/result.json \
  > /tmp/counsel-review/$TASK_ID/gemini/review.md
```

## Step 5: Synthesize

Read both `review.md` files and synthesize:

1. **Parse findings** from both models (confidence 0-100)
2. **Consensus bonus**: +15 confidence (cap 100) if both find same issue (same file:line, similar description)
3. **Threshold filter**: Only report findings with confidence >= 80 (after bonus)
4. **Categorize**: Consensus Issues (both found) → Claude-specific → Gemini-specific
5. **Weight by strength**:
   - Architecture/patterns: Gemini 70%, Claude 30%
   - Security/bugs: Claude 80%, Gemini 20%
   - Silent failures: Claude 80%, Gemini 20%
   - Logic errors: Claude 70%, Gemini 30%
6. **Sort**: Consensus first → confidence desc → severity P0>P1>P2>P3

Write synthesis to `/tmp/counsel-review/$TASK_ID/summary.md`.

## Response Format

```
**Counsel Review Complete** — {plan-review | code-review}

**Verdict**: {PASS | PASS WITH CONCERNS | REVISE}
**Models**: Claude Opus + Gemini 3
**Findings**: {N} issues (confidence >= 80) | {N} consensus | {N} Claude-only | {N} Gemini-only

**Critical Issues** ({count}):
- [P{n}] [Confidence: {nn}] {description} — {file:line}

**Requirements Gaps**: {MISSING/PARTIAL from R1..Rn, or "All covered"}

**Top Recommendations**:
1. {most important action}
2. {second action}

**Detailed Reports**:
- Summary: /tmp/counsel-review/{id}/summary.md
- Claude review: /tmp/counsel-review/{id}/claude/review.md
- Gemini review: /tmp/counsel-review/{id}/gemini/review.md
```

## Error Handling

- If one model fails: use the other's results, note failure, reduce confidence
- If both fail: report failure with partial output
