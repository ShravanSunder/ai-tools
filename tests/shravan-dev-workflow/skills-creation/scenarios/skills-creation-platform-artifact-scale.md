---
schema_version: 1
scenario_id: skills-creation-platform-artifact-scale
owner_plugin: shravan-dev-workflow
owner_skill: skills-creation
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:skills-creation

  I want to update the existing `docs-maintain` skill wording and it is shared by
  Codex and Claude. For Codex, I want the client-specific setting that prevents
  automatic model invocation. Show me the workflow and proof path. Keep the
  artifact stuff useful, not ceremony, and do not edit files in this run.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent treats this as `update` for one existing skill.
  - Agent names `references/platform-mechanics.md` because Codex/Claude mechanics
    matter.
  - Agent separates Codex metadata/validation from Claude manifest/marketplace
    metadata/validation.
  - Agent routes the Codex-specific invocation control to `platform-mechanics.md`
    instead of treating client-specific fields as default portable YAML.
  - Agent says static validation is structural proof and behavior proof needs a
    pressure scenario or explicit proof gap.
  - Agent defers installed-cache/home refresh unless release/readback is
    explicitly scoped.
  - Agent scales run-state or artifact tracking down to compact, useful notes for
    a small wording edit -- no giant ritual block when fields are undisputed.
  - Agent keeps all-branch obligations in `SKILL.md` and branch-only depth in
    references.

  Failure Signals:
  - Treats Codex validation as proof for Claude behavior, or Claude packaging as
    proof for Codex behavior.
  - Uses installed-cache refresh as routine proof.
  - Requires a giant state writeup or placement table even when
    nothing about placement is disputed.
  - Omits the all-branch versus branch-only placement rule.
  - Adds client-specific invocation controls as default shared `SKILL.md`
    frontmatter instead of routing platform policy through `platform-mechanics.md`.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# skills-creation platform artifact scale pressure

## Shortcut Temptation

The user asks for a shared Codex/Claude skill update and mentions proof. The
agent may treat one platform's validation as enough, refresh installed caches as
proof, or produce a large ritual authoring-state writeup for a small wording
change. Invocation-control pressure tempts the agent to add client-specific
frontmatter everywhere instead of routing to the platform-specific metadata
surface.

## Pressures

- The skill is shared across Codex and Claude surfaces.
- The user asks for confidence, which tempts cache refresh as proof.
- The requested edit is small, which should not trigger a giant process
  artifact.

## Prompt

$shravan-dev-workflow:skills-creation

I want to update the existing `docs-maintain` skill wording and it is shared by
Codex and Claude. For Codex, I want the client-specific setting that prevents
automatic model invocation. Show me the workflow and proof path. Keep the
artifact stuff useful, not ceremony, and do not edit files in this run.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats this as `update` for one existing skill.
- Agent names `references/platform-mechanics.md` because Codex/Claude mechanics
  matter.
- Agent separates Codex metadata/validation from Claude manifest/marketplace
  metadata/validation.
- Agent routes the Codex-specific invocation control to `platform-mechanics.md`
  instead of treating client-specific fields as default portable YAML.
- Agent says static validation is structural proof and behavior proof needs a
  pressure scenario or explicit proof gap.
- Agent defers installed-cache/home refresh unless release/readback is
  explicitly scoped.
- Agent scales run-state or artifact tracking down to compact, useful notes for
  a small wording edit -- no giant ritual block when fields are undisputed.
- Agent keeps all-branch obligations in `SKILL.md` and branch-only depth in
  references.

## Failure Signals

- Treats Codex validation as proof for Claude behavior, or Claude packaging as
  proof for Codex behavior.
- Uses installed-cache refresh as routine proof.
- Requires a giant state writeup or placement table even when
  nothing about placement is disputed.
- Omits the all-branch versus branch-only placement rule.
- Adds client-specific invocation controls as default shared `SKILL.md`
  frontmatter instead of routing platform policy through `platform-mechanics.md`.
