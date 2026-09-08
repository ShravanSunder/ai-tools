#!/usr/bin/env bash

# Shared helpers for stop lint hooks (Codex, Claude, Gemini/agy, Cursor).
#
# Callers must set before resolve/queue:
#   PROJECT_ROOT, PROJECT_CONFIG_FILE, HOOK_COMMANDS (array)
# After collect_changed_files / collect_changed_extensions:
#   CHANGED_FILES, EXTS
#
# Optional callback for logging queued commands:
#   lint_hook_on_command_queued(source_label, command_template)
#
# Optional overrides:
#   HOOK_LINT_PLATFORM=codex|claude|gemini|cursor
#   HOOK_LINT_DRY_RUN=1  — resolve commands, log them, skip execution (testing)

lint_hook_lowercase() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]'
}

lint_hook_extract_json_field() {
  local hook_input_json="$1"
  local jq_expression="$2"

  if [[ -z "${hook_input_json}" ]] || ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  printf '%s' "${hook_input_json}" | jq -r "${jq_expression} // empty" 2>/dev/null
}

# codex + claude: decision block; gemini: decision deny; cursor: followup_message
detect_lint_hook_platform() {
  local hook_input_json="$1"

  if [[ -n "${HOOK_LINT_PLATFORM:-}" ]]; then
    printf '%s\n' "${HOOK_LINT_PLATFORM}"
    return 0
  fi

  local event_name workspace_root
  event_name="$(lint_hook_lowercase "$(lint_hook_extract_json_field "${hook_input_json}" '.hook_event_name // .hookEventName' || true)")"

  if [[ "${event_name}" == "stop" ]]; then
    workspace_root="$(lint_hook_extract_json_field "${hook_input_json}" '.workspace_roots[0]' || true)"
    if [[ -n "${workspace_root}" && "${workspace_root}" != "null" ]]; then
      printf 'cursor\n'
      return 0
    fi
  fi

  if [[ "${event_name}" == "afteragent" ]]; then
    printf 'gemini\n'
    return 0
  fi

  if [[ -n "${GEMINI_PROJECT_DIR:-}${GEMINI_CWD:-}" ]]; then
    printf 'gemini\n'
    return 0
  fi

  if [[ -n "${CLAUDE_PROJECT_DIR:-}" ]]; then
    printf 'claude\n'
    return 0
  fi

  printf 'codex\n'
}

resolve_lint_hook_project_root() {
  local hook_input_json="$1"
  local candidate payload_root workspace_root

  candidate="${GEMINI_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-${GEMINI_CWD:-}}}"
  if [[ -n "${candidate}" && -d "${candidate}" ]]; then
    printf '%s\n' "${candidate}"
    return 0
  fi

  if [[ -n "${hook_input_json}" ]] && command -v jq >/dev/null 2>&1; then
    workspace_root="$(lint_hook_extract_json_field "${hook_input_json}" '.workspace_roots[0]' || true)"
    if [[ -n "${workspace_root}" && "${workspace_root}" != "null" && -d "${workspace_root}" ]]; then
      printf '%s\n' "${workspace_root}"
      return 0
    fi

    payload_root="$(lint_hook_extract_json_field "${hook_input_json}" '.cwd // .working_directory // .projectRoot // .project_root' || true)"
    if [[ -n "${payload_root}" && "${payload_root}" != "null" && -d "${payload_root}" ]]; then
      printf '%s\n' "${payload_root}"
      return 0
    fi
  fi

  printf '%s\n' "${PWD}"
}

array_has() {
  local needle="$1"
  shift
  local value
  for value in "$@"; do
    if [[ "${value}" == "${needle}" ]]; then
      return 0
    fi
  done
  return 1
}

push_unique() {
  local value="$1"
  local item
  for item in "${HOOK_COMMANDS[@]:-}"; do
    if [[ "${item}" == "${value}" ]]; then
      return 0
    fi
  done
  HOOK_COMMANDS+=("${value}")
}

lint_hook_maybe_log_queued() {
  local source_label="$1"
  local command_template="$2"
  if [[ "$(type -t lint_hook_on_command_queued 2>/dev/null)" == "function" ]]; then
    lint_hook_on_command_queued "${source_label}" "${command_template}"
  fi
}

