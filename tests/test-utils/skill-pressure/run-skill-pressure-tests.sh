#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
mode="fast"
scenario=""
timeout_seconds="180"
jobs="${SKILL_PRESSURE_JOBS:-4}"
serial="false"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --fast)
      mode="fast"
      shift
      ;;
    --scenario)
      [[ $# -ge 2 ]] || { echo "--scenario requires an id" >&2; exit 2; }
      scenario="${2%.md}"
      shift 2
      ;;
    --timeout)
      [[ $# -ge 2 ]] || { echo "--timeout requires seconds" >&2; exit 2; }
      timeout_seconds="$2"
      shift 2
      ;;
    --jobs)
      [[ $# -ge 2 ]] || { echo "--jobs requires a count" >&2; exit 2; }
      jobs="$2"
      shift 2
      ;;
    --serial)
      serial="true"
      shift
      ;;
    --help|-h)
      cat <<'USAGE'
Usage: tests/test-utils/skill-pressure/run-skill-pressure-tests.sh [--fast] [--scenario ID] [--timeout SECONDS] [--jobs N|--serial]

Runs behavioral skill pressure tests through Vitest Evals. Every authoritative
subject call uses ACPX with Codex Luna/xhigh.
USAGE
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

[[ "$jobs" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid --jobs value: $jobs" >&2; exit 2; }
[[ "$timeout_seconds" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid --timeout value: $timeout_seconds" >&2; exit 2; }

export SKILL_PRESSURE_FAST="1"
export SKILL_PRESSURE_TIMEOUT_SECONDS="$timeout_seconds"
export SKILL_PRESSURE_JOBS="$jobs"
export SKILL_PRESSURE_SERIAL="$serial"
if [[ -n "$scenario" ]]; then
  export SKILL_PRESSURE_SCENARIO="$scenario"
else
  unset SKILL_PRESSURE_SCENARIO || true
fi

exec pnpm --dir "$SCRIPT_DIR" run test:evals
