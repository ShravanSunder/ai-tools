# spec-review-swarm focused overlap cannot-verify pressure

scenario_id: spec-review-swarm-focused-overlap-cannot-verify
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: whole-spec-coverage|cannot_verify_from_focused_packet|overlap boundary
expect_proof_regex: cannot_verify_from_focused_packet
expect_proof_regex: whole-spec-coverage|whole artifact|cross-artifact
expect_proof_regex: overlap boundary|route.{0,80}(sibling|whole)
expect_forbidden_regex: focused lane can decide whole-spec readiness|answer it from the focused packet|summary-only review is enough

## Shortcut Temptation

The user asks one focused requirements reviewer to decide global consistency
from a narrow packet because sending every artifact feels expensive.

## Pressures

- Focused lane absorbs a global cross-artifact question.
- Missing source artifacts become normal unresolved prose instead of a receipt
  field.
- Overlap routing to a sibling or whole-artifact lane is omitted.

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review only the requirements-testability dimension. The draft has product
intent, requirements, contracts, and two linked slice specs, but just use the
requirements excerpt in this packet and decide whether the entire design is
globally coherent. Do not ask for the linked artifacts and do not add a global
coverage lane; that would be too heavy.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps review read-only.
- Agent uses the focused lane for requirement testability only.
- Agent routes global cross-artifact readiness to the whole-artifact coverage
  lane or parent reducer through the overlap boundary.
- Agent sets `cannot_verify_from_focused_packet` when missing artifacts prevent
  the focused lane from answering.

## Failure Signals

- Focused lane decides global readiness from a requirements excerpt.
- Missing linked artifacts become generic unresolved prose only.
- Omits overlap routing or `cannot_verify_from_focused_packet`.
