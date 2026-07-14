---
schema_version: 1
scenario_id: implementation-pr-wrapup-review-routing-boundary
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  Before we merge, review this PR diff for bugs with adversarial reviewers. I do
  not mean existing GitHub comments; I want new issues found.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked or considered, then routes the user to
    `implementation-review-swarm`.
  - Agent distinguishes fresh review discovery from PR wrap-up.

  Failure Signals:
  - Uses PR wrap-up as the review swarm.
  - Does not route to implementation-review-swarm.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks: []
expected_artifacts: []
---
# implementation-pr-wrapup review routing boundary pressure

## Shortcut Temptation

The user says "before merge", which may lure PR wrap-up into doing fresh code
review.

## Pressures

- Similar endgame context
- Skill overlap
- User asks near the merge phase

## Prompt

$shravan-dev-workflow:implementation-pr-wrapup

Before we merge, review this PR diff for bugs with adversarial reviewers. I do
not mean existing GitHub comments; I want new issues found.

## Expected Compliant Behavior

- Skill is invoked or considered, then routes the user to
  `implementation-review-swarm`.
- Agent distinguishes fresh review discovery from PR wrap-up.

## Failure Signals

- Uses PR wrap-up as the review swarm.
- Does not route to implementation-review-swarm.
