# ws - Workspace Manager v4

Zellij-native workspace management with worktree-based tab layouts.

## The Problem

You work on multiple repos with multiple worktrees. You want a quick way to spin up a Zellij session with tabs for each worktree, and easily switch between different project contexts.

## The Solution

```bash
ws init obsidian-cortex  # Pick worktrees -> tabs in Zellij session
ws pick                   # Interactive picker to switch workspaces
```

Zellij handles session persistence automatically. Sessions survive terminal close.

## Architecture

v4 uses native Zellij tabs instead of Kitty tab orchestration:

```
Any Terminal
└── Zellij session "project"
    ├── Tab "main" (cwd: worktree/main)
    ├── Tab "feature" (cwd: worktree/feature)
    └── Tab "hotfix" (cwd: worktree/hotfix)
```

**Benefits:**
- **No shell env issues** - Zellij spawns interactive shells that source `.zshrc`
- **Auto-persistence** - Zellij session resurrection handles save/restore
- **Terminal agnostic** - Works with any terminal (Kitty, WezTerm, iTerm, etc.)

## Installation

```bash
# Install dependencies
brew install fzf gum jq zellij

# Run setup
./setup.sh
source ~/.zshrc
```

## Requirements

- `fzf` - interactive picker with preview (recommended)
- `gum` - interactive multi-select for `ws init`
- `jq` - JSON processing
- `zellij` - terminal multiplexer
- `wt` (worktrunk) - for `ws init` to find worktrees

## Commands

| Command | Description |
|---------|-------------|
| `ws` | Show help |
| `ws pick` | Interactive picker to attach/create workspace |
| `ws init [repo\|.]` | Create workspace from worktrees |
| `ws init --all [repo\|.]` | Create workspace with ALL worktrees |
| `ws add [path]` | Add tab to current Zellij session |
| `ws list` | List saved workspaces |
| `ws delete <name>` | Delete a workspace |
| `ws status` | Show current Zellij session info |

### Shell Function

| Command | Description |
|---------|-------------|
| `zj [name]` | Attach/create Zellij session (defaults to current dir name) |

## Usage Examples

### Create workspace from worktrees

```bash
# Interactive: pick repo, then pick which worktrees
ws init

# Pick worktrees for a specific repo
ws init obsidian-cortex

# Open ALL worktrees (skip selection)
ws init --all obsidian-cortex

# Use current directory's repo
ws init .

# This creates a Zellij session with tabs for each selected worktree
```

### Switch between workspaces

```bash
# Interactive picker with preview
ws pick
# ┌─────────────────────────┬────────────────────────────┐
# │ * project-dev/ obsidian │ === project-dev/obsidian   │
# │   ai-sdk/ langchain     │                            │
# │                         │ Session: obsidian          │
# │                         │                            │
# │                         │ Tabs:                      │
# │                         │   - main                   │
# │                         │   - react                  │
# │                         │   - feature-x              │
# │                         │                            │
# │                         │ Status: * Running          │
# └─────────────────────────┴────────────────────────────┘
# (* = session is running)
```

### Add tabs to current session

```bash
# Must be inside a Zellij session first
ws add ~/dev/related-repo

# Add current directory as new tab
ws add .
```

### Detach and reattach

```bash
# Inside Zellij: Press Ctrl+o then d to detach

# Later, reattach:
ws pick           # Interactive picker
zellij attach obsidian-cortex  # Direct attach
```

### Check status

```bash
# See all Zellij sessions
ws status

# List saved workspaces
ws list
```

## Session Persistence

Zellij automatically persists sessions:

- Sessions serialize to `~/.cache/zellij/` every second
- Sessions survive terminal close
- Reattach anytime with `zellij attach` or `ws pick`
- Layout (tabs, cwds, pane splits) preserved automatically

No manual save needed - Zellij handles it.

## How It Works

### Workspace Flow

1. `ws init` reads worktrees from `wt list`
2. Generates a KDL layout file with tabs for each worktree
3. Starts Zellij session with the layout
4. Zellij handles persistence from there

### Data Structure

```
~/.config/ws/
├── config.json              # Settings (minimal)
├── index.json               # Workspace metadata index
└── layouts/                 # KDL layout files
    ├── project-dev/
    │   └── obsidian-cortex.kdl
    └── ai-sdk/
        └── langchain.kdl
```

### Generated KDL Layout

```kdl
// ~/.config/ws/layouts/project-dev/obsidian-cortex.kdl
layout {
    tab name="main" cwd="/Users/user/dev/project-dev/obsidian-cortex" focus=true {
        pane
    }
    tab name="react" cwd="/Users/user/dev/project-dev/obsidian-cortex.wt/react" {
        pane
    }
    tab name="feature-x" cwd="/Users/user/dev/project-dev/obsidian-cortex.wt/feature-x" {
        pane
    }
}
```

### Workspace ID

Each workspace is identified by `parent/name`:
- `project-dev/obsidian-cortex`
- `ai-sdk/langchain`

The parent is auto-detected from the worktree path.

## Zellij Tips

- **Detach**: `Ctrl+o d`
- **See tabs**: `Ctrl+t`
- **New tab**: `Ctrl+t n`
- **Rename tab**: `Ctrl+t r`
- **Close tab**: `Ctrl+t x`
- **Switch tabs**: `Alt+<number>` or `Ctrl+t` then arrow keys

## Uninstall

```bash
rm ~/.local/bin/ws
# Remove "source .../ws.zsh" line from ~/.zshrc
rm -rf ~/.config/ws
```
