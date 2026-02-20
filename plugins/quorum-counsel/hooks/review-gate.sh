#!/usr/bin/env bash
set -euo pipefail

# review-gate.sh — Stop hook for automated counsel-reviewer
#
# Blocks Claude from stopping after substantial code implementation
# unless counsel-reviewer was spawned AFTER the last implementation change.
# Scoped to the current session run (ignores previous session history).
# Requires 20+ edit tool uses since last review/acknowledgment to trigger.
# Once dismissed (stop_hook_active), edits are acknowledged and won't re-trigger.

IMPL_THRESHOLD=20

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')
TRANSCRIPT_PATH=$(echo "$INPUT" | jq -r '.transcript_path // empty')

# --- No transcript → nothing to check ---
[ -z "$TRANSCRIPT_PATH" ] || [ ! -f "$TRANSCRIPT_PATH" ] && exit 0

# --- Acknowledgment marker: tracks edits already flagged and dismissed ---
# Uses transcript path hash so each session gets its own marker.
MARKER_HASH=$(echo "$TRANSCRIPT_PATH" | md5 2>/dev/null || echo "$TRANSCRIPT_PATH" | md5sum 2>/dev/null | cut -c1-16)
MARKER="/tmp/review-gate-ack-${MARKER_HASH}"

# --- Loop prevention + acknowledgment ---
# When stop_hook_active is true, the hook already fired and Claude continued.
# Record the current last impl line so these edits won't re-trigger.
if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  # Save current transcript line count as the acknowledged watermark
  wc -l < "$TRANSCRIPT_PATH" | tr -d ' ' > "$MARKER"
  exit 0
fi

# --- Scope to current session run ---
# SessionStart progress entries mark session boundaries (startup or resume).
# Only consider tool uses after the last SessionStart line.
SESSION_START=$(grep -n '"SessionStart"' "$TRANSCRIPT_PATH" 2>/dev/null \
  | tail -1 | cut -d: -f1 || true)
SESSION_START=${SESSION_START:-1}

# --- Load acknowledged watermark (if exists) ---
# Edits at or before this line were already flagged and dismissed.
ACK_LINE=0
if [ -f "$MARKER" ]; then
  ACK_LINE=$(cat "$MARKER" 2>/dev/null | tr -d ' ' || true)
  # Validate it's a number
  case "$ACK_LINE" in
    ''|*[!0-9]*) ACK_LINE=0 ;;
  esac
fi

# The effective start line is the latest of: session start, acknowledged line
EFFECTIVE_START=$SESSION_START
if [ "$ACK_LINE" -gt "$SESSION_START" ] 2>/dev/null; then
  EFFECTIVE_START=$ACK_LINE
fi

# --- Find all implementation line numbers since effective start ---
# Transcript is JSONL (Anthropic API format): tool_use entries have
# "type": "tool_use" and "name": "Write" (NOT "tool_name").
# grep -n gives line numbers; awk filters to effective start and extracts just numbers.
IMPL_LINES=$(grep -nE '"tool_use"' "$TRANSCRIPT_PATH" 2>/dev/null \
  | grep -E '"name"\s*:\s*"(Write|Edit|MultiEdit)"' \
  | awk -F: -v start="$EFFECTIVE_START" '$1 > start {print $1}' || true)

# No new implementation since effective start → allow stop
[ -z "$IMPL_LINES" ] && exit 0

LAST_IMPL=$(echo "$IMPL_LINES" | tail -1)

# --- Find LAST counsel-reviewer Task invocation since effective start ---
# Must match actual Task tool_use with subagent_type, not text mentions.
LAST_REVIEW=$(grep -nE '"tool_use"' "$TRANSCRIPT_PATH" 2>/dev/null \
  | grep -E '"subagent_type"\s*:\s*"[^"]*counsel-reviewer"' \
  | awk -F: -v start="$EFFECTIVE_START" '$1 > start {print $1}' \
  | tail -1 || true)

# Review exists AND came after last implementation → allow stop
if [ -n "$LAST_REVIEW" ] && [ "$LAST_REVIEW" -gt "$LAST_IMPL" ]; then
  exit 0
fi

# --- Check threshold: count edits since last review (or effective start) ---
# Only fire for substantial work (20+ edits since last counsel-reviewer), not quick fixes.
SINCE_LINE=${LAST_REVIEW:-$EFFECTIVE_START}
IMPL_COUNT=$(echo "$IMPL_LINES" \
  | awk -v since="$SINCE_LINE" '$1 > since' \
  | wc -l | tr -d ' ' || true)

[ "$IMPL_COUNT" -lt "$IMPL_THRESHOLD" ] && exit 0

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
