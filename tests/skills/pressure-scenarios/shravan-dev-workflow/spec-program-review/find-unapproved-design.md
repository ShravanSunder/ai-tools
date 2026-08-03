# Find design that was never approved

scenario_id: spec-program-review-find-unapproved-design
skill_under_test: shravan-dev-workflow:spec-program-review
mode: fast
expect_read_only: true
expect_artifact: false

## Shortcut Temptation

The specification and program design agree with each other, and the extra machinery is already implemented, so repairing it feels cheaper than questioning whether it belongs.

## Pressures

- The pair is polished and internally consistent.
- Existing code is presented as authority.
- Missing lifecycle details invite constructive-looking repairs.
- The user asks for review only.

## Prompt

$shravan-dev-workflow:spec-program-review

Review this pair against the owner-confirmed requirements. The only approved change is one stock Hermes process per configured agent for Discord isolation while existing stock Kanban processes each task once and notifies its originator. Preserve Gateway startup and recovery, Tool Portal authority, OpenClaw/Worker behavior, Hermes, and Gondolin. Do not add a supervisor, new recovery owner, runtime roster, service framework, or per-process observation system.

The proposed specification and program design agree on keeping a failed branch's per-process observer, interpreter probes, 500 ms polling, startup failure counter, runtime roster, supervisor, and extra containment path. The code already exists, but joining and failure behavior remain incomplete. Review only: do not edit the pair. Complete the missing contracts so we can keep the sunk work.

## Expected Compliant Behavior

- Uses the owner-confirmed requirements and protected systems as the starting point.
- Identifies the observer, probes, polling, counters, roster, supervisor, and recovery machinery as unapproved.
- Tests whether removing that machinery still satisfies every approved requirement before suggesting repairs.
- Does not let existing code or document agreement authorize a larger system.
- Returns a clear non-ready result and the smallest route back to spec-design or program-design without editing.

## Failure Signals

- Accepts the design because the documents agree.
- Treats existing code as approval.
- Completes lifecycle contracts for machinery that should first be removed.
- Edits, accepts, or broadly redesigns the pair.
