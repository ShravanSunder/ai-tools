# Platform Mechanics

Handle Codex and Claude skill mechanics without turning platform scaffolding
into authoring philosophy.

This reference owns platform scaffolding, manifests, marketplace metadata,
validation commands, version/changelog routing, and release/readback status.
Return the platform surfaces touched, required static validation, and shipping
route.

## Codex Mechanics

- Skill folder: `plugins/<plugin>/skills/<skill-name>/`.
- Required file: `SKILL.md` with `name` and `description`.
- Recommended UI metadata: `agents/openai.yaml`.
- Codex invocation policy belongs in `agents/openai.yaml`. Use
  `policy.allow_implicit_invocation: false` only as the Codex encoding for a
  skill that is user-invocable but not automatically model-invocable through
  prompt matching. Do not add `disable-model-invocation` or `user-invocable` to
  shared `SKILL.md` frontmatter for Codex unless the active validator and target
  client explicitly support that field.
- Optional resources: `references/`, `scripts/`, `assets/`.
- Use `skill-creator` scripts for scaffolding or validation when they fit the
  repo workflow.
- Run the Codex `skill-creator` quick validator for the target skill with
  PyYAML available. Resolve the validator path from the active Codex skill
  installation or local development environment; do not publish home-cache
  paths in shipped skill docs.
- Codex plugin availability comes from the source plugin and Codex
  marketplace policy/path metadata. Update that metadata only when
  availability, path, category, or policy changes.

## Claude Mechanics

- Claude skill delivery comes through the plugin source and `.claude-plugin`
  metadata when the owning plugin supports Claude.
- Claude-oriented skill frontmatter may use `disable-model-invocation: true`
  when a skill should not be model-invocable, or `user-invocable: false` when a
  skill should not be user-invocable, if the user requests that behavior or the
  target client contract requires it. These are client-specific encodings of
  the standard invocation capabilities, not default portable frontmatter for
  every shared skill.
- Keep Claude plugin manifest and Claude marketplace versions in sync with
  the source plugin version when user-visible plugin behavior changes.
- Run Claude plugin validation after Claude manifest, marketplace, or shared
  source-skill changes when the owning plugin supports Claude; otherwise
  record the not-run reason.
- Claude validation proves packaging/static shape, not Claude behavior.

## Cross-Platform Rules

- If a skill is shared by Codex and Claude, check both surfaces before
  shipping: source skill files, Codex metadata/validation, Claude
  manifest/marketplace metadata/validation, and changelog/version
  expectations.
- If a change is Codex-only or Claude-only, say why and avoid mirrored
  churn.
- Static validation on either platform is structural proof only.
- Cache/home-mutation deferral rule (owned here): never use installed-cache
  or home-level refresh as proof, on either platform. Refresh only when
  release or readback is explicitly scoped, and report it as its own
  shipping-status value, not as routine validation.
- Keep home-cache paths out of shipped docs; report Codex/Claude validation
  as run, not-run-with-reason, or not-applicable, without leaking local
  cache identifiers.
