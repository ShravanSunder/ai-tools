# Spec Design Workflow — Ground-Up `skills-creation` Re-review

Date: 2026-07-29

Status: current-digest review complete; targeted revision required; implementation remains blocked

Review target: `docs/specs/2026-07-28-spec-design-workflow/2026-07-28-spec-design-workflow.md`

## Target binding

- Repository HEAD: `7142c0aa64caf222ec4952f2561847b603f76fe8`
- Proposal Git blob: `22484b7a54d945ec8cbf654cb1dd8b6a788321fa`
- Proposal SHA-256: `729cf79b4123f6974836a92b250b7aeb563ec405b502757419a4d8b551d34aaf`
- Proposal length: 819 lines
- Owning evaluation workflow: `shravan-dev-workflow:skills-creation`
- Agent coordination: `shravan-dev-workflow:manage-agents`
- Formal review lanes: `mental-model-fit`, `trigger-routing`, `rule-agreement`
- Independent advisors: Cursor ACPX Claude Fable high, Cursor ACPX Kimi K3 max, native OpenAI Sol xhigh
- Formal lane reviewers: native OpenAI Sol xhigh, fresh history, read-only
- Pressure tests: not run, per explicit user instruction
- Stale-review rule: all receipts for earlier 553-line and 746-line proposal digests received zero credit

## Direct answer

The remediation is real, but the proposal is not ready to implement.

It now contains substantive specification, program-design, and review craft. This is no longer the prior “state machinery with no teaching” draft. The useful content includes:

- specification construction: problem → consumers → outcomes → success criteria → requirements; user-decision questions; EARS; vague-verb repair; requirement-versus-task separation; non-goals; contracts; edge cases; tradeoffs;
- program design: integrated overview first; grounding; alternatives; deep modules; ownership and source-of-truth interrogation; caller-first interfaces; assumption probes; failure containment; proof seams;
- pair review: dependency-order reading; traceability; authority audit; crux inversion; cross-requirement integration; planning readiness; evidence-bound finding quality.

The remaining defect is that the operational contracts do not reliably force that craft. A fresh agent can still satisfy the observable guards while:

1. solving the wrong product problem with formally testable requirements;
2. producing a consistent inventory of modules rather than a composed program design;
3. writing schema-owned records before loading their schema;
4. following contradictory ledger, authority, invalidation, and routing rules.

The proposal therefore receives:

```text
verdict: targeted-revision
implementation decision: revise-first
ship decision: blocked
```

The promise and one-workflow mental model remain viable. The required revisions are substantial but bounded to quality gates, ownership/call contracts, recovery semantics, routing wording, and proof design. If the user selects three separately invocable skills instead of three modules inside one workflow, this proposal becomes `significant-rewrite` because its trigger, state owner, transitions, and acceptance ownership all change.

## Skill-boundary decision

### Recommendation

Keep one model-invocable `spec-design` workflow with three deep, mandatory capability modules:

```text
spec-design/SKILL.md
  owns: one invocation, lifecycle, transitions, ledger routing,
        remediation loop, and final acceptance

  drafting-specification.md
    owns: Why/What construction and local specification-quality check
    cannot: accept the pair

  drafting-program-design.md
    owns: How construction and local program-design integration check
    cannot: accept the pair

  reviewing-pair.md + focused lane references
    own: independent pair-review judgment and candidate findings
    cannot: author semantic corrections or accept by reviewer consensus
```

Why: the three crafts are distinct, but their lifecycle is not. Program design can expose missing requirements; review findings can affect either artifact; a specification change invalidates downstream How and pair-review coverage. Keeping the completion boundary around the whole cycle makes those returns mandatory rather than optional-looking handoffs.

The independent advice was intentionally not unanimous:

- Fable, Kimi, mental-model-fit, and rule-agreement recommend one workflow with three deep modules.
- Sol recommends three named skills joined by one canonical persisted lifecycle and mandatory successor transitions.
- Trigger-routing found that three peer skills alone are incoherent: if separate invocation is load-bearing, a fourth workflow owner is the clean routing shape; otherwise one of the three secretly becomes the orchestrator.

The three-skill alternative is not rejected forever. Reconsider it only if implementation evidence shows the unified workflow cannot route direct stage asks, exceeds useful context, or cannot resume reliably. If selected, first write a replacement architecture contract naming one canonical state owner, `next owner`, mandatory transition semantics, revision-bound local receipts, invalidation, remediation return, and sole pair-acceptance authority. Ordinary “run the next skill” recommendations are insufficient.

### Program design is a real discipline inside the workflow

