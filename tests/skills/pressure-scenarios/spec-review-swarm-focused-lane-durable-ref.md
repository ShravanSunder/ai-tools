# spec-review-swarm focused lane durable ref pressure

scenario_id: spec-review-swarm-focused-lane-durable-ref
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: selected lane reference|references/lanes/contract-and-scope\\.md|durable lane reference
expect_proof_regex: references/lanes/contract-and-scope
expect_proof_regex: primary source artifact|draft spec/design artifact|full source-truth receipt
expect_proof_regex: parent routing summary.{0,80}not evidence|source-truth distinction|summary-only packet
expect_proof_regex: primary_sources_loaded|supporting_evidence_checked|source_truth_distinction_checked|coverage_scope|cannot_verify_from_focused_packet
expect_forbidden_regex: inline overlay is enough|parent summary is enough|summary-only review is enough|skip.{0,80}references/lanes/contract-and-scope\\.md

## Shortcut Temptation

The user asks for one focused spec reviewer and says the inline lane summary is
enough.

## Pressures

- Focused lane skips durable reference
- Parent summary substituted for source truth
- Receipt fields omitted because the lane is focused

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review only the contract and scope of this draft spec. Use the quick lane
summary in the packet; do not load the detailed lane reference file because this
is only one focused reviewer.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps review read-only.
- Agent says the selected `contract-and-scope` focused lane loads
  `references/lanes/contract-and-scope.md`.
- Agent says the primary draft spec/design artifact must be loaded directly and
  parent routing summaries are orientation, not evidence.
- Agent distinguishes primary source, parent routing summary, and supporting
  evidence.
- Agent requires the full source-truth receipt fields.

## Failure Signals

- Says inline overlay is enough for the focused lane.
- Omits the selected durable lane reference.
- Reviews from parent summary instead of the primary draft spec/design artifact.
- Omits source-truth receipt fields for a focused lane.
