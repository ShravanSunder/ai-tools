# Skill Pressure Judge System Implementation Plan

Status: accepted

Source: `docs/specs/2026-07-10-skill-pressure-judge-system-spec.md`

Goal: replace the flat self-grading pressure runner with one Vitest Evals system
that owns recursive skill scenarios, authentic model behavior, deterministic
evidence, independent semantic judgment, fail-closed reduction, and inspectable
proof.

## Scope

- Replace `tests/skills/` with the standalone
  `tests/test-utils/skill-pressure/` package.
- Move 107 active scenarios into 23 `tests/<plugin>/<skill>/` owners.
- Preserve Vitest Evals as the only behavior runner.
- Prove standard and high-risk semantics, paired baseline/treatment causality,
  and separate installed-plugin release smoke.

Non-goals: compatibility discovery/reducers, live destructive external actions,
direct judge repository access, a replacement eval framework, unrelated skill
rewrites, or PR merge.

## Security Context

Applicable. The system handles untrusted model text, filesystem paths,
subprocesses, local raw artifacts, repository source, environment values, and
external Claude transport. All model output is untrusted. Shared TypeScript
owners decide source closure, risk, evidence, calibration, and reduction.

## Capability Gate 0

Before runtime implementation claims:

1. Prove a disposable Codex subject can expose only a materialized target-skill
   closure plus neutral harness files, while still emitting observable load/read
   evidence. Record the exact CLI/config shape and a sentinel ambient-instruction
   rejection receipt.
2. Define one typed ACPX launch profile and prove it can launch a currently advertised Claude Opus model at high
   reasoning with deny-all, no terminal, non-interactive failure, empty cwd,
   explicit environment allowlist, empty MCP configuration, no allowed tools,
   disabled or isolated user settings/resources, packet-only input, bounded
   timeout, structured output, and resolved capability evidence. Poison ambient
   Claude instructions/settings and attempt a forbidden tool/resource read; the
   poison must not affect output and the read must be denied. Malformed output
   maps to `infrastructure_error`.
3. If either capability cannot be proven, stop the affected runtime slice and
   return to spec/plan review. Do not create a weaker fallback that can green.
4. Installed-plugin smoke that mutates home caches remains deferred until an
   explicit post-push/release authorization.

## Vertical Slices

### S1. Contracts, Package, And Discovery

Source: R1-R5; repository layout; proof expectation 1.

Behavior: create the standalone package, versioned YAML/JSON schemas, recursive
owner-aware discovery, global-ID selection, and complete discovery receipt.

Likely writes:

- `tests/test-utils/skill-pressure/package.json`
- `tests/test-utils/skill-pressure/pnpm-lock.yaml`
- `tests/test-utils/skill-pressure/tsconfig.json`
- `tests/test-utils/skill-pressure/vitest.config.ts`
- `tests/test-utils/skill-pressure/lib/contracts/`
- `tests/test-utils/skill-pressure/lib/discovery/`
- `tests/test-utils/skill-pressure/schemas/`

Tasks:

1. Add RED schema tests for path/manifest mismatch, duplicate IDs, external
   owner handling, malformed criteria/artifacts/baselines, and invalid source
   closure roots.
   Include declared cross-skill dependency, undeclared edge, cycle, symlink,
   submodule, missing owner, and historical-revision fixtures.
2. Add RED discovery tests for recursive ordering, selected/skipped/invalid
   receipts, and an unmapped migration ID.
3. Implement typed contracts with direct YAML dependency and deterministic
   digests.
4. Implement recursive discovery rooted at `tests/`, excluding `test-utils`
   and non-scenario trees by structural contract rather than filename guesses.
5. Build and review an initial 23-owner base-risk inventory with R30 rule IDs;
   scenarios may raise but never lower each owner's baseline risk.

Checkpoint CP1: fixture-tree and live-tree discovery are deterministic; package
typecheck/unit tests pass; no runtime model code is required.

### S2. Controlled Primary And Fact Collection

Source: R6-R19; proof expectations 3-5.

S2a source-isolated primary:

- materialize target closure and neutral instructions in a private disposable
  root;
