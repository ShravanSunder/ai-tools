# Implementation Writing Tests Skill Plan

goal_id: `2026-07-08-implementation-writing-tests`
status: draft plan; ready for plan review before implementation
source context: chat decision on 2026-07-08 plus current workflow skills and
local admired skill references

## Goal

Create `shravan-dev-workflow:implementation-writing-tests` as the shared
doctrine for writing and judging tests during implementation work. It does not
own product implementation itself; it owns the testing decisions that make an
implementation's proof trustworthy. The skill must cover TDD,
property/invariant-driven thinking, test seams, proof-layer definitions,
existing-test audit, removal or repair of weak tests, and the recurring
weak-test antipatterns seen in recent app work: tests that only exercise mocks,
tautological assertions, fake smoke tests, stale snapshots, and green checks
that cannot fail usefully.

The new skill must become the source imported by:

- `plan-creation-swarm`, while choosing proof layers, seams, invariants, and
  property-style expectations for each material requirement.
- `plan-review-swarm`, while adversarially checking whether a plan's proposed
  seams, invariants, and proof layers actually prove behavior.
- `implementation-execute-plan`, while writing, repairing, removing, and
  reporting tests during execution.
- `implementation-review-swarm`, while rejecting false proof and bad tests after
  implementation.

## Non-Goals

- Do not turn `implementation-writing-tests` into a generic testing textbook.
- Do not replace project-local test definitions when a repo explicitly defines
  its own unit, integration, smoke, or e2e layers. Use project definitions first
  and fall back to this skill's defaults only when the project is silent.
- Do not require a property-based testing library. The skill should teach
  property-driven development concepts: invariants, generated examples when
  appropriate, metamorphic relations, state transitions, and oracle design.
- Do not make every change require every proof layer. Proof scales by risk and
  surface, but lower layers cannot be silently skipped or relabeled.
- Do not copy admired upstream skill text wholesale. Adapt the concepts into
  this repo's skill vocabulary and pressure-proof them locally.
- Do not wire `plan-handoff` or `implementation-handoff` in v1. The schema can
  be handoff-ready, but handoff surfaces are a follow-up unless requested.

## Boundary Decisions

- `implementation-writing-tests` is both model-invoked and phase-referenced in
  v1. It should load directly when a user asks to write, fix, audit, delete, or
  review tests, and phase skills should reference it when test decisions or
  proof claims are in scope.
- `plan-creation-swarm` may choose candidate seams, invariants/properties,
  oracles, proof layers, freshness guards, and RED/GREEN expectations. It must
  not restate reusable testing doctrine.
- `plan-review-swarm` strengthens its existing `testability-validation` lane in
  v1. It challenges proof rows and routes accepted fixes back to
  `plan-creation-swarm`; it does not design the full test suite.
- `implementation-execute-plan` owns execution packets, RED/GREEN preservation,
  and test deletion proof while tests are being written, repaired, or removed.
- `implementation-review-swarm` gets a small dedicated
  `references/lanes/implementation-writing-tests.md` lane in v1. The existing
  `contracts-and-tests` reviewer stays broader and checks contract drift.
- Phase skills may add routing, required slots, and challenge gates. Definitions
  for seams, oracles, proof layers, weak-test antipatterns, property concepts,
  and test-removal doctrine live only in `implementation-writing-tests`.

## Source Coverage

Parent reviewed these current repo surfaces:

- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/SKILL.md`
  - proof matrix and testing-pyramid rules at lines 52-69
  - validation/proof lane at lines 139-141
  - common proof shortcuts at lines 264-270
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/validation-proof.md`
  - maps source requirements to proof that actually proves them
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/scope-and-proof-fit.md`
  - checks whether tasks can be proven inside scope
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md`
  - extracts tests and validation claims at lines 89-97
  - `testability-validation` lane at lines 135-141
  - plan readiness reduction at lines 184-190
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/SKILL.md`
  - preserves proof and red/green evidence at lines 29-40
  - slices tasks with exact verification commands at lines 59-64
  - final proof report at lines 121-130
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
  - proof gate at lines 147-159
  - `not_ready` for missing/weak proof at lines 194-201
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/reviewer-prompts.md`
  - implementation proof reviewer at lines 97-115
  - contracts and tests reviewer at lines 181-199

Parent reviewed these local admired references as source inspiration:

