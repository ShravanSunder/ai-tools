# Skill Pressure Testing System Replacement Implementation Plan

Status: accepted after whole-plan review, external Opus review, and parent remediation

Goal id: `2026-07-10-skill-pressure-judge-system`

Accepted source:
`docs/specs/2026-07-10-skill-pressure-judge-system-spec.md`

Supersedes:
`docs/plans/2026-07-10-skill-pressure-judge-system-implementation.md`

## Goal And Terminal

Complete the behavioral skill pressure-test hard cutover from the current
partially implemented branch. Stop when the implementation and proof loop are
complete, implementation review findings are resolved, and the PR is freshly
proven ready but remains unmerged.

This plan does not repeat completed migration or restore deleted legacy
architecture. It closes the accepted v2 comparison, artifact-evidence,
runtime-profile, reporting, behavioral-proof, and delivery contracts.

## Source Coverage And Current Truth

Planning read the accepted 488-line spec in full, the 117-line dependency
feedback packet, the consuming skills-creation spec's proof expectations, the
431-line superseded plan, and the current runner implementation.

Verified current state at commit `5c60db7`:

- owner-local migration is complete: the immutable legacy map accounts for 107
  scenarios across 23 owners and the legacy runner authority is absent;
- one additional scenario under `tests/test-utils/` is a runner fixture and is
  correctly excluded from owner discovery;
- Vitest Evals is the authoritative reachable entrypoint;
- project-local skill installation, fresh disposable Git repositories, ACPX
  launch, process-group cleanup, redaction, transcript collection, prior-source
  extraction, blind review, and parent-review receipt primitives exist;
- local proof is green: 24 unit files / 89 tests, 11 integration tests,
  migration test, generated-schema check, and typecheck;
- one standard-risk five-baseline/five-treatment ACPX Luna run has passed, but
  it predates the v2 contract and is historical evidence only;
- current scenarios and schema remain v1 with no `comparison_intent`;
- the reducer implements improvement only and has no machine-readable reason
  codes;
- the reachable runner rejects `previous_revision` even though lower-level
  prior-source support exists;
- deterministic artifact checks evaluate 2,000-byte excerpts rather than
  complete owned content;
- high-risk review requests `opus[high]`, not verified Opus/xhigh;
- `--fast` is parsed but does not change selection, aggregate R26 reporting is
  incomplete, and stable standard/high-risk command surfaces are absent.

## Scope

- `tests/test-utils/skill-pressure/` contracts, discovery, migration receipts,
  runtime, evidence, evaluation, review, reduction, reporting, scripts, schemas,
  tests, and runner documentation;
- the 107 owner scenarios under `tests/<plugin>/<skill>/scenarios/` for the
  atomic v2 frontmatter cutover and deliberate comparison-intent classification;
- narrowly required new owner scenarios or fixtures for non-regression and
  artifact-scoped wired-path proof;
- plugin metadata, marketplace metadata, README surfaces, and dated changelog
  required by the user-visible cutover;
- implementation review and PR-ready delivery artifacts.

Non-goals:

- no generalized host capability laboratory, plugin-command testing, MCP poison
  suite, hostile-code containment claim, or provider-sandbox proof;
- no subject self-grading or global visible-response semantic regex oracle;
- no skill-specific caller/lane rubric inside generic runner code;
- no v1 compatibility parser, dual reducer, or legacy runner restoration;
- no unrelated skill rewrite or historical-doc rewrite;
- no installed home-cache refresh without explicit authorization;
- no merge.

## Planning Lanes And Effort

- codebase-boundary: Terra/high, read-only;
- validation-proof: Terra/high, read-only;
- execution-order and scope-fit: Terra/high, read-only;
- plan review: whole-plan cohesion plus focused review at high effort;
- external Opus Sidekick: resume only for the requested adversarial review,
  candidate findings only.

The parent verifies all lane anchors and owns classification, integration,
proof, commits, workflow transitions, and final claims.

## Execution DAG

