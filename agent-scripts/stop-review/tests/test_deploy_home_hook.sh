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
trap 'rm -rf "${WORKDIR}"' EXIT
DEST="${WORKDIR}/.agents/stop-review"

deployed="$(CODEX_STOP_REVIEW_DEPLOY_ROOT="${DEST}" bash "${DEPLOY}")"
assert_eq "${deployed}" "${DEST}" "deploy destination"
assert_file "${DEST}/deploy-home-hook.sh"
assert_file "${DEST}/stop-review-hook.sh"
assert_file "${DEST}/review-runner.sh"
assert_file "${DEST}/config.sh"
assert_file "${DEST}/extract_stop_review_window.py"
assert_file "${DEST}/classifier-prompt.md"
assert_file "${DEST}/output-schema.json"
assert_file "${DEST}/reviewer-config.toml"

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

if [[ "${FAIL}" -ne 0 ]]; then
  printf 'deploy tests: %s passed, %s failed\n' "${PASS}" "${FAIL}" >&2
  exit 1
fi
printf 'deploy tests: %s passed\n' "${PASS}"
exit 0
