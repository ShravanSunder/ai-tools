# ws - Workspace Manager v4 shell integration
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

# ws completions
_ws_completions() {
  local state_dir="${XDG_CONFIG_HOME:-$HOME/.config}/ws"
  local index_file="$state_dir/index.json"

  if [[ ${#words[@]} -eq 2 ]]; then
    _values 'commands' pick init add list delete status help
  elif [[ ${#words[@]} -eq 3 ]]; then
    case "${words[2]}" in
      pick|delete)
        # Complete with saved workspace names
        if [[ -f "$index_file" ]]; then
          local workspaces=$(jq -r '.workspaces | keys[]' "$index_file" 2>/dev/null)
          _values 'workspaces' ${(f)workspaces}
        fi
        ;;
      init)
        # Complete with --all flag or repo names
        _values 'options' '--all' '-a' '.'
        if command -v wt >/dev/null 2>&1; then
          local repos=$(wt list --format=json 2>/dev/null | jq -r '.[].path | split("/") | .[-1] | sub("\\.wt$"; "") | sub("\\..*$"; "")' 2>/dev/null | sort -u)
          _values 'repos' ${(f)repos}
        fi
        ;;
      add)
        # Complete with directories
        _files -/
        ;;
    esac
  elif [[ ${#words[@]} -eq 4 ]]; then
    case "${words[2]}" in
      init)
        # After --all, complete with repo names or .
        if [[ "${words[3]}" == "--all" ]] || [[ "${words[3]}" == "-a" ]]; then
          _values 'options' '.'
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
