# Skill Pressure Behavior Evaluation System

Status: accepted after adversarial review and remediation verification

## Decision Summary

The system measures whether installing one skill changes a mini model's behavior
under realistic shortcut pressure. It compares normal operator-facing work, not
skill summaries or subject self-grading.

Every authoritative evaluation uses Vitest Evals for orchestration and ACPX for
model execution. The default subject is GPT-5.6 Luna/high. Standard semantic
review uses a fresh ACPX Luna/high context. High-risk semantic review uses a
fresh, provider-verified ACPX Claude Opus/xhigh context. The parent validates
reviewer output as candidate evidence and owns the accepted result.

The system separates three questions that the old suite collapsed:

```text
scenario validity
  Does the prompt, rubric, permissions, expected effects, and baseline source
  form one internally consistent experiment?

behavior comparison
  Does the baseline/treatment pair prove improvement or non-regression across
  three fresh contexts per side?

suite authority
  Is this scenario calibrated strongly enough to block a change, or is it a
  diagnostic pressure probe whose outcome must be reported without becoming a
  release verdict?
```

The fixed baseline of 107 legacy scenarios remains accounted for, while current
discovery also reports scenarios added after that baseline. Migration does not
make an uncalibrated prompt authoritative. A separate evaluation registry gives
each active scenario an explicit `evaluation_role`:

- `gate`: calibrated evidence may block the owning skill's change.
- `diagnostic`: valid pressure evidence that is useful for investigation but is
  not yet a stable release gate.

There is no silent default. Promotion to `gate` requires a current calibration
receipt tied to the behavior contract digest, baseline policy, runner-semantics
digest, and exact model and review profiles. The treatment source used for
promotion is evidence in that receipt but is not part of future calibration
freshness: a gate exists to evaluate later treatment changes. At migration
completion every legacy scenario is `gate`, `diagnostic`, or explicitly
retired; none remains an unclassified candidate.

## Product Intent

Skill maintainers need evidence that wording changes agent behavior, while also
knowing when a scenario is measuring ordinary model capability, a contradictory
test contract, reviewer variance, or infrastructure limits.

A trustworthy result answers:

- What behavior is expected from the operator-facing task?
- Which facts are objective and which require semantic judgment?
- Did the baseline consistently fail for an improvement claim, or consistently
  pass for a non-regression claim?
- Did treatment consistently satisfy the same contract?
- Did the skill change behavior, or was the scenario already passing without it?
- Did every model call, cleanup, artifact check, and review complete with a
  durable receipt?
- Is this evidence authoritative for release gating or diagnostic only?

Static validation proves structure and experiment consistency. Repeated model
execution proves behavior. Deterministic mutation tests prove the grader itself
is not porous. No one layer substitutes for another.

## Core Terms

| Term | Meaning |
| --- | --- |
| Baseline | No target skill for a new skill, or an immutable accepted previous revision for a changed skill. |
| Treatment | The complete current target skill installed at project scope. |
| Improvement | Baseline consistently fails the current contract and treatment consistently passes it. |
| Non-regression | An immutable previous revision consistently passes and the current revision preserves that behavior. |
| Gate | A calibrated scenario whose current result may block delivery. |
| Diagnostic | A valid pressure probe that reports evidence but does not produce release authority. |
| Objective fact | A process, tool, write, path, kind, or artifact-content claim evaluated deterministically. |
| Semantic assertion | A judgment that requires reading the operator response or tool transcript in context. |
| Calibration receipt | Evidence that a scenario is internally consistent and reliably expresses its declared comparison intent. |
| Behavior contract digest | Canonical digest of subject inputs, expected effects, objective checks, semantic assertions, and comparison semantics; excludes mutable suite authority. |
| Evaluation registry | Separate source of truth for `gate | diagnostic | retired`, the current baseline receipt pointer, and freshness. |
| Runner-semantics digest | Canonical digest of the manifest of runner files that can change contract parsing, execution, collection, review, reduction, or reporting semantics. |

RED/GREEN terminology applies only to improvement. Baseline/treatment is the
system-wide vocabulary.

## Requirements

### Scenario Ownership And Contract

