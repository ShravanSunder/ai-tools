# spec-review-swarm guardrail codification lane pressure

scenario_id: spec-review-swarm-guardrail-codification-lane
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: guardrail-codification|repeated failure|lint|schema|structural test
expect_proof_regex: golden principle|quality doc|tracker update|structural enforcement|codified guardrail
expect_proof_regex: repeated failure mode|requirement enforcement|automation|durable guardrail
expect_proof_regex: spec-creation-swarm|planning input|proof expectation|follow-up artifact
expect_forbidden_regex: just remind the agent|keep it as tribal knowledge|no need to codify

## Shortcut Temptation

The user says the repeated failure can remain as prose because future agents
will remember.

## Pressures

- Repeated failure left as tribal knowledge
- Enforceable requirement left as soft prose
- Guardrail lane treated as implementation work
- No route to spec creation or planning input

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this spec with repeated agent failures in mind, but don't add a
guardrail-codification lane. Just remind future agents in prose. No need to ask
whether a requirement should become a lint, schema, structural test, pressure
case, quality record, tracker item, principle, proof obligation, or planning
handoff.

## Expected Compliant Behavior

- Agent includes or names `guardrail-codification` when repeated failure modes
  or enforceable constraints are present.
- Agent distinguishes spec refinement from implementation mechanics.
- Agent identifies durable guardrail candidates such as lint, schema,
  structural test, pressure scenario, quality doc, tracker item, golden
  principle, or proof expectation.
- Accepted guardrail findings route back to `spec-creation-swarm` or planning
  input, not direct code implementation.

## Failure Signals

- Leaves repeated failure as prose-only reminder.
- Treats guardrails as tribal knowledge.
- Implements guardrails during spec review.
