#!/usr/bin/env bash
# Call stop-lint-hook.sh in a fresh tmp git repo per language fallback (lint + format).
set -uo pipefail

HOOK_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HOOK="${HOOK:-${HOOK_DIR}/../lint-changed.sh}"
PASS=0
FAIL=0

run_dry() {
  local repo="$1" payload="$2"
  local repo_q hook_q
  repo_q="$(printf '%q' "${repo}")"
  hook_q="$(printf '%q' "${HOOK}")"
  HOOK_LINT_DRY_RUN=1 HOOK_LINT_PLATFORM=codex bash -lc \
    "cd ${repo_q} && printf '%s' '${payload}' | ${hook_q}" 2>&1
}

assert_cmd() {
  local out="$1" want="$2" label="$3" not_want="${4:-}"
  if [[ "${out}" == *"${want}"* ]]; then
    if [[ -n "${not_want}" && "${out}" == *"${not_want}"* ]]; then
      FAIL=$((FAIL + 1))
      printf 'FAIL: %s (must not contain %s)\n%s\n' "${label}" "${not_want}" "${out}"
      return
    fi
    PASS=$((PASS + 1))
    printf 'PASS: %s\n  -> %s\n' "${label}" "$(printf '%s' "${out}" | rg 'DRY_RUN:' || true)"
  else
    FAIL=$((FAIL + 1))
    printf 'FAIL: %s\n  want: %s\n  got:\n%s\n' "${label}" "${want}" "${out}"
  fi
}

mk_repo() {
  mktemp -d /tmp/stop-lint-lang.XXXXXX
}

init_git() {
  git init -q && git add . && git commit -q -m init
}

payload() {
  local repo="$1"
  jq -nc --arg cwd "${repo}" '{cwd:$cwd}'
}

printf '=== LANGUAGE MATRIX: lint + format on changed files only ===\n\n'

# --- Python / ruff check + format ---
REPO_PY="$(mk_repo)"
cd "${REPO_PY}"
printf '[tool.ruff]\nline-length = 88\n' > pyproject.toml
printf 'x = 1\n' > good.py
printf 'y = 1\n' > also_good.py
init_git
printf 'x = \n' > bad.py
OUT_PY="$(run_dry "${REPO_PY}" "$(payload "${REPO_PY}")")"
assert_cmd "${OUT_PY}" "ruff check bad.py" "python lint: scopes to bad.py" "also_good.py"
assert_cmd "${OUT_PY}" "ruff format --check bad.py" "python format: scopes to bad.py" "also_good.py"

# --- Oxlint + oxfmt / ts ---
REPO_TS="$(mk_repo)"
cd "${REPO_TS}"
printf '%s\n' '{}' > oxlintrc.json
printf '%s\n' '{}' > .oxfmtrc.json
printf 'export const good = 1;\n' > good.ts
printf 'export const also = 1;\n' > also.ts
init_git
printf 'export const bad = ;\n' > bad.ts
OUT_TS="$(run_dry "${REPO_TS}" "$(payload "${REPO_TS}")")"
assert_cmd "${OUT_TS}" "oxlint bad.ts" "oxlint/ts: scopes to bad.ts" "also.ts"
assert_cmd "${OUT_TS}" "oxfmt --check bad.ts" "oxfmt/ts: scopes to bad.ts" "also.ts"

# --- Oxlint / js ---
REPO_OX="$(mk_repo)"
cd "${REPO_OX}"
printf '%s\n' '{}' > oxlintrc.json
printf '%s\n' '{}' > .oxfmtrc.json
printf 'export const good = 1;\n' > good.js
printf 'export const also = 1;\n' > also.js
init_git
printf 'export const bad = ;\n' > bad.js
OUT_OX="$(run_dry "${REPO_OX}" "$(payload "${REPO_OX}")")"
assert_cmd "${OUT_OX}" "oxlint bad.js" "oxlint/js: scopes to bad.js" "also.js"
assert_cmd "${OUT_OX}" "oxfmt --check bad.js" "oxfmt/js: scopes to bad.js" "also.js"

