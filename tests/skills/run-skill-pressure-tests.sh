#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/lib/test-helpers.sh"

mode="fast"
specific_scenario=""
timeout_seconds=900
jobs="${CODEX_PRESSURE_JOBS:-4}"
use_vitest="false"

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
    --vitest)
      use_vitest="true"
      shift
      ;;
    --timeout)
      timeout_seconds="$2"
      shift 2
      ;;
    --jobs)
      jobs="$2"
      shift 2
      ;;
    --serial)
      jobs="1"
      shift
      ;;
    --help|-h)
      cat <<'USAGE'
Usage: tests/skills/run-skill-pressure-tests.sh [--fast|--integration] [--scenario NAME] [--timeout SECONDS] [--jobs N|--serial] [--vitest]

Environment:
  CODEX_PRESSURE_MODEL              default: gpt-5.5
  CODEX_PRESSURE_REASONING_EFFORT   default: low
  CODEX_PRESSURE_JOBS               default: 4 for full-suite runs

Vitest mode:
  --vitest                         Run the opt-in vitest-evals runner.
  SKILL_PRESSURE_BACKEND=fake       Use fake backend for harness plumbing tests.
USAGE
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 2
      ;;
  esac
done

if [[ "$use_vitest" == "true" ]]; then
  export SKILL_PRESSURE_MODE="$mode"
  export SKILL_PRESSURE_TIMEOUT_SECONDS="$timeout_seconds"
  if [[ -n "$specific_scenario" ]]; then
    if [[ "$specific_scenario" == *.md ]]; then
      export SKILL_PRESSURE_SCENARIO="${specific_scenario%.md}"
    else
      export SKILL_PRESSURE_SCENARIO="$specific_scenario"
    fi
  fi

  exec pnpm --dir "$SCRIPT_DIR" exec vitest run evals/skill-pressure.eval.ts --config vitest.config.ts
fi

mapfile -t scenarios < <(find "$SCRIPT_DIR/pressure-scenarios" -maxdepth 1 -type f -name '*.md' ! -name 'README.md' | sort)

if [[ -n "$specific_scenario" ]]; then
  jobs="1"
  if [[ "$specific_scenario" == *.md ]]; then
    scenarios=("$SCRIPT_DIR/pressure-scenarios/$specific_scenario")
  else
    scenarios=("$SCRIPT_DIR/pressure-scenarios/$specific_scenario.md")
  fi
fi

passed=0
failed=0
run_log_dir="$(repo_root)/tmp/skill-pressure-tests/runner-$(date -u +%Y%m%dT%H%M%SZ)"

if ! [[ "$jobs" =~ ^[0-9]+$ ]] || [[ "$jobs" -lt 1 ]]; then
  echo "Invalid --jobs value: $jobs" >&2
  exit 2
fi

echo "Skill pressure tests"
echo "Mode: $mode"
echo "Model: ${CODEX_PRESSURE_MODEL:-gpt-5.5}"
echo "Reasoning effort: ${CODEX_PRESSURE_REASONING_EFFORT:-low}"
echo "Jobs: $jobs"
echo ""

run_one_scenario() {
  local scenario_file="$1"
  local status_file="$2"

  echo "Running $(basename "$scenario_file")"
  if [[ ! -f "$scenario_file" ]]; then
    echo "  [FAIL] Missing scenario: $scenario_file"
    echo "1" > "$status_file"
    return 0
  fi

  if SKILL_PRESSURE_MODE="$mode" run_pressure_scenario_file "$scenario_file" "$timeout_seconds"; then
    echo "0" > "$status_file"
  else
    echo "1" > "$status_file"
  fi
  echo ""
}

if [[ "$jobs" -eq 1 || "${#scenarios[@]}" -le 1 ]]; then
  for scenario_file in "${scenarios[@]}"; do
    status_file="$(mktemp "${TMPDIR:-/tmp}/skill-pressure-status.XXXXXX")"
    run_one_scenario "$scenario_file" "$status_file"
    if [[ "$(cat "$status_file")" == "0" ]]; then
      passed=$((passed + 1))
    else
      failed=$((failed + 1))
    fi
    rm -f "$status_file"
  done
else
  mkdir -p "$run_log_dir"
  pids=()
  log_files=()
  status_files=()

  for scenario_file in "${scenarios[@]}"; do
    while [[ "$(jobs -pr | wc -l | tr -d ' ')" -ge "$jobs" ]]; do
      sleep 0.2
    done

    scenario_name="$(basename "$scenario_file" .md)"
    log_file="$run_log_dir/$scenario_name.log"
    status_file="$run_log_dir/$scenario_name.status"
    run_one_scenario "$scenario_file" "$status_file" > "$log_file" 2>&1 &
    pids+=("$!")
    log_files+=("$log_file")
    status_files+=("$status_file")
  done

  for pid in "${pids[@]}"; do
    if wait "$pid"; then
      :
    else
      :
    fi
  done

  for index in "${!log_files[@]}"; do
    cat "${log_files[$index]}"
    if [[ -f "${status_files[$index]}" && "$(cat "${status_files[$index]}")" == "0" ]]; then
      passed=$((passed + 1))
    else
      failed=$((failed + 1))
    fi
  done
  echo "Runner logs: $run_log_dir"
  echo ""
fi

echo "Passed: $passed"
echo "Failed: $failed"

if [[ "$failed" -gt 0 ]]; then
  exit 1
fi
