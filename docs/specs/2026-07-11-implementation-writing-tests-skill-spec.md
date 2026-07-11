# Implementation Writing Tests Skill Spec

status: skill-spec reviewed; ready for human review; implementation is not
authorized by this artifact alone

## Product Intent

`shravan-dev-workflow:implementation-writing-tests` helps agents turn a behavior
or proof claim into the smallest trustworthy test proof. It owns testing
judgment during planning, execution, audit, removal, and implementation review.
It does not own product implementation, task sequencing, reviewer reduction, or
release readiness.

The skill exists because passing tests are not automatically proof. Tests can
exercise mocks instead of behavior, compute their own expected answers, assert
nothing meaningful, use stale evidence, mislabel proof layers, or preserve dead
contracts. The skill should make those failures visible without forcing every
test through a large universal form.

## Source Precedence

1. This spec and current user decisions own the intended design.
2. Current `origin/master` repo instructions and `skills-creation` own the
   skill-authoring contract.
3. The implementation on PR #19 and its 2026-07-08 plan are current-state
   evidence, not the accepted design source.
4. Project-local test and proof-layer definitions override this skill's
   defaults.
5. Admired testing sources are concept inspiration only. Local behavior must be
   expressed independently and proven locally.

This spec supersedes the design portions of
`docs/plans/2026-07-08-implementation-writing-tests-skill-plan.md`. That plan's
implementation sequence and validation commands are not part of this contract.

## Current-State Evidence

The existing work established several good boundaries:

- A dedicated test-proof skill is a legitimate reusable owner.
- `plan-creation-swarm`, `plan-review-swarm`,
  `implementation-execute-plan`, and `implementation-review-swarm` are the
  correct lifecycle consumers.
- Public or observable seams, independent oracles, project-local proof terms,
  RED/GREEN freshness, false-proof rejection, and safe test-removal evidence are
  valuable durable judgments.
- Concrete pressure scenarios are a better proof shape than skill-summary
  prompts.

The current implementation also demonstrates the failure to correct:

- Its work categories do not materially change the route.
- Domain boundaries, illegal-state strategy, guards, and IO cases became
  universal requirements, including for stateless examples.
- The universal field list was copied into several phase skills and references.
- Several pressure scenarios reward the same irrelevant vocabulary.
- Focused fake-backend passes proved harness plumbing, not skill behavior; live
  GREEN behavior proof was not obtained.
- The feature branch is stale relative to the current meta-skill and plugin
  contracts on `origin/master`.

## Goals

1. Preserve one named owner for trustworthy implementation test proof.
2. Make the main path visible in one scan and useful without loading every
   reference.
3. Define a small all-run proof core that works for stateless, stateful,
   runtime, UI, CLI, protocol, and static-contract tests.
4. Route conditional testing depth through observable branch predicates and
   concrete return shapes.
5. Let multiple applicable branches contribute results without requiring empty
   or `not applicable` placeholders for branches that do not apply.
6. Keep project-local proof terminology authoritative.
7. Preserve phase ownership while eliminating duplicated doctrine and field
   lists from phase consumers.
8. Separate structural validation, fake harness plumbing, and live behavior
   proof.
9. Prove the skill under shortcut pressure before calling the implementation
   PR-ready.

## Non-Goals

- Do not create a generic testing textbook.
- Do not prescribe a testing framework, property-testing library, mocking
  library, coverage percentage, or repository setup.
- Do not require every proof layer for every change.
- Do not make state/domain/IO/property fields universal.
- Do not redesign the four consuming phase skills beyond their test-proof
  integration edge.
- Do not make `implementation-writing-tests` own implementation tasks,
  execution orchestration, plan-review findings, implementation-review
  reduction, or readiness verdicts.
- Do not wire handoff skills in this design unless they already transport the
  owning phase's artifacts without redefining the test-proof contract.
- Do not change the pressure harness, subprocess behavior, package scripts,
  hooks, or installed plugin caches as part of this spec.
- Do not copy third-party prompt prose, code examples, or assets.

## Skill Promise And Invocation

Reusable behavior:

> This skill helps agents reliably decide what test evidence would prove a
> behavior claim, whether existing evidence is trustworthy, and what smallest
> proof gap remains.

Invocation capabilities:

- model-invocable, because test work and false-proof claims arise inside other
  implementation phases;