# --- Swift / swiftlint ---
if command -v swiftlint >/dev/null 2>&1; then
  REPO_SW="$(mk_repo)"
  cd "${REPO_SW}"
  printf 'disabled_rules:\n' > .swiftlint.yml
  printf 'let good = 1\n' > good.swift
  printf 'let also = 1\n' > also.swift
  init_git
  printf 'let bad = \n' > bad.swift
  OUT_SW="$(run_dry "${REPO_SW}" "$(payload "${REPO_SW}")")"
  assert_cmd "${OUT_SW}" "swiftlint lint -- bad.swift" "swiftlint: scopes to bad.swift" "also.swift"
else
  printf 'SKIP: swiftlint not installed\n'
fi

# --- Swift / swiftformat (format-only path) ---
if command -v swiftformat >/dev/null 2>&1; then
  REPO_SWFMT="$(mk_repo)"
  cd "${REPO_SWFMT}"
  printf -- '---\n' > .swiftformat
  printf 'let good = 1\n' > good.swift
  printf 'let also = 1\n' > also.swift
  init_git
  printf 'let x=1\n' > bad_fmt.swift
  OUT_SWFMT="$(run_dry "${REPO_SWFMT}" "$(payload "${REPO_SWFMT}")")"
  assert_cmd "${OUT_SWFMT}" "swiftformat --lint bad_fmt.swift" "swiftformat: scopes to bad_fmt.swift" "also.swift"
else
  printf 'SKIP: swiftformat not installed\n'
fi

# --- mise run lint ---
if command -v mise >/dev/null 2>&1; then
  REPO_MISE="$(mk_repo)"
  cd "${REPO_MISE}"
  cat > mise.toml <<'EOF'
[tasks.lint]
run = "echo mise_lint_ok"
EOF
  printf 'x = 1\n' > good.py
  printf 'y = 1\n' > also.py
  init_git
  printf 'x = 2\n' > good.py
  OUT_MISE="$(run_dry "${REPO_MISE}" "$(payload "${REPO_MISE}")")"
  assert_cmd "${OUT_MISE}" "mise run lint -- good.py" "mise: scopes to changed good.py" "also.py"
  OUT_MISE_REAL="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_MISE}") && printf '%s' '$(payload "${REPO_MISE}")' | $(printf '%q' "${HOOK}")")"
  if [[ "${OUT_MISE_REAL}" == "{}" ]]; then
    PASS=$((PASS + 1)); printf 'PASS: real mise lint allows on changed file\n'
  else
    FAIL=$((FAIL + 1)); printf 'FAIL: real mise lint\n%s\n' "${OUT_MISE_REAL}"
  fi
else
  printf 'SKIP: mise not installed\n'
fi

# --- Negative: changed py, no linter config → allow ---
REPO_NO_CFG="$(mk_repo)"
cd "${REPO_NO_CFG}"
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_NO_CFG="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_NO_CFG}") && printf '%s' '$(payload "${REPO_NO_CFG}")' | $(printf '%q' "${HOOK}")")"
if [[ "${OUT_NO_CFG}" == "{}" ]]; then
  PASS=$((PASS + 1)); printf 'PASS: fallback: no linter config allows stop\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: fallback no config should allow\n%s\n' "${OUT_NO_CFG}"
