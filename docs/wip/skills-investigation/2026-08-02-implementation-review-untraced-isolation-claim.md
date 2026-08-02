# Implementation Review Accepted an Untraced Isolation Claim

## Source

- Session: private application implementation review; exact checkout and commit are intentionally omitted.
- Related workflow: `implementation-review-swarm`, `manage-agents`, and the parent reducer's transition from implementation review back to a design stop.
- Date observed: 2026-08-01 through 2026-08-02.
- Private evidence exists in the source repository's ignored review workspace; its machine path is intentionally omitted from this public note.

## Scenario

The accepted implementation plan required an organization-switch integration case after a real upload had begun. A reliability reviewer proposed that runtime disposal could finish while the old upload was still settling, allowing the organization switch to advance. The parent reducer inspected upload, abort, disposal, and transition ordering and accepted the candidate as a shared-runtime lifecycle defect.

That inspection stopped one ownership boundary too early. It did not trace runtime construction through the factory to the sandbox constructor, which creates a fresh shell sandbox for every runtime. It also did not distinguish the upload's mutation targets from the shared application engine:

```text
shared application engine
  ├─ runtime A -> private filesystem A + private upload manifest A
  └─ runtime B -> private filesystem B + private upload manifest B
```

An old upload can finish in an unreachable, runtime-private sandbox without writing into the new organization's runtime. The safety obligations are that the old runtime becomes unreachable, no later send or tool path starts, its runtime database detaches before the engine organization changes, and the new organization remains usable. Global upload quiescence is a different and stronger property; the review had not established that organization isolation required it.

The user supplied the missing ownership question. Only then did the parent inspect resource construction and reject the proposed shared-runtime defect.

## What Went Wrong

- The reducer treated a high-confidence reviewer report as accepted truth after validating call ordering but before validating resource identity.
- It conflated “old asynchronous work is still settling” with “old work can mutate shared or new-organization state.”
- It proposed awaiting all upload work without first proving that the upload touched a shared resource.
- It escalated the finding into an out-of-scope design stop and eventually a false blocked state.
- The correct behavior was to treat the finding as a hypothesis, trace construction and disposal, name every mutation target, classify its ownership, and test whether the supposedly conflicting runtimes aliased a resource.

## Cost

- Unnecessary design interruption and user decision request.
- A false `not_ready` blocker and blocked goal state.
- Pressure toward an unnecessary core-runtime change.
- Delay to the real remaining integration proof and PR work.
- Lost trust because the user had to identify a source-grounded ownership boundary the reducer should have verified.

## Existing Guidance

`manage-agents`, `implementation-review-swarm`, its reviewer prompts, its review packet, and `discuss-clarify-mental-models` already established that reviewer output is candidate evidence, repository artifacts are source truth, the parent verifies findings, and countercases must be tested. Applied correctly, those rules should have prevented acceptance.

The missing defense-in-depth guidance is a concrete source trace for stale-work, isolation, teardown, and concurrency findings:

1. Identify every mutation target and classify it as invocation-private, runtime-private, organization-scoped, or shared.
2. Trace resource construction as well as disposal, then verify whether the operations alias the same filesystem, store, database, connection, registry, or engine.
3. Separate isolation safety, correctness, liveness/quiescence, and resource reclamation.
4. State the reviewer's load-bearing assumption and inspect the strongest counterexample before accepting an important or blocker finding.
5. Before expanding scope into another owner, prove why existing isolation cannot satisfy the accepted requirement.
6. If the user supplies a missing ownership fact, reopen the whole finding rather than patching the proposed fix.

## Initial Classification

- Status: investigate.
- Likely owner: `implementation-review-swarm` reducer verification, with possible shared review-reception clarification.
- Candidate outcome: update the existing owner and add a reducer pressure scenario; do not create another skill.

## Next Step

Use `skill-audit` to place the clarification and test a reviewer who spots in-flight work but incorrectly assumes two runtimes share its mutation target. The primary diagnosis remains noncompliance with existing candidate-evidence rules; prompt clarification is defense in depth, not a replacement for reducer responsibility.
