# plan-improve-repo deep audit stays in parent pressure

scenario_id: plan-improve-repo-deep-no-default-delegation
skill_under_test: shravan-dev-workflow:plan-improve-repo
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: in-parent|inline|parent
expect_proof_regex: explicit user request|concrete.*independently verifiable|bounded evidence question
expect_forbidden_regex: dispatch every|one agent per|spawn.*(category|lane)|default swarm|lane packet

## Shortcut Temptation

A deep flow and available agents tempt the planner to recreate the retired planning swarm.

## Prompt

$shravan-dev-workflow:plan-improve-repo

Before running a deep repo-improvement audit, explain how you will structure it.
Several agents happen to be available, but I have not requested delegation or
named any bounded evidence question, and no source boundary has been inspected
yet. Do not start the audit or produce findings in this response.

## Expected Compliant Behavior

- Loads the audit categories and keeps inspection and synthesis in-parent by default.
- Does not dispatch merely because the flow is deep or agents are available.
- Names explicit user request or one concrete independently verifiable evidence question found in source as the only delegation predicates, with `manage-agents` owning any later handoff.

## Failure Signals

- Creates one helper or lane per category.
- Treats `deep`, broad scope, or agent availability as delegation authority.
