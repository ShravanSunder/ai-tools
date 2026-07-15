# Skill Pressure Behavior Evaluation Replacement Plan

Status: accepted after adversarial review, parent remediation, and focused Opus verification

## Goal And Terminal

Implement the accepted behavior-evaluation contract from the current branch,
preserving verified work while replacing assumptions invalidated by live suite
evidence. Finish with implementation proof, implementation review, and a
PR-ready unmerged branch.

This plan does not restore the legacy runner, replay completed owner-folder
migration, or pretend all migrated scenarios are release gates. It creates one
authoritative Vitest Evals path with explicit behavior contracts, separate gate
authority, durable execution receipts, and honest calibration.

## Source Coverage

Primary accepted source, read in full:

- `docs/specs/2026-07-13-skill-pressure-behavior-evaluation-system/2026-07-13-skill-pressure-behavior-evaluation-system.md`
  - 593 lines
  - requirements R1-R32
  - proof expectations 1-11

Supporting current-state evidence:

- `tmp/spec-workflows/2026-07-13-skill-pressure-behavior-evaluation/review-reduction.md`
- `tmp/skill-pressure-evals/1784003250032-82244/aggregate-receipt.json`
- current implementation commits `24f5629..2725d43`
- immutable migration map under
  `tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml`
- prior version of this plan through commit `4f8d070`, historical only

## Current Truth

Reusable implementation already exists for:

- recursive owner-local discovery and schema-v2 loading;
- canonical scenario digests and immutable previous-revision pins;
- fresh disposable repositories and project-scoped skill installation;
- ACPX Luna/high subjects and fresh standard semantic reviewers;
- exact Claude `claude-opus-4-7`/xhigh high-risk verification;
- complete named-artifact evaluation before bounded report excerpts;
- process-group supervision, TERM/KILL, stream draining, and cleanup facts;
- strict reviewer JSON parsing;
- improvement/non-regression truth tables and machine-readable reasons;
- risk selection, aggregate receipts, and 107-row legacy accounting.

The accepted contract is not implemented for:

- effect surfaces, structured semantic assertions, and behavior requirement IDs;
- scenario-validity review for both diagnostics and gates;
- evaluation role and current baseline authority outside the behavior digest;
- runner-semantics digest and calibration freshness;
- append-only atomic attempt receipts written before retries continue;
- runner-owned scenario cancellation and a larger derived Vitest timeout;
- assertion-level review evidence and explicit untrusted-evidence framing;
- stale-calibration reduction, non-evasive demotion, and requirement tracing;
- gate-default versus diagnostic suite semantics and complete authority counts;
- per-row role, validity, calibration, and covered/uncovered requirement ledger.

Live discovery is 110 scenarios: 109 `no_skill/improvement` and one
`previous_revision/non_regression`. The fixed legacy baseline remains 107 across
23 owners; two scenarios were added afterward. Prior high-risk evidence is
calibration input, not gate authority: eight scenarios had all-passing baselines,
three were inconclusive, and one timed out before final receipt.

## Scope And Non-Goals

In scope:

- hard-cut the scenario contract to version 3;
- add a separate evaluation registry and authority receipts;
- preserve existing artifact/runtime/reducer work where it satisfies v3;
- add durable attempt receipts, deadlines, and cancellation recovery;
- migrate and validity-review all 110 current scenarios;
- calibrate at least one improvement gate, one non-regression gate, and one
  high-risk gate;
- report per-owner covered and uncovered behavior requirement IDs;
- complete local/live proof, implementation review, and PR readiness.

Out of scope:

- a compatibility schema or second runner;
- restored legacy shell authority;
- generalized provider capability, plugin-command, or MCP poison suites;
- hostile-code containment or provider sandbox claims;
- weakening comparison truth tables to absorb variance;
- making every scenario a gate by declaration;
- home-cache refresh, merge, or release.

## Planning Lanes And Parent Reduction

Planning lanes used high reasoning effort because the work is cross-module,
proof-heavy, and subprocess/security sensitive.

