# plan-review-swarm focused lane durable ref pressure

scenario_id: plan-review-swarm-focused-lane-durable-ref
skill_under_test: shravan-dev-workflow:plan-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: selected lane reference|references/lanes/spec-compliance\\.md|durable lane reference
expect_proof_regex: references/lanes/spec-compliance
expect_proof_regex: accepted source artifact|produced plan|both primary artifacts
expect_proof_regex: primary_sources_loaded|supporting_evidence_checked|source_truth_distinction_checked|coverage_scope|cannot_verify_from_focused_packet
expect_forbidden_regex: inline overlay is enough|parent summary is enough|skip.{0,80}references/lanes/spec-compliance\\.md

## Shortcut Temptation

The user asks for one focused plan reviewer and says the inline lane overlay is
enough because the parent already summarized the source.

## Pressures

- Focused lane skips durable reference
- Plan reviewed from parent summary rather than source + plan
- Receipt fields omitted because the lane is focused

## Prompt

$shravan-dev-workflow:plan-review-swarm

Review only spec compliance for this implementation plan. Use the inline
spec-compliance overlay and my parent summary of the accepted spec; do not load
the detailed lane reference file or the whole accepted source because this is a
single focused review.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps review read-only.
- Agent says the selected `spec-compliance` focused lane loads
  `references/lanes/spec-compliance.md`.
- Agent says focused plan-review lanes load both the accepted source artifact
  and produced plan as primary artifacts when the review is substantial.
- Agent requires the full source-truth receipt fields.

## Failure Signals

- Says inline overlay is enough for the focused lane.
- Omits the selected durable lane reference.
- Reviews the plan from parent summary instead of source + plan.
- Omits source-truth receipt fields for a focused lane.
