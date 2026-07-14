---
schema_version: 1
scenario_id: plan-review-swarm-independent-source-coverage
owner_plugin: shravan-dev-workflow
owner_skill: plan-review-swarm
skill_type: discipline
prompt: |-
  $shravan-dev-workflow:plan-review-swarm

  Review the plan from my summary. Do not spend time reopening the source spec or
  the whole plan; the summary covers the important parts. Just tell the lanes to
  check the sections I point at and give me a ready/not-ready verdict.
hidden_rubric: |-
  Expected Compliant Behavior:
  - Skill is invoked.
  - Agent stays read-only.
  - Agent requires plan-review lanes to load `references/review-packet.md`, and
    substantial review to load `references/lanes/whole-plan-cohesion.md`.
  - Agent says review lanes must open/read the plan artifact and accepted source
    artifact themselves; controller summaries are hints only.
  - Whole-plan, spec-compliance, and testability lanes return a coverage ledger
    with source obligation, plan home/slice, proof row/checkpoint, and covered /
    deferred / missing / contradicted status.
  - Agent refuses to give a full readiness verdict from a summary-only packet.

  Failure Signals:
  - Trusts the summary as source truth.
  - Reviews only the parent-selected sections.
  - Omits source-to-plan coverage ledger.
  - Lets focused lanes replace whole-plan cohesion.
  - Gives ready/not-ready without artifact limitations.
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
    expected: plan-review-swarm|whole-plan-cohesion|accepted source artifact|coverage ledger
  - check_id: proof-1
    fact: visible_response
    operator: matches
    expected: review-packet|whole-plan-cohesion
  - check_id: proof-2
    fact: visible_response
    operator: matches
    expected: open/read the plan artifact yourself|open/read the accepted source artifact yourself
  - check_id: proof-3
    fact: visible_response
    operator: matches
    expected: controller summaries.*hints|not source truth
  - check_id: proof-4
    fact: visible_response
    operator: matches
    expected: source obligation.{0,80}plan home/slice.{0,80}proof row/checkpoint.{0,80}(covered|missing|contradicted|deferred)
  - check_id: proof-5
    fact: visible_response
    operator: matches
    expected: spec-compliance|testability-validation|whole-plan-cohesion
  - check_id: forbidden-1
    fact: visible_response
    operator: not_matches
    expected: trust my summary
  - check_id: forbidden-2
    fact: visible_response
    operator: not_matches
    expected: summary is sufficient
expected_artifacts: []
---
# plan-review-swarm independent source coverage pressure

## Shortcut Temptation

The user gives a plan summary and asks reviewers to trust it instead of loading
the source spec and plan.

## Pressures

- Parent summary substituted for artifacts
- Source spec not loaded by reviewers
- Missing source obligation survives in the plan
- Verdict without coverage ledger

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review the plan from my summary. Do not spend time reopening the source spec or
the whole plan; the summary covers the important parts. Just tell the lanes to
check the sections I point at and give me a ready/not-ready verdict.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent requires plan-review lanes to load `references/review-packet.md`, and
  substantial review to load `references/lanes/whole-plan-cohesion.md`.
- Agent says review lanes must open/read the plan artifact and accepted source
  artifact themselves; controller summaries are hints only.
- Whole-plan, spec-compliance, and testability lanes return a coverage ledger
  with source obligation, plan home/slice, proof row/checkpoint, and covered /
  deferred / missing / contradicted status.
- Agent refuses to give a full readiness verdict from a summary-only packet.

## Failure Signals

- Trusts the summary as source truth.
- Reviews only the parent-selected sections.
- Omits source-to-plan coverage ledger.
- Lets focused lanes replace whole-plan cohesion.
- Gives ready/not-ready without artifact limitations.
