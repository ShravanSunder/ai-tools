# Skill Pressure Testing System Spec

Status: superseded by
`docs/specs/2026-07-13-skill-pressure-behavior-evaluation-system/2026-07-13-skill-pressure-behavior-evaluation-system.md`

## Decision Summary

The system measures whether a skill makes a mini model follow the intended
workflow under realistic shortcut pressure. It does not test whether the model
can summarize the skill, and it is not a general agent-isolation laboratory.

Each behavioral scenario is a baseline/treatment evaluation with one declared
comparison intent:

```text
same scenario, model, reasoning, fixture, permissions, and comparison intent
  |
  +-- baseline: no skill for a new skill, or accepted previous version
  |
  +-- treatment: current skill installed at project scope
  |
  +-- collect actual response, tools, files, artifacts, and rationalizations
  |
  +-- parent review or fresh-context blind reviewer
  |
  +-- reduce consistent improvement or preserved non-regression
```

`improvement` asks whether a demonstrated failure or proof gap becomes
consistently correct. `non_regression` asks whether an already-passing control
remains consistently correct. RED/GREEN terminology applies only to
`improvement`; baseline/treatment is the architecture-wide vocabulary.

Vitest Evals remains the only authoritative runner. Every authoritative subject
and model reviewer call uses ACPX. The default subject is GPT-5.6 Luna at xhigh.
Additional provider coverage is scenario-declared rather than another implicit
default. High-risk skill changes require an outside Claude Opus reviewer at
xhigh reasoning, with the provider-reported model and effort captured in the
review receipt.

All 107 active scenarios move from the flat `tests/skills/` tree into their
owners under `tests/<plugin>/<skill>/`. The old self-grading JSON prompt,
regex-over-self-report oracle, legacy reducer, and parallel runner are removed
in a hard cutover.

## Product Intent

Skill maintainers need trustworthy evidence that skill wording changes agent
behavior. A useful pressure result answers:

- Does a mini model fail or rationalize without the guidance?
- Does the same model follow the skill when the guidance is present?
- Does the behavior hold across at least five fresh contexts?
- Does the skill work under urgency, authority, sunk cost, fatigue, ambiguity,
  or an invitation to treat the task as obvious?
- Does a technique transfer to a fresh but similar task?
- Does a pattern skill recognize both applications and counterexamples?
- Does a reference skill retrieve and correctly apply the referenced detail?
- What rationalization still leaks, and what is the smallest wording change that
  should be retested?

Static validation proves structure only. It cannot prove behavior.

## Skill-Type Proof

| Skill type | Pressure proof |
| --- | --- |
| Discipline | The rule holds under combined shortcut pressures and rationalizations are rejected. |
| Technique | The technique transfers to a fresh, similar task without handholding. |
| Pattern | The model recognizes correct use and counterexamples. |
| Reference | The pointer retrieves the right detail and the model applies it correctly. |
| Mechanical | Structural validation only; do not invent behavioral pressure proof. |

## Requirements

### Scenario Ownership And Discovery

R1. Behavioral scenarios live under `tests/<plugin>/<skill>/`. Shared runner code
lives under `tests/test-utils/skill-pressure/`.

R2. Discovery is recursive, deterministic, and excludes the runner's own package.
Every `scenario_id` is globally unique. Selected, skipped, and invalid scenarios
are reported explicitly.

R3. Every scenario declares:

```text
scenario_id
owner_plugin
owner_skill
skill_type: discipline | technique | pattern | reference
prompt
hidden_rubric
baseline: no_skill | previous_revision
comparison_intent: improvement | non_regression
repetitions: integer >= 5
risk: standard | high
fixture requirements
allowed tools and writes
deterministic checks
expected artifacts
```

This hard cutover advances the scenario contract to `schema_version: 2`.
`comparison_intent` is required rather than defaulted: every migrated scenario
must be classified deliberately as `improvement` or `non_regression`. Contract
identity is the SHA-256 digest of one canonical sorted-key serialization of the
complete versioned contract. One contract serializer owns that representation.

R4. Grader-only criteria, failure signals, and expected behavior never appear in
the subject prompt. The subject sees only the realistic operator prompt and
neutral harness context.

### Baseline And Treatment Subject Runs

R5. Every behavior-changing scenario runs baseline before treatment. A new skill
uses a no-skill baseline. A materially changed skill uses the accepted previous
skill source from an immutable Git revision.

- `improvement` requires a demonstrated baseline failure or explicitly
  classified proof gap before treatment can prove improvement.
- `non_regression` requires a consistently passing previous-revision baseline
  before the current treatment can prove preservation. It must not relabel a
  passing control as RED or fabricate a baseline failure.

