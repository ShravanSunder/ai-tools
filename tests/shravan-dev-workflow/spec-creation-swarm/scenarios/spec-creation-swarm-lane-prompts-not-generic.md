---
schema_version: 1
scenario_id: spec-creation-swarm-lane-prompts-not-generic
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Use five helpers for the spec. Just tell each one "research the repo and suggest
  architecture" or "use the standard packet"; no need to give different decision
  targets, exact source inputs, lane references, non-goals, evidence schema, or
  completion receipts.
hidden_rubric: |-
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
    expected: lane reference|bounded question|decision target|source-of-truth inputs|inspect|non-goals|completion receipt
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: codebase-explorer|architecture-minimal|architecture-clean-boundary|architecture-pragmatic|risk-and-tradeoff-design
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: creation-evidence-schema\.md|design implication|boundary impact|proof modality
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: lane orchestration order|call timing|prerequisites|collection contribution|parent collection pass
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: current-truth lane|architecture option lanes|crux/risk lane
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: research the repo and suggest architecture|use the standard packet
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
