# ws - Workspace Manager v3 shell integration
# Source this file in your .zshrc

# Zellij session helper (attach or create)
zj() {
  local session_name="${1:-$(basename $PWD)}"

  if zellij list-sessions 2>/dev/null | grep -q "^$session_name"; then
    zellij attach "$session_name"
  else
    zellij -s "$session_name"
  fi
}

# ─────────────────────────────────────────────────────────────
# Auto-save hook: saves workspace on shell exit
# ─────────────────────────────────────────────────────────────

# Track current workspace (set by ws load/save)
export WS_CURRENT="${WS_CURRENT:-}"

_ws_autosave_hook() {
  # Skip if not in Kitty or no workspace set
  [[ -z "${KITTY_WINDOW_ID:-}" ]] && return
  [[ -z "${WS_CURRENT:-}" ]] && return

  # Check if autosave is enabled
  local config_file="${XDG_CONFIG_HOME:-$HOME/.config}/ws/config.json"
  if [[ -f "$config_file" ]]; then
    local autosave=$(jq -r '.autosave // false' "$config_file" 2>/dev/null)
    [[ "$autosave" != "true" ]] && return
  else
    return
  fi

  # Quietly save the workspace
  ws save --quiet 2>/dev/null || true
}

# Register the hook to run on shell exit
autoload -Uz add-zsh-hook
add-zsh-hook zshexit _ws_autosave_hook

# ws completions
_ws_completions() {
  local commands="pick save load add list delete init find status autosave help"
  local state_dir="${XDG_CONFIG_HOME:-$HOME/.config}/ws"
  local index_file="$state_dir/index.json"

  if [[ ${#words[@]} -eq 2 ]]; then
    _values 'commands' $commands
  elif [[ ${#words[@]} -eq 3 ]]; then
    case "${words[2]}" in
      load|delete|preview)
        # Complete with saved workspace names
        if [[ -f "$index_file" ]]; then
          local workspaces=$(jq -r '.workspaces | keys[]' "$index_file" 2>/dev/null)
          _values 'workspaces' ${(f)workspaces}
        fi
        ;;
      init)
        # Complete with --all flag or repo names
        _values 'options' '--all' '-a'
        if command -v wt >/dev/null 2>&1; then
          local repos=$(wt list --format=json 2>/dev/null | jq -r '.[].path | split("/") | .[-1] | sub("\\.wt$"; "") | sub("\\..*$"; "")' 2>/dev/null | sort -u)
          _values 'repos' ${(f)repos}
        fi
        ;;
      find)
        # Complete with repo names from wt
        if command -v wt >/dev/null 2>&1; then
          local repos=$(wt list --format=json 2>/dev/null | jq -r '.[].path | split("/") | .[-1]' 2>/dev/null | sort -u)
          _values 'repos' ${(f)repos}
        fi
        ;;
      add)
        # Complete with directories
        _files -/
        ;;
      autosave)
        # Complete with on/off
        _values 'options' 'on' 'off'
        ;;
    esac
  elif [[ ${#words[@]} -eq 4 ]]; then
    case "${words[2]}" in
      init)
        # After --all, complete with repo names
        if [[ "${words[3]}" == "--all" ]] || [[ "${words[3]}" == "-a" ]]; then
          if command -v wt >/dev/null 2>&1; then
            local repos=$(wt list --format=json 2>/dev/null | jq -r '.[].path | split("/") | .[-1] | sub("\\.wt$"; "") | sub("\\..*$"; "")' 2>/dev/null | sort -u)
            _values 'repos' ${(f)repos}
          fi
        fi
        ;;
    esac
  fi
}
compdef _ws_completions ws
