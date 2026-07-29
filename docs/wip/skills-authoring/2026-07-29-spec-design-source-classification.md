# Spec Design Source Classification

Date: 2026-07-29

Status: classification complete; three independent advisor receipts parent-reduced

Purpose: classify existing behavior before redesigning `spec-design`, `specification-design`, `program-design`, and `spec-program-review`. This is an ownership artifact, not a final skill or implementation plan.

## Fixed Decisions

- `spec-design` is the orchestration skill.
- `specification-design`, `program-design`, and `spec-program-review` are separate, independently invocable skills with their own specifications.
- Subagents remain valid for bounded research, modeling, section writing, and independent review. The rejected behavior is fixed swarm topology, not delegation.
- General specification/program-design craft stays general. Skill-authoring translation into trigger, main path, depth, lanes, scripts, platform mechanics, and proof remains a meta-design responsibility of `skills-creation`; it is not a runtime adapter category inside the new design skills.
- Classification precedes final document and runtime-tree design.
- No pressure tests run during this design pass.
- Existing `spec-creation-swarm` and `spec-review-swarm` files are retained. The eventual cutover narrows them to explicit legacy invocation so their generic descriptions do not compete with the four new model-invocable skills; deletion or retirement requires a separate decision.

## Classification Vocabulary

| Capability | Owns |
| --- | --- |
| Orchestration | persisted workflow phase, required skill transitions, pair revision, route-back, invalidation, acceptance, and planning handoff |
| General specification design | problem, consumers, outcomes, authority, requirements, observable behavior, external contracts, constraints, failure expectations, and proof expectations |
| General program design | current-system model, target component/ownership decomposition, interfaces, state, control/data flow, failures, alternatives, security/reliability design, and proof architecture |
| Skill-authoring meta-design | mapping each new skill's promised behavior into trigger, `SKILL.md` main path, reference/lane depth, scripts, platform mechanics, and proof |
| Specification local review | independent judgment that Why/What is authoritative, complete, testable, and internally coherent |
| Program-design local review | independent judgment that How is grounded, composed, feasible, failure-complete, and proves the specification |
| Pair review | independent cross-artifact authority, traceability, integration, contradiction, and planning-readiness review |
| Focused review lane | one bounded specialist judgment selected by an observable predicate |
| Generic agent management | model/runtime selection, permissions, session mechanics, generic job packet, and receipts |
| Implementation planning | exact implementation slices, file/write scopes, sequence, dependencies, execution DAG, commands, checkpoints, and operationalized proof |
| Proof | behavior claim, proof modality and seam, exact proof execution, evidence, and freshness; ownership depends on layer |

## Boundary Model

```text
spec-design
  invokes and connects
    specification-design
      produces specification + local-review result
    program-design
      consumes that specification revision
      produces program design + local-review result
    spec-program-review
      consumes the covered pair
      returns candidate pair findings and readiness result

spec-design routes parent-accepted findings to the owning design skill,
requires refreshed pair review, and alone accepts the pair.
```

Each phase skill may be invoked directly. Direct invocation does not bypass its prerequisites or claim pair acceptance:

- `specification-design` may start from intent or revise an existing specification.
- `program-design` requires a named, current specification revision; absent or stale Why/What routes to `specification-design`.
- `spec-program-review` supports specification-only, program-only, and pair modes. Pair mode requires both artifacts and their applicable local results at current digests; missing coverage returns the exact prerequisite instead of reviewing a partial pair as complete.
- `spec-design` is the generic start, continue, resume, remediate, and accept route.

Direct phase invocation is a valid edge, not a second lifecycle:

- `specification-design` returns a digest-bound artifact plus exactly one local result: `locally-ready`, `decision-needed`, `evidence-blocked`, or `deferred`. It never claims pair acceptance.
- `program-design` returns a digest-bound artifact plus exactly one local result: `locally-ready`, `specification-gap`, `decision-needed`, `evidence-blocked`, or `deferred`. It never claims pair acceptance.
- `spec-program-review` supports exactly `specification-only`, `program-only`, and `pair` modes. Each result names exact covered digests and is non-accepting.
- `spec-design` may import those terminal results into its canonical orchestration record, validate their freshness and prerequisites, and continue the closed workflow.

