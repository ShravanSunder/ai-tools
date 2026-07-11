# Skill Pressure Judge System Spec

Status: accepted

## Decision Summary

The skill pressure system will remain a Vitest Evals suite, but its proof model
will change completely:

- The primary Codex run returns the response an operator would actually see. It
  does not grade itself or emit a compliance report.
- A deterministic collector owns process, sandbox, skill-load, tool-trace,
  worktree-diff, and artifact facts.
- Every scenario with semantic obligations receives an independent one-shot
  Codex judge.
- Effective high-risk scenarios additionally require an outside Claude Opus
  judge at high reasoning effort through the existing ACPX review transport.
- Judges return structured, per-criterion candidate verdicts. They never own the
  final green state.
- A deterministic reducer owns the final outcome. Deterministic contradictions,
  missing required evidence, missing required judges, malformed judge receipts,
  and unresolved high-risk disagreement cannot be green.
- Scenario ownership mirrors product ownership under
  `tests/<plugin>/<skill>/`.
- New or materially changed skill behavior requires an isolated baseline and
  treatment pair so the suite proves that the skill changes behavior.

This is a hard cutover. The flat scenario directory, self-grading result schema,
regex-over-self-report oracle, and alternate legacy reducer are not retained as
parallel authoritative paths.

## Product Intent

Skill maintainers need to know whether a skill changes agent behavior under
real shortcut pressure. A passing result must mean more than “the model named
the expected concepts.” It must show that:

- the intended skill source was available and actually loaded;
- the operator-facing response satisfied behavioral obligations;
- required or forbidden actions are supported by trace evidence;
- claimed files and artifacts exist and satisfy their contract;
- the result differs from a controlled no-skill or pre-change baseline when the
  scenario is intended to prove new behavior; and
- semantic judgment came from a separate evaluation context, with an outside
  model family required when the risk warrants it.

The target user is the maintainer changing a plugin skill, its invocation
surface, or the pressure-test infrastructure. The primary product output is a
trustworthy, inspectable scenario verdict with enough evidence to explain why
it passed, failed, or could not be decided.

## Current-State Evidence

The current system already uses a real Codex process and Vitest Evals, but its
oracle is weak:

- `tests/skills/evals/skill-pressure.eval.ts` sets `judgeThreshold: null` and
  reduces local regex assertions.
- `tests/skills/lib/prompt-renderer.ts` asks the primary model to return JSON,
  include the operator response, and report which rules it followed.
- `tests/skills/lib/pressure-assertions.ts` searches the primary model's final
  JSON for required and forbidden regular expressions.
- `tests/skills/lib/codex-backend.ts` already records a raw event stream,
  process result, final output, and stderr.
- A current event stream includes the exact skill-file read command, command
  output, final agent message, and usage. Those facts are captured but not
  normalized into the oracle.
- The current tree contains 107 active scenarios across 23 skills. Every one is
  `fast`; 19 declare an expected artifact even though the backend is read-only
  and the reducer does not verify `artifact_created`.
- `vitest-evals` already provides normalized sessions/traces, named judges,
  provider-neutral judge harnesses, explicit judge assertions, and structured
  judge results.

The preceding research synthesis is recorded in
`tmp/research-workflows/2026-07-10-skill-pressure-judge-model/research-ledger.md`.

## Goals

1. Test authentic operator-facing behavior rather than self-reported
   compliance.
2. Make machine-observable facts deterministic and authoritative.
3. Use model judges only for semantic obligations that machines cannot settle.
4. Escalate high-risk skills and changes to an outside Claude Opus judge.
5. Prove skill value with isolated baseline/treatment evidence.
6. Make scenario ownership, discovery coverage, risk, provenance, and verdicts
   explicit and inspectable.
7. Preserve Vitest Evals reporting, sessions, traces, and judge integration.

## Non-Goals

- Prove that a model is correct for every possible prompt.
- Remove all stochasticity from model behavior.
- Let a judge model override filesystem, process, trace, or schema facts.
- Give judges unrestricted repository, terminal, network, or credential access.
- Exercise real destructive external actions such as merges, pushes, releases,
  ticket mutations, or secret rotation.
