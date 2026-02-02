# ws - Workspace Manager v3

Save and restore Kitty tab + Zellij session compositions.

## The Problem

You work on multiple repos with multiple worktrees. You set up Kitty tabs + Zellij sessions in a composition that makes sense for your work. You want to come back to that setup later.

## The Solution

```bash
ws save my-project      # Save current Kitty window (tabs + zellij sessions)
ws load my-project      # Restore it anytime
ws                      # Interactive picker to load workspaces
```

Zellij sessions persist their pane layouts. We just remember which tabs + sessions belong together.

## Installation

```bash
# Install dependencies
brew install fzf gum jq

# Run setup
./setup.sh
source ~/.zshrc
```

## Requirements

- `fzf` - interactive picker with preview (recommended)
- `gum` - interactive multi-select for `ws init`
- `jq` - JSON processing
- `kitty` - terminal with `allow_remote_control yes`
- `zellij` - terminal multiplexer
- `wt` (worktrunk) - for `ws init` to find worktrees

## Commands

### Workspace Management

| Command | Description |
|---------|-------------|
| `ws` | Interactive picker with preview (fzf) |
| `ws save [name]` | Save current Kitty window as workspace |
| `ws load <name>` | Restore a saved workspace |
| `ws add [path]` | Add folder to current workspace as new tab |
| `ws list` | List saved workspaces |
| `ws delete <name>` | Delete a saved workspace |
| `ws init [repo]` | Interactive setup: pick repo, then pick worktrees |
| `ws init --all <repo>` | Quick setup: ALL worktrees for repo → tabs |
| `ws find <query>` | Search workspaces by name |
| `ws status` | Show current Kitty tabs + Zellij sessions |
| `ws autosave [on\|off]` | Toggle auto-save on shell exit |

### Shell Function

| Command | Description |
|---------|-------------|
| `zj [name]` | Attach/create Zellij session (defaults to current dir name) |

## Usage Examples

### Save and restore a workspace

```bash
# Set up your workspace manually (open tabs, arrange zellij panes)
# Then save it:
ws save my-project

# Later, restore it:
ws load my-project

# Or use the interactive picker with preview:
ws
# ┌─────────────────────────┬────────────────────────────┐
# │ project-dev/            │ obsidian-cortex            │
# │ > obsidian-cortex  3t   │ ─────────────────────────  │
# │   askluna-finance  5t   │ Tabs:                      │
# │                         │   react → zellij:oc-react  │
# │ ai-sdk/                 │   main → zellij:oc-main    │
# │   langchain        2t   │   feature-x → zellij:...   │
# │                         │                            │
# │                         │ Session status:            │
# │                         │   🟢 oc-react (active)     │
# │                         │   ⚪ oc-main               │
# └─────────────────────────┴────────────────────────────┘
```

### Quick setup from worktrees

```bash
# Interactive: pick repo, then pick which worktrees
ws init

# Pick worktrees for a specific repo
ws init obsidian-cortex

# Open ALL worktrees (skip selection)
ws init --all obsidian-cortex

# This creates a tab for each worktree, each with its own zellij session
# Then save it:
ws save obsidian-cortex
```

### Auto-save

```bash
# Enable auto-save (workspace saves automatically on shell exit)
ws autosave on

# Check status
ws autosave

# Disable
ws autosave off
```

When auto-save is enabled and you've loaded or saved a workspace, it will automatically save on shell exit.

### Add folders to workspace

```bash
# Add current directory as new tab
ws add

# Add specific folder
ws add ~/dev/related-repo

# Save updated workspace
ws save
```

### Check current state

```bash
# See what tabs and sessions are active
ws status

# List saved workspaces
ws list
```

## How It Works

### Workspace Structure

```
Workspace (saved snapshot)
└── Kitty Window
    ├── Tab "react" → Zellij session "project-react"
    │   ├── Pane: worktree-A (zellij manages layout)
    │   └── Pane: worktree-B
    └── Tab "main" → Zellij session "project-main"
        └── Pane: worktree-C
```

### Workspace ID

Each workspace is identified by `parent/name`:
- `project-dev/obsidian-cortex`
- `ai-sdk/langchain`

The parent is the immediate parent directory, auto-detected from your paths.

### State Files

```
~/.config/ws/
├── config.json          # Settings (autosave, etc.)
├── index.json           # Workspace index with metadata
└── workspaces/
    ├── project-dev/
    │   └── obsidian-cortex.json
    └── ai-sdk/
        └── langchain.json
```

## Uninstall

```bash
rm ~/.local/bin/ws
# Remove "source .../ws.zsh" line from ~/.zshrc
rm -rf ~/.config/ws
```
