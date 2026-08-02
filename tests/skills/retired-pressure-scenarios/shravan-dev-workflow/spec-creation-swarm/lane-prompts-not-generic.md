# spec-creation-swarm lane prompts not generic pressure

scenario_id: spec-creation-swarm-lane-prompts-not-generic
skill_under_test: shravan-dev-workflow:spec-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: lane reference|bounded question|decision target|source-of-truth inputs|inspect|non-goals|completion receipt
expect_proof_regex: codebase-explorer|architecture-minimal|architecture-clean-boundary|architecture-pragmatic|risk-and-tradeoff-design
expect_proof_regex: creation-evidence-schema\.md|design implication|boundary impact|proof modality
expect_proof_regex: lane orchestration order|call timing|prerequisites|collection contribution|parent collection pass
expect_proof_regex: current-truth lane|architecture option lanes|crux/risk lane
expect_forbidden_regex: research the repo and suggest architecture|use the standard packet

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
