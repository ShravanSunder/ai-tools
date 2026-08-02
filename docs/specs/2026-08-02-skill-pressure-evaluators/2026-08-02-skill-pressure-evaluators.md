# Focused skill pressure evaluators

## What must improve

The current pressure suite can execute a skill scenario and apply deterministic assertions, but its semantic oracle is largely self-reported fields and regular-expression matching. That can prove literal structure while missing whether the skill actually understood ambiguity, preserved scope, or helped the human make a decision.

The desired system keeps the existing repository-local pressure harness and adds a declarative evaluator layer. Each scenario produces one subject observation and one native result containing every relevant evaluator outcome.

```text
scenario case
  -> injected ACPX subject runner executes Luna high once
      -> one normalized observation
          -> deterministic evaluators
              fail -> failed result; Terra is not called
              pass -> one Terra medium semantic evaluator
                          -> pass | fail | inconclusive
          -> one Vitest Evals result row
```

The consumers are skill authors reading scenario results and the owning agent deciding what a failure means. The system under evaluation is opaque at this level: Vitest selection enters it with one scenario, and one enriched evaluation result exits it.

```text
skill author ── authors scenario/evaluators ──> [pressure evaluation system]
                                                      │
Vitest ─────── selects and executes cases ────────────┤
                                                      │
owning agent <── reads result, rationale, evidence ───┘

outside the boundary: skill implementation, model-provider policy,
cross-run governance, acceptance of a skill change
```

## Required behavior

### R1 — One subject execution

For each selected scenario, the system MUST execute the configured subject exactly once through an injected ACPX runner and apply all selected evaluators to the resulting observation. The default subject setup is Luna high. Evaluators MUST NOT invoke the subject harness.

Failure condition: any evaluator causes another Luna execution or a selected scenario produces evaluator-specific subject runs.

Basis: U1.

### R2 — Evaluation criteria stay outside subject input

The subject harness MUST receive only the scenario input needed by Luna. Deterministic expectations, semantic criteria, expected outcomes, scores, and thresholds MUST remain evaluator-only information.

Failure condition: rendered subject input or normalized subject output contains evaluator criteria that were not part of the authored user scenario.

Basis: U3.

### R3 — Evaluators own assessment

Every quality assessment MUST be represented as a named Vitest Evals evaluator. The subject harness may execute and normalize evidence but MUST NOT determine pass, fail, score, or rationale.

Deterministic evaluators MUST inspect stable observable evidence. Literal or regular-expression checks MAY be used only when literal text is itself the contract. Semantic obligations MUST use the Terra evaluator.

Basis: U2 and U4.

### R4 — Deterministic evaluation gates Terra

The system MUST complete the scenario's deterministic evaluators before invoking Terra. If any deterministic evaluator fails, the scenario MUST fail without a Terra call.

Basis: U1 and U2.

### R5 — One bounded semantic judgment

When deterministic evaluation passes, the system MUST invoke the injected judge runner through one fresh ACPX session. The default judge setup is `gpt-5.6-terra` with `reasoning_effort=medium`. One judge call MUST evaluate all semantic criteria for the scenario.

Subject and judge execution setup MUST be caller-supplied typed data. Model, reasoning effort, permissions, and timeout MUST be changeable without editing harness internals. Until `codex-acp` can apply Codex profiles to app-server, optional profile-equivalent app-server configuration and provider selection MUST be explicit caller-owned configuration rather than an implicit profile read. Both default runners MUST use ACPX; the four-skill path has no direct `codex exec` transport.

The semantic result MUST contain a disposition and rationale for every criterion. Overall disposition is `inconclusive` when any criterion is inconclusive, otherwise `fail` when any criterion fails, otherwise `pass`.

Basis: U1, U2, and U5.

### R6 — Inconclusive fails closed

An inconclusive semantic result MUST fail the scenario and preserve the scenario identity, inconclusive criterion, subject evidence, Terra rationale, saved artifact path, and smallest suggested follow-up. The test system MUST NOT automatically invoke another judge. The owning agent reviews that evidence and decides or asks the user.

Basis: U5.

### R7 — Native execution and reporting

Vitest MUST own collection, scheduling, concurrency, timeout, cancellation, tags or test-name filtering, and test status. Vitest Evals MUST own normalized runs, named evaluator result metadata, and evaluator-oriented terminal reporting.

Each selected scenario MUST appear as one native test row containing its named evaluator scores. Evaluator rationale MUST remain accessible through native task metadata or a linked evaluator artifact; the terminal reporter is not required to print every passing rationale. The system MUST NOT introduce a second scheduler, filter, result format, or reporter.

Basis: U4 and U6.

### R8 — Declarative, colocated scenario authoring

Each in-scope scenario MUST remain organized under:

```text
tests/skills/pressure-scenarios/<plugin>/<skill>/
  <scenario>.md
  <scenario>.case.ts
```

The Markdown file is inert subject-input fixture content. The TypeScript companion declares evaluator selection and criteria. Pairing errors, duplicate scenario identities, and missing required companions MUST fail during collection rather than after model execution.

Basis: U2, U3, and U6.

## Observable failure boundaries

- Failure to start or complete Luna is a subject-execution error, not an evaluator verdict.
- A completed Luna run whose evidence violates an obligation is an evaluator failure.
- Failure to start Terra, malformed Terra output, or insufficient semantic evidence is inconclusive and therefore fails closed.
- A fake backend may prove collection, pairing, normalization, evaluator plumbing, and reporting. It cannot prove live skill behavior.

## Compatibility and constraints

- The existing Markdown pressure prompt remains the subject-input source.
- Existing scenarios outside the four-skill slice may continue through the legacy evaluation path during this focused cutover; they are not evidence for the new evaluator behavior.
- Model calls are external and costly. The suite must preserve one Luna call and at most one Terra call per selected in-scope scenario.
- Evaluator artifacts remain local test evidence and must not contain credentials.

## Requirement and proof coverage

| Need | Problem/outcome | Requirement | Observable contract | Proof obligation |
| --- | --- | --- | --- | --- |
| U1 | Avoid repeated model cost | R1, R4, R5 | One Luna and at most one Terra call per selected case | Automated behavior with call-count evidence |
| U2 | Useful objective and semantic assessment | R3, R4, R5 | Named deterministic and Terra evaluator results | Unit evaluation plus live scenario evidence |
| U3 | Prevent answer-key leakage | R2, R8 | Harness input excludes evaluator configuration | Automated boundary inspection |
| U4 | Unified native output | R3, R7 | One scenario row with named evaluator results | Vitest Evals reporter observation |
| U5 | Safe inconclusive handling | R5, R6 | Failed row plus complete saved evidence; no retry judge | Automated malformed/inconclusive cases and artifact inspection |
| U6 | Native runner behavior | R7, R8 | Vitest owns selection/concurrency/reporting | Focused native filtering and concurrent-suite evidence |

## Success boundary

This slice succeeds when all eight scenarios for the four named skills collect through the declarative case path, deterministic evaluators are reported as named eval results, live passing cases use exactly one Luna and one Terra call, deterministic failures skip Terra, and inconclusive results fail with inspectable evidence.