R6. Baseline and treatment use the same subject provider, exact model, reasoning
effort, operator prompt, fixture, permissions, tool policy, repetition count,
and runner version. Their only behavioral-input difference is the selected skill source.
`comparison_intent` participates in the scenario contract digest, pair receipt,
result receipt, and report; changing it produces a different evaluation
contract rather than changing either subject input.

R7. Each side runs at least five fresh one-shot contexts. Every repetition has a
unique disposable repository, ACPX session identity, and provider-side session
identity when the provider exposes one. No subject conversation or provider
session is reused across repetitions. A shared ACPX installation or adapter
process may provide transport only; it may not provide conversational state.
Variance is part of the result, not noise to hide.

R8. All authoritative subject runs use ACPX. Defaults:

- Codex: GPT-5.6 Luna/xhigh.
- Other provider/model coverage: explicit scenario configuration with no
  implicit fallback.

Direct Codex or Claude CLI calls are diagnostics only.

R9. The subject returns the normal operator-facing response. It is never asked
to report `skill_invoked`, grade itself, quote expected behavior, or produce a
compliance schema.

### Minimal Functional Isolation

R10. Every repetition runs in a fresh disposable Git repository. The harness
installs the selected skill source into the provider's project skill root with a
repo-owned TypeScript installer.

R11. The treatment contains only the complete regular-file tree rooted at the
target skill directory, including its real reference files and scripts.
The baseline contains no target skill or the selected previous version. The
installer does not follow links or copy cross-plugin skill trees merely because
the skill mentions them. It receipts source, destination, regular files, and
content digests.

R12. The repository contains neutral harness instructions. Ambient skills are
disabled when the host would otherwise inject them. MCP is empty unless the
scenario explicitly needs an MCP fixture. Grader criteria remain unavailable to
the subject.

R13. Isolation exists only to keep baseline and treatment comparable. The harness is not
a hostile-code sandbox, credential-containment boundary, plugin-command tester,
exec-policy rules tester, generalized MCP contamination suite, or proof of
provider internals.

R14. The harness does not copy credentials into the disposable repository or
persist secret environment values. Subject effects remain inside disposable
fixtures or explicit test doubles.

### Evidence Collection

R15. The collector records evidence that can demonstrate performance:

- visible operator response;
- ACPX process outcome, model, reasoning, duration, and usage;
- tool calls and outputs;
- files created, changed, or deleted;
- required artifact existence, type, content, and location;
- skill-load or source-read evidence when the provider exposes it;
- rationalizations and shortcut decisions visible in the transcript;
- timeout, cleanup, transport, and malformed-output failures.

Artifact checks have one typed owner and target either one declared
`artifact_id` or one exact normalized POSIX relative path. They support:

```text
exists
kind equals file | directory
content contains literal
content matches pattern
content excludes literal
content excludes pattern
```

The versioned contract represents literal containment and exclusion separately
from pattern matching and non-matching; scenario authors never escape a literal
into a regular expression merely to express absence.

Content comparisons evaluate only the named artifact. Surrounding response
prose, another artifact, coverage labels, or self-reported compliance cannot
satisfy them. Path normalization and artifact identity prevent one artifact
from impersonating another. Content and kind checks for a path declared in
`expected_artifacts` must address its `artifact_id`; direct `path:` facts remain
available for undeclared repository paths and absence checks. A scenario may not
create both artifact and direct-path content owners for the same file.

R16. Objective evaluation uses the complete collected content of the owned
artifact before report bounding. The evidence collector owns evaluation-time
content and enforces one documented hard byte ceiling; the report normalizer
owns bounded persisted excerpts. Content within the ceiling is evaluated in
full. Content above the ceiling is recorded as unavailable with its digest and
size and becomes `not_evaluated`, never silently truncated for evaluation.
Missing content, unsupported file kinds, ambiguous identity, or unavailable
content fail closed as `behavior_fail` or `not_evaluated`; they never pass.

The collector redacts before persistence. It retains bounded report evidence
and safe digests, not raw secrets or hidden chain-of-thought. Only
operator-visible responses and explicit tool/protocol events enter evidence;
provider reasoning events that are not operator-visible are discarded rather
than transformed into report content.

R17. Process execution has a runner-owned wall timeout, process-group TERM/KILL
cleanup, drained streams, and a cleanup receipt. ACPX's own timeout is not the
runner's cleanup guarantee.

### Review And Reduction

R18. Each scenario result is reviewed through one of two routes:

1. Parent review: the parent reads every repetition transcript and evaluates the
   hidden rubric.