```text
gate 0: accepted spec + clean branch + current local proof revalidated
  |
  +-- read-only owner classification packets
  |      output: parent-accepted 107-row v2 intent map
  |
slice 1: atomic schema-v2 and scenario hard cutover
  |      checkpoint commit after schema/discovery/migration proof
  |
  +-----------------------------+
  |                             |
  v                             v
slice 2A                    slice 2B
objective evidence          comparison/runtime/review
full-before-bound           prior revision + truth tables
mutation proof              profile verification + reasons
  |                             |
  +-------------+---------------+
                v
integration gate: parent wires shared runner and receipt/report contracts
  |              local unit + integration + schema + migration proof
  |
slice 3: Vitest Evals selection, aggregation, and stable commands
  |
slice 4: calibrated live ACPX improvement + non-regression + high-risk proof
  |
slice 5: docs, changelog, metadata, and complete validation
  |
implementation-review-swarm -> accepted-finding remediation -> affected proof
  |
implementation-pr-wrapup -> fresh checks/comments/threads/mergeability
  |
terminal: PR-ready and unmerged
```

Slices 2A and 2B may run in parallel only after slice 1 commits. Their write
sets are disjoint until the parent-owned integration gate.

## Gate 0: Re-anchor And Freeze Completed Proof

Purpose: prevent stale-plan replay and protect already-completed migration.

1. Confirm branch/worktree identity and clean tracked status.
2. Run the current unit, integration, migration, schema, and typecheck commands.
3. Re-read the migration receipt and prove the fixed legacy baseline is 107
   rows across 23 owners, with owner discovery excluding runner fixtures.
4. Record the current 107 scenario IDs, source paths, owner paths, baseline
   modes, risk, and current contract digest in a classification ledger.
5. Do not modify implementation if current local proof fails outside the
   accepted v2 delta; report the scope break before expanding the plan.

Checkpoint G0: current proof and migration receipt are fresh from the branch
head. No commit is required when no tracked files change.

## Slice 1: Atomic V2 Contract And Scenario Cutover

Sources: R1-R7, R25, R27-R29.

Behavioral capability:

- only schema v2 is accepted;
- every owner scenario explicitly declares `comparison_intent`;
- canonical contract identity includes the complete parsed v2 contract;
- pair and result receipts expose intent and stable identity;
- the fixed legacy baseline remains accounted for as active or explicitly
  retired, while post-baseline scenarios remain distinguishable.

Likely write surfaces:

```text
tests/test-utils/skill-pressure/lib/contracts/
tests/test-utils/skill-pressure/lib/discovery/
tests/test-utils/skill-pressure/lib/migration/
tests/test-utils/skill-pressure/lib/test-fixtures.ts
tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml
tests/test-utils/skill-pressure/schemas/skill-pressure-scenario.schema.json
tests/<plugin>/<skill>/scenarios/*.md
```

TDD and tasks:

1. Add failing tests that reject v1, missing intent, invalid intent, and duplicate
   artifact/direct-path content ownership.
2. Add failing tests proving intent changes the canonical contract digest and
   appears in pair/result/report fixtures.
3. Define one canonical sorted-key serialization owner and SHA-256 digest.
   Do not hash raw Markdown formatting as contract identity.
4. Add an explicit previous-revision pin/source field required whenever
   `baseline: previous_revision`; reject an unpinned previous baseline.
5. Produce a read-only 107-row classification map. Preserve `improvement` only
   where the scenario's original pressure claim expects baseline failure or an
   inspectable proof gap. Use `non_regression` only for an evidenced passing
   control with an immutable prior revision. Parent reviews every exception and
   the aggregate counts before editing scenarios.
   The map includes every current baseline value. Any `previous_revision` row
   without an immutable pin is unresolved and blocks the cutover rather than
   receiving a guessed pin or fallback baseline.
6. Update all owner scenarios and runner fixtures in one hard cutover. Do not
   leave optional intent or a v1 fallback.
7. Extend migration accounting to support explicit retirement reasons and a
   user-authorization receipt while preserving `active + retired = 107` for the
   fixed legacy baseline. Every proposed retirement blocks for an explicit user
   decision; parent or reviewer approval alone is insufficient. New post-baseline
   scenarios do not alter that equation.
