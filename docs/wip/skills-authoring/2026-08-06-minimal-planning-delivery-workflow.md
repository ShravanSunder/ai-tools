# Minimal Planning and Delivery Workflow Skill-Change Spec

Status: revision 18 correction complete; affected review stale

## Targets and run sequence

Owner plugin: `shravan-dev-workflow`

This is one multi-run skill-change spec. Each update run names exactly one skill target.

1. `plan-implementation` — create one repo-grounded implementation plan from the reviewed three-artifact design set.
2. `implement-plan` — validate and execute an approved plan with slice-local proof and explicit replan stops.
3. `review-implementation` — independently judge the implementation and its proof through a regimented review workflow.
4. `orchestrator-goal` — compose design, planning, optional operations tracking, implementation, review, and PR readiness without owning phase judgment.

PR0 is a hard predecessor, not a run in this spec. The user's direct commission in this conversation authorizes one separate `skills-creation` update run targeting `spec-program-review` and its active callers. Its success definition is a hard cutover from the inaccurate `pair` model to the canonical contract below, with no aliases or forwarding stubs. Historical specs, WIP evidence, changelogs, retired skills, and retired pressure scenarios stay unchanged.

```text
operation: review
mode: three-artifact-design
targets:
  Requirements identity
  Specification identity
  Program Design identity
result identity:
  exact review invocation identity
  exact review result identity
result: ready | needs-revision | blocked | decision-needed
semantic coverage:
  exact current identity and meaning coverage for each of all three targets
freshness:
  current coverage for every consumed target; uncertain semantic effect is stale
```

The verified post-PR0 `spec-program-review` source contract is the sole owner of these labels and semantics. The four runs in this spec cite that owner rather than restating it. Before any run starts, the parent must re-read the reviewed PR0 HEAD and verify that the fields above match it; a differing label or meaning expires this proposal's affected admission coverage and returns the delta to spec review.

## Problem and evidence

The retired delivery system mixed useful phase judgment with default swarms, lane packets, ledgers, controller briefs, transition logs, and repeated review machinery. That increased context and coordination cost while obscuring the simple ownership chain.

Direct repository evidence:

- `retired-skills/plan-creation-swarm/SKILL.retired.md` contains valuable design admission, live-repo grounding, vertical proof-bearing slices, dependency ordering, proof fit, and replan triggers, but also defaults to six planning lanes, per-lane artifacts, reasoning-effort assignments, and a separate review swarm.
- `retired-skills/implementation-execute-plan/SKILL.retired.md` contains valuable plan validation, bounded execution, design-break stops, proof preservation, and final verification, but also defaults to subagents, a controller brief, worker receipt protocols, slice reviews, and a final review swarm.
- `retired-skills/implementation-review-swarm/SKILL.retired.md` contains valuable source trace, compliance, false-green, runtime-reachability, proof-boundary, and finding-verification checks, but makes a swarm and many default lanes the organizing model.
- `retired-skills/orchestrator-goal/SKILL.retired.md` contains valuable first-unproven-gate routing and terminal-condition discipline, but duplicates lifecycle state through `goal_id`, `details.md`, `events.jsonl`, transition-writer precedence, and elaborate closeout contracts.
- `skills/spec-program-review/SKILL.md` demonstrates the desired review shape: exact admission, one mandatory complete independent review, at most one evidence-selected focused review by default, parent reduction, semantic-owner routing, freshness, and a coverage-bound result.
- `skills/ops-linear-tracking/SKILL.md` already owns the docs-are-truth/tickets-are-tracking split. Provider tickets should reference a canonical plan rather than become a second plan authority.
- Supplemental research in the predecessor worktree compared local retired workflows with multiple admired skill repositories and current workflow evidence. That tmp evidence may disappear and is not an acceptance anchor; its conclusion is stated and supported by the durable retired/current sources above: planning should be a dependency-aware proof route, not an execution controller or planning swarm.

Authoring basis: user-directed intent, informed by observed bloat and failure patterns. The historical failures are source evidence, but this spec does not claim a faithfully reproduced RED for every failure. Each run therefore starts from the approved success definition and uses representative pressure scenarios plus current retired-skill controls where available.

## System success definition

When a user asks to take a change through delivery, the agent can compose the existing design workflow with one canonical implementation plan, optional tracker publication, thin plan execution, independent implementation review, correction routing, and PR readiness. Each phase has one owner, each artifact has one authority, meaningful implementation is independently reviewed, and the workflow adds no default swarm, duplicate lifecycle ledger, or execution machinery to planning.

## Mental model

```text
Requirements
    |
Specification
    |
Program Design
    |
three-artifact design review = ready -------> plan-implementation --+
                                                                    |
admitted repository-improvement finding ---> plan-improve-repo -----+
                                                                    |
                                             canonical implementation plan
                                                                    +------ optional ops-* tracking projection
                                                                    |
implement-plan
    |  implementation + proof
    v
review-implementation
    |  ready -------------------------------> implementation-pr-wrapup
    |  code/proof correction
    +----------------------------------------> implement-plan
    |  planning correction -----------------> recorded originating planner
    |                                          reviewed-design: plan-implementation
    |                                          admitted-improvement: plan-improve-repo
    |  Why/What correction -----------------> spec-design
    |  structural-How correction -----------> program-design
    +  authority decision ------------------> caller

orchestrator-goal selects and verifies these transitions.
It does not perform any phase's judgment.
Direct authority selects exactly one planner. Reviewed design may remain supporting evidence for an admitted-improvement plan without changing its originating planner.
```

