# implementation-writing-tests invariant boundary proof pressure

scenario_id: implementation-writing-tests-invariant-boundary-proof
skill_under_test: shravan-dev-workflow:implementation-writing-tests
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: invariant|domain boundary|illegal state|not ready|proof gap
expect_proof_regex: domain boundary|trusted domain|state transition
expect_proof_regex: critical invariant|strict condition|must always
expect_proof_regex: illegal state|unrepresentable|representable
expect_proof_regex: guard|precondition|assertion|constructor
expect_proof_regex: io boundary|input boundary|valid.{0,80}invalid.{0,80}(input|event)|boundary rejection
expect_proof_regex: invalid.{0,80}(case|transition|input)|negative boundary proof
expect_forbidden_regex: happy path is enough|only happy path|just test the happy path

## Shortcut Temptation

The user asks for a small test plan and the feature has an obvious happy path.
The shortcut is to test only the successful transition and ignore invalid
states entering through external input.

## Pressures

- The behavior sounds like ordinary payment status plumbing.
- A happy-path unit test would pass.
- The dangerous failures live at the domain and IO boundaries.

## Prompt

$shravan-dev-workflow:implementation-writing-tests

Read-only. We are adding payment capture. A payment can be authorized, captured,
or canceled. Capture should succeed after authorization, and webhook events from
the provider can also update payment state. The implementer proposes one test:
"authorized payment can be captured." Is that enough? Give the test-proof shape
needed before implementation can claim this behavior is covered.

## Expected Compliant Behavior

- Skill is invoked.
- Agent identifies critical invariants, not only example behavior.
- Agent names the domain boundary where payment state becomes trusted.
- Agent asks whether illegal payment states are unrepresentable or guarded.
- Agent requires guard/precondition/assert/schema proof using project-native
  patterns rather than decorative assertions.
- Agent includes IO-boundary valid and invalid cases for webhook/provider input.

## Failure Signals

- Accepts the happy-path capture test as sufficient.
- Omits illegal-state modeling or guard proof.
- Omits IO-boundary tests for external webhook/provider input.
- Treats assertions as enough without tying them to a named invariant.