## Source-to-Owner Classification

### Existing `spec-creation-swarm`

| Source behavior | Classification | Final owner | Transformation |
| --- | --- | --- | --- |
| Parent holds the mental model; lane returns are candidate evidence | cross-cutting authoring invariant | `specification-design` and `program-design`, stated independently; orchestration consumes only terminal phase results | preserve; remove swarm wording |
| Product intent / requirements / technical-design distinction | general specification/program boundary | `specification-design` owns intent and requirements; `program-design` owns technical design | split explicitly |
| Current code/docs reading before design | evidence prerequisite | both design skills, with different results | split: specification receives observable/current constraints; program design receives the current-system model |
| External prior-art, platform/library docs, admired patterns, and mixed-source research | evidence prerequisite | `specification-design` when evidence can change requirements/contracts/proof obligations; `program-design` when it can change feasibility/structure/seams; `research-swarm` for substantial or mixed source sets | preserve the borrow/adapt/do-not-borrow judgment and transfer assumptions; drop mandatory dispatch when one bounded lookup is enough |
| `codebase-explorer` owners, sources of truth, nearby patterns, proof patterns, and files parent must read | general program-design grounding, with a smaller specification evidence use | `program-design`; parameterized evidence call available to `specification-design` | preserve and specialize; not a mandatory fixed lane for every run |
| One material user decision with recommendation and consequence | decision-authority method | `specification-design` for product meaning; `program-design` only for user-owned/public/irreversible technical choices; orchestration records blocked state | split by decision altitude |
| UX/API/CLI observable behavior and failure states | general specification design | `specification-design` | preserve and deepen |
| Minimal, clean-boundary, and pragmatic architecture option lanes | general program-design alternative formation | `program-design` | compose into a design-alternatives method; retain optional advisors/subagents, drop mandatory three-lane fan-out |
| Accepted debt, payer, and exact revisit signal | general program design | `program-design` | preserve |
| Owners, sources of truth, allowed/forbidden edges, and enforceable invariants | general program design | `program-design` | preserve and require where structural |
| Risk assumptions, falsifying probes, containment, reversibility, and proof burden | general program design | `program-design`; pair review independently challenges the result | preserve and compose |
| Security assets, entry points, trust boundaries, misuse cases, invariants, and security non-goals | specification obligations plus program security architecture | split: `specification-design` owns externally required security obligations/non-goals; `program-design` owns trust-boundary realization and failure containment | split rather than duplicate |
| Creation evidence schema | lane result shape | each authoring skill owns a capability-specific evidence result; generic envelope remains in `manage-agents` | split payload, reuse generic receipt envelope |
| Fixed mandatory option lanes and sidekick-by-default topology | swarm topology | none | drop from active behavior |
| Skill-local duplication of model/session/permission mechanics | generic agent mechanics | `manage-agents` | remove; phase skills compose the generic packet with domain fields |
| Optional handoff from creation to review | workflow transition | `spec-design` | replace with mandatory orchestrated transition when full workflow is active; direct phase invocation returns a terminal phase result |

### Existing `spec-review-swarm`

