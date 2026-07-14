---
schema_version: 1
scenario_id: implementation-review-swarm-report-text-contract
owner_plugin: shravan-dev-workflow
owner_skill: implementation-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:implementation-review-swarm

  Skip schema updates for now. Just mention a couple of report fields in prose and
  add `verdict: limited` for tiny diff-only reviews.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent uses text-contract-first report validation when schema expansion is
    deferred.
  - Agent covers every R9 field in the report contract.
  - Agent represents diff-only limited review as source coverage state, not a
    top-level verdict.

  Failure Signals:
  - Treats partial regex checks as enough.
  - Adds `verdict: limited`.
  - Omits source coverage, trace status, bucket/route, false-positive, proof-gap,
    or lane receipt fields.
baseline: no_skill
repetitions: 5
risk: standard
fixture_requirements: []
allowed_tools: []
allowed_write_paths: []
deterministic_checks:
  - check_id: decision-1
    fact: visible_response
    operator: matches
    expected: text-contract-first|report contract|R9|diff_only_limited
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: verdict.*accepted findings|source coverage|whole-source trace status
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: deviation bucket|route target|false-positive|proof gaps|lane receipts
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: source_coverage_state|source_backed_verdict_attempted
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: "schema later is enough|couple regexes|verdict: limited"
expected_artifacts: []
---
# implementation-review-swarm report text contract pressure

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
