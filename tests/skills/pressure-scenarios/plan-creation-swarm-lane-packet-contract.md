# plan-creation-swarm lane packet contract pressure

scenario_id: plan-creation-swarm-lane-packet-contract
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: implementation plan|planning lanes|subagents|bounded|parent|requirements/proof matrix|validation gates
expect_proof_regex: role / mode|allowed write scope|planning question|source-of-truth inputs|inspect list|non-goals
expect_proof_regex: lane-specific checklist|output schema|uncertainty|confidence
expect_proof_regex: security context
expect_proof_regex: candidate evidence|parent reducer|parent synthesis|parent verification
expect_proof_regex: completion receipt|source anchors|proposed artifact path|parent writes|lanes/
expect_forbidden_regex: two[- ]line prompts|whole plan to each subagent|review verdict|adversarial-plan

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
- Agent requires completion receipts with source anchors and proposed artifact
  paths; parent writes lane files for read-only planning lanes.
- Agent treats lane outputs as candidate evidence until the parent reducer
  verifies, deduplicates, and synthesizes accepted plan truth.
- Agent creates or describes project `tmp/` parent ledger and parent-written
  `lanes/` artifacts for substantial plan swarms, unless a named exception
  applies.
- Agent keeps creation constructive and detailed, without review verdict
  language or adversarial-plan lanes.

## Failure Signals

- Gives each subagent a nearly identical two-line prompt.
- Asks helpers to read the whole plan or whole repo without bounds.
- Omits source-of-truth inputs or inspected paths.
- Omits security context.
- Omits completion receipts, source anchors, or the parent-owned artifact
  persistence boundary.
- Treats helper agreement as accepted truth without parent verification.
- Avoids stage artifacts for a substantial swarm without a named exception.
- Uses review verdicts or adversarial review language inside plan creation.
