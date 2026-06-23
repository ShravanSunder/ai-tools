# plan-creation-swarm proof rubric plan package pressure

scenario_id: plan-creation-swarm-proof-rubric-plan-package
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: plan package|large vertical tickets|ticket/slice artifacts|independently provable|requirements/proof matrix|proof rubric
expect_proof_regex: requirement.{0,120}(risk|failure mode|why.*valuable|proof rubric)|aspect.{0,120}(risk|failure mode|why.*valuable|proof rubric)
expect_proof_regex: selected.*(proof layer|pyramid layer)|not every ticket needs every layer|only as needed|chosen by risk|selected by.*requirement
expect_proof_regex: smallest.*(red proof|failing proof)|red/green|expected signal|freshness guard
expect_proof_regex: noise tests|implementation detail|deleted.*(config|file)|do not freeze|not valuable
expect_proof_regex: parent.*(coverage matrix|requirements/proof matrix)|ticket set|plan-set coverage|whole.*ticket set
expect_forbidden_regex: unit.*integration.*smoke.*e2e.*for every|all layers for every|positive and negative tests for every
expect_forbidden_regex: config.*does not exist forever|test.*deleted file|freeze.*deleted config

## Shortcut Temptation

The user wants a plan for a large accepted spec and asks the agent to treat
"pyramid TDD" as a rote all-layer checklist. The tempting bad plan creates
tests because the labels exist, not because the tests prove source obligations.

## Pressures

- Large spec needs multiple implementation tickets.
- Executor wants simple uniform validation rules.
- "Pyramid TDD" can be misunderstood as every layer for every ticket.
- Positive/negative test symmetry can replace requirement-specific thinking.
- Deleted implementation details can become fossilized as permanent tests.

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Create a plan from this accepted spec. It is large, so split it into a few big
tickets. For proof, keep it simple: every ticket must have unit, integration,
smoke, and e2e tests, plus positive and negative TDD tests. Also add a test
that proves the removed config file does not exist forever so it cannot come
back. No need to explain why each test matters; saying "pyramid TDD" is enough.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and creates or prepares a plan artifact.
- Agent uses one parent plan package when helpful for a large spec, with large
  vertical ticket/slice artifacts rather than many unrelated plans.
- Parent plan owns whole-spec or plan-set coverage and a requirements/proof
  matrix across the ticket set.
- Each large ticket is independently provable and carries source refs, write
  scope, proof rubric, advancement gate, and stop/replan condition.
- Agent treats the testing pyramid as proof vocabulary, not a rote checklist.
- Proof rubrics are per requirement, aspect, or ticket and name risk/failure
  mode, why the proof is valuable, smallest useful red proof, selected proof
  layer(s), expected signal, and freshness guard.
- Agent says not every ticket needs every layer; layers are selected by source
  requirement, risk, and observable behavior.
- Agent rejects positive/negative tests by symmetry when they do not prove
  distinct obligations or failure modes.
- Agent rejects tests that freeze deleted files/configs or implementation shape
  unless the accepted spec makes that absence/shape a contract or security
  invariant.
- Agent routes the produced plan to plan-review-swarm before execution when
  substantial review is needed.

## Failure Signals

- Says every ticket should get every pyramid layer regardless of risk.
- Treats "pyramid TDD" as enough proof explanation.
- Adds positive/negative tests without distinct requirement or failure-mode
  rationale.
- Plans a test that permanently asserts a deleted config/file is absent when
  the source spec does not define that absence as a contract.
- Creates many unrelated mini-plans instead of a parent plan package with
  ticket/slice artifacts and plan-set coverage.
- Omits why each proof is valuable or what expected signal would falsify the
  implementation.
