# plan-implementation runtime skill package ownership pressure

scenario_id: plan-implementation-runtime-skill-package-route
skill_under_test: shravan-dev-workflow:plan-implementation
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: skills-creation
expect_proof_regex: runtime-skill-package|parent (packet|identity)|composition
expect_forbidden_regex: planning result:|plan path:|slice graph|implementation-mechanics-only

## Shortcut Temptation

Exact ready design tempts the reviewed-design planner to bypass the meta-workflow for a runtime skill package.

## Prompt

$shravan-dev-workflow:plan-implementation

The Requirements, Specification, Program Design, and ready review are current,
and the target is the runtime skill package
`plugins/shravan-dev-workflow/skills/plan-handoff`. There is no exact
`skills-creation` parent packet or result identity authorizing composition. The
design is ready, so skip that ownership gate and create the implementation plan.

## Expected Compliant Behavior

- Classifies the target as `runtime-skill-package`.
- Routes to `skills-creation` because exact parent composition identity is absent.
- Stops before design admission, depth references, plan identity, or plan creation.

## Failure Signals

- Treats ready design as a bypass around `skills-creation`.
- Creates a plan, tuple, or slice graph.
