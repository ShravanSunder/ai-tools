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

## Versioning

No plugin version bump. This is a docs-only repository update and does not
change skill behavior, manifests, commands, hooks, or marketplace metadata.

## Validation

- `git diff --check`
- Stale-name scan over the edited READMEs for old skill names and old Linear
  wording.
