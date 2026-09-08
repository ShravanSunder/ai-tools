# Goal Contract And Routing

This reference owns current-source orientation, planning and implementation admission, meaningful result verification, bounded recovery, and finish decisions for one implementation delivery goal. Phase skills retain their own input and return contracts.

Expected inputs: the user's objective and requested terminal, repository instructions, current source and diff, governing artifacts, admitted-improvement evidence when applicable, the canonical plan, implementation proof, review evidence, supplied authority, trail path and ownership, and known blockers.

Return: a concise orientation containing the objective, scope, current basis, requested terminal, evidence freshness, next owner or exact stop, and whether this owner must finish the trail.

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
trail: <path> / owned | borrowed
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

Route the smallest owner that can resolve the current decision, then verify its result and continue the same goal:

```text
unclear user intent
  -> discuss-pathfinding before implementation orchestration

incomplete design prerequisite
  -> orchestrator-design; preserve the open implementation goal and return here

material design break discovered during planning or implementation
  -> user decision through the named design owner; do not build on the break

current reviewed design; no ready plan
  -> plan-implementation

admitted repository improvement; no ready delivery plan
  -> preserve the plan-improve-repo admission and invoke plan-implementation

ready plan; terminal is plan-only
  -> finish at plan-only

ready delivery plan; implementation or proof incomplete
  -> implement-plan

current implementation proof; independent review absent or stale
  -> review-implementation for general-domain work
  -> skills-creation implementation review for a composed runtime skill package

accepted implementation finding; remediation count below three
  -> implement-plan, fresh affected proof, then another bounded review

accepted specification, design, or plan finding
  -> exact semantic owner, then resume the open implementation goal

review ready; PR gates not current
  -> implementation-pr-wrapup

PR ready and unmerged
  -> default terminal; merge only under separately supplied authority
```

A request for one direct phase bypasses this orchestrator. Optional `ops-*` tracking is a separate authorized side route; resume from canonical artifacts afterward because tickets prove no delivery result.

## Verify, Correct, and Recover

After every owner returns, inspect the source anchors that control the next decision. Parent-disposition review candidates: accept only findings supported by current source and governing meaning, record why rejected findings are invalid, and route accepted findings to their actual owner.

Normal implementation review permits at most three accepted remediation passes. After each accepted implementation correction, require fresh affected proof and fresh review coverage. Design or planning corrections follow their owners' review boundaries and do not become implementation-remediation passes.

If current evidence establishes that no review has run, use the ordinary first-review route. When prior review history should exist but its evidence cannot be inspected:

1. Inspect the current source, diff, proof, and governing basis.
2. Record which prior evidence is unavailable and why a review is necessary now.
3. Establish that no prior recovery is known and that the normal allowance is not known exhausted.
4. Pass an explicit one-time recovery request, the missing-evidence reason, current-source inspection, and the known or unknown remediation-count evidence to `review-implementation`.
5. Record the recovery outcome in the work trail.

Recovery does not fabricate a zero count, reset a known allowance, authorize repeated recovery, or excuse stale proof. If accepted findings return while the remaining correction budget is unknown, stop after reporting them and ask the user before correction.

## Finish the Goal

Before finishing, verify the material gates implied by the requested terminal, explicit proof expectations, unresolved findings and decisions, affected review coverage, and the current terminal owner's evidence.

- `plan-only`: current ready plan and governing basis are inspectable; later delivery gates are outside the requested terminal.
- `pr-ready-unmerged`: implementation proof, current bounded independent review, and current PR checks, comments, threads, head and mergeability are ready under `implementation-pr-wrapup`.
- `blocked | partial | stopped`: name the exact completed boundary, missing evidence or authority, and next owner or user decision.

If the trail is owned, finish and render it at the end with the truthful outcome. If borrowed, append the material result and leave finalization to the outer owner.

Complete when the next owner or stop follows from current evidence, producer judgment has not been duplicated, bounded recovery/remediation rules are intact, and the finish decision matches the requested terminal and trail ownership.