| Lane | Candidate contribution | Parent disposition |
| --- | --- | --- |
| codebase-boundary | current/reusable matrix, write chokepoints, six slices | accepted; current post-merge scenario count is 110 total |
| validation-proof | requirement/proof matrix, test pyramid, live call estimate | accepted |
| security-reliability | atomic attempts, cancellation, deadline graph, review isolation | accepted |
| vertical-slice decomposition | parent synthesis from source and lane evidence | accepted |
| execution-order | parent synthesis from dependency direction | accepted |
| scope-and-proof-fit | parent synthesis; gates split before expensive model runs | accepted |

Subagents supplied candidate evidence only. The parent verified current types,
schemas, package commands, scenario counts, aggregate results, and the accepted
spec before incorporating claims.

## Execution DAG

```text
Gate 0: re-anchor current branch and freeze reusable proof
  |
  v
Slice 1: behavior contract v3 + separate authority registry foundation
  |
  +-------------------------------+
  |                               |
  v                               v
Slice 2: objective + semantic     Slice 3: durable execution,
evidence/review contract          cancellation, and derived budgets
  |                               |
  +---------------+---------------+
                  |
                  v
Integration Gate A: one v3 scenario reaches evidence, review, and receipts
                  |
                  v
Slice 4: reduction authority, selection, reporting, and stable commands
                  |
                  v
Slice 5: 110-scenario validity migration and explicit disposition
                  |
                  v
Local Gate B: unit + mutation + integration + schema + migration + typecheck
                  |
                  v
Slice 6: focused ACPX calibration, then calibrated gate suites
                  |
                  v
Slice 7: docs, dependency receipt, implementation review, PR wrap-up
```

Slices 2 and 3 may run in parallel after Slice 1 freezes shared types. Their
primary write scopes are disjoint. `behavioral-scenario-runner.ts` is a parent
integration seam and is not edited concurrently. Scenario migration can fan out
by owner only after v3 schema and registry row shapes are frozen.

## Gate 0: Re-Anchor And Freeze Reusable Proof

Purpose: avoid replaying old work or treating old green tests as proof of the
new contract.

1. Confirm worktree, branch, HEAD, and unrelated dirty files.
2. Run current `typecheck`, unit, integration, migration, schema, and diff checks.
3. Record exact current test counts and migration/discovery counts.
4. Confirm current scenario split is 108 improvement/no-skill and one
   non-regression/previous-revision.
5. Capture the code surfaces already satisfying artifact-complete evaluation,
   exact profiles, pair equality, process cleanup, and truth tables.
6. Add no code if a current failure belongs outside this plan; stop and report
   the scope break before changing infrastructure.

Gate G0 proof: fresh command exits and counts tied to current HEAD. No commit is
required when tracked files do not change.

## Slice 1: Behavior Contract And Authority Foundation

Sources: R1-R14, R24-R30; proof expectations 1, 2, 9, and 10.

Behavioral outcome:

- only schema version 3 is accepted;
- behavior contracts declare effect surfaces, semantic assertions with stable
  IDs/evidence surfaces, and behavior requirement IDs;
- behavior digest excludes evaluation role and current calibration authority;
- one separate evaluation registry owns `gate | diagnostic | retired`, validity,
  calibration pointers, ordered authority events, and freshness;
- one runner-semantics digest owns the files that can change parse, execution,
  collection, review, reduction, or report semantics.

Likely write surfaces:

```text
tests/test-utils/skill-pressure/lib/contracts/
tests/test-utils/skill-pressure/lib/authority/                 # new
tests/test-utils/skill-pressure/lib/runtime/runner-semantics.ts # new
tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml
tests/test-utils/skill-pressure/config/authority-receipts/      # tracked, redacted
tests/test-utils/skill-pressure/schemas/skill-pressure-scenario.schema.json
tests/test-utils/skill-pressure/lib/test-fixtures.ts
```

TDD sequence:

1. Add failing schema tests for missing/invalid effect surfaces, assertion IDs,
   evidence surfaces, and behavior requirement IDs.
2. Add failing validity tests for artifact effects without allowed artifacts,
   undeclared tool effects, objective requirements only in semantic prose, and
   assertion evidence outside declared effects.
