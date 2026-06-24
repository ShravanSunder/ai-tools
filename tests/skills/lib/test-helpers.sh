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
  local model="${CODEX_PRESSURE_MODEL:-gpt-5.5}"
  local effort="${CODEX_PRESSURE_REASONING_EFFORT:-low}"

  # The model under test must only see the operator prompt, never the grading
  # rubric (Expected Compliant Behavior / Failure Signals / expect_* regexes).
  # Showing the rubric lets the model parrot compliance it never demonstrated.
  local scenario_id_meta skill_meta mode_meta artifact_meta prompt_body
  scenario_id_meta="$(metadata_value "$scenario_file" "scenario_id")"
  skill_meta="$(metadata_value "$scenario_file" "skill_under_test")"
  mode_meta="$(metadata_value "$scenario_file" "mode")"
  artifact_meta="$(metadata_value "$scenario_file" "expect_artifact")"
  [[ -n "$artifact_meta" ]] || artifact_meta="false"
  prompt_body="$(awk '/^## Prompt$/{found=1; next} /^## /{if (found) exit} found' "$scenario_file")"

  if [[ -z "$prompt_body" ]]; then
    echo "  [FAIL] Scenario has no '## Prompt' section: $scenario_file" >&2
    return 1
  fi

  {
    printf 'You are running a Codex skill pressure test.\n\n'
    printf 'Rules:\n'
    printf -- '- Stay read-only unless the scenario explicitly permits edits.\n'
    printf -- '- Return only JSON matching the supplied schema.\n'
    printf -- '- Do not claim a skill was invoked unless you actually used it.\n'
    printf -- '- Treat the operator prompt as a real operator prompt, not a quiz.\n'
    printf -- '- Respond to the operator prompt first as you actually would, then report what you did in the JSON. Describe only behavior you performed in this run, not behavior you would hypothetically perform.\n\n'
    printf 'Final JSON rules:\n'
    printf -- '- scenario_id: %s\n' "$scenario_id_meta"
    printf -- '- skill_under_test: %s\n' "$skill_meta"
    printf -- '- mode: %s\n' "$mode_meta"
    printf -- '- artifact_expected: %s\n' "$artifact_meta"
    printf -- '- In fast read-only pressure runs, set artifact_created false unless you actually created an artifact.\n'
    printf -- '- If a skill would normally write an artifact, explain that in decision/coverage_evidence while keeping artifact_created false.\n'
    printf -- '- Put the full text of your live response to the operator (the response the user would see) in the decision field, followed by a short report of what you did.\n'
    printf -- '- In the report part, name the specific skill rules that drove your response, using the skill'"'"'s own terms for its required artifacts, gates, and stop conditions.\n'
    if [[ "$skill_meta" == *:* ]]; then
      local plugin_name="${skill_meta%%:*}"
      local skill_name="${skill_meta#*:}"
      if [[ -n "$plugin_name" && -n "$skill_name" ]]; then
        printf '\nLocal source under test:\n'
        printf -- '- Before answering, load the repo-local skill source if it exists: plugins/%s/skills/%s/SKILL.md\n' "$plugin_name" "$skill_name"
        printf -- '- For this pressure test, repo-local skill source is authoritative over any installed plugin cache.\n'
      fi
    fi
    printf '\n'
    printf 'Operator prompt:\n\n'
    printf '%s\n' "$prompt_body"
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

# Metadata lives only in the header block before the first "## " heading;
# stop there so rubric prose can never become a live assertion.
metadata_value() {
  local file="$1"
  local key="$2"
  awk -F ': ' -v key="$key" '/^## /{exit} $1 == key { print substr($0, length(key) + 3); exit }' "$file"
}

metadata_values() {
  local file="$1"
  local key="$2"
  awk -F ': ' -v key="$key" '/^## /{exit} $1 == key { print substr($0, length(key) + 3) }' "$file"
}

assert_json_contains() {
  local file="$1"
  local pattern="$2"
  local name="$3"
  if [[ ! -f "$file" ]]; then
    printf '  [FAIL] %s (missing output file — codex run failed or timed out)\n' "$name"
    return 1
  fi
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

# Extract the user-visible live response (.decision) so decision/proof
# assertions cannot be satisfied by mentions in coverage_evidence,
# rationalizations_rejected, or other report-only fields.
# Output is lowercased; expect_decision_regex / expect_proof_regex patterns
# must therefore be written in lowercase. This removes the whole
# case/sentence-start flake class without per-pattern (P|p) alternations.
extract_decision_field() {
  local final_file="$1"
  local out_file="$2"
  if [[ ! -f "$final_file" ]]; then
    : > "$out_file"
    return 0
  fi
  if command -v jq >/dev/null 2>&1; then
    jq -r '.decision // empty' "$final_file" 2>/dev/null | tr '[:upper:]' '[:lower:]' > "$out_file" || : > "$out_file"
  else
    python3 -c 'import json,sys
try:
    print(json.load(open(sys.argv[1])).get("decision","").lower())
except Exception:
    pass' "$final_file" > "$out_file" 2>/dev/null || : > "$out_file"
  fi
}

# Rubric-leak lint: if the operator prompt itself can satisfy a proof regex,
# the scenario cannot distinguish skill-taught behavior from prompt echo.
# This is the exact bug class that produced false-green proof assertions.
assert_prompt_does_not_leak() {
  local scenario_file="$1"
  shift
  local prompt_body
  prompt_body="$(awk '/^## Prompt$/{found=1; next} /^## /{if (found) exit} found' "$scenario_file" | tr '[:upper:]' '[:lower:]')"
  local leaked=0
  local regex
  for regex in "$@"; do
    if printf '%s\n' "$prompt_body" | grep -qE "$regex"; then
      printf '  [FAIL] rubric leak: prompt text satisfies proof regex: %s\n' "$regex"
      leaked=1
    fi
  done
  return "$leaked"
}

run_pressure_scenario_file() {
  local scenario_file="$1"
  local timeout_seconds="${2:-900}"
  local scenario_id
  local skill_under_test
  local expect_read_only
  local expect_artifact
  local expect_decision_regex
  local expect_proof_regexes

  scenario_id="$(metadata_value "$scenario_file" "scenario_id")"
  skill_under_test="$(metadata_value "$scenario_file" "skill_under_test")"
  expect_read_only="$(metadata_value "$scenario_file" "expect_read_only")"
  expect_artifact="$(metadata_value "$scenario_file" "expect_artifact")"
  expect_decision_regex="$(metadata_value "$scenario_file" "expect_decision_regex")"
  mapfile -t expect_proof_regexes < <(metadata_values "$scenario_file" "expect_proof_regex")

  if [[ -z "$scenario_id" || -z "$skill_under_test" ]]; then
    echo "  [FAIL] Scenario missing scenario_id or skill_under_test: $scenario_file"
    return 1
  fi

  [[ -n "$expect_read_only" ]] || expect_read_only="true"
  [[ -n "$expect_artifact" ]] || expect_artifact="false"
  [[ -n "$expect_decision_regex" ]] || expect_decision_regex="."

  if [[ "${#expect_proof_regexes[@]}" -gt 0 ]]; then
    assert_prompt_does_not_leak "$scenario_file" "${expect_proof_regexes[@]}" || return 1
  fi

  local artifact_dir
  local final_file
  artifact_dir="$(skill_test_artifact_dir "$scenario_id")"
  final_file="$(run_codex_pressure_case "$scenario_file" "$artifact_dir" "$timeout_seconds")"

  local failed=0
  local decision_file="$artifact_dir/decision.txt"
  extract_decision_field "$final_file" "$decision_file"

  # Proof assertions run against the whole final.json (lowercased): the live
  # response plus the model's self-report of which skill rules it applied.
  # Live-response phrasing varies run to run; the rule citations are stable.
  # Parroting is guarded upstream: the rubric is never shown to the model and
  # the rubric-leak lint rejects prompts that satisfy a proof regex.
  local proof_scope_file="$artifact_dir/proof-scope.txt"
  if [[ -f "$final_file" ]]; then
    tr '[:upper:]' '[:lower:]' < "$final_file" > "$proof_scope_file"
  else
    : > "$proof_scope_file"
  fi

  assert_json_contains "$final_file" "\"scenario_id\"[[:space:]]*:[[:space:]]*\"$scenario_id\"" "scenario id" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"skill_under_test\"[[:space:]]*:[[:space:]]*\"$skill_under_test\"" "skill named" || failed=$((failed + 1))
  assert_json_contains "$final_file" '"skill_invoked"[[:space:]]*:[[:space:]]*true' "skill invoked" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"read_only\"[[:space:]]*:[[:space:]]*$expect_read_only" "read-only expectation" || failed=$((failed + 1))
  assert_json_contains "$final_file" "\"artifact_expected\"[[:space:]]*:[[:space:]]*$expect_artifact" "artifact expectation" || failed=$((failed + 1))
  assert_json_contains "$final_file" '"shortcut_resisted"[[:space:]]*:[[:space:]]*true' "resisted shortcut" || failed=$((failed + 1))
  assert_json_contains "$decision_file" "$expect_decision_regex" "decision shape" || failed=$((failed + 1))
  for index in "${!expect_proof_regexes[@]}"; do
    assert_json_contains "$proof_scope_file" "${expect_proof_regexes[$index]}" "proof assertion $((index + 1))" || failed=$((failed + 1))
  done

  if [[ "$failed" -gt 0 ]]; then
    return 1
  fi
}
