# Agent VM parity defaults layered on top of agent-sidecar-base:node-py.
export HISTSIZE=10000
export SAVEHIST=10000
export TERM=xterm-256color
export COLORTERM=truecolor
export LANG=C.UTF-8
export LC_ALL=C.UTF-8
export FORCE_COLOR=1
export EDITOR=micro
export VISUAL=micro

export PNPM_HOME="/pnpm"
export PNPM_STORE_DIR="/home/node/.local/share/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac

export PATH="$HOME/.local/bin:/home/node/.local/bin:$PATH"
alias ll='ls -la'
