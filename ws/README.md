# ws - Workspace Manager

Manages workspaces by integrating worktrees (wt), Kitty terminal, and Zellij multiplexer.

## Installation

```bash
./setup.sh
source ~/.zshrc  # or restart shell
```

This will:
- Symlink `ws` to `~/.local/bin/`
- Add shell integration to `~/.zshrc` (for `zj` function + completions)

## Requirements

- `wt` (worktrunk) - git worktree manager
- `kitty` - terminal emulator
- `zellij` - terminal multiplexer
- `jq` - JSON processor

## Usage

```bash
# Workspace commands
ws list              # List all worktrees
ws open <branch>     # Open worktree in Kitty tab + Zellij
ws open .            # Open current directory
ws status            # Show active workspaces
ws restore           # Reopen all active workspaces
ws close <branch>    # Remove from active list

# Shell function (from ws.zsh)
zj [name]            # Attach/create Zellij session
```

## How It Works

1. **`ws list`** - Queries `wt list --format=json` to show all worktrees
2. **`ws open`** - Opens a new Kitty tab with Zellij session for the worktree
3. **`ws status`** - Shows tracked active workspaces and running Zellij sessions
4. **`ws restore`** - Reopens all previously active workspaces (useful after crash)
5. **`ws close`** - Removes a workspace from the active tracking list

## State File

Active workspaces are tracked in `~/.config/ws/state.json`:

```json
{
  "active": [
    {
      "branch": "feature-auth",
      "path": "/Users/you/dev/my-app.feature-auth",
      "zellij_session": "my-app-feature-auth",
      "last_opened": "2025-01-31T10:00:00Z"
    }
  ]
}
```

## Uninstall

```bash
rm ~/.local/bin/ws
# Remove "source .../ws.zsh" line from ~/.zshrc
rm -rf ~/.config/ws
```
