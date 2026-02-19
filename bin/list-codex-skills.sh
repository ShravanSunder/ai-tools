#!/usr/bin/env bash
set -uo pipefail

# list-codex-skills.sh — Outputs all skill directory paths available for Codex
#
# Knows the ai-tools layout and finds skills from:
#   1. plugins/*/skills/*/  (plugin skills — common, work in both Claude and Codex)
#   2. skills/*/            (standalone skills — may be Codex-specific)
#
# Each line is an absolute path to a skill directory containing SKILL.md.
# Used by devfiles/dot_codex/executable_sync-skills.sh to symlink into ~/.codex/skills/

AI_TOOLS_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Plugin skills (from Claude plugins that also work in Codex)
while IFS= read -r -d '' skill_md; do
  dirname "$skill_md"
done < <(find "$AI_TOOLS_ROOT/plugins" -path "*/skills/*/SKILL.md" -print0 2>/dev/null)

# Standalone skills
while IFS= read -r -d '' skill_md; do
  dirname "$skill_md"
done < <(find "$AI_TOOLS_ROOT/skills" -maxdepth 2 -name "SKILL.md" -print0 2>/dev/null)