8. Regenerate and verify the checked JSON schema.
9. Define baseline evidence classification in the semantic review/result
   receipt. `demonstrated_failure` and `classified_proof_gap` are distinct
   evidence classes under `improvement`; `passing_control` belongs only to
   `non_regression`. A proof-gap repetition still fails the complete hidden
   rubric and therefore enters intent reduction as `behavior_fail`, with the
   proof-gap classification and evidence digest preserved. An all-passing
   improvement baseline remains `not_evaluated`; classification metadata may
   not convert it into a pass.

Local proof:

- contract/schema unit tests fail before implementation and pass afterward;
- discovery accepts all active v2 owner scenarios and rejects v1 fixtures;
- canonical digest tests are stable across key order/formatting and change when
  intent changes;
- migration receipt accounts for all 107 legacy rows and any explicit
  retirement reason plus user-authorization reference;
- baseline evidence classification round-trips through scenario review, result
  receipt, and report without making an all-passing improvement baseline pass;
- typecheck, schema parity, and `git diff --check` pass.

Checkpoint CP1: commit the atomic v2 cutover. Split/replan if any owner scenario
cannot be classified honestly; do not bulk-label it to make discovery pass.

## Slice 2A: Objective Artifact Evidence Integrity

Sources: R15-R17, R20, security context, proof expectation 5.

Write scope:

```text
tests/test-utils/skill-pressure/lib/evidence/
tests/test-utils/skill-pressure/lib/contracts/ artifact-check types only
tests/test-utils/skill-pressure/lib/evaluation/subject-repetition.integration.test.ts
```

Avoid shared `behavioral-scenario-runner.ts` until integration.

TDD and tasks:

1. Add a table-driven mutation suite for:
   - required text in surrounding response or the wrong artifact;
   - forbidden text in the target artifact;
   - missing content and wrong kind;
   - traversal, normalized-path collision, and duplicate ownership;
   - required/forbidden content beyond the report excerpt boundary;
   - semantic reviewer approval paired with deterministic failure.
2. Separate evaluation-time artifact content from persisted report excerpts.
   Collect complete regular-file content up to one documented hard byte ceiling.
3. For content above the ceiling, record digest and byte size, mark content
   unavailable, and reduce to `not_evaluated`; never evaluate a truncated prefix.
4. Implement distinct typed literal and pattern operations: existence, kind,
   literal contains/excludes, and pattern matches/not-matches.
   Validate pattern syntax during scenario loading so malformed expressions are
   `invalid`, not runtime crashes. Bound pattern length and evaluated content,
   and either reject unsafe constructs or use a bounded/safe matching mechanism
   so repository-controlled patterns cannot stall a worker.
5. Require expected-artifact content/kind checks to address `artifact_id`.
   Reserve direct path facts for undeclared paths and absence/state checks.
6. Preserve symlink/hard-link/traversal rejection, redaction-before-persistence,
   and bounded reviewer packets.

Local proof:

- every malformed mutation becomes `behavior_fail` or `not_evaluated`, never
  `pass`;
- a target after the report boundary is still evaluated correctly;
- content over the hard ceiling fails closed with size/digest receipt;
- repository integration proves full-content evaluation and bounded persisted
  excerpts are separate;
- unit, focused integration, typecheck, and `git diff --check` pass.

Checkpoint CP2A: objective evidence has one owner and no semantic override.

## Slice 2B: Comparison, Prior Revision, And Runtime Profile Integrity

Sources: R5-R9, R18-R22, proof expectations 1, 4, 6, and 7.

Write scope:

```text
tests/test-utils/skill-pressure/lib/reduction/
tests/test-utils/skill-pressure/lib/runtime/
tests/test-utils/skill-pressure/lib/review/
tests/test-utils/skill-pressure/lib/evaluation/repetition-coordinator.ts
tests/test-utils/skill-pressure/lib/evaluation/repetition-coordinator.test.ts
tests/test-utils/skill-pressure/lib/collector/acpx-transcript-collector.ts
tests/test-utils/skill-pressure/lib/collector/acpx-transcript-collector.test.ts
```

Avoid shared `behavioral-scenario-runner.ts` until integration.

TDD and tasks:

1. Add failing truth-table tests for both intents, including mixed sides,
   treatment failure, invalid non-regression control, improvement baseline
   already passing, missing evidence, and infrastructure precedence.