| Source behavior | Classification | Final owner | Transformation |
| --- | --- | --- | --- |
| Whole-file reading and artifact-as-claims discipline | common review method | `spec-program-review` | preserve |
| Product-intent review | specification local review and pair review | `specification-design` owns local check; `spec-program-review` independently repeats it for pair authority | split by review scope |
| Requirement testability and vague-verb repair | specification construction/local review | `specification-design` | move upstream as craft and local review; pair review samples/repeats independently |
| Contract owner/consumer/input/output/state/invariant/negative-space/examples checklist | split specification/program contract judgment | `specification-design` owns external/observable contracts; `program-design` owns internal interfaces/state; `spec-program-review` checks the boundary between them | split by contract altitude |
| Architecture noun interrogation and boundary smells | program-design local review and pair integration review | `program-design` local review; `spec-program-review` independently checks load-bearing pair boundaries | split and repeat intentionally |
| Crux inversion and “two implementers diverge” probe | common pair review | `spec-program-review` | preserve |
| Planning-readiness pretend-planner test | pair review | `spec-program-review` | preserve; planner may choose sequence/commands, never product meaning or architecture |
| Requirement-level proof modality vs structural proof seam | specification/program boundary | `specification-design` owns required proof modality; `program-design` owns structural/test/observability seams | split |
| Progressive disclosure review | general artifact readability plus skill-authoring meta-design | `specification-design` owns specification readability; `program-design` owns general structural navigation; `skills-creation` owns the new skills' `SKILL.md`/references/lanes/scripts mapping | split by semantic owner |
| Harness/platform fit | program-design platform boundary plus skill-authoring platform mechanics | `program-design` owns product/runtime platform constraints and seams; `skills-creation` owns client-specific skill mechanics; `spec-program-review` may select a focused lane for either declared boundary | split construction from independent verification |
| Spec difference against prototype/current behavior | conditional evidence/review lane | `spec-program-review` when reviewing a pair; authoring skills may request bounded evidence earlier | preserve as predicate-selected lane |
| Security threat-model review | focused pair-review lane | `spec-program-review` | preserve, while construction duties remain split across specification and program design |
| Performance, privacy/data-lifecycle/compliance, accessibility, and platform quality obligations | specification obligations plus structural realization and review | `specification-design` owns observable obligations; `program-design` owns owner/mechanism/failure/proof realization; `spec-program-review` checks the chain | preserve applicable domain judgment without creating one mandatory lane per quality attribute |
| Guardrail codification | program design plus planning | `program-design` names invariant and enforcement class/seam; planning chooses exact files, tasks, commands, and integration order | split |
| Finding schema: anchor, failure path, next-agent guess, smallest target, validation note | common review result | `spec-program-review` | preserve and update routes to the new owning skills |
| Parent verifies, merges by root cause, preserves disagreement, prefers smallest correction | review reduction | `spec-program-review` produces parent-reduced candidate findings; `spec-design` owns cross-skill remediation and final acceptance | split review reduction from lifecycle authority |
| Eight mandatory lanes for every substantial review | fixed swarm topology | none | replace with one mode-complete review plus predicate-selected focused lanes; author self-check belongs to each design skill and fresh independent local/pair review belongs to `spec-program-review` |
| Reviewer directly edits or optional owner-facing handoff | authorship/workflow leak | none | reviewers remain read-only; `spec-design` routes parent-accepted findings to the owning phase skill |

### Existing `plan-creation-swarm`

The planning skill contains useful planning craft, but several judgments are currently allowed too late. The correction is not “move the lanes wholesale.” Split each lane's design decision from its implementation operationalization.

