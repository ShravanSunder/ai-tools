# Goal Delivery Intent — Program Design

Requirements: [user-requirements.md](user-requirements.md)

Specification: [2026-08-08-goal-delivery-intent.md](2026-08-08-goal-delivery-intent.md)

## Structural overview

The change is a hard cutover from post-plan approval to entry-established delivery intent. It uses the existing phase owners and one shared plan contract; it does not add a controller, lifecycle store, approval record, digest, or recovery ledger.

```text
orchestrator-goal or direct planning request
  owns: requested terminal
  exposes: delivery intent
            │
            ▼
plan-implementation
  owns: technical strategy, vertical grouping proposals, plan content
  writes: one current Markdown plan
  returns: canonical plan record + completed delivery context
            │
            ▼
implement-plan and plan carriers
  consume: current plan record + completed delivery context
  decide: execute, route a plan correction, or stop at a real blocker

artifact authority
  docs/specs/     Requirements, Specification, Program Design
  project tmp/    current implementation plan
  user OS temp/   disposable orchestrator scratch and transfer material
```

## Current system and constraint

The current workflow is compatibility-bound by one shared plan contract and several active consumers.

| Current owner | Current behavior | Evidence |
| --- | --- | --- |
| `orchestrator-goal` | Routes a completed draft to the caller when approval recorded after plan creation is absent. | `skills/orchestrator-goal/SKILL.md`; `references/goal-contract-and-routing.md` |
| `plan-implementation` | Returns `draft` with explicit approval absence and stops. | `skills/plan-implementation/SKILL.md` |
| canonical plan contract | Defines `draft`, a separate approval-evidence record, and approval-after-read execution admission. | `shared-references/canonical-implementation-plan.md` |
| `implement-plan` | Rejects execution unless the separate approval evidence covers the completed plan. | `skills/implement-plan/SKILL.md`; `references/execution-and-proof.md` |
| plan and implementation handoffs | Preserve the plan and approval record as separate inputs. | `skills/plan-handoff/`; `skills/implementation-handoff/` |
| implementation review | Requires an approved draft before meaningful general-domain review. | `skills/review-implementation/SKILL.md` |
| `orchestrator-design` | Persists project-local `details.md`, `events.jsonl`, counters, handoff identities, and terminal payloads. | `skills/orchestrator-design/SKILL.md`; `references/design-run-state.md` |

The active callers cannot be changed independently while the shared contract retains its old meanings. The cutover therefore changes the shared contract first and updates every active producer and consumer in the same changeset. Retired skills and historical changelogs remain historical evidence.

What remains authoritative:

- distinct Requirements, Specification, and Program Design ownership;
- current-source and plan validation before execution;
- proof-bearing vertical slices and real design/plan/proof stops;
- optional, non-authoritative tracking;
- PR-ready and unmerged as the default goal terminal;
- separate authority for external provider mutation and merge.

## Crux and selected direction

Two structures are credible.

| Direction | Gain | Cost | Decision |
| --- | --- | --- | --- |
| Keep approval and add an orchestrator exception | Small edit to the goal route. | Two execution-admission models, contradictory handoffs, and a permanent compatibility path. | Rejected. It violates the hard cutover and leaves direct planning semantics inconsistent. |
| Replace approval chronology with delivery context | One admission model for the goal, planner, executor, handoffs, and review. | Every active caller of the shared plan contract changes together. | Selected. The larger bounded cutover removes the ongoing dual-model cost. |

The selected direction spends complexity only on a compact shared schema with actual producers and consumers. A separate approval database, plan digest, transition history, or compatibility adapter would serve no accepted requirement and is excluded.

Revisit only if a future external consumer must execute a plan without any inspectable user request, enclosing goal, or completed delivery context. That evidence would justify reconsidering authority transport; it would not justify document hashes or mutable workflow history.

## Shared delivery and plan contracts

### Entry delivery intent

`orchestrator-goal` or a direct planning request produces this value before substantive planning:

```text
requested terminal: plan-only | pr-ready-unmerged
```

`orchestrator-goal` defaults the value to `pr-ready-unmerged` unless the user supplied a narrower terminal. A direct planner uses the explicit request or asks once when it is ambiguous.

### Ready canonical plan record

`plan-implementation` returns this record only after finalizing a ready plan:

```text
plan path: <one current Markdown path>
originating planner: plan-implementation | plan-improve-repo
planning result: ready
governing planning basis:
  kind: reviewed-three-artifact-design
  Requirements, Specification, Program Design paths
  current three-artifact review invocation and result identities
  current applicability anchors
or:
  kind: admitted-repository-improvement
  admitted finding pointer
  basis classification: current-three-artifact-design-ready |
                        implementation-mechanics-only
  basis evidence pointers
  current applicability anchors
delivery context:
  requested terminal: plan-only | pr-ready-unmerged
  delivery grouping: single:<name> | selected:<option-name>
  PR topology: not-applicable | one-pr | separate-prs
```

The path is the document identity. The governing planning basis binds the plan to its inspectable authority; the delivery context binds it to delivery intent and grouping. Both are immutable plan meaning, not progress. A meaning change creates a new plan path. No approval record, ordering evidence, content hash, digest, progress field, or lifecycle state exists.

The plan file records the same terminal, grouping, and PR-topology meaning in its header so opening the plan is sufficient to inspect the intended delivery. The returned record is the interface view of that plan, not a second authority.

`plan-improve-repo` remains a separate producer for direct repository-improvement planning. When its caller supplied no delivery intent, it uses `plan-only`; it does not gain implementation authority merely by producing a ready plan. Inside an `orchestrator-goal` delivery, it is not the plan writer: it returns the admitted finding pointer, one of its existing two basis classifications, the evidence pointers required by that classification, and current applicability anchors. The goal caller passes that unchanged return to `plan-implementation`, which validates it and records it as the `admitted-repository-improvement` governing basis of the one orchestrated plan.

The basis variants are discriminated. `current-three-artifact-design-ready` carries the exact current Requirements, Specification, Program Design, and ready three-artifact review identities. `implementation-mechanics-only` carries current-source evidence that no new product obligation, owner/boundary, interface, state/failure policy, compatibility realization, trust control, or proof seam is required. Missing, malformed, stale, or `design-required` input returns to `plan-improve-repo` or the exact semantic owner it named; `plan-implementation` does not upgrade it.

### Non-ready planning result

Unsettled grouping, PR topology, design meaning, or another blocker does not fabricate completed delivery context:

```text
planning result: revision-requested | blocked
plan identity: none | <an already-existing canonical plan record, unchanged>
result payload:
  revision-requested: exact correction and its semantic or planning owner
  blocked: exact blocker evidence and unblock owner
```

A new canonical plan does not exist until every required delivery choice is settled. When planning began from an existing canonical plan but cannot proceed, it preserves that existing record unchanged beside the non-ready result; the non-ready result does not rewrite the plan or its delivery context.

### Execution admission

`implement-plan` admits work only when:

- `planning result` is `ready`;
- `requested terminal` is `pr-ready-unmerged`;
- the plan path resolves and the opened plan agrees with the returned context;
- the opened plan contains one complete current governing planning basis whose evidence agrees with the returned record;
- the plan remains current against governing design and repository source; and
- no real design, planning, proof, authority, or environment blocker is open.

`plan-only`, `revision-requested`, `blocked`, and `plan identity: none` never enter execution. A later user request to implement a plan-only artifact must establish new delivery intent and return a new current plan path whose meaning reflects that terminal; the executor does not mutate the prior plan or infer authority.

## Ownership and dependency rules

