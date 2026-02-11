#!/usr/bin/env bash
set -euo pipefail

# review-gate.sh — Stop hook for automated counsel-reviewer
#
# Blocks Claude from stopping after code implementation unless
# counsel-reviewer was already spawned. Claude provides only
# conversational context (intent, requirements); reviewers gather
# code data themselves via git diff and file reading.
# Plan review is handled manually via /review-plan command.

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

# --- Loop prevention (official field: true when hook already triggered continuation) ---
[ "$STOP_HOOK_ACTIVE" = "true" ] && exit 0

# --- No transcript → nothing to check ---
[ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ] && exit 0

# --- Detect code implementation (Write/Edit/MultiEdit tools) ---
# Transcript is JSONL using Anthropic API format: tool use entries have
# "type": "tool_use" and "name": "Write" (NOT "tool_name")
has_implementation=false

if grep -E '"tool_use"' "$TRANSCRIPT_PATH" 2>/dev/null | grep -qE '"name"\s*:\s*"(Write|Edit|MultiEdit)"'; then
  has_implementation=true
fi

# Nothing worth reviewing
[ "$has_implementation" = "false" ] && exit 0

# --- Already reviewed → allow stop ---
if grep -q 'counsel-reviewer' "$TRANSCRIPT_PATH" 2>/dev/null; then
  exit 0
fi

# --- Session marker: already requested review → allow stop ---
SESSION_HASH=$(echo "$TRANSCRIPT_PATH" | md5 -q 2>/dev/null || echo "$TRANSCRIPT_PATH" | md5sum 2>/dev/null | cut -c1-12)
MARKER="/tmp/counsel-review-gate-${SESSION_HASH}"
[ -f "$MARKER" ] && exit 0

# --- Block and request review ---
if [ "$has_implementation" = "true" ]; then
  touch "$MARKER"
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

exit 0
