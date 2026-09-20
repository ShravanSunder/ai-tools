# Goal Contract And Routing

This reference owns current-source orientation, planning and implementation admission, meaningful result verification, bounded recovery, and finish decisions for one implementation delivery goal. Phase skills retain their own input and return contracts.

Expected inputs: the user's objective and requested terminal, repository instructions, current source and diff, governing artifacts, admitted-improvement evidence when applicable, the main-authored canonical plan and PR assignments, implementation proof, main-assessment evidence, review evidence, supplied authority, coordination and execution work references or unshared checkpoint path and whole-work responsibility, the orchestrator, persistent implementation Sidekicks, persistent review Sidekick when commissioned, executors when assigned, and known blockers.

Return: a concise orientation containing the objective, scope, current basis, requested terminal, evidence freshness, next owner or exact stop, and the continuation checkpoint and whole-work completion decision.

## Orient From Current Evidence

Read enough current source to know what is being delivered before trusting summaries. Inspect only evidence relevant to the next decision:

```text
objective and scope:
requested terminal: plan-only | pr-ready-unmerged
governing basis: reviewed design | admitted repository improvement | unresolved
current source and material diff:
current plan, proof, and review evidence:
known remediation and recovery history:
authority and blockers:
trail: <coordination root plus execution roots, or unshared checkpoint path> / whole-work responsibility | contribution
responsibility: orchestrator and coordination/integration / planned PR assignment -> persistent implementer and execution root / review Sidekick: <persistent session or not yet commissioned> / executor: <assigned or implementer direct>
next owner or stop:
```

The row is a reasoning aid, not a stored schema. Do not create a goal record or require producers to restate it.

Use these inspection criteria:

- **Scope:** the result covers the obligations being delivered and names material exclusions or unresolved work.
- **Source:** the artifacts, plan, diff, proof, and review apply to the current source. Require exact plan identity, reviewed diff or PR head, and source-bound proof where a mismatch would make the claim false.
- **Outcome:** the result clearly says what succeeded, what remains, and which owner or stop follows.
- **Evidence:** cited source or observed proof supports the claim at the right proof layer.
- **Boundary:** no producer exceeded its authority, weakened proof, inferred merge permission, or hid a design decision.

Do not reject a useful result solely because it lacks an expected label or opaque identity. Do not copy a producer's full return schema into the orchestration result. Open the producer's current contract when a field or boundary is actually needed for the next decision.

The work trail is a navigation and continuity aid. Reopen its evidence before relying on it. A logged success can be stale; a missing historical label is harmless when current scope, source, outcome, and evidence are clear.

## Select the Current Owner

The orchestrator routes the smallest owner that can resolve the current delivery decision, verifies decisive evidence, and continues the goal. The current goal context or applicable handoff and the next phase's existing input/result contract remain authoritative. The orchestrator authors design and planning and remains the default user conversation throughout delivery. After a ready plan, persistent implementation Sidekicks execute implementation, associated proof, and corrections directly by default in their planned PR assignments. The user may explicitly choose direct contact with an assigned Sidekick inside its scope; a ready plan alone does not choose that branch. Material design/plan decisions, cross-assignment integration conflicts, permission boundaries, and concise completion receipts return to the orchestrator. Main does not relay every internal progress turn or poll merely to keep the conversation active, and returning to Main for conversation does not pause authorized implementation or transfer execution ownership.

Under `manage-agents`, a Sidekick may select a bounded native Worker for independent work, needed expertise, or large disposable output whose expected benefit exceeds briefing, coordination, and verification cost, and may select a native Operator for a standalone prescribed procedure. Coupled implementation/proof stays with its executor and no relay-only supervisor is introduced. The orchestrator keeps the coordination and execution roots as `orchestrator`; each implementation Sidekick contributes as `implementer` only on its execution root and the review Sidekick contributes where commissioned. Those seats describe thread participation, not authority.

The source-phase workflow follows this order:

```text
unclear user intent
  -> discuss-pathfinding before implementation orchestration

incomplete design prerequisite
  -> implementer returns the exact material design/plan question, evidence, recommendation, and blocked consequence to the orchestrator, which invokes orchestrator-design when governing design meaning must change; preserve the open implementation goal and return here

material design break discovered during planning or implementation
  -> orchestrator and user decision; do not build on the break

current reviewed design; no ready plan
  -> orchestrator loads plan-implementation and authors the plan

admitted repository improvement; no ready delivery plan
  -> preserve the plan-improve-repo admission; orchestrator loads plan-implementation and authors the plan

ready plan; terminal is plan-only
  -> finish at plan-only

ready delivery plan; implementation or proof incomplete
  -> commission/resume the planned PR implementation Sidekick(s) while Main remains the default user conversation; use direct Sidekick contact only when the user explicitly chooses it; then implement-plan per assignment after real prerequisites

development and fitting proof complete
  -> orchestrator assessment against the original need, design, plan, current diff, actual proof, complexity, PR boundaries, and integration

orchestrator assessment complete
  -> implementation-review for general-domain work
  -> skills-creation implementation review for a composed runtime skill package

accepted implementation finding; remediation count below three
  -> implement-plan by the same implementer, fresh affected proof, then the same review Sidekick

accepted specification, design, or plan finding
  -> exact semantic owner, then resume the open implementation goal

review ready; PR gates not current
  -> implementation-pr-wrapup

PR ready and unmerged
  -> default terminal; merge only under separately supplied authority
```

The assessment result makes its source-backed inspection and outcome clear rather than compressing them into “looks done.” Inspect the original need and accepted design, main-authored plan and PR scope, current diff, actual proof and gaps, ownership and naming, unnecessary complexity, and cross-PR prerequisites/integration when applicable. Do not reject adequate evidence merely because a label or field is absent.

A request for one direct phase bypasses this orchestrator. Optional `ops-*` tracking is a separate authorized side route; resume from canonical artifacts afterward because tickets prove no delivery result. A tracker Operator logs meaningful decisions, results, and blockers through the existing trail contract, never each routine execution step.

## Verify, Correct, and Recover

After every owner returns, the orchestrator inspects the source anchors that control the next decision. The review Sidekick supplies its review result after detailed source reading and lane reduction. The orchestrator checks findings against cited evidence, records why rejected findings are invalid, and routes accepted findings to their actual owner. Contextual design feedback does not replace independent review.

Normal implementation review permits at most three accepted remediation passes. After each accepted implementation correction, require fresh affected proof and fresh review coverage. Design or planning corrections follow their owners' review boundaries and do not become implementation-remediation passes.

If current evidence establishes that no review has run, use the ordinary first-review route. When prior review history should exist but its evidence cannot be inspected:

1. Inspect the current source, diff, proof, and governing basis.
2. Record which prior evidence is unavailable and why a review is necessary now.
3. Establish that no prior recovery is known and that the normal allowance is not known exhausted.
4. Pass an explicit one-time recovery request, the missing-evidence reason, current-source inspection, and the known or unknown remediation-count evidence to `implementation-review`.
5. Record the recovery outcome in the work trail.

Recovery does not fabricate a zero count, reset a known allowance, authorize repeated recovery, or excuse stale proof. If accepted findings return while the remaining correction budget is unknown, stop after reporting them and ask the user before correction.

## Finish the Goal

Before finishing, verify the material gates implied by the requested terminal, explicit proof expectations, unresolved findings and decisions, affected review coverage, and the current terminal owner's evidence.

- `plan-only`: current ready plan and governing basis are inspectable; later delivery gates are outside the requested terminal.
- `pr-ready-unmerged`: implementation proof, current bounded independent review, and current PR checks, comments, threads, head and mergeability are ready under `implementation-pr-wrapup`.
- `blocked | partial | stopped`: name the exact completed boundary, missing evidence or authority, and next owner or user decision.

Record the truthful outcome and continuation context through `track-show-me-your-work`. Contributors leave the outer thread unresolved. The orchestrator follows the tracker to inspect current activity and completion before resolving. Readable views are conditional on a request or substantial synthesis need. For pending standalone Git, PR, or watch work, wait on the Operator's completion notification or an authorized wake through `manage-agents`; never consume delivery turns polling a model.

Complete when the next owner or stop follows from current evidence, producer judgment has not been duplicated, bounded recovery/remediation rules are intact, and the finish decision matches the requested terminal and whole-work responsibility.
