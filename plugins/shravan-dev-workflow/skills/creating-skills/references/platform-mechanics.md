# Platform Mechanics

Load trigger: creating or updating skill folders, `agents/openai.yaml`, plugin
manifests, marketplace metadata, Claude packaging, validation commands, or
release/readback status.

Carry in: target platform, owning plugin, changed files, desired UI metadata,
version state, validation commands, and release scope.

## Codex Mechanics

- Skill folder: `plugins/<plugin>/skills/<skill-name>/`.
- Required file: `SKILL.md` with `name` and `description`.
- Recommended UI metadata: `agents/openai.yaml`.
- Optional resources: `references/`, `scripts/`, `assets/`.
- Use `skill-creator` scripts for scaffolding or validation when they fit the
  repo workflow.
- Run the Codex `skill-creator` quick validator for the target skill with
  PyYAML available. Resolve the validator path from the active Codex skill
  installation or local development environment; do not publish home-cache paths
  in shipped skill docs.

## Claude / Plugin Mechanics

- Keep Claude plugin manifest version in sync with source plugin version when
  user-visible plugin behavior changes.
- Update the Claude marketplace entry version when the Claude plugin manifest
  version changes.
- Do not edit the Codex marketplace for version sync when it has no version
  field. Touch it only for actual marketplace source/path/policy/category
  changes.
- Claude plugin validation proves packaging/static shape, not Claude behavior.

## Return Artifact

```text
platform surfaces changed:
metadata generated or updated:
version decision:
validation commands:
Codex behavior proof status:
Codex static/plugin validation status:
Claude static/plugin validation status:
Claude behavior proof status:
installed-cache refresh status:
```

Completion criterion: platform changes are validated with the correct tool, and
deferred release/readback proof is explicit instead of silently skipped.

Source material adapted: Codex `skill-creator` anatomy and validation mechanics,
Claude plugin packaging expectations, and repo marketplace rules. Rejected:
platform mechanics in the main authoring philosophy. This branch does not
duplicate all-branch workflow state from `SKILL.md`.
