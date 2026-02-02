# ws - Workspace Manager v2 shell integration
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
  local commands="save load add list delete init find open status help"
  local state_dir="${XDG_CONFIG_HOME:-$HOME/.config}/ws"
  local index_file="$state_dir/index.json"

  if [[ ${#words[@]} -eq 2 ]]; then
    _values 'commands' $commands
  elif [[ ${#words[@]} -eq 3 ]]; then
    case "${words[2]}" in
      load|delete)
        # Complete with saved workspace names
        if [[ -f "$index_file" ]]; then
          local workspaces=$(jq -r '.workspaces | keys[]' "$index_file" 2>/dev/null)
          _values 'workspaces' ${(f)workspaces}
        fi
        ;;
      open)
        # Complete with branch names from wt
        if command -v wt >/dev/null 2>&1; then
          local branches=$(wt list --format=json 2>/dev/null | jq -r '.[].branch' 2>/dev/null)
          _values 'branches' ${(f)branches}
        fi
        ;;
      init|find)
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
    esac
  fi
}
compdef _ws_completions ws