- resolve current and historical source graphs from the classifier-selected Git
  tree-ish using regular-file blobs only; recursively follow manifest-declared
  same-skill and cross-skill dependency edges, reject undeclared edges,
  symlinks, submodules, cycles, and paths outside skill owners, and receipt
  owner/path/blob/digest mappings without consulting current-worktree files for
  a historical baseline;
- render only the operator prompt plus neutral safety context;
- return normal visible text, never a self-grade schema;
- supervise the process group with bounded TERM/KILL cleanup and drained streams.

S2b response/process/trace collector:

- normalize Codex JSONL into process, sandbox, skill-load, tool, provenance, and
  bounded evidence facts;
- stream-redact before any persistence or transport;
- use private unique run roots, retain only redacted artifacts and safe digests,
  delete transient unredacted buffers at process completion, and record a
  retention/cleanup receipt.

S2c workspace/artifact collector:

- enforce canonical fixture containment;
- reject traversal, symlink, and hard-link escape before launch;
- detect link/traversal escape created during execution and verify a
  harness-owned sibling sentinel's digest, type, and mode remain unchanged;
- capture pre/post snapshots and write attempts;
- validate actual artifact type, location, digest, content, and schema.

Checkpoint CP2: one response fixture and one workspace fixture produce complete
fact packets; ambient source, unexpected writes, malformed artifacts, timeout,
or missing required facts cannot pass.

CP2 regression fixtures include a descendant that holds stdout/stderr across
timeout/cancellation; proof requires process-group termination, stream EOF, no
live descendants, and a cleanup receipt before owned-root removal. A seeded
secret must be absent from every retained run file, fact packet, report, and
judge packet.

S2d controlled external-effect traces:

- require manifests for skills whose production behavior mutates external
  systems to select a controlled adapter or trace fixture;
- reject direct egress/action attempts;
- collect the intended external effect as a deterministic trace fact without
  performing the live action.

### S3. Risk, Judges, Reduction, And Reporting

Source: R20-R32 and R37-R45; proof expectations 2 and 7-11.

S3a risk classifier:

- consume comparison revision plus tracked/untracked change inventory;
- classify reachable skill/harness surfaces with provenance and policy digest;
- own new/changed/unchanged baseline mode; fail high on stale or incomplete
  input.

S3a also owns one versioned `judge-policy` contract that maps effective risk and
semantic criteria to required judge roles. Codex/ACPX adapters and the reducer
consume it; no adapter may independently choose or weaken required lanes.

S3b deterministic reducer:

- RED-test all five outcomes and precedence cells;
- deterministic failures override judges;
- missing facts/calibration/required judges are non-green;
- high-risk disagreement is inconclusive;
- fake backend is always `not_evaluated`.

S3c Codex judge and calibration:

- build provider-neutral packets from bounded facts and hidden criteria;
- run one-shot in a separate context;
- validate structured criterion receipts;
- calibrate pass, fail, insufficient, injection, and deterministic-conflict
  gold packets.
- validate calibration receipts against judge family, resolved model, effort,
  prompt, parser, rubric, envelope schema, corpus, and adapter versions; mutate
  every key in tests and require `infrastructure_error` on mismatch.

S3d ACPX Claude judge and calibration:

- use only the Gate 0 verified Opus/high packet-only adapter;
- consume the identical packet digest as Codex;
- map timeout, permission, malformed, unavailable, and capability mismatch to
  infrastructure error.

S3e reporter/redaction:

- preserve trusted facts, untrusted excerpts, judge/calibration receipts,
  reduction, usage, provenance, and local raw-artifact pointers separately;
- never serialize secrets or raw reasoning into outside packets.

Checkpoint CP3: pure reducer matrix passes; both judge families pass calibration;
one standard and one high-risk live semantic case produce inspectable receipts.

### S4. Paired Baseline/Treatment Causality

Source: R33-R36; proof expectation 6.

Tasks:

1. RED-test classifier-selected no-target versus immutable pre-change closure
   construction and receipt invalidation.
2. Implement separate disposable baseline/treatment environments.
3. Build and validate a `PairInputFingerprint` covering primary model,
   reasoning, neutral instructions, fixture, operator prompt, judge policy, and
   all source-independent controls; reject any baseline/treatment mismatch and
   record the fingerprint in the receipt.
4. Implement two paired trials where every named target criterion baseline-fails
   for its declared reason and treatment-passes; mixed results are inconclusive.
