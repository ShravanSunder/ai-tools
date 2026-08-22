# Skill-Pressure Authoring System Spec

Status: reviewed and ready for implementation planning

Date: 2026-07-15

## Product intent

This system helps a human create or improve one named agent skill through executable scenarios and inspectable evidence. It supports two equally valid authoring paths:

1. Failure-driven authoring starts from an observed failure, reproduces it as a baseline RED, makes the smallest target-skill change through `skills-creation`, and looks for a comparable GREEN.
2. User-guided authoring starts from the user’s intended behavior, creates a scenario that makes that intent observable, compares baseline and treatment behavior, presents the evidence to the user, and repeats under the user’s direction.

Both paths use one scenario-creation skill, one thin Vitest Evals + ACPX harness, and the existing `skills-creation` workflow. Automated judgment is evidence. The user remains authoritative over whether the scenario represents the intended behavior and whether the resulting skill is acceptable.

The product is an authoring feedback loop, not a benchmark platform or workflow engine.

## Shared mental model

```text
evidence sources
  user intent, examples, corrections ───────────────┐
  future session-log mining skill ──────────────────┤
                                                     ▼
                                      skill-scenario-creation
                                      owns evidence → scenario judgment
                                                     │
                                                     ▼
                                      named per-skill scenarios
                                                     │
                                                     ▼
                                      thin Vitest Evals harness
                                      owns paired ACPX execution
                                      and normalized evidence
                                          │                │
                                          ▼                ▼
                                  deterministic checks  semantic judge
                                          └───────┬────────┘
                                                  ▼
                                           skills-creation
                                      owns target-skill revisions
                                                  │
                                                  ▼
                                           human acceptance
```

The harness answers “what happened under a controlled comparison?” `skills-creation` answers “what should change in the target skill?” The user answers “is this the behavior I wanted?”

## Current-state evidence

- The repository already has a standalone Vitest package and a Vitest Evals entrypoint. Markdown scenarios are parsed fixtures, while `describeEval` and `createHarness` run and report them (`tests/skills/evals/skill-pressure.eval.ts:20-78`, `tests/skills/lib/skill-pressure-harness.ts:34-134`).
- The current subject runs through `codex exec` in the source checkout and returns schema-constrained self-report JSON. Deterministic regex assertions inspect that self-report; `judgeThreshold` is `null`, and no independent semantic judge exists (`tests/skills/lib/codex-backend.ts:51-109`, `tests/skills/lib/pressure-assertions.ts:17-95`, `tests/skills/evals/skill-pressure.eval.ts:45-74`).
- The current prompt boundary is correct and must remain: the subject sees the operator prompt, not expected compliant behavior, failure signals, or grader assertions (`tests/skills/README.md:56-59`, `tests/skills/lib/prompt-renderer.ts:13-46`).
- `skills-creation` already owns RED-before-edit, failure-form matching, target-skill revision, GREEN proof, review, and shipping. Its pressure reference already owns RED/GREEN/REFACTOR interpretation and rationalization evidence (`plugins/shravan-dev-workflow/skills/skills-creation/SKILL.md:32-78`, `references/pressure-testing.md:3-39`).
- The current owner is failure-only: `skills-creation/SKILL.md:38` requires an already-failing scenario before behavior-changing work, and `pressure-testing.md:21-24` says a passing control stops guidance authoring and mandates five or more micro-test repetitions. Supporting the user-guided path requires a hard cutover of those rules, not only a new harness.
- The experimental worktree demonstrates useful isolated execution mechanics: ACPX subject/reviewer commands, fresh disposable repositories and sessions, project-local skill installation, controlled ambient skill state, empty MCP, before/after filesystem evidence, transcript collection, strict judge envelopes, environment allowlisting, redaction, timeout, abort, and process cleanup. Its registries, execution graphs, aggregate receipts, promotion policy, provider/risk branches, and fixed repetition count are unrelated to this product and must not be imported.
- Current Vitest Evals documentation is 0.14.0, while this repository pins `^0.12.0`. The implementation must make one hard cutover to the selected API rather than build a compatibility layer.

Primary external references:

