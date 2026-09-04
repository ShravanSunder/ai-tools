#!/usr/bin/env bash
# E2E tests: file-scoped lint + format + platform payloads in fresh tmp git repos.
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK="${HOOK:-${HOOK_DIR}/../lint-changed.sh}"
PASS=0
FAIL=0

assert_eq() {
  local got="$1" want="$2" label="$3"
  if [[ "${got}" == "${want}" ]]; then
    PASS=$((PASS + 1))
    printf 'PASS: %s\n' "${label}"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  want: %s\n  got:  %s\n' "${label}" "${want}" "${got}"
  fi
}

assert_contains() {
  local hay="$1" needle="$2" label="$3"
  if [[ "${hay}" == *"${needle}"* ]]; then
    PASS=$((PASS + 1))
    printf 'PASS: %s\n' "${label}"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  need: %s\n  got:  %s\n' "${label}" "${needle}" "${hay}"
  fi
}

run_hook() {
  local platform="$1" repo="$2" payload="$3" extra_env="${4:-}"
  local repo_q hook_q
  repo_q="$(printf '%q' "${repo}")"
  hook_q="$(printf '%q' "${HOOK}")"
  env ${extra_env} HOOK_LINT_PLATFORM="${platform}" bash -lc \
    "cd ${repo_q} && printf '%s' '${payload}' | ${hook_q}"
}

setup_ox_repo() {
  local repo="$1"
  mkdir -p "${repo}"
  cd "${repo}" || return 1
  git init -q
  printf '%s\n' '{}' > oxlintrc.json
  printf '%s\n' '{}' > .oxfmtrc.json
  printf '%s\n' 'export const good = 1;' > good.ts
  printf '%s\n' 'export const alsoBad = ;' > also_bad.ts
  git add .
  git commit -q -m init
}

printf '=== E2E stop-lint-hook tests (lint + format) ===\n'

# 1) Unchanged committed lint error must NOT fail hook when only a clean file changes
REPO1="$(mktemp -d /tmp/stop-lint-e2e-clean.XXXXXX)"
setup_ox_repo "${REPO1}"
printf '%s\n' 'export const good = 2;' > good.ts
PAYLOAD="$(jq -nc --arg cwd "${REPO1}" '{cwd:$cwd,hook_event_name:"Stop"}')"
OUT="$(run_hook claude "${REPO1}" "${PAYLOAD}")"
assert_eq "${OUT}" '{}' "clean change to good.ts allows stop (also_bad.ts committed error ignored)"

# 2) Changed file with lint error blocks (all platforms)
REPO2="$(mktemp -d /tmp/stop-lint-e2e-block.XXXXXX)"
setup_ox_repo "${REPO2}"
printf '%s\n' 'export const bad = ;' > bad.ts
PAYLOAD2="$(jq -nc --arg cwd "${REPO2}" --arg root "${REPO2}" '{cwd:$cwd,hook_event_name:"stop",workspace_roots:[$root],status:"completed",loop_count:0}')"

OUT_CODEX="$(run_hook codex "${REPO2}" "$(jq -nc --arg cwd "${REPO2}" '{cwd:$cwd}')")"
assert_contains "${OUT_CODEX}" '"decision": "block"' "codex blocks on changed bad.ts"

OUT_GEMINI="$(run_hook gemini "${REPO2}" "$(jq -nc --arg cwd "${REPO2}" '{hook_event_name:"AfterAgent",cwd:$cwd}')")"
assert_contains "${OUT_GEMINI}" '"decision": "deny"' "gemini blocks on changed bad.ts"

OUT_CURSOR="$(run_hook cursor "${REPO2}" "${PAYLOAD2}")"
assert_contains "${OUT_CURSOR}" '"followup_message"' "cursor blocks on changed bad.ts"

# 3) DRY_RUN proves commands target only bad.ts
REPO3="${REPO2}"
OUT_DRY="$(run_hook cursor "${REPO3}" "${PAYLOAD2}" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_DRY}" "oxlint bad.ts" "lint command scopes to bad.ts only"
assert_contains "${OUT_DRY}" "oxfmt --check bad.ts" "format command scopes to bad.ts only"
assert_not_out="$(run_hook cursor "${REPO3}" "${PAYLOAD2}" "HOOK_LINT_DRY_RUN=1")"
if [[ "${assert_not_out}" != *"also_bad.ts"* && "${assert_not_out}" != *"good.ts"* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: dry run excludes also_bad.ts and good.ts\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: dry run included unrelated files\n%s\n' "${assert_not_out}"
fi

# 4) No git changes -> allow
REPO4="$(mktemp -d /tmp/stop-lint-e2e-nodiff.XXXXXX)"
setup_ox_repo "${REPO4}"
OUT_NONE="$(run_hook codex "${REPO4}" "$(jq -nc --arg cwd "${REPO4}" '{cwd:$cwd}')")"
assert_eq "${OUT_NONE}" '{}' "no working tree changes allows stop"

# 5) Log file written on real run
LOG="/tmp/$(basename "${REPO2}")-stop-lint.log"
rm -f "${LOG}"
run_hook codex "${REPO2}" "$(jq -nc --arg cwd "${REPO2}" '{cwd:$cwd}')" >/dev/null || true
if [[ -f "${LOG}" ]]; then
  PASS=$((PASS + 1)); printf 'PASS: stop-lint log file created at %s\n' "${LOG}"
else
  FAIL=$((FAIL + 1)); printf 'FAIL: expected log file %s\n' "${LOG}"
fi

# 6) Format-only failure blocks when lint passes
REPO6="$(mktemp -d /tmp/stop-lint-e2e-fmt.XXXXXX)"
setup_ox_repo "${REPO6}"
printf '%s\n' 'export const fmtBad=1;' > fmt_bad.ts
OUT_FMT="$(run_hook codex "${REPO6}" "$(jq -nc --arg cwd "${REPO6}" '{cwd:$cwd}')")"
assert_contains "${OUT_FMT}" '"decision": "block"' "codex blocks on format-only failure in changed file"

printf '\n=== E2E %d passed, %d failed ===\n' "${PASS}" "${FAIL}"
[[ "${FAIL}" -eq 0 ]]
