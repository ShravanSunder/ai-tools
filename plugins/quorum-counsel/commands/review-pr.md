---
description: Review code changes or a GitHub PR via multi-model counsel
argument-hint: "[PR-number] [bugs|security|errors|tests|patterns|all]"
---

Review code changes using counsel-reviewer (Gemini 3 + Codex GPT-5.3 in parallel)
with confidence-based scoring to minimize false positives.

## Argument Parsing

- `$ARGUMENTS` contains everything after `/review-pr`
- A number (e.g. `123`) or GitHub PR URL: review that specific PR via `gh pr diff`
- Aspect keywords: `bugs`, `security`, `errors`, `tests`, `patterns`, `all` (default: `all`)
- No number: review local `git diff HEAD` changes (same as the Stop hook review)

## Steps

1. **Parse arguments**: Extract PR number (if any) and aspect keywords from `$ARGUMENTS`.

2. **Verify there are changes to review**:
   - If PR number: run `gh pr view {number} --json state` to confirm PR exists.
     If merged or closed, warn the user but proceed (retrospective reviews are valid).
   - If no PR number: check `git diff HEAD` has output
   - If no changes found (and no PR number), inform user and stop

3. **Extract from conversation context**:
   - Problem statement (what was changed and why)
   - Requirements list (R1, R2, ...)
   - Constraints (perf, security, architecture)
   - Specific review concerns

4. **Spawn counsel-reviewer** as a background Task (`run_in_background: true`):

```
TYPE: code-review

PROBLEM_STATEMENT:
<2-4 sentences from conversation context or PR description>

REQUIREMENTS:
R1. <requirement>
R2. <requirement>
...

CONSTRAINTS:
<constraints from conversation>

CHANGESET_SUMMARY:
<What changed — from conversation context or "See PR description">

REVIEW_DIMENSIONS: <aspect keywords, default: all>

REVIEW_QUESTIONS:
Q1. Are there bugs or logic errors? (confidence >= 80 only)
Q2. Are there security vulnerabilities?
Q3. Are there silent failures or swallowed errors?
Q4. Are there test coverage gaps for critical paths?
Q5. <add context-specific questions>

PR_NUMBER:
<number, if provided — counsel-reviewer will use gh pr diff>
```

5. **Inform the user** that the review is running in the background.

6. **When results arrive**, present the brief summary with file pointers
   (progressive disclosure — do not dump full reports into chat).