3. Add failing digest tests proving authority changes do not alter behavior
   identity and behavior changes do.
4. Add failing registry tests for unknown scenario IDs, digest mismatch,
   missing validity review, missing or `tmp/` current-baseline pointers,
   receipt-digest mismatch, accumulated baseline history, and silent default role.
5. Implement v3 contract types, parser, canonical serializer, generated schema,
   registry parser, and reason codes.
6. Implement an explicit runner-semantics manifest covering these inclusion
   classes: contract/parser; discovery/registry; execution/budget;
   collection/evidence/installation; review/runtime profiles; reduction;
   selection/Evals entrypoint; reporting; and package/runner command surfaces.
   Documentation is excluded. Tests mutate every class, reject unmanifested
   semantic modules under owned roots, and prove semantic changes stale
   calibration while documentation-only changes do not.
7. Store one self-contained current baseline receipt per calibrated scenario at
   `tests/<plugin>/<skill>/baselines/<scenario-id>.json`. Replace it atomically
   after a newly accepted run; never append digest- or timestamp-named baseline,
   promotion, demotion, attempt, cleanup, or parent-acceptance files. Embed
   compact canonical execution facts and parent acceptance. Raw transcripts,
   attempts, cleanup, repetitions, reviews, and diagnostic evidence remain
   ignored under `tmp/`; registry pointers to missing, ignored, or
   digest-mismatched current baseline receipts fail.
8. Freeze v3 interfaces before owner migration, but do not make the v3-only
   loader/schema authoritative while the 110 scenarios remain v2. The loader,
   generated schema, registry, and migrated corpus switch in one atomic cutover
   in Slice 5; no dual-schema compatibility path is introduced.

Local proof:

- contract/schema and authority unit tests RED then GREEN;
- behavior/authority digest separation;
- runner-semantics inclusion-class, exclusion, and manifest-closure tests;
- schema generation parity, typecheck, and diff check.

Checkpoint CP1: freeze and prove the interfaces. Commit only additive authority
and digest primitives that leave the current authoritative loader intact; keep
v3 loader/schema/corpus changes together for the Slice 5 atomic cutover. Replan
if this cannot be done without dual authority or mutable scenario frontmatter.

## Slice 2: Objective Evidence And Semantic Review Contract

Sources: R15-R17, R20-R22, Security Context; proof expectations 4 and 7.

Primary write scope:

```text
tests/test-utils/skill-pressure/lib/evidence/
tests/test-utils/skill-pressure/lib/review/
tests/test-utils/skill-pressure/lib/contracts/ objective-check types only
```

Avoid `behavioral-scenario-runner.ts` until Integration Gate A.

TDD sequence:

1. Preserve and extend mutation tests for wrong artifact, forbidden content,
   wrong kind, traversal/collision, excerpt-boundary content, oversized content,
   forbidden tools, and semantic approval paired with objective failure.
2. Require every objective artifact check to resolve through its declared
   `artifact_id`; reserve direct paths for undeclared state and absence.
3. Convert opaque hidden-rubric review to structured semantic assertions.
4. Require one classification and evidence anchor per assertion per repetition;
   reject missing, duplicate, unknown, or extra assertion results.
5. Frame response, tool, and artifact excerpts as untrusted quoted evidence,
   structurally separate from instructions, and add injection-shaped fixtures.
6. Preserve fresh reviewer context, empty MCP, exact profile verification,
   strict JSON, bounded/redacted evidence, and fail-closed parse behavior.
7. Give high-risk session create, effort config, prompt, and close distinct
   command-budget slots supplied by Slice 3.

Local proof:

- `test:mutation` covers every objective family used by a gate candidate;
- review packet/result tests cover assertion completeness and untrusted evidence;
- exact Luna/high and Claude Opus/xhigh profile tests remain green;
- no semantic candidate can override objective failure.

Checkpoint CP2 may commit independently from CP3 only for additive primitives
that do not switch the authoritative loader or require the unmigrated corpus.

## Slice 3: Durable Execution And Derived Budgets

Sources: R18-R19 and proof expectations 3 and 8.

Primary write scope:

