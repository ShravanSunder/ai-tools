# 2026-06-13 Peekaboo Progressive Disclosure

## Summary

Updated `skill-peekaboo` to version `1.0.2` with an upstream-inspired
progressive-disclosure skill shape: compact top-level guidance, live CLI
discovery, safer snapshot-scoped interaction, and deeper reference routing.

## Changes

- Rewrote `plugins/skill-peekaboo/skills/peekaboo/SKILL.md` as a compact
  loading surface with `peekaboo --help`, `peekaboo learn`, and
  `peekaboo tools` as live discovery paths.
- Preserved and clarified safety rules for fresh `see --json` captures,
  snapshot-specific element IDs, snapshot-backed clicks, permissions, and
  destructive desktop actions.
- Moved deeper snapshot targeting, UIAX/synthetic input probes, debug-build
  targeting, wrong-app diagnostics, headless socket trust, and artifact hygiene
  into reference files.
- Updated `plugins/skill-peekaboo/README.md` and `plugins/README.md` to avoid
  stale targeting guidance.
- Added `tests/skills/pressure-scenarios/peekaboo-progressive-disclosure.md`
  and broadened the pressure-test docs to allow plugin-specific skill
  scenarios.
- Bumped `skill-peekaboo` manifests and Claude marketplace entry from `1.0.1`
  to `1.0.2`.

## Validation

- RED pressure proof against installed `skill-peekaboo` `1.0.1`:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario peekaboo-progressive-disclosure --timeout 900 --serial`
  exited `1`, with proof assertions failing for live `peekaboo learn/tools`
  guidance and reference routing.
- Codex cache refresh:
  `codex plugin add skill-peekaboo@ai-tools --json` installed
  `skill-peekaboo` `1.0.2`.
- GREEN pressure proof against installed `skill-peekaboo` `1.0.2`:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario peekaboo-progressive-disclosure --timeout 900 --serial`
  passed with `Passed: 1`, `Failed: 0`.
- Static checks:
  - `bash -n tests/skills/run-skill-pressure-tests.sh tests/skills/lib/test-helpers.sh`: passed.
  - `git diff --check`: passed.
  - `python3 -m json.tool` on changed plugin and marketplace JSON files: passed.
  - Static grep verified `peekaboo learn`, `peekaboo tools`, reference router,
    respect-desktop, snapshot, and `windowContext` guidance.
- Plugin checks:
  - `claude plugin validate .`: passed.
  - `codex plugin list --marketplace ai-tools --available --json` reports
    installed `skill-peekaboo` `1.0.2`.
  - `codex plugin list --json` reports installed and enabled
    `skill-peekaboo@ai-tools` `1.0.2`.
- Optional helper checks:
  - `validate_plugin.py`: unavailable on PATH.
  - `quick_validate.py`: unavailable on PATH.
- Claude cache status:
  - `claude plugin list` reports installed `skill-peekaboo@ai-tools`
    `1.0.1`. The local marketplace validates, but Claude's `ai-tools`
    marketplace is GitHub-backed in this environment, so the installed Claude
    cache cannot see unpublished local `1.0.2` changes yet.
