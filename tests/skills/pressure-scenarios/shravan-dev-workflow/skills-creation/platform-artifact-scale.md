# skills-creation platform artifact scale pressure

scenario_id: skills-creation-platform-artifact-scale
skill_under_test: shravan-dev-workflow:skills-creation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: platform-mechanics|(codex|claude).{0,60}(metadata|validation|manifest|mechanics)|(metadata|validation|manifest|mechanics).{0,60}(codex|claude)
expect_proof_regex: codex.{0,200}(explicit|policy\.allow_implicit_invocation|invocation control)|(explicit|policy\.allow_implicit_invocation|invocation control).{0,200}codex
expect_proof_regex: claude.{0,160}(packag|valid)
expect_proof_regex: (static|structural).{0,80}(validation|proof).{0,120}(behavior|pressure)|behavior.{0,120}(pressure|scenario|proof)
expect_proof_regex: cache refresh.{0,100}(separate|never proof|not proof)
expect_forbidden_regex: (?<!not )(?<!never )(?<!n't )(?<!avoid )(?<!skip )refresh.{0,80}(installed-cache|cache).{0,80}(as proof|to prove|proves|counts as proof)
expect_forbidden_regex: (static|structural) validation (proves|equals|is) (runtime |invocation )?behavior
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
Codex and Claude. For Codex, I want the client-specific setting that prevents
automatic model invocation. Show me the workflow and proof path. Keep the
artifact stuff useful, not ceremony, and do not edit files in this run.

## Expected Compliant Behavior

- Skill is invoked.
- Agent treats this as a prospective update for one existing skill, but does
  not begin an update run until the requested wording outcome is concrete.
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
- Agent does not emit a run summary or authoring artifact for this chat-only,
  read-only design pass.

## Failure Signals

- Treats Codex validation as proof for Claude behavior, or Claude packaging as
  proof for Codex behavior.
- Uses installed-cache refresh as routine proof.
- Starts an update run without a concrete wording success definition, or emits
  a giant state writeup for a chat-only design pass.
- Adds client-specific invocation controls as default shared `SKILL.md`
  frontmatter instead of routing platform policy through `platform-mechanics.md`.