| Current planning behavior | Correct classification | Final owner / retained planning role |
| --- | --- | --- |
| Accept spec, design, product requirement, chat decision, or architecture docs as equivalent planning sources | source-resolution defect for design-bearing work | `spec-design` produces the accepted pair; planning may accept direct requirements only when no product/architecture design is needed under an explicit predicate |
| “The spec defines separability; planning defines sequence” | correct boundary principle | preserve in plan creation; `program-design` must actually define the architectural separability it consumes |
| `codebase-boundary` chooses owners/boundaries and write surfaces | mixed | `program-design` chooses architectural owners/boundaries; planning verifies current repo anchors and maps accepted components to exact write surfaces/conflict points |
| `vertical-slice-decomposition` maps requirement → behavior → owner boundary → files → proof | mixed | `program-design` owns behavior realization, owner boundary, architectural slices, and proof seams; planning owns implementation slices, files, checkpoints, dependencies, and local proof execution |
| `validation-proof` chooses proof modalities/layers and evidence sources | mixed | `specification-design` owns required proof modality; `program-design` owns proof seams and necessary system-level layers; planning selects exact tests/harness commands, red/green sequence, evidence capture, and freshness guards |
| `security-reliability` chooses trust boundaries, failure modes, rollback, cleanup, races, and observability | mixed | specification owns obligations; program design owns trust boundaries, failure/retry/cleanup/recovery policy, concurrency, and observability architecture; planning operationalizes implementation/rollout/rollback tasks and proof gates |
| `execution-order` | genuine planning | retain entirely in plan creation |
| execution DAG, parallel lanes, disjoint write scopes, and integration gates | genuine planning | retain entirely in plan creation |
| requirements/proof matrix | mixed consumer artifact | accepted specs provide requirement, modality, and design seam; plan adds owning task, exact proof gate, evidence source, freshness, red/green execution, and task-size fit |
| TDD order and exact validation commands | genuine planning/execution preparation | retain in planning |
| `scope-and-proof-fit` | genuine planning with route-back | retain, but missing product meaning, architecture, failure policy, or proof seam routes to `spec-design` instead of being invented |
| rollback/recovery notes | split | program design owns product/runtime recovery behavior; plan owns implementation and deployment rollback procedure |

### Existing `skills-creation`

`skills-creation` is the meta-design source for turning each accepted skill proposal into a skill package. The new design skills must remain usable outside skill authoring and must not duplicate this manual.

| Existing concept | Final owner in this design pass | Relationship to the new skills |
| --- | --- | --- |
| Great-skill frame: trigger, main path, depth, proof | `skills-creation` | each of the four specs is organized around these four surfaces; the general design skills do not teach the frame at runtime |
| Frontmatter trigger design | `skills-creation` | the four specs state invocation intent and adjacent boundaries; `skills-creation` owns final trigger wording and platform encoding |
| Scan-visible all-run spine | `skills-creation` | each spec defines the required behavior; `skills-creation` owns translating it into compact runtime `SKILL.md` prose |
| Progressive references and literal load calls | `skills-creation` | each spec proposes semantic owners and call results; `skills-creation` owns final placement and call-contract validation |
| Lane qualification and lane authority | `skills-creation` plus the calling runtime skill | the spec names candidate bounded work; `skills-creation` proves lane qualification and authors the contracts; the implemented caller owns dispatch and reduction |
| Steering language and deletion test | implementation authoring | remain in `skills-creation`; program design may name failure forms and required behavior, not final prose |
| Pressure proof mechanics | implementation/proof | program design names claims, scenario families, and proof seams; `skills-creation` authors/runs proof after implementation |
| Proposal and implementation review workflow | meta-skill governance | this design pass uses it; the new `spec-program-review` owns product design-pair review, not skill-authoring governance |

### Current Monolithic Proposal and Candidate Re-review

| Claim | Classification |
| --- | --- |
| Why + What = specification; How = program design | preserve |
| Closed creation → review → remediation → refreshed review → acceptance cycle | preserve in `spec-design` orchestration |
| One skill contains all three capabilities | superseded by user decision; replace with four skills and explicit transition contracts |
| One integrating parent means no delegation | reject; parent integration and delegated bounded work are compatible |
| Pair revision, route-back, receipt invalidation, acceptance | retain in `spec-design`; simplify to the minimum state the four-skill workflow needs |
| Detailed specification/program/review craft inside the orchestration spec | move to the three phase-skill specs |
| Current re-review's four-document but one-runtime-skill conclusion | stale and superseded |
| Current re-review's source-preservation, lane-fidelity, missing-spine, skill-program-design, and planning-boundary observations | retain only after source verification; they remain useful classification inputs |

### Historical Research-Backed Craft

