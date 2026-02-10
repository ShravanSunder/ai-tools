# Skill: Peekaboo

Visual UI testing skill for macOS apps using [Peekaboo CLI](https://github.com/nickthedude/peekaboo). An alternative to Playwright for native macOS app automation via the Accessibility API.

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
- Correct targeting patterns (window-based, not app-based)

## When to Use

- Testing native macOS app UIs
- Verifying visual elements in debug builds
- Automating macOS app interactions
- Replacing Playwright for native macOS testing (Playwright only works with web content)

## Key Concepts

Peekaboo uses a **window-based targeting pattern**:

```bash
# 1. Focus the app window
peekaboo window --focus "Window Title"

# 2. Capture current state
peekaboo see

# 3. Interact using element IDs from capture
peekaboo click --on elem_5
```

See [`skills/peekaboo/SKILL.md`](skills/peekaboo/SKILL.md) for the full skill documentation with targeting patterns, headless mode, and troubleshooting.

## Directory Structure

```
skill-peekaboo/
├── .claude-plugin/plugin.json
└── skills/
    └── peekaboo/
        ├── SKILL.md                           # Full skill documentation
        └── references/
            ├── headless-automation.md          # CI/CD headless mode
            ├── troubleshooting.md              # Common issues
            └── visual-testing-patterns.md      # Testing patterns
```
