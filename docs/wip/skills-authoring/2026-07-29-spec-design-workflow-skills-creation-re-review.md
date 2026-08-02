# Spec Design Workflow — Architecture Re-review

Date: 2026-07-29

Status: mental-model break; document restructure required before proposal remediation

Review target: `docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md`

## Target Binding

- Repository HEAD: `d732a242551743392347643d057370abf7f98322`
- Proposal Git blob: `22484b7a54d945ec8cbf654cb1dd8b6a788321fa`
- Proposal SHA-256: `729cf79b4123f6974836a92b250b7aeb563ec405b502757419a4d8b551d34aaf`
- Proposal length: 819 lines
- Owning evaluation workflow: `shravan-dev-workflow:skills-creation`
- Agent coordination workflow: `shravan-dev-workflow:manage-agents`
- Proof posture: complete static source review only; no pressure tests were run, by user instruction
- Mutation boundary: this review did not edit the proposal or either old skill tree

## Verdict

The proposal has a nominal section sequence but no usable document spine.

Its actual lifecycle is:

```text
FRAMING → DRAFTING → REVIEW → GATE
```

That lifecycle does not appear until line 609. Before it, the proposal interleaves lifecycle rules, specification craft, program-design craft, review judgment, schemas, agent policy, acceptance, and future reference anatomies. A fresh implementer cannot answer “where does this rule belong?” without reading the whole 819-line file and choosing among several plausible homes.

This is not a minor ordering defect. The missing ownership spine is producing the proposal's rule disagreements: the same lifecycle concern is stated in multiple sections with different meanings or timing.

The smallest coherent correction is:

1. One primary workflow spec that owns the closed lifecycle and all shared state.
2. One specification-design slice spec that teaches Why/What construction and local specification quality.
3. One program-design slice spec that teaches How construction and local program-design quality.
4. One spec-program-review slice spec that teaches independent review judgment over the pair.

These are four maintained design documents, not four runtime skills.

## Recommended Document Spine

```text
docs/specs/2026-07-28-spec-design-workflow/
├── 2026-07-28-spec-design-workflow.md
├── specification-design.md
├── program-design.md
└── spec-program-review.md
```

The primary document owns the package lifecycle. The three slices have no independent status, revision, transition, or acceptance authority. Each slice identifies the primary as its owner and supplies judgment to a primary-owned guard.

### Ownership Rule

The primary owns every predicate a workflow guard evaluates, every state effect, and every shape with two or more consumers. A slice owns the judgment one stage/reference teaches, its artifact format, and its local quality-result definition.

| Document | Owns | Must not own |
| --- | --- | --- |
| Primary workflow | trigger and entries; pair lifecycle; canonical workflow record; revision and cycle rules; transitions; dispatch rights; receipt invalidation; remediation routing; gate; final acceptance; handoff; cutover; proof obligations | detailed specification, program-design, or reviewer craft |
| Specification design | problem/consumer/outcome authority; requirements; normative basis; observable behavior; public contracts; non-goals; specification format; local specification-quality method and result | How decisions; shared lifecycle state; final pair acceptance |
| Program design | current-system grounding; component/responsibility tree; production and test call graphs; ownership/state maps; interfaces; normal and failure flows; alternatives; containment; proof seams; program-design format; local program-design-quality method and result | new product meaning or requirements; shared lifecycle state; final pair acceptance |
| Spec-program review | common pair-review method; independent authority and traceability review; focused judgment selection; failure-path findings; planning-readiness judgment; correction-verification method | artifact authorship; revision changes; receipt invalidation rules; remediation state transitions; final acceptance |

## Runtime Skill Architecture

Recommendation: one invocable `spec-design` workflow skill with three mandatory deep modules.

```text
spec-design/SKILL.md
  ├── specification-design module
  ├── program-design module
  └── spec-program-review module
```

The three capabilities are genuinely different, but they are not independently complete workflows:

- Program design may not proceed without authoritative Why/What.
- A How discovery that changes product meaning must return to specification design.
- Pair findings may route to either artifact and must return to refreshed review.
- Final acceptance is pair-wide and revision-wide.

Three peer skills would move mandatory transitions between invocations and recreate the optional-handoff/open-loop failure the replacement is intended to remove. If three peer skills were required, a fourth router would be necessary for generic start, continue, resume, and cross-artifact remediation. Current evidence does not justify that extra runtime owner.

Independence comes from fresh-context, read-only reviewers returning candidate findings. It does not require review to be a separately invocable skill.

## Skill Program Design

When the workflow designs a skill, the program-design artifact must treat the skill as an executable system. It maps the behavioral specification to the physical skill tree, runtime flow, reference loading, lane contracts, deterministic mechanics, platform boundaries, and proof surfaces.

The intended implementation structure for `spec-design` is:

```text
plugins/shravan-dev-workflow/skills/spec-design/
├── SKILL.md
├── references/
│   ├── specification-design.md
│   ├── program-design.md
│   ├── workflow-record.md
│   ├── artifact-formats.md
│   └── review/
│       ├── reviewing-pair.md
│       └── lanes/
│           ├── specification-quality.md
│           ├── program-design-quality.md
│           ├── whole-pair-integrity.md
│           ├── contract-review.md
│           ├── failure-mode.md
│           ├── security-trust-boundary.md
│           ├── platform-fit.md
│           └── difference-review.md
└── scripts/
    └── deterministic mechanics only when code is justified
```

`SKILL.md` owns the trigger, mental model, workflow spine, reference-load contract, lane-selection predicates, parent integration, and completion boundary. It stays compact enough that a fresh agent sees the whole route before loading depth.

`references/specification-design.md` owns Why/What construction, decision authority, requirement and contract craft, the specification format, and the local specification-quality result.

`references/program-design.md` owns current-system grounding, component and responsibility trees, production and test call graphs, ownership and state maps, interfaces, normal and failure flows, alternatives and tradeoffs, failure containment, proof seams, the program-design format, and the local program-design-quality result.

`references/workflow-record.md` owns the persisted current phase, revision, completed local checks, selected lanes, open findings, next owner, and resume inputs. It contains state shapes, not craft.

`references/artifact-formats.md` owns shared schemas consumed by more than one stage: lifecycle headers, traceability entries, drafting-check results, and review-result shapes.

`references/review/reviewing-pair.md` owns the common independent review method. Every reviewer loads it before its focused lane contract.

Each `references/review/lanes/*.md` file owns one stable reviewer mission, what it inspects, maximum authority, non-goals, calibration, overlap, stop condition, and focused result fields.

### Requirement-to-Implementation Mapping

| Behavioral concern | Runtime owner |
| --- | --- |
| Correct invocation and neighbour boundaries | `SKILL.md` frontmatter |
| Closed design lifecycle | `SKILL.md` main path |
| Specification-design craft | `references/specification-design.md` |
| Program-design craft | `references/program-design.md` |
| Persisted resume and recovery | `references/workflow-record.md` |
| Shared artifact and result shapes | `references/artifact-formats.md` |
| Common pair-review method | `references/review/reviewing-pair.md` |
| Focused review judgment | `references/review/lanes/*.md` |
| Generic agent runtime, permissions, and job packets | `manage-agents`, cited rather than copied |
| Deterministic transformations or validators | `scripts/`, only when justified |
| Behavioral proof | repository pressure scenarios and static validation |

## Lane Maintenance Model

Removing “swarm” removes the fixed fan-out topology, not subagents or lanes.

A lane is a stable bounded job contract. An agent instance performs that lane inside a workflow stage. The workflow parent retains the shared mental model, decision authority, integration responsibility, and final claim.

```text
workflow stage
├── parent establishes the decision target and sources
├── parent selects observable lane predicates
├── subagents perform bounded research, modeling, writing, or review
├── parent verifies and integrates every return
└── workflow continues from the resulting state
```

The ownership split is:

| Owner | Responsibility |
| --- | --- |
| `spec-design/SKILL.md` | decides when and why a lane runs; composes the instance packet; sets non-widening instance authority; consumes the receipt; integrates the result |
| Craft reference | supplies the shared construction method and result bar for bounded specification or program-design writing |
| Review lane reference | supplies the stable focused mission, maximum authority, non-goals, stop condition, and result detail |
| `manage-agents` | supplies generic model, runtime, permission, session, and job-packet mechanics |
| Parent | verifies sources, resolves conflicts, authors decisions, updates artifacts, and owns acceptance |

Permitted subagent work includes:

- bounded evidence lookup and codebase exploration;
- component, call-path, state, flow, or failure-model investigation;
- bounded section drafting against already-authoritative inputs;
- independent local specification-quality review;
- independent local program-design-quality review;
- mandatory whole-pair review; and
- predicate-selected security, contract, platform, difference, or failure review.

The prohibited topology is fixed parallel design authority: several agents independently choose product meaning or architecture and leave the parent to reconstruct a design from incompatible fragments. Subagents may generate evidence, models, candidate prose, and candidate findings. They do not silently originate normative requirements, select material alternatives, change artifact meaning, or accept the pair.

## Why the Current Proposal Feels Off

### 1. The workflow appears after the machinery

The nominal top-level order is Why, What, How, Formats, Changes. In practice, the `What` section spans lines 66–607 and contains most of the workflow, craft manuals, review method, schemas, reference design, agents, and acceptance gate. The state chart begins at line 609.

The primary document should establish the lifecycle, owners, state, transitions, and consuming guards first. It should then point to the three slice specs for the judgment those guards consume.