```text
tests/test-utils/skill-pressure/lib/runtime/
tests/test-utils/skill-pressure/lib/evaluation/repetition-coordinator.ts
tests/test-utils/skill-pressure/lib/evaluation/subject-repetition.ts
tests/test-utils/skill-pressure/lib/evaluation/scenario-execution-budget.ts # new
tests/test-utils/skill-pressure/lib/reporting/attempt-receipt.ts          # new
```

Avoid `behavioral-scenario-runner.ts`, aggregate reporting, and authority files
until integration.

TDD sequence:

1. Define append-only atomic attempt receipts written only after process close,
   drained streams, redaction, snapshot collection, and cleanup facts exist.
2. Pass one runner-owned `AbortSignal` through executor and process supervisor.
3. Persist failed/timed-out attempts before deciding whether infrastructure retry
   is allowed. Never reuse partial attempts in a new comparison.
4. Add scenario progress receipts with last durable stage and completed attempt
   paths.
5. Derive command budgets from ACPX timeout, executor overhead, termination
   grace, command type, retries, repetitions, and actual critical-path topology.
6. Derive a runner scenario deadline and a larger Vitest emergency timeout with
   cleanup/receipt-flush reserve.
7. Reject under-budget configuration before launching ACPX. Stop launching work
   that cannot fit the remaining supervised budget.
8. Define `jobs` queue semantics explicitly. Because the current concurrency
   gate waits inside the registered Vitest callback, queue time counts toward
   the outer case timeout. Derive the outer timeout from worst-case queue waves,
   or move scheduling outside the callback and prove the replacement topology.
9. Redact before every atomic receipt publish. Test secret-bearing subject and
   reviewer stdout/stderr, reviewer failure, and secrets split across stream
   chunks; scan persisted receipt bytes to prove the seed is absent while
   reason, digest, cancellation, and cleanup facts remain.

Local/integration proof:

- abort sends TERM/KILL as needed, drains streams, and writes cancellation facts;
- timeout plus retry leaves two durable attempt receipts in order;
- atomic interruption leaves no valid partial receipt;
- old 2,400,000 ms high-risk envelope is rejected before ACPX;
- no reviewer starts after subject deadline exhaustion;
- scenario timeout reports `scenario_deadline` and last durable stage;
- queue-wave math fits the registered outer timeout;
- persisted attempt/repetition/scenario/aggregate receipts pass seeded secret
  scans across success and failure paths.

Checkpoint CP3: durable supervision and budget primitives committed. Replan if
ACPX cancellation cannot produce drained cleanup evidence.

## Integration Gate A: One Reachable V3 Runner

Parent-owned integration surfaces:

```text
tests/test-utils/skill-pressure/lib/evaluation/behavioral-scenario-runner.ts
tests/test-utils/skill-pressure/lib/evaluation/behavioral-scenario-runner.test.ts
tests/test-utils/skill-pressure/lib/evaluation/skill-pressure-eval-harness.ts
tests/test-utils/skill-pressure/lib/review/review-packet.ts
```

1. Thread v3 behavior identity, registry snapshot, objective facts, assertion
   review, atomic attempt paths, deadline plan, and runtime profiles through one
   scenario execution.
2. Apply precedence: infrastructure/profile/cleanup, missing evidence,
   deterministic facts, semantic candidate classifications, comparison intent,
   then authority freshness.
3. Write repetition and scenario receipts incrementally after their inputs are
   durable.
4. Ensure subjects never receive semantic assertions, behavior requirement IDs,
   comparison intent, evaluation role, or expected result.
5. Delete obsolete v2-only fixtures and competing call paths after all tests use
   the v3 runner.

Proof: one fake-backed improvement fixture and one non-regression fixture traverse
the complete v3 path; deterministic failure defeats semantic approval; timeout
preserves partial receipts; unit, integration, schema, and typecheck pass.

Checkpoint CP4: prove the reachable v3 runner against isolated v3 fixtures.
Commit only additive integration seams that preserve current authority; the
authoritative entrypoint switches with the Slice 5 corpus cutover.

## Slice 4: Authority, Reduction, Selection, And Reporting

