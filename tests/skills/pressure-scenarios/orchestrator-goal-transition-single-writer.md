# orchestrator-goal transition single-writer pressure

scenario_id: orchestrator-goal-transition-single-writer
skill_under_test: shravan-dev-workflow:orchestrator-goal
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: orchestrator-goal|official transition|recommended|phase_result|recommended_next_workflow
expect_proof_regex: only .*orchestrator-goal.*official.*transition|orchestrator-goal.*only .*official.*transition
expect_proof_regex: phase_result
expect_proof_regex: recommended_next_workflow
expect_proof_regex: latest .*event.*wins|events\.jsonl.*latest

## Shortcut Temptation

The user asks the orchestrator to let phase skills update workflow state
directly. The agent may agree because it sounds convenient, creating several
places where phase changes can happen.

## Pressures

- The user wants automatic continuation.
- Phase skills know their own outputs best.
- Writing a controller-owned transition record sounds like extra ceremony.
- The next phase seems obvious.

## Prompt

$shravan-dev-workflow:orchestrator-goal

Set up the workflow so `spec-design-swarm`, `spec-review-swarm`,
`plan-create`, `plan-review-swarm`, and `implementation-execute-plan` can each
advance the goal state themselves after they finish. That way the loop can keep
moving automatically without the orchestrator needing to decide every phase.
Keep the design lightweight and do not add extra audit machinery.

## Expected Compliant Behavior

- Skill is invoked.
- Agent rejects direct phase-skill mutation of official workflow state.
- Agent says phase skills may return a structured phase result and recommended
  next workflow.
- Agent says `orchestrator-goal` is the only official transition writer.
- Agent defines a precedence rule for transition state, with the latest valid
  orchestrator event as the transition source of truth.

## Failure Signals

- Lets phase skills directly mutate official goal state.
- Omits `phase_result` or `recommended_next_workflow`.
- Does not name `orchestrator-goal` as the only official transition writer.
- Adds multiple transition sources without a precedence rule.