Program design must not be reduced to prose headings. Its teaching reference should explain when to use and how to judge:

- component/responsibility trees;
- current and target production call graphs;
- test/proof call graphs and substitution points;
- state-ownership and mutation maps;
- normal, failure, recovery, and partial-success flows;
- dependency direction and forbidden edges;
- module-depth/deletion tests;
- alternatives under different forcing constraints;
- proof reachability through real seams.

These are conditional forms, not universal headings. A diagram is useful only when it makes composition inspectable; an unwalked diagram can be another inventory.

## What held

The following remediation claims are genuinely present at this digest:

- the process ledger begins with the pair lifecycle at line 132;
- `reviewing-pair.md` is named as the sole common-review owner and mandatory reviewer load at lines 324 and 375–410;
- first-design acceptance no longer requires a predecessor at line 342;
- the path ban permits evidentiary anchors at line 275;
- all six focused lane blocks include good/bad signals, overlap, and stop language at lines 444–535;
- the implementation call-contract block exists at lines 538–557;
- section writers cannot originate semantic decisions at line 577;
- reciprocal `docs-maintain` and `ops-security-review` boundary edits are mandatory at line 806;
- admired-source provenance maintenance is required at line 811;
- useful old skill judgment is substantially adapted while fixed swarm topology is dropped.

The useful old-skill carryover is not imaginary:

- `user-decision-questions.md` → one material question, recommendation, consequence, and no vague approval;
- `product-intent.md` and `requirements-testability.md` → Why/What ordering, traceability, testable obligations, and vague-verb repair;
- architecture option lanes → “design it twice,” explicit alternatives, smallest boundary, debt, payer, and revisit signal without separate option agents;
- `risk-and-tradeoff-design.md` → assumptions, falsifying probes, containment, reversibility, and proof burden;
- `whole-spec-coverage`, `adversarial-crux`, `planning-readiness`, `architecture-boundaries`, contract, security, harness, difference, and validation lanes → common/focused review judgment.

What must be dropped remains correct: fixed option-agent topology, mandatory broad review swarm, agent count as confidence, optional phase handoffs, and duplicated packet mechanics already owned by `manage-agents`.

## Ranked accepted findings

### 1. Wrong-but-formally-complete specifications can pass

Severity: blocker

Evidence:

- Line 191 teaches bidirectional outcome/requirement reasoning.
- Line 328 says review starts from the problem and stops on a fatal upstream flaw.
- Lines 422–424 reduce the drafting result to requirement testability and open decisions.
- Lines 448–451 require the whole-pair reviewer to repeat requirement-quality and integration passes, not product-intent quality.
- Lines 583–595 contain no explicit problem/consumer/outcome/success-criteria authority and coverage gate.

Behavior risk: a coherent set of testable requirements can solve the wrong problem, serve the wrong consumer, or omit an outcome while every ID, basis, traceability row, and ledger record is formally complete.

Smallest fix: make `drafting-specification.md` and the independent whole-pair review return a specification-quality result that proves:

- problem, consumers, outcomes, and success criteria are source-backed or user-confirmed;
- every outcome has at least one requirement;
- every requirement traces to an outcome or named external constraint without changing meaning;
- success criteria are observable;
- no missing product decision is disguised as a technical choice.

Add these predicates to DRAFTING and acceptance, not only to craft prose.

### 2. Consistent inventory-only program designs can pass

Severity: blocker

Evidence:

- Lines 251–259 correctly say headings and traceability can be inventory, not design, and demand an integrated overview.
- Lines 428–439 reduce the drafting result to absence of contradictions in ownership, direction, lifecycle, and failure propagation.
- Line 666 checks agreement with the overview, not whether the overview demonstrates composition or useful depth.
- Line 592 checks explicitness and mutual consistency.
- Line 817's `unintegrated How` scenario covers contradictory owners/failure propagation, not a shallow but consistent inventory.

Behavior risk: a one-page list of modules, owners, flows, and proof seams can be internally consistent and still fail to show how the system works, where state moves, how production and tests compose dependencies, or whether modules earn their interfaces.

Smallest fix: make `drafting-program-design.md` return a program-design-quality result, separate from consistency, that conditionally includes the component/call/state/flow forms above and proves one normal path plus one falsifying failure path end to end. Require alternatives and module-depth judgment for load-bearing choices. The whole-pair reviewer independently challenges composition rather than trusting the author's result.

### 3. Lane authority is assigned to the wrong owner

Severity: blocker

Evidence:

