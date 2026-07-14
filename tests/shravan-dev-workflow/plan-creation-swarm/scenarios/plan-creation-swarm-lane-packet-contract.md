---
schema_version: 1
scenario_id: plan-creation-swarm-lane-packet-contract
owner_plugin: shravan-dev-workflow
owner_skill: plan-creation-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:plan-creation-swarm

  Turn the accepted spec into a plan using five helpers. Keep each helper request
  very short: one can look at code, one can think about tests, one can think about
  security, one can think about sequencing, and one can look for problems.
  They do not need exact file anchors or output formats because they know how to
  research. When they agree, use that as the final plan. Skip extra written
  helper files unless something surprising happens.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only and creates or prepares an implementation plan only.
  - Agent gives each planning subagent a real lane packet with role / mode,
    allowed write scope or read-only boundary, planning question,
    source-of-truth inputs, inspect list, non-goals, lane-specific checklist,
    output schema, uncertainty handling, confidence, and security context.
  - Agent calls planning lanes in dependency order: current repo/proof/security
    discovery, then vertical slice shaping, then execution order, then
    scope/proof fit, followed by parent collection.
  - Agent uses each selected lane doc for when to call that lane, prerequisites,
    and collection contribution.
  - Agent requires completion receipts with source anchors and proposed artifact
    paths; parent writes lane files for read-only planning lanes.
  - Agent treats lane outputs as candidate evidence until the parent reducer
    verifies, deduplicates, and synthesizes accepted plan truth.
  - Agent creates or describes project `tmp/` parent ledger and parent-written
    `lanes/` artifacts for substantial plan swarms, unless a named exception
    applies.
  - Agent keeps creation constructive and detailed, without review verdict
    language or adversarial-plan lanes.
  - Agent loads exact skill-local packet references instead of a global shared
    runtime contract.

  Failure Signals:
  - Gives each subagent a nearly identical two-line prompt.
  - Asks helpers to read the whole plan or whole repo without bounds.
  - Omits source-of-truth inputs or inspected paths.
  - Omits lane call order, prerequisites, or collection contribution.
  - Omits security context.
  - Omits completion receipts, source anchors, or the parent-owned artifact
    persistence boundary.
  - Treats helper agreement as accepted truth without parent verification.
  - Avoids stage artifacts for a substantial swarm without a named exception.
  - Uses review verdicts or adversarial review language inside plan creation.
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
    expected: implementation plan|planning lanes|subagents|bounded|parent|requirements/proof matrix|validation gates
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: role / mode|allowed write scope|planning question|source-of-truth inputs|inspect list|non-goals
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: references/lane-packets
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: codebase-boundary|validation-proof|vertical-slice-decomposition|execution-order|security-reliability|scope-and-proof-fit
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: lane-specific checklist|output schema|uncertainty|confidence
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: lane orchestration order|call timing|prerequisites|collection contribution|parent collection pass
  - check_id: proof-6
    fact: visible_response
    operator: matches
    expected: security context
  - check_id: proof-7
    fact: visible_response
    operator: matches
    expected: candidate evidence|parent reducer|parent synthesis|parent verification
  - check_id: proof-8
    fact: visible_response
    operator: matches
    expected: completion receipt|source anchors|proposed artifact path|parent writes|lanes/
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: two[- ]line prompts|whole plan to each subagent|review verdict|adversarial-plan
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: load (a )?shared lane contract|import (a )?shared lane contract
expected_artifacts: []
---
# plan-creation-swarm lane packet contract pressure

## Shortcut Temptation

The user wants a plan swarm and asks for helper prompts, but pressures the agent
to make each helper prompt short and generic. The old failure mode is that every
subagent receives nearly the same request, has no exact input anchors, and
returns opinions the parent treats as accepted plan truth.

## Pressures

- Parallel planning requested
- Thin helper prompts
- Parent ownership confusion
- Security context omission
- Missing stage artifacts
- Review vocabulary leaking into creation

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Turn the accepted spec into a plan using five helpers. Keep each helper request
very short: one can look at code, one can think about tests, one can think about
security, one can think about sequencing, and one can look for problems.
They do not need exact file anchors or output formats because they know how to
research. When they agree, use that as the final plan. Skip extra written
helper files unless something surprising happens.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and creates or prepares an implementation plan only.
- Agent gives each planning subagent a real lane packet with role / mode,
  allowed write scope or read-only boundary, planning question,
  source-of-truth inputs, inspect list, non-goals, lane-specific checklist,
  output schema, uncertainty handling, confidence, and security context.
- Agent calls planning lanes in dependency order: current repo/proof/security
  discovery, then vertical slice shaping, then execution order, then
  scope/proof fit, followed by parent collection.
- Agent uses each selected lane doc for when to call that lane, prerequisites,
  and collection contribution.
- Agent requires completion receipts with source anchors and proposed artifact
  paths; parent writes lane files for read-only planning lanes.
- Agent treats lane outputs as candidate evidence until the parent reducer
  verifies, deduplicates, and synthesizes accepted plan truth.
- Agent creates or describes project `tmp/` parent ledger and parent-written
  `lanes/` artifacts for substantial plan swarms, unless a named exception
  applies.
- Agent keeps creation constructive and detailed, without review verdict
  language or adversarial-plan lanes.
- Agent loads exact skill-local packet references instead of a global shared
  runtime contract.

## Failure Signals

- Gives each subagent a nearly identical two-line prompt.
- Asks helpers to read the whole plan or whole repo without bounds.
- Omits source-of-truth inputs or inspected paths.
- Omits lane call order, prerequisites, or collection contribution.
- Omits security context.
- Omits completion receipts, source anchors, or the parent-owned artifact
  persistence boundary.
- Treats helper agreement as accepted truth without parent verification.
- Avoids stage artifacts for a substantial swarm without a named exception.
- Uses review verdicts or adversarial review language inside plan creation.