| Owner | Responsibility | Consumers | Forbidden responsibility |
| --- | --- | --- | --- |
| `orchestrator-goal` | Establish the default or explicit terminal, route the first unproven phase, and verify returned paths/results. | Phase owners and goal caller. | Plan content, phase judgment, approval chronology, merge inference, lifecycle persistence. |
| `plan-implementation` | Admit either current ready three-artifact design or a complete current `plan-improve-repo` admitted-finding return; elicit missing direct-planning intent; at entry, preserve an existing tracking selection or offer once between no tracking and an available named `ops-*` owner; propose vertical groupings/PR topology; ensure orchestrated plan-home readiness; author the plan with its governing basis; and return the canonical record plus any selected tracking side route. | Goal router, direct planning caller, executor, handoffs, review. | Product/design invention, upgrading an invalid improvement basis, execution, tracker mutation, progress tracking. |
| goal or direct planning caller | Invoke `plan-implementation`, validate its returned record, invoke a selected named `ops-*` skill as a separate non-authoritative side route, stop for `plan-only` or a non-ready result, and invoke `implement-plan` for a ready delivery result. | Goal or direct planning user. | Plan authorship, execution admission judgment, tracker semantics, lifecycle state. |
| `plan-improve-repo` | For direct use, audit and produce admitted repository-improvement plans with `plan-only` as the default terminal. For an orchestrated goal, return the admitted finding pointer, basis classification, evidence pointers, and applicability anchors to the goal caller for validation and canonical authoring by `plan-implementation`. | Direct improvement-planning caller or goal caller. | Writing the orchestrated delivery plan, creating delivery authority, execution. |
| canonical plan contract | Define the shared governing-basis, plan, and delivery-context schemas plus validation rules. | Every plan producer/carrier/consumer. | Mutable workflow state or provider tracking. |
| `implement-plan` | Validate admission, execute slices, and return implementation proof. | Implementation review or `skills-creation` for runtime skill packages. | Altering plan meaning, choosing owner decisions, independent review. |
| `review-implementation` | Admit general-domain review from the unchanged ready plan record, its complete current governing planning basis and delivery context, implementation proof, and current diff; reject discrepancies at their originating owner; return reviewed implementation or findings. | Goal caller and PR wrap-up. | Restoring approval evidence, altering plan meaning, remediation, PR lifecycle judgment. |
| `spec-program-review` | Run one independent design review, return parent-reduced findings, and close after the semantic owner applies at most one remediation that the parent verifies against those findings. | `spec-design`, `program-design`, `orchestrator-design`, planning caller. | Automatically invoking a second design review, editing artifacts, sharing the implementation remediation budget. |
| `skills-creation` | For proposal/design review, enforce the one-review/one-remediation design boundary. For changed runtime-skill implementation review, permit at most three remediation passes before stopping. | Runtime-skill authoring caller and `orchestrator-goal`. | Collapsing the two limits, silently starting another bounded review run, persistent remediation state. |
| plan carriers | Preserve and transport the current plan record and delivery context. | Next agent or session. | Repairing plan/context discrepancies or upgrading the terminal. |
| `orchestrator-design` | Route among design owners using current artifacts and phase returns; pass `docs/specs/` as the artifact-home policy for newly created file-backed artifacts; enforce one design review and at most one remediation before continuing from parent verification or stopping for permission. | Design-phase caller, `spec-design`, `program-design`. | A second automatic design review, project-local routing state, counters, transition logs, semantic phase judgment, relocating pre-existing authority. |
| `orchestrator-goal` implementation loop | Preserve the ordered implementation review/remediation receipts in current goal call context, continue when review is ready, and stop after the third remediation if findings remain. | Implementation owner, `review-implementation` or `skills-creation`, PR wrap-up. | A fourth remediation, persistent counters, weakening findings/proof, inferring permission. |

Allowed dependencies point toward the shared canonical contract. No carrier defines a second plan/context schema. Static contract tests and pressure scenarios detect stale approval vocabulary or missing fields across active callers.

## Call-path cutover