- Obra `subagent-driven-development`
  - per-task implementation plus review loop
  - separate spec-compliance and task-quality verdicts
  - reviewer must not be pre-coached away from findings
  - implementer self-review never replaces independent review
- Obra `implementer-prompt.md`
  - implementer self-review asks whether tests verify behavior, not mocks
  - reports RED/GREEN evidence when TDD is required
- Obra `task-reviewer-prompt.md`
  - reviewer treats noisy test output and tests that assert nothing as findings
  - `Important` means the task cannot be trusted until fixed
- Matt Pocock `tdd`
  - tests observe public seams
  - expected values need independent oracles
  - implementation-coupled, tautological, and horizontal-slice tests are bad
- Matt Pocock `mocking`
  - mock system boundaries, not internal collaborators
  - design external SDK-style interfaces when mocks are necessary
- Addy Osmani `test-engineer`
  - analyze code, public API, edge cases, and existing test patterns before
    writing tests
  - choose the lowest proof layer that captures behavior
  - bug tests must fail first

Source precedence:

1. User decision and repo AGENTS testing rules own the local contract.
2. Current `shravan-dev-workflow` skills own integration points.
3. Admired sources are inspiration only; adapt concepts, do not copy full text.
4. Project-local test taxonomy overrides default proof-layer definitions.

## Existing-Surface Check

No existing skill owns this reusable job end to end.

- `plan-creation-swarm` owns planning proof rows, but not the doctrine for how
  to choose seams, invariants, test oracles, or delete bad tests.
- `implementation-execute-plan` owns execution, but currently receives proof
  obligations instead of a rich testing contract.
- `implementation-review-swarm` owns review and reducer truth, but catches weak
  proof late and does not teach how to repair tests.
- `debug-investigation` can create bug proof, but does not own general
  implementation-time test writing.

Create `implementation-writing-tests` rather than expanding any one phase skill.

## Proposed Skill Surface

Path:

- `plugins/shravan-dev-workflow/skills/implementation-writing-tests/`

Files:

- `SKILL.md`
- `references/test-seams-and-invariants.md`
- `references/proof-layers.md`
- `references/existing-test-audit.md`
- `references/property-driven-development.md`
- `references/schema-implementation-test-proof.md`

Frontmatter description:

```yaml
name: implementation-writing-tests
description: Use when implementation, planning, execution, or review work includes writing, changing, auditing, repairing, removing, or judging tests or test proof; choosing public seams, invariants, oracles, proof layers, RED/GREEN evidence, property-style checks, project proof-layer definitions, or deciding whether existing tests are meaningful proof. Do not use as the general implementation skill when no test decision or proof claim is in scope.
```

Concept ownership:

- `SKILL.md`: all-branch workflow spine, category selection, required stop
  conditions, and reference routing.
- `test-seams-and-invariants.md`: public seams, independent oracles,
  invariants, property claims, weak seam/oracle examples, and choosing the
  smallest useful observation boundary.
- `proof-layers.md`: default unit/integration/smoke/e2e/PR-release taxonomy,
  project override rule, fake-smoke examples, RED/GREEN exception rule, and
  freshness guard concept.
- `existing-test-audit.md`: keep/repair/remove decision tree, deletion proof,
  stale snapshot/fixture examples, broad deletion examples, redundancy proof,
  dead-contract proof, and audit report shape.
- `property-driven-development.md`: property families, table-driven examples,
  generator guidance, metamorphic relations, and state-transition thinking.
- `schema-implementation-test-proof.md`: slots/templates only, split by
  plan-required, execution-filled, and review-filled fields.

`SKILL.md` should stay compact and all-branch:

1. Classify test work.
   - new behavior test
   - bug prove-it test
   - existing-test audit
   - weak-test repair
   - test removal
   - review of implementation proof
   Completion: name the category and the behavior/proof claim under test.
2. Inspect the current test surface.
   - read production behavior
   - identify public seam
   - inspect existing tests and project taxonomy
   - identify explicit project overrides
   Completion: current seam, project layer definitions, and existing tests are
   named, or absence is stated.
3. Choose seams, invariants, and oracle.
   - seam: public boundary observed by the test
   - invariant/property: truth that should hold across examples or state changes
   - oracle: independent expected value or observable state
   Completion: no test is planned without seam, invariant/claim, and oracle.
4. Choose proof layer.
   Completion: unit/integration/smoke/e2e/PR-release layer is selected using
   project definitions first, default definitions second, and higher unrun
   layers are named with blocker or follow-up status.
