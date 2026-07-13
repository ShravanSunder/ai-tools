# Skill Pressure Testing System Spec

Status: accepted revision; replaces the earlier judge-system design

## Decision Summary

The system measures whether a skill makes a mini model follow the intended
workflow under realistic shortcut pressure. It does not test whether the model
can summarize the skill, and it is not a general agent-isolation laboratory.

Each behavioral scenario is an A/B evaluation:

```text
same scenario, model, reasoning, fixture, and permissions
  |
  +-- RED baseline: no skill for a new skill, or accepted previous version
  |
  +-- GREEN treatment: current skill installed at project scope
  |
  +-- collect actual response, tools, files, artifacts, and rationalizations
  |
  +-- parent review or fresh-context blind reviewer
  |
  +-- reduce consistency and material behavioral improvement
```

Vitest Evals remains the only authoritative runner. Every authoritative subject
and model reviewer call uses ACPX. The default subject is GPT-5.6 Luna at xhigh.
Claude Sonnet at low or medium may be used for Claude-specific coverage. High-risk
skill changes require an outside Claude Opus reviewer at high reasoning.

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
repetitions: integer >= 5
risk: standard | high
fixture requirements
allowed tools and writes
deterministic checks
expected artifacts
```

R4. Grader-only criteria, failure signals, and expected behavior never appear in
the subject prompt. The subject sees only the realistic operator prompt and
neutral harness context.

### RED And GREEN Subject Runs

R5. Every behavior-changing scenario runs RED before GREEN. A new skill uses a
no-skill baseline. A materially changed skill uses the accepted previous skill
source from an immutable Git revision.

R6. RED and GREEN use the same subject provider, exact model, reasoning effort,
operator prompt, fixture, permissions, tool policy, repetition count, and runner
version. Their only behavioral-input difference is the selected skill source.

R7. Each side runs at least five fresh one-shot contexts. Sessions may not be
reused across repetitions. Variance is part of the result, not noise to hide.

R8. All authoritative subject runs use ACPX. Defaults:

- Codex: GPT-5.6 Luna/xhigh.
- Claude-specific subject coverage: Sonnet low or medium.

Direct Codex or Claude CLI calls are diagnostics only.

R9. The subject returns the normal operator-facing response. It is never asked
to report `skill_invoked`, grade itself, quote expected behavior, or produce a
compliance schema.

### Minimal Functional Isolation

R10. Every repetition runs in a fresh disposable Git repository. The harness
installs the selected skill source into the provider's project skill root with a
repo-owned TypeScript installer.

R11. The treatment contains only the target skill and its real reference files.
The baseline contains no target skill or the selected previous version. The
installer receipts source, destination, regular files, and content digests.

R12. The repository contains neutral harness instructions. Ambient skills are
disabled when the host would otherwise inject them. MCP is empty unless the
scenario explicitly needs an MCP fixture. Grader criteria remain unavailable to
the subject.

R13. Isolation exists only to keep RED and GREEN comparable. The harness is not
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

R16. The collector redacts before persistence. It retains bounded evidence and
safe digests, not raw secrets or hidden chain-of-thought.

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
high reasoning. Standard scenarios may use parent review or a fresh blind
reviewer. Automated unattended runs use blind review.

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

`pass` requires a real RED failure or proof gap, consistent GREEN success,
required deterministic facts, completed review, and no unresolved high-risk
disagreement. Mixed or highly variant repetitions are `inconclusive`, not a
lucky green.

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

R25. Every result artifact includes scenario identity, baseline/treatment source
digests, exact model/runtime configuration, repetition receipts, deterministic
facts, review receipt, rationalizations, comparison outcome, and reasons.

R26. The suite reports exact selected, skipped, invalid, executed, passed,
failed, inconclusive, and infrastructure-error counts. It never reports success
for a selected scenario that did not execute.

### Migration And Cutover

R27. All 107 active scenarios across 23 owners are accounted for by immutable
legacy ID and new global scenario ID. Retirement requires an explicit user
decision; migration may not silently drop scenarios.

R28. The old flat scenario tree, self-grading prompt schema, regex reducer,
legacy shell authority, and duplicate runner are removed only after migrated
discovery proves exact 107-of-107 accounting.

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
RED/GREEN coordinator
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
  owns: process/tool/file/artifact facts and redaction
  exposes: bounded result packet
          |
          v
parent or blind reviewer
  owns: rubric application only
  exposes: candidate semantic findings
          |
          v
deterministic reducer and Vitest reporter
  owns: final outcome, variance, rationalizations, counts
```

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

## Proof Expectations

1. Unit proof covers scenario validation, hidden-prompt separation, pair identity,
   reducer precedence, variance, rationalizations, deterministic checks, and
   exact migration accounting.
2. Integration proof creates disposable repositories, installs baseline and
   treatment skills, supervises real processes, captures files/tools/artifacts,
   and proves cleanup.
3. Behavioral smoke runs one scenario through five RED and five GREEN ACPX Luna
   contexts and demonstrates material improvement.
4. Blind-review smoke sends only rubric plus bounded results to a fresh reviewer.
5. High-risk smoke uses ACPX Claude Opus/high and fails closed when unavailable.
6. Migration proof reports 107 selected scenarios across 23 owners before the old
   runner is removed.
7. Final proof runs unit, integration, focused behavior, standard suite,
   high-risk suite, implementation review, and PR-readiness checks.

## Open Questions

None. This revision reflects the confirmed product intent: pressure-test skill
behavior on mini models, not every capability of an agent host.