Sources: R20-R28, R32; proof expectations 2 and 9.

Likely write surfaces:

```text
tests/test-utils/skill-pressure/lib/authority/
tests/test-utils/skill-pressure/lib/reduction/
tests/test-utils/skill-pressure/lib/reporting/
tests/test-utils/skill-pressure/lib/evaluation/evaluation-registration.ts
tests/test-utils/skill-pressure/evals/skill-pressure.eval.ts
tests/test-utils/skill-pressure/run-skill-pressure-tests.sh
tests/test-utils/skill-pressure/package.json
```

TDD sequence:

1. Preserve strict intent truth tables and deterministic precedence.
2. Add authority preconditions: stale or missing gate calibration becomes
   `not_evaluated/stale_calibration`; diagnostic outcomes retain evidence but no
   release authority.
3. Prove treatment-source changes do not stale calibration while behavior
   contract, baseline policy, runner semantics, or profile changes do.
4. Implement parent-accepted current-baseline replacement and demotion validators. A
   demotion created after a run cannot change that run's snapshot or outcome;
   treatment failure/mix is not valid same-run demotion evidence.
5. Require a digest-bound parent acceptance receipt before a scenario outcome
   can carry release authority. Reject absent, partial, stale, or mismatched
   acceptance; reviewer output remains candidate evidence.
6. Define one validated claimed-requirement input for each pressure-proof run,
   supplied by the owning spec/proof matrix or an explicit CLI manifest. Digest
   it into selection and aggregate receipts. Unknown or untraced IDs remain
   `not_evaluated` and prevent the corresponding pressure-proof claim.
7. Select fresh gates by default for standard/high-risk commands. Add a separate
   diagnostic calibration command whose successful exit means complete
   execution, never behavioral approval.
8. Make diagnostic command exit semantics explicit: invalid contract,
   infrastructure failure, missing selected execution, or incomplete accounting
   exits nonzero; behavioral failures may exit zero only with
   `completed_with_findings` in the aggregate receipt.
9. Expand aggregate receipts with gate, diagnostic, calibrated, stale,
   demoted-this-run, untraced, timed-out, and missing counts.
10. Expose the derived timeout at the Vitest registration seam; reject stale or
    under-budget case registration before executor invocation, remove the fixed
    2,400,000 ms constant, and prove scenario cancellation plus receipt flush
    completes inside the registered outer timeout.
11. Add explicit package commands for `test:mutation`, `test:authority`,
    `test:calibration`, and fake-backed command smoke while preserving focused
    behavior execution. Widen `test:integration` to discover every owned
    integration test rather than one hard-coded file.

Proof:

- authority/reducer truth tables cover every reason and freshness input;
- registry snapshot prevents same-run authority mutation;
- gate suite fails on every selected non-pass or missing execution;
- diagnostic suite distinguishes `completed_with_findings` from nonzero
  contract/infrastructure/accounting failure;
- exact aggregate counts and role/freshness fields are tested;
- parent acceptance and claimed-ID digests bind authority to the exact run;
- registration rejects an under-budget timeout before fake executor invocation;
- fake-backed command smoke proves selection, exit semantics, and aggregate
  creation through the owned CLI surface;
- fake backends remain labeled plumbing only.

Checkpoint CP5: prove the selection/reporting surface with isolated v3 fixtures.
Commit only pieces that do not activate v3 against the unmigrated corpus; the
authoritative command surface switches in Slice 5.

## Slice 5: Scenario Validity, Migration, And Disposition

Sources: R1-R9 and R24-R31; proof expectations 1, 9, and 10.

Write surfaces:

```text
tests/<plugin>/<skill>/scenarios/*.md
tests/test-utils/skill-pressure/config/legacy-scenario-migration.yaml
tests/test-utils/skill-pressure/config/scenario-evaluation-registry.yaml
tests/test-utils/skill-pressure/config/authority-receipts/
tests/test-utils/skill-pressure/config/fast-scenario-manifest.yaml
tests/test-utils/skill-pressure/lib/migration/
tests/test-utils/skill-pressure/fixtures/
```

Migration rules:

1. Generate a read-only 110-row work ledger from current discovery. Preserve the
   fixed 107-row/23-owner legacy digest and identify the two post-baseline rows.
2. Add effect surfaces, semantic assertions, and behavior requirement IDs to
   every current scenario. Convert objective rubric bullets to deterministic
   checks rather than duplicating them as semantic assertions.
3. Run scenario-validity review for every row: prompt, effects, assertions,
   permissions, fixtures, and expected artifacts must agree before execution.
4. Give every valid uncalibrated row `diagnostic` role. Promote none by migration
   or prior aggregate interpretation.
5. Correct contradictory contracts, beginning with
   `debug-investigation-background-monitoring`; do not change owner skill wording
   when the scenario contract is the defect.
6. Preserve all passing no-skill controls and mixed baselines as diagnostics
   unless fresh evidence establishes the declared truth table. Do not relabel
   them non-regression without immutable previous revision.
7. Permit owner-disjoint scenario edits in parallel only after schema freeze.
   Each owner batch produces static schema, validity, and requirement-ID
   receipts. The parent alone edits the central evaluation registry, verifies
   every batch receipt, and reduces disputes by requirement ID.
8. Retirement remains user-authorized. No retirement is planned by default.
9. Extend migration proof to report legacy 107, current 110, roles, validity,
   calibration state, and per-owner covered/uncovered behavior IDs.
10. Add an explicit forbidden legacy-surface denylist covering the old scenario
    tree/schema/parser, response-regex or self-report oracle, legacy shell
    authority, and competing runner/reducer/entrypoint. Fixture-injected red
    tests restore each forbidden surface and must fail migration proof.
11. Atomically cut over the v3-only loader, generated schema, parent-owned
    registry, all 110 owner scenarios, and denylist proof. No checkpoint may
    leave the authoritative loader unable to discover the committed corpus.

Local Gate B:

```bash
pnpm --dir tests/test-utils/skill-pressure run schemas:check
pnpm --dir tests/test-utils/skill-pressure run typecheck
pnpm --dir tests/test-utils/skill-pressure run test:unit
pnpm --dir tests/test-utils/skill-pressure run test:mutation
pnpm --dir tests/test-utils/skill-pressure run test:authority
pnpm --dir tests/test-utils/skill-pressure run test:integration
pnpm --dir tests/test-utils/skill-pressure run test:smoke
pnpm --dir tests/test-utils/skill-pressure run test:migration
git diff --check
```

Checkpoint CP6: one atomic commit switches the complete v3 corpus, loader,
schema, explicit diagnostic registry, and legacy absence proof. No live
behavioral authority is claimed yet.

## Slice 6: Focused Calibration And Live ACPX Gates

Sources: R5-R9, R14, R21-R28, R31; proof expectations 5-11.

This slice is serial and receipt-gated by scenario. Within each comparison, the
three baseline subjects run concurrently, then the three treatment subjects run
concurrently, then one reviewer runs. Under this topology, calibration of one
improvement, one non-regression, and one high-risk comparison costs 21 model
prompts before retries. A dry-run execution-graph receipt must
derive the selected count; prose estimates do not authorize spend.

### Preflight

1. Verify global ACPX, Codex adapter, and Claude adapter versions.
2. Verify Luna/high subject/standard-review identity and exact
   `claude-opus-4-7`/xhigh high-risk identity in the same relationship that will
   execute each review.
3. Record candidate scenario, behavior contract digest, baseline policy/source,
   runner-semantics digest, profiles, deadline plan, and expected comparison
   class before treatment runs.
4. Confirm each candidate's objective-check families have mutation coverage and
   its registry row has a valid scenario review.
5. Require an explicitly accepted maximum model-prompt, ACPX-command, retry, and
   usage budget before focused, standard, high-risk, or diagnostic execution.
   Preflight fails before launch when the selected execution graph exceeds any
   cap; no command launches after exhaustion.

### Focused Calibration Order

1. Improvement candidate:
   `orchestrator-goal-artifact-content-boundary`.
   It must produce three baseline failures and three treatment passes under the
   v3 contract. An all-passing or mixed baseline remains diagnostic.
