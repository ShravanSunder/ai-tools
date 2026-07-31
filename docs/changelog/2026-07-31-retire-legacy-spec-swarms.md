# 2026-07-31 Retire Legacy Spec Swarms

Plugin: `shravan-dev-workflow` 1.7.1

## User-visible behavior

- Removes `spec-creation-swarm` and `spec-review-swarm` from runtime skill discovery.
- Preserves both complete source trees under `plugins/shravan-dev-workflow/retired-skills/` with `SKILL.retired.md` entrypoints so their prior teaching, lane contracts, metadata, and provenance remain inspectable without loading as active skills.
- Keeps active specification and program-design routing on `spec-design`, `program-design`, and `spec-program-review`.
- Moves the retired skills' pressure scenarios out of the active runner while preserving them under `tests/skills/retired-pressure-scenarios/`.
- Ignores `*.mindle.json` repository-wide and keeps local Mindle files outside source control.

## Changed surfaces

- Retired skill trees and pressure-scenario placement.
- Active skill frontmatter boundaries, `docs-maintain`, plugin READMEs, `AGENTS.md`, trigger evaluations, release smoke guidance, and active cross-workflow pressure scenarios.
- Codex and Claude plugin metadata for `shravan-dev-workflow` 1.7.1 and marketplace descriptions.
- No command, hook, script, or product-code behavior changed.

## Validation status

- Both retired source trees byte-match their `origin/master` predecessors; only the `SKILL.md` entrypoint filenames changed to `SKILL.retired.md`.
- All 25 active skill directories passed the Codex skill quick validator with PyYAML supplied through `uv`.
- All four JSON manifests parsed, all 22 active OpenAI YAML metadata files parsed, and `claude plugin validate .` passed.
- The pressure-harness unit suite passed: 7 test files and 33 tests. TypeScript validation passed with the repository-pinned pnpm 11.8.0.
- Active routing scans found the retired names only in explicit retirement/provenance notes; no runtime `SKILL.md` entrypoint or active pressure scenario targets them.
- `git ls-files '*mindle.json'` returned no tracked files, and the local Mindle file is matched by the root ignore rule.
- Pressure tests and behavioral smoke remain deferred by user direction; this entry does not claim behavioral proof.
- Fresh implementation review covered all 72 staged files and returned no accepted findings; the static/source ship decision is a PR-ready candidate.

## Refresh / reinstall

- Source metadata targets `1.7.1`.
- Codex marketplace readback still reports the installed plugin at `1.7.0`.
- No Codex or Claude refresh/reinstall was performed for this source update.