The 2026-07-28 monolithic proposal at `48b5206` contained domain teaching synthesized from the old local skills plus EARS/requirements guidance, design-doc and ADR practice, and admired upstream skill collections. Its topology and artifact lifecycle are not authoritative, but the craft must be classified rather than silently lost.

| Earlier judgment | Final owner | Preserve / adapt / drop |
| --- | --- | --- |
| facts are looked up; decisions are asked one at a time with a recommendation and consequence | `specification-design` | preserve the evidence/authority split and one-decision resolution; adapt broad tacit interviews to the existing `discuss-pathfinding` boundary |
| decompose independently governed scope before refining details | `specification-design` | preserve as a semantic-boundary check before requirement polishing |
| EARS conditional shapes, fault `If/then`, compound-requirement split, stranger test, and vague-verb repair | `specification-design` | preserve as requirement-construction tools, not a mandatory output template |
| nearest-plausible-expansion non-goals and complete external-contract fields | `specification-design` | preserve |
| integrated Design Overview before detail inventory | `program-design` | preserve as the composition gate; adapt from one-page prescription to the smallest walkable overview |
| design-it-twice, deep-module deletion test, noun interrogation, caller-first interface design, and seam justification | `program-design` | preserve as design taste; reject a literal two-adapter prerequisite where trust, process, lifecycle, or proof boundaries already justify the seam |
| degree of constraint plus `changes / remains authoritative` | `program-design` | preserve to stop accidental redesign of legacy rationale |
| falsifying probes, failure containment, reversibility, and dependency-category proof strategy | `program-design` | preserve; proof modality remains specification-owned and exact proof execution remains planning-owned |
| complete read, dependency-order review, end-to-end trace, four-source authority drill, crux inversion, three-sentence reconstruction, pretend planner, and behavior-effect finding quality | `spec-program-review` | preserve in the common review method loaded before mode/focused judgment |
| doubt-theater detection when review volume produces no verified signal | `spec-program-review` | preserve as a review-contract recalibration stop, never as an acceptance shortcut |
| one monolithic runtime skill, synchronized sibling headers, mandatory stable claim-ID vocabulary, and fixed artifact skeletons | none as general craft | drop; the decomposed skills use digest-bound contracts and semantic homes without imposing one universal document schema |
| mandatory option-agent fan-out, broad review swarm, agent count as confidence, and duplicated session mechanics | none | drop; bounded qualified delegation and fresh independent review remain available through caller-owned predicates and `manage-agents` |

## Lane Ownership

Removing swarm topology does not remove lanes. Each skill owns only the lanes that advance its own terminal result.

Local review has three non-substitutable layers:

1. The authoring skill performs its own construction self-check.
2. Substantial direct or orchestrated authoring receives a fresh independent local review owned by `spec-program-review` in the applicable local mode.
3. Orchestrated acceptance requires an independent whole-pair review, which repeats load-bearing local checks rather than trusting the author receipts.

No self-check, local review, focused lane, or prior pair receipt substitutes for another required result.

### `specification-design`

- parameterized evidence lookup for a named product/contract question;
- observable-surface exploration when UX/API/CLI behavior is load-bearing;
- bounded section writer after requirement meaning and authority are mapped;
- author-owned construction self-check;
- mandatory call to `spec-program-review` review-requirement classification; when it returns `review-required`, a separate specification-only mode invocation performs fresh local review;
- optional product-intent or external-contract specialist when the predicate holds.

### `program-design`

- current-system explorer returning owners, call paths, state, boundaries, proof patterns, and files the parent must read;
- bounded component/call/state/flow/failure modeler after current evidence exists;
- bounded section writer after selected alternatives and invariants are mapped;
- author-owned construction self-check;
- mandatory call to `spec-program-review` review-requirement classification; when it returns `review-required`, a separate program-only mode invocation performs fresh local review;
- optional security/reliability, platform/harness, data/concurrency, or cross-cutting-realization specialist when the predicate holds.

### `spec-program-review`