5. Use the representative migrated `manage-agents` high-risk scenario after S5a.

Checkpoint CP4: a real changed-skill receipt proves two current paired RED/GREEN
trials with all relevant digests; fake or stale receipts cannot satisfy it.

### S5. Scenario Ownership Migration

Source: R3-R5; hard-cutover layout and migration contract.

S5a inventory and representative cases:

- freeze the 107 active legacy IDs and 23 owners;
- add an old-ID to new-path/retirement migration receipt;
- record the reviewed 23-owner base-risk inventory and R30 reasons in the
  migration receipt;
- migrate representative response, workspace, standard semantic, and
  `manage-agents` high-risk semantic scenarios first.

S5b plugin batches:

- migrate each skill into `tests/<plugin>/<skill>/skill-eval.yaml` and
  `scenarios/`;
- translate regex/self-grade expectations into typed deterministic/semantic
  criteria;
- add fixtures only where execution mode requires them;
- keep each batch's write scope confined to its owning skill directory.

Checkpoint CP5: every legacy ID maps exactly once or has an explicit approved
retirement; full-tree discovery reports no orphan, duplicate, or invalid owner.
Structural migration alone is not behavior green.

### S6. Hard Cutover And Release Smoke

Source: R1-R2, R9, R42-R45; proof expectation 12.

S6a command/docs cutover:

- create the single runner under `tests/test-utils/skill-pressure/`;
- update `AGENTS.md`, `skills-creation/references/pressure-testing.md`, current
  plugin docs/changelog, and non-historical live references;
- delete `tests/skills/`, including the legacy shell reducer, regex oracle,
  self-grade schema, flat scenarios, and alternate command;
- prove no dual discovery or reducer remains.

S6b installed-plugin smoke:

- after explicit cache-mutation authorization, verify installed plugin name,
  version, expected/installed source digest, discovery, and load evidence;
- report the smoke beside causal behavior receipts, never inside reduction.

Checkpoint CP6: fresh CP4 causal and CP5 migration receipts are mandatory;
authoritative command passes required unit/integration/live eval gates;
installed smoke is separately proven or explicitly deferred as a release
blocker; old layout is absent.

## Requirements/Proof Matrix

| Requirement / claim | Source | Owner | Proof source and layer | Evidence source | Freshness guard | RED/GREEN |
| --- | --- | --- | --- | --- | --- | --- |
| One Vitest runner and recursive ownership | R1-R5, E1 | S1/S5/S6 | Unit schemas + integration live discovery + cutover receipt | Parent-run Vitest and inventory artifact | tree/schema/manifest digests | Required |
| Authentic isolated primary and invocation | R6-R10, E3-E4 | S1/S2a/S2b | Unit source-graph edges + integration disposable process + live Codex smoke | process/trace/source-graph receipt | model/config/graph/event digests | Required |
| Workspace safety, artifacts, and controlled external effects | R11-R14, E5 | S2c/S2d | Unit path attacks + integration fixture writes/controlled traces + workspace smoke | snapshots/write attempts/artifact and effect-trace facts | fixture and pre/post digests | Required |
| Deterministic fact truth and bounded evidence | R15-R19, E4/E10 | S2b/S3e | Unit schema/redaction + real-event integration | fact packet and bounded excerpts | collector/schema/event digests | Required |
| Independent semantic judgment | R20-R27, E7-E9 | S3a/S3c/S3d | Unit judge-policy/envelopes + calibration + standard/high-risk live smoke | policy/judge/calibration/capability receipts | packet/model/effort/prompt/parser/rubric/envelope/corpus/adapter digests | Required |
| Fail-closed changed-surface risk | R28-R32, E9 | S3a | Unit policy table + Git/worktree integration + high-risk smoke | classifier receipt | revision/worktree/policy/reachability digest | Required |
| Causal paired comparison | R33-R36, E6 | S2a/S4 | Unit invalidation/fingerprint + historical Git-blob closure integration + two live pairs | closure and baseline/treatment receipts | pair fingerprint plus all scenario/model/source/judge digests | Required |
| Deterministic outcomes and fake boundary | R37-R41, R45, E2/E11 | S3b | Table-driven unit matrix + integration reduction | reduction receipt | reducer and consumed receipt digests | Required |
| Provenance, calibration, reporting | R42-R44, E7/E10 | S3c-S3e | Unit invalidation + reporter integration | run/report artifacts | configuration and artifact digests | Required |
| Installed distribution wiring | R9, E12 | S6b | Install/discovery/load smoke | installed-plugin smoke receipt | installed version/source digest | Required for release; explicit authorization gate |

