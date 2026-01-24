#!/bin/bash
# =============================================================================
# playwright-wrapper.sh - Chromium wrapper with host restrictions
# =============================================================================
# Restricts Chromium to localhost by default. Use PLAYWRIGHT_EXTRA_HOSTS to
# allow additional hosts.
#
# This wrapper is set as PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH so Playwright
# uses it instead of launching Chromium directly.
# =============================================================================

# Find the actual Chromium executable
CHROMIUM_PATH="${PLAYWRIGHT_CHROMIUM_REAL_PATH:-/home/node/.cache/ms-playwright/chromium-*/chrome-linux/chrome}"
CHROMIUM=$(ls $CHROMIUM_PATH 2>/dev/null | head -1)

if [ -z "$CHROMIUM" ] || [ ! -x "$CHROMIUM" ]; then
    echo "Error: Chromium not found at $CHROMIUM_PATH" >&2
    exit 1
fi

# Build host rules: block all external, allow localhost + extra hosts
HOST_RULES="MAP * 127.0.0.1, EXCLUDE localhost, EXCLUDE 127.0.0.1, EXCLUDE [::1]"

# Add extra hosts if configured
if [ -n "$PLAYWRIGHT_EXTRA_HOSTS" ]; then
    for host in $(echo "$PLAYWRIGHT_EXTRA_HOSTS" | tr ',' ' '); do
        host=$(echo "$host" | xargs)  # trim whitespace
        if [ -n "$host" ]; then
            HOST_RULES="$HOST_RULES, EXCLUDE $host"
        fi
    done
fi

# Launch Chromium with host restrictions
exec "$CHROMIUM" --host-rules="$HOST_RULES" "$@"