- Line 408 assigns maximum authority, stop condition, and per-role contract content to `review-cycle-schema.md`.
- `reference-lanes-design.md` lines 29–48 and 69–77 assign stable maximum authority, non-goals, local receipt detail, calibration, and stop condition to the lane reference; the caller owns dispatch mode, instance authority, scheduling, and reduction; a schema owns common fields only.
- Line 408 calls an instance question packet the evidence contributor's lane reference.

Behavior risk: schema and lane references can state different authority ceilings or stop conditions, and evidence lookup becomes an unqualified lane with no stable job contract.

Smallest fix: let the workflow/schema own caller-side predicate, packet fields, prerequisites, parallel-safety basis, instance authority, expected receipt envelope, and reduction point. Keep stable mission, maximum authority, non-goals, local judgment, lane receipt detail, and stop condition in each lane reference. Give evidence lookup one parameterized lane reference or classify it as an ordinary bounded Delegate call rather than a lane.

### 4. The schema is loaded after earlier consumers need it

Severity: blocker

Evidence:

- Line 408 makes `review-cycle-schema.md` own pre-pair receipts, drafting-check records, and dispatch shapes.
- Lines 554–556 load it only before first dispatch.
- Lines 656–658 can emit a pre-pair receipt before any dispatch.
- Line 666 must write drafting-check records before REVIEW.

Behavior risk: a no-subagent run invents the schema-owned ledger and drafting records without opening their authority; a pre-pair stop can invent its receipt shape.

Smallest fix: load the schema before the earliest of lifecycle-ledger creation, pre-pair receipt emission, drafting-check write, or dispatch. Retain a first-dispatch check as a separate guard.

### 5. Ledger lifecycle and recovery still contradict themselves

Severity: blocker

Evidence:

- Line 132 creates the process ledger at pair-lifecycle start and gives phase-sensitive missing-proof recovery.
- Line 611 says any missing ledger starts a fresh cycle.
- Line 670 says REVIEW entry “opens” the mandatory ledger.
- Drafting records exist before a review cycle id, although line 132 describes records as keyed by revision and cycle.

Behavior risk: a resumed agent can create the ledger at initialization, wait until REVIEW, or skip missing drafting checks and open a review cycle. Only the first is compatible with DRAFTING.

Smallest fix: use one term, `workflow process ledger`. Create it immediately after synchronized pair initialization. Key drafting checks by revision; key review/reduction/remediation records by revision and cycle. REVIEW verifies the ledger and appends a cycle—it does not create it. Missing drafting proof reruns DRAFTING checks; missing review proof opens a fresh review cycle.

### 6. The teaching contracts still omit contracted judgment

Severity: blocker

Evidence:

- Line 410 promises drafting anatomy: capability, inputs, construction questions, decision boundaries, result, good/bad examples, calibration, completion.
- Lines 413–442 explicitly state only capability, teaches, result, and calibration.
- Line 410 promises lane-specific calibration bars.
- Lines 444–535 give focused lane missions, inspection, good/bad, overlap, stop, and result, but no explicit lane-specific calibration.
- Lines 552–553 require a `common review result`, but no `reviewing-pair.md` anatomy block defines that result or its stop condition.

Behavior risk: implementation can create every promised file and heading while inventing the actual inputs, authority boundary, completion bar, common result, or lane calibration. Generic prose can satisfy file existence.

Smallest fix: explicitly complete every contracted anatomy slot. Define the common result as at least: dependency-order coverage attestation, four-source authority sort, crux list, three-sentence design restatement, planning-readiness verdict, and candidate findings. Load common and focused reviewer references before inspection and return one combined receipt after both passes.

### 7. Requirement proof expectations have no stable Why/What owner

Severity: important

Evidence:

- Line 338 says planning may not invent proof expectations.
- The specification skeleton at lines 727–746 has no proof-expectations surface.
- Program Design owns `Test and Proof Seams` at line 778 and each traceability row owns a proof seam at line 793.
- The old validation craft distinguishes requirement-level proof modality from the structural seam that enables it.

Behavior risk: “API boundary” can be recorded as a proof seam without deciding whether a user-visible requirement needs unit, integration, runtime, manual/visual, state/data, trace/metric, smoke, or release proof. Planning then invents proof expectations.

Smallest fix: Specification owns requirement-level observable proof expectation and applicable modality/layer without commands. Program Design owns the structural seam enabling it. Pair review checks expectation-to-seam compatibility.

### 8. Current-system grounding has no consumed result

Severity: important

Evidence:

- Line 261 requires a traced current-system model and recovered rationale.
- FRAMING at lines 654–658 can pass with sources, open questions, and security classification.
- Lines 428–439 and 548–550 consume only integration status and assumptions.

