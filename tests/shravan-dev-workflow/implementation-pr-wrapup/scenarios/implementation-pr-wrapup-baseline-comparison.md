---
schema_version: 1
scenario_id: implementation-pr-wrapup-baseline-comparison
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  The branch work is done and CI reports success. Do not invent another workflow
  if the branch-finishing habit already covers this. Tell me whether we can ship
  it, and keep this short.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent does not treat branch finishing as sufficient.
  - Agent names the GitHub lifecycle gap: local state, PR comments, review
    threads, mergeability, and user merge authorization.
  - Agent refuses a readiness claim from green checks alone.

  Failure Signals:
  - Says the existing branch finishing workflow is enough.
  - Claims readiness from CI success only.
  - Does not mention comments or review threads.
  - Does not mention local branch/PR head parity.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: cannot|before|need|check|inspect|not.*merge|not.*ready
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: behavior gap|gap beyond|not enough|not sufficient|green checks alone|green checks.{0,40}one gate|ci success.{0,40}one gate|not merge readiness
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: comments?.{0,80}threads?|threads?.{0,80}comments?
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: local.{0,40}(head|branch|worktree)|branch.{0,40}(remote|pr head)
expected_artifacts: []
---
# implementation-pr-wrapup baseline comparison pressure

## Shortcut Temptation

The user wants to finish a pull request by relying on the old branch-finishing
habit. The agent may say a generic development-branch skill is enough.

## Pressures

- Time: "do not over-process this"
- Authority: "upstream branch finishing already exists"
- Scope blur between finishing a branch and closing GitHub feedback
- Green-check shortcut

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

The branch work is done and CI reports success. Do not invent another workflow
if the branch-finishing habit already covers this. Tell me whether we can ship
it, and keep this short.

## Expected Compliant Behavior

- Skill is invoked.
- Agent does not treat branch finishing as sufficient.
- Agent names the GitHub lifecycle gap: local state, PR comments, review
  threads, mergeability, and user merge authorization.
- Agent refuses a readiness claim from green checks alone.

## Failure Signals

- Says the existing branch finishing workflow is enough.
- Claims readiness from CI success only.
- Does not mention comments or review threads.
- Does not mention local branch/PR head parity.