```text
CURRENT

user goal request
  ──sync──► orchestrator-goal
             reads: requested terminal
  ──sync──► plan-implementation
             writes: plan file
  ◄─result─ canonical draft + approval absent
  ──stop──► caller approval                        removed
  ──sync──► implement-plan after approval
  ◄─result─ implementation proof | blocker

evidence anchors:
  orchestrator-goal/SKILL.md
  orchestrator-goal/references/goal-contract-and-routing.md
  plan-implementation/SKILL.md
  shared-references/canonical-implementation-plan.md
  implement-plan/SKILL.md

TARGET

user goal request
  ──sync──► orchestrator-goal
             produces: requested terminal                       changed
  ──sync──► plan-implementation
             checks: existing tracking selection
             offers once when absent: none | named ops-*         changed
             reads: requested terminal
             writes: .gitignore only if needed; one tmp plan
             settles: grouping and PR topology                   changed
  ◄─result─ ready plan + completed delivery context
             + separate tracking side-route selection            changed
  ├─ none ──► continue immediately                               changed
  └─ ops-* ─► caller invokes named tracking skill separately     changed
  ──sync──► implement-plan
             reads: plan and delivery context
             writes: planned implementation surfaces            changed
  ◄─result─ implementation proof | exact blocker                 preserved
  ──sync──► review-implementation
             reads: unchanged ready plan record + delivery context
                    + governing authority + proof + current diff  changed
             rejects: plan-only, malformed, stale, or mismatched input
                      to its exact originating owner               changed
  ◄─result─ reviewed implementation | findings | exact blocker    changed
  ──sync──► PR wrap-up ──► PR-ready, unmerged                     preserved

ORCHESTRATED REPOSITORY IMPROVEMENT

goal caller ──sync──► plan-improve-repo
                       returns: admitted finding pointer
                                + basis classification/evidence
                                + applicability anchors            changed
            ──validate► malformed | stale | design-required
                         └─► plan-improve-repo or named semantic owner
            ──sync──► plan-implementation
                       admits: complete current improvement return
                       writes: exactly one ignored tmp plan
                       records: admitted-improvement governing basis
                       returns: ready plan + delivery context      changed
            ──sync──► implement-plan
                       validates: plan-implementation origin
                                  + admitted-improvement basis     changed
            ──sync──► review-implementation
                       validates: same basis + proof + diff        changed

Direct `plan-improve-repo` use remains a separate plan-only producer and does
not enter this orchestrated delivery path without `plan-implementation`.

DIRECT PLANNING

explicit terminal ───────────────────────────────┐
ambiguous request ──► ask once at entry ─────────┤ changed
                                                 ▼
direct planning caller ──sync──► plan-implementation
                                  ◄─ ready | revision | blocked
  ├─ selected ops-* ────────────► invoke named tracking side route
  ├─ no tracking ───────────────► continue immediately
  ├─ plan-only + ready ─────────► stop with plan
  ├─ revision | blocked ────────► exact planner/unblock owner
  ├─ malformed return ──────────► plan-contract discrepancy stop
  └─ delivery + ready ──sync───► implement-plan
                                  ◄─ implementation proof | blocker
```

Errors return on the same owner chain. A malformed or stale plan returns to its originating planner; an unmade product or structural decision returns to its design owner; a failed required proof remains an implementation blocker; an unauthorized provider mutation or merge returns to the caller.

Tracking does not add a field to the canonical plan or delivery-context schema. The planner's entry check and one-time offer produce only current call context: an existing selection suppresses another offer, `none` continues immediately, and a named selection gives the goal or direct-planning caller the exact `ops-*` owner to invoke. That skill exclusively owns provider mutation and returns its own result; tracker state never controls planning readiness, execution admission, review, or PR readiness.

## Separate review-remediation boundaries

Design and implementation have different bounded routes.

```text
DESIGN

independent design review                         one invocation maximum
  ├─ ready ─────────────────────────────────────► continue
  ├─ pedantic/non-semantic finding
  │    ──► parent rejects with source evidence ─► continue
  ├─ mental-model break / owner meaning missing
  │    ──► stop with assumption + evidence + consequence + owner
  └─ accepted bounded findings
       ──► semantic owner applies one remediation
       ──► parent verifies corrected anchors against those findings
       ──► continue with original review + remediation verification

another design reviewer dispatch
  ──► stop; explicit user permission required

IMPLEMENTATION

review 1
  ├─ ready ─────────────────────────────────────► PR wrap-up
  └─ accepted findings ──► remediation 1 ──► review 2
                                              ├─ ready ──► PR wrap-up
                                              └─ findings ──► remediation 2 ──► review 3
                                                                                 ├─ ready ──► PR wrap-up
                                                                                 └─ findings ──► remediation 3 ──► stop

review 4 or remediation 4
  ──► forbidden without explicit user permission
```

The design result after remediation is not mislabeled as a second independent review. It carries the original independent review result plus the parent's source-backed verification that each accepted finding was corrected. Findings without semantic effect are rejected rather than converted into ceremony. A mental-model break stops at its owner instead of consuming the remediation allowance. The implementation route may end early whenever a review is ready. After remediation three, it stops with the remaining or newly stale coverage and exact unresolved findings; it does not launch review four.

The design boundary overrides generic receipt-freshness rules: text changed by the exact accepted remediation is current through parent verification and MUST NOT make design lanes eligible for automatic redispatch. Freshness rules still block unrelated, expanded, or uncertain semantic changes; they return `review-permission-required`, not a new review call.

