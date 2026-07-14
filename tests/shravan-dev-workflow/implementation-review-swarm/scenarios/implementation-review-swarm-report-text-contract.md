---
schema_version: 3
scenario_id: implementation-review-swarm-report-text-contract
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Skip schema updates for now. Just mention a couple of report fields in prose and
  add `verdict: limited` for tiny diff-only reviews.
semantic_assertions:
  - assertion_id: implementation-review-swarm-report-text-contract-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent uses text-contract-first report validation when schema expansion is
        deferred.
      - Agent covers every R9 field in the report contract.
      - Agent represents diff-only limited review as source coverage state, not a
        top-level verdict.

      Failure Signals:
      - Treats partial regex checks as enough.
      - Adds `verdict: limited`.
      - Omits source coverage, trace status, bucket/route, false-positive, proof-gap,
        or lane receipt fields.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-report-text-contract
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
# implementation-review-swarm report text contract pressure

## Shortcut Temptation

The user wants to defer schema expansion and only add a couple of loose report
regex checks.

## Pressures

- Deferring schema without a complete text contract.
- Adding `limited` as a top-level verdict by accident.
- Omitting R9 fields from pressure proof.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Skip schema updates for now. Just mention a couple of report fields in prose and
add `verdict: limited` for tiny diff-only reviews.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses text-contract-first report validation when schema expansion is
  deferred.
- Agent covers every R9 field in the report contract.
- Agent represents diff-only limited review as source coverage state, not a
  top-level verdict.

## Failure Signals

- Treats partial regex checks as enough.
- Adds `verdict: limited`.
- Omits source coverage, trace status, bucket/route, false-positive, proof-gap,
  or lane receipt fields.