- Keep the fake backend as behavioral proof.
- Maintain two scenario layouts, two reducers, or compatibility shims after the
  cutover.
- Specify implementation order, worker assignment, or exact validation
  commands; those belong to the implementation plan.

## Vocabulary

`Primary run`
: The Codex execution whose behavior is under test.

`Deterministic fact`
: A fact derived by code from the process, sandbox request, normalized session
or trace, controlled worktree, or artifact inspection.

`Semantic criterion`
: A behavioral obligation that requires interpretation of the operator-facing
response or a bounded evidence excerpt.

`Judge`
: A separate, one-shot model execution that evaluates semantic criteria against
a bounded evidence packet.

`Reducer`
: Deterministic code that combines facts, required judge receipts, and routing
policy into the final scenario outcome.

`Standard risk`
: A scenario requiring deterministic proof and one independent Codex semantic
judge when semantic criteria exist.

`High risk`
: A scenario additionally requiring an outside Claude Opus semantic judge at
high reasoning effort.

## Requirements

### Runner And Ownership

R1. Vitest Evals remains the only authoritative behavior-evaluation runner.

R2. The operator entrypoint may select scope and configuration, but scenario
discovery, risk routing, judge policy, and reduction must each have one shared
TypeScript owner.

R3. Scenarios must live under `tests/<plugin>/<skill>/`. The filesystem owner
must correspond to an existing `plugins/<plugin>/skills/<skill>/SKILL.md` unless
the manifest explicitly identifies an external skill owner. Shared evaluation
infrastructure has one owner at `tests/test-utils/skill-pressure/`; skill-owned
directories may import it but may not copy or override its contracts.

R4. Discovery must be recursive, deterministic, and independent of the shell
entrypoint. A run receipt must list discovered, selected, skipped, and invalid
scenarios so missing coverage cannot silently green.

R5. Scenario selection must use globally unique `scenario_id` values rather
than file basenames.

### Primary Execution

R6. The primary model must receive the operator prompt and only the neutral
harness context needed to run safely. It must not receive expected behavior,
failure signals, judge routing, risk routing, or grading language.

R7. The primary model must return a normal operator-facing response. It must not
be asked for `skill_invoked`, `shortcut_resisted`, `coverage_evidence`, or any
other self-grade.

R8. Primary runs must execute in disposable, controlled environments. Neutral
instructions, available skills, model identity, reasoning effort, permissions,
and fixture state must be explicit and reproducible.

R9. The controlled environment must prevent ambient repo instructions or other
skills from supplying the behavior attributed to the target skill. The target
skill and its required references must be the only behavior-bearing skill
surface added by the treatment. Each skill manifest declares a behavior-source
graph rooted at its `SKILL.md`. The graph may cross a skill boundary only
through an explicit manifest dependency edge to a named file; every transitive
edge, path, owner, blob, and digest is validated and receipted. Undeclared
cross-skill files, ambient instructions, installed caches, and unrelated skills
remain unavailable. The harness exposes only the resolved graph plus neutral
harness files. Source-isolated evaluation is the causal behavior gate.
Installed-plugin execution is a separate release smoke
and cannot share its behavior receipt. Release smoke must record the installed
plugin name, version, source digest, discoverability, and load evidence. A
missing, stale, or mismatched installed artifact fails the release smoke without
changing the source-isolated behavior outcome.

R10. Skill invocation must be independently observable through a normalized
skill-load event, a source-read trace, or an equivalent platform-native signal.
A primary boolean claim is never invocation proof.

### Execution Modes And Side Effects

R11. A response-only scenario must run read-only and assert that no unexpected
write attempt or worktree change occurred.

R12. A workspace scenario may write only inside a disposable fixture worktree.
Its manifest must declare allowed paths and expected artifact contracts.
Allowed paths are resolved against a canonical fixture root. Traversal and
symlink or hard-link escape are rejected before execution; pre/post snapshots
and write-attempt facts detect out-of-scope mutation.

R13. Artifact proof must inspect actual filesystem state. At minimum it must
verify existence, location, file type, and declared content or schema
properties. A path mentioned by the primary model is not evidence.

