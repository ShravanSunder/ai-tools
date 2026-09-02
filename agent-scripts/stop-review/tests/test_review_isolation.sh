#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOOK="${ROOT}/stop-review-hook.sh"
RUNNER="${ROOT}/review-runner.sh"
TEMPLATE="${ROOT}/reviewer-config.toml"
PASS=0
FAIL=0

assert_file_contains() {
  local path="$1"
  local needle="$2"
  if grep -Fq -- "${needle}" "${path}"; then
    PASS=$((PASS + 1))
    return 0
  fi
  FAIL=$((FAIL + 1))
  printf 'FAIL: expected %s in %s\n' "${needle}" "${path}" >&2
}

assert_file_not_contains() {
  local path="$1"
  local needle="$2"
  if grep -Fq -- "${needle}" "${path}"; then
    FAIL=$((FAIL + 1))
    printf 'FAIL: did not expect %s in %s\n' "${needle}" "${path}" >&2
    return 0
  fi
  PASS=$((PASS + 1))
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

WORKDIR="$(mktemp -d /tmp/stop-review-isolation.XXXXXX)"
HOOK_STATE="${WORKDIR}/hook-state"
RUN_ID="$(basename "${WORKDIR}")"
export CODEX_STOP_REVIEW_STATE_ROOT="${HOOK_STATE}"
trap 'rm -rf "${WORKDIR}"' EXIT

REVIEWER_HOME="${WORKDIR}/codex-reviewer"
AUTH_FILE="${WORKDIR}/worker-auth.json"
printf '%s\n' '{"tokens":{"access_token":"test"}}' >"${AUTH_FILE}"
PROMPT_FILE="${WORKDIR}/prompt.txt"
OUT_FILE="${WORKDIR}/luna-last.txt"
printf '%s\n' "classify this" >"${PROMPT_FILE}"

PRINT_OUT="${WORKDIR}/print-argv.txt"
CODEX_STOP_REVIEW_HOME="${REVIEWER_HOME}" \
  CODEX_STOP_REVIEW_WORKER_AUTH="${AUTH_FILE}" \
  bash "${RUNNER}" \
  --prompt-file "${PROMPT_FILE}" \
  --output "${OUT_FILE}" \
  --cd "${WORKDIR}" \
  --print-argv >"${PRINT_OUT}"

assert_file_contains "${PRINT_OUT}" "CODEX_HOME=${REVIEWER_HOME}"
assert_file_contains "${PRINT_OUT}" "CODEX_REVIEWER=1"
assert_file_contains "${PRINT_OUT}" "ARGV=exec "
assert_file_not_contains "${PRINT_OUT}" "--remote"
assert_file_not_contains "${PRINT_OUT}" "app-server-control.sock"
assert_file_not_contains "${PRINT_OUT}" "--profile"
assert_file_not_contains "${PRINT_OUT}" "--ignore-user-config"
assert_file_contains "${PRINT_OUT}" "--sandbox"
assert_file_contains "${PRINT_OUT}" "read-only"
assert_file_contains "${REVIEWER_HOME}/config.toml" 'base_url = "http://127.0.0.1:8787/v1"'
assert_file_contains "${REVIEWER_HOME}/config.toml" "hooks = false"
assert_file_contains "${REVIEWER_HOME}/config.toml" "plugin_hooks = false"
assert_file_contains "${REVIEWER_HOME}/hooks.json" '{"hooks":{}}'
assert_eq "$(readlink "${REVIEWER_HOME}/auth.json")" "${AUTH_FILE}" "auth.json symlink"

FAKE_BIN="${WORKDIR}/fake-codex"
RECORD="${WORKDIR}/codex-record.txt"
cat >"${FAKE_BIN}" <<EOF
#!/usr/bin/env bash
{
  printf 'CODEX_HOME=%s\\n' "\${CODEX_HOME}"
  printf 'CODEX_REVIEWER=%s\\n' "\${CODEX_REVIEWER}"
  printf 'ARGV=%s\\n' "\$*"
} >"${RECORD}"
out_file=""
prev=""
for arg in "\$@"; do
  if [[ "\${prev}" == "-o" ]]; then
    out_file="\${arg}"
  fi
  prev="\${arg}"
done
if [[ -n "\${out_file}" ]]; then
  printf '%s\\n' '{"cot":"none left","decision":"stop_ok","reason":"done"}' >"\${out_file}"
fi
exit 0
EOF
chmod +x "${FAKE_BIN}"

RUN_HOME="${WORKDIR}/codex-reviewer-run"
CODEX_STOP_REVIEW_HOME="${RUN_HOME}" \
  CODEX_STOP_REVIEW_WORKER_AUTH="${AUTH_FILE}" \
  CODEX_STOP_REVIEW_CODEX_BIN="${FAKE_BIN}" \
  bash "${RUNNER}" \
  --prompt-file "${PROMPT_FILE}" \
  --output "${OUT_FILE}" \
  --cd "${WORKDIR}"

assert_file_contains "${RECORD}" "CODEX_HOME=${RUN_HOME}"
assert_file_contains "${RECORD}" "CODEX_REVIEWER=1"
assert_file_not_contains "${RECORD}" "--remote"
assert_file_contains "${OUT_FILE}" '"decision":"stop_ok"'

HOOK_OUT="${WORKDIR}/hook-out.json"
printf '%s\n' '{"session_id":"'"${RUN_ID}"'-s1","turn_id":"t1","stop_hook_active":true,"last_assistant_message":"hi","cwd":"'"${WORKDIR}"'"}' \
  | bash "${HOOK}" >"${HOOK_OUT}" || true
assert_file_contains "${HOOK_OUT}" "{}"

printf '%s\n' '{"session_id":"'"${RUN_ID}"'-s2","turn_id":"t2","stop_hook_active":false,"last_assistant_message":"hi","cwd":"'"${WORKDIR}"'"}' \
  | CODEX_REVIEWER=1 \
    bash "${HOOK}" >"${HOOK_OUT}" || true
assert_file_contains "${HOOK_OUT}" "{}"

FAKE_RUNNER="${WORKDIR}/fake-runner.sh"
cat >"${FAKE_RUNNER}" <<'EOF'
#!/usr/bin/env bash
out=""
prev=""
for arg in "$@"; do
  if [[ "${prev}" == "--output" ]]; then
    out="${arg}"
  fi
  prev="${arg}"
done
printf '%s\n' '{"cot":"job remains","decision":"continue_work","reason":"keep going"}' >"${out}"
exit 0
EOF
chmod +x "${FAKE_RUNNER}"

TRANSCRIPT="${WORKDIR}/transcript.jsonl"
python3 - <<PY
import json
from pathlib import Path
path = Path("${TRANSCRIPT}")
records = [
    {
        "type": "response_item",
        "payload": {
            "type": "message",
            "role": "user",
            "content": [{"type": "input_text", "text": "please finish the task"}],
        },
    },
    {
        "type": "response_item",
        "payload": {
            "type": "message",
            "role": "assistant",
            "content": [{"type": "output_text", "text": "I will keep working"}],
        },
    },
]
path.write_text("\n".join(json.dumps(record) for record in records) + "\n")
PY

printf '%s\n' '{"session_id":"'"${RUN_ID}"'-s3","turn_id":"t3","stop_hook_active":false,"last_assistant_message":"I will keep working","cwd":"'"${WORKDIR}"'","transcript_path":"'"${TRANSCRIPT}"'"}' \
  | CODEX_STOP_REVIEW_RUNNER="${FAKE_RUNNER}" \
    bash "${HOOK}" >"${HOOK_OUT}"
assert_file_contains "${HOOK_OUT}" '"decision": "block"'

if [[ "${FAIL}" -ne 0 ]]; then
  printf 'isolation tests: %s passed, %s failed\n' "${PASS}" "${FAIL}" >&2
  exit 1
fi
printf 'isolation tests: %s passed\n' "${PASS}"
exit 0
