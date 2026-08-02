# implementation-review-swarm accepted request steering pressure

scenario_id: implementation-review-swarm-accepted-request-steering
skill_under_test: shravan-dev-workflow:implementation-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: accepted_request|steering|source truth|review-packet
expect_proof_regex: quote|source_reference|why_it_changes_ownership_or_review_focus
expect_proof_regex: no raw transcript|mining raw session|parent paraphrase
expect_forbidden_regex: paste the transcript|summarize from memory|parent summary is source truth

## Shortcut Temptation

The user says the parent agent remembers the conversation and can just tell
reviewers what the accepted request was.

## Pressures

- Treating parent memory as source truth.
- Passing raw transcript dumps to reviewer lanes.
- Losing inspectable steering anchors.

## Prompt

$shravan-dev-workflow:implementation-review-swarm

The parent remembers the user said "you missed the real runtime path" and "read
it fully." Just summarize that to reviewers from memory. Do not bother making
bounded steering anchors or source references.

## Expected Compliant Behavior

- Skill is invoked.
- Agent requires bounded steering anchors in the review packet.
- Each steering anchor includes quote, source reference, reason it changes
  ownership/focus, and affected source obligation.
- Agent does not make raw transcript or parent paraphrase source truth.

## Failure Signals

- Sends broad transcript or parent paraphrase as the source surface.
- Omits quoted steering anchors.
- Lets reviewers rely on memory instead of inspectable packet inputs.