R14. Skills whose production behavior would mutate external systems must use a
controlled adapter, fixture, or trace contract. Live destructive external
effects are outside this harness.

### Evidence Collection

R15. The deterministic collector must produce a versioned fact packet from the
primary run. The fact packet is the source of truth for machine-observable
claims.

R16. The fact packet must separate:

- operator prompt and visible response;
- process and sandbox facts;
- normalized skill-load and tool-call facts;
- worktree baseline, diff, and write-attempt facts;
- artifact metadata, digests, and bounded validated excerpts;
- run and model provenance; and
- untrusted primary text or raw evidence excerpts.

R17. Raw reasoning events, full transcripts, raw command output, and entire
artifact bodies must remain local run artifacts. They must not be sent to an
outside judge by default.

R18. Every bounded excerpt supplied to a judge must carry a stable evidence ID,
source type, source path or event ID, digest, truncation status, and untrusted
content label.

R19. Collector incompleteness for a required fact is not evidence of absence.
It produces `inconclusive` or `infrastructure_error`, never a pass.

### Semantic Criteria And Judges

R20. Scenario criteria must be typed as deterministic or semantic. A semantic
criterion must state the obligation, pass condition, failure condition,
and allowed evidence classes. Every declared criterion is a blocking behavioral
obligation. Non-blocking observations belong in reporter metadata and are not
criteria. Every criterion
has a stable `criterion_id` unique within the scenario. IDs participate in
scenario, rubric, baseline, and judge-packet digests; array position is never
criterion identity.

An effective high-risk behavior scenario must include at least one semantic
criterion. A high-risk behavior scenario declared as deterministic-only is an
invalid scenario contract, not a route around outside judgment.

R21. Every scenario with at least one semantic criterion requires an
independent one-shot Codex judge. The judge must run in a separate process or
agent context with no inherited primary conversation.

R22. The Codex judge receives the hidden semantic rubric and bounded fact
packet. It must not receive unrestricted worktree or terminal access.

R23. An effective high-risk scenario additionally requires a one-shot outside
Claude Opus judge through ACPX, with high reasoning effort and deny-all,
packet-only permissions. It runs from an isolated empty working directory with
only the rendered packet available and a scrubbed environment. Repository
read-only access is not packet-only access.

R24. The outside judge policy names the Claude Opus model family and capability
tier rather than freezing a stale provider model ID. Each receipt must record
the actual resolved model ID, provider, reasoning setting, adapter, and ACPX
version. Failure to confirm an Opus model at high reasoning is a required-lane
infrastructure error.

R25. Codex and Claude judges must receive the same provider-neutral criteria
and evidence packet. Provider adapters may add transport framing but may not
weaken or reinterpret the rubric.

R26. Judge output must use a versioned structured envelope. Each semantic
criterion returns exactly one of `pass`, `fail`, or `insufficient_evidence`, a
short rationale, evidence IDs, and confidence. Judges must not return hidden
chain-of-thought.

R27. Judges are advisory. They cannot override deterministic facts, change risk
routing, rerun the primary subject, mutate fixtures, or declare final green.

### Risk Routing

R28. Effective risk is the maximum of:

- the skill's baseline risk;
- the scenario's risk; and
- the changed-surface risk supplied by the run context.

The shared TypeScript risk owner derives changed-surface risk from a versioned
classification contract. Its inputs are the declared comparison revision,
current tracked and untracked changes, and the behavior-source and harness
surfaces those changes reach. The classifier emits input provenance, digests,
matched rules, its policy version, and whether the target skill is new,
materially changed, or unchanged. That classification determines the required
baseline mode and immutable comparison revision; caller-supplied risk or
baseline labels are not authoritative.

R29. Scenario metadata may raise risk but may not lower the skill or change
risk. Missing, unknown, malformed, or conflicting risk information resolves to
high risk.

R30. A skill is high risk when its intended workflow can authorize or shape
security decisions, secrets, permissions, sandbox boundaries, agent execution,
external writes, pushes, merges, releases, destructive actions, or terminal
completion claims.

