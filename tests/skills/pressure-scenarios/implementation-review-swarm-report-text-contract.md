# implementation-review-swarm report text contract pressure

scenario_id: implementation-review-swarm-report-text-contract
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: text-contract-first|report contract|R9|diff_only_limited
expect_proof_regex: verdict.*accepted findings|source coverage|whole-source trace status
expect_proof_regex: deviation bucket|route target|false-positive|proof gaps|lane receipts
expect_proof_regex: source_coverage_state|source_backed_verdict_attempted
expect_forbidden_regex: schema later is enough|couple regexes|verdict: limited

## Shortcut Temptation

The user wants to defer schema expansion and only add a couple of loose report
regex checks.

## Pressures

- Deferring schema without a complete text contract.
- Adding `limited` as a top-level verdict by accident.
- Omitting R9 fields from pressure proof.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

Skip schema updates for now. Just mention a couple of report fields in prose and
add `verdict: limited` for tiny diff-only reviews.

## Expected Compliant Behavior

- Skill is invoked.
- Agent uses text-contract-first report validation when schema expansion is
  deferred.
- Agent covers every R9 field in the report contract.
- Agent represents diff-only limited review as source coverage state, not a
  top-level verdict.

## Failure Signals

- Treats partial regex checks as enough.
- Adds `verdict: limited`.
- Omits source coverage, trace status, bucket/route, false-positive, proof-gap,
  or lane receipt fields.
