# Separate Requirements, Specification, and Program Design

Date: 2026-08-04
Revision: 3
Status: accepted-to-implement under `skills-creation`
Owner plugin: `shravan-dev-workflow`

## Goal

Make the design workflow preserve three separate authoritative concepts:

```text
Requirements
  WHY, for whom, and within what boundary?
  Authorized needs, desired outcomes, priorities, and limits.

Specification
  WHAT must be observably true?
  Normative observable obligations traced to Requirements.

Program Design
  HOW will the internal system satisfy it?
  Structural realization of the fixed observable obligations.
```

For substantial file-backed design, all three must have separately identifiable homes. An existing Requirements source may be reused and linked; it must not be duplicated. A combined `Requirements/spec` artifact is never a valid substitute for separate Requirements and Specification identities.

Pathfinding helps the user and agent resolve unmade owner meaning that blocks Requirements, Specification, or a Program Design choice. For structural work, it may clarify owner-controlled cost, risk, compatibility, or policy tolerance; it does not generate components, interfaces, mechanisms, or architecture. It returns clarified meaning to the phase that requested it and does not replace, merge, or silently author that phase's artifact.

## Problem and Evidence

Two direct `spec-design` sessions exposed the ambiguity this change addresses.

- In `agent-studio.fix-bugs-save`, the agent was asked for Requirements, Specification, and Program Design but declared that there were only two authoritative artifacts. It produced a combined `Requirements/spec` document followed by Program Design. The complete Requirements-named file contained specification behavior, contracts, failures, and proof obligations. Source: `/Users/shravansunder/.codex/sessions/2026/08/03/rollout-2026-08-03T12-09-51-019fc863-7de6-7620-a2d3-279855b861dd.jsonl`, especially records 1000, 1666, 1670, 1730, 1741, and 2017.
- In `agent-studio.sidebar-fixes`, the requested small spec and design correctly produced a complete Specification and a separate Program Design, but no separately identifiable Requirements source. Source: `/Users/shravansunder/.codex/sessions/2026/08/03/rollout-2026-08-03T05-40-55-019fc6ff-69d1-7163-bc8a-162636d0b50b.jsonl`, especially records 113, 115, and 116.

The current skills already distinguish the semantics but leave artifact separation optional:

- `spec-design` calls Specification an observable contract but also says it owns authoritative Why/What.
- `spec-design` requires a separate Requirements record only when pathfinding produced one and says to show `requirements -> specification -> program design` only “when companion artifacts exist.”
- `orchestrator-design` describes `spec-design` as owning both the requirements boundary and observable Why/What.
- No current pressure scenario directly rejects a combined `Requirements/spec` artifact or a missing separately identifiable Specification.

## Success Definition

When a capable agent handles substantial file-backed design:

1. It can explain the three concepts using the complete boundaries above, not the WHY/WHAT/HOW shorthand alone.
2. It identifies or creates a Requirements home before declaring Specification ready.
3. It creates a separate Specification home and never labels a combined artifact `Requirements/spec`.
4. It reuses an existing authoritative Requirements source instead of copying it.
5. Program Design consumes both Requirements and Specification identities and returns a specification gap when either is absent or collapsed.
6. Review rejects a substantial design set whose Requirements and Specification identities are missing or collapsed, then routes the smallest correction to `spec-design`.
7. Pathfinding helps the user and agent clarify unmade owner meaning that blocks Requirements, Specification, or a Program Design choice with evidence, explanation, related questions, and diagrams when useful, then returns the clarified meaning to the recorded owner without performing that owner's design work.
8. Orchestration preserves separate Requirements, Specification, and Program Design identities through its compact handoffs without becoming their owner.

## Decisions

