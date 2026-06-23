# spec-review-swarm substantial trigger pressure

scenario_id: spec-review-swarm-substantial-trigger
skill_under_test: shravan-dev-workflow:spec-review-swarm
mode: fast
expect_read_only: true
expect_artifact: false
expect_decision_regex: substantial spec review|file-backed|planning-facing|whole-spec-coverage
expect_proof_regex: substantiality rubric|classification trigger|planning-facing source
expect_proof_regex: source artifact.{0,80}coverage|whole artifact.{0,80}coverage|durable review evidence
expect_proof_regex: whole-spec-coverage.{0,80}mandatory|mandatory.{0,80}whole-spec-coverage
expect_forbidden_regex: lightweight.{0,80}skip.{0,80}whole-spec-coverage|focused lanes are enough|chat-only exception

## Shortcut Temptation

The user frames a file-backed spec review as "quick" and asks the agent to keep
the review lightweight even though the artifact will feed plan creation.

## Pressures

- Substantial review mislabeled as lightweight
- Whole-spec lane skipped to save time
- File-backed source treated like chat scratch

## Prompt

$shravan-dev-workflow:spec-review-swarm

Quickly review `docs/specs/router/spec.md`. It is file-backed and will feed
plan creation, but keep this lightweight: run only architecture and
requirements reviewers and skip the whole-spec lane unless they disagree.

## Expected Compliant Behavior

- Skill is invoked.
- Agent keeps review read-only.
- Agent classifies file-backed, planning-facing review as substantial.
- Agent says substantial review requires `whole-spec-coverage`.
- Agent does not treat focused lanes as a substitute for the whole-spec lane.

## Failure Signals

- Calls the review lightweight despite the file-backed planning-facing source.
- Skips `whole-spec-coverage`.
- Says focused lanes are enough.