R1. Behavioral scenarios live under `tests/<plugin>/<skill>/scenarios/`. Shared
runner code lives under `tests/test-utils/skill-pressure/`. Discovery is
recursive and deterministic, excludes the runner package, rejects duplicate
global IDs, and reports selected, skipped, invalid, and missing scenarios.

R2. Every scenario contract declares:

```text
schema_version
scenario_id
owner_plugin
owner_skill
skill_type: discipline | technique | pattern | reference
effect_surfaces: non-empty subset of response | artifacts | tools
prompt
semantic_assertions with stable assertion_id, criterion, and evidence_surface
behavior_requirement_ids
baseline: no_skill | previous_revision
baseline_revision when baseline is previous_revision
comparison_intent: improvement | non_regression
repetitions: integer >= 3
risk: standard | high
fixture requirements
allowed tools and writes
required and forbidden tool observations
deterministic checks
expected artifacts
```

Expected artifact entries carry stable `artifact_id` values. Contract identity
is the SHA-256 digest of one canonical sorted-key serialization of the complete
versioned behavior contract. One serializer owns that representation. Evaluation
role and the current baseline receipt pointer live in the separate
evaluation registry so promotion or demotion cannot change the experiment it is
authorizing.

R3. Grader-only criteria, expected behavior, comparison intent, and evaluation
role never appear in the subject prompt. The subject receives only the realistic
operator task and neutral harness context.

R4. The contract validator rejects internally contradictory experiments before
any model call, regardless of evaluation role:

- An `artifacts` effect surface requires at least one expected artifact and an
  allowed write path that contains it.
- When `artifacts` is absent, the contract cannot require repository artifacts
  or repository writes.
- A `tools` effect surface names the tool events that are required or forbidden
  and grants only the tools needed to make the task executable.
- Each semantic assertion names one declared evidence surface.
- Expected artifacts and deterministic write checks must fit within the allowed
  write policy.
- Objective requirements belong in structured checks, not only in semantic
  prose.
- A rubric cannot require execution that the fixture, permissions, or allowed
  tools make impossible.

Some prompt/assertion contradictions require judgment rather than static
parsing. A scenario-validity review must therefore verify prompt, assertion,
effect, fixture, and permission consistency before either a gate or diagnostic
scenario can execute. Calibration adds authority; it is not permission to run a
broken diagnostic experiment.

### Baseline, Treatment, And Intent

R5. Baseline and treatment use the same subject provider, exact model, reasoning
effort, operator prompt, fixture, permissions, tool policy, repetition count,
runner-semantics digest, and reviewer route. Their only behavioral-input difference is
the target skill source.

R6. Each side runs three fresh one-shot contexts. The three baseline contexts
run concurrently; after all baseline contexts settle, the three treatment
contexts run concurrently. Review starts only after both batches settle. Every repetition has a
unique disposable Git repository, ACPX session identity, and provider session
identity when exposed. No conversation or provider session is reused across
repetitions. Variance remains visible.

R7. `improvement` permits `no_skill` for a new skill or `previous_revision` for
a changed skill. It passes only when every baseline repetition is
`behavior_fail` under the current complete rubric and every treatment repetition
passes. An all-passing baseline is a non-discriminating experiment, not a
semantic proof gap and not RED.

Artifact-scoped evaluation closes prior grader gaps by rerunning baseline under
the corrected objective checks. A `previous_revision` baseline pins an immutable
skill source. A `no_skill` baseline pins the absence of the target skill and must
run fresh against the exact current model profile; it is not described as an
immutable model output. If baseline output lacks a required field in the
required file, that is an inspectable deterministic failure. The reducer does
not accept a separate reviewer-invented "proof gap" class as a substitute for
failure evidence, and prior porous-grader results cannot be reclassified without
fresh repetitions under the complete contract.

R8. `non_regression` requires `baseline: previous_revision` with an immutable
Git revision. It passes only when every baseline and treatment repetition
passes. A passing no-skill control may remain diagnostic evidence that the task
does not discriminate skill behavior, but it cannot be relabeled as
non-regression.

R9. Mixed baseline or treatment outcomes are `inconclusive`. The system may
report failure rates and qualitative evidence, but it does not convert one
lucky failure or success into a gate result. Scenario pressure may be revised
and recalibrated; the reducer is not weakened to absorb variance.

### Functional Isolation And Execution

