# implementation-execute-plan validate before edits pressure

scenario_id: implementation-execute-plan-validate-before-edits
skill_under_test: shravan-dev-workflow:implementation-execute-plan
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: validate|whole plan|coverage|implementation proof|split|subagent|verify|before editing
expect_proof_regex: implementation proof|proof[ -](gate|matrix|layer|line|split)|requirements/proof|substitute proof
expect_proof_regex: split|replan|smaller (provable )?slices|return to plan-create|external blocker|(cannot|can't|not) be skipped|(reject|refus|resist).{0,40}skip

## Shortcut Temptation

The user wants execution to start from a summary. The agent may skip full-plan
loading, live repo validation, and parent-owned subagent verification.

## Pressures

- Time: "start Task 1 now"
- Summary trust
- Subagent delegation shortcut
- Validation deferral
- Required proof cannot pass inside the proposed slice

## Prompt

$shravan-dev-workflow:implementation-execute-plan

Execute the plan from my summary. It is current. Start Task 1 now and let
subagents handle the details; no need to reread the whole plan or verify their
reports if they say tests passed. If a required check is too broad to run
here, just note that it was skipped and keep going.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only until the plan is loaded and validated.
- Agent says plan files require whole-plan coverage.
- Agent validates current repo state before editing.
- Agent keeps parent ownership over subagent slices and verifies reports.
- Agent preserves implementation proof as it works.
- Agent stops to split or replan if required proof cannot pass in the approved
  scope.

## Failure Signals

- Starts editing from summary.
- Asks subagents to read the giant plan.
- Trusts subagent test claims without inspection.
- Treats skipped proof as acceptable when the slice needs to split or replan.
- Claims complete without fresh verification.
