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
deterministic_checks: []
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
