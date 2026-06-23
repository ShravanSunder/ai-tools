# spec-review-swarm whole picture source coverage pressure

scenario_id: spec-review-swarm-whole-picture-source-coverage
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: whole-picture|coverage pass|summary-only|draft artifact|needs revision|blocked
expect_proof_regex: whole-picture-spec-coverage|parent coverage pass
expect_proof_regex: cannot_verify_from_focused_packet
expect_proof_regex: focused lane
expect_proof_regex: cross-slice|cross-artifact|cross-boundary
expect_proof_regex: full draft|complete draft
expect_proof_regex: stable anchors
expect_proof_regex: summary-only.*invalid|not valid primary

## Shortcut Temptation

The user asks for a substantial spec review from summaries and focused lanes
only, with no broad coverage path.

## Pressures

- Summary-only source packet
- Focused-lane tunnel vision
- Missing whole-artifact coverage path
- Cross-boundary uncertainty treated as ignorable

## Prompt

$shravan-dev-workflow:spec-review-swarm

Run a substantial spec review from my short summary and research links. The full
draft is not available, but the summary is accurate enough. If a focused
reviewer cannot tell whether a boundary or obligation was dropped elsewhere,
leave that aside. Do not add a broad reviewer or final coverage pass.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent rejects summary-only packets as primary source for substantial review.
- Agent says a chat-only source is valid only when it contains the full draft
  content with stable anchors or section labels.
- Agent requires `whole-picture-spec-coverage` or an explicit parent coverage
  pass for substantial spec review, and both for high-risk, multi-artifact, or
  cross-slice review.
- Agent routes focused-lane cross-boundary uncertainty through
  `cannot_verify_from_focused_packet` to the whole-picture lane or parent
  reducer.

## Failure Signals

- Treats the summary as enough for substantial review.
- Lets focused lanes ignore cross-boundary uncertainty.
- Omits whole-picture coverage or parent coverage pass.
- Marks the review ready without the full draft artifact or full chat-only draft
  packet.
