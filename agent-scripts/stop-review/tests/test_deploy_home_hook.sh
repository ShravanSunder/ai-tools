#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY="${ROOT}/deploy-home-hook.sh"
PASS=0
FAIL=0

assert_file() {
  local path="$1"
  if [[ -f "${path}" ]]; then
    PASS=$((PASS + 1))
    return 0
  fi
  FAIL=$((FAIL + 1))
  printf 'FAIL: missing %s\n' "${path}" >&2
}

assert_eq() {
  local got="$1"
  local want="$2"
  local label="$3"
  if [[ "${got}" == "${want}" ]]; then
    PASS=$((PASS + 1))
    return 0
  fi
  FAIL=$((FAIL + 1))
  printf 'FAIL: %s: got %s want %s\n' "${label}" "${got}" "${want}" >&2
}

WORKDIR="$(mktemp -d /tmp/stop-review-deploy.XXXXXX)"
trap 'rm -rf "${WORKDIR}" 2>/dev/null || true' EXIT
DEST="${WORKDIR}/.agents/stop-review"
export HOME="${WORKDIR}"
export CODEX_STOP_REVIEW_HOME="${WORKDIR}/.codex-reviewer"
export CODEX_STOP_REVIEW_STATE_ROOT="${WORKDIR}/state"
STUB_RUNNER="${WORKDIR}/stub-review-runner.sh"
cat >"${STUB_RUNNER}" <<'EOF'
#!/usr/bin/env bash
set -euo pipefail
OUT=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --output)
      OUT="${2:-}"
      shift 2
      ;;
    *)
      shift
      ;;
  esac
done
if [[ -z "${OUT}" ]]; then
  exit 2
fi
printf '%s\n' '{"decision":"stop_ok","reason":"stub"}' >"${OUT}"
EOF
chmod +x "${STUB_RUNNER}"
export CODEX_STOP_REVIEW_RUNNER="${STUB_RUNNER}"

mkdir -p "${DEST}"
printf '%s\n' "typesafe-sdk" >"${DEST}/requirements.txt"
printf '%s\n' "# leftover" >"${DEST}/openrouter_key.py"

deployed="$(CODEX_STOP_REVIEW_DEPLOY_ROOT="${DEST}" bash "${DEPLOY}")"
assert_eq "${deployed}" "${DEST}" "deploy destination"
assert_file "${DEST}/deploy-home-hook.sh"
assert_file "${DEST}/stop-review-hook.sh"
assert_file "${DEST}/review-runner.sh"
assert_file "${DEST}/config.sh"
assert_file "${DEST}/extract_stop_review_window.py"
assert_file "${DEST}/jev_classifier.py"
assert_file "${DEST}/jev_classifier.py.lock"
assert_file "${DEST}/keyring_secrets.py"
assert_file "${DEST}/classifier-prompt.md"
assert_file "${DEST}/output-schema.json"
assert_file "${DEST}/reviewer-config.toml"

if [[ -e "${DEST}/requirements.txt" || -e "${DEST}/openrouter_key.py" || -d "${DEST}/.venv" ]]; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deploy must remove leftover pip files and not create a venv\n' >&2
else
  PASS=$((PASS + 1))
fi

if grep -Eq 'pip install|uv pip|uv sync|python3 -m venv' "${DEST}/deploy-home-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deploy-home-hook.sh must not install packages into the home copy\n' >&2
else
  PASS=$((PASS + 1))
fi

if ! grep -Fq 'uv run --no-project --script' "${DEST}/stop-review-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed hook must run JEV via uv run --script\n' >&2
else
  PASS=$((PASS + 1))
fi

if ! grep -Fq '# /// script' "${DEST}/jev_classifier.py"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed jev_classifier.py must declare PEP 723 script deps\n' >&2
else
  PASS=$((PASS + 1))
fi

if grep -Eq 'AI_TOOLS_ROOT|HOME}/dev/ai-tools/agent-scripts' "${DEST}/deploy-home-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed deploy-home-hook.sh still execs the ai-tools repo tree\n' >&2
else
  PASS=$((PASS + 1))
fi

HOOK_OUT="${WORKDIR}/hook-out.json"
printf '%s\n' '{}' | bash "${DEST}/deploy-home-hook.sh" --run-hook >"${HOOK_OUT}"
assert_eq "$(cat "${HOOK_OUT}")" "{}" "run-hook fail-open on empty payload"

PARENT_DEPLOY="${WORKDIR}/.agents/deploy-home-hook.sh"
cp "${DEST}/deploy-home-hook.sh" "${PARENT_DEPLOY}"
chmod +x "${PARENT_DEPLOY}"
printf '%s\n' '{}' | bash "${PARENT_DEPLOY}" --run-hook >"${HOOK_OUT}"
assert_eq "$(cat "${HOOK_OUT}")" "{}" "run-hook refuses parent folder"

WRAPPER="${WORKDIR}/.agents/stop-review-hook.sh"
cat >"${WRAPPER}" <<'EOF'
#!/usr/bin/env bash
exec bash "${HOME}/.agents/stop-review/deploy-home-hook.sh" --run-hook
EOF
chmod +x "${WRAPPER}"
printf '%s\n' '{}' | HOME="${WORKDIR}" bash "${DEST}/deploy-home-hook.sh" --run-hook >"${HOOK_OUT}"
assert_eq "$(cat "${HOOK_OUT}")" "{}" "run-hook still uses subfolder classifier"

if grep -Fq -- '--run-hook' "${DEST}/stop-review-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed classifier must not call deploy --run-hook\n' >&2
else
  PASS=$((PASS + 1))
fi

if ! grep -Fq 'STOP_REVIEW_BACKEND_DEFAULT="jev"' "${DEST}/config.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed config must default the classifier to jev\n' >&2
else
  PASS=$((PASS + 1))
fi

if ! grep -Fq 'jev_fallback' "${DEST}/stop-review-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: deployed hook must fall back to Luna when JEV fails\n' >&2
else
  PASS=$((PASS + 1))
fi

if grep -Eq 'op read|keyring|--provision' "${DEST}/stop-review-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: stop-review-hook.sh must not provision or call op\n' >&2
else
  PASS=$((PASS + 1))
fi

if awk '
  $0 ~ /^run_local_hook\(\)/ {in_hook=1}
  in_hook && $0 ~ /^}/ {in_hook=0}
  in_hook && /provision_keyring|op read/ {found=1}
  END {exit found ? 0 : 1}
' "${DEST}/deploy-home-hook.sh"; then
  FAIL=$((FAIL + 1))
  printf 'FAIL: --run-hook path must not call provision_keyring\n' >&2
else
  PASS=$((PASS + 1))
fi

if [[ "${FAIL}" -ne 0 ]]; then
  printf 'deploy tests: %s passed, %s failed\n' "${PASS}" "${FAIL}" >&2
  exit 1
fi
printf 'deploy tests: %s passed\n' "${PASS}"
exit 0
