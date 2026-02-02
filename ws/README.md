# ws - Workspace Manager v2

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
brew install gum jq

# Run setup
./setup.sh
source ~/.zshrc
```

## Requirements

- `gum` - interactive picker (install with `brew install gum`)
- `jq` - JSON processing
- `kitty` - terminal with `allow_remote_control yes`
- `zellij` - terminal multiplexer
- `wt` (worktrunk) - for `ws init` to find worktrees

## Commands

### Workspace Management

| Command | Description |
|---------|-------------|
| `ws` | Interactive picker - choose workspace to load |
| `ws save [name]` | Save current Kitty window as workspace |
| `ws load <name>` | Restore a saved workspace |
| `ws add [path]` | Add folder to current workspace as new tab |
| `ws list` | List saved workspaces |
| `ws delete <name>` | Delete a saved workspace |
| `ws init <repo>` | Quick setup: all worktrees for repo → tabs |
| `ws find <query>` | Search workspaces by name |

### Tab Management (from v1)

| Command | Description |
|---------|-------------|
| `ws open <branch>` | Open single worktree in new tab + zellij |
| `ws open .` | Open current directory in new tab + zellij |
| `ws status` | Show current Kitty tabs + Zellij sessions |

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

# Or use the interactive picker:
ws
```

### Quick setup from worktrees

```bash
# Open all worktrees for a repo as tabs
ws init obsidian-cortex

# This creates a tab for each worktree, each with its own zellij session
# Then save it:
ws save obsidian-cortex
```

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
