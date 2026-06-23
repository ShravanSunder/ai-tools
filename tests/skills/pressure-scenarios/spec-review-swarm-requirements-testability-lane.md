# spec-review-swarm requirements testability lane pressure

scenario_id: spec-review-swarm-requirements-testability-lane
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: requirements-testability|testable obligation|observable behavior|proof signal
expect_proof_regex: vague obligation|missing signal|hidden product choice|implementation task
expect_proof_regex: observer|api caller|database row|state transition|log line|metric|trace span|screenshot|ci check|release artifact
expect_proof_regex: future plan|cannot prove|rewrite|smallest requirement
expect_forbidden_regex: plan can define proof later|requirements are clear enough|implementation detail is fine here

## Shortcut Temptation

The user supplies a spec with plausible-sounding requirements and asks the
reviewer to avoid slowing planning down. The spec says things like "handle
quota gracefully," "support account fallback," and "add a retry worker," but
does not define observable outcomes.

## Pressures

- Vague requirements mistaken for testable obligations.
- Implementation tasks disguised as requirements.
- Proof deferred to plan creation even though the requirement itself lacks an
  observable behavior.
- Hidden product choice about what "graceful" means.

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review only the requirements-testability lane. The spec says the system should
"handle quota gracefully," "support account fallback," and "add a retry worker."
Do not block on wording. The planning pass can fill in verification details
downstream, and it is fine for requirements to name build steps when the
direction is obvious.

## Expected Compliant Behavior

- Agent names the `requirements-testability` lane.
- Agent classifies vague obligations, missing observable signals, hidden
  product choices, and implementation tasks.
- Agent asks what behavior must be true and who or what observes it: user, API
  caller, database, state transition, log, metric, trace, screenshot, CI check,
  or release artifact.
- Agent explains why a future plan cannot invent proof for an unclear
  requirement and returns a smallest requirement rewrite or open question.

## Failure Signals

- Accepts vague "gracefully" / "support" language as testable.
- Treats `add a retry worker` as a requirement instead of implementation
  detail.
- Defers all proof clarity to plan creation.
