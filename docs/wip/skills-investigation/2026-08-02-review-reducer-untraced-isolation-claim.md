# 2026-08-02-review-reducer-untraced-isolation-claim

## Source

- Session: Perseus Agent headless-hooks implementation review at commit
  `83d9f240`.
- Related workflow: `implementation-review-swarm`, `manage-agents`, and the
  parent reducer's transition from implementation review back to a design stop.
- Date observed: 2026-08-01 through 2026-08-02.
- Private/local evidence:
  `/Users/shravan.sunder/Documents/code/perseus-agent.headless-hooks/tmp/implementation-review-workflows/2026-08-01-perseus-headless-hooks-83d9f240/review-result.md`.

## Scenario

The accepted implementation plan required an organization-switch integration
case after a real Core upload had begun. A reliability reviewer proposed that
runtime disposal could finish while the old upload was still settling, allowing
the organization switch to advance. The parent reducer inspected the upload,
abort, runtime-disposal, and organization-transition ordering and accepted the
candidate as a Core lifecycle defect.

That inspection stopped one ownership boundary too early. The reducer did not
trace runtime construction through `AgentRuntimeFactory.createRuntime()` to
`createBashContext()`, which creates a fresh Just Bash instance for every
runtime. It also did not distinguish the raw upload's mutation targets from the
shared Perseus engine:

```text
shared Perseus engine
  ├─ runtime A -> private Bash filesystem A + private upload manifest A
  └─ runtime B -> private Bash filesystem B + private upload manifest B
```

An old upload promise can therefore finish in an unreachable, runtime-private
sandbox without writing into the new organization's runtime. The safety
obligations are that the old runtime becomes unreachable, no later Agent send or
tool path starts, its runtime database detaches before the engine organization
changes, and the new organization remains usable. Global upload quiescence is a
different and stronger property; the review had not established that it was
required for organization isolation.

The user surfaced the missing ownership fact by asking whether uploads already
used separate sandboxes. Only then did the parent inspect the factory and
sandbox construction and reject the proposed Core defect.

## What Went Wrong

- Observed behavior:
  - The reducer treated a high-confidence reviewer report as accepted truth
    after validating call ordering but before validating resource identity.
  - It conflated "old asynchronous work is still settling" with "old work can
    mutate shared or new-organization state."
  - It accepted the reviewer's proposed correction—making Core disposal await
    upload work—without first proving that the upload touched a shared resource.
  - It escalated the finding into a design stop and requested permission for a
    Core change that was outside the accepted implementation scope.
  - After automatic continuations, it marked the long-running goal blocked on
    that unverified conclusion.
- Expected behavior:
  - Treat the reviewer finding as a hypothesis.
  - Trace the complete ownership path from hook to runtime factory, sandbox,
    upload manifest, runtime database, shared engine, disposal, and transition.
  - Name the exact state each asynchronous operation can still mutate.
  - Separate liveness/resource-reclamation concerns from tenant isolation and
    correctness concerns.
  - Test the strongest countercase: whether two runtimes alias the same Bash,
    upload manifest, or database namespace.
  - Reject or downgrade the finding before requesting a scope expansion when
    the alleged cross-organization mutation path is absent.
- Cost of the failure:
  - Unnecessary design interruption and user decision request.
  - A false `not_ready` blocker and blocked goal state.
  - Lost trust because the user had to identify a basic ownership boundary that
    the reducer should have found from source.
  - Pressure toward an unnecessary Core change despite repeated scope controls
    against new or expanded runtime systems.
  - Delay to the real remaining work: integration proof, bounded review fixes,
    manual consumer proof, and PR wrap-up.

## Guidance That Already Existed

The main failure was noncompliance with existing guidance, not absence of all
guidance:

- `manage-agents/SKILL.md` says agent output is candidate evidence and the
  parent must verify assignment-bound claims before accepting them.
- `implementation-review-swarm/SKILL.md` says reviewer output is raw candidate
  findings, requires verification against repository reality, and requires the
  reducer to reject claims that cannot be proven from current artifacts.
- `implementation-review-swarm/references/reviewer-prompts.md` says the reducer
  must verify each candidate against repository artifacts and drop speculative
  claims.
- `implementation-review-swarm/references/review-packet.md` says reports and
  parent memory are routing hints rather than source truth.
- `discuss-clarify-mental-models/SKILL.md` already distinguishes inherited
  framing from first-principles evidence and requires a countercase that would
  falsify the rebuilt model.

Applied correctly, these instructions should have prevented acceptance of the
finding. The reducer had enough warning that reviewer confidence and agreement
were not proof.

## Guidance That Was Not Clear Enough

The current reduction guidance says to verify a finding but does not make the
minimum verification shape explicit for concurrency, isolation, and teardown
claims. A reducer can mistakenly consider call-chain inspection sufficient even
when the claim depends on object identity and ownership.

Candidate clarification for the existing implementation-review workflow:

1. For a finding about stale work, cross-tenant state, teardown, or concurrency,
   identify every mutation target and classify it as invocation-private,
   runtime-private, organization-scoped, or shared before accepting the
   finding.
2. Trace resource construction as well as disposal. Verify whether supposedly
   conflicting operations alias the same filesystem, store, database,
   connection, registry, or engine.
3. Separate these properties explicitly:
   - safety/isolation: can old work affect reachable state owned by another
     runtime or tenant?
   - correctness: can old work publish a send, tool result, or terminal outcome?
   - liveness/quiescence: is all work finished before teardown returns?
   - reclamation: can private orphaned resources remain temporarily alive?
4. State the reviewer's load-bearing assumption and inspect the strongest
   counterexample before accepting an important or blocker finding.
5. Before a finding expands scope into a prohibited owner or triggers a design
   stop, require one explicit source-backed sentence proving why the accepted
   owner cannot satisfy the requirement with existing isolation boundaries.
6. If a user supplies a missing ownership fact, reopen the whole finding and
   its route; do not merely patch the proposed fix.

This should be an update to existing reducer/review-reception guidance, not a
new skill. Pressure coverage should include a reviewer who correctly spots an
in-flight operation but incorrectly assumes two runtimes share its mutation
target.

## Evidence To Collect

- Inspect whether current reducer pressure scenarios cover resource identity,
  aliasing, and the distinction between isolation and quiescence.
- Inspect whether review reception requires renewed verification before a
  candidate finding expands into a prohibited owner or design stop.
- Preserve the relevant source anchors showing per-runtime Bash and database
  construction without copying sensitive session transcripts into this repo.

## Initial Classification

- Status: investigate.
- Likely owner: `implementation-review-swarm` reducer verification, with a
  possible shared review-reception clarification.
- Candidate outcome: update an existing skill and add a reducer pressure
  scenario.
- Not indicated: a new review or debugging skill.

## Next Step

- Route the evidence through `skill-audit` to decide whether the durable change
  belongs in `implementation-review-swarm/SKILL.md`, a reducer reference, or the
  shared review-reception guidance.
- Preserve the primary diagnosis: the session failed to follow already-present
  candidate-evidence rules; any prompt clarification is a defense-in-depth
  improvement, not a replacement for reducer responsibility.
