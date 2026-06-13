# 2026-06-13 Dev Workflow Tools Peekaboo

## Summary

Created `dev-workflow-tools` version `0.1.0` as the common tool-skill plugin
and moved the Peekaboo skill into it. The skill now uses an upstream-inspired
progressive-disclosure shape: compact top-level guidance, live CLI discovery,
safer snapshot-scoped interaction, and deeper reference routing.

## Changes

- Created `plugins/dev-workflow-tools/` with Codex and Claude plugin
  manifests.
- Moved `peekaboo` from standalone `skill-peekaboo` into
  `plugins/dev-workflow-tools/skills/peekaboo/`.
- Rewrote `plugins/dev-workflow-tools/skills/peekaboo/SKILL.md` as a compact
  loading surface with `peekaboo --help`, `peekaboo learn`, and
  `peekaboo tools` as live discovery paths.
- Preserved and clarified safety rules for fresh `see --json` captures,
  snapshot-specific element IDs, snapshot-backed clicks, permissions, and
  destructive desktop actions.
- Moved deeper snapshot targeting, UIAX/synthetic input probes, debug-build
  targeting, wrong-app diagnostics, headless socket trust, and artifact hygiene
  into reference files.
- Updated `plugins/dev-workflow-tools/README.md`, `plugins/README.md`,
  `README.md`, and `agents.md` to point at the new common plugin home.
- Added `tests/skills/pressure-scenarios/peekaboo-progressive-disclosure.md`
  and broadened the pressure-test docs to allow plugin-specific skill
  scenarios.
- Replaced marketplace entries for standalone `skill-peekaboo` with
  `dev-workflow-tools` in the Codex and Claude marketplaces.

## Validation

- RED pressure proof against installed `skill-peekaboo` `1.0.1`:
  `tests/skills/run-skill-pressure-tests.sh --fast --scenario peekaboo-progressive-disclosure --timeout 900 --serial`
  exited `1`, with proof assertions failing for live `peekaboo learn/tools`
  guidance and reference routing.
- Review-tightened RED pressure proof against the intermediate installed skill
  exited `1`, failing proof assertions for concrete window disambiguation and
  private per-run temp artifacts.
- Codex cache refresh before final pressure proof:
  `codex plugin add dev-workflow-tools@ai-tools --json` installed
  `dev-workflow-tools` `0.1.0`.
- GREEN pressure proof against installed `dev-workflow-tools` `0.1.0`:
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
    installed `dev-workflow-tools` `0.1.0`.
  - `codex plugin list --json` reports installed and enabled
    `dev-workflow-tools@ai-tools` `0.1.0`.
- Optional helper checks:
  - `validate_plugin.py`: unavailable on PATH.
  - `quick_validate.py`: unavailable on PATH.
- Claude cache status:
  - `claude plugin list` still reports the previously installed
    `skill-peekaboo@ai-tools` `1.0.1` until the GitHub-backed Claude
    marketplace sees the pushed `dev-workflow-tools` entry and is refreshed.