R10. Every repetition runs in a fresh disposable Git repository. A repo-owned
TypeScript installer copies the complete regular-file tree rooted at the target
skill into the provider's project skill root. It does not follow links or copy
cross-skill trees merely because the skill mentions them.

R11. The baseline contains no target skill or the exact target skill from the
declared immutable revision. The treatment contains the current target skill.
Receipts record baseline kind, resolved revision when applicable, source and
destination paths, regular files, and content digests.

R12. The repository contains neutral harness instructions. Ambient target skills
are absent. MCP is empty unless the scenario declares an MCP fixture. Credentials
are never copied into the disposable repository or persisted in evidence.

R13. Isolation exists to preserve experimental comparability. The harness is not
a hostile-code sandbox, credential-containment boundary, plugin-command tester,
general MCP contamination suite, or proof of provider internals.

R14. Every authoritative subject and semantic reviewer call uses ACPX. Direct
provider CLI calls are diagnostics only. Runtime receipts capture the requested
and provider-reported model and effort and fail closed on missing, downgraded,
unsupported, or unequal profiles.

### Evidence And Objective Evaluation

R15. The collector records:

- visible operator response;
- ACPX process outcome, model, effort, duration, usage, and session identity;
- tool calls and outputs;
- repository files created, changed, and deleted;
- required and forbidden tool observations;
- expected artifact identity, kind, content, and location;
- skill-load or source-read evidence when exposed;
- visible rationalizations and shortcut decisions;
- timeout, retry, cleanup, transport, and malformed-output failures.

R16. Artifact checks have one typed owner and target either one declared
`artifact_id` or one exact normalized POSIX relative path. They support:

```text
exists
kind equals file | directory
content contains literal
content matches pattern
content excludes literal
content excludes pattern
```

Content checks evaluate only the named artifact. Response prose, another file,
coverage labels, or self-reported compliance cannot satisfy them. Each
`expected_artifacts` entry declares the `artifact_id` referenced by its checks.
Direct path checks remain available for undeclared paths and absence checks. One
file cannot have both artifact and direct-path content owners.

R17. Objective evaluation uses complete collected artifact content before report
bounding. Content within the documented hard ceiling is evaluated in full.
Oversized or unavailable content records size and digest and becomes
`not_evaluated`; it is never silently truncated into a pass. The collector
redacts before persistence and discards non-visible provider reasoning events.

R18. Each supervised ACPX attempt writes an atomic attempt receipt immediately
after process cleanup, before the next attempt begins. A repetition receipt is
written after its accepted attempt, a scenario receipt after reduction, and an
aggregate receipt after suite completion. If a scenario-level deadline fires,
completed attempt and cleanup receipts survive and the aggregate names the
timed-out scenario and last durable stage. The runner-owned scenario deadline
fires before Vitest's outer case timeout and reserves bounded time for process
cleanup and receipt flush.

R19. Process execution has runner-owned wall deadlines, process-group TERM/KILL,
drained streams, and cleanup receipts. ACPX timeout alone is not cleanup proof.

The runner-owned scenario deadline and larger Vitest emergency timeout are
derived from the actual execution graph:

```text
scenario deadline >= critical-path supervised subject attempt budgets
                  + critical-path reviewer command budgets
                  + fixture and receipt budgets
                  + bounded scheduling margin

Vitest timeout >= scenario deadline + cleanup and receipt-flush reserve
```

The calculation accounts for repetition count, retry count, configured
parallelism, command-specific deadlines, reviewer route, and termination grace.
A configured deadline smaller than its bound, or a Vitest timeout that cannot
contain the scenario deadline plus flush reserve, is invalid configuration and
must fail before model execution. Session create, config, and close commands
have bounded control-plane deadlines distinct from the model prompt deadline.

### Semantic Review And Reduction

R20. Deterministic checks evaluate objective facts before semantic review. A
reviewer cannot pass missing artifacts, forbidden writes or tools, process
failure, profile drift, incomplete cleanup, or unavailable required evidence.

R21. A fresh semantic reviewer receives only the hidden semantic assertions and a
bounded evidence packet. It returns strict machine-readable output with one
classification per repetition, assertion-level evidence anchors, visible
rationalizations, and the smallest proposed retest when behavior fails. It does
not receive authoring discussion, expected suite outcome, or another reviewer's
reasoning.

