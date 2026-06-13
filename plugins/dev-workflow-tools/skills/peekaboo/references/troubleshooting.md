# Troubleshooting Guide

Common errors and solutions when using Peekaboo.

## Permission Errors

### "Screen Recording permission required"

**Symptom**: Commands fail with permission error, black screenshots

**Solution**:
```bash
# Check permissions
peekaboo permissions status

# Grant via System Settings:
# System Settings > Privacy & Security > Screen Recording
# Add Terminal.app or your IDE
```

### "Accessibility permission required"

**Symptom**: Click/type commands fail, can't interact with UI

**Solution**:
```bash
# Check permissions
peekaboo permissions status

# Grant via System Settings:
# System Settings > Privacy & Security > Accessibility
# Add Terminal.app or your IDE
```

### Permissions granted but still failing

Try:
1. Restart Terminal/IDE
2. Restart the app you're automating
3. Check the correct executable has permission (not a wrapper)

## Snapshot Errors

### SNAPSHOT_NOT_FOUND

**Symptom**: `click --snapshot` fails with snapshot not found

**Causes**:
- Snapshot expired or cleaned
- Wrong snapshot ID
- Using snapshot from different session

**Solution**:
```bash
# Re-capture to get fresh snapshot
peekaboo see --app "MyApp" --json
# Use the new snapshot_id
```

### Snapshot becomes stale

**Symptom**: Clicks land on wrong elements

**Cause**: UI changed since snapshot was taken

**Solution**:
- Re-capture before each interaction
- Use the latest snapshot_id
- For dynamic UIs, capture immediately before clicking

### Snapshot-backed action resolves in the wrong app

**Symptom**: `click --snapshot "$SNAPSHOT" --on elem_5` appears to target the
wrong app or window.

**Checks**:
```bash
umask 077
UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
trap 'rm -f "$UI_JSON"' EXIT

peekaboo list windows --app "MyApp" --json
peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_JSON"
jq '.data | {snapshot_id, app_name, window_title, windowContext}' "$UI_JSON"
```

**Solutions**:
- Recapture after focusing the intended app/window.
- Inspect whether the saved snapshot preserved the expected app/window context.
- Avoid adding `--app` to a click that already uses `--snapshot`; instead,
  create a fresh snapshot for the correct target.

## Element Not Found

### Element ID not found

**Symptom**: `--on elem_12` fails

**Causes**:
- Wrong element ID
- Element IDs changed (different capture)
- Element not in current view

**Solution**:
```bash
# Re-capture and list elements
peekaboo see --app "MyApp" --json | jq '.data.ui_elements[] | {id, label}'

# Find by label instead
peekaboo click "Button Label"
```

### Fuzzy query finds nothing

**Symptom**: `peekaboo click "Submit"` finds no element

**Solutions**:
```bash
# Check exact labels in UI
peekaboo see --app "MyApp" --json | jq '.data.ui_elements[].label'

# Try partial match
peekaboo see --app "MyApp" --json | jq '.data.ui_elements[] | select(.label | test("sub"; "i"))'

# Use keyboard navigation instead
peekaboo press tab tab return
```

## Focus and Space Switching Issues

### Click goes to wrong window

**Symptom**: Click lands in different app than expected

**Causes**:
- Target app not in front
- Multiple windows overlapping
- Debug build without bundle ID

**Solutions**:
```bash
# Ensure app is focused first
peekaboo app switch --to "MyApp"
peekaboo see --app "MyApp" --json

# Use PID for debug builds
PID=$(pgrep -x "MyApp")
peekaboo app switch --to "PID:$PID"
peekaboo see --app "PID:$PID" --json

# Use keyboard navigation
peekaboo press down down return
```

When the target is a debug build without a stable bundle ID, PID targeting or
keyboard navigation is often safer than fuzzy click targeting.

### Window in different Space

**Symptom**: "Window in different Space" error

**Solution**:
```bash
# Let Peekaboo handle Space switching (default)
peekaboo click --snapshot "$SNAPSHOT" --on elem_5

# Or bring window to current Space
peekaboo window focus --app "MyApp" --bring-to-current-space
```

### Focus timeout

**Symptom**: "Focus timeout" error

**Cause**: App takes too long to come to front

**Solution**:
```bash
# Increase focus timeout
peekaboo click --snapshot "$SNAPSHOT" --on elem_5 --focus-timeout 10
```

## Bridge Errors

### PeekabooBridgeErrorEnvelope error

**Symptom**: Cryptic bridge error on click/type commands

**Causes**:
- Mixing `--app` with `--snapshot`
- Bridge connection lost
- Peekaboo.app not running

**Solutions**:
```bash
# Don't mix --app with --snapshot!
# WRONG:
peekaboo click --app "MyApp" --snapshot "$SNAPSHOT" --on elem_5

# CORRECT:
peekaboo click --snapshot "$SNAPSHOT" --on elem_5

# Check bridge status
peekaboo bridge status

# Restart Peekaboo.app if needed
```

If this happens after the UI changed, recapture first. Retrying with stale
element IDs often repeats the wrong action.

### Bridge socket not found

**Symptom**: Can't connect to bridge

**Solution**:
```bash
# Check if Peekaboo.app is running
pgrep -f Peekaboo

# Start daemon if using headless mode
peekaboo daemon start
peekaboo daemon status
```

## Timing Issues

### Commands fail intermittently

**Symptom**: Works sometimes, fails others

**Cause**: UI not ready when command runs

**Solutions**:
```bash
# Add wait before capture
sleep 0.5
peekaboo see --app "MyApp" --json

# Use wait-for on click
peekaboo click --on elem_5 --wait-for 3000

# Check element exists before clicking
```

### Typing appears garbled

**Symptom**: Characters out of order or missing

**Solution**:
```bash
# Use slower typing
peekaboo type "hello" --delay 50

# Or human-like typing
peekaboo type "hello" --wpm 100
```

## Debug Builds and Unsigned Apps

### Click targeting wrong app

**Symptom**: Click goes to different app even with `--app`

**Cause**: Debug builds lack bundle IDs

**Solutions**:
```bash
# Use PID instead
PID=$(pgrep -x "MyDebugApp")
peekaboo app switch --to "PID:$PID"
peekaboo see --app "PID:$PID" --json

# Use keyboard navigation
peekaboo app switch --to "MyDebugApp"
peekaboo press down down return
peekaboo hotkey cmd,s
```

## Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `APP_NOT_FOUND` | Application not running | Start the app first |
| `WINDOW_NOT_FOUND` | No windows for app | App may be minimized or hidden |
| `SNAPSHOT_NOT_FOUND` | Snapshot expired | Re-capture with `see` |
| `ELEMENT_NOT_FOUND` | Element ID invalid | Check IDs with `see --json` |
| `PERMISSION_DENIED` | Missing macOS permission | Grant in System Settings |
| `FOCUS_TIMEOUT` | Couldn't bring window to front | Increase `--focus-timeout` |
| `BRIDGE_ERROR` | Communication error | Check bridge status |

## Getting More Debug Info

```bash
umask 077
UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
DEBUG_IMAGE=$(mktemp "${TMPDIR:-/tmp}/peekaboo-debug.XXXXXX.png")
trap 'rm -f "$UI_JSON" "$DEBUG_IMAGE"' EXIT

# Verbose output
peekaboo see --app "MyApp" --verbose

# JSON output for parsing
peekaboo see --app "MyApp" --json > "$UI_JSON"

# Annotated screenshot
peekaboo see --app "MyApp" --annotate --path "$DEBUG_IMAGE"

# Check daemon logs
cat ~/.peekaboo/daemon.log
```
