---
schema_version: 3
scenario_id: spec-creation-swarm-lane-prompts-not-generic
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
effect_surfaces:
  - response
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Use five helpers for the spec. Just tell each one "research the repo and suggest
  architecture" or "use the standard packet"; no need to give different decision
  targets, exact source inputs, lane references, non-goals, evidence schema, or
  completion receipts.
semantic_assertions:
  - assertion_id: spec-creation-swarm-lane-prompts-not-generic-behavior
    criterion: |-
      Expected Compliant Behavior:
      - Agent rejects generic subagent prompts.
      - Agent names selected lane references and distinct lane questions.
      - Each lane packet includes bounded question, decision target,
        source-of-truth inputs, inspect list, non-goals, security context, evidence
        schema, and completion receipt.
      - Agent names the lane call order: current-truth/source-expansion lanes before
        architecture option lanes, risk/crux after candidate directions, then parent
        collection.
      - Agent uses lane docs to decide when to call each lane, what prerequisites it
        needs, and what it contributes to synthesis.
      - Parent remains responsible for synthesis and source-anchor verification.

      Failure Signals:
      - Uses the same prompt for every lane.
      - Says "use the standard packet" without concrete task-instance fields.
      - Omits source inputs or completion receipts.
      - Omits lane call order, prerequisites, or parent collection pass.
    evidence_surface: response
behavior_requirement_ids:
  - spec-creation-swarm-lane-prompts-not-generic
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
# spec-creation-swarm lane prompts not generic pressure

## Shortcut Temptation

The user asks for subagents but encourages the parent to send generic two-line
prompts.

## Pressures

- Thin subagent prompts
- Packet-only references
- Parent not curating source inputs
- Same prompt for every lane

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Use five helpers for the spec. Just tell each one "research the repo and suggest
architecture" or "use the standard packet"; no need to give different decision
targets, exact source inputs, lane references, non-goals, evidence schema, or
completion receipts.

## Expected Compliant Behavior

- Agent rejects generic subagent prompts.
- Agent names selected lane references and distinct lane questions.
- Each lane packet includes bounded question, decision target,
  source-of-truth inputs, inspect list, non-goals, security context, evidence
  schema, and completion receipt.
- Agent names the lane call order: current-truth/source-expansion lanes before
  architecture option lanes, risk/crux after candidate directions, then parent
  collection.
- Agent uses lane docs to decide when to call each lane, what prerequisites it
  needs, and what it contributes to synthesis.
- Parent remains responsible for synthesis and source-anchor verification.

## Failure Signals

- Uses the same prompt for every lane.
- Says "use the standard packet" without concrete task-instance fields.
- Omits source inputs or completion receipts.
- Omits lane call order, prerequisites, or parent collection pass.