Requirements own Why and boundary. Specification owns observable What and proof obligations. Program Design owns structural How and proof seams. Planning chooses the smallest repo-grounded sequence that realizes those obligations. Implementation edits and proves the plan. Implementation review independently reconstructs obligation to plan to code to observation. The goal orchestrator owns route selection and terminal evaluation only.

## Decisions

The user may strike any row before acceptance.

| Decision | Default | Rationale |
| --- | --- | --- |
| Canonical planning authority | One Markdown plan; tickets are optional tracking projections | A plan-or-tickets branch creates two schemas and lets provider tickets become design authority. Existing `ops-*` skills already own external mutations and tracking mechanics. |
| Planning delegation | No default subagents or planning lanes | Repo inspection and plan synthesis are one coherent parent-owned judgment. Evidence gaps stop or route to research rather than silently creating a swarm. |
| `plan-implementation` admission | Exact current Requirements, Specification, Program Design, and ready three-artifact review; no mechanics-only bypass in this reviewed-design planner in v1 | The strict gate prevents `plan-implementation` from inventing design. It does not narrow `plan-improve-repo`'s distinct existing authority to plan from admitted repository-improvement findings, including its current implementation-mechanics-only admission. Mixed inputs still route by direct planning authority rather than using that route as a bypass. |
| Plan approval | Planning stops with `draft`; implementation requires later explicit owner approval naming the immutable completed plan path and its current meaning | Plan creation must not silently authorize code changes, and a goal cannot pre-authorize unseen future plan meaning. A semantic plan change creates a new path and requires new approval. |
| Approval and execution evidence | When an extant completed plan exists, one shared canonical-plan contract teaches production, validation, and preservation. Its tuple records the immutable plan path, originating-planner identity, planning result, and result-specific payload: `draft` carries the separate-later-approval requirement, `revision-requested` carries the exact requested correction, and `blocked` carries blocker identity, evidence, and unblock owner. The same contract owns the separate approval-evidence record—authorized approver identity, exact plan path and current meaning, approval decision, source evidence, and proof it followed completion—or an explicit-absence record. Only `draft` plus later owner approval naming that path and meaning is executable. No producer, reviewer, or carrier computes or maintains a document hash, digest, Git blob identity, or parallel version ledger. A planning admission failure returns a `route | blocked` phase receipt with governing-input identities, reason/evidence, and semantic or unblock owner. When no completed plan exists, it adds `plan identity: none`; when one exists, it travels beside the unchanged tuple and approval record/absence and blocks advancement without mutating them. | Without the absence predicate, failure invents a phantom plan or falsely erases a real one. Without one shared teaching owner for extant plans, producers and consumers guess different gates. Mutating the plan into a progress ledger or sending a plan defect to another planner gives planning and execution competing ownership. |
| Independent plan review | No separate pre-execution plan-review phase in v1; owner approval plus `implement-plan` validation guard execution, and plan defects found later route back to planning | The retired separate review lifecycle was expensive. A new independent plan-review phase should be earned by failures these two gates do not catch. |
| Implementation delegation | Inline by default; `manage-agents` only when the approved plan identifies genuinely independent disjoint slices or the user asks | Parallelism is an execution choice, not the implementation skill's identity. |
| Implementation review | Every meaningful behavior, architecture, security, runtime, or code change receives one complete fresh-context independent review | Independent reconstruction catches compliance and false-green defects that executor self-checks cannot establish. |
| Mechanical review | The orchestrator still invokes `review-implementation`; the skill may return evidence-backed `non-substantial` without model dispatch | This preserves a regimented gate without paying an independent-model cost for typo-only or generated-metadata-only changes. |
| Focused review | At most one focused reviewer by default, only for one concrete residual risk after parent reduction | Review depth follows evidenced risk; reviewer count is not quality. Additional review requires user or pre-dispatch caller authority. |
| Review remediation | Review stays read-only; accepted findings route to their semantic owner, and affected coverage is reviewed again after correction | Review must not become an editor or accept its own remediation. |
| Goal state | Reconstruct the first unproven gate from exact artifacts and evidence; no `details.md` or `events.jsonl` lifecycle ledger | The host goal plus inspectable artifacts are enough. Duplicate transition state was the primary old-orchestrator bloat. |
| Default goal terminal | PR-ready and unmerged; an explicit narrower terminal wins | This preserves the existing safe delivery boundary and keeps merge separately authorized. |
| Ticket publication | Only when user intent selects an available `ops-*` skill; publication is not planning completion | External mutations and provider details remain with operations owners. |
| Runtime skill packages | `skills-creation` remains the sole meta-workflow owner. Planner, executor, and goal orchestration require its exact parent identity when explicitly composed and otherwise route there. `review-implementation` never reviews skill authoring because `skills-creation` owns its proposal and changed-skill reviews directly. | Planning, execution, product review, or orchestration must not bypass one-skill runs, authoring review, pressure proof, or platform validation. |
| Versioning | Land the four runtime skills as one coordinated plugin release after PR0 | Cross-skill routing must appear atomically to users; partial runtime availability would create dead routes. |

Sensitive-surface decision: no scripts, hooks, executable third-party source, credentials, network mutations, or writes outside the repository are proposed by these four skill definitions. The expected `skills-creation` security route is `n/a` for each run unless implementation introduces such a surface, in which case that run must load the security gate before writing it.

## Run 1: `plan-implementation`

### Reusable behavior and success

This skill helps agents reliably translate one semantically current reviewed three-artifact design set into one repo-grounded implementation plan without inventing design or beginning implementation.