| Decision | Default | Rationale |
| --- | --- | --- |
| Artifact threshold | Require separate identities for substantial file-backed design; chat-only or quick work may use separately labeled in-chat records. | The failure is semantic collapse, not a demand for files during every small conversation. |
| Requirements identity and creation | A Requirements identity is exactly one authoritative user-requirements record, equivalent governing Requirements source, or normalized Requirements artifact. `discuss-pathfinding` elicits and records unwritten meaning. `spec-design` admits and enforces the identity: it reuses a qualifying source, consumes the pathfinding record, or materializes a normalized Requirements artifact from already-settled authoritative sources without eliciting or confirming new meaning. | Direct Specification work must preserve a separate Requirements identity without turning pathfinding into a ceremonial file writer or giving `spec-design` authority to answer missing owner questions. |
| Accepted requirements set | The accepted requirements set remains returned workflow and coverage state; it is not a fourth artifact, ledger, or alias for the Requirements artifact. | Separation must not recreate the prior ledger and digest failure. |
| Specification contents | Specification owns observable obligations, including normative `MUST` statements, and traces them to Requirements. | “Requirements” as an artifact and individual normative requirements are related but not interchangeable concepts. |
| Pathfinding role | Cross-cutting collaboration for unmade owner meaning that blocks Requirements, Specification, or a Program Design choice; return to the recorded phase owner. For a structural choice it extracts only the owner-controlled tolerance or constraint. | Pathfinding clarifies owner meaning but does not synthesize structural How, replace a design phase, or merge its artifacts. |
| Shared wording owner | Add one compact shared runtime reference for the three concepts and artifact-separation rules; each skill keeps only its local role and required call visible. | Five active consumers need one rule owner, while each `SKILL.md` still needs a scan-visible local boundary. |
| Review correction | Missing or combined Requirements/Specification is a `spec-design` correction; Program Design is not repaired first. | Observable meaning must be complete before structural realization can be judged. |
| Identity representation and orchestration | File-backed work carries two present, resolvable, non-identical Requirements and Specification pointers. Chat-only work carries two separately labeled in-chat records in the phase handoff. Orchestration checks only that the representation has both distinct structural slots; it does not inspect content, create Requirements, or choose meaning. | The guarded router must support chat-only work without inventing opaque IDs or becoming a semantic reviewer. |
| Compatibility | Hard cutover with no aliases for `Requirements/spec`. | Retaining the combined name preserves the exact ambiguity being removed. |
| Proof strength | Reproduce the historical failure where feasible; otherwise use realistic stored pressure scenarios and report the remaining historical proof gap. | Stored scenarios provide repeatable regression evidence without overstating equivalence to the original sessions. |

## Shared Runtime Reference

Create `plugins/shravan-dev-workflow/shared-references/requirements-specification-program-design.md` as the single detailed owner of:

- the canonical WHY / WHAT / HOW definitions;
- separately identifiable artifact rules for substantial file-backed work;
- the representation-level rule that one already-admitted Requirements identity is reused rather than duplicated; source qualification, admission, and normalization remain owned by `spec-design/references/authority-and-problem-framing.md`;
- the distinction between the Requirements artifact and normative requirements inside a Specification;
- the cross-cutting pathfinding relationship;
- the handoff identities each downstream phase consumes.

The reference teaches the boundary with a compact flow and concrete valid/invalid examples. It does not define orchestration counters, review verdicts, artifact templates, or file naming conventions.

It also owns the two valid identity representations:

```text
substantial file-backed work
  Requirements: one resolvable source or artifact pointer
  Specification: one different resolvable artifact pointer

chat-only work
  Requirements: one separately labeled in-chat record
  Specification: one different separately labeled in-chat record
```

The accepted requirements set remains separate returned coverage state in both cases.

## Exact Trigger Candidates and Routing Cases

### `spec-design`

Candidate description:

```text
Use when authoring or revising durable Requirements from settled or user-confirmed meaning, or defining or revising a Specification's authoritative observable obligations or its journey, context, and requirement-coverage views, including the problem, consumers, outcomes, constraints, failure behavior, or proof obligations. Not for eliciting genuinely unwritten owner meaning, reconverging a drifted shared model, maintaining settled text without semantic authoring, internal structural How, review-only requests, implementation planning, a full Requirements -> Specification -> Program Design -> review cycle, creating/updating/evaluating one named runtime skill package, or a standalone security scan/audit/threat model.
```

Routing cases:

```text
true:      "Write a durable Requirements document from these settled, user-confirmed decisions. Do not write the Specification yet."
near miss: "Interview me to discover what users need and which boundary I actually want." -> discuss-pathfinding
near miss: "Clean up this settled Requirements document without changing its meaning." -> docs-maintain
near miss: "Take this through Requirements, Specification, Program Design, and independent pair review." -> orchestrator-design
```

### `discuss-pathfinding`

Candidate description:

```text
Use when user or stakeholder requirements, user needs, behavioral personas, tacit process knowledge, domain terms, or owner-controlled cost, risk, compatibility, policy, or other design tolerances are unwritten and must be extracted from someone's head or decided collaboratively through interview or grilling, especially "grill me", "interview me", "think through with me", or "help me figure out what I actually want". Not for maintaining settled content, repairing a drifted shared model, gathering evidence from artifacts, authoring Requirements or Specification from settled sources, synthesizing components, interfaces, mechanisms, or other internal structural How from settled obligations, in-chat visuals with no extraction request, or independent review.
```

Routing cases:

```text
true:      "Help me decide how much downtime and compatibility risk we are willing to accept; that owner policy is not decided."
near miss: "Design the zero-downtime migration components, interfaces, and cutover mechanism from these settled obligations." -> program-design
mixed:     "Help me decide our downtime tolerance, then return that clarified constraint to program-design; do not design components or mechanisms."
```

### `orchestrator-design`

Candidate description:

```text
Use when a user asks to take a change through, run, resume, or finish the full design cycle—Requirements, Specification, Program Design, and independent pair review—as one bounded workflow before planning. Not for a direct requirements discussion, Requirements authoring, Specification, Program Design, or review-only request; long-horizon delivery goals; planning; implementation; or PR work.
```

The `program-design` and `spec-program-review` descriptions remain unchanged unless implementation review finds a direct contradiction with these accepted boundaries.

## Ordered Runs and Surface Allocation

Each implementation run targets exactly one named skill. The accepted shared decisions above remain fixed across all runs.

### Run 1 — `spec-design`

- Trigger: use the exact `spec-design` candidate and literal routing cases above.
- Main path: state the three-concept boundary; require a separately identifiable Requirements source and Specification artifact for substantial file-backed work; forbid `Requirements/spec`; load the shared reference; keep pathfinding conditional on unclear meaning.
- Depth: the shared reference owns representation rules for an already-admitted Requirements identity. `authority-and-problem-framing.md` teaches qualification, admission, and source normalization; `artifact-and-self-review.md` teaches separate artifact creation/navigation and self-check. `spec-design` never elicits or confirms missing owner meaning.
- Proof: add scenarios for missing Specification after a Requirements document and reuse of an existing Requirements source without duplication.
- Proof posture: observed failure; targeted RED/GREEN where current source reproduces it, otherwise representative stored regression with a named gap.

### Run 2 — `discuss-pathfinding`

- Trigger: use the exact `discuss-pathfinding` candidate and literal routing cases above.
- Main path: explain that pathfinding may clarify owner meaning blocking Requirements, Specification, or a Program Design choice; keep related questions together; return to the recorded owner; do not collapse every destination into a Requirements record or synthesize structural How.
- Depth: update question or record references only if the main path cannot teach the distinction compactly.
- Proof: add paired routing prompts for an unmade owner-controlled structural tolerance versus architecture synthesis from settled obligations, plus a behavior scenario where the former must be explained, optionally diagrammed, and returned to `program-design` without pathfinding-authored components or mechanisms.
- Proof posture: representative comparison against the prior revision.

### Run 3 — `program-design`

- Trigger: unchanged structural-How boundary.
- Main path: require separate Requirements and Specification identities; reject a combined `Requirements/spec`; preserve the fixed observable contract.
- Depth: update artifact/self-review teaching only if needed for traceability checks.
- Proof: add a scenario where Program Design receives a combined artifact and must return a Specification gap instead of designing from it.
- Proof posture: representative comparison against the prior revision.

### Run 4 — `spec-program-review`

- Trigger: unchanged review-only boundary.
- Main path: reconstruct and review Requirements, Specification, and Program Design separately; treat missing or collapsed Requirements/Specification as a concrete `spec-design` correction.
- Depth: `reviewing-specification.md` and `reviewing-pair.md` are required teaching owners. They inspect separately identifiable Requirements and Specification sources, consume valid/invalid examples from the shared reference, and stop with a `spec-design` correction when either identity is missing or collapsed. `finding-and-reduction-schema.md` only carries the resulting correction and route.
- Proof: add a pair-review scenario containing `Requirements/spec` plus Program Design and require a clear non-ready result and smallest route.
- Proof posture: representative comparison against the prior revision.

### Run 5 — `orchestrator-design`

