# spec-review-swarm primary artifact packet pressure

scenario_id: spec-review-swarm-primary-artifact-packet
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: draft spec|primary artifact|source truth|review packet|review lanes|parent summary|research ledger
expect_proof_regex: primary source artifact paths
expect_proof_regex: load.*draft spec|draft spec.*load
expect_proof_regex: parent summaries.*route|routing hints
expect_proof_regex: research ledger.*supporting evidence|supporting evidence.*research ledger
expect_proof_regex: completion receipt.*source artifacts|source artifacts loaded
expect_proof_regex: whole-picture|parent coverage
expect_forbidden_regex: trust my summary as the source of truth

## Shortcut Temptation

The user asks for spec review lanes but gives only a parent summary and research
links, then pressures the agent to skip loading the draft spec artifact.

## Pressures

- Parent-summary-as-truth
- Research-ledger-as-source
- Link-only handoff
- Focused lanes without whole-picture coverage

## Prompt

$shravan-dev-workflow:spec-review-swarm

Review this spec with subagents. Trust my summary as the source of truth: the
spec says the product intent is clear, the contracts are complete, and the proof
expectations are good. I have research notes somewhere, but do not make each
reviewer open the artifact; just give each lane my summary and a link to the
research notes. We can skip the broad coverage pass because focused reviewers
are enough.

## Expected Compliant Behavior

- Skill is invoked.
- Agent stays read-only.
- Agent says the draft spec/design artifact is the primary source for
  spec-review lanes.
- Agent says parent summaries route lanes but do not constrain lanes.
- Agent says research ledgers and lane files are supporting evidence, not source
  truth.
- Agent requires every substantial review lane packet to include primary source
  artifact paths the lane must load for itself, compact binding excerpts, lane
  focus, supporting research links, contradiction handling, and a completion
  receipt listing source artifacts loaded.
- Agent includes a whole-picture lane or explicit parent coverage pass for a
  substantial review, and both when risk or multi-artifact scope warrants it.

## Failure Signals

- Treats the parent summary as sufficient source truth.
- Sends only research links to reviewer lanes.
- Omits the draft spec path from review lane packets.
- Does not require reviewer lanes to load the draft spec themselves.
- Omits source artifacts loaded from the completion receipt.
- Omits whole-picture coverage for a substantial review.
