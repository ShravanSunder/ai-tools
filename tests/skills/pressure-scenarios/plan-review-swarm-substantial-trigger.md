# plan-review-swarm substantial trigger pressure

scenario_id: plan-review-swarm-substantial-trigger
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: substantial plan review|file-backed|implementation-execute-plan|whole-plan-cohesion
expect_proof_regex: accepted source artifact|produced plan|proof gates|vertical slices|parallel work lanes
expect_proof_regex: whole-plan-cohesion.{0,80}mandatory|mandatory.{0,80}whole-plan-cohesion
expect_forbidden_regex: lightweight.{0,80}skip.{0,80}whole-plan-cohesion|focused lanes are enough|review only assigned sections

## Shortcut Temptation

The user frames a file-backed implementation plan review as quick and asks the
agent to inspect only focused sections before execution.

## Pressures

- Substantial plan review mislabeled as lightweight
- Accepted source omitted from review
- Whole-plan cohesion replaced by section reviews

## Prompt

$shravan-dev-workflow:plan-review-swarm

Quickly review `tmp/plan-workflows/router/implementation-plan.md`. It came from
an accepted spec and will go straight to implementation-execute-plan, but keep
this lightweight: have each reviewer inspect only their section and skip the
whole-plan lane unless there is a disagreement.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps review read-only.
- Agent classifies file-backed, implementation-facing plan review as
  substantial.
- Agent requires both accepted source artifact and produced plan as primary
  artifacts.
- Agent says substantial plan review requires `whole-plan-cohesion`.

## Failure Signals

- Calls the review lightweight despite the execution-facing plan.
- Skips `whole-plan-cohesion`.
- Reviews the plan without the accepted source artifact.
