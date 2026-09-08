#!/usr/bin/env bash

set -uo pipefail

# Stop lint hook for Codex, Claude Code, Gemini CLI (agy), and Cursor.
# Runs lint + format checks on changed git files only (see hook-lint-common.sh).
# Never execs an agent CLI. Nested Stop / re-entry fails open.
#
# Platform output contracts:
#   codex/claude — {"decision":"block","reason":"..."} or {}
#   gemini       — {"decision":"deny","reason":"..."} or {}
#   cursor       — {"followup_message":"..."} or {}

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=hook-lint-common.sh
source "${HOOK_DIR}/hook-lint-common.sh"

HOOK_INPUT_JSON="$(cat || true)"

# Codex may pass JSON as argv when stdin is empty.
if [[ -z "${HOOK_INPUT_JSON}" && "$#" -gt 0 ]]; then
  for hook_arg in "$@"; do
    case "${hook_arg}" in
      \{*\}|\[*\])
        HOOK_INPUT_JSON="${hook_arg}"
        break
        ;;
    esac
  done
fi

LINT_HOOK_PLATFORM="$(detect_lint_hook_platform "${HOOK_INPUT_JSON}")"
PROJECT_ROOT="$(resolve_lint_hook_project_root "${HOOK_INPUT_JSON}")"
PROJECT_NAME="$(basename "${PROJECT_ROOT}")"
PROJECT_LOG="/tmp/${PROJECT_NAME}-stop-lint.log"
PROJECT_CONFIG_FILE="${PROJECT_ROOT}/.agents/post-tool-hook.json"

HOOK_COMMANDS=()
LINT_OUTPUT=""
LINT_FAILED=false
LINT_LOCK_DIR=""

log_message() {
  printf '%s\n' "$1" >>"${PROJECT_LOG}"
}

lint_hook_log_message() {
  log_message "$1"
}

release_lint_lock() {
  if [[ -n "${LINT_LOCK_DIR}" ]]; then
    rmdir "${LINT_LOCK_DIR}" 2>/dev/null || true
    LINT_LOCK_DIR=""
  fi
}

emit_allow() {
  release_lint_lock
  printf '%s\n' '{}'
  exit 0
}

emit_block() {
  local reason="$1"

  if ! command -v jq >/dev/null 2>&1; then
    release_lint_lock
    printf '%s' "${reason}" >&2
    exit 2
  fi

  case "${LINT_HOOK_PLATFORM}" in
    gemini)
      jq -n --arg r "${reason}" '{"decision":"deny","reason":$r}'
      ;;
    cursor)
      jq -n --arg r "${reason}" '{"followup_message":$r}'
      ;;
    codex|claude|*)
      jq -n --arg r "${reason}" '{"decision":"block","reason":$r}'
      ;;
  esac
  release_lint_lock
  exit 0
}

if [[ "${HOOK_LINT_ACTIVE:-}" == "1" || "${CODEX_REVIEWER:-}" == "1" ]]; then
  emit_allow
fi

if ! [[ -d "${PROJECT_ROOT}" ]]; then
  emit_allow
fi

stop_hook_active="$(lint_hook_lowercase "$(lint_hook_extract_json_field "${HOOK_INPUT_JSON}" '.stop_hook_active' || true)")"
if [[ "${stop_hook_active}" == "true" ]]; then
  log_message "Skipping: stop_hook_active=true (nested Stop)"
  emit_allow
fi

loop_count="$(lint_hook_extract_json_field "${HOOK_INPUT_JSON}" '.loop_count' || true)"
if [[ "${loop_count}" =~ ^[0-9]+$ ]] && (( loop_count >= 3 )); then
  log_message "Skipping: loop_count=${loop_count} safety cap"
  emit_allow
fi

if ! git -C "${PROJECT_ROOT}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  log_message "Skipping: ${PROJECT_ROOT} is not a git worktree"
  emit_allow
fi

collect_changed_files "${PROJECT_ROOT}"

if [[ ${#CHANGED_FILES[@]} -eq 0 ]]; then
  log_message "Skipping: no changed files (platform=${LINT_HOOK_PLATFORM})"
  emit_allow
fi

collect_changed_extensions
resolve_lint_hook_commands_from_config "${PROJECT_ROOT}"

if [[ ${#HOOK_COMMANDS[@]} -eq 0 ]]; then
  append_fallback_lint_commands "${PROJECT_ROOT}" "${EXTS[@]}"
fi

if [[ ${#HOOK_COMMANDS[@]} -eq 0 ]]; then
  log_message "No lint commands resolved for ${PROJECT_NAME}; allowing stop"
  emit_allow
fi

if [[ "${HOOK_LINT_DRY_RUN:-}" == "1" ]]; then
  log_message "DRY_RUN platform=${LINT_HOOK_PLATFORM} changed=${CHANGED_FILES[*]}"
  for cmd in "${HOOK_COMMANDS[@]}"; do
    log_message "DRY_RUN command: ${cmd}"
    printf 'DRY_RUN: %s\n' "${cmd}"
  done
  emit_allow
fi

LINT_LOCK_DIR="/tmp/${PROJECT_NAME}-lint-changed.lock"
if ! mkdir "${LINT_LOCK_DIR}" 2>/dev/null; then
  log_message "Skipping: another lint-changed instance is running"
  emit_allow
fi
trap release_lint_lock EXIT
export HOOK_LINT_ACTIVE=1

for cmd in "${HOOK_COMMANDS[@]}"; do
  case "${cmd}" in
    codex\ *|claude\ *|cursor\ *)
      log_message "Refusing agent CLI command: ${cmd}"
      continue
      ;;
  esac
  log_message "Running lint (${LINT_HOOK_PLATFORM}): ${cmd}"
  project_root_quoted="$(printf '%q' "${PROJECT_ROOT}")"
  cmd_output="$(HOOK_LINT_ACTIVE=1 bash -lc "cd ${project_root_quoted} && ${cmd}" 2>&1)" || {
    LINT_FAILED=true
    log_message "FAILED: ${cmd}"
    log_message "${cmd_output}"
    filtered_output="$(printf '%s\n' "${cmd_output}" | grep -E '(error:|warning:|ERROR|FAIL)' || true)"
    if [[ -n "${filtered_output}" ]]; then
      LINT_OUTPUT+="$ ${cmd}"$'\n'"${filtered_output}"$'\n\n'
    else
      LINT_OUTPUT+="$ ${cmd}"$'\n'"(failed with no parseable errors — see log: ${PROJECT_LOG})"$'\n\n'
    fi
  }
  if [[ $? -eq 0 && "${LINT_FAILED}" != "true" ]]; then
    log_message "PASSED: ${cmd}"
  fi
done

if [[ "${LINT_FAILED}" == "true" ]]; then
  emit_block "Lint/format errors found. Fix these before completing:"$'\n\n'"${LINT_OUTPUT}"
fi

emit_allow
