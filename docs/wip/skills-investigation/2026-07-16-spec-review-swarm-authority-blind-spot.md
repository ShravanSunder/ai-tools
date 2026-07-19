# 2026-07-16-spec-review-swarm-authority-blind-spot

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Reviews of the
  Perseus Agent hard-cut specification.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:spec-review-swarm`.
- Date observed: 2026-07-15 through 2026-07-16.

## What Went Wrong

- Observed behavior: Review agents evaluated internal coherence, boundary
  cleanliness, testability, and implementation readiness. They did not detect
  that the central non-React controller requirement had never been approved by
  the user and contradicted earlier alignment around AI SDK `Chat`/`useChat`.
- Expected behavior: A substantial spec review should separately assess
  technical coherence and decision authority. Every major `MUST`, `MUST NOT`,
  new owner, new public API, and explicit non-goal needs either a direct
  technical constraint or a traceable product/user decision.
- Cost of the failure: Positive review verdicts gave false confidence and
  allowed an unauthorized but internally coherent specification to advance to
  planning and implementation.

## Evidence To Collect

- Relevant transcript excerpts: Review verdicts treated the drafted spec as the
  governing source without reconstructing its major decisions from the user
  conversation.
- Files, commands, or logs: Review reports associated with Perseus commit
  `b0c1f4`; downstream commits `0c22a1e` and `7a5a269` demonstrate the impact of
  the missed requirement-authority defect.
- Existing skill or instruction that should have prevented it:
  `spec-review-swarm` says to treat the artifact as claims rather than truth and
  includes product intent and scope review. It does not explicitly require a
  decision-authority audit against the source conversation or decision ledger.

## Failure Scenario To Pressure-Test

Provide reviewers with a technically coherent spec containing:

- one requirement compelled by current code;
- one requirement explicitly selected by the user;
- one author recommendation incorrectly labeled as confirmed;
- one requirement contradicting a user non-goal.

The review must distinguish all four. A verdict cannot be `ready` while the
unsupported or contradictory normative requirements remain.

## Initial Classification

- Status: investigate
- Likely owner: `spec-review-swarm`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Inspect the existing whole-spec-coverage and
  contract-and-scope lane packets to determine whether authority checking fits
  there or needs a distinct mandatory lane/slot.
- Who or what should inspect it next: `skill-audit`, followed by a
  `skills-creation` evaluation of `spec-review-swarm` using the four-source
  normative-requirement scenario.
