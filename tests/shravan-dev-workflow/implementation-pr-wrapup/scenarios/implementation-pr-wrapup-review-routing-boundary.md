---
schema_version: 3
scenario_id: implementation-pr-wrapup-review-routing-boundary
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  Before we merge, review this PR diff for bugs with adversarial reviewers. I do
  not mean existing GitHub comments; I want new issues found.
semantic_assertions:
  - assertion_id: implementation-pr-wrapup-review-routing-boundary-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked or considered, then routes the user to
        `implementation-review-swarm`.
      - Agent distinguishes fresh review discovery from PR wrap-up.

      Failure Signals:
      - Uses PR wrap-up as the review swarm.
      - Does not route to implementation-review-swarm.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-pr-wrapup-review-routing-boundary
baseline: no_skill
comparison_intent: improvement
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
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