E1-E12 refer to the numbered Proof Expectations in the accepted spec.

## Execution DAG

```text
gate 0: Codex source isolation + ACPX Opus/high capability receipts
  |
S1 contracts/package/discovery
  |
  +-- S2a isolated primary ---- S2b response collector --+
  +-- S2c workspace/artifacts ---------------------------+--> CP2
  +-- S3a risk classifier -- S3b reducer ----------------+
  +-- S5a inventory + representative scenarios ----------+
  |
fact-packet contract frozen
  +-- S3c Codex judge/calibration
  +-- S3d ACPX judge/calibration
  +-- S3e reporter/redaction
  |
CP3 -> S4 paired causality -> CP4
  |
  +-- S5b per-plugin migration batches
  |
CP4 + CP5 -> S6a hard cutover -> full validation -> implementation-review-swarm
  |
S6b authorized installed smoke -> implementation-pr-wrapup
```

Parallel work is allowed only for disjoint files after the shared contracts are
frozen. Package metadata, schemas, migration receipt, final runner, and legacy
deletion are parent single-writer surfaces.

## Validation Gates

The standalone package must expose stable scripts and receipt directories under
`tmp/skill-pressure-evals/<run-id>/`:

1. Unit: `pnpm --dir tests/test-utils/skill-pressure test:unit`.
2. Typecheck: `pnpm --dir tests/test-utils/skill-pressure typecheck`.
3. Capability: `pnpm --dir tests/test-utils/skill-pressure gate0`; nonzero on
   missing isolation/Opus capability, writes capability receipts.
4. Integration: `pnpm --dir tests/test-utils/skill-pressure test:integration`;
   covers filesystem, Git blobs, process groups, event normalization, controlled
   external traces, adapters, and reporting.
5. Calibration: `pnpm --dir tests/test-utils/skill-pressure calibrate`; nonzero
   on any stale/missing family receipt.
6. Live standard: `pnpm --dir tests/test-utils/skill-pressure eval:standard`.
7. Live high risk: `pnpm --dir tests/test-utils/skill-pressure eval:high-risk`
   using `manage-agents` and fail-closed negative cases.
8. Paired behavior: `pnpm --dir tests/test-utils/skill-pressure eval:paired`;
   requires two discriminating pairs and matching input fingerprints.
9. Full migration/evaluation: `pnpm --dir tests/test-utils/skill-pressure eval:full`;
   requires fresh CP4 receipt and complete 107-ID/23-owner receipt.
10. Static/plugin docs validation when metadata changes: JSON parsing, Codex skill
   validator where applicable, and `claude plugin validate .`.
11. Implementation review, then fresh PR checks/comments/threads/mergeability.

Exact script flags and test filenames may be refined during implementation, but
no proof layer may be removed or relabeled.

## Recovery And Split Triggers

- Keep work under the new package until S6a; do not make old and new runners
  simultaneously authoritative.
- If response and workspace isolation cannot share one runner safely, split
  their adapters while preserving one fact contract.
- If Opus/high capability cannot be confirmed, high-risk evaluation remains
  infrastructure error and the goal is not PR-ready.
- If a migrated scenario cannot be translated without changing product meaning,
  record it as an explicit planning blocker; do not silently retire it.
- On timeout/cancellation, kill the process group, drain streams, preserve a
  bounded cleanup receipt, and remove only harness-owned disposable roots.
- Persist only stream-redacted artifacts under private harness-owned roots;
  transient unredacted buffers are deleted at process completion. Any retained
  sentinel secret blocks CP2 and all later gates.

## Plan Completion Receipt

phase_result: complete
evidence: docs/plans/2026-07-10-skill-pressure-judge-system-implementation.md
recommended_next_workflow: shravan-dev-workflow:plan-review-swarm
recommended_transition_reason: The accepted spec is mapped to vertical slices, a requirements/proof matrix, security constraints, and an execution DAG.
