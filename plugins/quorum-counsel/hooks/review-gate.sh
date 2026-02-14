#!/usr/bin/env bash
set -euo pipefail

# review-gate.sh — Stop hook for automated counsel-reviewer
#
# Blocks Claude from stopping after code implementation unless
# counsel-reviewer was spawned AFTER the last implementation change.
# Uses JSONL line-number ordering to track implementation vs review state —
# no marker files, re-fires correctly after new implementation work.
# Plan review is handled manually via /review-plan command.

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

# --- Loop prevention (official field: true when hook already triggered continuation) ---
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0

# --- No transcript → nothing to check ---
[ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ] && exit 0

# --- Find LAST implementation line (Write/Edit/MultiEdit) ---
# Transcript is JSONL (Anthropic API format): tool_use entries have
# "type": "tool_use" and "name": "Write" (NOT "tool_name").
# grep -n gives line numbers; tail -1 gets the last occurrence.
LAST_IMPL=$(grep -nE '"tool_use"' "$TRANSCRIPT_PATH" 2>/dev/null \
  | grep -E '"name"\s*:\s*"(Write|Edit|MultiEdit)"' \
  | tail -1 | cut -d: -f1)

# No implementation → allow stop
[ -z "$LAST_IMPL" ] && exit 0

# --- Find LAST counsel-reviewer Task invocation line ---
# Must match actual Task tool_use with subagent_type, not text mentions.
LAST_REVIEW=$(grep -nE '"tool_use"' "$TRANSCRIPT_PATH" 2>/dev/null \
  | grep -E '"subagent_type"\s*:\s*"[^"]*counsel-reviewer"' \
  | tail -1 | cut -d: -f1)

# Review exists AND came after last implementation → allow stop
if [ -n "$LAST_REVIEW" ] && [ "$LAST_REVIEW" -gt "$LAST_IMPL" ]; then
  exit 0
fi

# --- Block and request review ---
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
