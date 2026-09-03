#!/usr/bin/env bash
# Integration tests for stop-lint-hook.sh (file-scoped lint + format + platform emit).
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
STOP_LINT_HOOK="${HOOK_DIR}/../lint-changed.sh"
COMMON_LIB="${HOOK_DIR}/../hook-lint-common.sh"

if [[ ! -x "${STOP_LINT_HOOK}" ]]; then
  chmod +x "${STOP_LINT_HOOK}" "${COMMON_LIB}" 2>/dev/null || true
fi

TEST_ROOT="$(mktemp -d /tmp/stop-lint-hook-test.XXXXXX)"
PASS=0
FAIL=0

cleanup() {
  rm -rf "${TEST_ROOT}"
}
trap cleanup EXIT

assert_contains() {
  local haystack="$1"
  local needle="$2"
  local label="$3"
  if [[ "${haystack}" == *"${needle}"* ]]; then
    PASS=$((PASS + 1))
    printf 'PASS: %s\n' "${label}"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  expected substring: %s\n  got: %s\n' "${label}" "${needle}" "${haystack}"
  fi
}

assert_not_contains() {
  local haystack="$1"
  local needle="$2"
  local label="$3"
  if [[ "${haystack}" != *"${needle}"* ]]; then
    PASS=$((PASS + 1))
    printf 'PASS: %s\n' "${label}"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  must not contain: %s\n  got: %s\n' "${label}" "${needle}" "${haystack}"
  fi
}

setup_ox_repo() {
  local repo="${TEST_ROOT}/ox-repo"
  mkdir -p "${repo}"
  cd "${repo}"
  git init -q
  printf '%s\n' '{}' > oxlintrc.json
  printf '%s\n' '{}' > .oxfmtrc.json
  printf '%s\n' 'export const good = 1;' > good.ts
  printf '%s\n' 'export const alsoGood = 1;' > also_good.ts
  git add .
  git commit -q -m init
  printf '%s\n' 'export const bad = ;' > bad.ts
}

run_dry_hook() {
  local platform="$1"
  local repo="$2"
  local payload="$3"
  local repo_q hook_q
  repo_q="$(printf '%q' "${repo}")"
  hook_q="$(printf '%q' "${STOP_LINT_HOOK}")"
  HOOK_LINT_DRY_RUN=1 HOOK_LINT_PLATFORM="${platform}" \
    bash -lc "cd ${repo_q} && printf '%s' '${payload}' | ${hook_q}"
}

printf '=== stop-lint-hook tests in %s ===\n' "${TEST_ROOT}"

setup_ox_repo
REPO="${TEST_ROOT}/ox-repo"
PAYLOAD_CURSOR="$(jq -nc --arg cwd "${REPO}" --arg root "${REPO}" '{hook_event_name:"stop",cwd:$cwd,workspace_roots:[$root],status:"completed",loop_count:0}')"

OUT_CURSOR="$(run_dry_hook cursor "${REPO}" "${PAYLOAD_CURSOR}")"
assert_contains "${OUT_CURSOR}" "DRY_RUN: oxlint bad.ts" "cursor scopes lint to changed bad.ts"
assert_contains "${OUT_CURSOR}" "DRY_RUN:" "cursor runs format check on changed bad.ts"
assert_not_contains "${OUT_CURSOR}" "also_good.ts" "cursor does not lint unchanged also_good.ts"
assert_not_contains "${OUT_CURSOR}" " good.ts" "cursor does not lint unchanged good.ts"

OUT_CODEX="$(run_dry_hook codex "${REPO}" "$(jq -nc --arg cwd "${REPO}" '{cwd:$cwd}')")"
assert_contains "${OUT_CODEX}" "bad.ts" "codex resolves changed file"

REPO_Q="$(printf '%q' "${REPO}")"
HOOK_Q="$(printf '%q' "${STOP_LINT_HOOK}")"
BLOCK_OUT="$(HOOK_LINT_PLATFORM=codex bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"cwd\":\"${REPO}\"}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${BLOCK_OUT}" '"decision": "block"' "codex blocks with decision block on lint failure"

DENY_OUT="$(HOOK_LINT_PLATFORM=gemini bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"hook_event_name\":\"AfterAgent\",\"cwd\":\"${REPO}\"}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${DENY_OUT}" '"decision": "deny"' "gemini blocks with decision deny on lint failure"

FOLLOW_OUT="$(HOOK_LINT_PLATFORM=cursor bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '${PAYLOAD_CURSOR}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${FOLLOW_OUT}" '"followup_message"' "cursor blocks with followup_message on lint failure"

ALLOW_OUT="$(HOOK_LINT_PLATFORM=cursor bash -lc "cd ${REPO_Q} && printf '%s\n' 'export const bad = 1;' > bad.ts && printf '%s' '${PAYLOAD_CURSOR}' | HOOK_LINT_DRY_RUN=1 ${HOOK_Q}")"
assert_contains "${ALLOW_OUT}" "DRY_RUN:" "clean changed file still runs lint command"

NESTED_OUT="$(HOOK_LINT_PLATFORM=codex bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"cwd\":\"${REPO}\",\"stop_hook_active\":true}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${NESTED_OUT}" '{}' "stop_hook_active=true fails open without blocking"
assert_not_contains "${NESTED_OUT}" '"decision"' "stop_hook_active=true does not emit a block decision"

REENTRY_OUT="$(HOOK_LINT_ACTIVE=1 HOOK_LINT_PLATFORM=codex bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"cwd\":\"${REPO}\"}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${REENTRY_OUT}" '{}' "HOOK_LINT_ACTIVE=1 fails open on re-entry"
assert_not_contains "${REENTRY_OUT}" '"decision"' "HOOK_LINT_ACTIVE=1 does not emit a block decision"

REVIEWER_OUT="$(CODEX_REVIEWER=1 HOOK_LINT_PLATFORM=codex bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"cwd\":\"${REPO}\"}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${REVIEWER_OUT}" '{}' "CODEX_REVIEWER=1 fails open inside isolated reviewer"

LOOP_OUT="$(HOOK_LINT_PLATFORM=cursor bash -lc "cd ${REPO_Q} && printf '%s' 'export const bad = ;' > bad.ts && printf '%s' '{\"cwd\":\"${REPO}\",\"hook_event_name\":\"stop\",\"loop_count\":3}' | ${HOOK_Q}" 2>/dev/null || true)"
assert_contains "${LOOP_OUT}" '{}' "loop_count>=3 fails open instead of followup"
assert_not_contains "${LOOP_OUT}" 'followup_message' "loop_count>=3 does not emit followup_message"

printf '\n=== %d passed, %d failed ===\n' "${PASS}" "${FAIL}"
if [[ "${FAIL}" -gt 0 ]]; then
  exit 1
fi
