#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="${HOME}/.local/bin"
ZSHRC="${HOME}/.zshrc"
SOURCE_LINE="source \"$SCRIPT_DIR/shell/ws.zsh\""

echo "Installing ws..."

# Create bin directory if needed
mkdir -p "$BIN_DIR"

# Symlink ws to ~/.local/bin
ln -sf "$SCRIPT_DIR/bin/ws" "$BIN_DIR/ws"
echo "  Symlinked: $BIN_DIR/ws -> $SCRIPT_DIR/bin/ws"

# Check if ~/.local/bin is in PATH
if [[ ":$PATH:" != *":$BIN_DIR:"* ]]; then
  echo ""
  echo "⚠️  ~/.local/bin is not in your PATH"
  echo "   Add this to your ~/.zshrc:"
  echo ""
  echo '   export PATH="$HOME/.local/bin:$PATH"'
fi

# Add shell integration to .zshrc if not already present
if ! grep -qF "ws.zsh" "$ZSHRC" 2>/dev/null; then
  echo "" >> "$ZSHRC"
  echo "# ws - Workspace Manager" >> "$ZSHRC"
  echo "$SOURCE_LINE" >> "$ZSHRC"
  echo "  Added shell integration to ~/.zshrc"
else
  echo "  Shell integration already in ~/.zshrc"
fi

echo ""
echo "Done! Restart your shell or run: source ~/.zshrc"
echo "Then run 'ws help' to get started."