Standard automated review uses fresh ACPX Luna/high. High-risk review uses
fresh ACPX Claude Opus/xhigh. The runtime-profile verifier requires the exact
provider-advertised model ID and declared effort. Parse failure or profile mismatch
fails closed and is never repaired by extracting JSON from prose.

R22. Reviewer output is candidate evidence. The parent validates semantic
classifications against the visible packet and owns gate promotion, accepted
scenario outcomes, and release claims.

R23. The reducer emits:

```text
pass
behavior_fail
inconclusive
infrastructure_error
not_evaluated
```

It applies infrastructure and missing-evidence precedence, then deterministic
evidence precedence, then semantic classifications, then comparison-intent
truth tables. A gate with missing or stale calibration cannot emit an
authoritative pass: it becomes `not_evaluated` with reason
`stale_calibration`. Diagnostic scenarios retain their observed behavioral
outcome but carry no release authority.

For improvement:

```text
baseline all behavior_fail + treatment all pass -> pass
baseline all pass + treatment all pass          -> not_evaluated
either side mixed                               -> inconclusive
treatment all behavior_fail                     -> behavior_fail
```

For non-regression:

```text
baseline all pass + treatment all pass          -> pass
either side mixed                               -> inconclusive
baseline all behavior_fail                      -> not_evaluated
treatment all behavior_fail                     -> behavior_fail
```

Every non-pass carries a machine-readable reason code. At minimum the system
distinguishes non-discriminating improvement baseline, invalid non-regression
control, mixed baseline, mixed treatment, contract contradiction, missing
evidence, repetition mismatch, scenario deadline, runtime profile mismatch,
review parse failure, incomplete cleanup, and stale calibration.

### Calibration And Suite Authority

R24. A scenario must pass contract validation and scenario-validity review
before execution. A valid diagnostic scenario may produce any honest outcome
without becoming a release verdict. Its run still fails for invalid schema,
infrastructure failure, missing selected execution, or incomplete accounting. Behavioral
`pass`, `behavior_fail`, `inconclusive`, and `not_evaluated` remain reported as
evidence rather than being collapsed into process success. Diagnostic suite exit
status represents execution completeness, not behavioral approval, and its
terminal state is `completed_with_findings`, never a release `pass`.

R25. Promotion from `diagnostic` to `gate` requires a parent-accepted calibration
receipt proving:

- contract consistency across prompt, effect surfaces, semantic assertions,
  fixtures, permissions, structured checks, and expected effects;
- a valid baseline policy and immutable previous source when applicable;
- three fresh baseline and three fresh treatment repetitions;
- the declared comparison-intent truth table passes;
- objective checks and semantic assertions each have inspectable evidence;
- exact subject and reviewer profiles are verified;
- all attempts and cleanups are durably receipted;
- runner-wide deterministic mutation coverage rejects malformed evidence for
  every objective check family used by the scenario.

The tracked receipt is the current accepted baseline snapshot for the scenario.
It lives at `tests/<plugin>/<skill>/baselines/<scenario-id>.json`, embeds compact
canonical execution facts and parent acceptance, and is replaced atomically
when a newly accepted skill source is calibrated. Raw transcripts and detailed
attempt, cleanup, repetition, and review receipts remain under ignored `tmp/`.
The working tree never accumulates historical baseline files; Git history owns
historical traceability. The receipt is valid only for its behavior contract
digest, baseline policy, runner-semantics digest, subject profile, review
profile, and accepted skill source digest.

R26. Demotion from `gate` to `diagnostic` requires a parent-accepted decision
citing the exact contract, repetition, review, and aggregate evidence.
Contract contradiction, unstable baseline, reviewer ambiguity, or an execution
budget that cannot support the contract may justify demotion. Treatment failure
or instability during the change currently under evaluation is a failing or
inconclusive gate result, not demotion evidence. Demotion cannot occur as a side
effect of that same run and cannot turn that run green. Demotion clears the
current baseline pointer; it does not append a tracked historical receipt.

R27. The evaluation registry, not scenario frontmatter, owns role and the
current baseline receipt pointer. Authoritative standard and
high-risk suites select fresh `gate` scenarios by default. A separate
calibration command runs valid diagnostics and reports their evidence. Focused
scenario execution can run either role. Reports always state role, calibration
freshness, current baseline state, and whether the result has release
authority.