5. RED/GREEN or explicit exception.
   Completion: behavior changes and bug fixes have RED evidence before GREEN,
   or a user-approved exception is recorded.
6. Repair or remove bad tests.
   Completion: removal requires either replacement proof, redundancy proof, or a
   documented reason the test asserts a dead/stale contract.
7. Report implementation test proof.
   Completion: output the shared schema slots.

## Default Proof-Layer Definitions

Use these only when the project has not defined its own terms.

- Unit: fast deterministic proof of logic or a narrow state transition through a
  public function/class/module seam. No real external process, network, DB,
  browser, VM, or app runtime. Fakes are acceptable only at system boundaries.
- Integration: proof across a real boundary: store, process, filesystem, HTTP
  handler/client pair, DB/test DB, event bus, protocol, package boundary, or
  app subsystem. Prefer real adapters over mocks when the boundary is owned.
- Smoke: the owned runnable surface boots and performs real product behavior.
  It is intentionally small, but it is not a unit test, fake integration, mock
  path, or config/schema check.
- E2E: the full real user/runtime path through the app, browser, service, VM,
  artifact, or deployment-like environment.
- PR/release gate: CI/checks/review-thread/mergeability or artifact
  integrity/signing/notarization/release smoke when the objective includes PR or
  release readiness.

## Shared Schema

`references/schema-implementation-test-proof.md` is shared by plan, execute,
and review consumers. It must be slots/templates only and must mark which phase
owns each field:

```text
plan-required:
requirement:
source_anchor:
public_seam:
invariants_or_properties:
oracle:
proof_layer:
project_layer_definition:
freshness_guard:
existing_tests_audited:
red_green_required:
higher_layer_not_run:
blocker_or_exception:

execution-filled:
test_files:
tests_added:
tests_changed:
tests_removed:
RED_evidence:
GREEN_evidence:
false_proof_risks:

review-filled:
proof_validity:
invalid_or_weak_tests:
review_findings:
accepted_route:
```

The reference should include one sample planning row and one sample
execution/review row so planners do not fabricate execution-only details and
executors/reviewers can distinguish pending fields from proof gaps.

## Weak-Test Failures By Concept

The new skill should teach these as reviewable defects:

- mock-only proof: test only proves a mock was called
- internal-collaborator mock: mocks code the project owns instead of a system
  boundary
- tautological oracle: expected value is computed with the same logic as the
  implementation
- assert-nothing test: test cannot fail for the intended behavior
- stale snapshot: snapshot records structure without reviewed behavioral intent
- fake smoke: unit/integration/config/schema check labeled smoke
- fixture fossil: fixture locks obsolete behavior or old product contract
- horizontal test dump: broad tests written before a vertical slice teaches the
  real seam
- private-method seam: test reaches inside implementation rather than public
  behavior
- broad deletion: removes tests without replacement proof or redundancy proof

The concept references must include compact bad/good examples where the defect
belongs:

- mock-only proof, owned-collaborator mocks, tautological oracles, and
  assert-nothing tests in `test-seams-and-invariants.md`;
- fake smoke in `proof-layers.md`;
- stale snapshots, fixture fossils, and broad deletion in
  `existing-test-audit.md`.

Each example must show:

- the bad test shape;
- why it cannot prove behavior;
- the repair route;
- the correct proof-layer label.

## Property-Driven Development Concepts

The skill should introduce property-driven testing as a planning and review
tool, not a mandatory framework.

Use property thinking when:

- many examples share the same invariant;
- state transitions must preserve constraints;
- parser/serializer/normalizer behavior has round trips;
- permissions, filtering, ordering, de-duplication, or idempotency are
  load-bearing;
- concurrency or ordering can produce unexpected interleavings.

Common property families:

- round trip: encode/decode, serialize/parse, save/load
- idempotence: applying an operation twice equals once
- monotonicity: adding input cannot remove allowed output unless a rule says so
- conservation: totals, counts, identities, or permissions are preserved
- ordering: sort, priority, timestamp, or queue rules remain valid
- commutativity/associativity where domain-valid
- state-machine transitions: only valid transitions occur, invalid transitions
  fail predictably
- metamorphic relations: related inputs produce predictably related outputs

The skill should say: use table-driven examples when they carry the property
clearly; use property-based generators only when the repo has a suitable
framework or the risk justifies adding one.

## Workflow Wiring

