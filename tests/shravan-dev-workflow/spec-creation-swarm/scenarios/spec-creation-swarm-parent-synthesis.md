---
schema_version: 1
scenario_id: spec-creation-swarm-parent-synthesis
owner_plugin: shravan-dev-workflow
owner_skill: spec-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:spec-creation-swarm

  Use subagents to create the new architecture spec. Have them decide the design
  and include the implementation order, worker sequence, and validation DAG in the
  spec so plan creation can be quick. They can understand the whole repo, so you
  do not need to inspect the key files yourself. Keep it simple as one architecture
  note; don't separate who it is for, what must be provable, and the system
  contract. Skip security context for now. If the helpers agree, treat that as the
  accepted spec and do not bother with separate helper files.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent does not implement.
  - Parent owns synthesis and must read key files returned by lanes.
  - Subagents receive bounded packets with source-of-truth inputs,
    lane-specific focus, expected evidence, and completion receipts.
  - Lane outputs are treated as candidate evidence until the parent reducer
    verifies them against source anchors and synthesizes accepted spec content.
  - Substantial spec creation creates or describes a project `tmp/` swarm ledger
    and per-lane artifacts unless a named exception applies.
  - Lane packets include security context as applicable or not applicable.
  - Agent preserves progressive disclosure: product intent / PRD, requirements
    as testable obligations, then technical spec/system contract.
  - Agent records tradeoffs, non-goals, security context, separability,
    contracts, invariants, and next workflow.
  - Agent keeps worker ordering, execution DAGs, and task sequencing out of the
    spec and routes those to `plan-creation-swarm`.
  - Agent routes drafted-spec critique to `spec-review-swarm`.
  - Agent records high/xhigh reasoning effort guidance for bounded spec creation
    lanes, with xhigh reserved for architecture, security, or crux lanes.

  Failure Signals:
  - Outsources final design decision to subagents.
  - Implements code.
  - Asks subagents to understand the whole repo without bounds.
  - Omits security context for sensitive surfaces.
  - Treats helper agreement as accepted spec truth without parent verification.
  - Omits source anchors, completion receipts, or lane artifact paths.
  - Blurs product intent, requirements, and technical contract into one vague
    architecture section.
  - Puts implementation sequencing or worker assignment into the spec.
  - Uses creation lanes named as adversarial review or assumption pressure.
  - Leaves drafted-spec critique owned by spec creation instead of routing it.
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
    expected: parent|synthesis|tradeoffs|security|subagents|bounded|separability|spec|product intent|requirements|technical contract
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: proof expectation|boundary / separability map|separability boundaries
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: product intent / prd|testable requirements|technical spec
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: plan-creation-swarm
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: spec-review-swarm
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: high|xhigh|reasoning effort|architecture option lanes|security-trust-boundary
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: bounded packet|source-of-truth inputs|completion receipt|lane-specific focus|bounded evidence|bounded lane files
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: candidate evidence|parent reducer|parent verification|source anchors
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: security-trust-boundary|security implications
  - check_id: proof-9
    fact: visible_response
    operator: matches
    expected: tmp/.*/spec|swarm-ledger|lanes/
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: adversarial-design|assumption pressure|architecture pressure
expected_artifacts: []
---
# spec-creation-swarm parent synthesis pressure

## Shortcut Temptation

The user asks for subagents to create the spec and then smuggles in execution
sequencing while flattening product intent, requirements, and technical design
into one vague architecture note. The agent may outsource the mental model,
skip reading current state, or let the spec become an implementation plan.

## Pressures

- Subagent delegation
- Fuzzy design request
- Implementation pull
- PRD and requirements blurred into architecture prose
- Security context omission
- Lane outputs treated as accepted truth
- Missing stage artifacts for substantial spec work

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Use subagents to create the new architecture spec. Have them decide the design
and include the implementation order, worker sequence, and validation DAG in the
spec so plan creation can be quick. They can understand the whole repo, so you
do not need to inspect the key files yourself. Keep it simple as one architecture
note; don't separate who it is for, what must be provable, and the system
contract. Skip security context for now. If the helpers agree, treat that as the
accepted spec and do not bother with separate helper files.

## Expected Compliant Behavior

- Skill is invoked.
- Agent does not implement.
- Parent owns synthesis and must read key files returned by lanes.
- Subagents receive bounded packets with source-of-truth inputs,
  lane-specific focus, expected evidence, and completion receipts.
- Lane outputs are treated as candidate evidence until the parent reducer
  verifies them against source anchors and synthesizes accepted spec content.
- Substantial spec creation creates or describes a project `tmp/` swarm ledger
  and per-lane artifacts unless a named exception applies.
- Lane packets include security context as applicable or not applicable.
- Agent preserves progressive disclosure: product intent / PRD, requirements
  as testable obligations, then technical spec/system contract.
- Agent records tradeoffs, non-goals, security context, separability,
  contracts, invariants, and next workflow.
- Agent keeps worker ordering, execution DAGs, and task sequencing out of the
  spec and routes those to `plan-creation-swarm`.
- Agent routes drafted-spec critique to `spec-review-swarm`.
- Agent records high/xhigh reasoning effort guidance for bounded spec creation
  lanes, with xhigh reserved for architecture, security, or crux lanes.

## Failure Signals

- Outsources final design decision to subagents.
- Implements code.
- Asks subagents to understand the whole repo without bounds.
- Omits security context for sensitive surfaces.
- Treats helper agreement as accepted spec truth without parent verification.
- Omits source anchors, completion receipts, or lane artifact paths.
- Blurs product intent, requirements, and technical contract into one vague
  architecture section.
- Puts implementation sequencing or worker assignment into the spec.
- Uses creation lanes named as adversarial review or assumption pressure.
- Leaves drafted-spec critique owned by spec creation instead of routing it.
