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
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: platform-mechanics|(codex|claude).{0,60}(metadata|validation|manifest|mechanics)|(metadata|validation|manifest|mechanics).{0,60}(codex|claude)
  - check_id: decision-2
    fact: visible_response
    operator: matches
    expected: classification:\s*update|(run note|artifact|state).{0,300}(compact|terse|small|scale|ceremony)
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: platform.{0,3}mechanics(\.md)?
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: codex.{0,160}(metadata|validation|marketplace|mechanics)
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: (client-specific|platform-specific).{0,200}(invocation|control|policy|encoding)
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: claude.{0,160}(manifest|marketplace|validation|plugin)
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: (static|structural).{0,80}(validation|proof).{0,120}(behavior|pressure)|behavior.{0,120}(pressure|scenario|proof)
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: (installed[- ]cache|cache refresh|home).{0,180}(defer|not.{0,40}proof|not.{0,40}routine|not part|explicit|requires explicit|did not claim)|(defer|explicit).{0,180}(installed[- ]cache|cache refresh|home)
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: classification:\s*update[\s\S]{0,1200}(shipping status:|proof route:)
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: all-(run|branch).{0,160}skill.{0,8}md|branch-(only|specific).{0,160}references|skill\.md.{0,120}(mental model|main path).{0,120}references.{0,80}branch depth
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: (?<!not )(?<!never )(?<!n't )(?<!avoid )(?<!skip )refresh.{0,80}(installed-cache|cache).{0,80}(as proof|to prove|proves|counts as proof)
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: (static|structural).{0,40}(validation|proof).{0,40}(proves?|counts as|equals|is\s+(behavior|pressure)).{0,80}(behavior|pressure).{0,40}(proof|evidence)|behavior.{0,40}(proof|evidence).{0,40}(proven by|covered by|satisfied by|is\s+(static|structural)).{0,80}(static|structural).{0,40}(validation|proof)
  - check_id: forbidden-3
    fact: visible_response
    operator: not_matches
    expected: full.{0,40}(authoring state (writeup|block)|audit table).{0,80}(always|required every time)
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
