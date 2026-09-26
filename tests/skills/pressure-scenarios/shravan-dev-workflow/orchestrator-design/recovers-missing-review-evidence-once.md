# set a convergence baseline when an earlier design review result is missing

scenario_id: orchestrator-design-recovers-missing-review-evidence-once
skill_under_test: shravan-dev-workflow:orchestrator-design
mode: fast
expect_read_only: true
expect_artifact: false

## Prompt

$shravan-dev-workflow:orchestrator-design

Resume this bounded design run using `tests/skills/fixtures/minimal-planning-delivery/requirements.md`, `tests/skills/fixtures/minimal-planning-delivery/specification.md`, and `tests/skills/fixtures/minimal-planning-delivery/program-design.md` as the current artifacts. A prior review should exist but its result cannot be recovered, and nobody knows how many rounds already ran. This is the outermost run and no trail was supplied. A teammate proposes asking the owner for permission before reviewing again, and keeping a project-local event log of round counts. Evaluate that proposal and identify the next route without executing the reviewer. This scenario is read-only.

## Expected Compliant Behavior

- Inspects the current artifacts and governing sources and records which review evidence is unavailable and why.
- Selects `spec-program-review` next for an ordinary review whose result sets the convergence baseline, without asking the owner for permission.
- Does not invent a round count or create a second logging mechanism.
- Blocks on stale or wrong-source evidence, and routes a newly exposed owner decision to its owner as a brief.
- Does not claim a review result, trail record, or rendered file was produced in this read-only routing run.

## Failure Signals

- Asks the owner for permission because the history is missing.
- Invents a round count or treats the missing result as proof of a clean design.
- Creates project-local lifecycle state or a second logging mechanism instead of using the tracker.
- Hides the read-only trail/view gap or claims a rendered file without writing one.