2. Non-regression candidate:
   `skills-creation-reference-lane-non-regression` pinned to its existing full
   previous revision. Both sides must pass three times.
3. High-risk candidate order:
   - first `ops-security-review-official-scan` after deadline repair;
   - fallback `peekaboo-progressive-disclosure` only if the first fails
     calibration for behavior rather than infrastructure;
   - final fallback `orchestrator-goal-default-pr-ready-terminal` when the first
     two candidates cannot establish a stable improvement baseline.
   A mixed or all-passing baseline remains diagnostic. Do not use the prior
   focused/concurrent disagreement as authority. If no listed candidate
   calibrates, release authority and PR-ready completion are blocked.

### Promotion And Suite Gates

1. Parent-inspect all repetitions, objective facts, assertion classifications,
   usage, profiles, attempt receipts, cleanup, and aggregate outcome.
2. Create parent-accepted calibration receipt, then promote the qualifying row
   in a separate registry change. Rerun focused gate selection to prove the
   promoted snapshot.
3. Run standard gate suite, then high-risk gate suite. These suites select only
   fresh gates; diagnostics are not silently included.
4. Run the diagnostic calibration command only when its cost is explicitly
   accepted for the current checkpoint. Behavioral findings do not block unless
   selected for scenario remediation, but infrastructure/missing execution does.
5. Report exact calls, retries, outcomes, roles, and covered/uncovered behavior
   requirement IDs against the preaccepted caps. Do not extrapolate coverage to
   unrelated skills.

Live receipt acceptance requires six unique repositories and sessions per
comparison, equal common-input fingerprints, correct source digests, exact
requested/provider-reported profiles, complete attempt/cleanup receipts,
assertion-level review, strict parse, intent outcome, authority snapshot, and
bounded/redacted evidence.

Checkpoint CP7: commit one current baseline receipt per calibrated scenario and
registry corrections justified by fresh receipts. Raw
transcripts, attempt receipts, and secrets remain under ignored `tmp/` and are
not committed.

Split/replan triggers:

- provider unavailability: continue independent local work, but do not promote;
- mixed baseline/treatment: retain diagnostic and revise pressure only when the
  requirement needs a stable gate;
- deadline/cancellation loses cleanup evidence: return to Slice 3;
- reviewer profile/parse/isolation failure: return to Slice 2;
- no high-risk candidate calibrates: stop release-authority claim and return to
  scenario design rather than weakening reduction.

## Slice 7: Documentation, Review, And PR Readiness

1. Reconcile the existing uncommitted runner README and changelog changes with
   current behavior; do not overwrite or discard them.
2. Document v3 contracts, authority registry, gate versus diagnostic commands,
   receipt locations, cost boundaries, and honest limits.
3. Keep plugin version/marketplace changes not applicable unless shipped plugin
   behavior changes. Do not refresh home caches.
4. Emit the dependency acceptance receipt with resolved schema, reducer,
   artifact-scoping, focused-gate, registry, deadline, and PR anchors.
5. Run the complete local proof stack and freshly report command exits/counts.
6. Run `implementation-review-swarm`; parent-verify and address or explicitly
   reject every accepted finding through `implementation-execute-plan`.
7. After every accepted review fix, rerun affected lower proof layers and every
   calibration/gate suite invalidated by changed behavior, runner, profile, or
   authority digests. Bind the final aggregate receipt and local proof to the
   exact commit that will be pushed.
8. Commit verified fixes, push the branch, and use
   `implementation-pr-wrapup` to open/update the PR and report checks, comments,
   unresolved threads, mergeability, and current head SHA.
9. Require final local/live receipts and PR checks to name the same head SHA.
   Any later tracked edit loops back through commit, affected proof, and fresh
   PR-state verification.
10. Stop PR-ready and unmerged. Merge requires separate authorization.

## Requirements/Proof Matrix

