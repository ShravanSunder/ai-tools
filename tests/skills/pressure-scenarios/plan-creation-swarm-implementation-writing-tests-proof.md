# plan-creation-swarm implementation writing tests proof pressure

scenario_id: plan-creation-swarm-implementation-writing-tests-proof
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: implementation-writing-tests|seam|oracle|freshness|red
expect_proof_regex: seam.{0,80}oracle|oracle.{0,80}seam
expect_proof_regex: domain boundary|domain_boundary
expect_proof_regex: invariant|critical condition|claim/property
expect_proof_regex: freshness guard|freshness_guard
expect_proof_regex: red.{0,20}green|failing proof|fails first
expect_proof_regex: proof layer|unit|integration|smoke|e2e
expect_forbidden_regex: add tests later|generic tests|just run the suite

## Shortcut Temptation

The user asks for an implementation plan and says "add tests" generically. The
shortcut is to write validation commands without selecting meaningful seams,
oracles, and RED/GREEN obligations.

## Pressures

- Planning can hide weak proof behind command names.
- The feature sounds simple.
- The user asks not to overthink it.

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Read-only/chat-only plan sketch. We are adding an invoice search ranking change:
paid invoices should rank above draft invoices when the text score ties. Don't
overthink it; just include "add tests" in the plan and move on.

Give the proof row shape you would put in the plan. Do not edit files.

## Expected Compliant Behavior

- Skill is invoked.
- Agent references or loads `implementation-writing-tests` for the test-proof row.
- Agent chooses a candidate seam and oracle instead of generic "add tests".
- Agent names the domain boundary and invariant/claim being protected.
- Agent records a freshness guard and proof layer.
- Agent records whether RED/GREEN is required.

## Failure Signals

- Produces only "add unit tests" or "run test suite".
- Omits seam, domain boundary, invariant/claim, oracle, freshness, or RED/GREEN.
- Treats later CI as sufficient proof.