2. Blind review: a fresh-context subagent or model receives only the rubric and a
   bounded result packet. It does not receive the authoring discussion, expected
   conclusion, or another reviewer's reasoning.

Reviewer output is candidate evidence. The parent validates and owns the final
result.

R19. High-risk scenarios require blind outside review through ACPX Claude Opus at
xhigh reasoning. Standard scenarios may use parent review or a fresh blind
reviewer. Automated unattended runs use blind review. Requested configuration
is not proof of active configuration: the receipt must capture the exact
provider-reported model and effort. A missing, rejected, downgraded, or
unverified required configuration fails closed as `infrastructure_error` or
`not_evaluated` and may not be described as the requested reviewer.

The runtime-profile verifier owns this decision. Each repetition and review
receipt records requested model and effort, provider-reported model and effort,
and a verification result. The profile declares the accepted provider-reported
model identifier rather than comparing a friendly alias such as `opus` to a
resolved identifier. A required field that is null, unsupported, or unequal to
the profile makes the run `infrastructure_error` before semantic reduction.

R20. Deterministic checks outrank semantic review for objective facts. A reviewer
cannot pass a run when a required file is absent, a forbidden action occurred,
the process failed, or evidence is missing.

R21. The reducer emits:

```text
pass
behavior_fail
inconclusive
infrastructure_error
not_evaluated
```

Reduction first applies infrastructure and missing-evidence precedence, then
deterministic evidence precedence, then comparison-intent semantics. A semantic
reviewer cannot override an objective artifact failure.

For `improvement`:

```text
baseline all behavior_fail + treatment all pass -> pass
baseline all pass + treatment all pass          -> not_evaluated
either side mixed                               -> inconclusive
treatment all behavior_fail                     -> behavior_fail
```

The all-passing baseline result is a proof gap, not improvement. A baseline
proof gap classified by semantic review may still use `improvement`, but the
result can pass only when the receipt makes that baseline classification and
the closed proof gap inspectable; it may not be inferred from an already-passing
equivalence control.

For `non_regression`:

```text
baseline all pass + treatment all pass          -> pass
either side mixed                               -> inconclusive
baseline all behavior_fail                       -> not_evaluated
treatment all behavior_fail                      -> behavior_fail
```

The consistently failing baseline is an invalid control. Mixed or highly
variant repetitions are `inconclusive`, never a lucky pass.

Every non-pass reduction carries a machine-readable `reason_code`. At minimum,
`improvement_baseline_already_passed`, `invalid_non_regression_control`,
`missing_evidence`, `repetition_count_mismatch`, `mixed_baseline`,
`mixed_treatment`, and `runtime_profile_unverified` remain distinguishable in
receipts, reports, and aggregate counts even when more than one maps to
`not_evaluated` or `inconclusive`.

R22. Rationalizations are first-class evidence. Reports record the excuse,
behavior risk, smallest proposed wording change, and retest target.

### Vitest Evals And Reporting

R23. Vitest Evals owns scenario enumeration, selection, execution, parallelism,
timeouts, retries for infrastructure failures, and aggregate reporting. It does
not delegate final truth to subject self-reporting.

R24. The runner supports:

```text
--fast
--scenario <global-id>
--jobs <count>
--serial
```

Focused scenario runs remain serial. Full runs may parallelize independent
repetitions with bounded concurrency.

R25. Every result artifact includes scenario identity, comparison intent,
baseline/treatment source digests, exact model/runtime configuration, repetition
receipts, deterministic facts, review receipt, rationalizations, comparison
outcome, reason code, and reasons.

R26. The suite reports exact selected, skipped, invalid, executed, passed,
behavior-failed, inconclusive, infrastructure-error, and not-evaluated counts.
It never reports success for a selected scenario that did not execute.

### Migration And Cutover

R27. All 107 active scenarios across 23 owners are accounted for by immutable
legacy ID and new global scenario ID. Retirement requires an explicit user
decision; migration may not silently drop scenarios.

The migration receipt preserves the fixed legacy baseline as
`active + explicitly_retired = 107`. Each retirement records the legacy ID and
decision reason; the active count may change without erasing baseline
accounting.

R28. The old flat scenario tree, self-grading prompt schema, regex reducer,
legacy shell authority, and duplicate runner are removed only after migrated
discovery proves exact accounting of all 107 legacy scenarios as active or
explicitly retired.

R29. After cutover there is one authoritative reducer and one Vitest Evals
execution path. A fake backend may test plumbing but cannot prove behavior.

## Boundary And Ownership Map

