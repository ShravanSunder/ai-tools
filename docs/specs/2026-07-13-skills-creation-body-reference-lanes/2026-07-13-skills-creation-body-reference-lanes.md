# Skills Creation Body, Reference, And Lane Design

Status: accepted to implement after proof-expansion skill-spec review

## Product Intent

`shravan-dev-workflow:skills-creation` should make the information architecture of a great skill obvious from the material an author always loads.

An author should be able to answer four different questions without conflating them:

1. What belongs in the authored skill's `SKILL.md` body?
2. Which detailed references must load on every run, and which load only if an observable branch predicate is true?
3. What belongs inside an opened reference rather than at its caller-owned call site?
4. When is work parallelizable and safe to dispatch to a subagent as a lane, and when does a repeated shape deserve a schema?

The redesign makes the authored `SKILL.md` body contract explicit in `skills-creation/SKILL.md`, keeps ordinary reference placement in `reference-design.md`, and creates `reference-lanes-design.md` for parallel-safe, handoff-ready lanes and shared-shape design. It removes `workflow-topology.md` and `schema-design.md` as standalone authoring references after their unique guidance has one new owner.

Success is not a more rigid template. Success is lower retrieval cost and more predictable allocation while preserving room for different skill shapes and domain judgment.

## Source Precedence And Relationship To The Earlier Spec

For body, ordinary-reference, lane, and shared-shape decisions, precedence is:

1. the current user decisions captured by this spec;
2. this spec;
3. the current live `skills-creation` source as evidence of existing behavior and active consumers;
4. `docs/specs/2026-07-02-creating-skills-skill-spec.md` for historical intent;
5. temporary SOP, upstream, and lane artifacts as non-runtime design evidence.

This spec narrowly supersedes the earlier spec's body/reference allocation where the two conflict:

- Earlier R1 and R1a remain authoritative for the meta skill's operational workflow, shared run state, gates, proof, and completion. This spec supersedes only their fixed presentation prescription: the authored target body uses flexible required concepts, and the meta skill need not preserve one exact compact branch-table layout when its call sites carry the required routing contract.
- Earlier R1b remains authoritative that all-run obligations, invariants, decisions, and completion criteria stay visible in `SKILL.md`. This spec clarifies that a coherent detailed procedure used by every run may live in a `MUST load` reference; moving the detail does not move or hide the all-run obligation.
- R3's rule that an opened reference repeats its load trigger is replaced by single-owner caller/callee routing: the calling `SKILL.md` owns when to load; the opened reference owns what to do and return.
- the earlier ban on a global shared runtime lane contract remains in force.
- trigger/frontmatter, proof-first discipline, failure-form matching, platform mechanics, security routing, review, pruning, and shipping contracts remain governed by the earlier spec and the current skill unless this spec says otherwise.

The earlier spec remains in place. It is not rewritten as process history during this focused change.

## Current Problem

The live skill contains the right ingredients but distributes one ordinary authoring decision across several sources:

- Steps 4-8 of `skills-creation/SKILL.md` mention the mental model, main path, workflow branches, reference placement, schemas, steering, and completion.
- `workflow-topology.md` separately defines the ordinary route from mental model through all-run spine, conditional reference call, return, and completion.
- `reference-design.md` already states the correct caller/callee boundary, but treats every reference as conditional branch depth and points to a separate schema guide.
- `schema-design.md` contains three semantically different shared-shape families.
- `glossary.md` defines a lane only as an independent workflow step, which is too weak to distinguish a lane from any coherent branch.

As a result, the current skill can produce the correct answer, but the authored `SKILL.md` body contract is implicit and retrieval-heavy. An author must reconstruct ordinary anatomy from multiple files before deciding whether depth is an ordinary reference, a lane, or a shared shape.

The design pressure is not only file count. Two ownership boundaries need to become explicit:

- knowing when to call a reference is a caller responsibility;
- knowing what to do after it is opened is a callee responsibility.

Two independent axes are currently collapsed:

```text
load mode:       MUST load | IF <predicate>, load
execution shape: ordinary reference | parallel-safe, handoff-ready lane
```

A reference is therefore not synonymous with a branch. A coherent detailed all-run step may use a `MUST load` reference for maintainability while the step's obligation, order, decision, required return, invariant, and completion remain in `SKILL.md`.

A lane is parallelizable work that can be handed to a subagent. Parallelizability and safe handoff are required properties, but they are not sufficient by themselves: the lane still needs a bounded mission, packet, authority, return, and parent reduction.

## Behavior Baseline

Five fresh-context repetitions applied the current skill to the same mixed authoring problem: one ordinary Cargo reference, three independent read-only investigations, and one shared result shape.

All five repetitions produced the intended semantic allocation:

- mental model and all-run spine in `SKILL.md`;
- Cargo-specific depth in an ordinary reference;
- bounded investigations as lanes;
- a Markdown `lane-schema` for shared lane context and returns;
- parent-owned verification and reduction.

The runs also loaded the same five source files and surfaced the same prompt ambiguities around an unobservable "when beneficial" predicate and unnamed ecosystems.

Two focused three-repetition baselines then tested the corrected boundaries:

- **Lane definition:** 3/3 classified parent-coupled work as ordinary and bounded independent inspections as lanes, but 3/3 said parallelizability and safe subagent handoff were optional or unstated. This is a definition and proof gap, not a demonstrated misclassification in that probe.
- **Reference load mode:** 3/3 said a coherent detailed procedure required on every run must be inlined in `SKILL.md`; all three treated an always-loaded reference as unsupported or effectively forbidden. This is demonstrated RED for the desired `MUST load` placement behavior.

A third three-repetition baseline tested the complete caller grammar without showing reviewers the proposed literal forms:

- **`MUST load`:** 3/3 kept the complete all-run procedure inline and produced no mandatory-reference call. This confirms the demonstrated placement RED above.
- **`IF <predicate>, load`:** 3/3 produced semantically conditional provider calls using natural-language `When ... load`, but none used the literal `IF` form. Conditional routing behavior is a passing semantic control; the exact caller grammar is RED.
- **`MUST dispatch`:** 3/3 expressed an all-run lane without the literal form; the calls inconsistently said `load` or described direct/subagent execution instead of one caller-owned dispatch grammar. The exact form and dispatch action are RED.
- **`IF <predicate>, dispatch`:** 3/3 expressed the risk predicate without the literal form and inconsistently used `load` or dispatch-like prose. The exact form and dispatch action are RED.

All three generation repetitions kept the caller's entry condition out of the opened reference. A separate adversarial current-guidance review then evaluated a deliberately bad reference containing `Load this reference when provider X is selected.` It returned `targeted-revision` and cited the existing caller-owned routing rule. Callee-routing ownership is therefore a passing review control, not demonstrated RED, but it has no permanent artifact-scoped regression test.

Normative proof classification for this cutover is mixed and must remain honest:

```text
existing mixed ordinary-reference/lane allocation -> passing equivalence control
MUST-load all-run detailed reference              -> demonstrated RED
literal IF-load caller grammar                    -> exact-form RED; semantic control passes
literal MUST/IF dispatch grammar                  -> exact-form and dispatch-action RED
parallelizable, subagent-handoffable lane gate    -> explicit proof gap
callee must not repeat its own entry routing      -> passing review control; permanent proof gap
```

The general RED-before-edit rule remains unchanged. Implementation must turn the demonstrated reference-load and caller-grammar RED cases green, close the lane-definition and permanent callee-routing proof gaps with countercases, and preserve the passing semantic controls.

## Definitions

### Authored Skill

The named skill being created, updated, or evaluated by `skills-creation`. References to the authored `SKILL.md` mean this target artifact, not the meta skill's own file.

### All-Run Spine

The decisions and work every invocation of the authored skill needs from load to completion. It belongs in the authored `SKILL.md`. It may be expressed as steps, a compact route, or a reference-oriented main path. Steps are ordered only when order changes behavior.

### Branch

An observable condition that changes the workflow. A branch is expressed with `IF <predicate>`. It is a route, not a file. Its destination may be an ordinary reference, a lane, a script, a platform mechanism, or another explicit action.

### Load Mode

The caller uses one of two mutually exclusive forms:

```text
MUST load <reference>            -> every run follows this reference pass
IF <predicate>, load <reference> -> only that branch follows the reference
```

`MUST` means always. `IF` means branch. Each call uses exactly one leading marker; combining the markers blurs the topology.

### Ordinary Reference

Depth that the current workflow opens, uses, and returns from directly. It may own the detailed procedure for an all-run step reached through `MUST load`, or conditional branch depth reached through `IF <predicate>, load`. It does not become a lane merely because it is provider-specific, detailed, packet-shaped, or stored in its own file.

### Lane

A parallelizable work boundary that can be handed to a subagent once its declared prerequisites and bounded context are supplied. The subagent can complete the mission without live access to the parent's hidden reasoning or another lane's in-flight intermediate state. The lane returns a shaped receipt that the parent verifies and reduces into the overall workflow.

Parallel safety and bounded subagent handoff are necessary, not sufficient. A lane also needs an owned mission, explicit authority, dependencies, completion or blocked return, and parent reduction. Dependencies define readiness waves: a lane may consume completed prerequisite results, but once ready it has no semantic dependency that prevents concurrent execution with other ready work.

Independence is semantic, not a runtime mandate. A qualified lane may run locally, sequentially, concurrently, or in a subagent. Runtime serialization, lack of a ready peer, or lack of an available subagent slot does not change the classification. If the work intrinsically requires ongoing parent interaction, cannot safely overlap with other ready work, or cannot be handed off from bounded context, it is a parent-owned step or ordinary reference, not a lane.

### Parent

The workflow owner that dispatches or runs lanes, verifies their receipts, resolves overlap and contradictions, and owns the final cross-lane decision. A lane can have scoped execution authority without gaining final authority over the complete workflow.

### Shared Shape

A stable set of fields or values justified by a real consumer. The consumer determines whether the shape is a `lane-schema`, `output-schema`, or `tool-schema`. Repeated formatting without a consumer is not enough.

## Spec Boundary And Separability Map