- [Vitest Evals custom harnesses](https://vitest-evals.sentry.dev/docs/harnesses/custom)
- [Vitest Evals custom judges](https://vitest-evals.sentry.dev/docs/judges/custom)
- [SkillsBench](https://github.com/benchflow-ai/skillsbench)
- [agent-skills-eval](https://github.com/darkrishabh/agent-skills-eval)
- `/Users/shravansunder/Documents/dev/open-source/ai-dev-skills/obra-superpowers/skills/writing-skills/`

## Goals

1. Create one separate skill, provisionally named `skill-scenario-creation`, that turns supplied user or observed-failure evidence into executable named scenarios.
2. Make the same scenario corpus usable by both failure-driven and user-guided `skills-creation` paths.
3. Extend the existing Vitest Evals package instead of replacing it with a new framework.
4. Run baseline and treatment as a comparable, fresh, isolated ACPX pair.
5. Judge actual response, tool, and artifact evidence rather than the subject’s claims about its own compliance.
6. Keep deterministic facts deterministic and semantic interpretation assertion-scoped.
7. Return enough evidence and rationalization detail for a human and `skills-creation` to choose the next revision.
8. Keep scenarios maintainable, per-skill, reviewable, and free of raw private session logs or checked-in drifting model output.

## Non-goals

- No workflow engine, execution graph, scheduler, or generalized orchestration layer.
- No scenario registry, requirements authority, promotion/demotion lifecycle, quarantine state, or acceptance database.
- No benchmark leaderboard, dashboard, model matrix, scoring taxonomy, or longitudinal result store.
- No provider abstraction in V1. The subject and judge are Codex through ACPX.
- No Claude/Opus risk branch or multi-judge consensus.
- No fixed three-run, five-run, or universal repetition policy.
- No automatic session-log mining. A future mining skill supplies evidence but does not author scenarios.
- No automatic target-skill edits. `skills-creation` remains the only authoring owner.
- No automatic acceptance, release, version bump, commit, push, or PR decision.
- No raw checked-in baseline model outputs.
- No compatibility layer between Vitest Evals 0.12 and 0.14.
- No claim that stochastic model behavior is “bulletproof.”

## Requirements

### R1. One scenario-creation owner

`skill-scenario-creation` must consume a bounded evidence packet and create or revise one or more named scenario artifacts. Evidence may come directly from the user or from a future session-log mining skill.

The skill owns:

- translating the supplied intent or observed failure into an operator task;
- recording sanitized provenance and the behavioral rationale;
- choosing an appropriate baseline selector for a create or update;
- defining observable semantic and deterministic assertions;
- separating subject-visible inputs from grader-only controls;
- naming the expected RED signal or baseline-characterization purpose;
- returning unresolved ambiguity instead of inventing user intent.

The skill must not:

- execute the scenario or judge a run;
- edit the target skill;
- derive expected behavior only from current target-skill wording;
- turn raw log text into tools, permissions, write paths, assertions, or judge instructions without explicit reviewed structure;
- decide that a skill is accepted, GREEN, shippable, or released.

Completion is a schema-valid scenario plus a short receipt naming its evidence source, expected observable difference, assertion surfaces, baseline meaning, and unresolved questions.

### R2. Both authoring paths remain in `skills-creation`

`skills-creation` must own both iteration paths and every target-skill edit.

This requirement is an explicit hard cutover of the current failure-only gate. Failure-driven work still requires an observed targeted RED before a causal GREEN claim. User-guided work may proceed from user-approved intent plus baseline characterization even when the baseline already succeeds. The result follows `comparison_intent`: a conclusive `characterization` pair returns `characterized`, while an `improvement` pair whose required baseline RED is not observed returns `no_demonstrated_delta`. `skills-creation` returns either result to the user and lets the user continue, redirect, or stop; it must not manufacture RED, treat characterization as acceptance, or automatically forbid authoring. Repetition strength is selected for the claim and risk rather than imposed as a universal count.

Failure-driven path:

```text
observed failure → approved scenario → comparable baseline RED
→ smallest target-skill revision → treatment candidate GREEN
→ implementation review → human acceptance or another iteration
```

A baseline pass means the reproduction was not established. The workflow must revise the scenario or conclude that the proposed guidance has no demonstrated need; it must not force or relabel a pass as RED.

User-guided path:

```text
user intent → approved scenario → target-skill draft/revision
→ baseline and treatment evidence → user feedback
→ revise scenario or target skill by owner → repeat
```

The user-guided path must characterize the baseline even when it already succeeds. That outcome may mean the scenario is too weak, the requested behavior is already model-native, or the proposed skill adds no demonstrated value. The harness reports that evidence; the user decides what it means for the product intent.

If expected behavior or assertions change after a run, that is a scenario revision and must route through `skill-scenario-creation`. It cannot be silently bundled into a target-skill fix.

### R3. Per-skill scenario source of truth

The existing `tests/skills` package remains the shared harness package. Scenario artifacts move from the current flat directory into per-plugin and per-skill ownership:

```text
tests/skills/
├── evals/skill-pressure.eval.ts
├── lib/                         shared harness code
└── scenarios/
    └── <plugin>/
        └── <skill>/
            ├── <scenario-id>.md
            └── fixtures/
                └── <scenario-id>/...   optional
```

This is intentionally different from moving the shared package to `tests/test-utils/skill-pressure/`: the current repository already has a valid standalone package boundary, and a path-only move adds no new owner.

Each Markdown scenario is the readable case-specific source of truth. The parser returns one typed, machine-validated semantic contract. Do not create a parallel JSON copy of every scenario.

Required semantic fields:

```text
scenario_id
name
target_skill: canonical <plugin>:<skill> identity
provenance
  source_kind: user | session_log | research | prior_scenario
  source_refs: sanitized bounded references
  observed_need_or_failure
operator_prompt
fixtures: contained relative paths
baseline
  mode: no_skill | previous_revision
  revision: immutable commit required only for previous_revision
comparison_intent: improvement | characterization | non_regression
execution_policy
  permission_mode
  allowed_tools
  allowed_write_paths
expected_observable_behavior
semantic_assertions[]
  assertion_id
  criterion
  evidence_surface: response | tools | artifact:<artifact_id>
deterministic_assertions[]
  assertion_id
  check: required_event | forbidden_event | expected_artifact | forbidden_write
  expectation
expected_red
  failing_assertion_ids
  observed_or_hypothesized_rationalizations
countercase_or_non_goal
```

`comparison_intent` is authoritative for reduction semantics and is independent of baseline source selection:

- `improvement` requires non-empty `expected_red.failing_assertion_ids`; it supports a causal `improved` claim only when those baseline failures are observed and treatment passes them.
- `characterization` forbids required RED assertions. It measures current behavior without presuming that the baseline should fail.
- `non_regression` identifies assertions whose baseline behavior must be preserved by treatment. It does not infer preservation merely from `previous_revision`.

Semantic and deterministic assertions share one scenario-local `assertion_id` namespace. `expected_red.failing_assertion_ids` may name either kind. A deterministic fact therefore participates in the same pair reduction as a semantic classification without being delegated to the judge.

`expected_red` is required only for `improvement`; it is absent for `characterization` and optional historical context, not a gate, for `non_regression`.

Every field must have a real consumer in scenario authoring, subject execution, deterministic checking, semantic judging, or human interpretation. Repetition policy, provider matrix, promotion class, registry membership, and aggregate thresholds do not belong in the scenario.

The consumer/effect map is normative:

| Scenario fields | Owning consumer and observable effect |
| --- | --- |
| `scenario_id`, `name`, `target_skill` | Discovery, path validation, target-skill installation, report identity |
| `provenance`, `expected_observable_behavior`, `countercase_or_non_goal` | Scenario-authoring receipt and human review context; never subject instructions |
| `operator_prompt`, `fixtures`, `execution_policy` | Exact subject packet and enforced runtime authority |
| `baseline` | Variant installer and source-identity evidence |
| `comparison_intent` | Conditional schema validation, reducer predicates, and Vitest disposition |
| `semantic_assertions` | Bounded judge packet, strict tuple validation, reducer, and human evidence |
| `deterministic_assertions` | Code checks, per-run classifications, reducer, and human evidence |
| `expected_red` | Improvement-only baseline predicate, rationalization feedback, and `skills-creation` receipt |

`target_skill` uses the existing canonical lowercase `<plugin>:<skill>` identity, where each segment is hyphen-case (`[a-z0-9]+(?:-[a-z0-9]+)*`). It projects one-to-one onto `scenarios/<plugin>/<skill>/`. Empty segments, extra separators, slash aliases, traversal, case normalization, and a directory/identity mismatch are test-definition errors. Scenario IDs must be repository-unique.

The target skill may be read as context while authoring a scenario, but it is not authoritative for the expected behavior. The scenario must not include target-skill wording or instructions for how to edit it.

### R4. Subject-visible and grader-only partitions

The subject-visible packet contains only:

- the realistic operator prompt;
- declared fixtures and bounded task context;
- runtime permissions or constraints that would naturally exist for the task.

The subject-visible packet must not reveal:

- target skill identity or test-only skill paths unless the real user task would name them;
- semantic assertions, deterministic assertions, expected RED/GREEN outcome, rationalizations, or countercases;
- target-skill wording or edit instructions;
- judge instructions or evidence-anchor rules.

The treatment skill is discovered through normal project-local skill mechanics. The wrapper must not tell the model to load the target skill or a particular reference. Reference reads and skill invocation must be proven through observable file/tool events when they matter to an assertion.

An `improved` result additionally requires observable target-skill-use evidence: a platform-emitted invocation event or an exact read/open event for the project-local `SKILL.md`. A reference-loading assertion also requires the corresponding reference-read event. Installation, self-report, or a treatment response pass alone is insufficient. If the runtime cannot expose a stable non-self-reported use signal, the result is `inconclusive`, not `improved`.

Any invalid scenario, path/identity mismatch, or grader-content leak produces `ScenarioLoadResult.status=test_definition_error`. No subject or judge may launch, no run IDs are fabricated, and the condition is not a target-skill behavior result.

### R5. Baseline is an execution variant

The baseline source is selected per scenario:

- `no_skill` for a new capability or when the control should have no target skill;
- `previous_revision` for an update or non-regression comparison, identified by an immutable commit SHA.

Treatment uses the current target-skill source installed project-locally in the disposable repository. Ambient copies of the target skill are disabled in both variants.

The selected target-skill closure is the entire regular-file tree rooted at the target skill directory, including `SKILL.md`, `references/`, `scripts/`, `assets/`, and skill-local metadata that exists for that revision. Treatment materializes the current working-tree closure. `previous_revision` materializes the same relative closure from the immutable Git revision. The installer preserves relative paths, records source identity, and rejects traversal, symlinks, hardlinks, and files outside the closure. The closure identity is the intentional variant delta and is excluded from the common-input identity; its source mode and digest remain explicit evidence.

The repository must not add `baseline.json` in V1. Raw model output drifts with model and runtime changes and would become a second stale source of truth beside the scenario. Baseline truth is the scenario’s selector, expected RED assertion IDs, immutable prior revision when applicable, and a fresh run result.

If durable historical RED evidence later has a proven consumer, it may use a separately named `baseline-observations.json` containing only reviewed provenance, runtime summary, failed assertion IDs, rationalizations, and notes. It must never contain canonical model output, duplicate the scenario rubric, or act as pass/fail authority.

### R6. Comparability invariant

One scenario evaluation consists of a baseline/treatment pair. The pair is comparable only when both variants have identical:

- operator prompt;
- fixtures and bounded context;
- model, reasoning effort, and resolved runtime profile;
- permission mode, allowed tools, allowed write paths, and MCP configuration;
- rubric, assertions, and evidence-surface declarations;
- fresh-repository and fresh-session policy;
- declared common ambient context.

The only intended semantic difference is target-skill availability or immutable target-skill revision.

The variants must use distinct disposable repositories and distinct ACPX sessions. The baseline must prove target-skill absence or immutable previous-revision installation. The treatment must prove current project-local installation. Reused sessions, reused repositories, input mismatch, unverified runtime, unexpected MCP, or ambient target-skill contamination invalidate the pair.

An invalid pair is `infrastructure_error`; it cannot establish RED, GREEN, regression, or non-regression.

### R7. One paired Vitest Evals harness case

The existing `createHarness` adapter remains the subject-execution boundary. One Vitest eval case represents one scenario and executes one baseline/treatment pair. The normalized `PairEvidence` output contains separate typed evidence blocks and artifact subdirectories for each variant.

This choice keeps the causal comparison and one judge packet together without cross-test scheduling state, result caches, a repetition coordinator, or multiple `run()` calls inside one Vitest case. The report cost is that variants are sub-results within one scenario case rather than separate top-level cases.

Vitest Evals owns:

- `describeEval` registration, filtering, concurrency, optional repeats, reporting, and abort propagation;
- normalization of output, ordered transcript events, usage, artifacts, errors, and traces;
- the custom judge contract and judge-harness transport seam.

The 0.14 integration sequence is singular and typed:

```text
createHarness → PairEvidence
createJudge assessment
  → when the pair reaches semantic judging: one ctx.runJudge call through createJudgeHarness
  → otherwise: no model-judge call
→ strict semantic-tuple validation when called → deterministic one-pair reduction
→ JudgeResult { score, metadata: PairComparisonResult }
```

The judge never calls the subject harness. Exactly one `createHarness` invocation occurs per valid scenario case. The `createJudge` assessment consumes that existing `PairEvidence` once and makes at most one `createJudgeHarness` model call: exactly one for a comparable pair with semantic assertions, zero for a pre-judge infrastructure result or a deterministic-only pair. `PairComparisonResult` lives in `JudgeResult.metadata` for the reporter and human receipt. The judge score encodes Vitest case disposition only: `improved`, `non_regression`, and `characterized` pass; `no_demonstrated_delta`, `regression`, `inconclusive`, and `infrastructure_error` fail. `ScenarioLoadResult.status=test_definition_error` fails before subject execution. A passing Vitest case means the declared comparison intent was demonstrated, never that the user accepted the skill.

Repository code owns:

- scenario discovery and parsing;
- the paired subject execution and comparability check;
- project-local skill installation;
- normalized response, tool, and artifact evidence;
- deterministic assertions;
- semantic rubric and pair outcome;
- human-facing evidence and rationalizations.

The implementation must hard-cut from Vitest Evals `^0.12.0` to the selected current 0.14 API before relying on 0.14 custom harness/judge behavior. It must not maintain dual adapters.

### R8. ACPX subject execution contract

ACPX is transport, not a filesystem sandbox or workflow authority. Every subject process must additionally run inside an OS-enforced containment boundary that denies host filesystem access except for the disposable repository and an explicit read-only runtime allowlist. That allowlist contains only the executables and libraries required by the declared tools; it excludes host homes, instructions, skills, histories, logs, and provider configuration. ACPX cwd, approval policy, prompt instructions, and repository snapshots are defense in depth; none is accepted as the primary containment mechanism. If that boundary is unavailable or cannot be proved, the scenario does not launch and returns `infrastructure_error`.

Transport and model-launched tool authority are separate. ACPX’s adapter process may receive the minimum provider network and authentication authority needed for model transport, but those credentials, configuration files, environment values, and network authority are unavailable to model-launched commands. Tool subprocesses receive a sanitized scenario environment, a clean per-run runtime home, and no outbound network in V1. A future networked scenario is a contract revisit, not an implicit permission expansion.

Each subject run must:

- create a fresh disposable repository and copy only declared fixtures and bounded context;
- run the ACPX adapter and all child commands inside the enforced filesystem boundary;
- install the selected target-skill closure project-locally for the variant;
- reject traversal, symlinks, hardlinks, duplicate destinations, and overwrite outside declared setup;
- disable ambient copies of the target skill;
- use empty MCP by default;
- fail non-interactive permission requests;
- use the smallest declared tool and write authority;
- take before/after repository snapshots and enforce allowed writes;
- collect the normal operator-facing response, ordered events/tool calls, declared artifact evidence, process status, session identity, usage, and resolved runtime identity;
- enforce timeout, abort, process-group termination, stream drain, and cleanup;
- inherit only an allowlisted scenario environment and redact sensitive values before evidence leaves local ignored debugging storage.

Write-enabled scenarios may write only inside their disposable repository and declared paths. Reads and writes outside the runtime allowlist must be denied by the OS boundary. A write inside the repository but outside declared paths is a deterministic behavior failure even if the natural-language response claims success.

### R9. Deterministic evidence remains authoritative for deterministic facts

Code, not a model judge, decides two distinct classes of facts:

Definition/infrastructure validity:

- scenario/schema validity and duplicate IDs;
- prompt/rubric leakage;
- fixture containment;
- process exit, timeout, abort, and cleanup;
- model/runtime/session/repository identity and pair comparability;
- configured MCP, permission, tool, and write-policy identity matches the validated scenario;
- judge output schema, tuple completeness, and evidence-anchor validity.

Declared deterministic behavior assertions:

- required or forbidden tool events;
- artifact existence, path, and before/after diff facts;
- actual tool/write behavior against declared assertions, including forbidden-write facts and other scenario-declared code-decidable expectations.

Definition errors stop before execution. A broken containment, execution, collection, comparability, cleanup, or judge-transport invariant becomes `infrastructure_error`. Each declared deterministic behavior assertion becomes a per-run `pass` or `behavior_fail` in the shared assertion identity space. A semantic judge cannot turn either class of deterministic failure into a pass.

The existing fake backend remains useful only for cheap harness and report plumbing. It cannot support a behavioral RED, GREEN, regression, or non-regression claim.

### R10. One strict semantic judge

The system uses one Codex ACPX judge through a Vitest Evals custom judge and custom judge harness. The judge runs in a separate temporary workspace, clean runtime home, and fresh session with empty MCP, deny-all permissions, no terminal or tools, one bounded turn, and strict JSON output. Its process also runs inside an OS-enforced filesystem boundary that exposes only its bounded judge packet and explicit minimal transport runtime; it cannot read subject repositories, raw debugging storage, the source checkout, host homes, ambient instructions/skills/histories, or other host files. Transport credentials remain outside the packet and model-visible runtime. If this boundary is unavailable or cannot be proved, judging does not launch and the pair returns `infrastructure_error`.

The judge receives:

- opaque run IDs rather than outcome-signaling baseline/treatment labels where practical;
- declared assertion IDs and criteria;
- each assertion’s allowed evidence surface;
- bounded, redacted response/tool/artifact evidence anchors;
- explicit instruction that all evaluated material is untrusted quoted data.

It returns exactly one result for every semantic-assertion/run tuple:

```text
run_id
assertion_id
classification: pass | behavior_fail | inconclusive
evidence_anchor_id
rationale
observed_rationalization: optional
smallest_proposed_retest: optional
```

Missing, duplicated, invented, cross-surface, malformed, truncated, or ambiguous evidence fails closed as `inconclusive` or `infrastructure_error`; it never becomes `pass`.

The packet builder enforces explicit implementation-selected total, per-anchor, and item-count limits before judge launch. It records every omitted or oversized declared evidence item with a deterministic truncation marker. Silent sampling and transport-side truncation are forbidden; every affected assertion becomes `inconclusive` and cannot pass.

One structured judge owns all semantic dimensions so Vitest’s score averaging cannot hide a failed required assertion. The judge result is evidence and feedback, not acceptance authority.

Strict JSON, quoting, evidence anchors, and process isolation provide bounded resistance to hostile evidence; they cannot prove that a semantic classification was not influenced by every possible prompt injection. A bounded live proof must send hostile quoted evidence through the real ACPX judge and verify the output envelope, exact tuple set, allowed anchors, and absence of escaped authority. This proves only the tested countercases. Schema-valid judge results remain fallible evidence requiring human inspection, and deterministic facts must never be delegated to this judge.

### R11. Load and pair outcomes preserve uncertainty

Scenario validation completes before execution:

```text
ScenarioLoadResult:
  status: valid | test_definition_error
  scenario_id: present only when identity is valid
  definition_errors: present only for test_definition_error
```

`test_definition_error` is a pre-execution definition result, not a pair outcome. It never contains baseline or treatment run IDs. Only a `valid` load result may launch the subject or judge.

The authoring-facing result for a valid scenario is deliberately small:

```text
PairComparisonResult:
scenario_id
comparison_intent
baseline_run_id: present iff baseline actually launched
treatment_run_id: present iff treatment actually launched
comparability: comparable | invalid
expected_red_observed: present only for comparison_intent=improvement
per_assertion_baseline_and_treatment_classifications: shared semantic/deterministic results
deterministic_failures: derived assertion IDs and details
inconclusive_assertions
rationalizations
smallest_proposed_retest
outcome:
  improved
  non_regression
  characterized
  no_demonstrated_delta
  regression
  inconclusive
  infrastructure_error
```

Outcome semantics:

- `improved`: `comparison_intent=improvement`, every expected RED assertion is `behavior_fail` in baseline and `pass` in treatment, every required treatment assertion passes, and observable target-skill-use evidence exists.
- `non_regression`: `comparison_intent=non_regression` and every required assertion passes in both baseline and treatment.
- `characterized`: `comparison_intent=characterization`, the pair is comparable, required evidence is conclusive, and no regression is observed. It reports the observed baseline and treatment behavior, including shared failures, without claiming improvement or non-regression.
- `no_demonstrated_delta`: the pair is comparable and conclusive but the intent-specific positive predicate above is not met and no higher-precedence outcome applies. Examples include an improvement baseline that already passes, an expected RED that remains failed in treatment, or a non-regression baseline that does not establish the behavior to preserve.
- `regression`: any required semantic or deterministic assertion passes in baseline and is `behavior_fail` in treatment.
- `inconclusive`: evidence is complete enough to run but semantic interpretation or declared evidence is insufficient.
- `infrastructure_error`: execution, isolation, comparability, cleanup, or judge transport/schema is invalid.

Reduction applies to the shared semantic/deterministic assertion identity space and uses this total precedence: `infrastructure_error` → `regression` → `inconclusive` → `improved` → `non_regression` → `characterized` → `no_demonstrated_delta`. A higher-precedence condition always wins. In particular, a pair that improves one assertion and regresses another is `regression`, never `improved`; a treatment deterministic behavior failure cannot coexist with `improved` or `non_regression`, while a shared conclusive failure may be truthfully `characterized`. Infrastructure invalidity is never relabeled as behavior failure, and code-decidable target behavior is never relabeled as infrastructure merely to close the outcome.

No outcome field is named `accepted`, `approved`, `shippable`, or `released`.

One fresh pair is the default feedback unit and proves only that execution. Repetition is Vitest runner configuration, not scenario truth or pair state. Each repeat produces an independent pair result; the harness does not aggregate across test invocations. When repeated pair results disagree, Vitest preserves each result and `skills-creation` must present the disagreement as a proof gap rather than claim stable GREEN. `skills-creation` chooses proof strength proportionate to the behavior and shipping claim.

### R12. Human acceptance is explicit

The user receives:

- scenario provenance and intended behavior;
- baseline and treatment operator-facing responses;
- deterministic failures;
- assertion-scoped judge classifications and evidence anchors;
- rationalizations and the smallest proposed retest;
- any inconclusive evidence or disagreement across independent repeated pairs.

The user may make four explicit choices with distinct owners: accept the behavior; request a target-skill revision through `skills-creation`; request a scenario/expectation revision through `skill-scenario-creation`; or accept a named proof gap. A numeric score, judge threshold, pair outcome, generic `revise` action, or reviewer recommendation cannot silently substitute for this decision.

### R13. Initial motivating scenario families

The first corpus must preserve the failures that motivated this design without hard-coding their solutions into the subject prompt:

1. `MUST load` versus inline bloat: the all-run obligation remains visible in `SKILL.md`, while coherent always-needed detail may live behind a `MUST load`; fail if obligation, order, decision, return, invariant, or completion is hidden only in the reference.
2. Conditional reference loading: `SKILL.md` owns `IF <observable condition>, load <reference> and return <shape>`; fail if the reference itself contains the first instruction for when it should have been loaded.
3. Reference routing-site negative case: a reference file that explains how or when to call itself is too late and cannot repair a missing caller pointer.
4. Lane classification: semantic independence is necessary; running in parallel or in a subagent is neither necessary nor sufficient. Parent-coupled or incomplete-contract work is not a lane, while a qualified lane remains a lane when scheduled serially.
5. Lane dispatch call site: every dispatched lane supplies bounded context and dependencies, the basis for safe independence/parallelism, expected receipt, and parent reduction point.

These scenarios are examples of the scenario system’s initial consumers. They do not become special cases in the harness.

## Spec boundary and separability map

```text
future log-mining skill
  owns: authorized evidence discovery, source pointers, redacted excerpts
  exposes: bounded evidence packet
  forbidden: scenario persistence, target-skill edits, evaluation verdicts
                     │
                     ▼
skill-scenario-creation
  owns: evidence-to-scenario judgment and scenario authoring receipt
  exposes: schema-valid scenario artifact
  forbidden: execution, judging, target-skill edits, acceptance
                     │
                     ▼
persisted per-skill scenario
  owns: case-specific prompt, provenance, baseline meaning, rubric, controls
  exposes: typed parsed scenario
                     │
                     ▼
Vitest Evals + ACPX harness
  owns: fresh pair execution, isolation, normalized evidence, comparability
  exposes: pair evidence and deterministic results
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
deterministic assertions   semantic judge
  owns observable facts      owns declared semantic classifications
  cannot be overridden       cannot invent criteria or acceptance
          └──────────┬──────────┘
                     ▼
skills-creation
  owns: target-skill edits, proof interpretation, review routing, iteration
  exposes: revised target skill plus evidence
                     │
                     ▼
human/user
  owns: intended behavior and acceptance
```

Allowed edges follow the arrows. Forbidden edges include scenario evidence directly granting runtime authority, the harness mutating scenarios or target skills, the judge inventing criteria or overriding deterministic facts, and `skills-creation` silently weakening a rubric to obtain GREEN.

## Minimal file and module surface

The spec requires responsibilities, not these exact filenames, but the smallest coherent implementation should remain close to:

```text
plugins/shravan-dev-workflow/skills/skill-scenario-creation/
├── SKILL.md
└── references/scenario-format.md

tests/skills/
├── evals/skill-pressure.eval.ts
├── lib/
│   ├── scenario-parser.ts
│   ├── skill-pressure-harness.ts
│   ├── pressure-assertions.ts
│   ├── acpx-client.ts
│   ├── subject-runner.ts
│   └── skill-pressure-judge.ts
└── scenarios/<plugin>/<skill>/
    ├── <scenario-id>.md
    └── fixtures/<scenario-id>/...
```

Responsibilities:

- `skill-pressure.eval.ts`: discover scenarios, register one case per scenario with the paired harness and one automatic structured judge, and use judge score/metadata for case disposition and reporting; no registry or suite policy.
- `scenario-parser.ts`: parse and validate scenario identity, partition, provenance, controls, assertions, and safe paths.
- `skill-pressure-harness.ts`: execute one comparable pair and normalize both evidence blocks as `PairEvidence` through `createHarness`.
- `pressure-assertions.ts`: deterministic facts only.
- `acpx-client.ts`: one shared subject/judge containment wrapper plus ACPX resolution/execution, clean runtime home, transport/tool authority separation, abort/timeout cleanup, environment allowlist, redaction, boundary identity, and captured process result.
- `subject-runner.ts`: disposable repository, fixtures, selected skill installation, snapshots, and normalized response/tool/artifact evidence.
- `skill-pressure-judge.ts`: one `createJudge` plus ACPX `createJudgeHarness` transport, strict semantic tuple validation, one-pair reducer, and typed `JudgeResult.metadata`.

Do not add registries, coordinators, reducers beyond the one pair comparison, general provider interfaces, aggregate receipts, risk engines, or promotion modules.

## Keep, adapt, and reject from the experimental worktree

### Keep or adapt

| Concept | Useful source | Local adaptation |
| --- | --- | --- |
| Thin Vitest Evals adapter | `skill-pressure-eval-harness.ts:32-71` | One scenario input, one paired output, normalized events/artifacts/errors |
| Small eval registration | `evals/skill-pressure.eval.ts:174-206` | Keep only discovery and per-scenario registration; discard suite authority |
| ACPX execution seam | `acpx-command-executor.ts:26-43,98-143` | One client with abort, timeout, cleanup, environment allowlist, and redaction |
| Subject command profile | `acpx-subject-profile.ts:24-60` | One Codex profile with empty MCP, explicit permissions, strict JSON transport |
| Judge command profile | `acpx-codex-review-profile.ts:20-57` | One deny-all/no-tools/one-turn Codex judge profile |
| Disposable execution | `subject-repetition.ts:130-276` | Fresh repo/session, fixtures, local skill installation, snapshots, normalized transcript |
| Pair comparability | `subject-repetition.ts:303-339` | Preserve invariant; omit receipt graph and fixed repetition policy |
| Strict judge envelope | `structured-review-runner.ts:143-177` | Quoted untrusted evidence, exact tuples, allowed anchors, strict schema |

### Reject

- Registry snapshots and requirements authority.
- V3 suites, selection policy, risk selection, execution graphs, and caps.
- Aggregate receipts and digest/fingerprint hierarchies beyond a small common-input identity used to prove comparability.
- Promotion, demotion, quarantine, or acceptance workflows.
- Fixed exactly-three repetitions or universal five-repetition mandates.
- Claude/Opus and generalized provider/risk branches.
- Dashboards, databases, longitudinal result stores, and benchmark scoring.
- Raw model output as checked-in baseline truth.

## Prior-art adaptations

### SkillsBench

Preserve realistic tasks, observable outcome evidence, trajectory/artifact inspection, and human review. Do not adopt Docker benchmark packages, oracle solvers, task taxonomies, leaderboards, or mandatory benchmark contribution policy.

### agent-skills-eval

Preserve stable scenario identity, prompt, fixtures, multiple assertions, per-assertion evidence, and visible with/without-skill comparison. Correct its weaker comparability model: prompt equality is insufficient when fixtures, bounded context, tools, permissions, runtime, or skill-discovery mechanics differ. Do not inject the full skill into the treatment prompt, because that cannot test realistic trigger or reference loading.

### Obra Superpowers

Preserve observed-failure RED/GREEN/REFACTOR, verbatim rationalization capture, and guidance matched to failure form. Do not make TDD or discipline pressure the identity of all skill creation, require universal pressure counts, or displace user-guided authoring.

## Security and trust boundaries

1. User/session evidence is untrusted input. It cannot directly control permissions, tools, write paths, assertions, baseline selection, or judge instructions.
2. Durable scenarios contain sanitized provenance and a minimized evidence synopsis, never raw session logs, credentials, unrelated private content, or executable instructions copied from evidence.
3. Fixtures, prompts, and skill closures must remain contained regular files inside a disposable repository. Traversal, symlink, hardlink, duplicate destination, or source-checkout mutation is rejected.
4. ACPX credentials, provider network, host runtime configuration, and ambient environment values are privileged transport material. They are unavailable to model-launched tools and never become scenario data, report evidence, or judge input.
5. Raw response/event/stderr/artifact material may exist only in ignored local debugging storage. Judge packets, surfaced errors, and report evidence are bounded and redacted.
6. Subject evidence is quoted untrusted data to the judge. The judge has no tools, terminal, repository access, or authority beyond returning schema-valid classifications.
7. Secret detection is a defense-in-depth proof surface, not a claim of perfect classification or a reason to add a vault system.
8. Infrastructure and safety failures fail closed and remain distinct from target-skill behavior.

## Alternatives and tradeoffs

### Chosen: paired scenario case inside the existing harness

Gain:

- one causal unit, one coherent judge packet, one scenario report, no cross-test scheduling state;
- direct reuse of the current Vitest Evals package;
- the smallest path to both authoring loops.

Cost:

- baseline and treatment are sub-results rather than separate top-level Vitest cases;
- one pair is feedback, not a consistency claim;
- the paired harness knows the current Codex project-local installation model.

Revisit when humans cannot inspect per-variant transcripts, usage, failures, and artifacts from the paired report without opening raw files. At that point, expose the existing `SubjectRunResult` as separately named cases while retaining the same scenario and pair contracts.

### Rejected: separate baseline and treatment cases plus cross-case reducer

This gives first-class per-run report entries, but introduces scheduling/order state, persisted intermediate coordination, or duplicate executions before report usability proves that cost necessary.

### Rejected: merge the experimental worktree architecture

It contains useful execution kernels but also a generalized governance system. Merging it would make registries, graphs, receipts, promotion policy, risk/provider selection, and fixed repetition part of the product without a requirement.

### Rejected: checked-in `baseline.json`

It is convenient to inspect but canonizes stochastic output and creates a second truth source. Fresh execution plus an immutable source selector is more honest. Reviewed historical observations remain a future optional artifact with narrower semantics.

### Chosen: Vitest Evals 0.14 hard cutover

Gain: implementation matches current custom harness/judge documentation and canonical ordered event behavior.

Cost: dependency/API migration must be proved together with the harness work.

Rejected alternative: dual 0.12/0.14 adapters. The compatibility surface has no product value.

### Chosen: one judge plus deterministic checks and human acceptance

Gain: no averaged required dimensions, clear evidence ownership, and no hidden automated product owner.

Cost: one judge has blind spots and the user must remain in the acceptance loop.

Revisit judge plurality only after repeated reviewed disagreement demonstrates a real calibration problem.

## Requirements/proof matrix

| Requirement | Proof expectation | Evidence source | Freshness guard |
| --- | --- | --- | --- |
| R1 scenario owner | Pressure scenarios show it creates schema-valid scenarios from user and mined evidence but does not execute, judge, edit, or accept | Skill pressure proof plus changed files | Current skill source and current scenario schema |
| R2 two authoring paths | A failure-driven case reaches RED/revision/GREEN; a user-guided baseline-pass case remains valid characterization; changed expectations route to scenario revision; all four human choices route to their named owner | Live workflow scenarios and user-visible receipts | Current `skills-creation` and `skill-scenario-creation` sources |
| R3 scenario contract | Parser accepts complete Markdown cases; exhaustively matches every typed field to the normative consumer/effect map; treats Markdown as sole case truth; shares assertion IDs across semantic/deterministic checks; and rejects missing or duplicate identity, non-canonical target identity, path/`target_skill` mismatch, unsafe paths, invalid evidence surfaces, invalid conditional fields, and invalid baseline revisions | Unit/schema tests plus consumer/effect coverage assertions | Current parser/schema and fixture tree |
| R4 prompt partition and real use | Rendered subject input contains the real prompt/fixtures and none of the rubric, expected RED, target path, or test-only load instructions; a live treatment proves exact project-local `SKILL.md` use and a reference-targeted case proves the exact reference read, while installation or self-report alone remains inconclusive | Unit tests plus captured subject prompt and live normalized event anchors | Exact rendered prompt and events from current run |
| R5/R6 baseline comparability | Fresh pair has distinct repo/session IDs, identical common inputs/runtime/permissions/rubric, and only selected skill source differs | Integration receipt and deterministic assertions | Same scenario revision and one paired run |
| R7 Vitest harness | One valid scenario performs exactly one paired `createHarness` invocation and one `createJudge` assessment, with exactly one `createJudgeHarness` call only when semantic judging is reached and zero otherwise; it returns complete `PairComparisonResult` metadata, maps every result to the declared Vitest disposition, and reports ordered events/variant artifacts/abort state; dependency and source inspection prove no Vitest Evals 0.12 compatibility adapter remains | 0.14 contract integration, report artifact, conditional call-count assertions, and dependency/source check | Current Vitest/Vitest Evals versions |
| R8 ACPX execution | Disposable repo, contained fixtures, treatment-only local skill, empty MCP, least authority, timeout/abort cleanup, and controlled environment are observed; OS containment denies outside-repository reads/writes, transport credential/config access, host-home/ambient runtime access, and model-launched outbound network while transport still succeeds; traversal, symlink, hardlink, duplicate-destination, and source-mutation attempts are rejected | ACPX integration/smoke evidence with credential/config/network canaries and adversarial fixtures | Resolved ACPX/Codex runtime and containment identity |
| R9 deterministic authority | Unauthorized writes, tool violations, runtime mismatch, malformed judge output, and containment violations fail despite cooperative prose; sensitive canaries never appear in surfaced errors, reports, or judge packets | Unit and integration countercases plus redaction/canary assertions | Current run artifacts and rendered evidence surfaces |
| R10 semantic judge | The judge has a clean runtime and OS-enforced packet-only boundary; every required tuple has a valid allowed anchor; declared packet limits make oversized/omitted evidence visibly inconclusive without silent truncation; and a bounded hostile quoted-evidence case passes through the live judge without escaping its schema, anchors, or authority | Judge contract/overflow tests plus live hostile-evidence and ambient-config smoke | Current judge prompt/schema/runtime and containment identity |
| R11 result semantics | Pre-run definition error plus zero-, one-, and two-run infrastructure fixtures prove only real run IDs surface; semantic and deterministic pass/fail transition fixtures cover all three intents and every outcome/disposition; total precedence covers user-guided baseline-pass characterization, shared deterministic failure under characterization, improvement baseline pass with no delta, semantic-pass/deterministic-fail, and mixed improvement/regression resolving to regression | Reducer truth-table unit tests, paired fixtures, and Vitest disposition assertions | Current load and pair result contracts |
| R12 human authority | A user-guided baseline-pass case, scenario-revision route, and all four explicit human choices prove that no schema, pair outcome, score, or reviewer recommendation performs acceptance | Contract tests and live workflow scenarios | Current result schema and transcript |
| R13 motivating scenarios | Named MUST/IF/reference/lane cases demonstrate RED without the intended guidance and candidate GREEN with it, including countercases | Live pressure scenarios with grader-only rubrics | Current target skill revision and fresh sessions |

Higher proof layers expected during implementation planning:

- Unit: parser, prompt partition, deterministic assertions, result reduction, strict judge parsing.
- Integration: disposable repositories, installation, snapshots, environment control, process cleanup, pair comparability, judge isolation.
- Smoke: one real ACPX subject pair plus one real ACPX judge call through Vitest Evals.
- End to end: one failure-driven RED/GREEN scenario and one user-guided baseline-pass characterization scenario with inspectable evidence, scenario-revision routing, and explicit human feedback across the four available choices.
- Review: `skills-creation` reviews the new scenario skill; `implementation-review-swarm` reviews the final harness and proof chain before PR readiness.

Exact commands, implementation sequencing, and worker allocation belong to `plan-creation-swarm`, not this spec.

## Open decisions and revisit triggers

No decision currently blocks implementation planning.

The following remain invocation or planning choices rather than spec ambiguity:

- exact subject and judge model IDs and reasoning effort;
- default runtime timeout and local concurrency;
- when `skills-creation` requires repeated pairs rather than one feedback pair;
- exact Markdown serialization of assertion lists, provided the semantic contract and subject/grader partition remain unchanged.

Add complexity only after a concrete signal:

- repeated unchanged scenarios disagree → add a bounded repetition/reduction policy;
- real second provider requirement → extract provider profile behind the current seam;
- paired report hides evidence → expose variant results as separate cases;
- evidence anchors become too large or ambiguous → add a focused evidence index;
- per-skill discovery produces real duplicate/ownership failures → add generated indexing, not a hand-maintained registry;
- baseline cost dominates repeated full runs → consider immutable fingerprinted caching with explicit freshness, never raw checked-in output.

## Acceptance boundary

This spec is satisfied when an implementation can show, from current source and current executions, that:

1. supplied evidence becomes a reviewed per-skill scenario without leaking rubric or authority into the subject;
2. one Vitest Evals case executes a fresh comparable ACPX pair whose only intended semantic delta is the target skill;
3. deterministic facts and one strict semantic judge produce anchored, fail-closed evidence;
4. both authoring paths return that evidence to `skills-creation` and the user without automated acceptance;
5. the motivating MUST/IF/reference/lane scenarios can demonstrate RED, candidate GREEN, countercases, and uncertainty;
6. no registry, workflow graph, promotion system, fixed repetition authority, generalized provider framework, or raw baseline truth was introduced.