2. Add machine-readable reason codes from the accepted minimum set and verify
   reports can distinguish proof gaps from missing evidence.
   The intent-aware reducer accepts only baseline `behavior_fail` repetitions
   for demonstrated-failure or classified-proof-gap improvement. Delete the
   competing `reduceObjectiveEvidenceOutcome` path in this slice; Slice 2A does
   not write `lib/reduction/`.
3. Wire the existing immutable previous-source extraction into repetition
   requests and receipts. Prove the selected Git revision and content digest.
4. Preserve equal common inputs across pair sides while allowing only selected
   skill source to differ.
5. Define runtime-profile receipts with requested model/effort, accepted
   provider-reported model ID/effort, observed values, and verification result.
6. Replace bracketed Claude `opus[high]` assumptions with adapter-correct model
   selection plus the advertised `effort=xhigh` control. Do not label a run
   xhigh from request/config acknowledgement alone when provider evidence is
   missing.
   Route subject selection through the same runtime-profile owner rather than
   hardcoded literals in the behavioral runner. Luna/xhigh remains the default;
   an explicitly configured different profile is preserved or fails closed,
   never silently replaced by Luna.
7. Make missing, null, rejected, downgraded, or mismatched required profile
   evidence an `infrastructure_error` before semantic reduction.
8. Preserve blind packet isolation and parent-review receipt validation.
9. Add one same-session ACPX preflight that proves model selection, advertised
   effort configuration, prompt execution, provider session identity, and
   cleanup belong to the same relationship. Receipt ACPX and provider session
   IDs separately and reject reuse across repetitions.

Local proof:

- all comparison truth-table and precedence tests pass with exact reason codes;
- prior-revision integration proves immutable source and pair equality;
- runtime-profile tests reject null, alias-only, downgraded, and unreported
  evidence;
- transcript fixtures distinguish requested configuration, adapter
  acknowledgement, provider-reported configuration, ACPX session ID, and
  provider session ID;
- high-risk profile requests and verifies Claude Opus/xhigh through ACPX;
- unit, focused integration, typecheck, and `git diff --check` pass.

Checkpoint CP2B: commit independently if its write set remains disjoint from
CP2A; otherwise parent integrates both before committing.

## Integration Gate: One Reachable Behavioral Runner

Sources: R6, R18-R26, R29.

Parent-owned write surfaces:

```text
tests/test-utils/skill-pressure/lib/evaluation/behavioral-scenario-runner.ts
tests/test-utils/skill-pressure/lib/evaluation/behavioral-scenario-runner.test.ts
tests/test-utils/skill-pressure/lib/evaluation/skill-pressure-eval-harness.ts
tests/test-utils/skill-pressure/lib/review/review-packet.ts
```

Tasks:

1. Thread comparison intent, canonical contract identity, prior-source receipts,
   deterministic evidence, runtime-profile verification, semantic candidate
   review, reason codes, and final reduction through one reachable path.
2. Apply precedence in order: infrastructure/profile, missing evidence,
   deterministic facts, semantic candidate review, comparison-intent reduction.
3. Ensure parent review and blind review are both valid routes; automated runs
   remain blind by default and high-risk requires outside Opus/xhigh review.
4. Update result artifacts without exposing hidden rubric or unbounded content
   to subjects or persisted reports.
5. Remove obsolete improvement-only/objective-only competing reduction call
   sites after Slice 2B has deleted the competing reducer.

Integration proof:

- behavior-runner fixtures cover both intents and every precedence branch;
- deterministic failure defeats a passing reviewer fixture;
- all unit, integration, migration, schema, and typecheck gates pass together;
- no retained v1, excerpt-evaluation, `opus[high]`, or competing reducer path is
  reachable.

Checkpoint CP2: commit the integrated local runner before live model calls.

## Slice 3: Vitest Evals Selection, Reporting, And Stable Commands

Sources: R23-R26 and proof expectation 9.

Likely write surfaces:

```text
tests/test-utils/skill-pressure/evals/skill-pressure.eval.ts
tests/test-utils/skill-pressure/lib/evaluation/evaluation-registration.ts
tests/test-utils/skill-pressure/lib/evaluation/skill-pressure-eval-harness.ts
tests/test-utils/skill-pressure/lib/reporting/ (new only if responsibility earns it)
tests/test-utils/skill-pressure/run-skill-pressure-tests.sh
tests/test-utils/skill-pressure/package.json
tests/test-utils/skill-pressure/README.md
```