- user-invocable, because users directly ask to write, repair, audit, remove,
  or review tests.

The trigger surface should remain compact. Its intended shape is:

```yaml
name: implementation-writing-tests
description: Use when deciding what tests would prove a behavior, or when writing, changing, repairing, auditing, removing, or reviewing tests as implementation proof, especially when passing tests may not prove the claim. Not for implementation work with no test decision or test-proof claim.
```

The frontmatter must not enumerate the workflow, branch fields, proof taxonomy,
or weak-test catalog. Adjacent implementation work with no test decision or
test-proof claim should not load this skill merely because validation exists.
The final boundary clause may be tightened only when live trigger-selection
proof demonstrates that the shorter positive trigger avoids the near miss.

## Mental Model

Leading concept: `trustworthy proof`.

A test is trustworthy proof when a relevant behavior change can make it fail
through an observable seam and the expected result is chosen independently of
the implementation path under test.

The common evidence chain is:

```text
behavior claim
  -> inspected current truth
  -> observable seam
  -> independent oracle or relation
  -> honestly named proof layer
  -> fresh evidence or explicit proof gap
```

This is a judgment model, not a requirement to emit a large form. The shared
output contract defines the observable conditions under which one claim may
return the same meaning in a compact proof line.

## Boundary And Separability Map

```text
plan-creation-swarm
  owns: requirement/proof matrix and proposed proof intent
  consumes: proposed implementation-test-proof contract

plan-review-swarm
  owns: plan findings and route back to plan creation
  consumes: proposed implementation-test-proof contract

implementation-execute-plan
  owns: code/test changes, execution receipts, and observed evidence
  consumes: proposed contract; returns observed branch evidence

implementation-review-swarm
  owns: independent findings, reduction, and readiness verdict
  consumes: proposed + observed contract; verifies proof validity

                         linked consumer edge
phase owners ----------------------------------------------+
                                                           v
implementation-writing-tests
  SKILL.md owns: mental model, all-run spine, branch predicates,
                 bright-line stops, final proof/gap return
  references own: conditional branch judgment and examples
  output schema owns: common fields and conditional extension shapes
```

Allowed edges:

- Phase skills may load `implementation-writing-tests`, link its output schema,
  and add phase-local context or judgment.
- `SKILL.md` may route to its owning references and output schema.
- The skill may inspect current requirements, production behavior, tests,
  project instructions, and proof evidence.

Disallowed edges:

- Phase skills must not copy the output field list, testing doctrine,
  proof-layer definitions, or antipattern catalog.
- The test-proof schema must not contain phase-specific task placement,
  execution packet anatomy, review finding fields, or readiness verdicts.
- `implementation-writing-tests` must not call back into phase skills in a way
  that creates ownership cycles.
- Runtime skill guidance must not depend on `skills-creation`, local cache paths,
  temporary research artifacts, or third-party checkouts.

## All-Run Workflow Spine

### 1. Ground The Claim

Read the behavior requirement or proof claim, the relevant production surface,
existing tests, and project-local testing definitions.

Completion:

- the behavior or proof claim is falsifiable;
- its source is named;
- existing proof and project terminology are known or explicitly absent.

### 2. Design The Smallest Trustworthy Proof

Choose the narrowest observable seam that can fail for the real behavior and an
oracle or relation chosen independently of the implementation path.

Completion:

- the seam is observable by a consumer or an explicitly owned contract;
- the oracle would detect the intended failure;
- mocks, fixtures, snapshots, or generated inputs do not become the thing being
  proved.

### 3. Classify The Evidence Honestly

Choose the proof layer using project definitions first. Name the evidence state
and freshness source without promoting lower-layer proof into smoke, e2e, or
release proof.

Completion:

- the selected layer matches the evidence;
- the project definition source or default fallback is known;
- stale evidence is not treated as current proof.

### 4. Enter Only Applicable Branches

Evaluate branch predicates against the current claim. More than one branch may
apply. Each selected branch returns its owned extension. Unselected branches
return nothing and create no placeholder fields.

Completion:

- every selected branch has its required return;
- no material predicate was silently skipped;
- irrelevant branch vocabulary is absent from the result.

### 5. Return The Proof Decision

Return one output-schema status without translating it into local synonyms:

```text
pending
trustworthy
incomplete + smallest trustworthy repair route
invalid + smallest trustworthy replacement route
blocked + missing current evidence or unresolved project decision
```