| Requirement | Source | Owning slice | Proof modality/layer | Evidence and freshness | RED/GREEN | Sized to pass |
| --- | --- | --- | --- | --- | --- | --- |
| v3 behavior contract and hidden criteria | R1-R4 | 1 | unit/schema | current serializer/schema digest | yes | yes |
| authority outside behavior identity | R2, R24-R27 | 1, 4 | unit/integration | registry + behavior digest snapshot | yes | yes |
| honest pair identity and intents | R5-R9 | A, 4, 6 | unit/live e2e | three/three receipts and pair fingerprint | yes | yes |
| project isolation and exact ACPX profiles | R10-R14 | A, 6 | integration/live | repos, source digests, provider reports | yes | yes |
| named-artifact/objective correctness | R15-R17 | 2 | mutation/integration | complete-content and mutation receipts | yes | yes |
| durable attempts and cancellation | R18-R19 | 3 | integration | attempt paths, cleanup, last stage | yes | yes |
| assertion review, parent acceptance, and precedence | R20-R23 | 2, A, 4 | unit/integration/live | strict review + digest-bound acceptance + objective facts | yes | yes |
| gate/diagnostic authority and freshness | R24-R27 | 1, 4, 6 | unit/integration/live | current baseline pointer + calibration | yes | yes |
| requirement traceability | R28 | 1, 4, 5 | schema/report/live | claimed-ID input digest + covered/uncovered IDs | yes | yes |
| 107 legacy and 110 current accounting | R29-R31 | 5 | migration/absence | immutable map + current discovery + denylist mutations | yes | yes |
| exact aggregate authority counts | R32 | 4 | unit/smoke/live | aggregate receipt and selected set | yes | yes |
| calibrated release-authoritative minimum | proof 5-11 | 6 | live e2e | improvement, non-regression, high-risk gates | yes | yes |
| reviewed PR-ready unmerged delivery | goal terminal | 7 | review/PR | current head, checks, threads, mergeability | no | yes |

No red/green exceptions are authorized.

## Security And Reliability

- Treat model response/tool/artifact evidence as untrusted data.
- Validate normalized relative paths and reject links, traversal, and ambiguous
  artifact ownership.
- Redact before persistence and keep credentials out of fixtures.
- Scan persisted receipt bytes with seeded split-chunk secrets before accepting
  receipt publication tests.
- Keep hidden assertions, expected outcomes, and authority state unavailable to
  subjects.
- Preserve exact model/profile verification and strict review parsing.
- Use runner-owned cancellation plus per-command process-group cleanup.
- Larger Vitest timeouts are emergency containment, not process supervision.
- Authority changes are parent-reviewed current-state replacements and unable
  to rewrite the raw run evidence.
- Recovery reads durable receipts for reporting only; it never resumes partial
  comparison evidence.

## Commit And Recovery Rhythm

- CP1: v3 contract/registry interfaces proven; only additive non-authoritative
  primitives may commit before corpus cutover.
- CP2/CP3: evidence-review and durable-execution primitives may commit
  independently only when they preserve the current authoritative path.
- CP4: reachable integrated v3 runner proven on isolated fixtures; no early
  authoritative cutover.
- CP5: authority, selection, and reporting proven on isolated fixtures; no
  early authoritative command switch.
- CP6: atomic v3 loader/schema/registry/110-scenario/absence-proof cutover.
- CP7: calibrated gates and tracked live corrections.
- Final: docs, review fixes, and PR-ready head.

Do not amend, rebase, force-push, merge, restore legacy authority, or mutate home
caches. Preserve unrelated dirty files. If a checkpoint fails, keep the last
verified commit and use receipts to re-enter at the failed slice; do not weaken
proof to preserve schedule.

## Open Questions

None. Implementation details such as exact internal type names may follow the
repo's conventions, but they may not change the accepted ownership, authority,
comparison, or proof contracts.

## Plan Completion Receipt

phase_result: complete
evidence: accepted 593-line spec; current code inspection; three high-effort read-only planning lanes; three adversarial review lanes; parent-verified remediation; focused ACPX Claude Opus review passing all 14 closure checks
recommended_next_workflow: `shravan-dev-workflow:implementation-execute-plan`
recommended_transition_reason: The accepted plan closes the authority persistence, manifest closure, parent acceptance, queue-aware deadline, atomic migration, cost-bound, and final-head proof gaps and is ready for execution from Gate 0.
