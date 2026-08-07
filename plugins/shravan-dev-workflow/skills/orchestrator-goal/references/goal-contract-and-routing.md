# Goal Contract And Routing

This reference owns the compact long-horizon goal contract, evidence-based gate reconstruction, phase-result minimums, route examples, and resume or closeout checks. It does not own phase judgment or workflow state persistence.

Expected inputs: the user's objective and terminal intent, current repository instructions, governing artifact pointers, current branch and source identities, existing phase receipts, allowed writes, proof expectations, and explicit blockers or decisions.

Return: the goal contract, current evidence inventory, first unproven gate, the inspectable invocation packet and owner phase receipt for exactly one invoked owner or the exact stop/runtime blocker, and the terminal status.

## Compact Goal Contract

Record only what routing needs:

```text
objective:
scope and non-goals:
governing source pointers:
allowed writes and external mutations:
proof expectations:
terminal condition: <explicit narrower terminal | PR-ready and unmerged>
owner approvals or decisions already supplied:
known blockers:
```

The host goal is a carrier for objective and terminal intent. It is not evidence that a design, plan, implementation, review, PR, or release gate passed. Do not create a parallel details file, event log, transition schema, or mutable progress ledger.

For an explicitly composed runtime skill-package phase, open the current `skills-creation` source contract, then validate the exact commission identity from the existing accepted multi-run commission: accepted spec path, accepted revision or result identity, the named run or slice target, and the exact composed skill that run permits. Validate all four against both sources. A missing, stale, wrong-target, wrong-skill, or wrong-revision commission routes to `skills-creation`; do not invent a permission record or lifecycle state.

## Reconstruct The First Unproven Gate

1. Read current repository instructions and the user's terminal intent.
2. Inventory only inspectable current artifacts and phase receipts. Record the artifact pointer plus any existing producer or repository identity, claimed result, proof anchor, and semantic freshness. Never compute a document hash or digest.
3. Order only the gates implied by the terminal. A narrower terminal removes later gates; it never weakens an earlier gate it still depends on.
4. Starting from governing meaning, find the first gate without current phase-owned evidence. A later green artifact never backfills an earlier missing gate.
5. Select exactly one owner from the route map in `SKILL.md`. Pass pointers and evidence, not a copied phase procedure.
6. Before accepting either an existing or newly returned phase result, open that producer's current return contract and compare the exact identity, labels, required fields, proof and freshness anchors, and stop status. The minimum list below is a non-discard floor, never a substitute for the producer contract.

Use this reconstruction row when ambiguity exists:

```text
gate:
phase owner:
required return identity:
current evidence and freshness:
status: proven | not-applicable | unproven | blocked | decision-needed
next owner or stop:
```

`not-applicable` requires an explicit reason tied to the requested terminal or governing scope. A chat summary, ticket state, commit, branch name, goal status, or downstream result is never sufficient by itself.

## Invoke One Owner Now

Selecting or naming the owner is not invocation. Open the selected owner's current `SKILL.md`, execute its current route with one inspectable packet, and return the owner's phase receipt in this turn. If the runtime cannot invoke that owner, return the exact runtime blocker instead of a future `next_action`.

Read-only authority does not by itself defer an owner that supports read-only simulation. Execute that simulation now, return the receipt it would produce without writes, and name the writes withheld. Only the absence of a supported read-only route is an exact runtime blocker.

When `implement-plan` is the selected owner under read-only authority, complete its admission and pre-edit verdict now. Return the unchanged canonical tuple, complete approval-evidence record, `admit | blocked`, and the ready frontier plus proof contract or exact blocker. Do not defer with a future `run implement-plan` action, and do not copy its execution procedure into the goal receipt.

When `orchestrator-design` is selected for a fresh design under read-only authority, execute its supported read-only simulation now. Return the fresh `spec-design` continuation, remaining limits, and PR-ready-unmerged terminal while naming the `details.md` and `events.jsonl` writes withheld. Do not create those files and do not defer the owner. Separately authorized owner-managed temporary design state is not an `orchestrator-goal` lifecycle ledger.

When a direct `plan-handoff` phase is selected under read-only authority, return its filled handoff packet and copy-paste prompt inline now, with the unchanged canonical tuple and approval record or absence, and name the two files withheld. Do not call handoff preparation blocked merely because its normal files cannot be written, and do not replace the receipt with a future write-enabled run.

