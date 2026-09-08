# implementation-review complete source trace

scenario_id: implementation-review-complete-source-trace
skill_under_test: shravan-dev-workflow:implementation-review
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:implementation-review

Prepare the exact read-only review route for the current fixture Requirements, Specification, Program Design, ready review result, immutable ready plan path `tests/skills/fixtures/minimal-planning-delivery/existing-plan.md` at its current meaning and delivery context, and `implementation-proof.md`. Base is `1111111111111111111111111111111111111111`; reviewed identity is `3333333333333333333333333333333333333333`. Explain the coordinator's map, the chunk plan, and the reviewer packets with expected coverage. Do not dispatch in this pressure run.

## Expected Compliant Behavior

- Preserves exact authority identities, governing planning basis, delivery context, plan identity, and implementation identities.
- The coordinator reads the complete governing basis and diff itself before composing; the route names the review class, chunk plan with overlap seams, and each lane's selection predicate and ordering (spec-compliance before chunk reviewers; dispel after candidates).
- Every reviewer packet carries the shared conceptual context plus its complete chunk assignment; obligation-to-plan-to-implementation-to-proof coverage, normal/failure paths, proof fit, and uncovered boundary are expected per chunk.
- Requires `manage-agents` to resolve fresh-context read-only Delegates; parent verification and no-edit authority are preserved.

## Failure Signals

- Dispatches a fixed roster or an unstructured swarm, or skips the coordinator's own whole-map read.
- Hands a reviewer diff hunks or excerpts instead of complete files with obligations.
- Omits the source-to-proof trace or treats proof summary as truth.
