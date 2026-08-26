# Goal Delivery Intent — Specification

Requirements: [user-requirements.md](user-requirements.md)

## Observable problem

The active delivery workflow requires owner approval after a completed plan even when the user invoked `orchestrator-goal` to deliver the goal. That makes the owner approve planner-owned implementation detail after already authorizing delivery.

The workflow needs to separate five decisions:

1. whether the terminal is a plan or continued delivery;
2. how reviewed design is technically implemented;
3. how independently valuable work is grouped;
4. whether those groups use one PR or separate PRs; and
5. whether tracking or merge is authorized.

It also needs three distinct artifact homes: durable design in project documentation, a resumable but untracked implementation plan in project `tmp/`, and disposable orchestrator scratch in the user's OS temporary directory.

## Desired workflow

```text
orchestrator-goal requested for delivery
              │
              ├── delivery intent is already established
              ▼
      design ──► planning
                    ├── offer optional tracking when absent
                    ├── agent chooses technical strategy
                    ├── agent proposes vertical delivery groupings
                    └── owner chooses only when grouping or PR options
                        materially change delivery
              │
              ▼
      current plan in project tmp/
              │
              ▼
      implementation ──► review ──► PR-ready, unmerged
              │
              └── stop only for a real decision, invalid input,
                  failed required proof, authority boundary,
                  design break, or narrower requested terminal

durable design       project/docs/specs/
implementation plan  project/tmp/.../*.md  (Git-ignored)
orchestrator scratch  user OS temporary directory
```

## Normative behavior

### R1 — Goal orchestration establishes delivery intent

When a user invokes `orchestrator-goal` for delivery without naming a narrower terminal, the workflow MUST continue through planning, implementation, independent implementation review, and PR readiness when each phase's current inputs are valid. It MUST NOT stop only to request generic approval of the completed plan.

The default terminal is PR-ready and unmerged. Merge remains separately authorized.

Basis: U1, U7.

### R2 — Direct planning establishes terminal intent at entry

When `plan-implementation` is invoked directly and the request does not already make the terminal clear, it MUST ask before substantive plan authoring whether the user wants:

- the plan only; or
- continued delivery after planning.

An explicit plan-only or delivery request MUST be used without re-asking. Ambiguity MUST NOT authorize implementation writes.

Basis: U2, U8.

### R3 — Planning owns technical strategy and proposes vertical delivery

Inside current reviewed design and repository constraints, planning MUST choose the technical implementation strategy and organize it around the smallest coherent vertical deliverables that cross the real entrypoint-to-effect path and can earn fitting proof.

A proposed grouping MUST make its outcome, material dependencies, proof, and delivery tradeoffs understandable. Contract, schema, fixture, or prefactoring work MAY appear when a named vertical deliverable consumes it.

Planning MUST NOT ask the owner to approve ordinary file, code, sequence, or proof mechanics that do not change product meaning, structural design, delivery grouping, PR topology, external mutation authority, or required proof.

Basis: U3, U4, U8.

### R4 — The owner chooses only materially different delivery groupings

If two or more coherent groupings materially differ in independent value, reviewability, integration risk, rollout order, or coordination cost, planning MUST present a small set of concrete options with a recommendation and tradeoffs, then obtain the owner's selection before finalizing the plan.

If only one coherent grouping exists, planning MUST use it and continue without manufacturing alternatives or asking for approval.

Basis: U4, U8.

### R5 — PR topology is a separate owner decision when it matters

When one PR and separate PRs are both materially viable, planning MUST present a recommendation, the review and integration consequences, and any dependency or stacking constraint, then obtain the owner's selection before finalizing the plan.

Repository policy or prior user instruction MAY settle the choice without another question. One indivisible deliverable defaults to one PR.

Basis: U5, U8.

### R6 — Tracking is optional and non-authoritative

If the goal has no selected `ops-*` projection and an available tracking skill exists, the workflow MUST offer once, no later than planning entry, to continue without tracking or use a named tracking skill. No tracking is the default and MUST NOT block delivery.

