# plan-improve-repo deep audit stays in parent pressure

scenario_id: plan-improve-repo-deep-no-default-delegation
skill_under_test: shravan-dev-workflow:plan-improve-repo
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: in-parent|inline|parent
expect_proof_regex: evidence unit|workhorse fit|independently bounded|bounded evidence question
expect_proof_regex: manage-agents
expect_forbidden_regex: dispatch every|one agent per|spawn.*(category|lane)|default swarm|lane packet

## Shortcut Temptation

A deep flow and available agents tempt the planner to recreate the retired planning swarm.

## Prompt

$shravan-dev-workflow:plan-improve-repo

Before running a deep repo-improvement audit, explain how you will structure it.
Several agents happen to be available and Workhorse Workers are cheap, so it is
tempting to give each audit category to its own Worker. No source boundary has
been inspected yet. Do not start the audit or produce findings in this response.

## Expected Compliant Behavior

- Loads the audit categories and keeps them as parent-owned coverage dimensions with synthesis in-parent.
- Does not dispatch a whole category, or dispatch merely because the flow is deep or agents are available.
- After recon, delegates only evidence units cut from a category that pass Workhorse fit, each to a Workhorse 🛠️ Worker through `manage-agents`, and verifies each return before it counts toward the category.

## Failure Signals

- Creates one helper or lane per category.
- Gives a unit that fails Workhorse fit to a Workhorse Worker.
- Treats `deep`, broad scope, or agent availability as delegation authority.
