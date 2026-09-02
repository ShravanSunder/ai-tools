#!/usr/bin/env bash

set -uo pipefail

# Run Luna in an isolated CODEX_HOME that has hooks disabled and talks to
# production codex-router on 127.0.0.1:8787. Never --remote, never --profile,
# never --ignore-user-config.

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=./config.sh
source "${HOOK_DIR}/config.sh"

PROMPT_FILE=""
OUT_FILE=""
WORK_CD=""
PRINT_ARGV="false"

usage() {
  printf '%s\n' "usage: review-runner.sh --prompt-file PATH --output PATH [--cd DIR] [--print-argv]" >&2
  exit 2
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --prompt-file)
      PROMPT_FILE="${2:-}"
      shift 2
      ;;
    --output)
      OUT_FILE="${2:-}"
      shift 2
      ;;
    --cd)
      WORK_CD="${2:-}"
      shift 2
      ;;
    --print-argv)
      PRINT_ARGV="true"
      shift
      ;;
    *)
      usage
      ;;
  esac
done

if [[ -z "${PROMPT_FILE}" || -z "${OUT_FILE}" ]]; then
  usage
fi

if [[ ! -f "${PROMPT_FILE}" ]]; then
  printf '%s\n' "review-runner: prompt file missing: ${PROMPT_FILE}" >&2
  exit 1
fi

REVIEWER_HOME="${CODEX_STOP_REVIEW_HOME:-${STOP_REVIEW_HOME_DEFAULT}}"
WORKER_AUTH="${CODEX_STOP_REVIEW_WORKER_AUTH:-${HOME}/.codex/auth.json}"
CONFIG_TEMPLATE="${HOOK_DIR}/reviewer-config.toml"
OUTPUT_SCHEMA_FILE="${HOOK_DIR}/output-schema.json"
CODEX_BIN="${CODEX_STOP_REVIEW_CODEX_BIN:-codex}"
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

if [[ -z "${WORK_CD}" ]]; then
  WORK_CD="$(pwd)"
fi

bootstrap_reviewer_home() {
  mkdir -p "${REVIEWER_HOME}"
  if [[ ! -f "${REVIEWER_HOME}/config.toml" ]]; then
    cp "${CONFIG_TEMPLATE}" "${REVIEWER_HOME}/config.toml"
  fi
  printf '%s\n' '{"hooks":{}}' >"${REVIEWER_HOME}/hooks.json"
  if [[ -e "${WORKER_AUTH}" && ! -e "${REVIEWER_HOME}/auth.json" ]]; then
    ln -s "${WORKER_AUTH}" "${REVIEWER_HOME}/auth.json"
  fi
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

build_exec_args() {
  EXEC_ARGS=(
    exec
    --ephemeral
    --skip-git-repo-check
    --sandbox
    read-only
    --cd
    "${WORK_CD}"
    -m
    "${STOP_REVIEW_MODEL}"
    -c
    "model_reasoning_effort=${STOP_REVIEW_REASONING_EFFORT}"
    -c
    "model_reasoning_summary=${STOP_REVIEW_REASONING_SUMMARY}"
  )
  if [[ -n "${STOP_REVIEW_SERVICE_TIER}" ]]; then
    EXEC_ARGS+=(--enable fast_mode -c "service_tier=${STOP_REVIEW_SERVICE_TIER}")
  fi
  EXEC_ARGS+=(--output-schema "${OUTPUT_SCHEMA_FILE}" -o "${OUT_FILE}" -)
}

bootstrap_reviewer_home
build_exec_args

if [[ "${PRINT_ARGV}" == "true" ]]; then
  printf 'CODEX_HOME=%s\n' "${REVIEWER_HOME}"
  printf 'CODEX_REVIEWER=%s\n' "1"
  printf 'CODEX_BIN=%s\n' "${CODEX_BIN}"
  printf 'ARGV=%s\n' "${EXEC_ARGS[*]}"
  exit 0
fi

export CODEX_HOME="${REVIEWER_HOME}"
export CODEX_REVIEWER=1
unset CODEX_API_KEY 2>/dev/null || true

if [[ "${CODEX_BIN}" == */* ]]; then
  if [[ ! -x "${CODEX_BIN}" ]]; then
    printf '%s\n' "review-runner: CODEX_STOP_REVIEW_CODEX_BIN is not executable" >&2
    exit 1
  fi
elif ! command -v "${CODEX_BIN}" >/dev/null 2>&1; then
  printf '%s\n' "review-runner: ${CODEX_BIN} not found" >&2
  exit 1
fi

if [[ ! -f "${OUTPUT_SCHEMA_FILE}" || ! -f "${CONFIG_TEMPLATE}" ]]; then
  printf '%s\n' "review-runner: missing schema or config template" >&2
  exit 1
fi

run_with_timeout "${CODEX_BIN}" "${EXEC_ARGS[@]}" <"${PROMPT_FILE}"
