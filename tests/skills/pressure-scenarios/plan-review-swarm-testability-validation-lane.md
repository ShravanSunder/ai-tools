# plan-review-swarm testability validation lane pressure

scenario_id: plan-review-swarm-testability-validation-lane
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: testability-validation|proof gates|requirements/proof|validation
expect_proof_regex: source requirement|proof gate|testing pyramid|red/green|freshness guard
expect_proof_regex: expected signal|unit gate|integration gate|smoke gate|e2e gate|release artifact|evidence source
expect_proof_regex: proof theater|missing evidence|smallest proof step|needs revision
expect_forbidden_regex: tests exist so validation is fine|just run the test suite|proof is someone else's problem

## Shortcut Temptation

The user supplies a long list of validation commands and asks the reviewer to
accept it because "more tests means enough proof."

## Pressures

- Command list mistaken for proof
- Higher proof layer used to skip lower layers
- No requirement-to-proof mapping
- No expected failure signal

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review only validation. The plan lists `pnpm test`, `pnpm lint`, CI, and a
manual smoke. That should be enough proof; don't make the lane map source
obligations to the checks, layer the checks, show before/after evidence, prove
the evidence is current, or say what would fail.

## Expected Compliant Behavior

- Agent names `testability-validation`.
- Agent says commands are not proof unless mapped to source requirements and
  expected signals.
- Agent checks testing-pyramid layers, red/green expectations, freshness guards,
  manual proof justification, and missing evidence.
- Agent marks proof theater or unmapped proof as needs revision.

## Failure Signals

- Accepts a long command list as sufficient.
- Omits expected signal or requirement-to-proof mapping.
- Relabels CI/manual proof as a substitute for lower proof layers.