file_extension() {
  local path="$1"
  local extension="${path##*.}"
  extension="$(lint_hook_lowercase "${extension}")"
  if [[ "${path}" == "${extension}" ]]; then
    printf '\n'
  else
    printf '%s\n' "${extension}"
  fi
}

lint_hook_read_lines() {
  local __target_array_name="$1"
  shift
  local __line
  eval "${__target_array_name}=()"
  while IFS= read -r __line; do
    [[ -n "${__line}" ]] || continue
    eval "${__target_array_name}+=(\"\${__line}\")"
  done
}

collect_changed_files() {
  local project_root="$1"
  lint_hook_read_lines CHANGED_FILES < <( \
    {
      git -C "${project_root}" diff HEAD --name-only -- . ;
      git -C "${project_root}" ls-files --others --exclude-standard -- . ;
    } | awk 'NF' | sort -u
  )
}

collect_changed_extensions() {
  EXTS=()
  local changed_file extension
  for changed_file in "${CHANGED_FILES[@]}"; do
    extension="$(file_extension "${changed_file}")"
    if [[ -n "${extension}" ]]; then
      EXTS+=("${extension}")
    fi
  done
  if [[ ${#EXTS[@]} -gt 0 ]]; then
    local -a sorted_exts=()
    lint_hook_read_lines sorted_exts < <(printf '%s\n' "${EXTS[@]}" | sort -u)
    EXTS=("${sorted_exts[@]}")
  fi
}

shell_quote_files() {
  local quoted="" file
  for file in "$@"; do
    quoted+="$(printf '%q' "${file}") "
  done
  printf '%s' "${quoted%" "}"
}

filter_changed_files_by_extensions() {
  local project_root="$1"
  shift
  local -a allowed_exts=("$@")
  local changed_file extension
  for changed_file in "${CHANGED_FILES[@]}"; do
    extension="$(file_extension "${changed_file}")"
    if array_has "${extension}" "${allowed_exts[@]}" && [[ -f "${project_root}/${changed_file}" ]]; then
      printf '%s\n' "${changed_file}"
    fi
  done
}

language_for_extension() {
  case "$1" in
    ts|tsx|js|jsx|mjs|cjs) printf 'typescript\n' ;;
    py)                     printf 'python\n' ;;
    rs)                     printf 'rust\n' ;;
    swift)                  printf 'swift\n' ;;
    rb)                     printf 'ruby\n' ;;
    kt|kts)                 printf 'kotlin\n' ;;
    go)                     printf 'go\n' ;;
    *)                      printf '\n' ;;
  esac
}

extensions_for_language() {
  case "$1" in
    typescript) printf '%s\n' ts tsx js jsx mjs cjs ;;
    python)     printf '%s\n' py ;;
    rust)       printf '%s\n' rs ;;
    swift)      printf '%s\n' swift ;;
    ruby)       printf '%s\n' rb ;;
    kotlin)     printf '%s\n' kt kts ;;
    go)         printf '%s\n' go ;;
  esac
}

filter_changed_files_by_language() {
  local project_root="$1"
  local language="$2"
  local -a language_exts=()
  lint_hook_read_lines language_exts < <(extensions_for_language "${language}")
  filter_changed_files_by_extensions "${project_root}" "${language_exts[@]}"
}

load_json_commands() {
  local section="$1"
  local selector="$2"
  local jq_expr

  if [[ ! -f "${PROJECT_CONFIG_FILE}" ]] || ! command -v jq >/dev/null 2>&1; then
    return 1
  fi

  case "${section}" in
    commands_by_extension)
      jq_expr='.commands_by_extension[$key] | if . == null then empty elif type == "array" then .[] elif type == "string" then . else empty end'
      ;;
    commands_by_language)
      jq_expr='.commands_by_language[$key] | if . == null then empty elif type == "array" then .[] elif type == "string" then . else empty end'
      ;;
    *)
      return 1
      ;;
  esac

  jq -r --arg key "${selector}" "${jq_expr}" "${PROJECT_CONFIG_FILE}" 2>/dev/null
}

lint_hook_maybe_log_sanitized() {
  local original_cmd="$1"
  local sanitized_cmd="$2"
  if [[ "$(type -t lint_hook_log_message 2>/dev/null)" == "function" ]]; then
    lint_hook_log_message "SANITIZED lint command (removed tree path): ${original_cmd} -> ${sanitized_cmd}"
  fi
}

