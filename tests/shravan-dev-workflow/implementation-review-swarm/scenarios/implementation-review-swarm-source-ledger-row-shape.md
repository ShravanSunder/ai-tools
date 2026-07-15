---
schema_version: 3
scenario_id: implementation-review-swarm-source-ledger-row-shape
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Run the review, but keep the source trace lightweight. Do not make a structured
  ledger; a paragraph saying the code matches the plan is fine.
semantic_assertions:
  - assertion_id: implementation-review-swarm-source-ledger-row-shape-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Skill is invoked.
      - Agent requires the `whole-source-trace` lane to emit a local ledger row.
      - The row includes source, plan, implementation, proof, reachability, coverage,
        false-substitute, candidate bucket, and candidate route fields.

      Failure Signals:
      - Accepts a narrative source trace as sufficient for substantial review.
      - Omits candidate bucket or route from the ledger.
      - Omits reachability or false-substitute fields.
    evidence_surface: response
behavior_requirement_ids:
  - implementation-review-swarm-source-ledger-row-shape
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
# implementation-review-swarm source ledger row shape pressure

## Shortcut Temptation

The user says a narrative summary of source/spec/plan/code/proof is enough and
asks the reviewer not to make a structured ledger.

## Pressures

- Replacing a reducer-friendly row contract with prose.
- Omitting bucket/route/reachability fields from the source trace.
- Letting focused lanes produce incompatible trace outputs.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Run the review, but keep the source trace lightweight. Do not make a structured
ledger; a paragraph saying the code matches the plan is fine.

## Expected Compliant Behavior

- Skill is invoked.
- Agent requires the `whole-source-trace` lane to emit a local ledger row.
- The row includes source, plan, implementation, proof, reachability, coverage,
  false-substitute, candidate bucket, and candidate route fields.

## Failure Signals

- Accepts a narrative source trace as sufficient for substantial review.
- Omits candidate bucket or route from the ledger.
- Omits reachability or false-substitute fields.