```text
frontmatter-design.md
  owns: when and why the whole authored skill loads
  exposes: trigger and invocation decision

skills-creation/SKILL.md
  owns: authored SKILL.md body contract, ordinary all-run workflow anatomy,
        separate MUST and IF reference grammar, lane dispatch grammar, always-needed
        steering, completion boundary
  exposes: compact authoring path and explicit MUST load, IF load,
           MUST dispatch, and IF dispatch pointers
             |
             | ordinary mandatory or conditional depth
             v
reference-design.md
  owns: MUST load versus IF load placement and ordinary reference
        caller/callee contract
  exposes: always-loaded and conditional reference contents plus pruning
             |
             | parallel-safe, handoff-ready work or a real shared-shape consumer
             v
reference-lanes-design.md
  owns: parallel-safe, handoff-ready lane qualification, lane job contracts,
        dependencies, authority, parent reduction, shared-shape selection
  exposes: authoring guidance, not a shared runtime packet
             |
             v
authored skill-local references/, schemas/, and scripts/
  own: actual lane missions, packets, output shapes, validators, and mechanics
  expose: results consumed by that authored skill

tests/skills/
  owns: artifact-scoped structural and behavior proof
  exposes: equivalence, countercase, and regression evidence
```

Each surface has one reason to change:

- `skills-creation/SKILL.md` changes when the always-needed skill-authoring workflow changes.
- `reference-design.md` changes when ordinary information placement or caller/callee design changes.
- `reference-lanes-design.md` changes when advanced lane coordination or reusable-shape selection changes.
- authored skill-local artifacts change when that skill's actual runtime contract changes.

The combined lane/shared-shape reference intentionally has two related concerns. That cost is accepted because the user wants one advanced design lane and because both concerns begin only after ordinary reference placement is insufficient. Separate entry predicates keep non-lane schemas semantically independent.

## Requirements

### R1. `skills-creation/SKILL.md` Must State The Authored Body Contract

The meta skill must explicitly state that every authored `SKILL.md` body contains the following concepts when applicable:

1. **Mental model or stance.** Name the lens, leading concept, or domain model that improves judgment and stabilizes the promised behavior.
2. **All-run spine.** Show the work from load to completion in one scan. Use ordered steps only where order changes behavior.
3. **Checkable local completion.** Every meaningful work step or reference pass ends with a condition that proves the necessary legwork occurred.
4. **Always-needed steering and invariants.** Rules every run needs stay inline and near the decision they govern; they are not hidden exclusively in ordinary or lane references.
5. **Reference calls.** Each call begins with exactly one load mode: `MUST load` for all-run detail, or `IF <observable predicate>, load` for branch-only detail. It then states the destination path, requested work, and result the main path needs back.
6. **Lane dispatch, when a lane is handed to a subagent.** Each call begins with `MUST dispatch` for an all-run lane or `IF <observable predicate>, dispatch` for a conditional lane. It names the lane, supplied packet including prerequisites and dependency state, lane reference the subagent loads, parallel-safety basis, instance authority bounded by the lane reference, expected receipt, and parent reduction point. The caller may narrow the lane reference's stable maximum authority for one dispatch; it must never widen it. Eligible overlap may be named when it exists; actual concurrent scheduling is not required.
7. **Overall completion boundary.** State the proof, unresolved conditions, or blockers that prevent a done claim.

These are required content concepts, not mandatory literal headings, a universal table, or one fixed prose template. A small reference skill and a multi-step discipline skill may express the contract differently.

The main path must remain compact enough to scan. Long examples, provider mechanics, branch-local rubrics, and exceptional procedure stay behind strong pointers.

### R2. Workflow Topology And Quick-Reference Grammar Are Intrinsic Body Anatomy

The all-run route, mandatory detail, conditional branches, and lane dispatch must be teachable from `skills-creation/SKILL.md` without loading a standalone topology manual.

The route model is:

```text
trigger
  -> mental model or stance
  -> all-run spine
       -> MUST load all-run detailed reference
       -> IF observable predicate, load branch reference
       -> MUST dispatch all-run subagent lane
       -> IF observable predicate, dispatch conditional subagent lane
  -> overall completion and proof boundary
```

`skills-creation/SKILL.md` must contain this quick-reference grammar in the always-loaded body:

```text
Reference
  MUST load `<reference>` and return `<result>`.
  IF `<predicate>`, load `<reference>` and return `<result>`.

Lane handoff
  MUST dispatch `<lane>` to a subagent using `<packet>`.
  IF `<predicate>`, dispatch `<lane>` to a subagent using `<packet>`.
  Subagent loads `<lane-reference>`.
  Parallel-safe after `<prerequisites>`; actual scheduling may serialize.
  Return `<receipt>`; parent verifies and reduces it.
```

The forms are mutually exclusive at a call site. `MUST` marks the always path. `IF` marks a branch. `LOAD` consumes reference content; `DISPATCH` hands lane work to a subagent.

This model describes behavior, not a file tree. The implementation may integrate it into the existing workflow rather than add a large new essay, but it must preserve the following steering:

- do not create branches for topics that do not change the work;
- do not hide an all-run gate inside a reference;
- do not call a branch complete when it returns only "more context";
- do not order checklist items unless order changes behavior;
- do not hide an all-run obligation in a `MUST load` reference; keep the obligation, order, decision, required return, invariant, and completion visible in `SKILL.md`;
- do not inline coherent detailed all-run procedure merely because every run needs it when a `MUST load` reference makes the body smaller and the owner clearer;
- strengthen the predicate, return, or completion criterion when agents guess or stop early.

When the caller hands a lane to a subagent, the route starts with either `MUST dispatch` or `IF <predicate>, dispatch`, then continues through `bounded packet -> parallel-safe lane execution -> shaped receipt -> parent reduction`. The lane reference owns local execution depth; it does not own the caller's load mode, branch predicate, packet instance, parallel-safety basis, actual scheduling choice, or final reduction point.

`workflow-topology.md` must not remain as a peer reference or compatibility alias after these concepts are absorbed.

### R3. The Calling `SKILL.md` Owns Reference Load Mode

Every ordinary reference call site in an authored `SKILL.md` owns:

```text
load mode: MUST | IF <observable predicate>
destination: exact reference path
requested work: decision, inspection, or procedure to perform there
needed result: concrete result consumed by the continuing main path
```

The call may be prose, a compact record, or another readable form, but it must use the literal leading language `MUST load` or `IF <predicate>, load`. Each call uses exactly one form. Do not use vague alternatives such as "when useful," "as needed," or "should load."

`MUST load` does not create a branch. It keeps an all-run step's detailed procedure in a maintainable reference while the main body preserves the obligation, order, decision, required return, invariant, and completion.

The caller must not use vague pointers such as "see this file for details." An `IF` predicate must be observable enough to own routing.

### R4. The Opened Ordinary Reference Owns The Local Work

An ordinary reference owns:

```text
owned branch or decision
expected inputs from the caller
local judgment, procedure, examples, caveats, or templates
detailed returned result
checkable stop or completion condition
```

The reference must not repeat or independently own its own load mode or predicate. Routing has one source of truth in the calling `SKILL.md`.

The reference may restate its owned decision and expected inputs so it is usable once opened. It may link to a shared shape when a real consumer justifies one. A `MUST load` reference may contain detailed all-run procedure, but it must not become the only place that names the step's obligation, ordering, decision, required return, invariant, or parent completion boundary.

### R5. `reference-design.md` Must Own Ordinary Placement

`reference-design.md` remains the placement owner for deciding among:

```text
all-run obligation, order, decision, required return, invariant, or completion -> SKILL.md
all-run coherent detailed procedure                      -> MUST load references/<step>.md
branch-only detail                                       -> IF <predicate>, load references/<branch>.md
parallel-safe, handoff-ready work                        -> reference-lanes-design.md
all-run lane handed to a subagent                        -> MUST dispatch via reference-lanes-design.md
conditional lane handed to a subagent                    -> IF <predicate>, dispatch via reference-lanes-design.md
real shared-shape consumer                               -> reference-lanes-design.md
deterministic executable mechanic                        -> scripts/
term meaning only                                        -> references/glossary.md
no behavior change                                       -> prune
```

The reference must teach the separate `MUST load` and `IF <predicate>, load` caller modes, caller/callee split from R3-R4, and pruning test. Extracting all-run detail is justified when the material is one coherent procedure, carries enough density to obscure the main path, or changes for a different reason than the body. Do not create arbitrary chapter files merely to reduce line count.

It must point to `reference-lanes-design.md` when a real parallel-safe, handoff-ready lane, shared model output, or tool-validated structure is the hard part.

It must not retain live pointers to `schema-design.md` or treat every branch as a lane candidate.

### R6. A Lane Must Be Parallelizable And Safe To Hand To A Subagent

Work qualifies as a lane only when all of these are explicit:

1. once prerequisites are satisfied, it is safe to run concurrently with other ready lanes or parent work;
2. a subagent can execute it from a bounded packet without live parent back-and-forth or hidden session reasoning;
3. a bounded mission and reason that separate ownership is useful;
4. sufficient supplied context and source anchors;
5. owned decisions plus explicit non-goals;
6. prerequisites and dependency state, including completed prior results required before execution or dispatch;
7. allowed actions and authority, including whether it is read-only or may make scoped edits;
8. a shaped `complete`, `partial`, or `blocked` receipt with evidence and unresolved questions;
9. parent verification, conflict handling, and reduction into the overall workflow.

A lane must not gain final cross-workflow authority merely because it executes in a subagent. Its result remains subject to the parent contract. For evidence and review lanes, findings are candidate evidence until verified. For scoped implementation lanes, completed work is still verified against the parent-owned requirements and current source state.

Dependencies create readiness waves. A lane may wait for a completed prerequisite, then become eligible to execute concurrently with other work that is ready in the same wave. The runtime may still schedule it sequentially or locally. Work that needs another lane's in-flight intermediate state or ongoing parent decisions is not ready as a lane; keep it parent-owned or reshape it into a bounded later lane.

Parallel safety and bounded subagent handoff are necessary but not sufficient. Work is not a lane merely because it is:

- conditional;
- provider-specific;
- long or complex;
- placed in a separate reference;
- stored under `references/lanes/`;
- run concurrently;
- delegated to a subagent.

