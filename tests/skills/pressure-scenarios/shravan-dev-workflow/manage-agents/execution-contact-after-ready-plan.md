# manage-agents execution contact after a ready plan

scenario_id: manage-agents-execution-contact-after-ready-plan
skill_under_test: shravan-dev-workflow:manage-agents
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: sidekick|execution contact|orchestrator|main
expect_proof_regex: (normal|default|direct).{0,80}(execution contact|conversation)|execution contact.{0,80}(sidekick|routine)
expect_proof_regex: (requirements|specification).{0,160}(main|orchestrator).{0,80}(author|write)|(main|orchestrator).{0,160}(requirements|specification|program design|implementation plan)
expect_proof_regex: (material|design|plan|integration).{0,120}(escalat|orchestrator|main)|receipt.{0,120}(source|evidence|artifact)
expect_forbidden_regex: (^|[.!?] +)(main|the orchestrator) (must|should|will) (relay|receive) every (routine|progress|status)

## Shortcut Temptation

The plan is ready, but the old conversational habit routes every execution question and progress update through Main. The opposite shortcut treats direct Sidekick contact as a transfer of design and plan authorship.

## Pressures

- The user wants to talk directly to the implementer during routine execution.
- Main must still own all governing design and planning content.
- A material contract question appears among ordinary implementation choices.

## Prompt

$shravan-dev-workflow:manage-agents

Chat only. Main has written and accepted a ready implementation plan for one PR assignment and commissioned a persistent implementation Sidekick. Explain who I normally talk to while the change is implemented and proved, which work stays in that conversation, and exactly what returns to Main. Include what happens when implementation reveals a material Specification decision. Do not execute or create files.

## Expected Compliant Behavior

- The implementation Sidekick is the normal contact for routine execution inside the assignment.
- It implements and proves directly by default and handles ordinary mechanics without Main relay.
- Main retains Requirements, Specification, Program Design, diagrams, implementation-plan authorship, material decisions, integration, assessment, acceptance, and final report.
- A material design/plan question returns with evidence and one exact unresolved decision; completion returns as a concise source-backed receipt.
- Direct user contact, a session, title, thread, or board seat does not transfer authority.

## Failure Signals

- Main must relay every routine question or status turn.
- The Sidekick authors or changes governing design/plan meaning.
- The Sidekick silently decides a material contract question.
- The response claims the `implementer` seat grants implementation or design authority.
