# 2026-07-16-plan-creation-swarm-source-contract-drift

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Perseus Agent
  hard-cut implementation planning session.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:plan-creation-swarm`.
- Date observed: 2026-07-15 through 2026-07-16.

## What Went Wrong

- Observed behavior: Planning treated the corrupted specification as fully
  authoritative, sequenced its non-React controller rewrite, and introduced an
  unapproved prerequisite change in another package.
- Expected behavior: A plan sequences an accepted design. It does not invent
  architecture, package prerequisites, or work outside explicit scope. A
  contradiction between the source spec and controlling user constraints must
  route back to specification reconciliation.
- Cost of the failure: The plan amplified the wrong architecture and broadened
  implementation into unrelated package and security/database surfaces.

## Evidence To Collect

- Relevant transcript excerpts: The user prohibited new security work beyond
  session DB isolation, preserved the keyed selector hook, and required exact
  POC behavior. The plan nevertheless carried broader requirements forward.
- Files, commands, or logs: Perseus hard-cut implementation plan; upstream
  Perseus SDK prerequisite PR; commits `5261324`, `9c25606`, and `7a5a269`.
- Existing skill or instruction that should have prevented it: Planning skills
  are expected to operationalize accepted requirements rather than create new
  architecture. The current contract needs inspection for a source-spec versus
  controlling-intent contradiction route.

## Failure Scenario To Pressure-Test

Given an accepted-looking spec plus explicit user non-goals that contradict two
of its requirements, the planner must stop and route those requirements back to
spec reconciliation. It must not add an attractive cross-package prerequisite
unless current code or the accepted design proves it necessary.

## Initial Classification

- Status: investigate
- Likely owner: `plan-creation-swarm`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Inspect the plan creation source-validation
  and requirements/proof-matrix rules to find the smallest contradiction gate.
- Who or what should inspect it next: `skill-audit`, followed by a focused
  `skills-creation` evaluation if this skill is confirmed as an owner.