One parameterized lane reference may be invoked multiple times when only bounded inputs differ. Separate lane files are justified when missions, judgment, calibration, authority, or stop conditions differ.

### R7. `reference-lanes-design.md` Must Own Lane Authoring

Add `references/reference-lanes-design.md` with the document title `Reference Lanes And Shared Shapes`.

For lane authoring, it owns:

- the lane qualification test from R6;
- caller-owned dispatch predicates and lane-instance packet construction when the lane is handed to a subagent;
- lane mission, prerequisites, dependencies, bounded context, ownership, non-goals, authority, and stop semantics;
- complete, partial, and blocked returns;
- parent verification, contradiction handling, reduction, and final-authority boundary;
- parallel safety and bounded subagent handoff as required lane predicates;
- readiness waves when completed prerequisites gate later parallel-safe execution;
- the one-parameterized-lane versus several-mission-specific-lanes decision.

It must distinguish three owners:

```text
calling SKILL.md or parent
  owns: execution mode and scheduling, instance packets, instance authority
        that may narrow but never widen the lane reference, receipt collection,
        final reduction; when handing off, MUST dispatch or
        IF <predicate>, dispatch mode plus subagent assignment

lane reference
  owns: stable mission, local judgment, calibration, maximum allowed actions,
        stop condition, lane-specific additions to the shared shape

lane/output/tool schema
  owns: only stable common fields, required slots, values, and ordering
```

This document is meta-level authoring guidance. Runtime skills must not import it as their packet or result schema.

### R8. The Combined Reference Must Preserve Three Schema Families

`schema-design.md` is folded into `reference-lanes-design.md`, but schema families remain distinct:

```text
lane-schema
  predicate: multiple lanes share input, context, route, or return fields
  semantics: common lane shape; lane-specific mission and judgment stay local

output-schema
  predicate: multiple model-facing consumers need the same readable result
  semantics: shared output fields; no lane is required

tool-schema
  predicate: a tool, test, CI check, or runtime validates the structure
  semantics: machine-validated contract; no lane is required
```

Only a lane shape inherits lane dispatch, provisional result, and parent-reduction semantics. An output schema follows the authority of its consuming workflow. A tool schema may be an authoritative validated runtime contract.

The families classify owned shapes, not entire workflows or files. One workflow result may satisfy more than one predicate:

```text
lane envelope
  owns: dispatch context, dependency state, authority, status, receipt,
        and parent handoff

output payload
  owns: the shared model-readable result consumed in more than one place

tool representation
  owns: the authoritative machine-validated serialization and constraints
```

Overlapping shapes must compose through links, nesting, or one declared authoritative owner. They must not copy the same fields into competing schemas. A test that merely asserts behavior or checks prose does not turn an output shape into a `tool-schema`; machine validation of the structure itself is the predicate. Machine validation never grants lane authority to an output or tool shape.

Schema extraction is consumer-first:

- name the real consumer;
- extract only fields that must remain stable;
- keep mission, policy, examples, and calibration with the consuming reference;
- link consumers to the shared shape instead of copying fields;
- keep single-use slots local;
- use JSON Schema only when a machine validator exists.

The strong pointer from `skills-creation/SKILL.md` must route to this reference under any of three independent predicates:

```text
parallel-safe work ready for bounded subagent handoff needs lane semantics
multiple consumers need stable model-readable output
a tool, test, CI check, or runtime validates structure
```

This pointer is required so authors with no lanes still discover output- and tool-schema guidance.

### R9. Actual Lane Packets And Schemas Remain Skill-Local

The meta skill teaches how to design lanes and shared shapes. It does not provide a universal packet imported by every workflow skill.

Each authored skill owns its own:

- lane missions and references;
- shared context and return fields;
- output schemas;
- machine-validated schemas;
- parent reduction semantics;
- phase-specific evidence and authority rules.

Existing skill-local packets and schemas remain valid examples, not dependencies or templates that every skill must adopt.

### R10. The Change Is A Hard Cutover

The implemented state must have one live owner for each concept:

- ordinary topology and authored body anatomy in `skills-creation/SKILL.md`;
- ordinary reference placement and caller/callee contents in `reference-design.md`;
- lane and shared-shape design in `reference-lanes-design.md`.

`workflow-topology.md` and `schema-design.md` must be removed. Do not leave compatibility aliases, forwarding stubs, or duplicate prose.

All active operational consumers must be reconciled in the same behavior change, including:

- `skills-creation/SKILL.md`;
- `reference-design.md`;
- `glossary.md`;
- skill spec and implementation review rubrics where old ownership terms affect judgment;
- focused `skills-creation` pressure scenarios, assertion code, and scenario documentation;
- current repo/plugin summaries only where their behavior description becomes inaccurate.

Historical changelogs remain unchanged because they accurately describe earlier releases. A new changelog records the new behavior during implementation. This focused spec supersedes the named earlier-spec decisions without rewriting the earlier artifact.

### R11. Existing Behavior Must Be Preserved Or Sharpened

The redesign must preserve:

- trigger/frontmatter ownership outside this scope;
- the great-skill frame of trigger, body, reference depth, and proof;
- mental-model-first authoring;
- visible all-run workflow and checkable completion;
- explicit `MUST` always paths, observable `IF` branch predicates, and usable returned results;
- `DISPATCH` as the action for handing a lane to a subagent, with parallel safety, runtime scheduling freedom, and parent-owned reduction;
- progressive disclosure and single-source-of-truth placement;
- pressure/static proof distinction;
- the general RED-before-edit rule, using the demonstrated `MUST load` placement RED, the lane-definition proof gap, and the original passing equivalence control honestly;
- spec review, implementation review, security, platform, pruning, and shipping routes.

The redesign may sharpen vocabulary and allocation. It must not weaken existing completion blockers or turn `skills-creation/SKILL.md` into a link-only router.

## Required Use Flows

### Mandatory All-Run Reference

```text
all-run step remains visible in SKILL.md
  owns: obligation, order, decision, required return, invariant, completion
  -> MUST load detailed-step.md
       owns: coherent detailed procedure
       returns: result required by the visible step
  -> main path checks completion and continues
```

Expected allocation: the reference is not a branch. `SKILL.md` still owns the step's existence, order, decision, required return, invariant, and overall completion boundary.

### Ordinary Reference Only

```text
IF provider predicate
  -> load provider reference
       owns: provider-local judgment and detailed return
  -> normalized result returns to main path
  -> main workflow continues
```

Expected allocation: no lane packet, parent reduction ceremony, or lane schema appears solely because the provider depth is conditional.

### Mixed Ordinary Reference And Parallelizable Subagent Lane

```text
all-run incident evidence workflow
  |
  | selected telemetry provider
  +-> ordinary provider-query reference
  |     returns normalized evidence
  |
  | IF evidence supports a parallel counter-hypothesis check
  +-> dispatch counter-hypothesis lane to a subagent
        returns candidate contradiction or evidence-backed no-finding
  |
  +-> parent verifies and reduces
```

Expected allocation: provider query mechanics remain ordinary reference depth; the counter-hypothesis work is parallel-safe and handoff-ready from a bounded subagent packet and has scoped authority, a completion/blocked receipt, and parent reduction. It remains a lane even if this invocation schedules it sequentially.

### Packetable But Parent-Coupled Work

```text
work has bounded-looking inputs and a shaped return
  -> still requires live parent decisions or in-flight sibling state
  -> cannot safely run concurrently or in a subagent
  -> parent-owned step or ordinary reference, not a lane
```

Expected allocation: packetability alone does not earn `DISPATCH` language or lane ceremony.

### Parallel-Safe But Incomplete Work

```text
work can overlap safely and a subagent can execute its bounded packet
  -> mission, non-goals, authority, receipt, or parent reduction is missing
  -> necessary lane predicates pass, but the complete contract does not
  -> ordinary or underspecified work, not yet a lane
```

Expected allocation: parallel safety and bounded subagent handoff do not create a lane by themselves. The remaining mission, ownership, dependency, authority, return, and reduction contract is mandatory.

### Schema Without A Lane

```text
model emits result
  -> CI validates required structure
  -> tool-schema owns the validated fields
```

Expected allocation: the tool schema is discoverable through `reference-lanes-design.md` even though no lane exists. It does not acquire candidate-evidence or parent-reduction semantics.

### Overlapping Lane, Output, And Tool Shapes

```text
lane executes from bounded context
  -> lane envelope carries status and parent handoff
  -> shared readable payload is consumed in two model-facing places
  -> CI validates the serialized payload structure
```

Expected allocation: lane authority remains in the lane envelope; the readable payload and machine representation compose through links or one authoritative shape. The design must not duplicate fields, infer lane authority from validation, or call incidental prose assertions a tool schema.

## Delivery And Proof Split

The source contract and its behavioral proof are intentionally delivered in two PRs:

1. PR1 changes the `skills-creation` body/reference/lane authoring contract, completes the hard source-owner cutover, updates review rubrics, and publishes the plugin/version/changelog metadata. Structural validation and source-backed implementation review prove this slice.
2. PR2 starts from the merged PR1 head and adds the artifact-scoped pressure scenarios and harness assertions required by the behavior cases below.

This is an explicit user-accepted behavior-proof gap, not GREEN. PR1 may claim that the authored source contract is implemented and structurally reviewed. It must not claim demonstrated model improvement, artifact-scoped behavior GREEN, or completed pressure regression coverage. The required cases below remain authoritative for PR2; separating delivery does not weaken them.

## Proof Expectations

### Baseline Classification

Implementation proof must preserve three distinct baseline results:

- the current five-of-five mixed allocation is a passing equivalence control and must not be relabeled RED;
- the current three-of-three rejection of always-loaded detailed references is demonstrated RED for `MUST load` behavior;
- the current three-of-three treatment of parallelizability and safe subagent handoff as optional is the explicit lane-definition proof gap.

Implementation and implementation review must turn the `MUST load` case green, close the lane proof gap, and preserve the passing mixed allocation. They must not flatten the three results into one fabricated failure or one broad success claim.

### Artifact-Scoped Behavior Proof

The highest proof burden is correct allocation in the authored artifacts themselves.

The focused pressure design must:

- ask for explicit proposed file contents or another inspectable artifact boundary;
- distinguish the target `SKILL.md`, ordinary reference, lane reference, and schema contents;
- distinguish literal leading `MUST load`, `IF <predicate>, load`, `MUST dispatch`, and `IF <predicate>, dispatch` call forms;
- scope assertions to those artifact sections;
- prevent surrounding explanation, `coverage_evidence`, or a self-reported label from satisfying an allocation assertion;
- check both positive requirements and countercase absences.
- fail an ordinary or lane reference that repeats or independently owns its caller's load mode, dispatch mode, or entry predicate, including self-routing prose such as `Load this reference when ...` or `Call this lane when ...`.
- scope the callee-routing negative narrowly: an opened reference may state its owned decision, expected inputs, local conditional procedure, and calls to deeper references; it may not tell the parent when to enter the current file.
- fail a mixed-lane artifact whose lane reference is complete but whose calling `SKILL.md` omits any caller-owned dispatch slot from R1.6; remove each slot one at a time and require every omission to fail.
- fail a caller whose instance authority exceeds the lane reference's stable maximum authority, even when both authority fields are present.
- fail a supposed lane that cannot run concurrently or cannot be handed to a subagent without live parent context.
- fail work that is parallel-safe and executable by a subagent but lacks any remaining lane qualification, including mission, non-goals, authority, receipt, or parent reduction.
- fail a `MUST load` extraction that hides the all-run obligation, order, decision, required return, invariant, or completion from `SKILL.md`.
- fail review-rubric wording that treats all all-run detail as necessarily inline instead of distinguishing visible all-run workflow ownership from coherent detailed procedure behind `MUST load`.

The implementation plan may choose file markers, parsed sections, or another deterministic artifact boundary. It must not weaken the permanent pressure harness or rely on temporary test files.

### Required Behavior Cases

1. **Equivalence case:** the mixed dependency-retirement problem remains semantically correct from fresh context after the redesign.
2. **Mandatory-reference RED/GREEN case:** a coherent detailed all-run procedure moves behind `MUST load` while its obligation, order, decision, required return, invariant, and completion remain visible in `SKILL.md`; omitting any one of those caller-owned elements fails.
3. **Conditional-reference countercase:** provider depth uses `IF <predicate>, load` and does not acquire lane ceremony.
4. **Callee-routing ownership negative case:** a correct caller cannot rescue an ordinary or lane reference that repeats its own entry predicate or tells the parent when to load, call, or dispatch the current file. Reference-local expected inputs, conditional procedure, and nested calls remain legal.
5. **Mixed artifact case:** an ordinary provider reference and a parallel-safe, handoff-ready lane are allocated correctly in the proposed files.
6. **Parent-coupled countercase:** packetable work that cannot run concurrently or be handed to a subagent remains parent-owned or ordinary.
7. **Lane qualification case:** a fresh subagent can execute the lane from its packet and reference without hidden session history or live parent back-and-forth; a qualified lane remains a lane when scheduled serially, while work that passes those two predicates but lacks another R6 qualification fails.
8. **Schema-without-lane countercase:** CI-validated output routes to a tool schema without inventing a lane.
9. **Overlapping-shape case:** a lane result that is both shared model output and machine-validated composes the families without duplicate ownership or authority drift.
10. **Incomplete-or-widened-caller negative case:** a complete lane reference cannot compensate for any missing caller-owned dispatch slot from R1.6. Permanent proof removes each slot one at a time and requires every omission to fail. It also rejects caller-supplied instance authority that widens the lane reference's stable maximum authority while accepting an equal or narrower boundary.
11. **Regression and review-rubric case:** existing focused `skills-creation` scenarios remain green, and review rubrics accept a compliant `MUST load` draft while rejecting one that hides any caller-owned all-run element or lets a callee own its entry routing; trigger, RED-before-edit, mental model, workflow, reference retrieval, spec review, implementation review, platform, and security behavior remain covered.

### Structural Proof

Structural proof must establish:

- removed files have no active operational pointers;
- every live reference path resolves;
- the new reference is discoverable for lanes, repeated model output, and tool-validated structure;
- focused pressure assertions validate their intended artifact sections;
- review rubrics distinguish visible all-run workflow ownership from coherent all-run procedure behind `MUST load`;
- skill and plugin metadata remain valid after the required implementation-time version and changelog update;
- pre-existing user changes outside this spec remain untouched.

### Requirement And Proof Matrix

| Requirement | Primary proof modality | Failure the proof must catch |
| --- | --- | --- |
| R1-R2 body contract and topology | artifact-scoped load-mode and dispatch-form tests | load mode visible only in explanation; all-run obligation hidden in a reference; or conditional and unconditional markers combined at one call site |
| R3-R5 ordinary caller/callee split | mandatory-reference, conditional-reference, callee-routing ownership, and mixed countercases | all-run detail forced inline; any caller-owned obligation, order, decision, required return, invariant, or completion hidden in the reference; callee repeats or owns its entry routing; reference-local explanation satisfies a caller assertion; or caller returns only "details" |
| R6-R7 lane contract | mixed artifact, qualification, parent-coupled, and incomplete-or-widened-caller cases | actual concurrency confused with parallel safety; safe handoff treated as sufficient; caller omits any dispatch slot canonically listed in R1.6; or caller widens the lane reference's maximum authority |
| R8 schema families | schema-without-lane and overlapping-shape countercases | output/tool schemas inherit lane semantics, become undiscoverable, or duplicate one overlapping shape |
| R9 skill-local ownership | static source inspection and regression proof | new meta reference becomes a universal runtime packet |
| R10 hard cutover | pointer, file, and rubric inventory | duplicate owners, forwarding stubs, stale active paths, or the old blanket `all-run material stays inline` review rule remains |
| R11 behavior preservation | fresh-context equivalence plus focused suite | simplification removes existing gates or shifts trigger/proof ownership |

