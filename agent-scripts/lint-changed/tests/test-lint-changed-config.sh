#!/usr/bin/env bash
# Path-1 (post-tool-hook.json) + config-gating negative tests.
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK="${HOOK:-${HOOK_DIR}/../lint-changed.sh}"
PASS=0
FAIL=0

mk_repo() {
  mktemp -d /tmp/stop-lint-config.XXXXXX
}

init_git() {
  git init -q && git add . && git commit -q -m init
}

payload() {
  local repo="$1"
  jq -nc --arg cwd "${repo}" '{cwd:$cwd}'
}

run_hook() {
  local repo="$1" payload="$2" extra_env="${3:-}"
  local repo_q hook_q
  repo_q="$(printf '%q' "${repo}")"
  hook_q="$(printf '%q' "${HOOK}")"
  env ${extra_env} HOOK_LINT_PLATFORM=codex bash -lc \
    "cd ${repo_q} && printf '%s' '${payload}' | ${hook_q}" 2>&1
}

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
    printf 'FAIL: %s\n  need: %s\n  got:\n%s\n' "${label}" "${needle}" "${hay}"
  fi
}

assert_not_contains() {
  local hay="$1" needle="$2" label="$3"
  if [[ "${hay}" != *"${needle}"* ]]; then
    PASS=$((PASS + 1))
    printf 'PASS: %s\n' "${label}"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  must not contain: %s\n  got:\n%s\n' "${label}" "${needle}" "${hay}"
  fi
}

write_hook_config() {
  local repo="$1"
  mkdir -p "${repo}/.agents"
  cat > "${repo}/.agents/post-tool-hook.json"
}

printf '=== CONFIG PATH + NEGATIVE GATING TESTS ===\n\n'

# --- Negative: changed py, no linter config anywhere → allow ---
REPO_NONE="$(mk_repo)"
cd "${REPO_NONE}"
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_NONE="$(run_hook "${REPO_NONE}" "$(payload "${REPO_NONE}")")"
assert_eq "${OUT_NONE}" '{}' "no config: changed .py allows stop without lint"
OUT_NONE_DRY="$(run_hook "${REPO_NONE}" "$(payload "${REPO_NONE}")" "HOOK_LINT_DRY_RUN=1")"
assert_not_contains "${OUT_NONE_DRY}" "DRY_RUN:" "no config: dry run queues no commands"

# --- Negative: pyproject exists but only .ts changed, no js/ts linter config → allow ---
REPO_PYONLY="$(mk_repo)"
cd "${REPO_PYONLY}"
printf '[tool.ruff]\n' > pyproject.toml
printf 'export const good = 1;\n' > good.ts
init_git
printf 'export const good = 2;\n' > good.ts
OUT_PYONLY="$(run_hook "${REPO_PYONLY}" "$(payload "${REPO_PYONLY}")")"
assert_eq "${OUT_PYONLY}" '{}' "ruff config present but only .ts changed: no lint (no oxlint config)"

# --- Negative: oxlintrc exists but only .py changed → allow (no ruff config) ---
REPO_TSONLY="$(mk_repo)"
cd "${REPO_TSONLY}"
printf '%s\n' '{}' > oxlintrc.json
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_TSONLY="$(run_hook "${REPO_TSONLY}" "$(payload "${REPO_TSONLY}")")"
assert_eq "${OUT_TSONLY}" '{}' "oxlint config present but only .py changed: no lint (no ruff config)"