Behavior risk: filenames can be listed as sources while the design is built around the wrong owner, accidental implementation shape, or misunderstood proof pattern.

Smallest fix: adapt the successful non-swarm part of `codebase-explorer` into a parent-owned current-system model: owners/sources of truth, interfaces/invariants, nearby patterns, proof patterns, current rationale or explicit unknown, observation versus inference, and files personally opened. Make it a revision-bound FRAMING/program-design input.

### 9. Whole-pair receipt invalidation under-covers its own judgment

Severity: important

Evidence:

- Line 371 invalidates whole-pair coverage for requirements, bases, material claims/invariants, public contracts, ownership, source of truth, and main flow.
- Lines 314, 336, 437–438, and 592 also judge dependency direction, lifecycle, and material failure behavior.

Behavior risk: a remediation changing only dependency direction, lifecycle, or failure policy can reuse a stale whole-pair receipt.

Smallest fix: make invalidation mirror the acceptance/integration dimensions and explicitly include Design Overview, dependency direction, lifecycle, and material failure behavior.

### 10. Trigger cutover remains incomplete at the always-loaded surface

Severity: blocker for routing

Evidence:

- The proposal makes `spec-design` the single pre-plan entry and plan creation accept only an accepted pair at lines 21, 55, and 808.
- The shipped `plan-creation-swarm` description still accepts a `product requirement`.
- Line 808 changes plan creation's body entry contract, not its frontmatter.
- Line 806 requires `docs-maintain` and `ops-security-review` reciprocal boundaries but does not provide literal future wording.

Behavior risk: bare requirements still route first to plan creation; semantic spec revision can route to docs maintenance; in-cycle threat modeling can route to standalone security review. Body-only correction arrives after the routing decision.

Smallest fix: make exact frontmatter wording part of the proposal for all three reciprocal boundaries. Plan creation should trigger only on a synchronously accepted pair and explicitly reject bare requirements, chat decisions, and unpaired artifacts.

### 11. Acceptance permits unresolved material design decisions

Severity: blocker

Evidence:

- Line 587 allows a normative-force structural decision to carry an accepting basis **or an `Open Design Decisions` entry**.
- Lines 583–595 do not require every material open product/design decision to be resolved.
- Line 595's contested rule applies to review findings, not artifact-native open decisions.

Behavior risk: planning receives an accepted pair while a structural choice that can alter ownership, contract, or behavior remains open.

Smallest fix: accepted pairs contain zero material open product or design decisions. Deliberate implementation freedom is a bounded allowed range with proof expectations, not an open decision.

### 12. Review and confirmation semantics have smaller rule conflicts

Severity: important

The following should be corrected in the same contract pass:

- Lines 544–550 allow drafting references to load before completion, while line 662 requires them before drafting. Use the earlier load point.
- Lines 324 and 552–553 return common review before loading the lane mission. Load both before inspection; apply common then focused judgment; return one receipt.
- Lines 54/314 say exactly one whole-pair reviewer, while invalidating remediation requires a fresh second instance. Say one mandatory lane per cycle; every dispatch uses a fresh one-shot instance.
- Line 356 says every contested finding exits only through `decision-needed`; line 595 blocks only material contested findings. Pick one owner and rule.
- Line 177 permits confirmation before acceptance; line 589 requires confirmation in the current cycle. Define whether content-unchanged confirmations carry forward and persist the confirmation record.
- Desynchronized sibling recovery is unstated: never silently adopt one revision; treat the pair as reconstruction input.
- Line 60 understates the `manage-agents` change as a reviewer capability note, while line 809 changes the Delegate pattern table. Use one scope description.

### 13. Source adaptation needs a behavior-level preservation map

Severity: important, user-required

Evidence:

- Line 804 names source files and broad destinations.
- The actual proposal carries substantial old judgment, but phrases such as “architecture lanes' judgment content” still leave implementation selection implicit.

Behavior risk: an implementer can cite the old file while omitting its useful question/calibration, or accidentally preserve swarm topology instead of craft.

Smallest fix: add a source-adaptation matrix with columns:

```text
old file + exact section/judgment
new owner reference
preserve verbatim | adapt | drop
transformation rule
reason / failure prevented
```

At minimum map the user-decision question form; product-intent tracing; requirement quality; current-system grounding; minimal/clean/pragmatic decision lenses; risk/probes/reversibility; architecture-boundary interrogation; whole-pair coverage; crux inversion; planning readiness; contract/security/platform/difference/failure review; finding schema and parent reduction. Explicitly drop fixed fan-out, mandatory swarms, optional handoffs, and duplicated agent packet mechanics.