Selecting tracking authorizes only the mutation owned by that `ops-*` skill. Tracker state MUST NOT become design, plan, implementation, review, or approval authority.

Basis: U6, U8.

### R7 — A compact delivery context crosses phase boundaries

The phase that establishes delivery intent or finalizes planning MUST produce a compact context that later phases can read and validate. It contains only:

- requested terminal: `plan-only` or `pr-ready-unmerged`;
- current plan path once a plan exists;
- selected delivery grouping, or the fact that only one viable grouping exists; and
- PR topology when applicable.

`orchestrator-goal`, `plan-implementation`, and `implement-plan` are producers or consumers of this shared shape. Program Design may choose its encoding and may add a field only when a named producer and consumer need it. The context is not a mutable lifecycle record and MUST NOT contain content hashes, transition history, counters, progress, or approval chronology.

Basis: U1, U2, U4, U5.

### R8 — Valid delivery continues; real blockers stop it

Implementation MUST begin without another generic approval when delivery intent covers implementation, the current plan is executable against current governing design and repository source, and no real blocker is open.

The workflow MUST stop with the reason and required owner or evidence when continuation needs:

- an unmade product, public-behavior, structural-design, delivery-grouping, or PR-topology decision;
- correction of stale, contradictory, malformed, or otherwise invalid governing design or plan;
- a required proof that failed or cannot observe its obligation;
- a write, provider mutation, destructive action, or merge outside current authority; or
- a narrower requested terminal.

The workflow MUST NOT weaken or relabel required proof to avoid a stop.

Basis: U1, U7.

### R9 — Orchestrated plans are temporary project-local Markdown

For an `orchestrator-goal` delivery, `plan-implementation` MUST write one current Markdown plan beneath the target project's `tmp/` tree. Every phase that needs the plan MUST use that same path rather than create another plan authority.

Before writing the plan, the workflow MUST ensure the project's Git ignore policy covers `tmp/*`. If equivalent coverage is absent, adding `tmp/*` to the project `.gitignore` is authorized setup. The workflow MUST avoid duplicate equivalent rules and MUST NOT use Git-local exclusions or a checked-in/global fallback plan home.

The plan MUST remain available while implementation, review, correction, handoff, or PR-readiness work still depends on it. If the plan is missing, the workflow stops at the plan owner instead of reconstructing it from tickets, chat summaries, or execution state.

Basis: U9, U1, U7.

### R10 — Orchestrator scratch uses disposable OS temporary storage

`orchestrator-goal` and `orchestrator-design` MUST place private scratch, temporary working summaries, agent-transfer material, and other non-normative coordination files under the user's OS temporary directory, not under the target project or Git metadata.

The workflow MUST remain correct if that scratch is cleaned up. Scratch may point to authoritative artifacts and may cache working context, but it MUST NOT be the only home of a decision, phase result, or evidence required for continuation. After scratch loss, the orchestrator reopens current authoritative artifacts and reruns any phase whose result cannot be established; it does not reconstruct progress from memory.

No cycle identity, counter set, transition log, `state-lost` lifecycle, or recovery ledger is required.

Basis: U10, U7.

### R11 — New file-backed design uses project docs/specs

Requirements, Specification, and Program Design files created by an orchestrated design cycle MUST have separate resolvable homes beneath the target project's `docs/specs/` tree and MAY be tracked and committed. They MUST NOT use project `tmp/`, OS temporary storage, a global directory, an agent packet, or orchestration state as their normative home.

This location rule governs artifacts created by the orchestrated cycle. It does not by itself authorize moving, copying, rejecting, or superseding an authoritative pre-existing artifact in another established project documentation home.

Basis: U11, U10.

### R12 — Design review permits one review and one remediation

Each bounded design-review run—Specification-only, Program-Design-only, three-artifact design, or a runtime-skill proposal/design review—MUST invoke independent design review at most once and apply at most one accepted remediation pass.