Exact commands, regexes, implementation order, and worker assignment belong to the implementation plan.

## Affected Live Surfaces

The design constrains the following implementation surfaces without authorizing edits in this spec phase.

Core behavior:

- `plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md`
- `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-design.md`
- new `plugins/shravan-dev-workflow/skills/skills-creation/references/reference-lanes-design.md`
- retired `workflow-topology.md` and `schema-design.md`
- `glossary.md`

Review and proof:

- `skill-spec-review.md` and `skill-implementation-review.md`; their hierarchy rubrics must keep the all-run obligation, order, decision, required return, invariant, and completion visible while allowing coherent detailed procedure behind `MUST load`;
- focused `skills-creation-*` pressure scenarios;
- pressure assertion code and scenario documentation.

Shipping when implementation occurs:

- a new public-safe changelog entry and changelog index update;
- owning plugin versions and marketplace metadata that carry the version;
- repo/plugin summaries only when current wording becomes stale;
- source validation for Codex and Claude surfaces.

Installed-cache refresh is not part of this spec phase and remains an explicit post-push or release proof decision.

## Alternatives And Tradeoffs

### Keep `workflow-topology.md` Separate

Gain: the meta skill body stays slightly shorter.

Cost: authors must load optional depth to learn required ordinary body anatomy; the target `SKILL.md` contract remains implicit.

Decision: reject. Ordinary topology is always-needed authoring guidance.

### Put Everything In `reference-design.md`

Gain: one fewer reference.

Cost: ordinary placement, lane coordination, parent authority, and schema selection become one broad manual with multiple reasons to change.

Decision: reject. Keep ordinary placement distinct from advanced lanes/shared shapes.

### Keep `schema-design.md` Separate

Gain: schema selection remains highly discoverable and has one narrow reason to change.

Cost: the advanced authoring decision remains split across two references, contrary to the accepted consolidation direction.

Decision: reject for this cutover. Revisit only if pressure evidence shows that non-lane authors repeatedly miss output/tool schema guidance or the combined file becomes incoherent.

### Create A Global Runtime Lane Schema

Gain: uniform packet fields across workflow skills.

Cost: phase-specific authority, evidence, and completion contracts are flattened into a framework that no real consumer universally shares.

Decision: reject. The meta skill teaches design; consuming skills own runtime contracts.

### Keep Compatibility Stubs For Retired Files

Gain: old local links continue resolving.

Cost: duplicate owners and sediment preserve the old mental model indefinitely.

Decision: reject. This repo uses a hard cutover and historical changelogs already preserve release history.

### Inline Every All-Run Detail

Gain: every required word is present after loading only `SKILL.md`.

Cost: coherent detailed procedures bloat the main path, change for a different reason than the workflow, and make small maintainable skill bodies impossible.

Decision: reject. Keep all-run obligations visible, but move coherent detailed procedure behind an explicit `MUST load` pointer.

## Non-Goals

- Redesign frontmatter or merge the separate frontmatter guidance into this work.
- Rename `skills-creation` or broaden it into a portfolio audit.
- Implement the skill, tests, version bump, changelog, plugin validation, or cache refresh in this spec phase.
- Define implementation order, exact validation commands, worker assignments, or an execution DAG.
- Standardize every existing workflow skill's lane filenames, packet fields, or schema names.
- Require one specific subagent provider or runtime. Lane calls use `DISPATCH` and parallel-safe subagent-handoff semantics without coupling the authored skill to one backend.
- Move an all-run obligation, decision, invariant, required return, or completion boundary exclusively into a `MUST load` reference.
- Turn `reference-lanes-design.md` into a runtime dependency.
- Rewrite historical changelogs or upstream/source-inspiration documents.
- Treat every structured return as justification for a schema.

## Security Context

This design is not security-sensitive. It changes Markdown authoring guidance and future pressure contracts. It does not authorize scripts, hooks, package scripts, network activity, third-party source copying, secrets, privileged actions, installed-cache refresh, or home-level mutation.

If later implementation expands into one of those surfaces, the existing `skill-security-review.md` route remains mandatory and the work must return to the accepted design if that expansion changes the contract.

## Open Decisions

No material product or architecture decisions remain open for planning.

The implementation plan may choose exact prose placement, scenario names, artifact-marker mechanics, and validation commands as long as it preserves the contracts and proof boundaries above.

## Next Workflow

Run `skills-creation/references/skill-spec-review.md` with `fresh-perspective + local-lane`, parent-reduce the findings, revise this artifact until accepted-to-implement, then route the accepted spec to `plan-creation-swarm` before any skill implementation.
