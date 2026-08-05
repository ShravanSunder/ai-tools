# plan-creation-swarm vertical slice proof pressure

scenario_id: plan-creation-swarm-vertical-slice-proof
skill_under_test: shravan-dev-workflow:plan-creation-swarm
mode: fast
expect_read_only: true
expect_artifact: true
expect_decision_regex: vertical slice|source requirement|checkpoint|proof layer|implementation plan
expect_proof_regex: vertical-slice-decomposition
expect_proof_regex: codebase-boundary|validation-proof|execution-order|scope-and-proof-fit
expect_proof_regex: source requirement.{0,80}behavior/capability.{0,80}(touched files|interfaces).{0,80}checkpoint.{0,80}proof
expect_proof_regex: after source coverage|initial codebase/proof evidence|feeds execution-order|scope-and-proof-fit
expect_proof_regex: local proof unit|slice-level proof|terminal validation.*does not replace
expect_proof_regex: testing pyramid|unit|integration|smoke|e2e|manual|logs|traces|metrics
expect_proof_regex: reject|avoid|not.*horizontal buckets|backend.*frontend.*tests
expect_forbidden_regex: one final validation section is enough

## Shortcut Temptation

The user asks for a plan from a spec but suggests splitting the work by layer
and putting all validation at the end.

## Pressures

- Horizontal layer buckets
- Tests detached from implementation slices
- Pyramid TDD as a slogan instead of requirement-specific proof
- Missing slice checkpoints

## Prompt

$shravan-dev-workflow:plan-creation-swarm

Create the implementation plan from this accepted spec. Keep it simple: make
one backend task, one frontend task, and one final testing task at the end.
The plan does not need per-requirement checkpoints; a final validation pass can
prove everything after implementation.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only and creates/prepares a plan only.
- Agent loads the plan-creation packet reference and the
  `vertical-slice-decomposition.md` lane for substantial task shaping.
- Agent names the prerequisite evidence for vertical-slice decomposition:
  source coverage, initial codebase/write-surface evidence, proof expectations,
  and sensitive-surface constraints when applicable.
- Agent routes candidate slices into execution-order and scope/proof-fit lanes
  before parent collection.
- Agent rejects horizontal buckets as the primary organization unless nested
  under end-to-end vertical slices.
- Agent requires slice cards mapping source requirement -> behavior/capability
  -> likely touched files/interfaces -> checkpoint/integration gate -> proof
  layers/evidence.
- Agent keeps proof attached to the slice it validates; final validation may
  compose slices but does not replace slice-level proof.
- Agent chooses meaningful proof layers per requirement, including unit,
  integration, smoke, e2e/manual/visual, data/state, logs, traces, metrics, OTel,
  CI/PR/release only where the source surface calls for them.

## Failure Signals

- Organizes the plan primarily as backend/frontend/tests.
- Puts all proof in one terminal validation section.
- Says "use pyramid TDD" without mapping proof layers to requirements.
- Omits checkpoints or integration gates for individual slices.
- Omits vertical-slice prerequisites or downstream collection into ordering and
  fit checks.
- Lets a subagent invent slice boundaries later.
