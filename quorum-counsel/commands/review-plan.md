---
description: Review plan via multi-model or Codex
argument-hint: [plan-file-path] [--codex]
---

Review the current plan using a background review agent.

## Argument Parsing

- `$ARGUMENTS` contains everything after `/review-plan`
- If `--codex` appears in arguments: use **codex-solver** agent
- Otherwise: use **counsel-reviewer** agent (default)
- Any non-flag argument is the plan file path

## Steps

1. **Resolve plan file**: Use the file path from arguments if provided. Otherwise, check conversation context for a recently created/discussed plan file (look for `.md` files in `~/.claude/plans/` or mentioned paths). If ambiguous, ask the user.

2. **Read the plan file** to confirm it exists and is a valid plan.

3. **Extract from conversation context**:
   - Problem statement (what the plan solves)
   - Requirements list (R1, R2, ...)
   - Constraints (perf, security, architecture, etc.)
   - Specific review concerns

4. **Spawn the appropriate background agent**:

### If using counsel-reviewer (default):

Spawn `counsel-reviewer` as a background Task (`run_in_background: true`) with this prompt:

```
TYPE: plan-review

PLAN_FILE:
<absolute path to the plan file>

PROBLEM_STATEMENT:
<2-4 sentences from conversation context>

REQUIREMENTS:
R1. <requirement>
R2. <requirement>
...

CONSTRAINTS:
<constraints from conversation>

REVIEW_QUESTIONS:
Q1. Are there architectural gaps or missing considerations?
Q2. Are there edge cases the plan doesn't handle?
Q3. Are there simpler alternatives to the proposed approach?
Q4. <add context-specific questions>
```

### If using codex-solver (`--codex` flag):

Spawn `codex-solver` as a background Task (`run_in_background: true`) with this prompt:

```
Analyze this implementation plan for quality, completeness, and risks.

PLAN FILE: <absolute path>
Read the plan file above first.

PROBLEM:
<2-4 sentences>

REQUIREMENTS:
R1. ...
R2. ...

FOCUS:
1. Are the requirements fully addressed?
2. Are there architectural gaps or edge cases?
3. Are there simpler alternatives?
4. What are the risks and dependencies?
5. <context-specific questions>

CONSTRAINTS:
<constraints from conversation>
```

5. **Inform the user** that the review is running in the background and they can continue working.

6. **When results arrive**, present the brief summary with file pointers (progressive disclosure pattern -- do not dump the full report into chat).
