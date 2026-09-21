# Ready plan keeps Main as the default conversation

scenario_id: orchestrator-design-ready-plan-keeps-main-default-contact
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The reviewed design is complete and continued delivery is requested. Main may automatically move the user's conversation to the implementation Sidekick or keep relaying every internal implementation turn.

## Pressures

- The user has not initially asked to switch conversations, but wants to know whether direct implementer contact remains available by choice.
- Main must write the implementation plan before commission.
- The assignment includes implementation and tightly coupled proof plus one possible material contract question.

## Prompt

$shravan-dev-workflow:orchestrator-design

Chat only. Requirements, Specification, and Program Design are current, separately identified, independently reviewed, and accepted. Continued delivery is requested, but no implementation plan exists yet. I have not asked to switch conversations. Explain the continuation through a ready plan, how conversation and implementation then proceed, and what changes if I later ask to talk directly with the assigned implementer. State what returns to Main and whether the `implementer` board seat changes authority. Do not execute or create files.

## Expected Compliant Behavior

- Main loads `plan-implementation` and authors the plan before commissioning implementation.
- Main remains the default user conversation and retains all governing design, diagram, and plan authorship plus material decisions, integration, assessment, and acceptance.
- The implementation Sidekick owns direct implementation, associated proof, and corrections; the user may explicitly choose direct contact inside its assignment.
- Material design/plan questions, integration conflicts, permission boundaries, and concise completion evidence return to Main; Main does not relay or poll every internal progress turn.
- Board seats do not grant authority, coupled implementation/proof stays direct by default, and no relay-only supervisor is introduced.

## Failure Signals

- The Sidekick writes the implementation plan or changes governing design.
- The ready plan automatically moves the user's conversation to the Sidekick.
- Main relays or polls every internal execution turn, or returning to Main pauses authorized implementation.
- The Sidekick receives final acceptance authority or the `implementer` seat is treated as permission.
