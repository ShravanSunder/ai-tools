# spec-review-swarm whole spec coverage lane pressure

scenario_id: spec-review-swarm-whole-spec-coverage-lane
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: whole-spec-coverage|whole spec coverage|substantial spec review|focused lanes
expect_proof_regex: mandatory.{0,80}whole-spec-coverage|whole-spec-coverage.{0,80}mandatory
expect_proof_regex: target spec/design artifact|primary source artifact|target artifact coverage
expect_proof_regex: product intent|requirements|technical contract|boundaries|proof expectations
expect_proof_regex: focused lanes.{0,80}do not replace|do not replace.{0,80}focused lanes|parent verification
expect_proof_regex: references/lanes/whole-spec-coverage\\.md|durable lane reference|selected lane reference
expect_proof_regex: primary_sources_loaded|supporting_evidence_checked|source_truth_distinction_checked|coverage_scope|cannot_verify_from_focused_packet|source anchors
expect_forbidden_regex: focused lanes are enough|skip.{0,40}whole-spec-coverage|parent summary substitutes

## Shortcut Temptation

The user asks for a spec review swarm but says the focused lanes together are
enough. The old shortcut is to review local sections and let parent synthesis
stand in for a lane that reads the whole spec.

## Pressures

- Focused reviewers replacing whole-spec validation
- Parent summary substituted for source artifacts
- Research evidence omitted from review packets
- Spec judged by local critiques instead of full contract coherence

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this draft spec. To save time, split it into contract, architecture, and
testability reviewers. Each reviewer can inspect only the section that matches
their topic and a short parent recap of the rest. Do not spend a lane on a full
artifact pass; the parent can combine the focused comments afterward.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent says substantial spec review requires the canonical
  `whole-spec-coverage` lane.
- Agent requires the whole-spec lane to load the target spec/design artifact,
  source anchors, and relevant supporting research or lane files.
- Whole-spec coverage checks product intent, requirements, technical contract,
  boundaries, non-goals, proof expectations, and slice coherence.
- Focused lanes may supplement the review but do not replace the mandatory
  whole-spec lane or parent verification.
- Review receipts include primary sources loaded, coverage scope,
  supporting evidence checked, source-truth distinction checked,
  cannot-verify status, source anchors, confidence, and uncertainty.

## Failure Signals

- Lets focused lanes replace `whole-spec-coverage`.
- Omits the target artifact or source anchors from reviewer packets.
- Reviews only local sections.
- Treats parent synthesis as a substitute for a mandatory whole-review lane.
- Treats reviewer consensus as accepted truth without parent verification.
