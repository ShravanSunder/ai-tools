# Goal Contract And Routing

This reference owns current-source orientation, breakdown and PR-plan admission, implementation admission, meaningful result verification, the missing-history baseline, and finish decisions for one implementation delivery goal. Phase skills retain their own input and return contracts.

Expected inputs: the user's objective and requested terminal, repository instructions, current source and diff, governing artifacts, admitted-improvement evidence when applicable, the ready breakdown identity and each started PR's plan path and base as call context (the breakdown itself stores no plan paths or state), implementation proof, main-assessment evidence, review evidence, supplied authority, coordination and execution work references or unshared checkpoint path and whole-work responsibility, the orchestrator, persistent implementation 🐒 Sidekicks, the Review Sidekick for each independent PR or stack when commissioned, executors when assigned, and known blockers.

Return: a concise orientation containing the objective, scope, current basis, requested terminal, evidence freshness, next owner or exact stop, and the continuation checkpoint and whole-work completion decision.

## Orient From Current Evidence

Read enough current source to know what is being delivered before trusting summaries. Inspect only evidence relevant to the next decision:

```text
objective and scope:
requested terminal: plan-only | pr-ready-unmerged
governing basis: reviewed design | admitted repository improvement | unresolved
current source and material diff:
current breakdown, PR plans, proof, and review evidence:
prior review findings or missing-history baseline:
authority and blockers:
trail: <coordination root plus execution roots, or unshared checkpoint path> / whole-work responsibility | contribution
responsibility: orchestrator and coordination/integration gates / PR node -> persistent implementer and execution root / 🔎 Review Sidekick per independent PR or per stack: <persistent session or not yet commissioned; active layer for a stack> / executor: <assigned or implementer direct>
next owner or stop:
```

The row is a reasoning aid, not a stored schema. Do not create a goal record or require producers to restate it.

Use these inspection criteria:

- **Scope:** the result covers the obligations being delivered and names material exclusions or unresolved work.
- **Source:** the artifacts, breakdown, plan, diff, proof, and review apply to the current source. Require exact breakdown, node, base, and plan identity, reviewed diff or PR head, and source-bound proof where a mismatch would make the claim false.
- **Outcome:** the result clearly says what succeeded, what remains, and which owner or stop follows.
- **Evidence:** cited source or observed proof supports the claim at the right proof layer.
- **Boundary:** no producer exceeded its authority, weakened proof, inferred merge permission, or hid a design decision.

Do not reject a useful result solely because it lacks an expected label or opaque identity. Do not copy a producer's full return schema into the orchestration result. Open the producer's current contract when a field or boundary is actually needed for the next decision.

The work trail is a navigation and continuity aid. Reopen its evidence before relying on it. A logged success can be stale; a missing historical label is harmless when current scope, source, outcome, and evidence are clear.

## Select the Current Owner

The orchestrator routes the smallest owner that can resolve the current delivery decision, verifies decisive evidence, and continues the goal. The current goal context or applicable handoff and the next phase's existing input/result contract remain authoritative. The orchestrator owns design and remains the default user conversation throughout delivery; Main authors the breakdown and PR plans with `plan-implementation` in its own session, and this skill only admits the ready records. After a PR's plan is ready, a persistent implementation 🐒 Sidekick executes that one PR's implementation, associated proof, and corrections, with its tier and dispatch set by the staffing table in `manage-agents` (`../../manage-agents/SKILL.md`, Commission an implementation 🐒 Sidekick) from the plan's slice executor records. The user may explicitly choose direct contact with an assigned Sidekick inside its scope; a ready plan alone does not choose that branch. Material design/plan decisions, cross-assignment integration conflicts, permission boundaries, and concise completion receipts return to the orchestrator. Main does not relay every internal progress turn or poll merely to keep the conversation active, and returning to Main for conversation does not pause authorized implementation or transfer execution ownership.

Under that table, a Daily-driver 🐒 Sidekick dispatches only plan-marked independent Workhorse slices to Luna 🛠️ Workers when the benefit test holds (a slice carrying its executor record already is the brief), and any Sidekick may select an 🔧 Operator for a standalone prescribed procedure. Coupled implementation/proof stays with its executor and no relay-only supervisor is introduced. The orchestrator keeps the coordination and execution roots as `orchestrator`; each implementation Sidekick contributes as `implementer` only on its execution root and the Review Sidekick contributes where commissioned. Those seats describe thread participation, not authority.

The source-phase workflow follows this order:

```text
unclear user intent
  -> discuss-pathfinding before implementation orchestration

incomplete design prerequisite
  -> implementer returns the exact material design/plan question, evidence, recommendation, and blocked consequence to the orchestrator, which invokes orchestrator-design when governing design meaning must change; preserve the open implementation goal and return here

material design break discovered during planning or implementation
  -> orchestrator and user decision; do not build on the break

current reviewed design; no ready breakdown or first-frontier plans
  -> return ready-for-planning to Main with the admitted basis; Main writes the breakdown and first-frontier plans with plan-implementation in its own session, which reviews each full plan before ready, then returns here

admitted repository improvement; no ready breakdown or plan
  -> preserve the plan-improve-repo admission and return ready-for-planning to Main with the admitted finding pointer and basis class

a node's base now exists; its plan is not written
  -> return ready-for-planning to Main with the breakdown identity and node id

ready plan; terminal is plan-only
  -> finish at plan-only

ready breakdown and a ready PR plan; implementation or proof incomplete
  -> commission/resume that PR's implementation 🐒 Sidekick while Main remains the default user conversation; independent PRs run in parallel on separate branches or worktrees; a stack's layers are sequenced by the orchestrator through gh stack, lowest first, each as its own one-PR assignment; use direct 🐒 Sidekick contact only when the user explicitly chooses it; then implement-plan per PR after real prerequisites

Workhorse slice stops at its boundary, or an executor disagrees with its record
  -> plan-defect to Main with the breakdown identity and node id; Main re-slices or re-tags it with a reason through the originating planner while PRs the defect does not touch continue; not re-run on a bigger model, not re-cut by the Sidekick

a PR's development and fitting proof complete
  -> orchestrator assessment of that PR against the original need, design, its plan, node, base, current diff, actual proof, complexity, and scope

a PR's assessment complete
  -> that PR's 🔎 Review Sidekick (its own for an independent PR; the stack's one relationship, reviewing this layer against its parent and layer plan)
  -> implementation-review for general-domain work
  -> skills-creation implementation review for a composed runtime skill package

accepted implementation finding; review has not returned not-converging
  -> implement-plan by that PR's implementer, fresh affected proof, then Main hands the corrected result to the same 🔎 Review Sidekick for that PR or stack

accepted specification, design, or plan finding
  -> exact semantic owner, then resume the open implementation goal

a PR's review ready; its PR gates not current
  -> that PR's implementation 🐒 Sidekick or a 🔧 Operator runs implementation-pr-wrapup and returns current PR gate evidence to Main; a stack wraps up from its lowest layer up

the PRs an integration gate names are PR-ready
  -> Main runs the gate, records the exact PR heads tested together, and routes any change it finds to the affected PR's Sidekick and reviewer

every PR ready and unmerged; every named gate passed
  -> default terminal; merge only under separately supplied authority
```

The assessment result makes its source-backed inspection and outcome clear rather than compressing them into “looks done.” Inspect the original need and accepted design, that PR's main-authored plan, node, base, and scope, current diff, actual proof and gaps, ownership and naming, unnecessary complexity, and its prerequisites. Cross-PR interaction is proved separately, when Main runs the breakdown's integration gates after the participating PRs are PR-ready. Do not reject adequate evidence merely because a label or field is absent.

A request for one direct phase bypasses this orchestrator. Optional `ops-*` tracking is a separate authorized side route; resume from canonical artifacts afterward because tickets prove no delivery result. A tracker 🔧 Operator logs meaningful decisions, results, and blockers through the existing trail contract, never each routine execution step.

## Verify, Correct, and Recover

After every owner returns, the orchestrator inspects the source anchors that control the next decision. The 🔎 Review Sidekick supplies its review result after detailed source reading and lane reduction. The orchestrator checks findings against cited evidence, records why rejected findings are invalid, and routes accepted findings to their actual owner. Contextual design feedback does not replace independent review.

Implementation review continues under the convergence rule in `implementation-review`'s `references/finding-and-reduction.md`, compared per PR or per stack layer. After each accepted implementation correction, require fresh affected proof and fresh review coverage. Design or planning corrections follow their owners' review boundaries and do not become implementation-remediation passes.

If current evidence establishes that no review has run for a PR or stack layer, use the ordinary first-review route. When prior review history for that unit should exist but its evidence cannot be inspected, inspect the current source, diff, proof, and governing basis, record what is missing, and route an ordinary review; the current review sets the convergence baseline. Missing history never excuses stale proof.

## Finish the Goal

Before finishing, verify the material gates implied by the requested terminal, the breakdown's named integration gates, explicit proof expectations, unresolved findings and decisions, affected review coverage, and the current terminal owner's evidence.

- `plan-only`: the current ready breakdown, its plans, and the governing basis are inspectable; later delivery gates are outside the requested terminal.
- `pr-ready-unmerged`: for every PR, implementation proof, a current bounded independent review (per independent PR, or per layer of its stack), and current PR checks, comments, threads, head and mergeability are ready under `implementation-pr-wrapup`; and every named integration gate passed on recorded heads.
- `blocked | partial | stopped`: name the exact completed boundary, missing evidence or authority, and next owner or user decision.

Record the truthful outcome and continuation context through `practices-show-me-your-work`. Contributors leave the outer thread unresolved. The orchestrator follows the tracker to inspect current activity and completion before resolving. Readable views are conditional on a request or substantial synthesis need. For pending standalone Git, PR, or watch work, wait on the 🔧 Operator's completion notification or an authorized wake through `manage-agents`; never consume delivery turns polling a model.

Complete when the next owner or stop follows from current evidence, producer judgment has not been duplicated, review returned ready for every independent PR and every stack layer, or not-converging reached the owner as a brief, and the finish decision matches the requested terminal and whole-work responsibility.