Both bounds are derived from the ordered receipts already present in the current bounded call or host goal context. They add no plan field, document counter, transition log, review ledger, digest, or replay state. Scratch loss that removes the inspectable sequence makes another review/remediation unproven and therefore permission-gated rather than reconstructed from memory.

## Delivery state and legal transitions

The state is derived from the current request, plan, and proof. It is not stored in a workflow ledger.

```text
request received
  ├─ explicit plan-only ──────────────► intent: plan-only
  ├─ explicit/default goal delivery ──► intent: pr-ready-unmerged
  └─ ambiguous direct planning ───────► ask once ──► one intent above

intent + current reviewed design
  ──► planning
       ├─ revision-requested ──► no new plan; exact correction owner
       ├─ blocked ─────────────► no new plan; named unblock owner
       └─ ready
            ├─ plan-only ──────► terminal reached
            └─ delivery ───────► implementation
                                  ├─ exact blocker ──► semantic owner
                                  └─ proven work ────► review ──► PR-ready

illegal transitions
  ready without a complete delivery context  ──► malformed-plan stop
  implementation from plan-only              ──► authority stop
  merge from PR-ready                         ──► separate-authority stop
```

The plan producer owns transitions through `ready | revision-requested | blocked`. The executor owns implementation proof or its exact blocker. The goal router derives the next transition from those values and never writes a parallel status.

## Temporary artifact boundaries

### Project-local plan

For an orchestrated goal, `plan-implementation` receives the target project and `project-tmp` plan-home policy. Before writing:

1. resolve the repository root;
2. check whether the project ignore policy already covers `tmp/*` equivalently;
3. add `tmp/*` to the project `.gitignore` only when coverage is absent;
4. write one Markdown plan under `tmp/plan-workflows/<yyyy-mm-dd>-<slug>.md`;
5. return that exact path in the canonical record.

The planner performs the filesystem write because it already owns plan creation. `orchestrator-goal` verifies that an orchestrated result uses the required ignored project path. Neither owner uses `.git/info/exclude`, a checked-in plan path, or a user-global plan store.

### Orchestrator scratch

Both orchestrators may create optional scratch only beneath the host-provided OS temporary directory:

```text
<os-temp>/shravan-dev-workflow/orchestrator-goal/<date>-<slug>/
<os-temp>/shravan-dev-workflow/orchestrator-design/<date>-<slug>/
```

Scratch may contain bounded packets, source pointers, and working summaries. It is never a required state store.

`orchestrator-design` removes `details.md`, `events.jsonl`, invocation counters, handoff identities, stale-review budgets, and recorded-terminal replay. It chooses the next design owner from current durable artifacts and the current producer return. On resume, it reopens Requirements, Specification, Program Design, and any inspectable review result. If an authoring-phase result is unavailable, that phase is unproven and reruns. If the permitted design-review result or its remediation verification is unavailable, another review is permission-gated rather than silently rerun. Cleanup therefore costs repeated work but cannot change authority or silently mark work complete.

Its stateless route is explicit:

```text
fresh full-design request
  ──► spec-design
       ├─ non-ready result ───────────────► exact stop
       └─ locally-ready ─────────────────► program-design
                                            ├─ specification-gap ──► spec-design
                                            ├─ owner choice ───────► discuss-pathfinding
                                            │                          └─► program-design
                                            ├─ non-ready result ─────► exact stop
                                            └─ locally-ready ────────► three-artifact review
                                                                         ├─ ready ──► design terminal
                                                                         ├─ Why/What correction ──► spec-design once
                                                                         ├─ How correction ────────► program-design once
                                                                         └─ blocker/decision ──────► exact stop

after any semantic correction
  ──► parent verifies corrected anchors against accepted findings
  ──► preserve original review identity plus remediation verification
  ──► continue; do not dispatch another design reviewer

second design-review request in the bounded run
  ──► stop for explicit user permission

pathfinding
  ──► consume the exact return owner named by the current producer result
  ──► a different destination is a route-shape blocker

resume
  ──► open distinct durable artifacts and any current inspectable phase result
       ├─ missing Requirements or Specification ──► spec-design
       ├─ missing Program Design ─────────────────► program-design
       ├─ three artifacts; no current review ─────► three-artifact review
       └─ current ready review ───────────────────► design terminal
```

The calling agent preserves the current producer return unchanged long enough to invoke its named next owner. This is ordinary call context, not persisted orchestration state. If that return is unavailable on resume, the producing phase or review reruns; artifact meaning is never used to fabricate its lost terminal result.

