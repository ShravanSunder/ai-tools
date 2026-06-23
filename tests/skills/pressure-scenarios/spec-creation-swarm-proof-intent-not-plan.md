# spec-creation-swarm proof intent not plan pressure

scenario_id: spec-creation-swarm-proof-intent-not-plan
skill_under_test: shravan-dev-workflow:spec-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: spec|requirements|proof expectations|evidence shape|plan-creation-swarm
expect_proof_regex: what must be provable|why.*matters|observable|evidence shape
expect_proof_regex: evidence shape.{0,120}(state|api contract|data|db|log|metric|trace|screenshot|manual ux|release artifact)|observable.{0,120}(state|api contract|data|db|log|metric|trace|screenshot|manual ux|release artifact)
expect_proof_regex: not.*(exact test commands|command sequencing|execution dag)|plan.*operationalizes
expect_proof_regex: non-useful proof|implementation detail|deleted.*(file|config)|source contract|security invariant
expect_forbidden_regex: unit.*integration.*smoke.*e2e.*for every requirement|all proof can wait for the plan|plan will invent proof

## Shortcut Temptation

The user asks for a spec but wants to avoid proof thinking until planning. The
old bad behavior is either to put a rote pyramid checklist into the spec or to
punt all proof meaning downstream.

## Pressures

- Spec must avoid implementation sequencing.
- Proof detail can be mistaken for plan work.
- "Pyramid TDD" can become a slogan.
- Implementation details can become accidental proof contracts.

## Prompt

$shravan-dev-workflow:spec-creation-swarm

Create a spec. For validation, keep it simple: say every requirement will use
unit, integration, smoke, and e2e testing later. Or just say the plan will
figure out all proof details. Also mention that old settings artifacts should
never come back, because we removed them.

## Expected Compliant Behavior

- Skill is invoked and stays read-only.
- Agent says the spec must define requirement-level proof intent without doing
  plan work.
- Agent says each material requirement should name what must be provable, why
  it matters, and what observable evidence shape could count.
- Agent names evidence shapes such as behavior, state, API contract, data/DB,
  logs, metrics, traces, screenshots, manual UX, CI, or release artifacts when
  relevant to the requirement.
- Agent keeps exact commands, execution DAGs, worker order, and command
  sequencing for `plan-creation-swarm`.
- Agent rejects rote all-layer pyramid checklists in the spec.
- Agent rejects freezing deleted files/configs or implementation shape as proof
  unless the source makes that absence/shape a contract or security invariant.

## Failure Signals

- Puts unit/integration/smoke/e2e on every requirement as the spec proof model.
- Says all proof meaning can wait for plan creation.
- Adds deleted implementation details as durable spec proof without a source
  contract.
- Adds implementation sequence or exact validation commands to the spec.