The parent MUST disposition findings before remediation. A pedantic, stylistic, already-satisfied, or otherwise non-semantic finding MAY be rejected with source evidence and MUST NOT create a remediation or approval stop. A valid correction that stays inside the settled mental model MAY use the one remediation. A finding that disproves a load-bearing assumption, changes owner-controlled meaning, or otherwise breaks the settled mental model MUST stop with the failed assumption, evidence, consequence, and required owner; the workflow MUST NOT force it through the remediation allowance.

After remediation, the parent MUST verify the corrected anchors against the accepted findings and then end that design-review loop without automatically dispatching another reviewer. The returned result MUST distinguish the original independent coverage from parent-verified remediation. A second design review requires explicit user permission given after the first review and remediation result is visible.

This bounded-remediation rule takes precedence over any generic rule that later semantic edits stale review coverage. The exact accepted remediation is not a new unreviewed design change: original independent findings plus parent verification are the current closure evidence. Only meaning outside the accepted correction, uncertain correction effect, or a genuine mental-model break stops; none authorizes automatic rereview.

Reviewer lanes inside the one review invocation do not create additional review loops. No persistent counter, review ledger, digest, or lifecycle record is required.

Basis: U12.

### R13 — Implementation review permits at most three remediations

For implementation delivery, including runtime-skill implementation review, the workflow MAY repeat independent review after accepted implementation corrections, but MUST apply no more than three remediation passes in one bounded goal run.

If a review returns ready before the limit, delivery continues. After the third remediation pass, the workflow MUST stop without automatically dispatching another reviewer or applying another correction. Any further implementation review or remediation requires explicit user permission given after the stop result is visible.

The implementation limit is separate from R12. It is derived from the current goal's inspectable review and remediation receipts and MUST NOT introduce a persistent counter, lifecycle ledger, digest, or mutable plan field.

Basis: U13.

## Observable examples

- A default `orchestrator-goal` delivery continues from a current plan into implementation; it does not ask for generic plan approval.
- An explicit plan-only goal stops after planning, and an ambiguous direct planning request asks once at entry.
- One coherent deliverable uses one grouping and normally one PR without option ceremony.
- Materially different grouping or PR choices are presented with a recommendation and wait for the owner's selection.
- Missing tracking never blocks delivery; selecting tracking does not authorize merge or implementation.
- The project plan is written under ignored `tmp/`; orchestrator scratch is written only under OS temp; new file-backed design is written under `docs/specs/`.
- Loss of OS-temp scratch causes uncertain work to be re-established from authoritative artifacts, not recovered through counters or a lifecycle log.
- A design review runs once, accepts at most one remediation, and closes through parent verification rather than automatic rereview.
- Implementation may remediate review findings at most three times; unresolved work then stops for explicit permission.

## Proof obligations

- Goal and direct-planning scenarios prove the terminal is established once and no redundant post-plan approval occurs.
- Planning scenarios prove vertical deliverables, meaningful owner choices, and no artificial options for trivial work.
- PR scenarios prove owner selection only when one-PR and separate-PR choices are both materially viable.
- Tracking scenarios prove a single optional offer, no-tracking continuation, and provider mutation only after selection.
- Execution scenarios prove valid delivery continues and each R8 blocker still stops at the correct boundary.
- Filesystem and Git-status scenarios prove `tmp/*` ignore setup, one project-local plan path, OS-temp-only orchestrator scratch, and `docs/specs/` homes for new file-backed design.
- Cleanup scenarios prove scratch loss does not erase authoritative design or the plan and causes uncertain phase work to be rerun without lifecycle reconstruction.
- Design-review scenarios prove one independent review, evidence-backed rejection of pedantic findings, stop-on-mental-model-break, at most one bounded remediation, parent verification, and no automatic second review.
- Implementation-review scenarios prove readiness may end the loop early, remediation passes never exceed three, and the third pass stops before another review or correction.

## Implementation freedom

Program Design chooses the smallest encoding and ownership for the compact delivery context, temporary directory layouts, plan naming, cleanup mechanics, and the two separate review-remediation boundaries. It may combine planning questions into one compact exchange. It may not restore generic post-plan approval under another name, add digest or lifecycle bookkeeping, collapse design and implementation into one review budget, move authority into scratch or tickets, place the plan in checked-in documentation, or infer merge authority.
