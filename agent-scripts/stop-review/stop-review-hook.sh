#!/usr/bin/env bash

set -uo pipefail

# - Builds a bounded window of the last 5 user turns (assistant streams bundled).
# - Asks gpt-5.6-luna on the existing app-server (user config already loaded).
# - Tracks per-turn block attempts so we can avoid infinite continuation loops.
# - Fails open on timeout, crash, or unreadable classifier output.

HOOK_INPUT_JSON="$(cat || true)"
HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./config.sh
source "${HOOK_DIR}/config.sh"
WINDOW_SCRIPT="${HOOK_DIR}/extract_stop_review_window.py"
APP_SERVER_SCRIPT="${HOOK_DIR}/run_stop_review_on_app_server.py"
CLASSIFIER_PROMPT_FILE="${HOOK_DIR}/classifier-prompt.md"
OUTPUT_SCHEMA_FILE="${HOOK_DIR}/output-schema.json"
LUNA_TIMEOUT_SECONDS="${CODEX_STOP_REVIEW_LUNA_TIMEOUT:-${STOP_REVIEW_LUNA_TIMEOUT_DEFAULT}}"
STOP_REVIEW_MODEL="${CODEX_STOP_REVIEW_MODEL:-${STOP_REVIEW_MODEL_DEFAULT}}"
STOP_REVIEW_REASONING_EFFORT="${CODEX_STOP_REVIEW_REASONING_EFFORT:-${STOP_REVIEW_REASONING_EFFORT_DEFAULT}}"
STOP_REVIEW_REASONING_SUMMARY="${CODEX_STOP_REVIEW_REASONING_SUMMARY:-${STOP_REVIEW_REASONING_SUMMARY_DEFAULT}}"
STOP_REVIEW_SERVICE_TIER="${CODEX_STOP_REVIEW_SERVICE_TIER:-${STOP_REVIEW_SERVICE_TIER_DEFAULT}}"
case "${STOP_REVIEW_SERVICE_TIER}" in
  default | off | "")
    STOP_REVIEW_SERVICE_TIER=""
    ;;
esac

extract_json_field() {
  local jq_expression="$1"

  if [[ -z "${HOOK_INPUT_JSON}" ]] || ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  printf '%s' "${HOOK_INPUT_JSON}" | jq -r "${jq_expression} // empty" 2>/dev/null
}

resolve_project_root() {
  local payload_cwd

  payload_cwd="$(extract_json_field '.cwd' || true)"
  if [[ -n "${payload_cwd}" && -d "${payload_cwd}" ]]; then
    printf '%s\n' "${payload_cwd}"
    return 0
  fi

  printf '%s\n' "${PWD}"
}

emit_allow() {
  local system_message="${1:-}"

  if [[ -n "${system_message}" ]] && command -v jq >/dev/null 2>&1; then
    jq -n --arg message "${system_message}" '{"systemMessage": $message}'
    exit 0
  fi

  printf '%s\n' '{}'
  exit 0
}

wrap_continue_reason() {
  local luna_reason="$1"

  printf '%s\n%s' \
    "From Stop-review classifier agent:" \
    "${luna_reason}"
}

emit_block() {
  local reason="$1"
  local system_message="${2:-}"

  if command -v jq >/dev/null 2>&1; then
    if [[ -n "${system_message}" ]]; then
      jq -n --arg reason "${reason}" --arg message "${system_message}" \
        '{"decision":"block","reason":$reason,"systemMessage":$message}'
    else
      jq -n --arg reason "${reason}" '{"decision":"block","reason":$reason}'
    fi
    exit 0
  fi

  printf '%s' "${reason}" >&2
  exit 2
}

log_message() {
  local message="$1"
  printf '%s %s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" "${message}" >>"${PROJECT_LOG}"
}

hash_message() {
  local message="$1"

  if command -v shasum >/dev/null 2>&1; then
    printf '%s' "${message}" | shasum -a 256 | awk '{print $1}'
    return 0
  fi

  printf '%s' "${message}" | cksum | awk '{print $1}'
}

load_state() {
  BLOCK_COUNT=0
  PREVIOUS_CLASSIFICATION=""
  PREVIOUS_MESSAGE_HASH=""

  if [[ ! -f "${STATE_FILE}" ]] || ! command -v jq >/dev/null 2>&1; then
    return 0
  fi

  BLOCK_COUNT="$(jq -r '.block_count // 0' "${STATE_FILE}" 2>/dev/null || echo "0")"
  PREVIOUS_CLASSIFICATION="$(jq -r '.last_classification // ""' "${STATE_FILE}" 2>/dev/null || echo "")"
  PREVIOUS_MESSAGE_HASH="$(jq -r '.last_message_hash // ""' "${STATE_FILE}" 2>/dev/null || echo "")"
}

