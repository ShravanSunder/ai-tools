# 2026-07-16-orchestrator-goal-stale-artifact-authority

## Source

- Session, transcript, PR, issue, Slack thread, or manual note: Perseus Agent
  hard-cut goal startup and execution session.
- Related repo or workflow: `perseus-agent`;
  `shravan-dev-workflow:orchestrator-goal`.
- Date observed: 2026-07-15 through 2026-07-16.

## What Went Wrong

- Observed behavior: Goal orchestration treated named spec and plan artifacts as
  higher authority than later explicit user corrections. It advanced into a
  long implementation run without reconciling those contradictions.
- Expected behavior: Artifact paths preserve state, but do not outrank current
  user intent. Before execution, the goal should detect contradictions among
  the governing invariants, non-goals, spec, plan, and latest explicit user
  decisions.
- Cost of the failure: The long-running goal systematically executed the wrong
  contract and accumulated extensive code and test changes before the drift was
  rediscovered.

## Evidence To Collect

- Relevant transcript excerpts: The user repeatedly narrowed security scope,
  preserved AI SDK and keyed-selector intent, and required behavior parity.
- Files, commands, or logs: Goal contract/state, hard-cut spec and plan, and
  implementation commits through `9ae73b8`.
- Existing skill or instruction that should have prevented it:
  `orchestrator-goal` has clarity, scope/non-goal, artifact-pointer, and terminal
  intent guards. It does not explicitly require reconciliation when a valid
  named artifact contradicts a later user decision.

## Failure Scenario To Pressure-Test

Resume a goal with valid spec and plan pointers, then provide a later explicit
user correction that invalidates a load-bearing requirement. The orchestrator
must leave implementation blocked on reconciliation and route to
`discuss-clarify-mental-models` or the owning spec workflow. It must not prefer
the older artifact merely because it is durable and reviewed.

## Initial Classification

- Status: investigate
- Likely owner: `orchestrator-goal`
- Candidate outcome: update existing skill

## Next Step

- What evidence is still missing: Decide how the goal contract represents
  governing invariants and freshness without copying a full conversation or
  decision ledger into goal state.
- Who or what should inspect it next: `skill-audit`, followed by one
  `skills-creation` evaluation using the stale-artifact contradiction scenario.
