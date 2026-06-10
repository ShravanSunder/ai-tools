#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/test-helpers.sh"

mode="fast"
specific_scenario=""
timeout_seconds=900

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fast)
      mode="fast"
      shift
      ;;
    --integration)
      mode="integration"
      shift
      ;;
    --scenario)
      specific_scenario="$2"
      shift 2
      ;;
    --timeout)
      timeout_seconds="$2"
      shift 2
      ;;
    --help|-h)
      cat <<'USAGE'
Usage: tests/skills/run-skill-pressure-tests.sh [--fast|--integration] [--scenario NAME] [--timeout SECONDS]

Environment:
  CODEX_PRESSURE_MODEL              default: gpt-5.4
  CODEX_PRESSURE_REASONING_EFFORT   default: low
USAGE
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

mapfile -t scenarios < <(find "$SCRIPT_DIR/pressure-scenarios" -maxdepth 1 -type f -name '*.md' ! -name 'README.md' | sort)

if [[ -n "$specific_scenario" ]]; then
  if [[ "$specific_scenario" == *.md ]]; then
    scenarios=("$SCRIPT_DIR/pressure-scenarios/$specific_scenario")
  else
    scenarios=("$SCRIPT_DIR/pressure-scenarios/$specific_scenario.md")
  fi
fi

passed=0
failed=0

echo "Skill pressure tests"
echo "Mode: $mode"
echo "Model: ${CODEX_PRESSURE_MODEL:-gpt-5.4}"
echo "Reasoning effort: ${CODEX_PRESSURE_REASONING_EFFORT:-low}"
echo ""

for scenario_file in "${scenarios[@]}"; do
  echo "Running $(basename "$scenario_file")"
  if [[ ! -f "$scenario_file" ]]; then
    echo "  [FAIL] Missing scenario: $scenario_file"
    failed=$((failed + 1))
    continue
  fi

  if SKILL_PRESSURE_MODE="$mode" run_pressure_scenario_file "$scenario_file" "$timeout_seconds"; then
    passed=$((passed + 1))
  else
    failed=$((failed + 1))
  fi
  echo ""
done

echo "Passed: $passed"
echo "Failed: $failed"

if [[ "$failed" -gt 0 ]]; then
  exit 1
fi