### `plan-creation-swarm`

Update `SKILL.md` and `references/lanes/validation-proof.md` so planning does
not stop at "add tests."

New planning obligations:

- Load `implementation-writing-tests` when material behavior, bug fixes, proof
  gates, existing test quality, or test removal are in scope.
- For each non-trivial requirement, choose candidate public seams,
  invariants/properties, oracle, proof layer, and freshness guard.
- Add the shared schema slots to the requirements/proof matrix.
- Record project-local proof-layer definitions or state that defaults apply.
- Split or replan when a slice cannot be proven without fake proof.

Add to `scope-and-proof-fit`:

- reject plan slices that require tests but do not name the seam/invariant;
- reject proof rows that relabel lower proof as smoke/e2e;
- reject tasks that require deleting tests without replacement/redundancy proof.

### `plan-review-swarm`

Update `SKILL.md` and its testability lane wording so reviewers actively choose
and challenge seams and invariants.

New plan-review obligations:

- Extract and review the implementation-test-proof schema rows.
- Verify that every material behavior has a public seam and at least one
  invariant/property/claim.
- Challenge whether the oracle is independent of implementation.
- Check project proof-layer definitions vs defaults.
- Mark plans `needs revision` when they propose mock-heavy, tautological,
  fake-smoke, or no-seam proof.
- Treat missing invariants/seams as plan defects, not implementation details to
  improvise later.

### `implementation-execute-plan`

Update execution packets and final reporting:

- Load `implementation-writing-tests` before writing, repairing, or deleting
  tests.
- Require subagent task packets to include schema slots when tests are in scope.
- Preserve RED/GREEN evidence or approved exception per schema row.
- Before deleting tests, produce replacement/redundancy/dead-contract proof.
- Report false-proof risks resolved or remaining.

### `implementation-review-swarm`

Update implementation proof and contracts/tests reviewer:

- Load `implementation-writing-tests` when proof claims include tests.
- Reject green checks that use bad seams, bad oracles, mocks of owned
  collaborators, fake smoke, or tautological assertions.
- Add the dedicated `implementation-writing-tests` reviewer lane and keep the
  existing `contracts-and-tests` lane as the broader contract-drift reviewer.
- Include false-proof risks in final review proof.

### `spec-creation-swarm`

Light touch:

- Specs can name critical invariants/properties and proof expectations.
- Exact commands and task-sized proof routes remain owned by `plan-creation-swarm`.

## Pressure Scenarios

Add these pressure scenarios before implementation edits:

1. `implementation-writing-tests-false-proof-antipatterns.md`
   - Input: concrete bad tests assert mock calls, recompute expected values,
     assert nothing, and call a unit test "smoke."
   - Expected: skill rejects as false proof, asks for public seam, independent
     oracle, and correct proof layer.

2. `implementation-writing-tests-existing-test-audit.md`
   - Input: user asks to "clean up dumb tests" around a feature, including a
     stale snapshot, fixture fossil, and one still-useful behavior test.
   - Expected: skill reads current tests, classifies keep/repair/remove, and
     requires replacement or redundancy proof before deletion.

3. `implementation-writing-tests-project-layer-override.md`
   - Input: project docs define smoke as a runnable CLI/app boot check, while a
     test row labels a pure config/unit check as smoke.
   - Expected: skill records `project_layer_definition`, uses the project
     definition over defaults, and relabels the proof honestly.

4. `plan-creation-swarm-implementation-writing-tests-proof.md`
   - Input: plan request says "add tests" for a behavior change.
   - Expected: plan chooses seams, invariants/properties, oracle, proof layer,
     and RED/GREEN requirement instead of generic validation commands.

5. `plan-review-swarm-implementation-writing-tests-proof.md`
   - Input: plan has generic "unit/integration/smoke" rows but no seam,
     invariant, oracle, or project override check.
   - Expected: plan review returns `needs revision` and routes to
     `plan-creation-swarm`.

6. `implementation-execute-plan-implementation-writing-tests-proof.md`
   - Input: execution packet asks an implementer to delete noisy tests and add
     replacement proof.
   - Expected: execution requires schema slots, RED/GREEN evidence, and
     replacement/redundancy/dead-contract proof before deleting tests.

7. `implementation-writing-tests-implementation-review-swarm-false-test-proof.md`
   - Input: implementation claims done with passing tests, but tests only verify
     mocks/internal calls or stale snapshots.
   - Expected: review marks proof invalid/important and names smallest behavior
     proof needed.