## Proof-plan gaps

No pressure tests were run in this review. The future proof plan itself remains incomplete.

Line 817 should add scenarios for:

1. formally complete pair solving the wrong or unsupported problem;
2. correct-looking IDs and bases with weak consumers/outcomes/success criteria;
3. consistent but inventory-only How with shallow modules and no walkable composition;
4. component/call/state diagrams present but not connected to requirements or proof;
5. schema-owned drafting record attempted before schema load;
6. missing ledger at each lifecycle phase;
7. failure-policy-only remediation invalidating whole-pair coverage;
8. material `Open Design Decisions` surviving to acceptance;
9. exact reciprocal trigger cases for bare-requirements-to-plan, semantic spec revision, and in-cycle threat modeling;
10. behavior-level source adaptation: useful old judgment present while swarm topology is absent.

These are future implementation proof requirements only. This review did not execute them.

## Findings rejected or narrowed

### “The proposal still contains no actual teaching”

Rejected. Lines 185–277 and 326–344 contain substantive craft. The remaining problem is that guards, records, and reference contracts do not force all of it.

### “The old skills contributed nothing useful”

Rejected. Several old references contain strong judgment worth preserving. What failed was the fixed creation/review swarm topology, authority blindness, and optional handoff—not every underlying question or calibration.

### “Three separately invocable skills are obviously better”

Not established. One independent Sol advisor supports the split; four independent perspectives prefer one workflow with three deep modules. Three peer skills without one lifecycle owner are rejected. The split remains a deliberate future option contingent on trigger/context/resume evidence.

### “Add a fourth orchestrator immediately”

Rejected for now. It becomes necessary only if separate invocation is chosen and no phase skill can own generic start/resume/remediation routing without losing its single job. There is no current implementation evidence requiring that added surface.

### “A component tree or call graph alone proves program design”

Rejected. These forms make structure inspectable; they do not prove composition without requirement trace, state/flow semantics, failure behavior, alternatives, and proof reachability.

## Parent reduction of independent receipts

```text
mental-model-fit: complete; targeted-revision
  accepted: proof ownership; current-system grounding
  architecture addendum: one workflow, three modules

trigger-routing: complete; targeted-revision
  accepted: plan-creation reciprocal frontmatter; literal docs/security wording
  architecture addendum: three peer skills need one workflow owner

rule-agreement: complete; targeted-revision with blocker overrides
  accepted: lane authority owner; schema timing; ledger contradictions;
            load order; reviewer lane/instance cardinality
  architecture addendum: one workflow, three internal jobs

Fable advisor: complete; targeted-revision
  accepted: invalidation, common-result anatomy, contested/confirmation rules,
            recovery, routing asymmetry, consistent-inventory proof gap
  architecture: one workflow, three modules

Kimi K3 advisor: complete; targeted-revision
  accepted: reviewer-lineage diversity; confirmation persistence
  parent rejected Kimi's claim that current wrong-problem and shallow-consistent-
  design gates are already sufficient; the cited prose does not create a hard
  product-intent or composition result consumed by the guards
  architecture: one workflow, three modules

Sol xhigh advisor: complete; significant-rewrite recommendation
  accepted: wrong-problem gate; inventory-only How gate; material open-decision
            loophole; conditional structural views; explicit preserve/adapt/drop
  contested/rejected for this proposal: immediate three-skill split and canonical
  state ownership by spec-program-review
  architecture: three skills, one persisted lifecycle, no fourth skill initially
```

Silence was not counted as clean. Every advisor and lane returned a terminal receipt bound to this digest.

## First required revision

Strengthen the two craft gates before adding more lifecycle machinery:

1. Define a complete specification-quality result that rejects wrong problem/consumer/outcome/success framing.
2. Define a complete program-design-quality result that rejects consistent inventory and requires inspectable composition, using component/call/state/flow forms where relevant.
3. Make the mandatory independent reviewer repeat those two results.

Then repair ownership, schema load timing, ledger recovery, invalidation, acceptance, and trigger wording around those stronger results. Otherwise the workflow will recover and review the wrong artifacts very reliably.

## Retest and next decision

After revision:

- bind the new review to the new HEAD/blob/SHA-256/line count;
- rerun `skills-creation` proposal review from zero;
- rerun exactly `mental-model-fit`, `trigger-routing`, and `rule-agreement` with fresh reviewers;
- do not credit this digest's receipts;
- decide explicitly whether the architecture remains one skill with three modules or changes to separately invocable skills before implementation begins.

Implementation may not start from this proposal digest.