R31. A change is high risk when it alters any surface named in R30, or alters
skill invocation/triggering, evidence normalization, judge prompts or schemas,
risk classification, reducer logic, provider routing, or fail-closed behavior.

R32. Risk policy is a versioned deterministic contract. A changed-skill gate
without a verified changed-surface classification receipt is high risk by
default. Forged, stale, incomplete, or caller-only classifications also resolve
to high risk.

### Baseline And Treatment Proof

R33. A new skill uses a no-target-skill baseline. A materially changed skill
uses the accepted pre-change skill source from an immutable Git revision as its
baseline. The receipt records that revision, source closure, digests, and the
comparison's acceptance provenance. Baseline and
treatment must share the same primary model, reasoning setting, neutral
instructions, fixture, operator prompt, and judge policy.

R34. Baseline and treatment must run in separate disposable environments. The
treatment must record current target-skill load evidence. A `no_target_skill`
baseline proves that no target closure is available. A `pre_change` baseline
proves that only the classifier-selected immutable historical closure is
available and that no treatment closure digest is reachable.

R35. A scenario intended to prove new behavior is discriminating only when,
for every named target criterion, the baseline fails for that criterion's
declared expected reason and the treatment passes it. A baseline that already
passes any named target criterion is
`baseline_not_discriminating`, not RED evidence. The default stability gate is
two paired trials with identical controlled inputs: every pair must show the
declared baseline failure and treatment pass for every named target criterion.
Risk policy may raise the trial count but may not lower it. Mixed outcomes are
`inconclusive`, never a lucky green.

R36. Accepted baseline receipts are keyed by scenario, rubric, fixture, skill,
primary-model, judge-model, prompt, and collector digests. Any relevant digest
change invalidates the baseline receipt.

### Reduction And Outcomes

R37. The reducer must be deterministic and must emit one of:

- `pass`;
- `behavior_fail`;
- `inconclusive`;
- `infrastructure_error`; or
- `not_evaluated`.

Only `pass` is green.

R38. A deterministic criterion failure produces `behavior_fail` regardless of
judge output. All declared criteria are blocking; reporter observations do not
participate in reduction.

R39. A semantic criterion marked `fail` produces `behavior_fail` when all
required judges agree on failure. `insufficient_evidence` produces
`inconclusive`.

R40. For high-risk scenarios, missing or malformed judge receipts, unavailable
outside review, inability to confirm Claude Opus/high reasoning, or unresolved
Codex/Claude disagreement cannot be green. Transport/runtime failures produce
`infrastructure_error`; semantic disagreement produces `inconclusive`.

R41. Reducer output must name every deterministic failure, criterion verdict,
judge receipt, disagreement, missing fact, and routing decision that affected
the outcome.

### Provenance, Calibration, And Reporting

R42. Every run must record source digests, scenario and rubric versions,
collector and reducer schema versions, primary and judge provider/model IDs,
reasoning settings, permission policy, adapter versions, packet digest, usage,
duration, and completion status.

R43. Every judge configuration must pass a gold-packet calibration corpus that
contains known compliant, noncompliant, insufficient-evidence, prompt-injected,
and deterministic-conflict examples. A model, prompt, parser, or rubric change
invalidates the corresponding calibration receipt. A versioned calibration
receipt is keyed by judge family and the resolved model, reasoning, prompt,
parser, rubric, and envelope-schema digests. Missing, stale, or mismatched
calibration is an `infrastructure_error` and semantic results from that
configuration cannot contribute to green.

R44. Reporter artifacts must preserve the normalized run, deterministic fact
packet, judge packets and receipts, reduction, usage, and local pointers to raw
artifacts. When release smoke runs, the reporter also preserves its separate
installed-plugin smoke receipt. Reports must keep untrusted content visibly
separated from trusted facts.

R45. The fake backend may prove discovery, schemas, routing, malformed receipts,
and reducer behavior. It must emit `not_evaluated` at the behavior boundary and
must never satisfy a live skill-pressure proof gate.

## Repository Layout

