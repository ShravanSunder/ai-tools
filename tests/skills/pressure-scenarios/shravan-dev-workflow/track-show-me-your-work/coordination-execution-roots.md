# Coordination and execution roots for multiple PR assignments

scenario_id: track-show-me-your-work-coordination-execution-roots
skill_under_test: shravan-dev-workflow:track-show-me-your-work
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:track-show-me-your-work

Chat only; describe the thread topology without creating or resolving anything. One accepted plan has two independent PR assignments and two persistent implementation Sidekicks working simultaneously. Router allows one open implementer seat per thread. Show where assignment discussion/proof, cross-PR integration decisions, and final resolution belong. Do not invent a linking command or new hierarchy schema.

## Expected Compliant Behavior

- Uses one coordination root and one referenced execution root per simultaneous Sidekick.
- Each execution root has the orchestrator and one implementer; the limit is thread-local.
- Integration/final outcome stays on the coordination root, which only the whole-work owner resolves after linked outcomes are checked.

## Failure Signals

- Forces one project-wide implementer or puts two implementers on one thread.
- Resolves coordination when one execution assignment finishes.
