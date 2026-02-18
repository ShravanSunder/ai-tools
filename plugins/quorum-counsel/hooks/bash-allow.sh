#!/usr/bin/env bash
set -euo pipefail

# bash-allow.sh — PreToolUse hook for quorum-counsel subagents
#
# Auto-approves specific safe Bash commands needed by counsel-reviewer,
# codex-solver, and gemini-solver background subagents. Commands not
# matched pass through to the normal permission system (which denies
# in background subagent context).
#
# Referenced by agent frontmatter hooks, so only fires for those agents.

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

[ -z "$COMMAND" ] && exit 0

allow() {
  jq -n --arg reason "$1" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
}

# gemini CLI (reject if chained with && or ;)
if echo "$COMMAND" | grep -qE '(^|\s|\()gemini\s'; then
  echo "$COMMAND" | grep -qE '(&&|;|\|\|)' || allow "quorum-counsel: gemini CLI"
fi

# codex CLI (reject if chained with && or ;)
if echo "$COMMAND" | grep -qE '(^|\s|\()codex\s'; then
  echo "$COMMAND" | grep -qE '(&&|;|\|\|)' || allow "quorum-counsel: codex CLI"
fi

# /tmp/counsel-review/ ops (exclude destructive)
if echo "$COMMAND" | grep -qF '/tmp/counsel-review/'; then
  echo "$COMMAND" | grep -qE '(^|\s)(rm\s|sudo\s|chmod\s|chown\s)' || allow "quorum-counsel: safe /tmp/counsel-review/ op"
fi

# /tmp/codex-analysis/ ops (exclude destructive)
if echo "$COMMAND" | grep -qF '/tmp/codex-analysis/'; then
  echo "$COMMAND" | grep -qE '(^|\s)(rm\s|sudo\s|chmod\s|chown\s)' || allow "quorum-counsel: safe /tmp/codex-analysis/ op"
fi

# /tmp/gemini-analysis/ ops (exclude destructive)
if echo "$COMMAND" | grep -qF '/tmp/gemini-analysis/'; then
  echo "$COMMAND" | grep -qE '(^|\s)(rm\s|sudo\s|chmod\s|chown\s)' || allow "quorum-counsel: safe /tmp/gemini-analysis/ op"
fi

# mkdir -p /tmp/
echo "$COMMAND" | grep -qE '^\s*mkdir\s+(-p\s+)?/tmp/' && allow "quorum-counsel: mkdir /tmp"

# git read-only
echo "$COMMAND" | grep -qE '^git\s+(diff|log|show|status|describe)' && allow "quorum-counsel: git read-only"

# gh read-only (PR data gathering for counsel-reviewer)
echo "$COMMAND" | grep -qE '^gh\s+(pr\s+(view|diff|list|checks)|issue\s+(view|list)|search)' && allow "quorum-counsel: gh read-only"

# jq for JSON parsing (gemini-solver output extraction)
echo "$COMMAND" | grep -qE '^\s*jq\s' && allow "quorum-counsel: jq"

# wait (parallel job coordination)
echo "$COMMAND" | grep -qE '^\s*wait(\s|$)' && allow "quorum-counsel: wait"

# cat/tee to /tmp/ (writing output files)
if echo "$COMMAND" | grep -qE '(cat|tee)\s' && echo "$COMMAND" | grep -qF '/tmp/'; then
  echo "$COMMAND" | grep -qE '(^|\s)(rm\s|sudo\s|chmod\s|chown\s)' || allow "quorum-counsel: safe /tmp cat/tee"
fi

# Pass through — background subagent context = DENY
exit 0