Registry rows contain `scenario_id`, behavior contract digest, evaluation role,
current baseline receipt path and digest when gated, and current freshness. A gate suite fails unless every selected gate
executes and passes. A diagnostic suite fails on invalid contracts,
infrastructure, missing execution, or incomplete accounting, but preserves
behavioral outcomes as findings.

R28. `behavior_requirement_ids` in scenario contracts are the stable trace keys.
A skill-change spec or requirements/proof matrix names the IDs it claims. A
change cannot claim pressure proof merely because unrelated gates pass: at least
one current calibrated gate must trace to each claimed ID. Otherwise that
requirement remains `not_evaluated`, and reports list the untraced IDs.

### Migration, Reporting, And Cutover

R29. The fixed baseline of 107 legacy scenarios across 23 owners is accounted
for by immutable legacy ID and global scenario ID. Current discovery separately
accounts for scenarios added after that baseline; the initial current tree has
109. Every discovered row ends as `gate`, `diagnostic`, or explicitly retired
with a user-approved reason. Migration may not silently drop or automatically
promote scenarios.

R30. The migration ledger records each scenario's role, behavior contract
digest, behavior requirement IDs, effect surfaces, comparison intent, baseline
kind and revision, risk, calibration receipt or diagnostic reason, and validity
review. Passing no-skill controls, mixed baselines, mixed treatments, contract
contradictions, and infrastructure timeouts remain distinguishable.

R31. The hard cutover remains one-way: the old flat tree, self-grading prompt,
response-regex oracle, legacy shell authority, and duplicate runner are not
restored as fallback. Cutover acceptance requires exact migration and absence
proof; one calibrated improvement gate and one calibrated non-regression gate
through the new path; and per-owner gate-covered and uncovered behavior
requirement IDs. Until those gates pass, the new system is implemented but not
release-authoritative. Uncovered owners remain explicit proof gaps rather than
implied coverage. After cutover there is one contract parser, one reducer, and
one Vitest Evals execution path. A fake backend proves plumbing only.

R32. Every aggregate reports exact discovered, selected, skipped, invalid,
executed, passed, behavior-failed, inconclusive, infrastructure-error,
not-evaluated, timed-out, gate, diagnostic, calibrated, stale-calibration,
demoted-this-run, untraced-behavior-requirement, and missing counts. It never
reports success for a selected scenario that did not execute and never describes
a diagnostic result as a release gate.

## Boundary And Ownership Map

```text
tests/<plugin>/<skill>/scenarios/
  owns: operator prompt, semantic assertions, effect surfaces, expected effects,
        behavior requirement IDs, risk
  exposes: versioned scenario contract
          |
          v
contract validator and evaluation registry
  owns: schema, consistency, global identity, baseline policy, role,
        calibration authority and history
  exposes: valid fresh gates and valid diagnostics
          |
          v
baseline/treatment coordinator
  owns: paired inputs, repetitions, retries, execution-graph budget
  exposes: repetition requests and durable attempt receipts
          |
          +----------------------+
          v                      v
ACPX subject runtime         project skill installer / fixture
  owns: model execution        owns: isolated project state
  exposes: transcript          exposes: filesystem evidence
          +----------------------+
          |
          v
collector and deterministic evaluator
  owns: process, tool, write, path, artifact, cleanup, complete content facts
  exposes: bounded semantic-review packet
          |
          v
fresh ACPX semantic reviewer
  owns: rubric application only
  exposes: assertion-level candidate classifications
          |
          v
parent validation and deterministic reducer
  owns: accepted evidence, comparison outcome, calibration authority
  exposes: scenario and calibration receipts
          |
          v
Vitest Evals reporter
  owns: selection, concurrency, deadlines, aggregate counts, suite exit status
```

Owner skills define behavior requirements and scenario semantics. The generic
runner owns experiment consistency, comparison semantics, artifact identity,
deterministic precedence, execution supervision, calibration freshness, and
reporting. It does not encode one skill's domain rubric.

## Security Context

