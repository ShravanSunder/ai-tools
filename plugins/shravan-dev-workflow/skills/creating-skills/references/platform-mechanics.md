# Platform Mechanics

Mission / stance:
Handle Codex/Claude skill mechanics without turning platform scaffolding into
authoring philosophy.

When to use:
- Creating or updating skill folders.
- Updating `agents/openai.yaml`, plugin manifests, marketplace metadata, Claude
  packaging, validation commands, or release/readback status.
- Deciding which static validation proves structure versus which proof proves
  behavior.

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
- Codex plugin availability comes from the source plugin and Codex marketplace
  policy/path metadata. Update that metadata only when availability, path,
  category, or policy changes.

## Claude Mechanics

- Claude skill delivery comes through the plugin source and `.claude-plugin`
  metadata when the owning plugin supports Claude.
- Keep Claude plugin manifest and Claude marketplace versions in sync with the
  source plugin version when user-visible plugin behavior changes.
- Run Claude plugin validation after Claude manifest, marketplace, or shared
  source-skill changes when the owning plugin supports Claude; otherwise record
  the not-run reason.
- Claude validation proves packaging/static shape, not Claude behavior.

## Cross-Platform Rules

- If a skill is shared by Codex and Claude, check both surfaces before shipping:
  source skill files, Codex metadata/validation, Claude manifest/marketplace
  metadata/validation, and changelog/version expectations.
- If a change is Codex-only or Claude-only, say why and avoid mirrored churn.
- Do not use installed-cache refresh as proof for either platform. Refresh only
  when release/readback is explicitly scoped.
- Static validation on either platform is structural proof. Behavior proof comes
  from pressure scenarios, harnesses, or documented proof gaps.

Good signals:
- changed platform surfaces are named
- metadata is regenerated only when stale or required
- Codex and Claude source, metadata, validation, and refresh boundaries are
  separated
- installed-cache refresh is deferred unless release/refresh is scoped
- home-cache paths are not published in shipped docs

Bad signals:
- static validation claimed as behavior proof
- version/marketplace churn without user-visible behavior change
- installed-cache mutation used as routine validation
- Codex-only validation claimed for Claude behavior, or Claude packaging claimed
  for Codex behavior
- home-cache paths leaked into public docs
