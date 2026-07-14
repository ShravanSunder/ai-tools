#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
mode=""
scenario=""
timeout_seconds="180"
jobs="${SKILL_PRESSURE_JOBS:-4}"
serial="false"
dry_run="false"
max_model_prompts="${SKILL_PRESSURE_MAX_MODEL_PROMPTS:-}"
max_acpx_commands="${SKILL_PRESSURE_MAX_ACPX_COMMANDS:-}"
max_retries="${SKILL_PRESSURE_MAX_RETRIES:-}"
max_observed_tokens="${SKILL_PRESSURE_MAX_OBSERVED_TOKENS:-}"

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
    --dry-run)
      dry_run="true"
      shift
      ;;
    --max-model-prompts)
      [[ $# -ge 2 ]] || { echo "--max-model-prompts requires a count" >&2; exit 2; }
      max_model_prompts="$2"
      shift 2
      ;;
    --max-acpx-commands)
      [[ $# -ge 2 ]] || { echo "--max-acpx-commands requires a count" >&2; exit 2; }
      max_acpx_commands="$2"
      shift 2
      ;;
    --max-retries)
      [[ $# -ge 2 ]] || { echo "--max-retries requires a count" >&2; exit 2; }
      max_retries="$2"
      shift 2
      ;;
    --max-observed-tokens)
      [[ $# -ge 2 ]] || { echo "--max-observed-tokens requires a count" >&2; exit 2; }
      max_observed_tokens="$2"
      shift 2
      ;;
    --help|-h)
      cat <<'USAGE'
Usage: tests/test-utils/skill-pressure/run-skill-pressure-tests.sh [--fast|--diagnostic|--standard|--high-risk|--scenario ID] [--timeout SECONDS] [--jobs N|--serial] [--dry-run] --max-model-prompts N --max-acpx-commands N --max-retries N --max-observed-tokens N

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
[[ "$max_model_prompts" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid or missing --max-model-prompts value" >&2; exit 2; }
[[ "$max_acpx_commands" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid or missing --max-acpx-commands value" >&2; exit 2; }
[[ "$max_retries" =~ ^[0-9]+$ ]] || { echo "Invalid or missing --max-retries value" >&2; exit 2; }
[[ "$max_observed_tokens" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid or missing --max-observed-tokens value" >&2; exit 2; }

export SKILL_PRESSURE_FAST="0"
export SKILL_PRESSURE_TIMEOUT_SECONDS="$timeout_seconds"
export SKILL_PRESSURE_JOBS="$jobs"
export SKILL_PRESSURE_SERIAL="$serial"
export SKILL_PRESSURE_DRY_RUN="$dry_run"
export SKILL_PRESSURE_MAX_MODEL_PROMPTS="$max_model_prompts"
export SKILL_PRESSURE_MAX_ACPX_COMMANDS="$max_acpx_commands"
export SKILL_PRESSURE_MAX_RETRIES="$max_retries"
export SKILL_PRESSURE_MAX_OBSERVED_TOKENS="$max_observed_tokens"
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
