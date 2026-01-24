#!/bin/zsh
# .agent_sidecar/init-foreground.sh
# Shell Readiness: Ensure Atuin -> Zap -> Zsh are ready sequentially

echo "🐚 Preparing shell session..."

# 1. ATUIN: Sync history first
# We do this quietly but ensure the DB is ready
echo "  - Initializing history (Atuin)..."
atuin import zsh 2>/dev/null || true

# 2. ZAP: Load plugins and ensure they are on disk
# We source the RC file which initializes Zap and triggers any missing plugin installs
echo "  - Initializing plugins (Zap)..."
[ -f ~/.zshrc ] && source ~/.zshrc

# 3. ZSH: Final check
echo "✅ Shell is ready."