TDD and tasks:

1. Make `--scenario`, `--jobs`, and `--serial` preserve their current intended
   behavior with explicit registration tests.
2. Give `--fast` one documented behavior: select a small repo-owned,
   deterministic standard-risk smoke manifest and run those scenarios through
   real ACPX/Vitest Evals behavior. Fake/local plumbing remains under unit and
   integration commands and is never called pressure proof. `--fast` and
   `--scenario` are mutually exclusive so neither silently overrides the other.
3. Add risk-aware selection needed by stable standard and high-risk commands.
4. Emit exact selected, skipped, invalid, executed, passed, behavior-failed,
   inconclusive, infrastructure-error, and not-evaluated counts.
5. Persist bounded per-scenario receipts plus one aggregate receipt. A selected
   scenario that did not execute prevents successful aggregate status.
6. Expose and document stable commands:

```bash
pnpm --dir tests/test-utils/skill-pressure run typecheck
pnpm --dir tests/test-utils/skill-pressure run test:unit
pnpm --dir tests/test-utils/skill-pressure run test:integration
pnpm --dir tests/test-utils/skill-pressure run test:migration
pnpm --dir tests/test-utils/skill-pressure run schemas:check
pnpm --dir tests/test-utils/skill-pressure run test:behavior -- --scenario <id>
pnpm --dir tests/test-utils/skill-pressure run test:standard
pnpm --dir tests/test-utils/skill-pressure run test:high-risk
```

Proof:

- fake-backed registration/reporting tests cover selection and every count;
- focused scenario registration remains serial;
- standard and high-risk selection sets are disjoint and complete;
- `--fast` selection is deterministic and documented;
- every `--fast` case is a real ACPX standard-risk scenario from the smoke
  manifest, and combining it with `--scenario` is a configuration error;
- fake-backed plumbing is labeled non-behavioral.

Checkpoint CP3: commit the reachable Vitest Evals/reporting surface. Do not
claim behavioral proof from fake-backed tests.

## Slice 4: Calibrated Live ACPX Proof

Sources: proof expectations 3, 4, 6, and 7 plus dependency acceptance receipt.

This slice is serial because each gate depends on interpreting the prior
receipt. Do not launch the full suite first.

### Calibration Gate

1. Choose an `improvement` scenario whose immutable baseline demonstrates five
   consistent failures or an inspectable classified proof gap. Do not rewrite
   a passing baseline into RED.
2. Choose a `non_regression` scenario whose immutable previous revision passes
   five times and whose current treatment is expected to preserve that behavior.
3. Prefer owner scenarios required by the consuming skills-creation spec when
   those artifacts are available on this branch. Otherwise use a generic runner
   fixture or another owner scenario with the same honest evidence class and
   record why it proves the generic contract rather than the consuming skill.
4. Record scenario IDs, prior revision, model profile, source digests, and
   expected evidence class before executing treatment in
   `tmp/plan-workflows/2026-07-10-skill-pressure-judge-system/slice-4-calibration.md`.
   Parent approval of this ledger is a prerequisite for every live gate.

### Live Gates

1. Focused improvement: five baseline plus five treatment ACPX Luna/xhigh
   contexts through Vitest Evals.
2. Focused non-regression: five passing baseline plus five passing treatment
   ACPX Luna/xhigh contexts through Vitest Evals.
3. Focused artifact-wired behavior: one five-by-five scenario must exercise a
   named-artifact check whose target is beyond the persisted excerpt boundary
   and prove deterministic failure outranks a passing semantic candidate.
4. Standard blind-review smoke with a fresh ACPX mini or balanced reviewer.
5. High-risk same-session profile preflight and behavior smoke with verified
   ACPX Claude Opus/xhigh; unavailable or
   unverified effort is infrastructure failure, not degraded proof.
6. Standard and high-risk suites with bounded concurrency only after focused
   gates pass. Preserve exact aggregate counts and every infrastructure error.

Receipt acceptance requires:

- ten unique disposable repositories and ACPX/provider session identities per
  focused comparison;