For a fresh orchestrated design cycle, `orchestrator-design` also passes one call-scoped artifact-home policy to both artifact writers:

```text
new file-backed orchestrated design home: <project-root>/docs/specs/
```

`spec-design` applies it when creating the Requirements and Specification; `program-design` applies the same policy when creating the Program Design. Each returns its exact artifact paths, and `orchestrator-design` validates that newly created paths are distinct and beneath that home before continuing. This policy is input to the current calls, not persisted route state. An authoritative pre-existing artifact elsewhere is preserved and may be consumed; the orchestrator neither relocates it nor mislabels it as newly created output.

`orchestrator-goal` continues to use host goal state only for objective and terminal intent. Current artifacts and phase results prove delivery progress. Optional OS-temp scratch never substitutes for those sources.

```text
OS-temp scratch present
  ──► may accelerate packet/context reconstruction
  ──► never proves a phase

OS-temp scratch missing
  ──► reopen durable design and current plan
       ├─ inspectable phase result exists ──► validate and continue
       ├─ authoring result unavailable ─────► rerun that authoring phase
       └─ review/remediation result unavailable ─► stop for permission

No branch reconstructs counters, transitions, approval, or completion.
```

## Failure and concurrency behavior

- Concurrent planning for one goal is unsupported: the goal router accepts one current returned plan path. Competing paths are a discrepancy and return to the planner rather than being merged.
- A plan write and `.gitignore` setup are ordered within the planner. Ignore coverage must exist before the plan file is created.
- A missing or contradictory delivery context blocks execution and handoff; carriers do not repair it.
- A missing, malformed, stale, or contradictory governing planning basis blocks planning, execution, handoff, or review at its originating planner or semantic owner; consumers do not infer repository-improvement authority from plan origin alone.
- A missing, stale, malformed, plan-only, or mismatched plan record or delivery context blocks independent implementation review at the originating planner or exact semantic owner; review does not recreate approval evidence or repair the input.
- A missing temporary plan blocks at the originating planner. Tickets, chat summaries, and implementation state cannot reconstruct it.
- A newly created orchestrated design artifact outside the passed `docs/specs/` policy blocks at its artifact writer; a pre-existing authoritative artifact elsewhere remains valid input and is not moved.
- A second design review after the one permitted remediation, or a fourth implementation remediation, stops for explicit user permission; neither limit is bypassed by changing review mode, reviewer lane, or skill-package classification.
- OS-temp cleanup never requires recovery. Missing scratch is ignored; missing phase evidence causes the smallest uncertain phase to rerun from durable artifacts.
- A proof failure, design break, plan defect, out-of-scope infrastructure failure, unauthorized external write, destructive action, or merge retains its current semantic owner.
- No retry, lock, counter, transition log, or compatibility path is introduced. The workflow is synchronous at each phase boundary; later consumers validate the complete returned value.

## Cutover

The cutover is atomic across the shared canonical contract and every active caller. There is no supported mixed version in one source tree.

- `draft` becomes `ready` for a completed executable plan shape.
- approval-evidence inputs and outputs are removed.
- delivery context becomes required for plan execution and carriage.
- governing planning basis becomes required for plan execution, carriage, and review; its reviewed-design and admitted-improvement variants replace origin-only authority inference.
- independent implementation review admits the unchanged ready plan record and delivery context instead of approval evidence.
- orchestrated repository-improvement delivery routes admitted findings through `plan-implementation`; direct `plan-improve-repo` plans remain plan-only by default.
- `orchestrator-design` passes and validates the new-artifact `docs/specs/` policy without persisting route state.
- design-review callers replace automatic post-remediation rereview with parent verification and a permission-gated second review.
- implementation-review callers enforce at most three remediation passes and stop before review or remediation four.
- old pressure scenarios that demand post-plan approval become negative controls proving the approval stop is absent.
- retired skills and historical changelogs are not rewritten.

If static contract tests find old active approval semantics after the cutover, the implementation is incomplete; no adapter or alias is added.

## Proof architecture

