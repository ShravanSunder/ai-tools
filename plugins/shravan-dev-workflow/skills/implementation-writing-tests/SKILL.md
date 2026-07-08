---
name: implementation-writing-tests
description: Use when implementation, planning, execution, or review work includes writing, changing, auditing, repairing, removing, or judging tests or test proof; choosing public seams, domain boundaries, critical invariants, illegal-state strategy, guards/preconditions/assertions, IO-boundary cases, oracles, proof layers, RED/GREEN evidence, property-style checks, project proof-layer definitions, or deciding whether existing tests are meaningful proof. Do not use as the general implementation skill when no test decision or proof claim is in scope.
---

# Implementation Writing Tests

Own the testing and proof slice of implementation work. This skill does not
own product implementation; it decides how tests can prove, fail to prove, or
stop pretending to prove a change.

## Reference Routing

- Load `references/test-seams-and-invariants.md` when choosing what a test
  observes, which domain boundary it crosses, what claim/property it protects,
  how illegal states are prevented, or what oracle is independent.
- Load `references/proof-layers.md` when classifying unit/integration/smoke/e2e
  proof, project-local definitions, RED/GREEN, or freshness guards.
- Load `references/existing-test-audit.md` before deleting, repairing, or
  keeping existing tests.
- Load `references/test-antipatterns.md` when reviewing weak tests, false-green
  proof, mocks, snapshots, fake smoke, or tautological assertions.
- Load `references/property-driven-development.md` when critical invariants,
  illegal states, generated examples, state transitions, metamorphic relations,
  or table-driven property checks would make proof stronger.
- Load `references/schema-implementation-test-proof.md` when a plan, execution
  packet, review report, or handoff needs structured test-proof slots.

## Workflow

1. Classify the test work.
   - `new-behavior-test`
   - `bug-prove-it-test`
   - `existing-test-audit`
   - `weak-test-repair`
   - `test-removal`
   - `implementation-proof-review`
   Completion: name the category and the behavior/proof claim under test.

2. Inspect before deciding.
   - Read the production behavior or plan claim.
   - Inspect existing tests and project test taxonomy.
   - Identify explicit project overrides for proof-layer terms.
   - State when no relevant tests or project definitions exist.
   Completion: current seam, existing test surface, and project layer
   definitions are named or explicitly absent.

3. Choose boundary, seam, invariant, and oracle.
   - Use the required tuple from `references/test-seams-and-invariants.md`:
     domain boundary, public seam, critical claim/property or invariant,
     illegal-state strategy, and independent oracle.
   Completion: no test is planned, accepted, or reported without a domain
   boundary, public seam, claim/property or invariant, and oracle. When invalid
   states can enter through construction, mutation, parsing, IO, or external
   events, the representation or guard/precondition/assertion strategy is named.

4. Choose the proof layer.
   - Project definitions win when present.
   - Defaults apply only when the project is silent.
   - Lower layers stay explicit even when higher layers are also required.
   Completion: proof layer, project definition source, freshness guard, and any
   higher unrun layer are named with blocker, follow-up, or not-applicable
   status.

5. Require RED/GREEN or record an approved exception.
   - Behavior changes and bug fixes need a failing proof for the intended
     behavior before GREEN.
   - Docs, prompt-only, generated, mechanical, or explicitly throwaway work can
     use the smallest real proof line instead.
   - Agent-authored waivers are not exceptions.
   Completion: RED evidence, GREEN evidence, or explicit user-approved
   exception is recorded.

6. Repair or remove bad tests without weakening proof.
   - Keep tests that protect a live behavior contract.
   - Repair tests that use the wrong seam, oracle, layer, or fixture.
   - Remove tests only with replacement proof, redundancy proof, or dead-contract
     proof.
   Completion: every removed test has replacement, redundancy, or dead-contract
   proof; weak tests left in place are marked as remaining proof risk.

7. Report implementation test proof.
   - Use the shared schema when another phase consumes the result.
   - Separate plan-required fields from execution-filled and review-filled
     fields.
   Completion: output the schema slots or state why a compact proof line is
   sufficient for a tiny change; stale-prone proof is not complete without a
   freshness guard tied to the current worktree, run, or artifact.

## Stop Conditions

Stop and return the proof gap instead of accepting tests when:

- tests only assert mocks, internal collaborators, or private methods;
- expected values are recomputed with the implementation under test;
- a test cannot fail for the intended behavior;
- a critical invariant or domain boundary is unnamed for stateful behavior;
- invalid states can enter without an unrepresentable-state design, guard,
  precondition, assertion, or negative boundary proof;
- parser, API, filesystem, database, webhook, CLI, or UI input boundaries are
  changed without valid and invalid IO-boundary cases;
- a unit/config/schema check is labeled smoke/e2e;
- a snapshot or fixture lacks reviewed behavioral intent;
- project-local proof-layer definitions were not checked;
- stale-prone proof is reported without a freshness guard;
- tests are removed without replacement, redundancy, or dead-contract proof.