- equal common-input fingerprints and correct source digests;
- requested and provider-reported model/effort verification;
- complete deterministic facts, bounded persisted evidence, review receipt,
  intent-specific outcome, reason code, usage, and cleanup receipt;
- no hidden rubric in subject-visible files or prompts.

Checkpoint CP4: commit only tracked runner/scenario corrections produced by
live proof. Keep redacted receipts under `tmp/` as evidence; do not commit raw
transcripts or secrets.

Split/replan trigger: if the accepted consuming spec cannot be proven without
bringing its unmerged skill implementation into this branch, complete the
generic runner acceptance receipt first and leave the consuming skill's
skill-specific omission matrix to its owning branch. Do not copy that skill
implementation here.

## Slice 5: Release Surfaces And Complete Local Validation

1. Update the runner README from RED/GREEN-only terminology to comparison
   intent, full artifact evaluation, stable commands, evidence locations, and
   honest limits.
2. Update current operational pointers only. Preserve historical specs and
   changelog evidence unless they falsely present themselves as current truth.
3. Add a dated public-safe changelog entry and index it newest-first.
4. Bump the owning plugin versions and matching marketplace metadata only when
   this runner change alters shipped skill/plugin behavior or repo policy
   requires the bump; record an explicit not-applicable rationale otherwise.
5. Do not refresh installed Codex/Claude caches without explicit authorization.
6. Run every local proof command and record exit codes and exact counts.
7. Emit
   `tmp/plan-workflows/2026-07-10-skill-pressure-judge-system/dependency-acceptance-receipt.md`
   with the six anchors required by dependency feedback: comparison-intent
   schema field/version, reducer branches and unit-test names, artifact-content
   check shape, artifact-scoping unit-test names, focused wired-path scenario,
   and PR identity. At this unmerged terminal, record PR number and current head
   SHA plus `merged_commit: deferred_by_unmerged_terminal`; the consuming branch
   may require the merged commit only after separately authorized merge.
   Parent verifies every file, test ID, receipt, and PR reference resolves.

Checkpoint CP5: commit docs/metadata plus any final scoped fixes after complete
local proof.

## Requirements/Proof Matrix

| Requirement / claim | Source | Owning slice | Proof modality and layer | Evidence source | Freshness guard | Red/green required | Sized to pass |
| --- | --- | --- | --- | --- | --- | --- | --- |
| v2 explicit comparison intent and canonical identity | R3, R6, R25 | 1 | failing-first unit + schema parity | parent-run contract tests and generated schema | current contract/schema digest | yes | yes, atomic cutover |
| honest improvement and non-regression truth tables | R5, R21 | 2B + integration | unit mutation/table + integration | reducer and runner receipts | current reducer digest | yes | yes |
| classified proof gap remains distinct from passing control | R5, R21 | 1 + 2B + integration | semantic receipt round-trip + truth-table tests | evidence classification and digest | current rubric/result/reducer digests | yes | yes |
| immutable previous revision and pair equality | R5-R7 | 2B + integration | filesystem/Git integration | source and pair receipts | revision/content/common-input digests | yes | yes |
| complete artifact evaluation before report bounding | R15-R16 | 2A | unit mutations + repository integration | artifact fact receipt with size/digest/ceiling | collector/evaluator digest | yes | yes |
| deterministic facts outrank semantic approval | R20 | 2A + integration | mutation + runner integration | failed objective fact plus passing review fixture | evaluator/reducer digest | yes | yes |
| verified runtime model and effort | R8, R19 | 2B + 4 | unit fail-closed + live ACPX | requested/reported profile receipt | adapter output and session ID | yes | yes |
| exact selected/executed/outcome reporting | R23-R26 | 3 | unit/integration smoke | aggregate receipt | run ID and evaluator digest | yes | yes |
| 107 legacy rows active or explicitly retired | R27-R29 | 1 | migration + absence proof | migration/discovery receipt | source/tree digest | yes | yes |
| real improvement behavior | proof 3 | 4 | behavioral/e2e, 5x5 | parent-inspected Vitest Evals receipt | scenario/source/model/session fingerprints | yes | yes, focused first |
| real non-regression behavior | proof 4 | 4 | behavioral/e2e, 5x5 | parent-inspected Vitest Evals receipt | scenario/revision/model/session fingerprints | yes | yes, focused first |
| high-risk outside judgment | R19, proof 7 | 4 | live external review | ACPX Opus/xhigh review receipt | exact adapter/model/effort/session | yes | yes |
| dependency acceptance handoff | dependency feedback 104-116 | 5 | receipt schema + parent anchor verification | dependency acceptance receipt | current plan/spec/test IDs and PR head SHA | no | yes |
| security and cleanup boundaries | R10-R17, security context | 2A, 2B, 4 | unit + process/filesystem integration + live receipt | redaction, containment, cleanup facts | current process/collector digest | yes | yes |
| reviewed PR-ready unmerged delivery | terminal | 5 + review/wrapup | implementation review + PR gate | review reduction and fresh GitHub state | PR head SHA | no | yes |

