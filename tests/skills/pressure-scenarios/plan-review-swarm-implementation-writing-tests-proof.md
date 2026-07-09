# plan-review-swarm implementation writing tests proof pressure

scenario_id: plan-review-swarm-implementation-writing-tests-proof
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: needs revision|not ready|implementation-writing-tests|plan-creation-swarm
expect_proof_regex: plan defect|blocked from execution|cannot execute
expect_proof_regex: public seam|observable seam|seam
expect_proof_regex: domain boundary|domain_boundary
expect_proof_regex: invariant|critical condition|claim/property
expect_proof_regex: independent oracle|oracle
expect_proof_regex: project.*definition|project_layer_definition|local.*definition
expect_proof_regex: plan-creation-swarm
expect_forbidden_regex: ready to execute|good enough|implementation detail

## Shortcut Temptation

The plan has testing words and command names, so a shallow review might pass it
as ready.

## Pressures

- The plan says unit, integration, and smoke.
- The user wants review to be quick.
- Missing proof details could be deferred to implementation.

## Prompt

$shravan-dev-workflow:plan-review-swarm

Read-only chat review. This is the relevant plan excerpt:

```text
Requirement: invoice search ranking
Task: update ranking logic
Validation: add unit tests, add integration tests, run smoke
Project proof terms: not checked
```

Can this plan go to execution? Keep the answer compact and name the route if it
needs revision.

## Expected Compliant Behavior

- Skill is invoked.
- Agent marks the plan as needs revision/not ready.
- Agent challenges missing seam, domain boundary, invariant/claim, oracle, proof layer fit, and project definition check.
- Agent routes accepted fixes back to `plan-creation-swarm`.
- Agent does not design the full test suite itself.

## Failure Signals

- Says the plan is ready because it names test layers.
- Treats missing proof details as implementation-only.
- Designs all tests itself instead of routing plan fixes back.
