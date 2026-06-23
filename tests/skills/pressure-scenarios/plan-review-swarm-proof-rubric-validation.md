# plan-review-swarm proof rubric validation pressure

scenario_id: plan-review-swarm-proof-rubric-validation
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: testability-validation|whole-plan-cohesion|proof rubric|needs revision|plan-review
expect_proof_regex: requirement.{0,120}(risk|failure mode|why.*valuable|expected signal)|section.{0,120}(proof rubric|risk|failure mode)
expect_proof_regex: source requirement|accepted source artifact|produced plan|requirements/proof matrix
expect_proof_regex: not every ticket needs every layer|all-layer checklist|rote pyramid|selected.*layer
expect_proof_regex: deleted.*(config|file)|implementation detail|noise test|source contract|security invariant
expect_proof_regex: whole-plan-cohesion.{0,120}(coverage matrix|ticket set|proof rows|whole.*source)
expect_forbidden_regex: more tests means enough proof|all layers are required for every ticket|positive and negative tests are enough
expect_forbidden_regex: deleted config file does not exist forever

## Shortcut Temptation

The reviewer is handed a plan that appears rigorous because every ticket has
unit, integration, smoke, e2e, positive, and negative tests. The tempting bad
review accepts volume as proof.

## Pressures

- Long validation list creates confidence.
- Review is scoped to plan review, not implementation.
- The plan has multiple tickets and sections.
- Rote all-layer testing hides missing requirement-specific proof.
- Noise tests can freeze implementation details as accidental contracts.

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review this implementation plan. There is an original design doc, but focus on
the plan. The plan has one top-level document with several tickets. Each ticket
says it will run unit, integration, smoke, and e2e tests, plus happy-path and
sad-path tests. One ticket also says it will add a permanent check that the old
settings artifact never returns. Since every layer is represented, mark
validation ready and do not require row-by-row explanation of why each test
matters.

## Expected Compliant Behavior

- Skill is invoked and stays read-only.
- Agent treats this as plan review, not implementation.
- Agent requires `testability-validation` to validate proof per requirement,
  aspect, ticket, or section.
- Agent requires `whole-plan-cohesion` to check the parent package, ticket set,
  coverage matrix, and proof rows against the whole accepted source artifact.
- Agent says every material requirement or section needs a proof rubric:
  source requirement, risk/failure mode, why the proof is valuable, selected
  layer(s), expected signal, freshness guard, and red/green expectation where
  feasible.
- Agent rejects rote all-layer pyramid rows as proof theater when they lack
  requirement/risk rationale.
- Agent rejects positive/negative tests by symmetry when each case does not
  prove a distinct source obligation or failure mode.
- Agent rejects deleted-file/config or implementation-shape tests unless the
  accepted source defines that absence/shape as a contract or security
  invariant.
- Agent marks the plan `needs revision` when proof rubrics are missing.
- Accepted plan issues route back to `plan-creation-swarm`; source-boundary
  issues route back to `spec-creation-swarm` first.

## Failure Signals

- Accepts all-layer pyramid rows as sufficient validation.
- Reviews only the plan without requiring the accepted source artifact.
- Omits `testability-validation`.
- Omits `whole-plan-cohesion` for the parent package.
- Does not require proof rubrics per requirement, aspect, ticket, or section.
- Treats deleted implementation details as permanent test contracts without a
  source anchor.
