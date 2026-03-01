#!/usr/bin/env bash
set -uo pipefail

# list-codex-skills.sh — Outputs all skill directory paths available for Codex
#
# Knows the ai-tools layout and finds skills from:
#   1. plugins/*/skills/*/  (plugin skills — common, work in both Claude and Codex)
#   2. skills/*/            (standalone skills — may be Codex-specific)
#
# Filtering: If a skill directory contains a .skip-codex marker file, it is
# excluded. This prevents skills that can't run from Codex (e.g., a hypothetical
# codex-solver that calls `codex exec`) from being synced.
#
# Each line is an absolute path to a skill directory containing SKILL.md.
# Used by the Codex sync script to symlink into ~/.agents/skills/

AI_TOOLS_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Plugin skills (from Claude plugins that also work in Codex)
while IFS= read -r -d '' skill_md; do
  skill_dir=$(dirname "$skill_md")
  [[ -f "$skill_dir/.skip-codex" ]] && continue
  echo "$skill_dir"
done < <(find "$AI_TOOLS_ROOT/plugins" -path "*/skills/*/SKILL.md" -print0 2>/dev/null)

# Standalone skills
while IFS= read -r -d '' skill_md; do
  skill_dir=$(dirname "$skill_md")
  [[ -f "$skill_dir/.skip-codex" ]] && continue
  echo "$skill_dir"
done < <(find "$AI_TOOLS_ROOT/skills" -maxdepth 2 -name "SKILL.md" -print0 2>/dev/null)
