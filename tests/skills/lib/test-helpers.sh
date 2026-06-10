#!/usr/bin/env bash
set -euo pipefail

repo_root() {
  git rev-parse --show-toplevel
}

skill_test_artifact_dir() {
  local scenario_id="$1"
  local root
  root="$(repo_root)"
  local stamp
  stamp="$(date -u +%Y%m%dT%H%M%SZ)"
  local dir="$root/tmp/skill-pressure-tests/$stamp-$scenario_id"
  mkdir -p "$dir"
  printf '%s\n' "$dir"
}

run_with_optional_timeout() {
  local timeout_seconds="$1"
  shift

  if command -v timeout >/dev/null 2>&1; then
    timeout "$timeout_seconds" "$@"
  elif command -v gtimeout >/dev/null 2>&1; then
    gtimeout "$timeout_seconds" "$@"
  elif command -v perl >/dev/null 2>&1; then
    perl -e 'alarm shift; exec @ARGV' "$timeout_seconds" "$@"
  else
    printf 'warning: timeout/gtimeout not found; running without timeout\n' >&2
    "$@"
  fi
}

run_codex_pressure_case() {
  local scenario_file="$1"
  local output_dir="$2"
  local timeout_seconds="${3:-900}"
  local root
  root="$(repo_root)"
  local prompt_file="$output_dir/prompt.md"
  local events_file="$output_dir/events.jsonl"
  local final_file="$output_dir/final.json"
  local model="${CODEX_PRESSURE_MODEL:-gpt-5.4}"
  local effort="${CODEX_PRESSURE_REASONING_EFFORT:-low}"

  {
    printf 'You are running a Codex skill pressure test.\n\n'
    printf 'Rules:\n'
    printf -- '- Stay read-only unless the scenario explicitly permits edits.\n'
    printf -- '- Return only JSON matching the supplied schema.\n'
    printf -- '- Do not claim a skill was invoked unless you actually used it.\n'
    printf -- '- Treat the scenario as a real operator prompt, not a quiz.\n\n'
    printf 'Final JSON rules:\n'
    printf -- '- Set artifact_expected from the scenario metadata.\n'
    printf -- '- In fast read-only pressure runs, set artifact_created false unless you actually created an artifact.\n'
    printf -- '- If a skill would normally write an artifact, explain that in decision/coverage_evidence while keeping artifact_created false.\n\n'
    printf 'Scenario:\n\n'
    cat "$scenario_file"
  } > "$prompt_file"

  run_with_optional_timeout "$timeout_seconds" codex exec \
    -C "$root" \
    -m "$model" \
    -c "model_reasoning_effort=\"$effort\"" \
    --sandbox read-only \
    --output-schema "$root/tests/skills/schemas/skill-pressure-result.schema.json" \
    --output-last-message "$final_file" \
    --json \
    - < "$prompt_file" > "$events_file"

  printf '%s\n' "$final_file"
}

metadata_value() {
  local file="$1"
  local key="$2"
  awk -F ': ' -v key="$key" '$1 == key { print substr($0, length(key) + 3); exit }' "$file"
}

assert_json_contains() {
  local file="$1"
  local pattern="$2"
  local name="$3"
  if grep -qE "$pattern" "$file"; then
    printf '  [PASS] %s\n' "$name"
  else
    printf '  [FAIL] %s\n' "$name"
    printf '  Expected pattern: %s\n' "$pattern"
    printf '  File: %s\n' "$file"
    sed 's/^/    /' "$file"
    return 1
  fi
}

run_pressure_scenario_file() {
  local scenario_file="$1"
  local timeout_seconds="${2:-900}"
  local scenario_id
  local skill_under_test
  local expect_read_only
  local expect_artifact
  local expect_decision_regex

  scenario_id="$(metadata_value "$scenario_file" "scenario_id")"
  skill_under_test="$(metadata_value "$scenario_file" "skill_under_test")"
  expect_read_only="$(metadata_value "$scenario_file" "expect_read_only")"
  expect_artifact="$(metadata_value "$scenario_file" "expect_artifact")"
  expect_decision_regex="$(metadata_value "$scenario_file" "expect_decision_regex")"

  if [[ -z "$scenario_id" || -z "$skill_under_test" ]]; then
    echo "  [FAIL] Scenario missing scenario_id or skill_under_test: $scenario_file"
    return 1
  fi

  [[ -n "$expect_read_only" ]] || expect_read_only="true"
  [[ -n "$expect_artifact" ]] || expect_artifact="false"
  [[ -n "$expect_decision_regex" ]] || expect_decision_regex="."

  local artifact_dir
  local final_file
  artifact_dir="$(skill_test_artifact_dir "$scenario_id")"
  final_file="$(run_codex_pressure_case "$scenario_file" "$artifact_dir" "$timeout_seconds")"

  local failed=0

  assert_json_contains "$final_file" "\"scenario_id\"[[:space:]]*:[[:space:]]*\"$scenario_id\"" "scenario id" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"skill_under_test\"[[:space:]]*:[[:space:]]*\"$skill_under_test\"" "skill named" || failed=$((failed + 1))
  assert_json_contains "$final_file" '"skill_invoked"[[:space:]]*:[[:space:]]*true' "skill invoked" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"read_only\"[[:space:]]*:[[:space:]]*$expect_read_only" "read-only expectation" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"artifact_expected\"[[:space:]]*:[[:space:]]*$expect_artifact" "artifact expectation" || failed=$((failed + 1))
  assert_json_contains "$final_file" '"shortcut_resisted"[[:space:]]*:[[:space:]]*true' "resisted shortcut" || failed=$((failed + 1))
  assert_json_contains "$final_file" "$expect_decision_regex" "decision shape" || failed=$((failed + 1))

  if [[ "$failed" -gt 0 ]]; then
    return 1
  fi
}