save_state() {
  local block_count="$1"
  local classification="$2"
  local message_hash="$3"

  mkdir -p "$(dirname "${STATE_FILE}")"

  if command -v jq >/dev/null 2>&1; then
    jq -n \
      --argjson block_count "${block_count}" \
      --arg classification "${classification}" \
      --arg message_hash "${message_hash}" \
      '{
        block_count: $block_count,
        last_classification: $classification,
        last_message_hash: $message_hash
      }' >"${STATE_FILE}"
    return 0
  fi

  cat >"${STATE_FILE}" <<EOF
{"block_count":${block_count},"last_classification":"${classification}","last_message_hash":"${message_hash}"}
EOF
}

run_with_timeout() {
  if command -v timeout >/dev/null 2>&1; then
    timeout "${LUNA_TIMEOUT_SECONDS}" "$@"
    return $?
  fi
  if command -v gtimeout >/dev/null 2>&1; then
    gtimeout "${LUNA_TIMEOUT_SECONDS}" "$@"
    return $?
  fi
  perl -e 'alarm shift; exec @ARGV' "${LUNA_TIMEOUT_SECONDS}" "$@"
}

extract_decision_json() {
  local raw_text="$1"

  if [[ -z "${raw_text}" ]] || ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  if printf '%s' "${raw_text}" | jq -e 'type == "object" and (.decision | type == "string")' >/dev/null 2>&1; then
    printf '%s' "${raw_text}"
    return 0
  fi

  local fenced
  fenced="$(printf '%s' "${raw_text}" | sed -n '/```/,/```/p' | sed '1d;$d')"
  if [[ -n "${fenced}" ]] && printf '%s' "${fenced}" | jq -e 'type == "object" and (.decision | type == "string")' >/dev/null 2>&1; then
    printf '%s' "${fenced}"
    return 0
  fi

  return 1
}

PROJECT_ROOT="$(resolve_project_root)"
PROJECT_NAME="$(basename "${PROJECT_ROOT}")"
PROJECT_LOG="/tmp/${PROJECT_NAME}-codex-stop-review.log"
STATE_ROOT="/tmp/codex-stop-review"

session_id="$(extract_json_field '.session_id' || true)"
turn_id="$(extract_json_field '.turn_id' || true)"
stop_hook_active="$(extract_json_field '.stop_hook_active' || true)"
last_assistant_message="$(extract_json_field '.last_assistant_message' || true)"
transcript_path="$(extract_json_field '.transcript_path' || true)"

if [[ -z "${session_id}" ]]; then
  session_id="unknown-session"
fi

if [[ -z "${turn_id}" ]]; then
  turn_id="unknown-turn"
fi

if [[ -z "${stop_hook_active}" ]]; then
  stop_hook_active="false"
fi

STATE_FILE="${STATE_ROOT}/${session_id}/${turn_id}.json"
message_hash="$(hash_message "${last_assistant_message}")"
load_state

if [[ "${stop_hook_active}" == "true" ]]; then
  save_state "${BLOCK_COUNT}" "stop_hook_active" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} stop_hook_active=true classification=stop_hook_active block_count=${BLOCK_COUNT} outcome=allow"
  emit_allow
fi

if [[ "${BLOCK_COUNT}" -ge 3 ]]; then
  warning_message="Stop review hook hit the per-turn safety cap; allowing stop to avoid a continuation loop."
  save_state "${BLOCK_COUNT}" "safety_cap" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} stop_hook_active=${stop_hook_active} classification=safety_cap block_count=${BLOCK_COUNT} outcome=allow_safety_cap previous_classification=${PREVIOUS_CLASSIFICATION} previous_hash=${PREVIOUS_MESSAGE_HASH}"
  emit_allow "${warning_message}"
fi

if ! command -v python3 >/dev/null 2>&1 || ! command -v jq >/dev/null 2>&1; then
  save_state "${BLOCK_COUNT}" "missing_tools" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=missing_tools block_count=${BLOCK_COUNT} outcome=allow"
  emit_allow
fi

if [[ ! -f "${WINDOW_SCRIPT}" || ! -f "${APP_SERVER_SCRIPT}" || ! -f "${CLASSIFIER_PROMPT_FILE}" || ! -f "${OUTPUT_SCHEMA_FILE}" ]]; then
  save_state "${BLOCK_COUNT}" "missing_assets" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=missing_assets block_count=${BLOCK_COUNT} outcome=allow"
  emit_allow
fi

WINDOW_TEXT="$(
  CODEX_STOP_REVIEW_LAST_ASSISTANT="${last_assistant_message}" \
    python3 "${WINDOW_SCRIPT}" \
      --transcript "${transcript_path}" \
      2>/dev/null || true
)"

if [[ -z "${WINDOW_TEXT}" ]]; then
  save_state "${BLOCK_COUNT}" "empty_window" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=empty_window block_count=${BLOCK_COUNT} outcome=allow"
  emit_allow
fi

WORK_DIR="$(mktemp -d /tmp/codex-stop-review-luna.XXXXXX)"
PROMPT_FILE="${WORK_DIR}/prompt.txt"
OUT_FILE="${WORK_DIR}/luna-last.txt"
{
  cat "${CLASSIFIER_PROMPT_FILE}"
  printf '\n\nConversation window:\n\n'
  printf '%s\n' "${WINDOW_TEXT}"
} >"${PROMPT_FILE}"