No red/green exception is authorized.

## Validation Order

Expected post-Slice-3 command names; the executor verifies the actual scripts
before use. Run lower proof layers before higher layers:

```bash
pnpm --dir tests/test-utils/skill-pressure run test:unit
pnpm --dir tests/test-utils/skill-pressure run test:integration
pnpm --dir tests/test-utils/skill-pressure run test:migration
pnpm --dir tests/test-utils/skill-pressure run typecheck
pnpm --dir tests/test-utils/skill-pressure run schemas:check
pnpm --dir tests/test-utils/skill-pressure run test:behavior -- --scenario <improvement-id>
pnpm --dir tests/test-utils/skill-pressure run test:behavior -- --scenario <non-regression-id>
pnpm --dir tests/test-utils/skill-pressure run test:standard
pnpm --dir tests/test-utils/skill-pressure run test:high-risk
```

The executor must verify the actual script names after slice 3. Missing provider
proof remains `infrastructure_error` and prevents the corresponding behavioral
or high-risk gate from being called done.

## Security And Reliability

- Treat subject output and created artifacts as untrusted input.
- Normalize and contain repository paths; reject links and ambiguous identity.
- Evaluate complete content only within the documented ceiling; never persist
  unbounded artifact content merely to enable evaluation.
- Redact before persistence and never store credentials or hidden reasoning.
- Keep hidden rubrics and deterministic criteria outside subject-visible state.
- Preserve runner-owned process-group timeout, TERM/KILL, drained streams, and
  cleanup receipts.
- ACPX/provider failures and unverified profiles are infrastructure outcomes,
  not behavioral failures or passes.
- Use bounded retries and continue independent local work before declaring a
  provider blocker.

## Commit And Recovery Rhythm

- Commit after CP1, CP2A and CP2B when their write sets remain disjoint,
  integrated CP2, CP3, CP4 tracked corrections, CP5, accepted
  implementation-review remediation, and PR-ready wrapup when files changed.
- Use `--no-gpg-sign` only if normal signing fails or the user is absent.
- Never amend, rebase, merge, force-push, or delete branches without authority.
- Never stage unrelated files.
- The final PR-readiness check is terminal evidence, not a commit checkpoint.
  No tracked change may occur after it. Any later change loops back through
  commit, push, affected proof, and fresh PR-state verification at the new head.
- If live evidence breaks the accepted mental model, stop code edits and route
  back to spec creation/review before continuing.
- If a validation failure is outside the agreed runner path, report it and ask
  before changing infrastructure.

## Implementation Review And PR Wrapup

1. Run `shravan-dev-workflow:implementation-review-swarm` over the complete
   branch diff and proof chain.
2. Parent-verify every candidate finding. Route accepted implementation defects
   back through `implementation-execute-plan`; route spec defects back through
   spec creation and review.
3. Commit accepted remediation and rerun every affected lower and higher proof
   gate.
4. Use `shravan-dev-workflow:implementation-pr-wrapup` to push/open/update the
   PR, inspect checks, comments, review threads, and mergeability at the current
   head SHA.
5. Stop at PR-ready and unmerged. Merge requires a separate explicit user
   directive.

## Open Questions

None at planning time. Exact improvement and non-regression scenario IDs and
immutable prior revision are calibration outputs owned by slice 4, not guesses
to bake into the plan before baseline evidence exists.