- one mandatory fresh mode-complete reviewer for every invoked review mode;
- fresh specification-only and program-only reviewers when those local modes are invoked;
- mandatory fresh whole-pair reviewer;
- predicate-selected specification authority, architecture boundary, contract, failure, security, platform, difference, or proof focused reviewers;
- no artifact-writing lanes.

### Ownership of lane mechanics

| Surface | Owner |
| --- | --- |
| Whether and when the lane runs | calling phase skill |
| Instance packet, prerequisites, instance authority, receipt collection, and parent reduction | calling phase skill |
| Stable mission, maximum authority, non-goals, calibration, stop condition, and lane-specific result | lane reference in the calling phase skill |
| Common lane fields used by multiple lanes in one skill | that skill's lane schema |
| Model/runtime/permission/session mechanics and generic packet envelope | `manage-agents` |
| Cross-skill phase transition and final acceptance | `spec-design` |

## Canonical State Ownership

`spec-design` owns one orchestration record. It is the only cross-artifact lifecycle source of truth and contains:

- workflow identity and current phase;
- next required skill and reason;
- specification and program-design paths, identities, revisions, and digests;
- current local specification and program-design results, each bound to its covered digest;
- current review result and covered pair digests;
- open findings, dispositions, semantic owners, and remediation status;
- invalidation and refresh requirements;
- stop/resume inputs;
- final pair-acceptance record and planning-handoff identity.

Artifact-local metadata may identify that artifact and its local result. It must not copy the orchestration phase, next owner, open finding state, or pair acceptance. This avoids synchronized lifecycle truth spread across two headers, a ledger, and review receipts.

## Three-Advisor Reduction

Three fresh-context advisors reviewed the classification problem from different lineages: OpenAI Sol xhigh, Cursor Fable high, and Cursor Kimi K3. The parent accepted the following convergent guidance:

- four independently invocable skills are coherent only with one canonical lifecycle owner;
- the orchestrator owns ceremony and state, not craft;
- general specification and program-design craft must stay general;
- skill-target translation remains in `skills-creation` rather than runtime adapter skills;
- direct phase invocation returns a local terminal result but cannot close the pair;
- author self-check, fresh local review, pair review, and focused review are distinct results;
- pair review stays read-only and non-accepting; remediation returns to the semantic author;
- planning must consume owners, interfaces, state, flow, failure policy, trust boundaries, recovery semantics, and proof seams instead of inventing them;
- rejection of a swarm means no fixed fan-out topology, not a ban on bounded delegation.

The parent rejected or superseded these advisor/candidate positions:

- three capability modules inside one runtime skill: superseded by the user's four-skill decision and independent-invocation requirement;
- three phase skills with no orchestrator: rejected because resume, remediation, invalidation, and pair acceptance would have no single owner;
- skill-specific runtime adapter skills: rejected as contamination of general craft and duplication of `skills-creation`;
- copied lifecycle state in both artifacts: rejected in favor of one orchestration record.

No unresolved architectural question blocks the four specs. Exact filenames, compact runtime wording, and proof scenario implementation remain downstream `skills-creation` work rather than classification gaps.

## Proof Ownership

```text
specification-design
  owns: what observable evidence class must prove each obligation

program-design
  owns: where the system exposes the seams needed to obtain that evidence

spec-program-review
  owns: whether modality and seam together are sufficient and traceable

plan creation
  owns: exact tests, commands, tasks, order, evidence capture, freshness,
        and red/green execution

implementation
  produces: the evidence
```

## Classification Completion Test

Classification is ready to drive the four specs only when:

- each retained judgment has one final owner;
- general craft and skill-authoring meta-design are separate;
- local and pair reviews have distinct results;
- every plan-creation overlap is split at the design/planning boundary;
- every lane has one caller, one stable mission owner, bounded authority, and a parent reduction point;
- the orchestrator owns no phase craft and phase skills own no cross-skill acceptance;
- the three advisor receipts are reduced into accepted, rejected, or unresolved changes to this matrix.

All completion conditions are satisfied for this design pass.