APP_SERVER_SOCKET="${CODEX_HOME:-${HOME}/.codex}/app-server-control/app-server-control.sock"
APP_SERVER_ARGS=(
  --socket "${APP_SERVER_SOCKET}"
  --prompt-file "${PROMPT_FILE}"
  --output-schema "${OUTPUT_SCHEMA_FILE}"
  --output "${OUT_FILE}"
  --model "${STOP_REVIEW_MODEL}"
  --effort "${STOP_REVIEW_REASONING_EFFORT}"
  --summary "${STOP_REVIEW_REASONING_SUMMARY}"
  --cwd "${PROJECT_ROOT}"
)
if [[ -n "${STOP_REVIEW_SERVICE_TIER}" ]]; then
  APP_SERVER_ARGS+=(--service-tier "${STOP_REVIEW_SERVICE_TIER}")
fi

set +e
log_message "turn_id=${turn_id} session_id=${session_id} luna_start transport=app-server socket=${APP_SERVER_SOCKET} model=${STOP_REVIEW_MODEL} reasoning_effort=${STOP_REVIEW_REASONING_EFFORT} reasoning_summary=${STOP_REVIEW_REASONING_SUMMARY} service_tier=${STOP_REVIEW_SERVICE_TIER:-default} timeout_s=${LUNA_TIMEOUT_SECONDS}"
run_with_timeout python3 "${APP_SERVER_SCRIPT}" "${APP_SERVER_ARGS[@]}" >/dev/null 2>>"${PROJECT_LOG}"
LUNA_EXIT=$?
set +e

if [[ "${LUNA_EXIT}" -ne 0 ]]; then
  save_state "${BLOCK_COUNT}" "luna_error" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=luna_error exit=${LUNA_EXIT} block_count=${BLOCK_COUNT} outcome=allow"
  rm -rf "${WORK_DIR}"
  emit_allow
fi

RAW_OUTPUT=""
if [[ -f "${OUT_FILE}" ]]; then
  RAW_OUTPUT="$(cat "${OUT_FILE}" || true)"
fi
rm -rf "${WORK_DIR}"

DECISION_JSON="$(extract_decision_json "${RAW_OUTPUT}" || true)"
if [[ -z "${DECISION_JSON}" ]]; then
  save_state "${BLOCK_COUNT}" "unreadable_output" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=unreadable_output block_count=${BLOCK_COUNT} outcome=allow"
  emit_allow
fi

DECISION="$(printf '%s' "${DECISION_JSON}" | jq -r '.decision' | tr '[:upper:]' '[:lower:]')"
REASON="$(printf '%s' "${DECISION_JSON}" | jq -r '.reason // empty')"
COT="$(printf '%s' "${DECISION_JSON}" | jq -r '.cot // empty')"

case "${DECISION}" in
  continue_work | block)
    CONTINUE_WORK="true"
    ;;
  *)
    CONTINUE_WORK="false"
    ;;
esac

if [[ "${CONTINUE_WORK}" != "true" ]]; then
  save_state "${BLOCK_COUNT}" "luna_stop_ok" "${message_hash}"
  log_message "turn_id=${turn_id} session_id=${session_id} classification=luna_stop_ok decision=${DECISION} model=${STOP_REVIEW_MODEL} reasoning_effort=${STOP_REVIEW_REASONING_EFFORT} block_count=${BLOCK_COUNT} outcome=allow cot=${COT}"
  emit_allow
fi

if [[ -z "${REASON}" ]]; then
  REASON="Continue the outstanding job in its current mode. If that job is design/discussion, keep designing; do not start implementation."
fi

next_block_count=$((BLOCK_COUNT + 1))
save_state "${next_block_count}" "luna_continue_work" "${message_hash}"

if [[ "${next_block_count}" -ge 3 ]]; then
  warning_message="Stop review hook hit the per-turn safety cap after continue_work; allowing stop to avoid a continuation loop."
  log_message "turn_id=${turn_id} session_id=${session_id} classification=luna_continue_work block_count=${next_block_count} outcome=allow_safety_cap previous_classification=${PREVIOUS_CLASSIFICATION} previous_hash=${PREVIOUS_MESSAGE_HASH} cot=${COT}"
  emit_allow "${warning_message}"
fi

log_message "turn_id=${turn_id} session_id=${session_id} classification=luna_continue_work decision=${DECISION} model=${STOP_REVIEW_MODEL} reasoning_effort=${STOP_REVIEW_REASONING_EFFORT} block_count=${next_block_count} outcome=block previous_classification=${PREVIOUS_CLASSIFICATION} previous_hash=${PREVIOUS_MESSAGE_HASH} cot=${COT}"
emit_block \
  "$(wrap_continue_reason "${REASON}")" \
  "Stop-review classifier continued the conversation because the job is still unfinished."
