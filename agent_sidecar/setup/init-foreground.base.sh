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

# 4. EXTRA SCRIPTS: Run repo + local additions (additive, not replacement)
# These run IN ADDITION to this base script, not instead of it
# SIDECAR_CONFIG_DIR is set by run-agent-sidecar.sh (agent cannot access .agent_sidecar directly)
CONFIG_DIR="${SIDECAR_CONFIG_DIR:-$WORK_DIR/.agent_sidecar}"
for tier in repo local; do
    EXTRA_SCRIPT="$CONFIG_DIR/init-foreground-extra.${tier}.sh"
    if [ -f "$EXTRA_SCRIPT" ] && [ -x "$EXTRA_SCRIPT" ]; then
        echo "🐚 Running init-foreground-extra.${tier}.sh..."
        "$EXTRA_SCRIPT" || true
    fi
done
