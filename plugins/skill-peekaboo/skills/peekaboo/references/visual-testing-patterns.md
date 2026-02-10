# Visual Testing Patterns

Detailed patterns for using Peekaboo in visual testing workflows.

## Before/After State Capture

Capture UI state before and after actions to verify changes:

```bash
# Capture before state
peekaboo app switch --to "MyApp"
peekaboo see --app "MyApp" --json > /tmp/ui_before.json
BEFORE_COUNT=$(jq '.data.element_count' /tmp/ui_before.json)

# Perform action
SNAPSHOT=$(jq -r '.data.snapshot_id' /tmp/ui_before.json)
peekaboo click --snapshot "$SNAPSHOT" --on elem_5

# Capture after state
peekaboo see --app "MyApp" --json > /tmp/ui_after.json
AFTER_COUNT=$(jq '.data.element_count' /tmp/ui_after.json)

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
# Capture reference image
peekaboo image --app "MyApp" --path /tmp/reference.png

# Later, capture current state
peekaboo image --app "MyApp" --path /tmp/current.png

# Compare using ImageMagick (if installed)
compare -metric AE /tmp/reference.png /tmp/current.png /tmp/diff.png 2>&1
```

### Annotated screenshots for debugging
```bash
# Capture with element annotations
peekaboo see --app "MyApp" --annotate --path /tmp/annotated.png
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