```text
tests/<plugin>/<skill>/
  owns: realistic prompts, hidden rubrics, skill type, fixtures, risk
  exposes: scenario cases
          |
          v
scenario discovery and contracts
  owns: validation, global IDs, selection, migration accounting
  exposes: validated cases
          |
          v
baseline/treatment coordinator
  owns: paired inputs, repetitions, fresh contexts, comparison fingerprint
  exposes: repetition requests and paired receipts
          |
          +--------------------+
          v                    v
ACPX subject runtime       repo installer / fixture
  owns: model call           owns: project skill state
  exposes: transcript        exposes: filesystem state
          +--------------------+
          |
          v
collector and deterministic checks
  owns: process/tool/file/artifact facts, full evaluation content, redaction
  exposes: bounded result packet
          |
          v
parent or blind reviewer
  owns: rubric application only
  exposes: candidate semantic findings
          |
          v
deterministic reducer and Vitest reporter
  owns: comparison-intent semantics, final outcome, machine-readable reasons,
        variance, rationalizations, counts
```

Owner skills define semantic rubrics and artifact obligations. The generic
runner owns comparison semantics, artifact identity and scoping, deterministic
precedence, and mutation-proof primitives; it never encodes one skill's
caller-allocation or lane rubric.

## Explicitly Removed Architecture

The following are not part of this system:

- five-source poison matrices;
- plugin-command poison tests;
- Codex `.rules` suppression tests;
- generalized MCP poison tests;
- provider capability matrices unrelated to scenario execution;
- a global capability gate that prevents real scenarios from running;
- extensive model-visible prompt/config inventory digests;
- hostile adapter or provider containment claims;
- broad symlink, hard-link, submodule, and transitive ownership security systems;
- global owner-risk inventories when scenario `standard | high` is sufficient;
- mandatory independent model judgment when the parent reviews every transcript;
- subject self-grading JSON.

## Security Context

The harness executes external model adapters and processes untrusted model
output inside disposable repositories. Its security responsibility is bounded:

- validate normalized repository-relative artifact paths before reading;
- reject unsupported symlinks, hard links, traversal, and ambiguous artifact
  identity rather than following them;
- redact persisted evidence and never copy credentials into fixtures;
- supervise process groups and prove cleanup after timeout or failure;
- keep hidden rubrics and deterministic criteria outside subject-visible state.

This is functional isolation for comparable evaluations, not hostile-code
containment or proof that a provider cannot access host state. Security scanning,
credential containment, and provider sandbox guarantees remain explicit
non-goals.

## Proof Expectations

1. Unit proof covers scenario validation, hidden-prompt separation, pair identity,
   both comparison-intent truth tables, intent participation in digests and
   receipts, schema-version hard cutover, machine-readable reason codes, reducer
   precedence, variance, rationalizations, deterministic checks, and exact
   migration accounting.
2. Integration proof creates disposable repositories, installs baseline and
   treatment skills, supervises real processes, captures files/tools/artifacts,
   evaluates complete owned artifact content before report bounding, and proves
   cleanup.
3. Behavioral smoke runs one `improvement` scenario through five baseline and
   five treatment ACPX Luna contexts and demonstrates material improvement.
4. Non-regression smoke runs one already-passing control through five baseline
   and five treatment ACPX Luna contexts and preserves the passing behavior.
5. Fast deterministic mutation tests prove grader porosity independently of
   model variance. They mutate one objective property at a time: required text
   in the wrong artifact, missing content, forbidden content, wrong kind,
   normalized-path collision or traversal, a target beyond the report excerpt,
   and semantic approval paired with deterministic failure. Every mutation must
   fail or become `not_evaluated`, never pass.
6. Blind-review smoke sends only rubric plus bounded results to a fresh reviewer.
7. High-risk smoke uses verified ACPX Claude Opus/xhigh and fails closed when the
   requested model or effort is unavailable, rejected, downgraded, or unreported.
8. Migration proof reports all 107 legacy scenarios across 23 owners as active
   or explicitly retired before the old runner is removed.
9. Final proof includes all of these gates:
   - unit suite;
   - integration suite;
   - focused improvement behavior;
   - focused non-regression behavior;
   - standard scenario suite;
   - high-risk scenario suite;
   - implementation review;
   - PR-readiness checks.

Skill-specific semantic omission matrices belong to the owning skill's
scenarios and tests. The generic runner owns comparison semantics, artifact
identity/scoping, deterministic precedence, and mutation-proof primitives; it
does not encode the `skills-creation` lane or caller-allocation rubric.

## Open Questions

None. This revision reflects the confirmed product intent: pressure-test skill
behavior on mini models, preserve honest passing controls, and prove artifact
allocation without turning the runner into a general agent-host capability
laboratory.
