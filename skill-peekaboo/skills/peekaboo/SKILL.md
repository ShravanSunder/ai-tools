---
name: peekaboo
description: Visual UI testing for macOS apps using Peekaboo CLI. Use when testing app UI states, verifying visual elements, automating macOS app interactions, debugging native macOS apps, or replacing Playwright for native macOS testing. Supports headless mode for CI/CD. Ideal for verifying debug builds without bundle IDs where click targeting can fail.
---

# Peekaboo Visual Testing

Peekaboo is a macOS automation tool for high-fidelity screen capture, AI analysis, and GUI automation. Use it to test macOS app UIs, verify visual elements, and automate interactions.

## Help Discovery (Use CLI Help for Current Options)

Peekaboo CLI is self-documenting. **Always discover current commands and flags via help** - this prevents outdated assumptions:

```bash
peekaboo --help                    # All commands
peekaboo <command> --help          # Command options
peekaboo <command> <sub> --help    # Subcommand options
```

### Key Help Categories
| Category | Help Command | Use For |
|----------|--------------|---------|
| Vision | `peekaboo see --help` | Capture UI state, get element IDs |
| Capture | `peekaboo image --help` | Save screenshots |
| Click | `peekaboo click --help` | Click elements |
| Type | `peekaboo type --help` | Send text input |
| Keys | `peekaboo press --help`, `peekaboo hotkey --help` | Keyboard navigation |
| App | `peekaboo app --help` | Switch, launch, quit apps |
| Window | `peekaboo window --help` | Focus, list windows |
| Daemon | `peekaboo daemon --help` | Headless mode |

## The Correct Targeting Pattern (Critical!)

### WRONG patterns that cause errors:

```bash
# WRONG - click with --app causes bridge errors
peekaboo see --app "MyApp"
peekaboo click --app "MyApp" --on elem_5     # Bridge error!

# WRONG - click without snapshot targets FRONTMOST window, not your app
peekaboo see --app "MyApp"
peekaboo click --on elem_5                    # Clicks wrong window!
```

### CORRECT pattern: switch -> see -> click with snapshot

```bash
# 1. Switch to app (brings it to front)
peekaboo app switch --to "MyApp"

# 2. Capture UI and get snapshot_id
SNAPSHOT=$(peekaboo see --app "MyApp" --json | jq -r '.data.snapshot_id')

# 3. Click using ONLY --snapshot (no --app flag)
peekaboo click --snapshot "$SNAPSHOT" --on elem_5
```

### Why this works:
- `app switch` brings the target window to front
- `see --app` captures that specific app's UI, returns `snapshot_id`
- The snapshot contains: app context, window info, element positions
- `click --snapshot` uses the snapshot context - **do not add --app**

## Core Workflow: See -> Interact -> Verify

### 1. See: Capture UI State
```bash
peekaboo app switch --to "MyApp"
peekaboo see --app "MyApp" --json > ui.json
# Extract snapshot_id for subsequent commands
SNAPSHOT=$(jq -r '.data.snapshot_id' ui.json)
```

### 2. Interact: Click, Type, or Navigate
```bash
# Click by element ID
peekaboo click --snapshot "$SNAPSHOT" --on elem_3

# Type text
peekaboo type --snapshot "$SNAPSHOT" "hello world"

# Keyboard navigation (often more reliable)
peekaboo press down down return
peekaboo hotkey cmd,s
```

### 3. Verify: Re-capture and Compare
```bash
peekaboo see --app "MyApp" --json > ui_after.json
# Compare element counts, labels, check for expected changes
```

## Element Targeting Options

Check `peekaboo click --help` for current options. Common patterns:

| Method | Syntax | When to Use |
|--------|--------|-------------|
| Element ID | `--on elem_12` | Most reliable when IDs are stable |
| Fuzzy query | `"Submit"` | When label text is unique |
| Coordinates | `--coords 100,200` | Fallback, no snapshot needed |

**Important**: Element IDs are snapshot-specific. `elem_12` from one `see` command is NOT the same as `elem_12` from another capture.

## Debugging Apps (Debug Builds Without Bundle IDs)

Debug builds and unsigned apps often lack bundle IDs, causing click targeting to fail or hit the wrong app.

### Option 1: Target by PID
```bash
PID=$(pgrep -x "MyDebugApp")
peekaboo app switch --to "PID:$PID"
peekaboo see --app "PID:$PID" --json
```

### Option 2: Keyboard Navigation (Often More Reliable)
```bash
peekaboo app switch --to "MyDebugApp"
peekaboo press down down down return    # Arrow keys + Return
peekaboo hotkey cmd,shift,o              # Keyboard shortcuts
peekaboo type "search text" --return     # Type + Enter
```

### When to Use Keyboard Over Clicks
- Debug builds without bundle IDs
- List/tree navigation (arrow keys work better)
- Form fields (Tab between, Return to submit)
- Unstable element IDs that change between captures

### Keyboard Commands Reference
```bash
peekaboo press tab tab return           # Tab navigation + activate
peekaboo press down down down return    # Arrow navigation + activate
peekaboo press up                       # Single arrow key
peekaboo hotkey cmd,a                   # Select all
peekaboo hotkey cmd,c                   # Copy
peekaboo hotkey cmd,v                   # Paste
peekaboo type "text" --return           # Type then press Enter
peekaboo type "text" --tab 2            # Type then press Tab twice
```

## Headless Mode Basics

For CI/CD or background automation:

```bash
# Start daemon
peekaboo daemon start
peekaboo daemon status

# MCP mode auto-starts daemon
peekaboo mcp
```

For detailed headless setup, environment variables, and CI/CD integration: See `references/headless-automation.md`

## Permissions Checklist

Peekaboo requires macOS permissions:
- **Screen Recording**: System Settings > Privacy > Screen Recording
- **Accessibility**: System Settings > Privacy > Accessibility

Check status:
```bash
peekaboo permissions status
```

## Error Recovery

| Error | Solution |
|-------|----------|
| `SNAPSHOT_NOT_FOUND` | Re-run `peekaboo see` to get fresh snapshot |
| Element not found | Check element IDs with `see --json`, verify UI hasn't changed |
| Bridge error | Check `peekaboo bridge status`, ensure Peekaboo.app is running |
| Focus issues | Use `peekaboo app switch` before capture |
| Click going to wrong app | Use PID targeting or keyboard navigation |
| Timeout | Increase `--focus-timeout` or add waits between commands |

## When to Read Reference Files

| Need | Reference File |
|------|---------------|
| Complex testing patterns, multi-step sequences | `references/visual-testing-patterns.md` |
| CI/CD and daemon setup, environment variables | `references/headless-automation.md` |
| Debugging errors, Space switching issues | `references/troubleshooting.md` |