Success: given distinct current Requirements, Specification, and Program Design identities plus an exact ready three-artifact design-review result, the agent reads them completely, anchors their owners and proof seams in the current repository, writes one proportional plan built from proof-bearing slices, maps every obligation to a slice and proof gate, records dependency and collision edges, and stops before tickets, implementation, review, handoff, Git, or PR work.

Invocation: both model-invocable and user-invocable.

Proposed trigger:

```yaml
name: plan-implementation
description: Use when creating or revising a repo-grounded implementation plan after the request or current workflow identifies a Requirements, Specification, and Program Design set as its intended direct authority, including when an artifact, review readiness, or semantic freshness is missing, conflicting, or stale and must be routed before planning continues. Not for plans whose direct authority is an admitted repository-improvement finding, including source-proven implementation-mechanics-only work; changes to one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition; an existing plan handoff; tracker publication; implementation; or PR work.
```

Required reciprocal `plan-improve-repo` description cutover:

```yaml
description: Use when auditing a repository for improvement opportunities, backlog-worthy refactors, quality gaps, or leverage points and turning admitted repository-improvement findings into self-contained implementation plans, including findings admitted as implementation-mechanics-only from current source. Not for directly translating a Requirements, Specification, and Program Design set into an implementation plan, or for directly creating, updating, evaluating, or planning changes to one named runtime skill package without explicit skills-creation composition.
```

### Main path

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing composition; otherwise route there and stop. Then admit the exact reviewed design set by the landed `spec-program-review` contract. A missing, stale, conflicting, or design-gap result returns a `route | blocked` phase receipt with governing-input identities, reason/evidence, and semantic or unblock owner. IF no completed plan exists, add `plan identity: none`, route, and stop without loading the canonical-plan contract or creating an artifact. IF an extant completed plan exists, load `../../shared-references/canonical-implementation-plan.md` to validate and return its unchanged tuple plus separate approval-evidence record or explicit absence beside the blocking phase receipt; route and stop without mutating the existing plan.
2. Re-anchor against current branch, HEAD, instructions, owner modules, interfaces, tests, commands, and proof seams.
3. Trace scope, non-goals, constraints, artifact pointers, snapshot, success evidence, and stop/replan conditions to their governing artifacts. Report conflicts or stale meaning and stop at its semantic owner; continue only when carrying them requires no plan-owned invention.
4. MUST load `references/slice-and-proof-design.md` to decompose the admitted obligations into proportional proof-bearing slices and return the slice graph, proof mapping, collision/dependency edges, integration gates, false-green risks, and any split/replan stop. Contract-only and prefactoring slices require a named downstream consumer.
5. Record only necessary `requires`, `serial`, and advisory `parallel` edges; place integration gates where slices first meet.
6. Check obligation coverage, proof fit, command/path reality, write-scope fit, false-green risks, and hidden design invention in-parent.
7. MUST load `../../shared-references/canonical-implementation-plan.md` to select the proportional artifact form and repository home, produce and verify the canonical tuple and result-specific payload, and return the tuple plus explicit approval absence. Write the completed plan at one immutable path and stop. The originating planner is `plan-implementation`; approval and execution progress never live in the plan. Only `draft` may later execute, and only with separate explicit owner approval naming that path and its current meaning. A semantic change creates a new plan path.

### Surface allocation

- Trigger: reviewed-design-to-plan loading condition and adjacent boundaries.
- Main path: mental model, strict admission, seven-step spine, planning invariants, proportionality, and stop boundary.
- Depth: `../../shared-references/canonical-implementation-plan.md` is one teaching reference, not a shape-only schema. It teaches what producers inspect; proportional compact/full form and repository-home selection; immutable plan-path identity without document digests; the canonical tuple and result-specific payloads; the external approval-evidence/explicit-absence record; good/bad signals; producer and consumer validation; preservation; routing; and stop conditions. Its producers are `plan-implementation` and `plan-improve-repo`; its carriers/consumers are `implement-plan`, `review-implementation`, `orchestrator-goal`, `plan-handoff`, and `implementation-handoff`. Inline stage 3 owns source reconciliation. `references/slice-and-proof-design.md` teaches slice types, edge types, proof fit, false-green risks, and split/replan examples.
- Proof: representative pressure scenarios for valid admission; incomplete/stale/combined inputs with and without an extant plan; no-plan receipt without a phantom tuple; failed admission preserving the unchanged tuple and approval record/absence; design-gap routing; vertical slices; contract-only consumers; collision serialization; proof-fit splitting; small-plan proportionality; both planning origins emitting canonical tuples only for extant completed plans; `draft | revision-requested | blocked` result routing; and stop boundaries.

Proof posture: user-directed intent with representative hypothesis scenarios. No historical RED claim.

## Run 2: `implement-plan`

### Reusable behavior and success

This skill helps agents reliably validate and execute an approved implementation plan against the current repository while preserving its scope, proof obligations, and design-break boundary.

Success: given one complete canonical plan tuple whose planning result is `draft` plus matching later explicit owner approval evidence, the agent reads it completely, validates its assumptions and allowed write surfaces against current HEAD before editing, executes the smallest ready slice, produces the slice's required automated/manual/quality proof, integrates only when dependency gates permit, and either closes every plan obligation or stops with an exact design, plan, scope, proof, environment, or authority route.

Invocation: both model-invocable and user-invocable.

Proposed trigger:

```yaml
name: implement-plan
description: Use when executing or continuing an implementation plan, including when its immutable path, current meaning, or matching later owner approval must be validated, or when correcting accepted code, test, or implementation-proof findings explicitly routed here by review-implementation. Not for plan or design defects, changes to one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition, independent implementation review, tracker publication, or PR lifecycle work.
```

### Main path

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing composition; otherwise route there and stop. MUST load `../../shared-references/canonical-implementation-plan.md` to validate the complete tuple, result-specific payload, and separate approval-evidence or explicit-absence record and return `admit | route | blocked` with the exact reason. Admit only `draft` with later authorized-owner approval naming the immutable completed plan path and its current meaning; route `revision-requested` to the recorded originating planner and stop `blocked` at its recorded blocker/unblock owner. The skill cannot approve a plan and no earlier goal text can pre-authorize unseen plan meaning.
2. MUST load `references/execution-and-proof.md` to validate branch/HEAD, instructions, diff, named paths, dependencies, write scopes, commands, security assumptions, and proof feasibility before edits and return the pre-edit verdict, ready frontier, proof/integration contract, surprise classifications and exact routes, and completion-report contract. That reference teaches the inspection targets, pass/fail signals, examples, and stop conditions for reversible drift, design break, plan defect, out-of-scope infrastructure failure, and evidence gap.
3. Select the smallest ready frontier: inline by default; conditional `manage-agents` composition only for explicitly independent disjoint slices.
4. Execute one slice inside its write scope, using red/green when required and preserving proof gates.
5. Re-anchor and prove that slice before advancing; integrate only at the plan's named gate.
6. Classify surprises as reversible drift, design break, plan defect, out-of-scope infrastructure failure, or evidence gap and route without inventing a new seam.
7. Return the complete canonical plan tuple unchanged, its separate approval-evidence identity, and implementation/proof evidence keyed to that tuple: covered obligations/slices, fresh commands and exit codes, manual observations, quality results, changed files, incomplete rows, and blockers. Do not rewrite the canonical plan as execution state or compute a document digest. Stop before independent review, tickets, PR work, or merge.

### Surface allocation

- Trigger: approved-plan execution and review-finding remediation loading condition.
- Main path: validate-first stance, seven-step spine, inline-default execution, proof preservation, surprise classification, and stop boundary.
- Depth: the all-run shared canonical-plan reference owns plan/approval admission and preservation; one all-run `references/execution-and-proof.md` teaches frontier choice, slice proof, integration gates, correction packets, and completion reporting. `manage-agents` owns all conditional delegation mechanics.
- Proof: representative scenarios for stale plan detection, complete-tuple preservation, `draft` plus matching approval admission for both planning origins, `revision-requested | blocked` rejection/routing, unapproved-plan rejection, design-break stop, proof-gate preservation, scoped slice completion, context-free `implementation-handoff` admission to review, conditional parallelism, accepted-review remediation, and false completion.

Proof posture: user-directed intent with representative hypothesis scenarios and retired executor comparisons. No blanket claim that subagents are harmful; only default orchestration is removed.

## Run 3: `review-implementation`

### Reusable behavior and success

This skill helps agents independently determine whether an implementation and its proof satisfy the governing reviewed design and approved plan, then route source-backed corrections to the smallest semantic owner.

Success: given an exact governing reviewed-design or admitted-improvement authority, the complete path-addressed canonical plan tuple with separate matching approval-evidence identity, base and reviewed HEAD, diff range, repository instructions, and proof evidence, the workflow classifies review need, performs one complete fresh-context read-only independent reconstruction for meaningful changes, verifies and reduces every candidate finding, optionally deepens one concrete residual risk, returns a coverage-bound result, and never edits or accepts its own remediation.

Invocation: both model-invocable and user-invocable.

Proposed trigger:

```yaml
name: review-implementation
description: Use when independently reviewing implemented code, tests, proof, a branch diff, commit, PR head, or accepted remediation against its governing reviewed-design or admitted repository-improvement authority and approved implementation plan before PR readiness. Not for design-artifact review, skill-package authoring review, editing findings, standalone security scans, audits, threat models, vulnerability reviews, security diff scans, security-finding remediation, or PR lifecycle monitoring.
```

### Main path