Planning may return a proposed proof contract. Execution may add observed
evidence. Review independently verifies the claim. A proposal is never reported
as observed or verified proof.

## Bright-Line Stops

Any run must return a proof gap rather than accept evidence when:

- a test proves only that a mock or owned collaborator was called;
- an expected value is recomputed with the implementation under test;
- the test can pass without the intended behavior;
- private wiring is treated as the public contract without project evidence;
- a snapshot or fixture has no reviewed live behavior claim;
- a unit, config, schema, or fake-integration check is labeled smoke or e2e;
- project-local proof terms were ignored;
- stale evidence is offered as current proof;
- an agent-authored waiver replaces required RED/GREEN evidence;
- a test is removed or weakened without live-contract disposition and required
  replacement, redundancy, or dead-contract evidence.

These stops are all-run safety rules. Detailed examples belong with the branch
that owns the repair.

## Branch Contracts

### Behavior-Change Lifecycle

Predicate:

- behavior is being changed;
- a bug fix is being implemented or claimed complete;
- RED/GREEN evidence is being planned, produced, or reviewed.

Destination:

- a proof-lifecycle reference.

Return:

- whether RED/GREEN is required;
- RED evidence, GREEN evidence, or the current proof gap;
- freshness anchor;
- explicit user-approved exception when one legitimately applies.

Stop condition:

- implementation starts or completion is claimed without the required
  failing-first evidence, fresh GREEN, or user-approved exception.

### Proof-Layer Resolution

Predicate:

- project taxonomy is absent, ambiguous, or disputed;
- smoke, e2e, PR, release, or a higher layer is claimed;
- a lower-layer check may be relabeled as runtime proof.

Destination:

- the proof-layers reference.

Return:

- fit rationale;
- evidence required by that layer;
- honest higher-layer gap when applicable.

The selected layer and definition source remain common output fields; this
branch does not restate them.

Stop condition:

- the evidence does not reach the claimed layer.

### State, Input, And Property Proof

Predicate:

- state transitions, construction, mutation, parsing, IO, external events, or
  untrusted input can introduce invalid state;
- examples share a load-bearing invariant, ordering rule, round trip,
  idempotency relation, or broad input space.

Destination:

- one state/input/property proof reference for the first rewrite.

Return only the applicable subset:

- critical invariant or property;
- trusted-domain or IO boundary;
- invalid-state prevention or rejection strategy;
- valid and invalid boundary cases;
- table, examples, metamorphic relation, or generator choice;
- oracle and sufficiency rationale.

Stop condition:

- a named material invalid state or failure path remains unproved;
- generated cases lack an independent oracle or relation.

The reference should split later only if live retrieval proof demonstrates
distinct predicates and return shapes that agents cannot use reliably together.

### Existing-Test Lifecycle

Predicate:

- existing tests are being trusted, audited, repaired, removed, disabled,
  relabeled, snapshotted, or driven by fixtures.

Owned decision:

- asset disposition: whether a material existing test is kept, repaired, or a
  removal candidate.

Destination:

- the existing-test-audit reference.

Return:

- `keep`, `repair`, or `remove-candidate` per material test;
- live behavior contract;
- current seam, oracle, and layer defect when repair is needed;
- replacement, redundancy, or dead-contract evidence for removal;
- remaining risk.

Stop condition:

- the canonical all-run removal/weakening stop applies.

### Test-Proof Review

Predicate:

- tests are cited as readiness evidence;
- a passing suite may contain mock-only, tautological, stale, private-wiring,
  assert-nothing, or mislabeled proof;
- an implementation reviewer needs the smallest missing proof route.

Owned decision:

- proof-claim validity: whether tests cited as evidence prove the claimed
  behavior.

Destination:

- a test-proof-review reference containing defect judgment and compact examples.

Return:

- the shared `proof_status` value;
- false-proof defect class;
- source evidence;
- smallest trustworthy replacement proof or explicit gap.

Stop condition:

- green command output is treated as proof without inspecting what the tests can
  fail for.

Composition rule:

- When existing-test disposition and proof validity are both in scope, both
  branches apply. Test-proof review returns the validity defect to the
  existing-test lifecycle decision; it does not repeat the base seam, oracle,
  layer, or evidence-state fields.

## Reference Architecture

The intended reference responsibilities are:

```text
proof-lifecycle.md
  RED/GREEN obligations, freshness, exceptions, rationalization counters

proof-layers.md
  project override rule, default meanings, layer disputes, runtime claims

state-input-and-property-proof.md
  invariants, invalid states, IO boundaries, property/example strategy

existing-test-audit.md
  keep/repair/remove judgment and safe removal evidence

test-proof-review.md
  false-proof defect diagnosis, examples, smallest replacement route

implementation-test-proof-output-schema.md
  shared output field names and conditional extension shapes only

agents/openai.yaml
  retained Codex UI metadata; update trigger-facing prompt text when the
  accepted invocation contract changes; platform policy remains owned by
  current platform mechanics
```

Each branch reference must open by naming what it owns and what it returns. It
must not repeat the routing predicate, all-run spine, or phase-consumer
workflow.

File compatibility is subordinate to behavioral clarity. Planning may retain a
current filename when it still expresses the accepted ownership, but must not
preserve overlapping homes merely to reduce diff size.

## Shared Output Contract

Schema kind: shared model output shape in Markdown. JSON Schema is not justified
unless a tool later validates the output.

Cardinality:

- one record represents one falsifiable behavior or proof claim;
- a phase owner may carry a collection of records but must not redefine the
  record fields or status vocabulary;
- one test may support several claim records, and several tests may support one
  claim record.

Required common fields:

```text
source_anchor:
behavior_claim:
observable_seam:
independent_oracle_or_relation:
proof_layer:
project_layer_definition_source:
evidence_state: proposed | observed | verified
proof_status: pending | trustworthy | incomplete | invalid | blocked
```

Status and conditional-field rules:

```text
evidence_state: proposed
  allowed proof_status: pending | incomplete | blocked
  freshness_anchor: absent

evidence_state: observed
  allowed proof_status: pending | incomplete | invalid | blocked
  freshness_anchor: required

evidence_state: verified
  allowed proof_status: trustworthy | incomplete | invalid | blocked
  freshness_anchor: required

proof_status: pending | trustworthy
  proof_gap: absent

proof_status: incomplete | invalid | blocked
  proof_gap: required and includes the smallest repair, replacement, or
             unblock route when one is known
```

Conditional extensions are emitted only when their branch predicate holds:

```text
behavior_change_lifecycle:
proof_layer_resolution:
state_input_or_property_proof:
existing_test_lifecycle:
test_proof_review:
```

Rules:

- No conditional extension requires `not applicable` placeholders.
- A compact proof line is allowed only when exactly one claim is in scope, no
  branch predicate holds, and no downstream consumer requires the structured
  record. Its positive shape preserves:
  `claim -> seam -> oracle/relation -> layer + definition source -> evidence
  state + proof status`, plus freshness when evidence is observed or verified.
- Pressure to “just give the one-liner” does not override a matched branch or a
  consumer's structured-record need.
- The schema owns field names, allowed values, and ordering only.
- Branch references own judgment, examples, and completion rules.
- Phase consumers link the schema and add only their local fields.

## Phase Consumer Contracts

### Plan Creation

Consumes the common proof contract as a proposal and any branch extensions that
can be decided from current requirements and code. It owns requirement mapping,
task placement, and plan proof matrices. It must not fabricate execution
evidence.

### Plan Review

Challenges whether the proposed proof contract can prove the requirement and
whether applicable branches were missed. It owns findings and routes accepted
changes back to plan creation. It does not redesign or execute the test suite.

### Implementation Execution

Consumes the proposal, produces current test artifacts and observed evidence,
and records applicable branch returns. It owns implementation scope, code
changes, commands, and execution receipts. It must stop for missing plan-owned
proof intent rather than silently inventing a weaker contract.

### Implementation Review

Independently verifies proposed and observed proof. It owns candidate findings,
reduction, and readiness. A dedicated test-proof focus may remain when it adds
distinct source coverage; whether that focus stays a separate lane is an
implementation-plan decision constrained by proof of overlap or missed
findings.

## Steering And Rationalizations

Known shortcut rationalizations require bright-line counters in the owning main
path or reference:

| Rationalization | Required steering |
| --- | --- |
| “The suite is green.” | Inspect what the tests can fail for before accepting proof. |
| “Every proof row should be complete.” | Emit only applicable branch returns; absence is meaningful. |
| “Domain boundaries matter everywhere.” | Enter state/input depth only when its observable predicate holds. |
| “CI will catch it.” | CI is not a substitute for a named proof route. |
| “The prior branch already passed.” | Require a freshness anchor for the current worktree, run, or artifact. |
| “These tests are dumb; delete them.” | Classify the live contract and prove replacement, redundancy, or death first. |
| “The plan is approved.” | Execution still verifies that planned proof is possible and current. |
| “This is obvious.” | A behavior claim still needs an observable failure and independent oracle. |

## Source Adaptation And Security Context

Sensitive surfaces:

- third-party testing source adaptation;
- public agent guidance and plugin metadata;
- pressure-scenario prompts and assertions;
- live model-backed pressure execution and its temporary artifacts;
- any later cache refresh or executable harness change.

Current decision:

- allowed: independently express general testing concepts using local
  vocabulary, invented public-safe examples, and local proof;
- disallowed: wholesale or distinctive prompt/manual/example copying;
- blocked: direct Matt Pocock or Addy Osmani copying until exact source and
  license/permission state are verified;
- allowed with verified MIT provenance: abstract adaptation of Obra concepts;
  copying is unnecessary and remains out of scope;
- deferred: pressure-harness code, shell/subprocess/package-script behavior,
  home writes, and installed-cache refresh.

Implementation must produce a source-adaptation receipt containing:

```text
source identity and revision/date:
license or permission state:
imported concept:
local adaptation target:
copy-vs-adapt decision:
no-verbatim-copy check:
public-safe example check:
```

Public artifacts must not include secrets, account metadata, credential paths,
raw auth errors, private source locations, machine-specific cache paths, or raw
pressure event streams.

Pressure scenarios remain data-only inputs to the existing harness unless a
separate security decision authorizes executable harness changes.

## Alternatives And Tradeoffs

### Patch The Existing Universal Schema

Rejected. It reduces immediate diff size but preserves ceremonial categories,
copied field lists, and tests that reward irrelevant vocabulary.

### Remove Every Shared Shape

Rejected. Four lifecycle consumers need a stable meaning to propose, observe,
and verify. Pure prose would make drift likely. The cost is a small Markdown
schema; the constraint is that it owns shape only, not judgment.

### Split Into Several Testing Skills

Rejected for this rewrite. Separate TDD, property, audit, and review skills
would increase trigger/context cost and create uncertain ownership. Split only
after live evidence demonstrates distinct reusable jobs that cannot remain
reliable as branches.

### Common Core Plus Conditional Branch Returns

Accepted. It preserves one mental model and consumer edge while keeping
state/input/property/audit/review depth conditional. The implementation is
larger than a wording patch but smaller than redesigning the entire phase
system.

Accepted debt:

- project-silent default layer definitions remain available;
- Markdown output remains model-readable rather than machine-validated;
- the dedicated test-proof review lane may temporarily overlap the general
  implementation-proof lane until live review evidence supports consolidation;
- state/input/property guidance begins consolidated and splits only on retrieval
  evidence.

## Requirements

### R1. Trigger Quality

The frontmatter is a compact loading condition and survives true and near-miss
prompts without summarizing the workflow.

### R2. Operational Main Path

`SKILL.md` contains the mental model, five-step all-run spine, bright-line stops,
branch predicates, destinations, return shapes, and completion decision in a
single scan.

### R3. Conditional Depth

Every reference exists because an observable predicate changes the work. Each
reference owns one return shape and contains no duplicated all-run workflow.

### R4. Minimal Shared Output

The common output contract contains only universally meaningful proof fields.
Conditional extensions appear only when their predicates hold. No consumer
copies the field list.

### R5. Phase Separation

Planning proposes, execution observes, and review verifies. Each phase retains
its packets, findings, sequencing, and verdict authority.

### R6. Project Taxonomy Precedence

Project-local proof definitions override defaults, and the definition source is
preserved in the proof contract.

### R7. False-Proof Resistance

Mock-call-only, tautological, assert-nothing, private-wiring, stale,
unreviewed-snapshot, and fake-smoke evidence returns an invalid or incomplete
proof decision plus the smallest trustworthy repair route.

### R8. Test Removal Safety

Tests are removed or weakened only after live-contract classification and
replacement, redundancy, or dead-contract evidence.

### R9. Behavior Proof