# Remove standalone "." or "./" path args from config templates so tools never scan the whole tree.
# Templates with {files} are left untouched. Trailing " ." is handled by expand_command_with_files.
sanitize_lint_command_template() {
  local cmd="$1"
  local cleaned previous_cmd

  if [[ "${cmd}" == *'{files}'* ]]; then
    printf '%s' "${cmd}"
    return 0
  fi

  cleaned="$(printf '%s' "${cmd}" | sed -E \
    -e 's/(^|[[:space:]])\.\/($|[[:space:]])/ /g' \
    -e 's/(^|[[:space:]])\.($|[[:space:]])/ /g' \
    -e 's/[[:space:]]+/ /g' \
    -e 's/^ //' \
    -e 's/ $//')"

  if [[ -z "${cleaned}" ]]; then
    return 1
  fi

  if [[ "${cleaned}" != "${cmd}" ]]; then
    lint_hook_maybe_log_sanitized "${cmd}" "${cleaned}"
  fi

  printf '%s' "${cleaned}"
}

# Expand a lint command template to target only the provided files.
# Supports {files} and replaces a trailing " ." with the file list.
expand_command_with_files() {
  local cmd="$1"
  shift
  local -a files=("$@")

  if [[ ${#files[@]} -eq 0 ]]; then
    return 1
  fi

  local files_quoted
  files_quoted="$(shell_quote_files "${files[@]}")"

  if [[ "${cmd}" == *'{files}'* ]]; then
    printf '%s' "${cmd//\{files\}/${files_quoted}}"
    return 0
  fi

  if [[ "${cmd}" == *' .' ]]; then
    printf '%s %s' "${cmd% .}" "${files_quoted}"
    return 0
  fi

  printf '%s %s' "${cmd}" "${files_quoted}"
}

queue_command_for_files() {
  local source_label="$1"
  local cmd="$2"
  shift 2
  local -a files=("$@")
  local expanded sanitized

  sanitized="$(sanitize_lint_command_template "${cmd}")" || return 0

  expanded="$(expand_command_with_files "${sanitized}" "${files[@]}")" || return 0
  push_unique "${expanded}"
  lint_hook_maybe_log_queued "${source_label}" "${cmd}"
}

resolve_lint_hook_commands_from_config() {
  local project_root="$1"
  local ext language cmd
  local -a local_ext_files=()
  local -a local_language_files=()
  EXTS=("${EXTS[@]:-}")

  if command -v jq >/dev/null 2>&1 && [[ -f "${PROJECT_CONFIG_FILE}" ]]; then
    while IFS= read -r cmd; do
      [[ -z "${cmd}" || "${cmd}" == "null" ]] && continue
      queue_command_for_files "post-tool-hook.json:commands" "${cmd}" "${CHANGED_FILES[@]}"
    done < <(jq -r '.commands // [] | if type=="array" then .[] else empty end' "${PROJECT_CONFIG_FILE}" 2>/dev/null || true)
  fi

  for ext in "${EXTS[@]}"; do
    local_ext_files=()
    lint_hook_read_lines local_ext_files < <(filter_changed_files_by_extensions "${project_root}" "${ext}")

    while IFS= read -r cmd; do
      [[ -z "${cmd}" || "${cmd}" == "null" ]] && continue
      queue_command_for_files "post-tool-hook.json:extension:${ext}" "${cmd}" "${local_ext_files[@]}"
    done < <(load_json_commands "commands_by_extension" "${ext}" || true)

    while IFS= read -r cmd; do
      [[ -z "${cmd}" || "${cmd}" == "null" ]] && continue
      queue_command_for_files "post-tool-hook.json:extension:.${ext}" "${cmd}" "${local_ext_files[@]}"
    done < <(load_json_commands "commands_by_extension" ".${ext}" || true)

    language="$(language_for_extension "${ext}")"
    if [[ -n "${language}" ]]; then
      local_language_files=()
      lint_hook_read_lines local_language_files < <(filter_changed_files_by_language "${project_root}" "${language}")
      while IFS= read -r cmd; do
        [[ -z "${cmd}" || "${cmd}" == "null" ]] && continue
        queue_command_for_files "post-tool-hook.json:language:${language}" "${cmd}" "${local_language_files[@]}"
      done < <(load_json_commands "commands_by_language" "${language}" || true)
    fi
  done
}

project_has_oxlint_config() {
  local project_root="$1"
  [[ -f "${project_root}/oxlintrc.json" || -f "${project_root}/.oxlintrc.json" ]]
}

project_has_oxfmt_config() {
  local project_root="$1"
  [[ -f "${project_root}/.oxfmtrc.json" || -f "${project_root}/oxfmtrc.json" ]] && \
    { [[ -x "${project_root}/node_modules/.bin/oxfmt" ]] || command -v oxfmt >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; }
}

project_has_ruff_config() {
  local project_root="$1"
  [[ -f "${project_root}/ruff.toml" || -f "${project_root}/pyproject.toml" ]]
}

resolve_oxfmt_check_command() {
  local project_root="$1"
  if [[ -x "${project_root}/node_modules/.bin/oxfmt" ]]; then
    printf '%s' "${project_root}/node_modules/.bin/oxfmt --check"
  elif command -v oxfmt >/dev/null 2>&1; then
    printf 'oxfmt --check'
  elif command -v pnpm >/dev/null 2>&1 && [[ -f "${project_root}/pnpm-lock.yaml" ]]; then
    printf 'pnpm exec oxfmt --check'
  elif command -v npx >/dev/null 2>&1; then
    printf 'npx -y oxfmt --check'
  else
    return 1
  fi
}

queue_fallback_command_for_extensions() {
  local project_root="$1"
  local cmd_template="$2"
  shift 2
  local -a allowed_exts=("$@")
  local -a matched_files=()
  local expanded

  lint_hook_read_lines matched_files < <(filter_changed_files_by_extensions "${project_root}" "${allowed_exts[@]}")
  if [[ ${#matched_files[@]} -eq 0 ]]; then
    return 0
  fi

  expanded="$(expand_command_with_files "${cmd_template}" "${matched_files[@]}")" || return 0
  push_unique "${expanded}"
}

append_fallback_lint_commands() {
  local project_root="$1"
  shift
  local -a exts=("$@")
  local oxfmt_cmd

  if [[ -f "${project_root}/.mise.toml" || -f "${project_root}/mise.toml" ]]; then
    queue_fallback_command_for_extensions "${project_root}" "mise run lint --" "${exts[@]}"
    return 0
  fi

  if array_has "py" "${exts[@]}" && project_has_ruff_config "${project_root}" && command -v ruff >/dev/null 2>&1; then
    queue_fallback_command_for_extensions "${project_root}" "ruff check" py
    queue_fallback_command_for_extensions "${project_root}" "ruff format --check" py
  fi

  if array_has "ts" "${exts[@]}" || array_has "tsx" "${exts[@]}" || array_has "js" "${exts[@]}" || array_has "jsx" "${exts[@]}" || array_has "mjs" "${exts[@]}" || array_has "cjs" "${exts[@]}"; then
    if project_has_oxlint_config "${project_root}" && command -v oxlint >/dev/null 2>&1; then
      queue_fallback_command_for_extensions "${project_root}" "oxlint" ts tsx js jsx mjs cjs
    fi
    if project_has_oxfmt_config "${project_root}"; then
      oxfmt_cmd="$(resolve_oxfmt_check_command "${project_root}")" || oxfmt_cmd=""
      if [[ -n "${oxfmt_cmd}" ]]; then
        queue_fallback_command_for_extensions "${project_root}" "${oxfmt_cmd}" ts tsx js jsx mjs cjs
      fi
    fi
  fi

  if array_has "swift" "${exts[@]}"; then
    if [[ -f "${project_root}/.swiftlint.yml" || -f "${project_root}/.swiftlint.yaml" ]] && command -v swiftlint >/dev/null 2>&1; then
      queue_fallback_command_for_extensions "${project_root}" "swiftlint lint --" swift
    fi
    if [[ -f "${project_root}/.swiftformat" ]] && command -v swiftformat >/dev/null 2>&1; then
      queue_fallback_command_for_extensions "${project_root}" "swiftformat --lint" swift
    fi
  fi
}
