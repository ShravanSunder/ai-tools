# #######################
# ZAP INSTALLER
# #######################
[ -f "${XDG_DATA_HOME:-$HOME/.local/share}/zap/zap.zsh" ] && source "${XDG_DATA_HOME:-$HOME/.local/share}/zap/zap.zsh"

plug "zsh-users/zsh-autosuggestions"
plug "zap-zsh/supercharge"
plug "zap-zsh/zap-prompt"
plug "zsh-users/zsh-syntax-highlighting"

# #######################
# SHELL SETTINGS
# #######################
export HISTSIZE=10000
export SAVEHIST=10000
export TERM=xterm-256color
export COLORTERM=truecolor
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export FORCE_COLOR=1
export EDITOR=micro
export VISUAL=micro

# History options
setopt HIST_IGNORE_ALL_DUPS
setopt HIST_FIND_NO_DUPS
setopt HIST_SAVE_NO_DUPS
setopt HIST_IGNORE_SPACE
setopt HIST_REDUCE_BLANKS

# #######################
# ATUIN INITIALIZATION
# #######################
eval "$(atuin init zsh)"

# #######################
# TITLE & PROMPT
# #######################
autoload -Uz add-zsh-hook

_tabby_title_update() {
  local dir="${PWD##*/}"
  local branch=""
  if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    branch=$(git symbolic-ref --quiet --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
    print -n -- "\e]0;🐳 (sidecar) ${dir}::⎇ ${branch}\a"
  else
    print -n -- "\e]0;🐳 (sidecar) ${dir}\a"
  fi
}

add-zsh-hook precmd _tabby_title_update

# #######################
# PNPM
# #######################
export PNPM_HOME="/pnpm"
export PNPM_STORE_DIR="/home/node/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

# #######################
# Native installers (claude, cursor, opencode)
# #######################
export PATH="$HOME/.local/bin:$PATH"

# #######################
# COMPLETION SYSTEM
# #######################
autoload -Uz compinit
compinit

# #######################
# SIDECAR ENV OVERRIDES
# #######################
# Parse SIDECAR_ENV_OVERRIDES from conf files (live, no restart needed)
# Supports multiline values with \ continuation
_load_sidecar_env_overrides() {
    local conf_dir="/etc/agent-sidecar"
    for conf in "$conf_dir/sidecar.repo.conf" "$conf_dir/sidecar.local.conf"; do
        [ -f "$conf" ] || continue
        # Source conf in subshell to safely extract SIDECAR_ENV_OVERRIDES
        local val=$(
            SIDECAR_ENV_OVERRIDES=""
            source "$conf" 2>/dev/null
            echo "$SIDECAR_ENV_OVERRIDES"
        )
        [ -z "$val" ] && continue
        for kv in ${=val}; do
            export "$kv"
        done
    done
}
_load_sidecar_env_overrides
unset -f _load_sidecar_env_overrides

# #######################
# CUSTOM CONFIG
# #######################
alias ll='ls -la'

if command -v wt >/dev/null 2>&1; then eval "$(command wt config shell init zsh)"; fi
