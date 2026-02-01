# ws - Workspace Manager shell integration
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
  local commands="list open status restore close help"
  if [[ ${#words[@]} -eq 2 ]]; then
    _values 'commands' $commands
  elif [[ ${words[2]} == "open" || ${words[2]} == "close" ]]; then
    # Complete with branch names from wt
    local branches
    if command -v wt >/dev/null 2>&1; then
      branches=$(wt list --format=json 2>/dev/null | jq -r '.[].branch' 2>/dev/null)
      _values 'branches' ${(f)branches}
    fi
  fi
}
compdef _ws_completions ws