1. Classify `general-domain | runtime-skill-package`; a runtime skill package always routes to `skills-creation` and stops. Then classify the general-domain target as `meaningful-review-required | non-substantial | blocked-input`. `non-substantial` is limited to verified formatting, typo, link-repair, or generated-metadata-only changes with no semantic or runtime effect. Any uncertain effect, behavior, architecture, security, runtime, data, migration, or meaningful code change requires independent review. Missing or conflicting governing authority, plan origin/path/approval, base/reviewed identity, diff, or claimed-proof boundary returns `blocked-input` rather than inference.
2. MUST load `../../shared-references/canonical-implementation-plan.md` to validate and preserve the unchanged tuple plus separate approval-evidence record and return its exact admission or blocker. Admit either the complete reviewed-design authority or the admitted repository-improvement authority, plus a canonical `draft` tuple with matching later approval, exact base/reviewed identities, diff, proof claims/evidence, constraints, and known gaps.
3. Resolve one complete reviewer through `manage-agents`: fresh context, read-only, candidate-only, complete sources, no expected verdict. MUST dispatch `complete-reviewer` using the shared review packet. The subagent loads `references/lanes/lane-schema.md`, `references/lanes/complete-reviewer.md`, and `references/reviewing-implementation.md`. Parallel-safe after the complete governing targets, immutable plan path and approval, base/reviewed identities, diff, proof claims/evidence, constraints, risk predicates, and prior-coverage freshness record exist; actual scheduling is serial. Instance authority is fresh-context, read-only, candidate-only, and equal to or narrower than the lane maximum. Return a `complete | partial | blocked` receipt; the parent verifies and reduces it before any focused review.
4. Collect the complete-review receipt, verify its assignment/source identity, read-only authority, target freshness, reconstruction coverage, normal/failure-path coverage, and highest-risk-crux result, and record the exact uncovered boundary. The parent does not repeat the reviewer mission.
5. MUST load `references/finding-and-reduction.md` to parent-verify and reduce every candidate against current sources and return dispositions, merged duplicates/conflicts, evidence boundaries, semantic routes, correction freshness, and the coverage-bound result.
6. If parent reduction leaves one concrete material risk, IF that exact risk remains unresolved, dispatch `focused-reviewer` using the shared review packet plus the complete-review receipt and the named risk. The subagent loads `references/lanes/lane-schema.md`, `references/lanes/focused-reviewer.md`, and `references/reviewing-implementation.md`. Parallel-safe only after parent reduction of the complete receipt; actual scheduling is serial. Instance authority remains fresh-context, read-only, focused-question-only, candidate-only, and equal to or narrower than the lane maximum. Return `complete | partial | blocked`; the parent verifies and reduces it. Additional focused review requires prior caller or current human authority.
7. Return `ready | needs-revision | blocked | decision-needed` with reviewed identities, coverage, evidence boundaries, findings, first correction, exact route, and freshness conditions. Corrections invalidate affected coverage and must be re-reviewed.

### Finding and routing requirements

Every returned finding names the exact anchor, governing obligation or invariant, concrete consequence, smallest correction, semantic owner, evidence that would confirm the correction, and parent disposition.

- Requirements or observable-contract defect -> `spec-design`.
- Structural ownership, interface, state, failure, concurrency, trust, or proof-seam defect -> `program-design`.
- Slice, sequence, write-scope, or plan-proof defect -> the plan's recorded originating planner: `plan-implementation` for reviewed-design plans or `plan-improve-repo` for admitted-improvement plans.
- Code, test, or implementation-proof defect -> `implement-plan`.
- Missing authority -> caller.

### Surface allocation

- Trigger: independent implementation correctness/proof review and strong adjacent boundaries, including an explicit exclusion for runtime skill authoring review.
- Main path: independent-reconstruction mental model, seven-step regimented workflow, proportional classification, reviewer authority, parent reduction, freshness, routing, and no-edit boundary.
- Depth: the all-run shared canonical-plan reference owns plan/approval admission and preservation; `references/reviewing-implementation.md` teaches the complete reconstruction method; `references/finding-and-reduction.md` teaches verification/reduction and owns finding/result semantics; `references/lanes/complete-reviewer.md` and `references/lanes/focused-reviewer.md` own the two qualified fresh-context jobs. `references/lanes/lane-schema.md` owns only the packet/receipt fields consumed by both lanes; missions and judgment remain in their lane and teaching references.
- Proof: representative scenarios for meaningful vs mechanical classification, complete governing-source admission, fresh independence, compliance/source trace, false-green proof, runtime reachability, finding verification, semantic routing, one-focused-review limit, correction freshness, and no-edit authority.

Proof posture: user-directed intent plus retired-review controls adapted away from swarm assumptions. Review quality is demonstrated by workflow behavior, not reviewer count.

## Run 4: `orchestrator-goal`

### Reusable behavior and success

This skill helps agents reliably take a long-horizon delivery goal through the first unproven workflow gate to its authorized terminal condition while delegating every semantic judgment and mutation to the skill that owns it.

Success: given a clear delivery objective, scope, governing sources, allowed writes, proof expectations, and terminal condition, the agent reconstructs the first unproven gate from current artifacts and evidence, invokes exactly one owning skill, verifies its result, and continues or stops without duplicating phase procedure, lifecycle ledgers, or authority.

Invocation: both model-invocable and user-invocable.

Proposed trigger:

```yaml
name: orchestrator-goal
description: Use when starting, resuming, auditing, or completing a general-domain long-horizon delivery goal that may span design, implementation planning, optional operations tracking, plan execution, independent implementation review, and PR readiness. Not for one named runtime skill package or an accepted multi-run skill-change slice without explicit skills-creation composition, a user who requests only one phase, the bounded Requirements, Specification, Program Design, and three-artifact design-review cycle alone, or unclear owner intent that still needs pathfinding or mental-model repair.
```

### Main path

1. Classify `general-domain | runtime-skill-package`. A runtime skill package requires the exact `skills-creation` parent identity authorizing composition; otherwise route there and stop. MUST load `references/goal-contract-and-routing.md` to establish objective, scope/non-goals, governing sources, allowed writes, proof expectations, terminal condition, gate-reconstruction method, route contract, and closeout checks and return the goal contract plus initial verified gate or exact blocker. Every completed plan still requires later explicit owner approval naming its immutable path and current meaning before implementation.
2. Inspect current artifacts and evidence to identify the first unproven gate; a label or chat assertion is not proof. IF a canonical plan exists or a planning result is being evaluated, load `../../shared-references/canonical-implementation-plan.md` to validate the tuple, result-specific payload, and separate approval-evidence or explicit-absence record and return the exact plan gate and route.
3. Invoke exactly one owning skill and pass only its required pointers, evidence, constraints, and authority.
4. Verify the returned artifact/evidence and classify its transition without re-performing phase judgment.
5. Continue through the allowed route or stop for owner approval, decision, blocker, or requested terminal.
6. For accepted implementation findings, route to the named semantic owner and require fresh affected review coverage before advancing.
7. Complete only when every material gate implied by the terminal is done or explicitly not applicable. Default terminal is PR-ready and unmerged; merge always requires separate authorization.