# --- Config path: top-level commands with {files} ---
REPO_CFG="$(mk_repo)"
cd "${REPO_CFG}"
write_hook_config "${REPO_CFG}" <<'EOF'
{
  "commands": ["echo CONFIG_SCOPED {files}"]
}
EOF
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also.py
init_git
printf 'x = 2\n' > good.py
OUT_CFG="$(run_hook "${REPO_CFG}" "$(payload "${REPO_CFG}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_CFG}" "DRY_RUN: echo CONFIG_SCOPED good.py" "config commands: {files} scopes to changed good.py"
assert_not_contains "${OUT_CFG}" "also.py" "config commands: skips unedited also.py"

# --- Config path: commands_by_extension ---
REPO_EXT="$(mk_repo)"
cd "${REPO_EXT}"
write_hook_config "${REPO_EXT}" <<'EOF'
{
  "commands_by_extension": {
    "py": ["echo PY_EXT {files}"]
  }
}
EOF
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also.py
init_git
printf 'x = 2\n' > good.py
OUT_EXT="$(run_hook "${REPO_EXT}" "$(payload "${REPO_EXT}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_EXT}" "DRY_RUN: echo PY_EXT good.py" "commands_by_extension: scopes to changed .py"
assert_not_contains "${OUT_EXT}" "also.py" "commands_by_extension: skips unedited file"

# --- Config path: commands_by_language ---
REPO_LANG="$(mk_repo)"
cd "${REPO_LANG}"
write_hook_config "${REPO_LANG}" <<'EOF'
{
  "commands_by_language": {
    "python": ["echo PY_LANG {files}"]
  }
}
EOF
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also.py
init_git
printf 'x = 2\n' > good.py
OUT_LANG="$(run_hook "${REPO_LANG}" "$(payload "${REPO_LANG}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_LANG}" "DRY_RUN: echo PY_LANG good.py" "commands_by_language: scopes to changed python file"
assert_not_contains "${OUT_LANG}" "also.py" "commands_by_language: skips unedited file"

# --- Config path: trailing space-dot replaced with file list ---
REPO_DOT="$(mk_repo)"
cd "${REPO_DOT}"
write_hook_config "${REPO_DOT}" <<'EOF'
{
  "commands": ["echo TRAILING_DOT ."]
}
EOF
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also.py
init_git
printf 'x = 2\n' > good.py
OUT_DOT="$(run_hook "${REPO_DOT}" "$(payload "${REPO_DOT}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_DOT}" "DRY_RUN: echo TRAILING_DOT good.py" "trailing dot: replaced with changed file only"
assert_not_contains "${OUT_DOT}" "also.py" "trailing dot: skips unedited file"

# --- Config wins over fallback: pyproject + custom json → no ruff in dry output ---
REPO_OVERRIDE="$(mk_repo)"
cd "${REPO_OVERRIDE}"
printf '[tool.ruff]\n' > pyproject.toml
write_hook_config "${REPO_OVERRIDE}" <<'EOF'
{
  "commands": ["echo OVERRIDE {files}"]
}
EOF
printf 'x = 1\n' > good.py
init_git
printf 'x = \n' > bad.py
OUT_OVERRIDE="$(run_hook "${REPO_OVERRIDE}" "$(payload "${REPO_OVERRIDE}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_OVERRIDE}" "echo OVERRIDE bad.py" "config present: uses json command"
assert_not_contains "${OUT_OVERRIDE}" "ruff check" "config present: fallback ruff not used"

# --- Config real run: echo succeeds → allow ---
REPO_ECHO="$(mk_repo)"
cd "${REPO_ECHO}"
write_hook_config "${REPO_ECHO}" <<'EOF'
{
  "commands": ["echo ok {files}"]
}
EOF
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_ECHO="$(run_hook "${REPO_ECHO}" "$(payload "${REPO_ECHO}")")"
assert_eq "${OUT_ECHO}" '{}' "config echo command on changed file allows stop"

# --- Sanitize: "ruff check ." must not scan whole repo ---
REPO_RUFF_DOT="$(mk_repo)"
cd "${REPO_RUFF_DOT}"
printf '[tool.ruff]\n' > pyproject.toml
write_hook_config "${REPO_RUFF_DOT}" <<'EOF'
{
  "commands": ["ruff check ."]
}
EOF
printf 'x = 1\n' > good.py
printf 'x = \n' > committed_bad.py
init_git
printf 'x = 2\n' > good.py
OUT_RUFF_DOT="$(run_hook "${REPO_RUFF_DOT}" "$(payload "${REPO_RUFF_DOT}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_RUFF_DOT}" "DRY_RUN: ruff check good.py" "sanitize: ruff check . scopes to changed good.py only"
assert_not_contains "${OUT_RUFF_DOT}" "committed_bad.py" "sanitize: ruff check . ignores unedited committed_bad.py"
assert_not_contains "${OUT_RUFF_DOT}" "ruff check . good.py" "sanitize: strips bare dot before file list"

# --- Sanitize: "ruff check . --fix" mid-command dot stripped ---
REPO_RUFF_MID="$(mk_repo)"
cd "${REPO_RUFF_MID}"
printf '[tool.ruff]\n' > pyproject.toml
write_hook_config "${REPO_RUFF_MID}" <<'EOF'
{
  "commands": ["ruff check . --select E"]
}
EOF
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also.py
init_git
printf 'x=1\n' > bad_fmt.py
OUT_RUFF_MID="$(run_hook "${REPO_RUFF_MID}" "$(payload "${REPO_RUFF_MID}")" "HOOK_LINT_DRY_RUN=1")"
assert_contains "${OUT_RUFF_MID}" "ruff check --select E" "sanitize: removes mid-command tree dot"
assert_contains "${OUT_RUFF_MID}" "bad_fmt.py" "sanitize: mid-command dot still scopes to changed files"
assert_not_contains "${OUT_RUFF_MID}" "also.py" "sanitize: mid-command dot skips unedited files"

# --- Sanitize: real ruff with bad config does not block on committed errors ---
REPO_RUFF_REAL="$(mk_repo)"
cd "${REPO_RUFF_REAL}"
printf '[tool.ruff]\n' > pyproject.toml
write_hook_config "${REPO_RUFF_REAL}" <<'EOF'
{
  "commands": ["ruff check ."]
}
EOF
printf 'x = 1\n' > good.py
printf 'x = \n' > committed_bad.py
init_git
printf 'x = 2\n' > good.py
OUT_RUFF_REAL="$(run_hook "${REPO_RUFF_REAL}" "$(payload "${REPO_RUFF_REAL}")")"
assert_eq "${OUT_RUFF_REAL}" '{}' "sanitize: ruff check . allows when only clean file changed (committed error ignored)"

REPO_AGENT="$(mk_repo)"
cd "${REPO_AGENT}"
write_hook_config "${REPO_AGENT}" <<'EOF'
{
  "commands": ["codex exec --json 'lint'"]
}
EOF
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_AGENT="$(run_hook "${REPO_AGENT}" "$(payload "${REPO_AGENT}")")"
assert_eq "${OUT_AGENT}" '{}' "refuses nested agent CLI instead of executing it"

printf '\n=== %d passed, %d failed ===\n' "${PASS}" "${FAIL}"
[[ "${FAIL}" -eq 0 ]]
