# skills-creation platform artifact scale pressure

scenario_id: skills-creation-platform-artifact-scale
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: platform-mechanics|(codex|claude).{0,60}(metadata|validation|manifest|mechanics)|(metadata|validation|manifest|mechanics).{0,60}(codex|claude)
expect_decision_regex: classification:\s*update|(run note|artifact|state).{0,300}(compact|terse|small|scale|ceremony)
expect_proof_regex: platform.{0,3}mechanics(\.md)?
expect_proof_regex: codex.{0,160}(metadata|validation|marketplace|openai.yaml)
expect_proof_regex: (agents/openai\.yaml|openai\.yaml|allow_implicit_invocation).{0,200}(false|explicit|implicit)
expect_proof_regex: claude.{0,160}(manifest|marketplace|validation|plugin)
expect_proof_regex: (static|structural).{0,80}(validation|proof).{0,120}(behavior|pressure)|behavior.{0,120}(pressure|scenario|proof)
expect_proof_regex: (installed[- ]cache|cache refresh|home).{0,180}(defer|not.{0,40}proof|not.{0,40}routine|not part|explicit|requires explicit|did not claim)
expect_proof_regex: classification:\s*update[\s\S]{0,1200}(shipping status:|proof route:)
expect_proof_regex: all-(run|branch).{0,160}skill.{0,8}md|branch-(only|specific).{0,160}references|skill\.md.{0,120}(mental model|main path).{0,120}references.{0,80}branch depth
expect_forbidden_regex: (?<!not )(?<!never )(?<!n't )(?<!avoid )(?<!skip )refresh.{0,80}(installed-cache|cache).{0,80}(as proof|to prove|proves|counts as proof)
expect_forbidden_regex: full.{0,40}(authoring state (writeup|block)|audit table).{0,80}(always|required every time)

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
Codex and Claude. For Codex, I want this to be explicit-only instead of
auto-invoked by matching the prompt. Show me the workflow and proof path. Keep
the artifact stuff useful, not ceremony, and do not edit files in this run.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats this as `update` for one existing skill.
- Agent names `references/platform-mechanics.md` because Codex/Claude mechanics
  matter.
- Agent separates Codex metadata/validation from Claude manifest/marketplace
  metadata/validation.
- Agent routes Codex explicit-only invocation to `agents/openai.yaml` policy
  such as `allow_implicit_invocation: false`, instead of treating
  client-specific SKILL frontmatter fields as default portable YAML.
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
- Adds `disable-model-invocation` or `user-invocable` as default shared
  `SKILL.md` frontmatter for Codex instead of routing Codex policy through
  `agents/openai.yaml`.