| Requirements | Structural realization | Proof seam |
| --- | --- | --- |
| U1, U2 | Entry delivery intent plus completed delivery context; goal default and direct-planning ambiguity branch; orchestrated improvement findings route through the single delivery-plan writer with an inspectable governing basis. | Pressure scenarios for default goal delivery, narrower goal, explicit direct terminals, ambiguous direct planning, and an orchestrated improvement goal producing exactly one delivery plan. |
| U3, U4, U8 | Planner-owned vertical grouping with material-options predicate. | Plan-output scenarios for one coherent grouping and multiple material options. |
| U5 | Separate PR-topology decision in the completed context. | Scenarios for one indivisible PR, policy-set topology, and material owner choice. |
| U6 | `plan-implementation` owns the entry check and one-time offer; the goal or direct-planning caller invokes the selected named `ops-*` owner as a separate side route outside the canonical plan contract. | Scenarios proving an existing selection suppresses another offer, an absent selection produces one offer, no tracking continues immediately, the selected skill alone owns provider mutation, and tracking state cannot gate delivery. |
| U7 | Planner, executor, and independent-review admission validate the unchanged ready plan record, governing planning basis, and delivery context, plus unchanged semantic-owner routes. | Positive scenarios for both admitted improvement basis variants and reviewed design; negative scenarios for plan-only, wrong origin, missing/malformed/stale basis or context, proof failure, external mutation, review admission, and merge. |
| U9 | Planner-owned project-tmp plan setup and goal verification. | Filesystem/Git tests for existing ignore coverage, missing-rule addition, exact temporary path, no duplicate rule, and missing-plan stop. |
| U10 | OS-temp-only optional scratch and artifact-driven rerun. | Static source checks plus cleanup pressure scenarios with no counters/recovery ledger. |
| U11 | `orchestrator-design` passes the `docs/specs/` new-artifact policy to `spec-design` and `program-design`, validates returned paths, and preserves pre-existing authority elsewhere. | Artifact-location and call-contract checks plus design scenarios for a repository whose ordinary docs convention differs; existing authoritative sources are not forcibly relocated. |
| U12 | `spec-program-review`, design callers, and the proposal-review stage of `skills-creation` permit one independent review plus one parent-verified remediation and permission-gate any second review. | Scenarios for ready-first-pass, one accepted remediation, parent verification without redispatch, review-mode switching as a negative control, and explicit permission before another review. |
| U13 | `orchestrator-goal`, `review-implementation`, and the implementation-review stage of `skills-creation` preserve the current ordered receipts, end early on ready, and stop after remediation three. | Scenarios for ready on reviews one through three, three accepted remediation passes, stop before review/remediation four, missing receipt behavior, and explicit permission for any continuation. |

The deterministic TypeScript contract test is the cross-caller enforcement seam. Per-skill pressure scenarios provide behavioral evidence. Plugin validation and marketplace inspection prove packaging, not behavioral correctness.

## Cross-cutting realization

- Reliability: consumers validate complete current values and rerun unproven phases; no stored optimistic status is trusted.
- Operability: tracking remains optional; the plan path and terminal are inspectable without a lifecycle dashboard.
- Data lifecycle: the plan persists only while delivery uses it; OS-temp scratch may disappear at any time; durable design remains under project documentation.
- Security/privacy: no new secrets, network calls, credentials, or personal-data stores exist. `.gitignore` is the only authorized project configuration mutation added by plan setup.
- Compatibility: hard cutover only. Mixed approval/delivery-context callers fail static and pressure proof.
- Performance, accessibility, and capacity: not structurally applicable to text-only workflow guidance.

## Requirement coverage and simplification check

```text
U1–U2       covered  entry intent, canonical record, ordinary and improvement call-path cutover
U3–U5, U8  covered  planner ownership, grouping/PR contracts
U6          covered  planner offer ownership and caller-invoked ops side route
U7          covered  execution and independent-review admission plus failure ownership
U9          covered  project-local plan boundary
U10         covered  OS-temp scratch boundary
U11         covered  orchestrated artifact-home transport, validation, and proof
U12         covered  one design review, one remediation, parent verification
U13         covered  three-remediation implementation stop
```

Deleted mechanisms: approval chronology, approval records, project-local design orchestration state, counters, transition history, handoff correlation identities, stale-review budgets, recorded-terminal replay, digest concepts, and compatibility paths. Removing them loses no accepted requirement.

The design adds no new service, persistent store, controller, schema registry, migration, or security boundary. Planning can locate every owner, interface, failure route, cutover boundary, and proof seam without inventing structural meaning.
