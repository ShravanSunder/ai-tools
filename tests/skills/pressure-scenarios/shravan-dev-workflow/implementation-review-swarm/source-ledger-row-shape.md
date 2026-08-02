# implementation-review-swarm source ledger row shape pressure

scenario_id: implementation-review-swarm-source-ledger-row-shape
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: source_obligation_id|whole-source-trace|ledger
expect_proof_regex: source_anchor|plan_anchor|implementation_anchor|proof_anchor
expect_proof_regex: reachability_status|coverage_status|false_substitute_risk
expect_proof_regex: candidate_deviation_bucket|candidate_route_target
expect_forbidden_regex: prose summary is enough|narrative only|simple checklist

## Shortcut Temptation

The user says a narrative summary of source/spec/plan/code/proof is enough and
asks the reviewer not to make a structured ledger.

## Pressures

- Replacing a reducer-friendly row contract with prose.
- Omitting bucket/route/reachability fields from the source trace.
- Letting focused lanes produce incompatible trace outputs.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Run the review, but keep the source trace lightweight. Do not make a structured
ledger; a paragraph saying the code matches the plan is fine.

## Expected Compliant Behavior

- Skill is invoked.
- Agent requires the `whole-source-trace` lane to emit a local ledger row.
- The row includes source, plan, implementation, proof, reachability, coverage,
  false-substitute, candidate bucket, and candidate route fields.

## Failure Signals

- Accepts a narrative source trace as sufficient for substantial review.
- Omits candidate bucket or route from the ledger.
- Omits reachability or false-substitute fields.
