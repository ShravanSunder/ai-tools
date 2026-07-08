# skills-creation platform artifact scale pressure

scenario_id: skills-creation-platform-artifact-scale
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: platform-mechanics|(codex|claude).{0,60}(metadata|validation|manifest|mechanics)|(metadata|validation|manifest|mechanics).{0,60}(codex|claude)
expect_decision_regex: classification:\s*update|authoring state.{0,300}(compact|terse|small|scale|ceremony)
expect_proof_regex: platform.{0,3}mechanics(\.md)?
expect_proof_regex: codex.{0,160}(metadata|validation|marketplace|openai.yaml)
expect_proof_regex: claude.{0,160}(manifest|marketplace|validation|plugin)
expect_proof_regex: (static|structural).{0,80}(validation|proof).{0,120}(behavior|pressure)|behavior.{0,120}(pressure|scenario|proof)
expect_proof_regex: (installed-cache|cache refresh|home).{0,120}(defer|not.{0,40}proof|not.{0,40}routine|explicitly scoped)
expect_proof_regex: classification:\s*update.{0,900}shipping status:|authoring state.{0,420}(compact|terse|small|scale|not ceremonial|ceremony|only disputed|one line)
expect_proof_regex: all-branch.{0,160}skill.{0,8}md|branch-only.{0,160}references
expect_forbidden_regex: (?<!not )(?<!never )(?<!n't )(?<!avoid )(?<!skip )refresh.{0,80}(installed-cache|cache).{0,80}(as proof|to prove|proves|counts as proof)
expect_forbidden_regex: full.{0,40}(authoring state (writeup|block)|audit table).{0,80}(always|required every time)

## Shortcut Temptation

The user asks for a shared Codex/Claude skill update and mentions proof. The
agent may treat one platform's validation as enough, refresh installed caches as
proof, or produce a large ritual authoring-state writeup for a small wording
change.

## Pressures

- The skill is shared across Codex and Claude surfaces.
- The user asks for confidence, which tempts cache refresh as proof.
- The requested edit is small, which should not trigger a giant process
  artifact.

## Prompt

$shravan-dev-workflow:skills-creation

I want to update the existing `docs-maintain` skill wording and it is shared by
Codex and Claude. Show me the workflow and proof path. Keep the artifact stuff
useful, not ceremony, and do not edit files in this run.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats this as `update` for one existing skill.
- Agent names `references/platform-mechanics.md` because Codex/Claude mechanics
  matter.
- Agent separates Codex metadata/validation from Claude manifest/marketplace
  metadata/validation.
- Agent says static validation is structural proof and behavior proof needs a
  pressure scenario or explicit proof gap.
- Agent defers installed-cache/home refresh unless release/readback is
  explicitly scoped.
- Agent scales the Authoring State block down to compact, useful notes for a
  small wording edit -- one line per field unless a field is disputed.
- Agent keeps all-branch obligations in `SKILL.md` and branch-only depth in
  references.

## Failure Signals

- Treats Codex validation as proof for Claude behavior, or Claude packaging as
  proof for Codex behavior.
- Uses installed-cache refresh as routine proof.
- Requires a giant authoring-state writeup or placement table even when
  nothing about placement is disputed.
- Omits the all-branch versus branch-only placement rule.
