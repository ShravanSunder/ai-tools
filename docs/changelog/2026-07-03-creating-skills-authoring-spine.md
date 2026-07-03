# Creating Skills Authoring Spine Refinement

- Marketplace plugin: `shravan-dev-workflow`
- New version: `1.6.35`

## User-visible changes

- Refined `creating-skills/SKILL.md` into a compact workflow spine with a
  "what makes a great skill" vocabulary, branch carry/return routing, scaled
  authoring receipt, and scaled placement audit.
- Converted creating-skills references to lane-like guidance and removed
  repeated generic output/input schema wrappers from branch files.
- Kept `references/source-inspirations.md` passive; normal authoring routes no
  longer load it, and pressure scenarios guard against reintroducing it as an
  active branch.
- Strengthened `platform-mechanics.md` so shared skills account for Codex and
  Claude surfaces separately, including static validation, marketplace/manifest
  boundaries, installed-cache refresh deferral, and behavior-proof separation.
- Tightened `great-skill-evaluation.md` with a consistent 40-point scorecard,
  literal unique return labels, and a defined fallback when
  `steering-and-wording.md` has not been loaded.
- Added `creating-skills-platform-artifact-scale` pressure coverage for
  Codex/Claude mechanics and non-ceremonial authoring artifacts.

## Affected files

- `plugins/shravan-dev-workflow/skills/creating-skills/SKILL.md`
- `plugins/shravan-dev-workflow/skills/creating-skills/references/*.md`
- `tests/skills/pressure-scenarios/creating-skills-*.md`
- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `.claude-plugin/marketplace.json`

## Validation

- Codex static validation passed for
  `plugins/shravan-dev-workflow/skills/creating-skills`.
- Focused creating-skills pressure outputs pass current assertions for:
  `creating-skills-workflow-spine`,
  `creating-skills-update-existing-skill`,
  `creating-skills-evaluate-draft`,
  `creating-skills-platform-artifact-scale`, and
  `creating-skills-security-and-cache-boundary`.
- Fresh focused pressure runs passed for the updated
  `creating-skills-security-and-cache-boundary` scenario.
- `git diff --check` passed.
- Full fast pressure suite was attempted and interrupted after unrelated
  failures in debug-investigation, implementation-execute-plan, and
  implementation-pr-wrapup scenarios plus a long quiet stall; those failures
  were not in the changed creating-skills surface.

## Refresh status

- Codex installed-cache refresh: not run; source validation only.
- Claude installed-cache refresh: not run; source validation only.