### Route map

- Unclear never-articulated intent -> `discuss-pathfinding`; drifted shared model -> `discuss-clarify-mental-models`.
- An explicit request for the complete bounded design cycle takes precedence over artifact completeness and routes to `orchestrator-design`; a fresh long-horizon delivery goal with no admitted design artifacts or a valid stored design-run continuation also routes there.
- When the request does not ask for the complete bounded design cycle, partial design artifacts without a valid design-run continuation route to the first missing phase: Requirements/observable Why/What to `spec-design`, structural How to `program-design`, complete unreviewed three-artifact set to `spec-program-review` operation `review`, mode `three-artifact-design`.
- A direct one-phase request bypasses `orchestrator-goal`. A phase-owned correction returned by review goes directly to that named owner rather than restarting a full design cycle.
- Repository-improvement audit or plan whose direct authority is admitted improvement findings -> `plan-improve-repo`; a ready reviewed design set used only as supporting evidence does not change that authority.
- Ready reviewed design without plan -> `plan-implementation`.
- Plan result `revision-requested` -> recorded originating planner; plan result `blocked` -> its named blocker; only `draft` may continue.
- `draft` plan without matching later explicit owner approval of its immutable path and current meaning -> caller stop.
- `draft` plan with matching separate approval and without implementation proof -> `implement-plan`.
- Implementation proof without current review -> `review-implementation`.
- Review findings -> the exact semantic owner selected by `review-implementation`.
- Ready implementation without PR readiness -> `implementation-pr-wrapup`.
- User-selected tracking projection -> the named available `ops-*` skill; tickets never replace the plan.

### Surface allocation

- Trigger: long-horizon delivery goal composition and direct-phase/unclear-intent boundaries.
- Main path: guarded-router mental model, seven-step evidence-driven spine, route map, plan-approval boundary, correction loop, and terminal rule.
- Depth: the conditional shared canonical-plan reference owns plan/approval gate validation; one `references/goal-contract-and-routing.md` owns compact goal shape, other evidence/gate reconstruction, route examples, minimum phase-result/freshness contracts, and resume/closeout checks. No state schema, scripts, or transition ledger.
- Proof: representative start/resume scenarios at every gate, direct-phase bypass, optional ops routing, plan approval stop, correction loop, stale evidence rejection, no duplicated phase judgment, narrower terminal, default PR-ready terminal, and no-merge boundary.

Proof posture: user-directed intent with representative scenarios and retired-orchestrator comparison. Host goal persistence is treated as platform context, not as proof of completed gates.

### Minimum route evidence

The goal router verifies only these phase-owned returns and freshness anchors; it does not repeat their judgment:

- Design phases: exact target identities, phase result, current artifact pointers, semantic freshness, and one recommended next owner or stop.
- `orchestrator-design`: current design-run identity when resuming, terminal result or exact continuation, and current Requirements/Specification/Program Design/review pointers.
- `plan-improve-repo`: a `route | blocked` phase receipt with governing-input identities, reason/evidence, and semantic or unblock owner, plus either `plan identity: none` when no completed plan exists or the unchanged extant tuple and approval record/absence; or, after admission, admitted-finding authority, complete canonical tuple with result-specific payload, and separate approval-evidence identity or explicit absence.
- `plan-implementation`: a `route | blocked` phase receipt with governing design/review input identities, reason/evidence, and semantic or unblock owner, plus either `plan identity: none` when no completed plan exists or the unchanged extant tuple and approval record/absence; or, after admission, governing design/review identities, complete canonical tuple with result-specific payload, and separate approval-evidence identity or explicit absence.
- `implement-plan`: unchanged canonical plan tuple, separate current-plan approval-evidence identity, implementation base/HEAD/diff, obligation/slice coverage, proof observations, and blockers.
- `review-implementation`: unchanged canonical plan tuple, separate current-plan approval-evidence identity, exact reviewed base/HEAD/diff, governing authority, current coverage, result, findings/routes, and freshness condition.
- `ops-*`: external identifiers and links back to the canonical plan; this projection does not prove a delivery gate.
- `implementation-pr-wrapup`: PR URL/number, base/head/SHA, checks, comments/reviews, mergeability, draft/readiness, and explicit no-merge boundary.

A missing, conflicting, status-only, or stale return stops at its owner. The router never fills a missing result by inspecting phase internals and deciding the phase again.

## Cross-run ownership and integration

- `orchestrator-design` continues to end at ready three-artifact design review and never enters planning.
- `plan-implementation` is the sole direct reviewed-design-to-plan author.
- `plan-handoff` packages an existing plan, preserves the complete canonical tuple and separate approval-evidence identity or explicit absence, and never authors or approves either.
- `implementation-handoff` packages implementation continuation or review state and preserves the unchanged canonical tuple, separate approval-evidence identity or explicit absence, and implementation proof without re-authoring any of them.
- `plan-improve-repo` continues to own admitted repository-improvement planning; direct reviewed-design translation routes elsewhere.
- `plan-improve-repo` preserves its current admitted-improvement and implementation-mechanics-only planning authority; this is a distinct direct-authority route, not a bypass around `plan-implementation` admission.
- Direct planning authority resolves mixed inputs: a reviewed three-artifact design set as authority routes to `plan-implementation`; admitted audit findings as authority route to `plan-improve-repo`. The `plan-implementation` run must add the reciprocal near-miss boundary to `plan-improve-repo`.
- `ops-*` skills own external tracker mutations. Their artifacts reference the canonical plan.
- `implement-plan` is the sole approved-plan executor and implementation-finding remediation owner.
- `review-implementation` owns independent product-implementation review. It does not review runtime skill authoring; `skills-creation` retains its own proposal and changed-skill review contracts.
- `implementation-pr-wrapup` retains PR mutation, checks, comments, review-thread, and merge-readiness ownership.
- `orchestrator-goal` owns only route selection, phase-result verification, and terminal evaluation.