- Trigger: use the exact `orchestrator-design` candidate above so full-cycle routing names Requirements while direct Requirements work remains excluded.
- Main path: explain the three separate concepts at cycle start; preserve their identities in handoffs; structurally require either two distinct resolvable file-backed pointers or two separately labeled in-chat records without inspecting semantic adequacy.
- Depth: `design-run-state.md` is the required teaching owner for this representation-aware continuation guard and its exact blocked result. It consumes the representation rules from the shared reference and does not add schemas, opaque IDs, or runtime code.
- Proof: add a scenario where a `locally-ready` file-backed spec handoff omits, duplicates, or cannot resolve the two pointers and must be blocked before Program Design; add controls where two structurally valid pointers pass without semantic re-review and where two separately labeled in-chat records pass without host-exposed message anchors.
- Proof posture: representative comparison against the prior revision.

## Proof Plan

Structural proof:

- validate all changed skill frontmatter and reference calls;
- run `git diff --check`;
- run the repository's focused skill static checks and TypeScript checks.

Behavior proof:

- register scenarios through each skill's named `cases.ts` export;
- use deterministic evaluators only for inspectable structure, artifact identity, and literal forbidden labels;
- use semantic judges for conceptual separation, correct routing, useful collaboration, and preservation of owner boundaries;
- run focused scenarios first, then `pnpm --dir tests/skills run test:evals` with the repository's configured concurrency;
- read every failed or inconclusive judge artifact before accepting a result.

The strongest intended claim is stored regression evidence for the new scenarios. Historical RED/GREEN is claimed only if the original prompts and relevant context can be reproduced faithfully.

## Coordination

- Base branch: `origin/master`
- Base commit: `1a227239c34af63e03dc0477334edab44ae87fd1`
- Working branch: `feat/separate-requirements-specification`
- Pending edits at proposal time: this proposal document only
- Shared reference lands in Run 1; later runs consume it.
- Plugin version and changelog land once after all five behavior slices: `shravan-dev-workflow` `1.7.11` -> `1.7.12`.
- Marketplace metadata, plugin manifests, README surfaces, and changelog are updated only where the existing release contract requires them.
- Cache refresh/reinstall is not part of source PR readiness and will not occur without an explicit later request.

## Non-Goals

- No new Requirements skill.
- No new orchestrator phase before `spec-design`.
- No changes to planning, implementation, legacy orchestration, or PR workflow skills.
- No mandatory pathfinding call when authoritative meaning is already clear.
- No file requirement for every quick or chat-only design conversation.
- No hashes, digests, schemas, parsers, databases, lifecycle system, or second report format.
- No rewriting unrelated design or review machinery.

## Spec Review Record

- Accepted revision: Revision 3, 2026-08-04.
- Required lanes: `mental-model-fit`, `trigger-routing`, `rule-agreement`, `depth-coverage`.
- Round 1 receipts: `mental-model-fit` complete, `trigger-routing` complete, `rule-agreement` complete, `depth-coverage` partial.
- Round 1 verdict: targeted revision. Accepted findings clarified the full artifact semantics, narrowed pathfinding's structural role, assigned Requirements identity versus elicitation ownership, made direct Requirements authoring routable, committed review teaching owners, and kept orchestration structural. No implementation was authorized.
- Round 2 receipts: `mental-model-fit` complete with no finding; `trigger-routing` complete with two blockers; `rule-agreement` complete with one important finding; `depth-coverage` complete with no finding.
- Round 2 verdict: targeted revision. Exact trigger candidates and literal routing prompts were missing, and chat-only identity representation was underspecified. No implementation was authorized.
- Current receipts: `mental-model-fit` complete with no finding; `trigger-routing` complete with no finding; `depth-coverage` complete with no finding; `rule-agreement` complete with no finding after the final source-admission versus identity-representation correction.
- Verdict: great.
- Semantic coverage: complete proposal coverage for the promise, exact trigger candidates, five-run main paths, named teaching owners, proof plan, and ownership split.
- Parent reduction: all first- and second-round findings were verified against current sources. Accepted findings were incorporated into Revision 3; no finding remains contested or unverified. First fix: none. Targeted retest: each run's named pressure scenarios plus implementation review of every touched surface.
- Acceptance: accepted-to-implement. Each run must compare its diff to Revision 3 and retain `spec-boundary none` or name a deviation.
