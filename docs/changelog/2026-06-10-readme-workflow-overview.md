# 2026-06-10 README workflow overview

## Scope

- Root `README.md`
- `plugins/shravan-dev-workflow/README.md`

## User-visible changes

- Reframed the root README as a human overview of the marketplace and core
  plugins.
- Downranked `quorum-counsel` from the primary plugin table to an optional
  manual counsel section.
- Added a top-down Shravan Dev Workflow overview under the plugin section.
- Rebuilt the Shravan Dev Workflow README around progressive disclosure:
  mental model, namespace map, workflow flow, phase boundaries, supporting
  skills, external counsel, usage examples, and references.
- Kept `agents.md` as the maintainer/agent instruction surface rather than
  duplicating how-to-edit guidance in the human README.
- Moved Shravan Dev Workflow post-restart smoke and behavioral pass criteria
  into `docs/changelog/references/shravan-dev-workflow-smoke.md`.
- Fixed README Mermaid labels for GitHub rendering and kept operations skills
  outside the sequential phase path.
- Corrected the workflow diagram so handoff nodes are directly reachable from
  their owning phase, not only after review.
- Updated `tests/skills/run-skill-pressure-tests.sh` so full-suite skill
  pressure runs execute multiple scenarios in parallel by default.

## Versioning

No plugin version bump. This is a docs-only repository update and does not
change skill behavior, manifests, commands, hooks, or marketplace metadata.

## Validation

- `git diff --check` passed with no output.
- Stale-name scan over the edited READMEs for old skill names and old Linear
  wording returned no matches.
- Implementation review follow-up accepted and addressed:
  - Mermaid label line breaks use `<br/>`.
  - Root overview no longer shows `ops-*` as a downstream implementation phase.
  - Release smoke/pass criteria have a maintainer reference outside the human
    README.
  - Workflow handoff nodes are directly reachable from their owning phase, not
    only after review.
- Parallel pressure-runner behavior verified with
  `tests/skills/run-skill-pressure-tests.sh --fast --jobs 2 --timeout 300`:
  `Passed: 20`, `Failed: 0`.
