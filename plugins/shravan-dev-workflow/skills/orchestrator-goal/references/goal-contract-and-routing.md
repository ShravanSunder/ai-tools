# Goal Contract And Routing

This reference owns the compact long-horizon goal contract, evidence-based gate reconstruction, owner invocation, and resume or closeout checks. It does not own phase judgment or workflow state persistence.

Expected inputs: the user's objective and terminal intent, current repository instructions, governing artifact pointers, current branch and source identities, existing phase receipts, allowed writes, proof expectations, and explicit blockers or decisions.

Return: the goal contract, current evidence inventory, each first-unproven-gate decision in order, one invocation packet and verified result per owner invoked, or the exact stop/runtime blocker, and the terminal status.

## Compact Goal Contract

Record only what routing needs:

```text
objective:
scope and non-goals:
governing source pointers:
allowed writes and external mutations:
proof expectations:
terminal condition: <explicit narrower terminal | PR-ready and unmerged>
owner decisions already supplied:
implementation remediation receipts in this bounded goal: <0..3 inspectable receipts>
known blockers:
```

The host goal is a carrier for objective and terminal intent. It is not evidence that a design, plan, implementation, review, PR, or release gate passed. Do not create a parallel details file, event log, transition schema, or mutable progress ledger.

For an explicitly composed runtime skill-package phase, open the current `skills-creation` source contract, then validate the exact commission identity from the existing accepted multi-run commission: accepted spec path, accepted revision or result identity, the named run or slice target, and the exact composed skill that run permits. Validate all four against both sources. A missing, stale, wrong-target, wrong-skill, or wrong-revision commission routes to `skills-creation`; do not invent a permission record or lifecycle state.

## Reconstruct The First Unproven Gate

1. Read current repository instructions and the user's terminal intent.
2. Inventory only inspectable current artifacts and owner results. Record the artifact pointer plus any existing producer or repository identity, claimed result, proof anchor, and whether the result still applies to the current source. Never compute a document hash or digest.
3. Order only the gates implied by the terminal. A narrower terminal removes later gates; it never weakens an earlier gate it still depends on.
4. Starting from governing meaning, find the first gate without current phase-owned evidence. A later green artifact never backfills an earlier missing gate.
5. Select exactly one owner from the route map in `SKILL.md`. Pass pointers and evidence, not a copied phase procedure.
6. Before accepting either an existing or newly returned phase result, open that producer's current return contract and compare the exact identity, labels, required fields, proof anchors, source freshness, and stop status.

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

## Invoke One Owner At A Time

Selecting or naming the owner is not invocation. Open the selected owner's current `SKILL.md`, execute its current route with one inspectable packet, and preserve the owner's phase receipt in this run. Verify it, reconstruct the next first-unproven gate, and repeat until the requested terminal or a real stop. If the runtime cannot invoke an owner, return the exact runtime blocker instead of a future `next_action`.

Read-only authority does not by itself defer an owner that supports a read-only route. Execute that route now, return its supported result, and name the writes withheld. Only the absence of a supported read-only route is an exact runtime blocker.

When `implement-plan` is the selected owner under read-only authority, complete its start check and pre-edit verdict now. Return its supported read-only result unchanged. Do not defer with a future `run implement-plan` action, and do not copy its execution procedure into the goal result.

When `orchestrator-design` is selected for a fresh design under read-only authority, execute its supported read-only route now. Return the fresh `spec-design` continuation while naming the writes withheld. Do not create those files and do not defer the owner. Optional OS-temp scratch is not an `orchestrator-goal` lifecycle ledger.

When a direct `plan-handoff` phase is selected under read-only authority, return its filled handoff packet and copy-paste prompt inline now, with the unchanged plan, governing basis, and delivery context, and name the two files withheld. Do not call handoff preparation blocked merely because its normal files cannot be written.

```text
invoked owner:
passed packet:
  assignment and requested terminal:
  source binding: <pointers and identities required by the owner's current contract>
  constraints and authority:
owner result: <producer's unchanged supported return>
verification: <result belongs to this packet and still applies to current source | exact discrepancy>
terminal status:
```

Each packet contains exactly the inputs required by that selected owner's current contract. Each owner result is preserved once, unchanged. Its verification line proves that the result belongs to the packet and current source; it does not repeat the producer's fields or judgment. A verified non-terminal result starts the next gate reconstruction immediately. For `implementation-pr-wrapup`, consume its current gate result directly and preserve its separate merge-authorization boundary.

## Route Examples

```text
complete current three-artifact design review = ready; no plan
  -> plan-implementation

canonical ready plan exists; requested terminal is pr-ready-unmerged
  -> validate governing basis and delivery context, then invoke implement-plan

canonical ready plan exists; requested terminal is plan-only
  -> stop at the requested terminal

implementation proof exists; current review receipt absent
  -> review-implementation

accepted structural ownership finding
  -> program-design once; parent verifies the accepted correction against
     the original design review, then continue without another design review

implementation review finding; fewer than three remediations completed
  -> exact implementation owner; after proof, invoke the next bounded review

third implementation remediation completed
  -> stop remediation-limit-reached; do not invoke review or remediation four

PR exists; exact head, checks, comments, reviews, or mergeability stale
  -> implementation-pr-wrapup

user asks only for plan-handoff
  -> bypass orchestrator-goal and invoke plan-handoff directly
```

Optional tracker publication is an owned side route. Before projecting an extant plan, open its originating planner's current return contract and validate the unchanged plan, governing basis, and delivery context. Invoke an available `ops-*` skill only when user intent authorizes that provider mutation. Resume gate reconstruction from the canonical plan and owner results afterward; tracker identifiers prove none of planning, implementation, review, or PR readiness.

## Resume or Finish the Goal

On resume, distrust stored labels and reopen the artifact or receipt identities needed by the requested terminal. Open each selected producer's current return contract before accepting its evidence. Start from the earliest possibly stale dependency, not from the most recent optimistic status.

Use the gate row above for resume. Do not create a second resume record. Before continuing, ensure it names the verified current gate, evidence freshness, exact next owner or stop, and supplied authority.

Before closeout, verify every material gate implied by the terminal, every explicit proof expectation, unresolved decisions and blockers, affected review coverage, and the terminal owner's current evidence under its current contract. For the default terminal, use the current `implementation-pr-wrapup` result; do not restate its PR schema here. Merge remains separately authorized.

Complete when the goal contract is explicit, every routed first-unproven gate is source-backed, only one phase owner was active at a time, no phase judgment was duplicated, and terminal status is `reached | blocked | decision-needed` with the exact evidence boundary.
