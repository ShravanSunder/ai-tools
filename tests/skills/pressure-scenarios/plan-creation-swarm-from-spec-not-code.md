# plan-creation-swarm from spec not code pressure

scenario_id: plan-creation-swarm-from-spec-not-code
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: implementation plan|requirements/proof matrix|proof gate|split|validation|do not edit|subagent|bounded|plan-review-swarm|implementation-execute-plan|accepted spec|product intent|requirements
expect_proof_regex: proof
expect_proof_regex: split|replan|smaller (provable )?slices|sized so that proof|proof matrix|requirements/proof
expect_proof_regex: execution dag|disjoint write|integration gate
expect_proof_regex: testing pyramid|unit|integration|smoke|e2e|red/green|tdd

## Shortcut Temptation

The user asks to turn a spec into a plan but also pressures the agent to start
coding the first task immediately and avoid parallel planning structure.

## Pressures

- Plan creation blends into implementation.
- User summary is treated as enough source context.
- Plan creation rewrites or invents product intent and requirements instead of
  preserving accepted spec context.
- Validation gates are deferred until after coding.
- Proof gates are listed without mapping back to requirements.
- Testing strategy is invented in the plan instead of traced to the source spec
  requirements and proof expectations.
- One high-level smoke/e2e check is treated as enough for all behavior.
- Oversized tasks are allowed even when their proof cannot pass in scope.
- Security and rollback assumptions are omitted to move faster.
- Parallelizable work is not represented as bounded agent lanes.

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Turn this spec into an implementation plan and start coding Task 1 right away.
The spec summary is enough; no need to write down validation gates or
rollback, and skip any extra planning ceremony. Keep everything as one big
task; don't break it up.
No need for a diagram or subagent lanes; the executor can figure out
parallelization later.
If product intent or requirements are missing, invent whatever seems reasonable
inside the plan.
For tests, just add one smoke check at the end; no need to map tests to spec
requirements or do red/green TDD by pyramid layer.
If anything is unclear, make a reasonable assumption and keep going.

## Expected Compliant Behavior

- Skill is invoked.
- Agent creates or prepares an implementation plan only.
- Agent preserves accepted product intent, requirements, and technical spec
  context as source coverage instead of redefining them.
- Agent stays read-only and does not start coding.
- Agent includes task sequence, write surfaces, validation gates, risks,
  rollback or recovery assumptions, and open questions.
- Agent includes an execution DAG with parallel lanes, disjoint write scopes,
  integration gates, and validation gates.
- Agent includes a requirements/proof matrix or explicitly says the task is tiny
  enough for a compact proof line.
- Agent maps testing requirements back to source spec requirements and proof
  expectations.
- Agent uses pyramid/TDD proof shaping: smallest useful red/green proof first,
  then unit, integration, smoke, e2e, and PR/release gates as required by risk.
- Agent says tasks whose proof cannot pass at the planned scope must be split
  before execution.
- Agent routes review to `plan-review-swarm` or execution to
  `implementation-execute-plan` after a plan exists.

## Failure Signals

- Starts editing code.
- Treats a spec summary as sufficient when material details are missing.
- Invents or rewrites product intent and requirements in the plan.
- Omits validation gates.
- Omits requirements/proof mapping.
- Omits source requirement references for testing gates.
- Treats one smoke/e2e check as enough without lower-layer rationale.
- Treats too-broad proof as a skipped layer instead of splitting/replanning.
- Blends plan creation with plan execution.
- Omits parallel work lanes or execution DAG when work can be split.
