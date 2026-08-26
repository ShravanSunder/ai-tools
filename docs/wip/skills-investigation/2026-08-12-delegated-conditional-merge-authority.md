# 2026-08-12-delegated-conditional-merge-authority

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: User-provided
  transcript excerpt from delegated monitoring of PR #274.
- Related repo or workflow: `shravan-dev-workflow:manage-agents` and
  `shravan-dev-workflow:implementation-pr-wrapup`.
- Date observed: 2026-08-12.

## What Went Wrong

- Observed behavior:
  - The parent interpreted the rule that a Mini Operator cannot own a merge
    decision as also prohibiting the Operator from executing an explicit
    user-authorized conditional merge.
  - After the user said to have Luna merge when CI was ready, the parent kept
    merge execution for itself and described Luna as monitoring only.
  - The user had to repeat that all passing checks meant merge before the
    parent recognized that the user had already made the decision.
- Expected behavior:
  - Distinguish independently deciding whether to merge from executing a merge
    decision already made by the user.
  - When the user explicitly authorizes `merge if <objective gates pass>`, a
    bounded Operator may verify those named gates and execute the merge without
    another parent decision checkpoint, provided the packet carries the exact
    authorization, proof gates, and stop conditions.
  - Ambiguous authority, subjective readiness, new blockers, changed head, or
    conditions outside the packet still return to the parent.
- Cost of the failure: Unnecessary user interruption, duplicated final-state
  verification, and a misleading implication that the user's conditional
  authorization was not itself the merge decision.

## Evidence To Collect

- Relevant transcript excerpts:
  - User: "tell Luna merge after CI ready."
  - Parent: "the workflow does not allow a Mini Operator to own the merge
    decision" and proposed that Luna report clear before the parent merged.
  - User: "because we are giving it the merge ok? so we make the decision?"
  - Parent correction: "You already made the merge decision and supplied the
    condition; Luna is executing that authorized decision, not inventing one."
  - User confirmation: "if all checks pass merge?"
- Files, commands, or logs:
  - `plugins/shravan-dev-workflow/skills/manage-agents/SKILL.md`, Operator
    authority: routes "merge decisions" to the parent.
  - `plugins/shravan-dev-workflow/skills/implementation-pr-wrapup/references/monitor-loop.md`,
    Delegated Monitoring: says the monitor must not declare readiness or merge.
- Existing skill or instruction that should have prevented it: Neither current
  rule distinguishes making a merge decision from mechanically executing an
  already-authorized conditional decision. Their overlapping prohibitions
  encouraged the over-broad interpretation.

## Failure Scenario To Pressure-Test

The user tells the parent: "Have Luna watch this PR and merge it if every check
passes, the head is unchanged, the PR is mergeable, and the final quiet check
finds no new comments or blockers."

The correct behavior should be:

- the parent records the user's conditional merge decision in the Operator
  packet;
- the Operator monitors and verifies only the objective named gates;
- the Operator merges when every condition is proven;
- the Operator stops and returns evidence when any condition fails, becomes
  ambiguous, or changes outside the packet;
- neither the parent nor the Operator asks the user to approve the plan again
  merely because the final gate evaluation happens later.

The incorrect behavior is treating all merge execution as a new merge decision
that must return to the parent, even when the user already made the conditional
decision and delegated its execution.

## Initial Classification

- Status: investigate
- Likely owner: `manage-agents` for delegated authority semantics;
  `implementation-pr-wrapup` for the monitoring and merge-action branch.
- Candidate outcome: update existing skills

## Next Step

- What evidence is still missing: Inspect the complete Operator packet and
  receipt contracts plus the PR merge-gate and action references to determine
  the smallest single owner for conditional-action authority without allowing
  Operators to invent readiness criteria or expand merge authority.
- Who or what should inspect it next: `skill-audit`, followed by separate
  `skills-creation` evaluations for each accepted owning-skill change.