Behavior-changing skill work has an observed no-guidance or current-skill RED,
live skill-present GREEN, rationalization capture, and targeted retest. Static
validation and fake-backend output remain separate evidence classes.

### R10. Public And Platform Safety

Third-party adaptation, public examples, Codex/Claude packaging, temporary
pressure artifacts, and cache/readback status follow the current
`skills-creation` security and platform contracts.

## Proof Expectations

### Design RED

The existing implementation already supplies the design-level failure:

- a simple stateless ranking claim is forced to name domain/illegal-state/IO
  fields and fill placeholders;
- category selection does not materially change the route;
- phase consumers repeat the same long field inventory;
- fake-backend success can satisfy assertions without executing agent judgment.

Implementation must capture a fresh current-skill or no-guidance RED before
changing behavior wording.

### Live GREEN Behavior Proof

The rewritten skill must demonstrate, through fresh live agent runs:

1. A stateless proposed proof returns only the always-required common fields;
   `freshness_anchor`, `proof_gap`, and irrelevant extensions are absent.
2. A payment/webhook or equivalent stateful external-input case enters the
   state/input branch and returns valid plus invalid boundary proof.
3. A property-shaped case selects a table, examples, metamorphic relation, or
   generator for a named invariant without making generators mandatory.
4. Existing-test cleanup returns keep/repair/remove decisions and blocks unsafe
   deletion.
5. Mock-only, tautological, assert-nothing, and fake-smoke evidence is rejected
   with the smallest repair route.
6. Project-local layer definitions override defaults.
7. Prior-branch or stale evidence is rejected as current proof.
8. A near-miss implementation request with no test decision does not expand
   into this skill.
9. At least one phase consumer retrieves the shared output contract without
   restating it.
10. Irrelevant branch fields are absent rather than filled with placeholders.

Trigger-selection proof is separate from skill-present behavior proof:

- true and near-miss prompts must run through actual plugin discovery without
  forcing the skill to load;
- changed trigger or pointer wording requires at least five fresh-context
  repetitions and manual transcript inspection;
- skill-present scenarios may prove workflow behavior only after invocation.

Existing `implementation-writing-tests` and phase-consumer pressure scenarios
must be regraded against this contract. Vocabulary-rewarding assertions must be
replaced with decision, branch-selection, composition, and absence assertions.
Stateless scenarios must fail when they fabricate domain, IO, or illegal-state
fields, and combined audit/readiness scenarios must prove the two branch-owned
decisions compose without duplicating base fields.

One scenario must pressure a multi-branch claim toward “just give the
one-liner” and prove the compact-line escape is rejected.

Pressure proof must include realistic urgency or authority pressure and capture
rationalizations. Fake runs may validate parser, grader, and reporting plumbing
only.

### Structural And Integration Proof Expectations

Planning must operationalize, without treating these as behavior proof:

- target-skill validation;
- reference reachability and unique ownership;
- shared-output consumer links and duplication audit;
- pressure-scenario syntax and harness unit/type validation;
- Codex and Claude plugin/static validation for shared source changes;
- public-safety and source-adaptation review;
- current branch/base integration and plugin metadata reconciliation;
- implementation review against this spec;
- PR checks, comments, threads, mergeability, and refresh/readback status when
  those enter the requested shipping scope.

## Design Decisions For Human Review

1. Retain the dedicated `implementation-writing-tests` review lane for the first
   rewrite. Consolidate it only after real review runs demonstrate duplicate
   findings or identical source coverage with the implementation-proof lane.
2. Keep `state-input-and-property-proof.md` consolidated for the first rewrite.
   Split it only when live reference-retrieval proof demonstrates distinct
   predicates and returns that agents cannot use reliably together.
3. Keep direct Matt Pocock and Addy Osmani copying blocked until exact sources
   and license states are verified. Express the general concepts independently.

## Acceptance Boundary

This spec is ready for implementation planning only after:

- human review accepts or revises the recorded design decisions;
- skill-spec review returns `great` or accepted bounded revisions are folded
  back into this artifact;
- the source-adaptation security decision remains allowed for the planned
  surfaces;
- the implementation plan uses current `origin/master` as its integration
  baseline rather than treating PR #19's stale branch as current platform
  truth.

The next phase after acceptance is `plan-creation-swarm`. The old implementation
plan must not be executed as the plan for this revised contract.
