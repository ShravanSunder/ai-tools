# Skill: Peekaboo

Visual UI testing skill for macOS apps using [Peekaboo CLI](https://github.com/openclaw/Peekaboo). An alternative to Playwright for native macOS app automation via the Accessibility API.

## Installation

```bash
/plugin marketplace add ShravanSunder/ai-tools
/plugin install skill-peekaboo@ai-tools
```

## What It Does

Teaches Claude how to use Peekaboo for macOS app automation:

- Capture UI state and screenshots
- Click elements, type text, send keyboard shortcuts
- Switch between apps and windows
- Headless mode for CI/CD pipelines
- Live command discovery with `peekaboo --help`, `peekaboo learn`, and `peekaboo tools`
- Snapshot-scoped targeting patterns for safer desktop interaction

## When to Use

- Testing native macOS app UIs
- Verifying visual elements in debug builds
- Automating macOS app interactions
- Replacing Playwright for native macOS testing (Playwright only works with web content)

## Key Concepts

Peekaboo automation should start from current target and UI state, then use the
fresh snapshot for element actions:

```bash
# 1. Bring the intended app/window into view
peekaboo app switch --to "MyApp"
peekaboo list windows --app "MyApp" --json
peekaboo window focus --app "MyApp" --window-title "Window Title"

# 2. Capture current state and snapshot id into a private per-run file
umask 077
UI_JSON=$(mktemp "${TMPDIR:-/tmp}/peekaboo-ui.XXXXXX.json")
peekaboo see --app "MyApp" --window-title "Window Title" --json > "$UI_JSON"
SNAPSHOT=$(jq -r '.data.snapshot_id' "$UI_JSON")

# 3. Interact through the snapshot context
peekaboo click --snapshot "$SNAPSHOT" --on elem_5 --json
```

The top-level skill stays compact and routes deeper material to references for
visual testing patterns, troubleshooting, and headless automation.

See [`skills/peekaboo/SKILL.md`](skills/peekaboo/SKILL.md) for the full skill
documentation.

## Directory Structure

```
skill-peekaboo/
├── .codex-plugin/plugin.json
├── .claude-plugin/plugin.json
└── skills/
    └── peekaboo/
        ├── SKILL.md                           # Full skill documentation
        └── references/
            ├── headless-automation.md          # CI/CD headless mode
            ├── troubleshooting.md              # Common issues
            └── visual-testing-patterns.md      # Testing patterns
```
