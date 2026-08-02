# Skill pressure evaluator program design

Governing specification: [Focused skill pressure evaluators](./2026-08-02-skill-pressure-evaluators.md)

## Smallest complete system

```text
Vitest 4
  -> Vitest Evals describeEval / native case API
      -> declarative SkillPressureCase
          -> subject harness -> injected ACPX runner -> Luna high
              -> normalized HarnessRun
          -> deterministic Vitest Evals evaluators
              fail -> native failed row
              pass -> Terra semantic evaluator
                  -> ACPX fresh session -> Terra medium
          -> vitest-evals/reporter
```

There is no custom test scheduler or reporting runner. The repository supplies cases, one injected ACPX agent runner, separate subject/judge setups, a subject adapter, and evaluators to the native libraries.

## Structural crux and selected direction

The crux is where evaluator orchestration lives without leaking evaluation policy into subject execution or duplicating Vitest.

The selected direction uses recorded deterministic evaluators with explicit Vitest Evals matchers inside each native scenario case. Each deterministic matcher runs with `threshold: null`, which records its native score without failing fast. A case-local recorder retains the returned `JudgeResult`; after every deterministic evaluator runs, one named `DeterministicGateEvaluator` reduces those recorded results and fails the row through a native hard matcher when any score is not passing. Terra is invoked only after that gate passes.

Suite-level automatic judges were rejected for this slice because Vitest Evals 0.15 applies them concurrently; Terra would run even when a deterministic evaluator failed. A custom runner was rejected because Vitest already owns scheduling and reporting. A Voyager-style cached projection layer was rejected because one scenario produces one result row.

Revisit this choice only if Vitest Evals gains ordered conditional evaluator groups or a scenario must produce independently selectable evaluator rows.

## Components and ownership

```text
skill pressure evaluation system
  scenario case catalog
    owns: skill-folder registry coverage and stable scenario identity
    consumes: colocated .md fixtures and named cases.ts registry
    changes when: scenario authoring rules change

  ACPX agent runner
    owns: fresh session lifecycle, explicit temporary app-server configuration, model/effort application, and raw ACP event capture
    consumes: prompt plus caller-supplied typed setup
    changes when: ACPX or provider transport changes

  runtime configuration
    owns: default and environment-overridden subject/judge model, effort, permissions, timeout, and optional profile-equivalent adapter configuration
    changes when: test execution policy changes

  subject harness
    owns: one configured subject execution and normalized observation construction
    consumes: subject input only
    changes when: Luna transport or observation evidence changes

  deterministic evaluators
    own: objective pass/fail decisions over normalized evidence
    consume: HarnessRun plus evaluator-bound expectations
    change when: objective contracts change

  semantic evaluator
    owns: criteria-level semantic classification and inconclusive reduction
    consumes: HarnessRun plus evaluator-bound semantic criteria
    changes when: semantic evaluation policy changes

  semantic judge harness
    owns: one request through the injected judge runner and response parsing
    consumes: judge prompt only
    changes when: judge transport or model configuration changes

  native eval suite
    owns: composition of cases, subject harness, ordered evaluator calls
    delegates: scheduling/reporting to Vitest and Vitest Evals
    changes when: native library composition APIs change
```

## Dependency and information boundaries

```text
.md fixtures ───────────────> SkillPressureInput ─────> subject harness
                                                         │
                                                         ▼
cases.ts registry ──> bound evaluator definitions ──> HarnessRun
                                                         │
                               ┌─────────────────────────┴────────────┐
                               ▼                                      ▼
                    deterministic evaluators                 semantic evaluator
                                                                      │
                                                                      ▼
                                                            Terra judge harness
```

Allowed edges:

- The case catalog may combine fixture-derived subject input and evaluator definitions into one `SkillPressureCase` for test registration.
- The native eval suite passes only `case.input` to `run()`.
- Evaluator factories may close over their own expectations and criteria.
- Evaluators may read the normalized run, output, tool calls, and artifacts.
- The semantic evaluator may call only the Terra judge harness through `context.runJudge()`.

Forbidden edges:

- Subject input or the subject harness must not receive the case's evaluator definitions.
- Evaluators must not call the subject harness or ACPX Luna.
- The Terra judge harness must not read scenario files or choose criteria.
- Case discovery must not schedule work or call models.
- Repository code must not replace Vitest filtering, concurrency, timeout, or reporting.

These edges are enforced through separate input/evaluation types, evaluator closures, unit tests, and call-count integration evidence. The TypeScript library is rooted at `tests/skills/lib/skill-pressure-evaluation/`, with responsibility folders `agent-execution/`, `runtime-configuration/`, `scenario-cases/`, `subject-execution/`, and `evaluators/{deterministic,semantic}/`.

## Proposed call-path delta

```text
CURRENT
Vitest
  -> describeEval
  -> manual case registration loop
  -> run(SkillPressureCase)
  -> subject harness receives the whole case
  -> ACPX/Codex Luna
  <- harness output
  -> plain deterministic/regex assertions
  <- ordinary Vitest pass/fail

PROPOSED
Vitest
  -> describeEval
  -> native data-driven concurrent cases                 [changed]
  -> run(SkillPressureInput)                              [changed]
  -> subject harness receives subject input only          [changed]
  -> ACPX/Codex Luna                                      [unchanged, one call]
  <- normalized HarnessRun                                [changed evidence shape]
  -> toSatisfyJudge(deterministic evaluator, threshold:null) [added]
       -> record each native JudgeResult                    [added]
  -> toSatisfyJudge(DeterministicGateEvaluator)             [added]
       fail -> native failed row; no Terra                  [added]
       pass -> toSatisfyJudge(Terra evaluator)              [added]
           -> context.runJudge                            [added]
           -> fresh ACPX Terra-medium session             [added]
           <- parsed JudgeResult                          [added]
  <- one row through vitest-evals/reporter                 [changed reporting]
```