The shared canonical-plan teaching has these required active caller contracts. Each call lives in the named skill's `SKILL.md`; templates consume returned fields and never call the reference themselves.

- `plan-improve-repo`: IF producing or revising a completed plan result, or validating or preserving an extant completed plan, load `../../shared-references/canonical-implementation-plan.md` to keep admitted-improvement and implementation-mechanics-only admission inline while applying the shared producer/validator contract, and return the complete canonical tuple, result-specific payload, separate approval-evidence record or explicit absence, and any blocking discrepancy. Audit-only runs and pre-artifact admission failures do not load it.
- `plan-handoff`: MUST load `../../shared-references/canonical-implementation-plan.md` to validate the existing completed plan and preserve it without re-authoring or approval, and return the unchanged complete tuple, result-specific payload, separate approval-evidence record or explicit absence, and any blocking discrepancy for the handoff packet.
- `implementation-handoff`: IF the implementation or review state derives from an extant completed canonical plan, load `../../shared-references/canonical-implementation-plan.md` to validate and preserve that plan without re-authoring or approval, and return the unchanged complete tuple, result-specific payload, separate approval-evidence record or explicit absence, and any blocking discrepancy for the handoff packet. Otherwise record `plan identity: none` plus the non-plan governing request or ticket identity and do not load the reference; the handoff never fabricates a plan tuple.

Each run updates the mandatory active callers assigned below for that one target's hard cutover. It may not implement another target early. Cross-skill routes that would point to an unavailable later target remain inside this coordinated release branch until all four targets and validations are complete.

| Owning run or integration step | Mandatory active cutovers |
| --- | --- |
| PR0 `spec-program-review` | `spec-program-review` operation/mode/reference/result labels; `orchestrator-design` and state/counters; `spec-design`; `program-design`; `spec-handoff`; `plan-improve-repo`; shared Requirements/Specification/Program Design reference; AGENTS/README design-review descriptions; generated metadata when affected; `tests/skills/lib/spec-program-design-user-requirements-contract.test.ts`; active pressure indexes, scenarios, and cases using the old term. |
| Run 1 `plan-implementation` | Add the skill, teaching shared `canonical-implementation-plan` contract, and pressure cases. Give `plan-implementation`, `plan-improve-repo`, and `plan-handoff` literal load calls returning their producer or carrier validation. Cut `plan-handoff` and `spec-handoff` unavailable-route text to the new planner; make `plan-handoff` preserve the tuple plus separate approval-evidence record or explicit absence. Add the reciprocal `plan-improve-repo` direct-authority boundary; make its skill/template instantiate the shared contract with originating planner `plan-improve-repo`; remove redundant `Status: proposed` and embedded validation-readiness state from the canonical artifact; make any `plans/README.md` index project only the canonical `draft | revision-requested | blocked` result without owning or mutating it; keep plan validation as a separate non-authoritative current-state receipt that never mutates planning result or approval. Update active routing docs/metadata that enumerate planning. |
| Run 2 `implement-plan` | Add the skill and pressure cases; cut `implementation-handoff` and `plan-improve-repo` unavailable-execution text to the new executor. Give only `implementation-handoff` the literal shared-contract call; its templates consume and preserve the returned unchanged tuple, result-specific payload, separate current-plan approval-evidence record or explicit absence, and implementation proof for context-free continuation or review. Update active routing docs/metadata that enumerate implementation. |
| Run 3 `review-implementation` | Add the skill/references/pressure cases. Hard-cut active review routing in `implementation-pr-wrapup`, `implementation-handoff`, `plan-improve-repo`, `research-swarm`, `docs-maintain`, AGENTS, and plugin README while preserving `skills-creation`'s separate skill-authoring review. Replace the `skills-creation` sentence claiming no active product implementation-review route with a boundary-safe statement; cut the review-unavailable half of `plan-improve-repo`'s combined blocker. Update active pressure indexes/cases including `implementation-pr-wrapup/low-thinking-default`, `implementation-pr-wrapup/review-routing-boundary`, and `research-swarm/substantial-stage-artifacts` so they route to `review-implementation` without making PR wrapup or research perform review. |
| Run 4 `orchestrator-goal` | Add the skill/reference/pressure cases; update AGENTS, plugin README, both plugin manifests/interfaces, marketplaces when required, and goal routing docs. Split the retired-discovery regression so retired provenance remains non-discoverable while the new active replacement is expected. |
| Final coordinated integration | Remove every active “no replacement/route unavailable” claim that the new suite supersedes; inventory all active skill names and pointers; bump one plugin version; add one public-safe changelog entry and index; run stale-route, retired-provenance, metadata, marketplace, and full validation checks. |

## Proof plan

Each behavior-changing run receives:

1. proposal-acceptance verification against this revision;
2. changed-surface implementation review through `skills-creation`;
3. targeted representative pressure scenarios for the run's named behavior;
4. targeted regression tests and the full skill unit suite;
5. typecheck and applicable JSON validation;
6. Claude plugin validation;
7. Codex marketplace listing validation;
8. diff and public-safety checks;
9. plugin version, changelog, and cache-refresh status reported honestly.

The pressure-eval suite is attempted after targeted static/unit proof. Authentication, ACPX, provider, grader, or runtime failure is reported as an environment blocker and is never claimed green. Cache refresh is a separate explicit post-push or release proof step.

## Coordination

- Proposal base: `origin/master` at `9f947c23f36e41e5740aa9879ab582a10353f6b9` on 2026-08-06.
- Current proposal worktree: branch `fix/three-artifact-design-review`.
- Pending predecessor: the separately commissioned `spec-program-review`-targeted PR0 three-artifact design-review terminology hard cutover from a fresh `origin/master` branch; its proposal review/implementation review and proof are separate from this spec's four runs.
- Use two stacked PRs and two worktrees. PR0 is based on `master`. After PR0 has a reviewed, verified commit, the suite branch/worktree is created from that exact PR0 HEAD and its GitHub base remains the PR0 branch until PR0 lands; it is then retargeted to `master` and reverified.
- PR1 review scope excludes the PR0 diff by using the PR0 branch as its base. The four runtime skill runs may begin on that stack after PR0 source review/proof; PR1 cannot become independently merge-ready against `master` before PR0 lands.
- The four named skill runs land as one coordinated plugin version and changelog release so no runtime route points to a missing skill.
- Generated metadata changes only when the owning runtime skill surface requires them.
- Existing user work in other worktrees is out of scope and must remain untouched.
- Installed Codex/Claude cache refresh is not authorized by this spec and is not a prerequisite for PR readiness.
- Reuse the persistent Claude Fable Advisor at proposal acceptance, PR0 source completion, each named skill-run checkpoint, integrated PR1 before proof, and post-remediation readiness. Every follow-up names a new assignment and exact source revision; continuity never substitutes for a source-bound receipt. A fresh-context OpenAI Sol high reviewer independently reviews the integrated implementation before the one authorized remediation cycle.

## Non-goals

- Recreating any retired swarm under a new name.
- Making tickets an alternative design or plan authority.
- Adding a planning or implementation lifecycle ledger.
- Default agent delegation in planning or implementation.
- Letting reviewers edit, remediate, accept their own fixes, or select official transitions.
- Replacing `orchestrator-design`, `spec-program-review`, `skills-creation` review, `plan-improve-repo`, handoff skills, operations skills, or PR wrapup.
- Merging PRs or refreshing installed caches without separate authority.
- Rewriting historical specs, WIP evidence, changelogs, retired skills, or retired pressure scenarios as part of PR0.

## Spec-review record

Prior accepted revision: 17

Current revision: 18

Current acceptance: stale for the document-identity and approval-binding delta; no document digest is computed or maintained

Review lanes:

- `mental-model-fit`: complete; no findings after revision-16 delta review; revision 17 does not change the mental model.
- `trigger-routing`: complete; no findings at revision 15; revisions 16 and 17 do not change a trigger or adjacent boundary.
- `rule-agreement`: complete; revision-17 delta re-reviewed in fresh context with no finding after the proposal adopted the verified PR0 owner's two separately nested result identities.
- `depth-coverage`: complete; no findings at revision 15; revisions 16 and 17 do not change a stage, reference, caller contract, or consumer.

Advisor checkpoint: persistent Claude Fable Advisor returned `great` with no remaining finding at revision 17. ACPX exposed Bash despite the declared `--no-terminal` boundary; the advisor abstained from Bash and all mutations, no writes occurred, and the parent independently verified the revision-bound receipt. A separate fresh-context Sol-high rule-agreement receipt also returned complete with no finding. The final depth receipt for revision 16 reused the same fresh-reviewer relationship after a native thread-limit failure; the parent reverified its source-bound claim against the exact caller contracts. Revision 18 requires refreshed affected review before PR readiness.

Verdict: `review-stale` for the revision-18 delta

Blocker overrides: affected spec-review coverage must be refreshed before PR readiness.

Rubric evidence: the four target runs each name one skill; triggers divide reviewed-design, admitted-improvement, execution, review, and long-horizon routing by observable authority; every promised stage has one teaching owner; literal reference callers and ceremony consumers are separated; active hard-cutover callers are assigned; proof, platform, security, versioning, cache, stacking, and no-merge boundaries are explicit.

Highest risk: cross-skill authority drift between the two planning origins and the shared canonical-plan consumers; revision 16 makes both origins visible and revision 15 binds every producer/carrier call without duplicate template routing. Revision 17 changes only the predecessor review-result identity shape.

Accepted findings: the prior rule-agreement finding about the composite predecessor review invocation/result identity was corrected in revision 17; all earlier proposal findings were corrected before this binding, and none remain open.

Rejected findings: none at revision 17.

First required revision: none known; affected review is pending.

Proof or retest implication: each affected one-skill run must read revision 18 completely, verify the post-PR0 three-artifact contract is semantically identical, run its assigned pressure and static/unit proof, and refresh review coverage affected by the immutable-plan-path and no-document-digest delta.

Semantic coverage: complete proposal promise, mental model, all four triggers and main paths, reference/lane allocation, canonical-plan ownership, approval and correction routing, active caller cutovers, proof plan, stacking, version/changelog landing, cache boundary, and no-merge terminal.

Implementation decision: implementation correction is user-directed; PR readiness remains blocked on refreshed affected spec review.
