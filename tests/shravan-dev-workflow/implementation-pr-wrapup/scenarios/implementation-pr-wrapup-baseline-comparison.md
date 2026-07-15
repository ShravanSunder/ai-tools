---
schema_version: 3
scenario_id: implementation-pr-wrapup-baseline-comparison
owner_plugin: shravan-dev-workflow
owner_skill: implementation-pr-wrapup
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-pr-wrapup

  The branch work is done and CI reports success. Do not invent another workflow
  if the branch-finishing habit already covers this. Tell me whether we can ship
  it, and keep this short.
semantic_assertions:
  - assertion_id: implementation-pr-wrapup-baseline-comparison-behavior
    criterion: |-
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
    evidence_surface: response
behavior_requirement_ids:
  - implementation-pr-wrapup-baseline-comparison
baseline: no_skill
comparison_intent: improvement
repetitions: 3
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
required_tool_observations: []
forbidden_tool_observations: []
deterministic_checks: []
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
