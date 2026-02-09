#!/usr/bin/env bash
set -euo pipefail

# review-gate.sh — Stop hook for automated counsel-reviewer
#
# Blocks Claude from stopping after implementation or plan creation
# unless counsel-reviewer was already spawned. Claude provides only
# conversational context (intent, requirements); reviewers gather
# code/plan data themselves via git diff and file reading.

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

# --- Loop prevention ---
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0

# --- No transcript → nothing to check ---
[ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ] && exit 0

# --- Detect what Claude did ---
has_implementation=false
has_plan=false

if grep -q '"tool_name":"Write"\|"tool_name":"Edit"' "$TRANSCRIPT_PATH" 2>/dev/null; then
  has_implementation=true
fi

if grep -q '"ExitPlanMode"\|"name":"ExitPlanMode"' "$TRANSCRIPT_PATH" 2>/dev/null; then
  has_plan=true
fi

# Nothing worth reviewing
[ "$has_implementation" = "false" ] && [ "$has_plan" = "false" ] && exit 0

# --- Already reviewed → allow stop ---
if grep -q 'counsel-reviewer' "$TRANSCRIPT_PATH" 2>/dev/null; then
  exit 0
fi

# --- Block and request review ---
if [ "$has_implementation" = "true" ]; then
  cat >&2 <<'FEEDBACK'
REVIEW REQUIRED — You MUST spawn counsel-reviewer as a BACKGROUND task (run_in_background: true) before stopping.

Reviewers (Gemini + Codex) will run `git diff` and inspect the codebase themselves.
You provide ONLY what they cannot see — your intent and conversational context:

TYPE: code-review

PROBLEM_STATEMENT:
<What you implemented and why — 2-4 sentences>

REQUIREMENTS:
R1. <requirement from the user's original request>
R2. ...

CONSTRAINTS:
<Any perf, security, compat, or architecture constraints>

CHANGESET_SUMMARY:
<What you changed and the approach you took — 2-4 sentences>

REVIEW_QUESTIONS:
Q1. Are there bugs or logic errors in the changes?
Q2. Are there security concerns?
Q3. <Add questions specific to this change>
FEEDBACK
  exit 2
fi

if [ "$has_plan" = "true" ]; then
  cat >&2 <<'FEEDBACK'
REVIEW REQUIRED — You MUST spawn counsel-reviewer as a BACKGROUND task (run_in_background: true) before stopping.

Reviewers (Gemini + Codex) will read the plan file and inspect the codebase themselves.
You provide ONLY what they cannot see — your intent and conversational context:

TYPE: plan-review

PLAN_FILE:
<Absolute path to the plan .md file you created>

PROBLEM_STATEMENT:
<What problem the plan solves — 2-4 sentences>

REQUIREMENTS:
R1. <requirement from the user's original request>
R2. ...

CONSTRAINTS:
<Constraints that shaped the plan>

REVIEW_QUESTIONS:
Q1. Are there architectural gaps?
Q2. Missing edge cases?
Q3. <Add questions specific to this plan>
FEEDBACK
  exit 2
fi

exit 0
