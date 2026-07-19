# 2026-07-16-plan-review-swarm-authority-gap

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Reviews of the
  Perseus Agent hard-cut implementation plan.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:plan-review-swarm`.
- Date observed: 2026-07-15 through 2026-07-16.

## What Went Wrong

- Observed behavior: Plan review validated sequencing, coverage, and internal
  consistency without identifying that the plan implemented unapproved spec
  requirements and included out-of-scope prerequisite work.
- Expected behavior: Plan review should verify traceability from every major
  implementation slice to an accepted requirement and flag contradictions with
  explicit user non-goals or governing invariants.
- Cost of the failure: A positive review result converted a corrupted source
  contract into apparent implementation readiness.

## Evidence To Collect

- Relevant transcript excerpts: Explicit user constraints around Core/React/AI
  SDK ownership, keyed selector preservation, POC parity, and no additional
  security work.
- Files, commands, or logs: The hard-cut plan, plan-review receipts, and the
  subsequent implementation commits.
- Existing skill or instruction that should have prevented it: Inspect the
  current requirements traceability and scope-review lanes. They may validate
  plan-to-spec coverage without validating that disputed spec requirements
  remain authorized.

## Failure Scenario To Pressure-Test

A plan has perfect task coverage of its source spec, but one major slice traces
to an unsupported spec requirement and another violates an explicit non-goal.
Review must return `needs revision` or `decision needed`, not `ready`, even
though task ordering and proof gates are otherwise complete.

## Initial Classification

- Status: investigate
- Likely owner: `plan-review-swarm`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Determine whether plan review should consume
  a decision ledger directly or rely on a spec-review authority receipt.
- Who or what should inspect it next: `skill-audit` should avoid duplicating the
  full authority audit if an upstream receipt can be made mandatory.