The current path is anchored by `tests/skills/evals/skill-pressure.eval.ts`, `tests/skills/lib/skill-pressure-harness.ts`, and `tests/skills/lib/pressure-assertions.ts`. The native evaluator behavior is anchored by Vitest Evals 0.15 `describeEval`, `toSatisfyJudge`, `createJudge`, and `createJudgeHarness`.

## Case and evaluator interfaces

```ts
interface SkillPressureCase {
  readonly id: string;
  readonly name: string;
  readonly tags: readonly string[];
  readonly input: SkillPressureInput;
  readonly deterministicEvaluators: readonly SkillPressureEvaluator[];
  readonly semanticEvaluator: SkillPressureEvaluator;
}

interface SkillPressureInput {
  readonly scenarioId: string;
  readonly skillUnderTest: string;
  readonly mode: "fast" | "integration" | "baseline";
  readonly prompt: string;
}
```

`SkillPressureEvaluator` is the repository name for a typed Vitest Evals `Judge` used as an evaluator. Both deterministic and model-backed evaluators return the native `JudgeResult` shape so `toSatisfyJudge` records their name, score, rationale metadata, and failure status on the same test task.

The case loader validates the skill-folder registry and projects each parsed Markdown fixture into the exact four-field `SkillPressureInput`. Grader sections, failure signals, regexes, artifact expectations, criteria, and scores remain on the evaluation side and cannot reach the subject harness. Criteria are bound when evaluators are constructed.

Scenario folders for `discuss-pathfinding`, `spec-design`, `program-design`, and `spec-program-review` require a named `cases.ts` registry entry for every Markdown fixture; missing registries, missing entries, and orphan entries fail collection. Scenarios for other skills remain eligible for the legacy path during this slice.

## Evaluation state and failure flow

```text
collected
  -> subject-running
      -> execution-error --------------------------> failed test
      -> observed
          -> deterministic-evaluating
              -> deterministic-failed ------------> failed eval row
              -> deterministic-passed
                  -> semantic-evaluating
                      -> pass ----------------------> passed eval row
                      -> fail ----------------------> failed eval row
                      -> inconclusive --------------> failed eval row + artifact
```

The test attempt owns this transient state; nothing persists across retries, workers, shards, files, or later invocations. Independent scenario cases may run concurrently under Vitest. Evaluators within one case are ordered only by the deterministic gate. There is no retry, shared cache, cross-case coordination, or partial success.

Luna execution errors propagate as test errors. Deterministic evaluator scores are recorded through non-failing native matchers, then `DeterministicGateEvaluator` fails the row natively before Terra when any score is not passing.

The semantic evaluator is the singular writer of `semantic-judge.json` beside the subject artifacts. The record contains scenario identity, overall and per-criterion dispositions, evidence excerpts, Terra rationales, validation errors, the subject response and normalized tool evidence, artifact path through evaluator metadata, and the smallest suggested follow-up. Terra transport errors, malformed responses, missing criteria, or insufficient evidence reduce to inconclusive and fail the evaluator. Artifact-write failure propagates as a test error and never launches another judge. Cleanup closes the Terra session; cleanup failure does not launch another judge.

## Requirement realization and proof seams

| Requirement | Owner and realization | Proof seam |
| --- | --- | --- |
| R1 | Native eval suite calls the subject harness once; evaluator types expose no subject-run operation | Harness invocation counter in integration proof |
| R2 | `SkillPressureInput` excludes evaluator definitions; bound evaluator closures retain criteria | Unit boundary inspection and rendered-prompt inspection |
| R3 | Deterministic and semantic checks use named native `Judge` objects and `toSatisfyJudge` | Evaluator unit tests and reporter metadata |
| R4 | Non-failing native matchers record every deterministic result; a named deterministic gate evaluator runs before the Terra matcher | Early deterministic-failure integration case showing all deterministic results and zero Terra calls |
| R5 | Semantic evaluator makes one `context.runJudge` call through the ACPX harness | Judge-harness call count and model/reasoning configuration evidence |
| R6 | Semantic evaluator maps malformed/uncertain results to inconclusive and owns the complete evidence artifact | Unit cases plus artifact inspection |
| R7 | Vitest/Vitest Evals retain scheduling, filtering, timeout, task metadata, and reporter ownership | Native filtered/concurrent invocation and terminal output |
| R8 | Case catalog requires complete named folder registries for the four named skills and preserves legacy eligibility outside them | Loader unit tests for valid, required-missing, legacy-missing, duplicate, missing-entry, and orphan-entry cases |

Real boundaries in live proof are ACPX/Codex Luna and ACPX Terra. Unit tests may replace both transports while exercising case loading, evidence normalization, evaluator reduction, call ordering, and reporting metadata. A fake backend proves plumbing only.

## Complexity deliberately not spent

- No package or public API outside `tests/skills/`.
- No general scenario lifecycle abstraction.
- No target scopes, projections, replay, provenance policy, run cache, or cross-run identity.
- No aggregate or weighted scoring.
- No custom CLI selection environment variables for the new cases.
- No automated owner-agent or second-judge escalation.

The owning maintainer pays the accepted debt that the eight in-scope scenarios use a focused typed shape while unrelated legacy scenarios retain their existing path. The revisit signal is conversion of another skill or evidence that the split path makes the suite harder to understand than a full cutover.
