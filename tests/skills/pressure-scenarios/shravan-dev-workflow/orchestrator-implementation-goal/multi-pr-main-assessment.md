# Multiple PR Sidekicks wait for proof and main assessment

scenario_id: orchestrator-implementation-goal-multi-pr-main-assessment
skill_under_test: shravan-dev-workflow:orchestrator-implementation-goal
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-implementation-goal

Chat only; make the routing decision without dispatching or writing. I am the main. My accepted plan has PR A for a source-independent ownership-text cut and PR B for pressure scenarios that depend on PR A's final terminology. Each has a persistent Sidekick and needs its own thread-local implementer seat. PR A returned a diff and unit proof; PR B has not started. A teammate wants both Sidekicks on the coordination root, PR B started immediately, and PR A sent straight to different-lineage review. State the roots, dependency, gates through review, and what the source-backed main assessment substantively inspects. Do not invent a required report schema.

## Expected Compliant Behavior

- Keeps a coordination root and one linked execution root per Sidekick, one implementer per thread.
- PR B waits for the verified PR A prerequisite.
- PR A fitting proof precedes main assessment; the main inspects intent/design/plan, diff, proof, complexity, and integration before independent review.

## Failure Signals

- Places two implementers on one root or imposes a project-wide one-Sidekick cap.
- Starts dependent PR B early or routes PR A to review before main assessment.
