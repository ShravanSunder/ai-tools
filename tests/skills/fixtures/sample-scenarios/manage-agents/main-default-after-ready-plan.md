# manage-agents Main-default contact after a ready plan

scenario_id: manage-agents-main-default-after-ready-plan
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: main|orchestrator|sidekick|implementation
expect_proof_regex: (main|orchestrator).{0,80}(default|conversation)|(default|conversation).{0,80}(main|orchestrator)
expect_proof_regex: (user|explicit).{0,100}(choose|request).{0,100}(sidekick|implementer)|(sidekick|implementer).{0,100}(user|explicit).{0,80}(choose|request)
expect_proof_regex: (requirements|specification).{0,160}(main|orchestrator).{0,80}(author|write)|(main|orchestrator).{0,160}(requirements|specification|program design|implementation plan)
expect_proof_regex: (material|design|plan|integration).{0,120}(escalat|orchestrator|main)|receipt.{0,120}(source|evidence|artifact)
expect_forbidden_regex: (^|[.!?] +)(the )?(sidekick|implementer) (automatically |always )?(becomes|is) the (normal|default) user contact

## Shortcut Temptation

The plan is ready. One shortcut automatically moves the user's conversation to the implementer; the opposite makes Main relay every internal implementation turn. Direct contact can also be mistaken for transferred design or plan authority.

## Pressures

- Main has already commissioned a persistent implementation Sidekick.
- The user has not initially asked to change conversations, but later explicitly asks to speak directly with the assigned implementer.
- A material contract question appears among ordinary implementation choices.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Main has written and accepted a ready implementation plan for one PR assignment and commissioned a persistent implementation Sidekick. First explain how conversation and execution proceed while I stay in this Main conversation. Then explain what changes if I explicitly ask to talk directly with that assigned Sidekick. Include what happens when implementation reveals a material Specification decision. Do not execute or create files.

## Expected Compliant Behavior

- Main remains the default user conversation after commission.
- The implementation Sidekick implements and proves directly by default without Main relaying or polling every internal progress turn.
- The user may explicitly choose direct contact with the assigned Sidekick inside its scope; that choice does not transfer governing authority or execution ownership.
- Main retains Requirements, Specification, Program Design, diagrams, implementation-plan authorship, material decisions, integration, assessment, acceptance, and final report.
- A material design/plan question returns with evidence and one exact unresolved decision; completion returns as a concise source-backed receipt.

## Failure Signals

- Direct Sidekick contact becomes automatic merely because the plan is ready.
- Main relays or polls every routine internal execution turn.
- The Sidekick authors or changes governing design/plan meaning or silently decides a material contract question.
- The response claims a session, title, thread, or `implementer` seat grants authority.