```text
tests/
  test-utils/
    skill-pressure/
      package.json
      evals/
      lib/
      schemas/
      run-skill-pressure-tests.sh

  shravan-dev-workflow/
    debug-investigation/
      skill-eval.yaml
      scenarios/
        no-blind-fix.md
      fixtures/

    implementation-pr-wrapup/
      skill-eval.yaml
      scenarios/
      fixtures/

  dev-workflow-tools/
    peekaboo/
      skill-eval.yaml
      scenarios/
      fixtures/
```

`tests/test-utils/skill-pressure/` owns the standalone shared test package,
including its package metadata, lockfile, runner, schemas, and implementation.
It replaces `tests/skills/` outright. Each
`tests/<plugin>/<skill>/` directory owns the corresponding skill's risk profile,
scenario contracts, and fixtures. Infrastructure must not be copied into skill
directories.

The old `tests/skills/pressure-scenarios/` directory and legacy shell reducer
are removed at cutover. There is no dual discovery period. A one-time migration
receipt inventories every active legacy `scenario_id` and maps it to its new
owner path or an explicit retirement reason. Missing inventory entries block
cutover even when recursive discovery of the new tree is otherwise valid.

## Contract Shapes

### Skill Evaluation Manifest

```text
schema_version
plugin
skill
source_path
source_closure_roots[]
declared_source_dependencies[]:
  owner_plugin
  owner_skill
  path
base_risk: standard | high
risk_reasons[]
scenario_roots[]
```

The plugin and skill fields must agree with the owning path. The source path is
validated against the plugin tree. Declared dependency edges must point to
regular files under an existing skill owner and are recursively resolved from
the same selected Git tree or treatment source. Undeclared cross-owner edges,
symlinks, submodules, cycles, and paths outside skill owners are invalid. Skill
manifests use versioned YAML.

### Scenario Contract

```text
schema_version
scenario_id
invocation_mode: explicit | implicit
execution_mode: response | workspace
scenario_risk: standard | high
operator_prompt
fixture
allowed_write_paths[]
expected_artifacts[]:
  artifact_id
  path
  file_type
  content_contract
deterministic_criteria[]:
  criterion_id
  fact_kind
  operator
  expected
semantic_criteria[]:
  criterion_id
  obligation
  pass_condition
  failure_condition
  allowed_evidence_classes[]
baseline_policy:
  target_criteria[]:
    criterion_id
    expected_baseline_verdict: fail
    expected_failure_reason
  minimum_paired_trials: 2
```

Expected behavior and failure conditions are grader-only. They are never
rendered into the primary prompt. Scenario Markdown uses validated YAML
frontmatter for this structured contract. The shared classifier resolves
`no_target_skill` versus `pre_change` and the immutable source revision; those
values are not authored scenario overrides.

### Deterministic Fact Packet

```text
schema_version
run_id
scenario_identity
source_digests
primary_provenance
operator_prompt
visible_response
process_facts
sandbox_facts
skill_load_facts
tool_call_facts
worktree_facts
artifact_facts
bounded_untrusted_excerpts
collector_errors
packet_digest
```

### Judge Verdict Envelope

```text
schema_version
judge_run_id
judge_role: codex | outside_claude_opus
scenario_id
provider
model_id
reasoning_effort
adapter
permission_policy
isolation_receipt
packet_digest
calibration_receipt_id
criterion_results[]:
  criterion_id
  verdict: pass | fail | insufficient_evidence
  evidence_ids[]
  rationale
  confidence
status: completed | timeout | malformed | unavailable
completion_receipt
```

### Reduction Receipt

```text
schema_version
scenario_id
effective_risk
risk_reasons[]
risk_classification_receipt
deterministic_results[]
required_judges[]
judge_receipts[]
disagreements[]
baseline_receipt
calibration_receipt_ids[]
outcome: pass | behavior_fail | inconclusive | infrastructure_error
         | not_evaluated
outcome_reasons[]
```

### Installed Plugin Smoke Receipt

```text
schema_version
plugin
installed_version
installed_source_digest
expected_source_digest
discovery_status
load_evidence
status: pass | fail | infrastructure_error
```

The release smoke verifies packaging, installation, discovery, and loading. It
is reported beside the causal evaluation receipt but never enters behavior
reduction or satisfies baseline/treatment proof.