```text
invoked owner:
passed packet:
  governing authority identities:
  canonical plan tuple, result payload, and current meaning:
  approval-evidence record or explicit absence:
  base, reviewed, and diff identities:
  proof identities and observations:
  freshness pointers:
  constraints:
  proof expectations:
  authority:
owner phase receipt:
  preserved identity set: <repeat every applicable identity slot above exactly>
  result and exact blocker or route:
terminal status:
```

The packet exposes the complete owned evidence required by the selected owner, including the complete approval-evidence record when applicable. The final route decision and returned owner phase receipt each repeat every exact passed identity and its current meaning: governing authority identities, the unchanged canonical tuple and result payload, the complete approval-evidence record or explicit absence, base/reviewed/diff identities, proof identities, and freshness pointers whenever applicable. A summary such as `validated the tuple, approval, and proof` is incomplete. This preserves evidence identity without copying the owner's procedure or creating workflow state.

## Minimum Phase Returns

Verify these fields without repeating the producing skill's judgment:

- Design phases: exact target identities, phase result, current artifact pointers, semantic freshness, and one recommended next owner or stop.
- `orchestrator-design`: current design-run identity when resuming, terminal result or exact continuation, and current Requirements, Specification, Program Design, and review pointers.
- `plan-improve-repo`: admitted-finding authority or a `route | blocked` phase receipt; for an extant plan, the complete unchanged canonical tuple and result payload plus separate approval record or explicit absence; otherwise `plan identity: none`.
- `plan-implementation`: governing design/review identities or a `route | blocked` phase receipt; for an extant plan, the complete unchanged canonical tuple and result payload plus separate approval record or explicit absence; otherwise `plan identity: none`.
- `implement-plan`: unchanged canonical tuple, complete separate current-plan approval-evidence record or explicit absence, implementation base/HEAD/diff, obligation and slice coverage, proof observations, and blockers.
- `review-implementation`: unchanged canonical tuple, complete separate current-plan approval-evidence record or explicit absence, exact reviewed base/HEAD/diff, governing authority, current coverage, result, findings and routes, and correction freshness.
- An accepted `review-implementation` finding is carried whole: exact review-result identity, source anchor, cause, affected obligation, consequence, smallest correction, semantic owner, invalidated coverage, and correction freshness. A category summary is not its identity.
- `ops-*`: external identities and a link to the canonical plan. Tracking does not prove planning or delivery.
- `implementation-pr-wrapup`: open both its current `SKILL.md` and required merge-gate procedure before accepting a return. Require current owner-produced gate evidence including PR URL/number, base/head/SHA, checks, comments and reviews, mergeability, draft/readiness, freshness, and the explicit merge-authorization boundary. Consume that evidence under the owner's current contract; do not invent a separate goal receipt schema.

## Route Examples

```text
complete current three-artifact design review = ready; no plan
  -> plan-implementation

canonical draft exists; exact later owner approval absent
  -> stop at caller for approval; do not invoke implement-plan

implementation proof exists; current review receipt absent
  -> review-implementation

accepted structural ownership finding
  -> program-design; after correction require fresh affected design review,
     then follow the newly proven first gate

PR exists; exact head, checks, comments, reviews, or mergeability stale
  -> implementation-pr-wrapup

user asks only for plan-handoff
  -> bypass orchestrator-goal and invoke plan-handoff directly
```

Optional tracker publication is an owned side route. Before projecting an extant plan, open its originating planner's current return contract and validate the unchanged canonical tuple and separate approval record or absence. Invoke an available `ops-*` skill only when user intent authorizes that provider mutation. Resume gate reconstruction from the canonical plan and phase receipts afterward; tracker identifiers prove none of planning, approval, implementation, review, or PR readiness, so never wait on or read tracker state as phase authority.

## Resume And Closeout

On resume, distrust stored labels and reopen the artifact or receipt identities needed by the requested terminal. Open each selected producer's current return contract before accepting its evidence. Start from the earliest possibly stale dependency, not from the most recent optimistic status.

Before continuing, return:

```text
verified current gate:
evidence identity and freshness:
exact next owner or stop:
authority supplied:
```

Before closeout, verify every material gate implied by the terminal, every explicit proof expectation, unresolved decisions and blockers, correction-review freshness, and the terminal owner's current evidence under its current contract. For the default terminal, `implementation-pr-wrapup` must freshly establish exact PR and head identity, checks, comments/reviews, mergeability, and readiness while leaving merge unauthorized.

Complete when the goal contract is explicit, the first unproven gate is source-backed, exactly one phase owner or stop is selected, no phase judgment was duplicated, and terminal status is `reached | not reached | blocked | decision-needed` with the exact evidence boundary.
