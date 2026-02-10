# Headless Automation

Running Peekaboo in headless mode for CI/CD pipelines and background automation.

## Daemon Mode Overview

Peekaboo daemon provides:
- In-memory snapshot store for faster operations
- Window tracking service
- Bridge socket communication
- No GUI feedback

## Daemon Commands

```bash
# Start daemon
peekaboo daemon start

# Check status
peekaboo daemon status

# Stop daemon
peekaboo daemon stop

# Get detailed help
peekaboo daemon --help
```

## Daemon Status Output

```bash
$ peekaboo daemon status
Peekaboo Daemon
===============
Status: Running
PID: 12345
Mode: manual
Bridge: /tmp/peekaboo.sock
Permissions: Screen Recording ✓, Accessibility ✓
Snapshots: 5 cached
Window Tracker: Active, 12 windows tracked
```

## Environment Variables

| Variable | Purpose | Default |
|----------|---------|---------|
| `PEEKABOO_VISUAL_FEEDBACK` | Disable visual overlays | `true` |
| `PEEKABOO_LOG_LEVEL` | Logging verbosity | `info` |
| `PEEKABOO_LOG_FILE` | Custom log path | `~/.peekaboo/daemon.log` |
| `PEEKABOO_BRIDGE_SOCKET` | Custom socket path | `/tmp/peekaboo.sock` |
| `PEEKABOO_OUTPUT_MODE` | Output format override | auto |
| `PEEKABOO_ALLOW_UNSIGNED_SOCKET_CLIENTS` | Allow unsigned clients | `0` |

### Disabling Visual Feedback

For headless/CI environments:
```bash
export PEEKABOO_VISUAL_FEEDBACK=false
peekaboo daemon start
```

### Verbose Logging for Debugging

```bash
export PEEKABOO_LOG_LEVEL=debug
peekaboo daemon start
```

## MCP Mode (Auto-Daemon)

When running as MCP server, daemon mode is automatic:

```bash
peekaboo mcp
```

The MCP server:
- Uses in-memory snapshot manager
- Enables window tracking
- No separate daemon process needed

## CI/CD Pipeline Integration

### GitHub Actions Example

```yaml
name: Visual Tests
on: [push]

jobs:
  visual-test:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Peekaboo
        run: |
          brew tap steipete/tap
          brew install peekaboo

      - name: Grant Permissions (requires UI)
        run: |
          # Note: Screen Recording and Accessibility require
          # manual grant on first run or use pre-configured runner

      - name: Start Daemon
        run: |
          export PEEKABOO_VISUAL_FEEDBACK=false
          peekaboo daemon start
          peekaboo daemon status

      - name: Run Visual Tests
        run: |
          ./scripts/visual-tests.sh

      - name: Stop Daemon
        if: always()
        run: peekaboo daemon stop
```

### Pre-configured macOS Runner Requirements

For CI/CD to work, the runner must have:
1. **Screen Recording permission** granted to Terminal/CI agent
2. **Accessibility permission** granted to Terminal/CI agent
3. A display session (even if virtual)

These cannot be granted programmatically - they require initial manual setup.

## Permission Setup for Headless Environments

### Check Current Permissions
```bash
peekaboo permissions status
```

### Grant Permissions (Interactive)
```bash
peekaboo permissions grant
```

### CI/CD Permission Notes

- Permissions are stored per-executable
- New CI runners need initial permission grant
- Use pre-configured runner images when possible
- Test locally first to ensure permissions work

## Bridge Socket Configuration

The daemon uses a Unix socket for IPC:

```bash
# Default socket
/tmp/peekaboo.sock

# Custom socket
export PEEKABOO_BRIDGE_SOCKET=/custom/path/peekaboo.sock
peekaboo daemon start
```

### Check Bridge Status
```bash
peekaboo bridge status
```

## Daemon Configuration Options

When starting the daemon:

```bash
# Custom socket path
peekaboo daemon start --bridge-socket /tmp/custom.sock

# Adjust window polling interval
peekaboo daemon start --poll-interval-ms 500

# Wait longer for daemon to start
peekaboo daemon start --wait 10
```

## Troubleshooting Headless Mode

### Daemon Won't Start
```bash
# Check for existing process
pgrep -f "peekaboo daemon"

# Check socket
ls -la /tmp/peekaboo.sock

# Force stop and restart
peekaboo daemon stop
peekaboo daemon start
```

### Permission Denied Errors
```bash
# Check permissions
peekaboo permissions status

# If Screen Recording is missing:
# Must grant manually in System Settings > Privacy > Screen Recording
```

### Bridge Connection Issues
```bash
# Check bridge status
peekaboo bridge status

# Verify socket exists
ls -la /tmp/peekaboo.sock

# Check daemon logs
cat ~/.peekaboo/daemon.log
```

## Recommended Headless Configuration

```bash
#!/bin/bash
# setup-headless.sh

export PEEKABOO_VISUAL_FEEDBACK=false
export PEEKABOO_LOG_LEVEL=info
export PEEKABOO_LOG_FILE=/tmp/peekaboo-ci.log

# Start daemon
peekaboo daemon start --wait 5

# Verify
peekaboo daemon status
peekaboo permissions status
```