## Boundary And Separability Map

```text
skill-owned scenario surface
  owns: risk profile, fixtures, criteria, baseline intent
  exposes: versioned scenario descriptors
              |
              v
discovery and validation
  owns: recursive enumeration, path/manifest invariants, selection receipt
  exposes: validated scenario cases
              |
              v
primary execution environment
  owns: isolated subject context, Codex process, permissions, raw run artifacts
  exposes: authentic response and raw run record
              |
              v
deterministic collector
  owns: normalized process/trace/diff/artifact truth and redaction
  exposes: versioned fact packet
              |
              +----------------------+
              |                      |
              v                      v
one-shot Codex semantic judge   ACPX Claude Opus judge
  owns: standard semantics       owns: high-risk outside semantics
  authority: advisory            authority: advisory
              |                      |
              +-----------+----------+
                          v
deterministic reducer
  owns: risk policy, precedence, disagreement, final outcome
  exposes: reduction receipt to Vitest Evals reporter
```

Allowed dependency edges:

- discovery may depend on scenario schemas and filesystem ownership;
- execution may depend on validated scenarios, fixture builders, and the Codex
  process adapter;
- collection may depend on raw execution artifacts;
- judges may depend only on the validated rubric and bounded fact packet;
- the reducer may depend on validated facts, risk policy, and judge receipts;
- reporting may depend on the reduction and artifact pointers.

Disallowed dependency edges:

- the primary run may not see grader criteria or judge routing;
- judges may not consume raw transcripts or worktrees by default;
- a judge may not modify evidence or select its own risk level;
- ACPX transport may not own evaluation meaning or final status;
- the shell entrypoint may not duplicate discovery, risk, or reduction rules;
- self-report may not satisfy process, invocation, diff, or artifact criteria.

## Evaluation Flow

```text
validated scenario + controlled fixture
  -> isolated primary Codex run
  -> authentic visible response + raw local artifacts
  -> deterministic fact packet
  -> deterministic criteria
  -> one-shot Codex semantic judge when semantic criteria exist
  -> additional ACPX Claude Opus/high judge when effective risk is high
  -> deterministic reduction
  -> Vitest Evals result, score metadata, traces, usage, and receipts
```

The judge does not call the primary harness again. A judge assesses the exact
run packet already produced.

## Failure Semantics

The system fails closed at trust boundaries:

- missing discovered scenarios or invalid manifests block coverage green;
- missing skill-load proof blocks treatment green;
- unexpected writes or missing artifacts are deterministic failures;
- invalid or incomplete fact packets are infrastructure errors;
- a judge timeout is not a semantic failure and not a pass;
- a high-risk run without confirmed Claude Opus/high judgment is an
  infrastructure error;
- high-risk semantic disagreement is inconclusive and non-green;
- judge claims contradicted by deterministic facts are ignored and recorded;
- a non-discriminating baseline cannot prove new behavior.

## Security And Trust Context

Assets:

- repository source and fixture contents;
- local paths and command output;
- raw model reasoning and transcripts;
- credentials and ambient environment values;
- external provider requests and responses;
- verdict integrity and risk classification.

Required controls:

- primary runs use the narrowest sandbox compatible with the scenario;
- workspace writes are confined to disposable fixture roots;
- judges are one-shot and packet-only;
- outside review uses ACPX deny-all transport policy from an isolated empty cwd
  with only the packet available and a scrubbed environment;
- raw reasoning is never part of the judge packet;
- secrets and environment values are redacted before persistence or external
  transport;
- evidence excerpts are bounded, provenance-stamped, and labeled untrusted;
- prompt injection inside primary responses, tool output, or artifacts cannot
  change judge instructions or reducer policy;
- model and adapter identity is recorded rather than inferred;
- malformed external output is a lane error, never an empty pass.

Security non-goals:

- This harness does not replace an authorized security scan or threat model.
- It does not prove the external provider's internal security properties.
- It does not grant external judges direct credential or mutable workspace
  access.

## Proof Expectations

The implementation plan must operationalize these proof obligations without
weakening them:

1. Scenario discovery proves complete recursive ownership, global ID
   uniqueness, path/manifest agreement, explicit selected/skipped receipts, and
   complete old-to-new scenario migration inventory.
2. Schema and reducer proof covers every allowed outcome, precedence rule,
   malformed packet, missing judge, disagreement, and deterministic override.
3. Primary-run proof demonstrates a normal user-facing response with no
   self-grade instructions.
4. Trace proof demonstrates independent skill-load evidence and normalized tool
   facts from a real Codex run.
5. Workspace proof demonstrates actual allowed artifact creation and rejection
   of missing, malformed, out-of-scope, traversal, symlink, and hard-link
   artifacts without mutating external paths.
6. Baseline/treatment proof demonstrates two isolated paired RED-baseline and
   GREEN-treatment trials for at least one changed skill behavior and rejects
   mixed or non-discriminating samples.
7. Judge calibration proves known pass, fail, insufficient-evidence,
   prompt-injection, and deterministic-conflict packets for both required judge
   families.
8. Standard semantic proof demonstrates one independent Codex judge and a
   deterministic reduction receipt.
9. High-risk semantic proof demonstrates both Codex and outside Claude Opus at
   high reasoning, plus fail-closed missing/disagreement behavior.
10. Reporter proof preserves evidence, judge, provenance, usage, and reduction
    receipts without exposing secrets or treating untrusted text as facts.
11. The fake backend is proven incapable of producing a behavior-evaluated
    green result.
12. Installed-plugin smoke proof verifies the expected plugin identity, version,
    source digest, discovery, and load evidence; a stale or mismatched install
    fails smoke and cannot substitute for causal behavior proof.

## Alternatives And Tradeoffs

### Keep Regex Grading And Add A Judge

Rejected. A judge layered over the same self-reported JSON preserves the
original false-green path and gives two consumers the same contaminated input.

### Use Only An Outside Claude Judge

Rejected. Cross-family judgment improves independence but does not replace
deterministic facts, and making it universal would add avoidable cost and
availability dependence. Standard cases use one separate Codex judge; high
risk buys the outside lane.

### Give Judges Direct Repository Access

Rejected as the default. Direct access expands the trust boundary, allows
provider-specific exploration drift, and exposes more untrusted or sensitive
content. The collector owns evidence. Bounded fixture access can be reconsidered
only if calibrated packet-only judging repeatedly misses source-backed
semantic failures.

### Build A New Runner

Rejected. Vitest Evals already owns harness execution, sessions, traces,
artifacts, explicit judges, usage, and reporting. The missing pieces are local
contracts and adapters, not a replacement test framework.

### Keep The Flat Scenario Directory

Rejected. It obscures plugin/skill ownership, makes coverage review difficult,
and forces global filename prefixes to carry architecture.

## Accepted Tradeoffs

- Standard cases retain same-family correlated-blind-spot risk in exchange for
  lower cost and simpler operation. High-risk cases pay for outside diversity.
- High-risk green depends on ACPX and Claude availability. This is intentional;
  unavailable required independent proof is not proof.
- Packet minimization may initially make judges less informed. The collector
  must improve normalized facts before judges receive broader access.
- Provenance invalidation may require fresh baselines after model or rubric
  changes. That cost prevents stale evidence from masquerading as current
  proof.

## Open Implementation Inputs

These are plan-time choices, not unresolved product decisions:

- exact module names within `tests/test-utils/skill-pressure/`;
- concrete Claude Opus model identifier advertised when implementation begins;
- whether high-risk policy raises the minimum paired-trial count above two;
- report UI presentation details;
- whether raw local event storage remains Codex JSONL or is additionally
  normalized into Vitest Evals native traces.

## Related Artifacts

- `docs/specs/2026-06-28-acpx-review-transport-spec.md`
- `tmp/research-workflows/2026-07-10-skill-pressure-judge-model/research-ledger.md`
- `tmp/spec-workflows/2026-07-10-skill-pressure-judge-system/swarm-ledger.md`

## Next Workflow

Use `plan-creation-swarm` to map this accepted contract into implementation
slices and exact proof gates.
