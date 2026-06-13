# Visual Testing Patterns

Detailed patterns for using Peekaboo in visual testing workflows.

## Snapshot Targeting Pattern

Use this pattern when an action depends on an accessibility element ID:

```bash
umask 077
UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
trap 'rm -f "$UI_JSON"' EXIT

peekaboo app switch --to "MyApp"
peekaboo list windows --app "MyApp" --json
peekaboo window focus --app "MyApp" --window-title "Window Title"
peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_JSON"
SNAPSHOT=$(jq -r '.data.snapshot_id' "$UI_JSON")
jq '.data.ui_elements[] | {id, label, role: .role_description}' "$UI_JSON"
peekaboo click --snapshot "$SNAPSHOT" --on elem_5 --json
```

Element IDs are snapshot-specific. If the UI changes, capture again before
using the next `elem_*` ID. For a snapshot-backed click, pass `--snapshot` and
the element ID; do not add `--app` to that click. The snapshot already carries
the app/window context needed for stable targeting.

For multi-window apps, select a specific `--window-id` or `--window-title`, or
focus that window explicitly before capture. Use private per-run temp files for
UI JSON because captures can include window titles and text.

## Input Path Probes

Use input-path probes when a click appears to resolve the right element but the
app does not respond as expected.

```bash
umask 077
CALC_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-calc.XXXXXX.json")
trap 'rm -f "$CALC_JSON"' EXIT

peekaboo click --help | rg 'input-strategy|actionOnly|synthOnly'
peekaboo see --app Calculator --json > "$CALC_JSON"
SNAPSHOT=$(jq -r '.data.snapshot_id' "$CALC_JSON")

# Accessibility action path.
peekaboo click --on elem_8 --snapshot "$SNAPSHOT" --input-strategy actionOnly --json --no-auto-focus

# Direct accessibility action.
peekaboo perform-action --on elem_8 --action AXPress --snapshot "$SNAPSHOT" --json

# Synthetic pointer event path.
peekaboo click --on elem_20 --snapshot "$SNAPSHOT" --input-strategy synthOnly --json
```

Interpretation:

- `actionOnly` success proves live AX re-resolution and action invocation.
- `synthOnly` success proves coordinate resolution and event delivery; verify
  app state independently.
- `perform-action AXPress` is the cleanest UIAX smoke test.
- Coordinates cannot prove `actionOnly`; use coordinates only as a fallback when
  Accessibility metadata is unavailable.

## Before/After State Capture

Capture UI state before and after actions to verify changes:

```bash
umask 077
UI_BEFORE_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui-before.XXXXXX.json")
UI_AFTER_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui-after.XXXXXX.json")
trap 'rm -f "$UI_BEFORE_JSON" "$UI_AFTER_JSON"' EXIT

# Capture before state
peekaboo app switch --to "MyApp"
peekaboo see --app "MyApp" --json > "$UI_BEFORE_JSON"
BEFORE_COUNT=$(jq '.data.element_count' "$UI_BEFORE_JSON")

# Perform action
SNAPSHOT=$(jq -r '.data.snapshot_id' "$UI_BEFORE_JSON")
peekaboo click --snapshot "$SNAPSHOT" --on elem_5

# Capture after state
peekaboo see --app "MyApp" --json > "$UI_AFTER_JSON"
AFTER_COUNT=$(jq '.data.element_count' "$UI_AFTER_JSON")

# Compare
echo "Elements before: $BEFORE_COUNT, after: $AFTER_COUNT"
```

## Element Existence Verification

Check if specific elements exist in the UI:

```bash
# Capture and search for element by label
peekaboo see --app "MyApp" --json | \
  jq '.data.ui_elements[] | select(.label | test("Submit"; "i"))'

# Check if button exists
BUTTON_EXISTS=$(peekaboo see --app "MyApp" --json | \
  jq '[.data.ui_elements[] | select(.role_description == "button" and .label == "Login")] | length')

if [ "$BUTTON_EXISTS" -gt 0 ]; then
  echo "Login button found"
else
  echo "Login button NOT found"
fi
```

## JSON Parsing with jq

Common jq patterns for extracting UI data:

```bash
# Get snapshot_id
jq -r '.data.snapshot_id' ui.json

# Get element count
jq '.data.element_count' ui.json

# List all buttons
jq '.data.ui_elements[] | select(.role_description == "button")' ui.json

# Find element by partial label match
jq '.data.ui_elements[] | select(.label | test("Save"; "i"))' ui.json

# Get all element IDs
jq -r '.data.ui_elements[].id' ui.json

# Get element by ID
jq '.data.ui_elements[] | select(.id == "elem_5")' ui.json

# Extract specific fields
jq '.data.ui_elements[] | {id, label, role: .role_description}' ui.json
```

## Multi-Step Test Sequences

Pattern for complex test flows:

```bash
#!/bin/bash
set -e

APP="MyApp"

# Helper function
capture_and_click() {
  local element_query="$1"
  peekaboo app switch --to "$APP"
  local snapshot=$(peekaboo see --app "$APP" --json | jq -r '.data.snapshot_id')
  peekaboo click --snapshot "$snapshot" "$element_query"
}

# Test sequence
echo "Step 1: Open settings"
capture_and_click "Settings"

echo "Step 2: Navigate to preferences"
capture_and_click "Preferences"

echo "Step 3: Enable feature"
capture_and_click "Enable Feature"

echo "Step 4: Save and close"
capture_and_click "Save"

echo "Test complete!"
```

## Screenshot Comparison Strategies

### Save reference screenshots
```bash
umask 077
REFERENCE_IMAGE=$(mktemp "${TMPDIR:-/tmp}/peekaboo-reference.XXXXXX.png")
CURRENT_IMAGE=$(mktemp "${TMPDIR:-/tmp}/peekaboo-current.XXXXXX.png")
DIFF_IMAGE=$(mktemp "${TMPDIR:-/tmp}/peekaboo-diff.XXXXXX.png")
trap 'rm -f "$REFERENCE_IMAGE" "$CURRENT_IMAGE" "$DIFF_IMAGE"' EXIT

# Capture reference image
peekaboo image --app "MyApp" --path "$REFERENCE_IMAGE"

# Later, capture current state
peekaboo image --app "MyApp" --path "$CURRENT_IMAGE"

# Compare using ImageMagick (if installed)
compare -metric AE "$REFERENCE_IMAGE" "$CURRENT_IMAGE" "$DIFF_IMAGE" 2>&1
```

### Annotated screenshots for debugging
```bash
umask 077
ANNOTATED_IMAGE=$(mktemp "${TMPDIR:-/tmp}/peekaboo-annotated.XXXXXX.png")
trap 'rm -f "$ANNOTATED_IMAGE"' EXIT

# Capture with element annotations
peekaboo see --app "MyApp" --annotate --path "$ANNOTATED_IMAGE"
```

## Waiting for UI Changes

When UI needs time to update:

```bash
# Wait for element to appear (check in loop)
wait_for_element() {
  local app="$1"
  local query="$2"
  local max_attempts=10
  local attempt=0

  while [ $attempt -lt $max_attempts ]; do
    local found=$(peekaboo see --app "$app" --json | \
      jq "[.data.ui_elements[] | select(.label | test(\"$query\"; \"i\"))] | length")

    if [ "$found" -gt 0 ]; then
      echo "Element '$query' found"
      return 0
    fi

    echo "Waiting for '$query'... (attempt $((attempt+1)))"
    sleep 0.5
    attempt=$((attempt+1))
  done

  echo "Element '$query' not found after $max_attempts attempts"
  return 1
}

# Usage
wait_for_element "MyApp" "Loading Complete"
```

## Testing Form Inputs

```bash
# Fill a form using Tab navigation
peekaboo app switch --to "MyApp"
SNAPSHOT=$(peekaboo see --app "MyApp" --json | jq -r '.data.snapshot_id')

# Click first field
peekaboo click --snapshot "$SNAPSHOT" "Username"

# Type and tab through fields
peekaboo type "john.doe" --tab 1
peekaboo type "password123" --tab 1
peekaboo type "john@example.com" --return
```

## Verifying Specific UI Properties

```bash
# Check window title
TITLE=$(peekaboo see --app "MyApp" --json | jq -r '.data.window_title')
[ "$TITLE" = "Expected Title" ] && echo "Title correct" || echo "Title mismatch"

# Check element is enabled (not disabled)
ENABLED=$(peekaboo see --app "MyApp" --json | \
  jq '.data.ui_elements[] | select(.label == "Submit") | .enabled // true')
```
