#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
mode=""
scenario=""
timeout_seconds="180"
jobs="${SKILL_PRESSURE_JOBS:-4}"
serial="false"

set_mode() {
  local requested="$1"
  if [[ -n "$mode" && "$mode" != "$requested" ]]; then
    echo "Selection modes are mutually exclusive: $mode and $requested" >&2
    exit 2
  fi
  mode="$requested"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --)
      shift
      ;;
    --fast)
      set_mode "fast"
      shift
      ;;
    --standard)
      set_mode "standard"
      shift
      ;;
    --high-risk)
      set_mode "high"
      shift
      ;;
    --diagnostic)
      set_mode "diagnostic"
      shift
      ;;
    --scenario)
      [[ $# -ge 2 ]] || { echo "--scenario requires an id" >&2; exit 2; }
      set_mode "scenario"
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
Usage: tests/test-utils/skill-pressure/run-skill-pressure-tests.sh [--fast|--diagnostic|--standard|--high-risk|--scenario ID] [--timeout SECONDS] [--jobs N|--serial]

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

mode="${mode:-fast}"

[[ "$jobs" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid --jobs value: $jobs" >&2; exit 2; }
[[ "$timeout_seconds" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid --timeout value: $timeout_seconds" >&2; exit 2; }

export SKILL_PRESSURE_FAST="0"
export SKILL_PRESSURE_TIMEOUT_SECONDS="$timeout_seconds"
export SKILL_PRESSURE_JOBS="$jobs"
export SKILL_PRESSURE_SERIAL="$serial"
unset SKILL_PRESSURE_RISK || true
if [[ "$mode" == "fast" ]]; then
  export SKILL_PRESSURE_FAST="1"
elif [[ "$mode" == "standard" || "$mode" == "high" ]]; then
  export SKILL_PRESSURE_RISK="$mode"
fi
if [[ "$mode" == "scenario" ]]; then
  export SKILL_PRESSURE_SCENARIO="$scenario"
else
  unset SKILL_PRESSURE_SCENARIO || true
fi

exec pnpm --dir "$SCRIPT_DIR" run test:evals
