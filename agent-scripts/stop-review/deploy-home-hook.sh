#!/usr/bin/env bash

set -euo pipefail

# Copy the sandbox-visible Stop-review runtime into ~/.agents/stop-review.
# Codex Stop hooks cannot read ~/dev/ai-tools; the chezmoi wrapper must exec
# this local copy via: bash "$HOME/.agents/stop-review/deploy-home-hook.sh" --run-hook
# Deploy copies files only. JEV deps come from PEP 723 metadata via
# `uv run --script` on first classify; deploy does not create a local venv.

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_ROOT="$(cd "${SOURCE_DIR}/.." && pwd)"
DEST_DIR="${CODEX_STOP_REVIEW_DEPLOY_ROOT:-${HOME}/.agents/stop-review}"
WRAPPER_LOG="/tmp/codex-stop-review-wrapper.log"
KEYRING_SECRETS_SRC="${SCRIPTS_ROOT}/keyring_secrets.py"

RUNTIME_FILES=(
  deploy-home-hook.sh
  stop-review-hook.sh
  review-runner.sh
  config.sh
  extract_stop_review_window.py
  jev_classifier.py
  jev_classifier.py.lock
  classifier-prompt.md
  output-schema.json
  reviewer-config.toml
)

log_wrapper() {
  printf '%s %s\n' "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$1" >>"${WRAPPER_LOG}"
}

run_local_hook() {
  local hook_script="${SOURCE_DIR}/stop-review-hook.sh"
  local public_wrapper="${HOME}/.agents/stop-review-hook.sh"

  # Must stay in the stop-review subfolder. Never exec the chezmoi wrapper
  # at ~/.agents/stop-review-hook.sh or this script would recurse.
  if [[ "$(basename "${SOURCE_DIR}")" != "stop-review" ]]; then
    log_wrapper "refusing --run-hook outside stop-review subfolder: ${SOURCE_DIR}"
    printf '%s\n' '{}'
    exit 0
  fi

  if [[ ! -f "${hook_script}" ]]; then
    log_wrapper "missing local stop-review-hook.sh at ${hook_script}; allowing stop"
    printf '%s\n' '{}'
    exit 0
  fi

  if [[ -e "${public_wrapper}" && "${hook_script}" -ef "${public_wrapper}" ]]; then
    log_wrapper "refusing recursive wrapper exec: ${hook_script}"
    printf '%s\n' '{}'
    exit 0
  fi

  if grep -Fq -- '--run-hook' "${hook_script}"; then
    log_wrapper "refusing recursive deploy wrapper at ${hook_script}"
    printf '%s\n' '{}'
    exit 0
  fi

  exec bash "${hook_script}"
}

provision_keyring() {
  local configured_ref machine_env
  # shellcheck source=./config.sh
  source "${SOURCE_DIR}/config.sh"
  configured_ref="${CODEX_STOP_REVIEW_OPENROUTER_OP_REF:-${STOP_REVIEW_OPENROUTER_OP_REF_DEFAULT:-}}"
  machine_env="${DEST_DIR}/machine.env"
  if [[ -z "${configured_ref}" && ! -f "${machine_env}" ]]; then
    return 0
  fi
  if ! command -v op >/dev/null 2>&1; then
    printf '%s\n' "deploy-home-hook: op not on PATH; cannot provision keyring" >&2
    exit 1
  fi
  if [[ -n "${configured_ref}" ]]; then
    python3 "${DEST_DIR}/keyring_secrets.py" --provision \
      --service "ai-tools.stop-review" \
      --username "openrouter" \
      --op-ref-env "CODEX_STOP_REVIEW_OPENROUTER_OP_REF" \
      --op-ref "${configured_ref}" \
      --machine-env "${machine_env}"
    return 0
  fi
  python3 "${DEST_DIR}/keyring_secrets.py" --provision \
    --service "ai-tools.stop-review" \
    --username "openrouter" \
    --op-ref-env "CODEX_STOP_REVIEW_OPENROUTER_OP_REF" \
    --machine-env "${machine_env}"
}

deploy_runtime() {
  local file

  if [[ ! -f "${KEYRING_SECRETS_SRC}" ]]; then
    printf '%s\n' "deploy-home-hook: missing ${KEYRING_SECRETS_SRC}" >&2
    exit 1
  fi
  for file in "${RUNTIME_FILES[@]}"; do
    if [[ ! -f "${SOURCE_DIR}/${file}" ]]; then
      printf '%s\n' "deploy-home-hook: missing source file: ${SOURCE_DIR}/${file}" >&2
      exit 1
    fi
  done

  mkdir -p "${DEST_DIR}"
  for file in "${RUNTIME_FILES[@]}"; do
    cp "${SOURCE_DIR}/${file}" "${DEST_DIR}/${file}"
  done
  cp "${KEYRING_SECRETS_SRC}" "${DEST_DIR}/keyring_secrets.py"
  rm -f "${DEST_DIR}/requirements.txt" "${DEST_DIR}/openrouter_key.py"
  chmod +x \
    "${DEST_DIR}/deploy-home-hook.sh" \
    "${DEST_DIR}/stop-review-hook.sh" \
    "${DEST_DIR}/review-runner.sh" \
    "${DEST_DIR}/keyring_secrets.py"

  provision_keyring

  printf '%s\n' "${DEST_DIR}"
}

case "${1:-}" in
  --run-hook)
    run_local_hook
    ;;
  "" | --deploy)
    deploy_runtime
    ;;
  *)
    printf '%s\n' "usage: deploy-home-hook.sh [--deploy|--run-hook]" >&2
    exit 2
    ;;
esac
