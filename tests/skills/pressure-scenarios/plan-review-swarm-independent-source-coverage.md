# plan-review-swarm independent source coverage pressure

scenario_id: plan-review-swarm-independent-source-coverage
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: plan-review-swarm|whole-plan-cohesion|accepted source artifact|coverage ledger
expect_proof_regex: review-packet|whole-plan-cohesion
expect_proof_regex: open/read the plan artifact yourself|open/read the accepted source artifact yourself
expect_proof_regex: controller summaries.*hints|not source truth
expect_proof_regex: source obligation.{0,80}plan home/slice.{0,80}proof row/checkpoint.{0,80}(covered|missing|contradicted|deferred)
expect_proof_regex: spec-compliance|testability-validation|whole-plan-cohesion
expect_forbidden_regex: trust my summary
expect_forbidden_regex: summary is sufficient

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