8. `implementation-writing-tests-stale-proof-freshness-guard.md`
   - Input: old RED/GREEN proof from a prior branch is offered for the current
     worktree.
   - Expected: skill rejects stale proof until a freshness guard ties evidence to
     the current worktree, run, or artifact.

9. `implementation-writing-tests-invariant-boundary-proof.md`
   - Input: a stateful payment capture feature has one happy-path test proposal
     while external webhook input can create invalid states.
   - Expected: skill identifies critical invariants, domain boundary,
     illegal-state strategy, guard/precondition/assertion points, and valid plus
     invalid IO-boundary proof.

## Implementation Tasks

### Task -1: RED pressure baseline

Before editing any skill or phase workflow guidance:

- add the pressure scenario files listed above;
- run the focused scenarios against current behavior;
- record failing receipts or exact runner/auth blockers in the implementation
  brief.

Proof:

- every named scenario has a pre-edit RED receipt or an exact environment
  blocker; no behavior-changing skill files are edited before this step.

### Task 0: Source adaptation and safety gate

Execute Tasks 0-2 under `skills-creation` guidance. Write the source-adaptation
note before editing:

- source inventory: Obra SDD, Matt Pocock TDD, Addy test-engineer
- license/permission state
- copy-vs-adapt decision: adapt concepts only, no wholesale copied prompts
- public-safe constraints
- imported concept -> local adaptation target
- no-verbatim-copy check
- public-safe example check

Proof:

- Source note exists in changelog reference or plan implementation artifact.
- `skills-creation` Authoring State and security route are recorded.

### Task 1: Add `implementation-writing-tests`

Create the skill folder and compact `SKILL.md`.

Write surfaces:

- `plugins/shravan-dev-workflow/skills/implementation-writing-tests/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-writing-tests/references/*.md`

Proof:

- skill-creator quick validation passes on the new skill.

### Task 2: Add schema and references

Add branch references and shared schema:

- `test-seams-and-invariants.md`
- `proof-layers.md`
- `existing-test-audit.md`
- `property-driven-development.md`
- `schema-implementation-test-proof.md`

Proof:

- placement audit confirms all-branch material stays in `SKILL.md`, branch-only
  depth lives in references, and shared slots live in schema only.

### Task 3: Wire plan creation

Update:

- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/validation-proof.md`
- `plugins/shravan-dev-workflow/skills/plan-creation-swarm/references/lanes/scope-and-proof-fit.md`

Proof:

- pressure scenario `plan-creation-swarm-implementation-writing-tests-proof`
  fails before wiring and passes after.
- duplication audit confirms reusable test doctrine was not copied into
  `plan-creation-swarm`; it only routes to the new skill and records schema
  slots.

### Task 4: Wire plan review

Update:

- `plugins/shravan-dev-workflow/skills/plan-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/plan-review-swarm/references/review-checklist.md`

Proof:

- pressure scenario `plan-review-swarm-implementation-writing-tests-proof`
  fails before wiring and passes after.
- duplication audit confirms reusable test doctrine was not copied into
  `plan-review-swarm`.

### Task 5: Wire implementation execution

Update:

- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/references/controller-packets.md`
- `plugins/shravan-dev-workflow/skills/implementation-execute-plan/references/validation-checklist.md`

Proof:

- pressure scenario
  `implementation-execute-plan-implementation-writing-tests-proof` fails before
  wiring and passes after.
- duplication audit confirms reusable test doctrine was not copied into
  `implementation-execute-plan`.

### Task 6: Wire implementation review

Update:

- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/SKILL.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/reviewer-prompts.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/lanes/implementation-proof.md`
- `plugins/shravan-dev-workflow/skills/implementation-review-swarm/references/lanes/implementation-writing-tests.md`

Proof:

- pressure scenario
  `implementation-writing-tests-implementation-review-swarm-false-test-proof`
  fails before wiring and passes after.
- duplication audit confirms reusable test doctrine was not copied into
  `implementation-review-swarm`.

### Task 7: Metadata, docs, changelog

Update:

- `plugins/shravan-dev-workflow/.codex-plugin/plugin.json`
- `plugins/shravan-dev-workflow/.claude-plugin/plugin.json`
- `plugins/shravan-dev-workflow/README.md`
- `plugins/README.md`
- `AGENTS.md` current skill list
- `docs/changelog/<date>-implementation-writing-tests.md`
- `docs/changelog/README.md`

Proof:

- JSON validation passes.
- Claude plugin validation passes.
- Codex marketplace readback command runs.

### Task 8: Final review and PR wrapup

Run:

- focused pressure scenarios for all touched skills
- `tests/skills/run-skill-pressure-tests.sh --fast` if environment auth permits
- `pnpm --dir tests/skills run test:unit`
- `pnpm --dir tests/skills exec tsc --noEmit`
- skill quick validator for the new skill
- `implementation-review-swarm` over the final changed surface
- `implementation-pr-wrapup` for push/PR/check readiness if requested

Proof gaps:

- If live Codex pressure scenarios fail with environment auth, report exact
  blocker and keep behavior proof status honest.

## Execution DAG

```text
gate 0: source-adaptation and RED pressure baseline
  |
  +-- task 1: create implementation-writing-tests spine
  |
  +-- task 2: add schema and references
  |
integration gate: validator + placement audit
  |
  +-- task 3: wire plan-creation-swarm
  |
  +-- task 4: wire plan-review-swarm
  |
  +-- task 5: wire implementation-execute-plan
  |
  +-- task 6: wire implementation-review-swarm
  |
integration gate: focused pressure scenarios
  |
task 7: metadata/docs/changelog
  |
targeted validation gate
  |
implementation-review-swarm
```

The workflow is mostly serial because the schema and new skill vocabulary must
exist before dependent skills can safely reference it. Tasks 3 and 4 can be
implemented in parallel only after the schema is stable and the write sets are
kept disjoint.

## Validation Gates

Minimum local proof:

```text
uv run --with PyYAML python /Users/shravansunder/.codex/skills/.system/skill-creator/scripts/quick_validate.py plugins/shravan-dev-workflow/skills/implementation-writing-tests
pnpm --dir tests/skills run test:unit
pnpm --dir tests/skills exec tsc --noEmit
claude plugin validate .
codex plugin list --marketplace ai-tools --available --json
```

Behavior proof:

```text
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-false-proof-antipatterns --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-existing-test-audit --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-project-layer-override --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-stale-proof-freshness-guard --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-invariant-boundary-proof --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario plan-creation-swarm-implementation-writing-tests-proof --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario plan-review-swarm-implementation-writing-tests-proof --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-execute-plan-implementation-writing-tests-proof --serial --timeout 900
tests/skills/run-skill-pressure-tests.sh --scenario implementation-writing-tests-implementation-review-swarm-false-test-proof --serial --timeout 900
```

Broad proof, if auth/tooling permits:

```text
tests/skills/run-skill-pressure-tests.sh --fast --serial --timeout 900
```

## Risks And Countermeasures

- Risk: the new skill becomes too broad and agents skip it.
  Countermeasure: keep `SKILL.md` compact; move examples and definitions into
  one-purpose references.
- Risk: plan creation duplicates the full implementation-writing-tests doctrine.
  Countermeasure: plan creation records schema slots and references the skill;
  it does not restate the manual.
- Risk: phase skills duplicate or fork the testing doctrine.
  Countermeasure: Tasks 3-6 include a duplication audit; phase skills may route
  and enforce slots only.
- Risk: plan review starts designing all tests instead of reviewing the plan.
  Countermeasure: plan review may propose missing seams/invariants as candidate
  findings, but accepted fixes route back to `plan-creation-swarm`.
- Risk: project-local definitions conflict with default proof layers.
  Countermeasure: project definitions win; the schema records
  `project_layer_definition`.
- Risk: agents delete weak tests without replacement proof.
  Countermeasure: test removal requires replacement, redundancy, or dead-contract
  proof in the schema.
- Risk: property-driven development is mistaken for mandatory property-based
  test libraries.
  Countermeasure: define property thinking separately from generator tooling.

## Deferred Follow-Ups

- Handoff wiring for `plan-handoff` and `implementation-handoff`.
- Splitting plan review into a named `implementation-writing-tests` lane if
  `testability-validation` grows too broad after v1 usage.

## Ready Criteria For Implementation

- Plan review accepts this plan or returns bounded edits.
- Source adaptation/security route is recorded.
- RED pressure scenarios are added before behavior-changing skill edits.
- The shared schema is implemented before dependent workflow wiring.
- Final change passes static validation and focused behavior proof, or reports
  exact environment blockers without claiming behavior proof.