### 2. Specification craft and program-design craft are compressed inside a workflow contract

The proposal correctly separates Why/What from How, but it does not give either craft a maintained design surface with enough room to teach a fresh agent.

The program-design slice must teach composition, not inventory. Where relevant, its local result must require an inspectable component tree, current and target production call graph, test/proof call graph, state-ownership map, normal and failure flows, alternatives, and at least one simulated normal path and falsifying failure path.

The specification slice must reject a formally tidy specification that solves the wrong problem. Its local result must prove bidirectional outcome/requirement coverage and source-backed or user-confirmed problem, consumer, outcome, and success authority.

### 3. Review judgment and review state are mixed

The review slice should own how reviewers inspect the pair and determine whether a correction actually fixes a finding. The primary workflow should own when receipts are invalidated, which scopes are re-dispatched, how findings change state, and whether the pair is accepted.

This boundary prevents “reviewers accepted it” from becoming an acceptance mechanism. Reviewer output remains candidate evidence; the parent verifies and reduces it.

### 4. Shared workflow rules have multiple homes

The current proposal already contains conflicting homes for ledger creation, missing-ledger recovery, reference load timing, lane/reference authority, and reviewer-lane cardinality. These are symptoms of the same missing-spine problem. Restructuring must choose one primary owner before applying wording fixes; otherwise the fixes will produce another round of duplicated rules.

### 5. The old skills are treated too destructively

The old skills contain substantial craft worth retaining. Their defect is primarily topology: fixed creation fan-out, mandatory review swarm lanes, optional handoffs, and duplicated packet mechanics.

The hard cutover must mean active-routing replacement, not source deletion:

- Move both complete source trees outside the loadable skills tree, verbatim.
- Preserve every `SKILL.md` as `SKILL.retired.md`, every reference, any agent configuration, and provenance.
- Move their old pressure scenarios verbatim into the corresponding retired archive as historical evidence; do not delete them.
- Adapt their useful judgments into the three new active modules through an explicit preserve/adapt/drop matrix.
- Remove only old active routing, aliases, shims, fixed-swarm topology, and duplicate packet ownership.

The current “points at `spec-design` or is deleted” and “pressure scenarios are deleted” wording must be replaced.

## Old-Skill Content to Carry Forward

### Specification design

- one material decision question at a time, with recommendation and consequence
- product intent and consumer/outcome grounding
- requirement testability and vague-verb repair
- observable UX/API/CLI behavior and acceptance criteria
- external contract owner/consumer/input/output/state/invariant/forbidden-edge discipline
- proof modality at the requirement level

### Program design

- current owners, sources of truth, nearby patterns, and proof patterns
- smallest-safe, clean-boundary, and pragmatic lenses used as authoring questions, not agents
- accepted debt, payer, and exact revisit signal
- ownership, allowed/forbidden edges, mutation authority, and structural enforcement
- assumptions, falsifying probes, failure containment, reversibility, and proof burden
- security/trust-boundary and misuse-case reasoning

### Pair review

- whole-artifact reading and claims-not-truth discipline
- bidirectional outcome/requirement/design traceability
- architecture noun interrogation
- crux inversion and the two-implementers-diverge probe
- planning-readiness test
- failure-path finding schema, including what the next agent would guess
- parent verification, root-cause reduction, visible disagreement, and smallest correction
- security, platform-fit, difference, and high-risk failure review selected by observable predicates

## Advisor Reduction

Fresh independent advice was not unanimous on runtime skill count, but it was consistent on the underlying separation:

- Fable high: four maintained specs; one runtime workflow skill with three deep modules; primary owns lifecycle.
- Kimi K3: one runtime workflow skill; three stage capabilities are entry edges into one lifecycle, not separate closure boundaries.
- Two independent Sol xhigh reviews: one workflow owner with three internal jobs; separate peer skills recreate the open loop.
- One Sol xhigh architecture advisor preferred three peer skills joined by one persisted lifecycle.
- Trigger analysis found that three genuinely separate peer skills require a fourth workflow router for reliable start/resume/remediation routing.

Parent reduction: preserve the useful part of the minority view — make all three capabilities named, deep, and independently reviewable — without splitting the runtime completion boundary.

## Confirmed Direction

The user confirmed this document architecture:

```text
one primary workflow spec
  + specification-design slice
  + program-design slice
  + spec-program-review slice

one invocable spec-design workflow skill
  + three deep runtime modules
```

The user also clarified that removing swarm topology must not be interpreted as removing subagents. The revised design must preserve and improve bounded exploration, section-writing, modeling, local review, whole-pair review, and focused-review lanes inside the workflow.

Old-skill retirement mechanics are not a blocker for this architecture pass. The next proposal revision should restructure first, then fix surviving rule disagreements in their new owning homes, and bind every subsequent review to the four-file digest set.
