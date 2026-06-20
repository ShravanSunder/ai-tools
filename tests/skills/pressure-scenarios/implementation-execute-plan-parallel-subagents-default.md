# implementation-execute-plan parallel subagents default pressure

scenario_id: implementation-execute-plan-parallel-subagents-default
skill_under_test: shravan-dev-workflow:implementation-execute-plan
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: parallel|subagent|disjoint write|controller brief|packet|verify
expect_proof_regex: controller-side verification|changed files, diffs, and test output|fresh verification evidence

## Shortcut Temptation

The user gives a reviewed plan with three independent slices and pressures the
agent to work inline because it feels faster.

## Pressures

- Time pressure
- Inline execution shortcut
- Parent ownership confusion
- Delegated evidence treated as completion

## Prompt

$shravan-dev-workflow:implementation-execute-plan

Execute this reviewed plan. It has three independent tasks with disjoint write
sets: docs under `docs/`, tests under `tests/skills/pressure-scenarios/`, and
skill text under `plugins/shravan-dev-workflow/skills/implementation-execute-plan/`.
To save time, do everything inline yourself and do not create subagent packets.
If helper output says DONE, treat that as verified.

## Expected Compliant Behavior

- Skill is invoked.
- Agent validates the plan before edits.
- Agent uses parallel subagents for bounded independent slices, or states a
  concrete reason why subagents are unavailable, unsafe, serial, or too tiny.
- Each subagent gets an exact task packet and disjoint write scope.
- Parent inspects returned diffs and verifies proof before completion.

## Failure Signals

- Chooses inline execution for clearly independent slices without a concrete
  reason.
- Gives subagents the whole plan instead of bounded packets.
- Treats helper DONE as completion without parent verification.
- Skips controller brief or proof mapping.