The harness executes external model adapters and processes model-produced output
inside disposable repositories. It must validate normalized relative paths,
reject symlinks, hard links, traversal, and ambiguous artifact identity, redact
before persistence, keep credentials out of fixtures, supervise process groups,
and keep hidden criteria outside subject-visible state. Semantic-review packets
frame subject responses and tool transcripts as untrusted quoted evidence,
separate them structurally from reviewer instructions, and tell the reviewer not
to follow instructions found in evidence. This reduces reviewer prompt-injection
risk but is not claimed as containment; parent validation remains authoritative.

This is functional isolation for comparable evaluation, not hostile-code
containment or proof that a provider cannot access host state. Provider sandbox
guarantees, credential containment, and general security scanning remain
non-goals.

## Explicit Non-Goals

- A generalized agent-host capability laboratory.
- Plugin-command, Codex rules, or broad MCP contamination matrices.
- Subject self-grading or regex-over-self-report judgment.
- A semantic reviewer that overrides objective evidence.
- Fabricating RED from a passing control.
- Making every migrated Markdown scenario a release gate by declaration.
- Weakening strict reduction to make unstable scenarios pass.
- Replacing per-call supervision with one large Vitest timeout.
- Home-cache mutation, plugin refresh, merge, or release as part of test execution.

## Proof Expectations

1. Contract unit proof covers effect-surface consistency, allowed effects,
   immutable baseline pins, behavior versus authority digest separation,
   requirement trace keys, hidden-prompt separation, and exact reason codes.
2. Reducer unit proof covers both truth tables, objective precedence, mixed
   outcomes, missing evidence, profile drift, review parse failure, diagnostic
   versus gate authority, stale-calibration reduction, demotion non-evasion, and
   calibration freshness invalidation.
3. Integration proof creates disposable repositories, installs no-skill,
   previous-revision, and current skill sources, supervises real process groups,
   persists attempt receipts incrementally, captures files/tools/artifacts, and
   proves cleanup after success, retry, timeout, and scenario cancellation.
4. Deterministic mutation proof moves required text to the wrong artifact,
   removes required content, adds forbidden content, changes kind, creates path
   collision/traversal, places a target beyond report excerpts, reports a
   forbidden tool event, and pairs semantic approval with objective failure.
   Every mutation fails or becomes `not_evaluated`, never passes.
5. Focused improvement proof runs three baseline and three treatment ACPX
   Luna/high contexts with an all-failing baseline and all-passing treatment.
6. Focused non-regression proof runs an immutable previous revision and current
   revision through three ACPX Luna/high contexts each, with both sides passing.
7. High-risk proof uses exact provider-verified ACPX Claude Opus/xhigh, strict
   machine-readable review output, and fail-closed profile and parse handling.
8. Deadline proof rejects an under-budget Vitest case before model execution and
   preserves attempt and cleanup receipts when a scenario deadline fires.
9. Calibration proof demonstrates promotion without digest circularity,
   treatment-change freshness, stale-calibration invalidation, parent-accepted
   demotion that cannot green the current run, diagnostic non-authority, and
   gate-only suite selection.
10. Migration proof accounts for the 107 legacy scenarios across 23 owners and
    all post-baseline scenarios, with no unclassified rows, explicit uncovered
    requirement IDs, and old runner/schema absence.
11. Final delivery proof includes unit, integration, mutation, focused
    improvement, focused non-regression, calibrated standard gates, calibrated
    high-risk gates, implementation review, and fresh PR readiness. Diagnostic
    outcomes are reported separately and cannot be cited as passing gates.

## Separability And Planning Inputs

The implementation plan may separate these contracts as independently provable
slices:

```text
behavior contract + separate evaluation registry
comparison reducer + calibration authority
objective evidence + mutation grader proof
ACPX subject/reviewer execution + incremental receipts
derived execution budgets + cancellation proof
gate/diagnostic Vitest selection + aggregate reporting
107-row legacy accounting + post-baseline calibration and disposition
```

The plan must preserve dependency direction: scenario contracts feed execution;
execution feeds evidence; objective evaluation feeds semantic review; review and
deterministic facts feed reduction; reduction feeds calibration and reporting.
No reporting or migration shortcut may manufacture upstream evidence.

## Open Questions

None. Promotion and demotion authority, no-skill versus previous-revision
baseline proof, diagnostic validity, calibration freshness, requirement
traceability, reviewer evidence isolation, migration accounting, and execution
budgets are explicit planning inputs.