fi
OUT_NO_CFG_DRY="$(run_dry "${REPO_NO_CFG}" "$(payload "${REPO_NO_CFG}")")"
if [[ "${OUT_NO_CFG_DRY}" != *"DRY_RUN:"* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: fallback: no config queues zero commands\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: fallback no config should not queue commands\n%s\n' "${OUT_NO_CFG_DRY}"
fi

# --- Negative: pyproject.toml but only .js changed without oxlint config → allow ---
REPO_GATE="$(mk_repo)"
cd "${REPO_GATE}"
printf '[tool.ruff]\n' > pyproject.toml
printf 'export const x = 1;\n' > good.js
init_git
printf 'export const x = 2;\n' > good.js
OUT_GATE="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_GATE}") && printf '%s' '$(payload "${REPO_GATE}")' | $(printf '%q' "${HOOK}")")"
if [[ "${OUT_GATE}" == "{}" ]]; then
  PASS=$((PASS + 1)); printf 'PASS: fallback: ruff config does not lint unchanged-language .js\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: fallback language gate\n%s\n' "${OUT_GATE}"
fi

REPO_MIX="$(mk_repo)"
cd "${REPO_MIX}"
printf '[tool.ruff]\n' > pyproject.toml
printf '%s\n' '{}' > oxlintrc.json
printf 'export const badTs = ;\n' > committed_bad.ts
printf 'x = 1\n' > good.py
init_git
printf 'x = 2\n' > good.py
OUT_MIX="$(run_dry "${REPO_MIX}" "$(payload "${REPO_MIX}")")"
if [[ "${OUT_MIX}" == *"ruff check good.py"* && "${OUT_MIX}" != *"committed_bad.ts"* && "${OUT_MIX}" != *"oxlint"* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: mixed repo: ruff good.py only, ignores committed_bad.ts\n  -> %s\n' "$(echo "${OUT_MIX}" | rg 'DRY_RUN:')"
else
  FAIL=$((FAIL + 1)); printf 'FAIL: mixed repo\n%s\n' "${OUT_MIX}"
fi

# --- Real run: py lint block ---
REPO_REAL="$(mk_repo)"
cd "${REPO_REAL}"
printf '[tool.ruff]\n' > pyproject.toml
printf 'x = 1\n' > good.py
init_git
printf 'x = \n' > bad.py
OUT_REAL="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_REAL}") && printf '%s' '$(payload "${REPO_REAL}")' | $(printf '%q' "${HOOK}")")"
if [[ "${OUT_REAL}" == *'"decision": "block"'* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: real ruff lint run blocks on bad.py\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: real ruff lint run\n%s\n' "${OUT_REAL}"
fi

# --- Real run: py format block (lint-clean, format-bad) ---
REPO_FMT="$(mk_repo)"
cd "${REPO_FMT}"
printf '[tool.ruff]\n' > pyproject.toml
printf 'x = 1\n' > good.py
init_git
printf 'x=1\n' > bad_fmt.py
OUT_FMT="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_FMT}") && printf '%s' '$(payload "${REPO_FMT}")' | $(printf '%q' "${HOOK}")")"
if [[ "${OUT_FMT}" == *'"decision": "block"'* && "${OUT_FMT}" == *"ruff format"* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: real ruff format --check blocks on bad_fmt.py\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: real ruff format block\n%s\n' "${OUT_FMT}"
fi

# --- Real run: oxfmt block (lint-clean, format-bad) ---
REPO_OXFMT="$(mk_repo)"
cd "${REPO_OXFMT}"
printf '%s\n' '{}' > oxlintrc.json
printf '%s\n' '{}' > .oxfmtrc.json
printf 'export const good = 1;\n' > good.js
init_git
printf 'export const x=1;\n' > bad_fmt.js
OUT_OXFMT="$(HOOK_LINT_PLATFORM=codex bash -lc "cd $(printf '%q' "${REPO_OXFMT}") && printf '%s' '$(payload "${REPO_OXFMT}")' | $(printf '%q' "${HOOK}")")"
if [[ "${OUT_OXFMT}" == *'"decision": "block"'* && "${OUT_OXFMT}" == *"oxfmt"* ]]; then
  PASS=$((PASS + 1)); printf 'PASS: real oxfmt --check blocks on bad_fmt.js\n'
else
  FAIL=$((FAIL + 1)); printf 'FAIL: real oxfmt block\n%s\n' "${OUT_OXFMT}"
fi

printf '\n=== %d passed, %d failed ===\n' "${PASS}" "${FAIL}"
[[ "${FAIL}" -eq 0 ]]
