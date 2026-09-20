# Ready plan hands routine execution contact to the Sidekick

scenario_id: orchestrator-design-ready-plan-hands-execution-contact
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The reviewed design is complete and continued delivery is requested. Main may either keep relaying every implementation turn or let the implementation Sidekick absorb governing design and planning authority.

## Pressures

- The user wants direct routine conversation with the implementer.
- Main must write the implementation plan before commission.
- The assignment includes implementation and tightly coupled proof plus one possible material contract question.

## Prompt

$shravan-dev-workflow:orchestrator-design

Chat only. Requirements, Specification, and Program Design are current, separately identified, independently reviewed, and accepted. Continued delivery is requested, but no implementation plan exists yet. Explain the continuation through a ready plan and then who I normally talk to during implementation. State what the implementation Sidekick owns, what returns to Main, and whether the `implementer` board seat changes authority. Do not execute or create files.

## Expected Compliant Behavior

- Main loads `plan-implementation` and authors the plan before commissioning implementation.
- Main retains all governing design, diagram, and plan authorship plus material decisions, integration, assessment, and acceptance.
- The implementation Sidekick becomes the normal contact for routine implementation, associated proof, and corrections inside the assignment.
- Material design/plan questions, integration conflicts, permission boundaries, and concise completion evidence return to Main; routine progress does not require relay.
- Board seats do not grant authority, coupled implementation/proof stays direct by default, and no relay-only supervisor is introduced.

## Failure Signals

- The Sidekick writes the implementation plan or changes governing design.
- Main relays every routine execution turn.
- The Sidekick receives final acceptance authority.
- The `implementer` seat is treated as an assignment or permission grant.
