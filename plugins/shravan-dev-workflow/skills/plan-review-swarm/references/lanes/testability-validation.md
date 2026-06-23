# testability-validation

Status: default focused lane for substantial plan review.

## Lens

Disprove that the plan's proof gates prove the behavior they claim to prove.

This lane is not asking whether the plan has many commands. It is asking
whether the proposed proof would fail when the source requirement is broken, and
whether the plan names the expected signal clearly enough for implementation
agents to know when a gate has actually proven something. For each requirement,
aspect, or plan section, validate the proof rubric: risk or failure mode, why
the proof is valuable, selected pyramid layer or layers, expected signal,
freshness guard, red/green expectation where feasible, and tests intentionally
excluded as noise.

## Why This Exists

Proof theater makes a plan feel safe. A command list can be long while still
missing the failure mode that matters. Manual checks can replace durable proof
without justification. Higher layers can hide missing lower-layer coverage. This
lane protects the requirements/proof chain before implementation starts.
Rote pyramid language is another form of proof theater: "unit + integration +
smoke + e2e for every ticket" does not prove that the selected tests are the
right tests.

## Where To Look

Read in this order:

1. Accepted source artifact:
   - requirements;
   - proof expectations;
   - user-visible behavior, state, data, log, metric, trace, screenshot, manual
     UX, CI, PR, or release proof expectations.
2. Produced plan:
   - requirements/proof matrix;
   - proof rubric per requirement, aspect, ticket, or section;
   - slice proof gates;
   - command tables;
   - checkpoint definitions;
   - manual validation steps and freshness guards.
3. Repo validation surface:
   - test scripts, package commands, smoke/e2e harnesses, CI/release checks, and
     docs cited by the plan.

Evidence priority:
1. Source requirements and proof expectations.
2. Plan proof matrix, validation gates, and expected signals.
3. Repo-local validation docs or scripts only when the plan cites them.
4. Prior green results only with a freshness guard; stale proof is not proof.

## How To Analyze

For each material requirement, build this proof chain:

```text
source requirement
  -> failure mode that would violate it
  -> plan task or slice that changes it
  -> why this proof is valuable for that failure mode
  -> proof gate assigned to that work
  -> selected proof layer(s), not every layer by default
  -> expected failing/passing signal
  -> noise tests intentionally not written
  -> freshness guard or checkpoint
```

Then ask:

- Would this proof fail if the requirement were broken?
- Does the plan explain why this proof is valuable for the requirement or risk?
- Is the proof attached to the task that creates the risk?
- Are lower proof layers present where they are useful, or skipped with a real
  reason?
- Are selected layers chosen by risk and observable behavior, or applied as a
  rote all-layer checklist?
- Does manual proof check something automation cannot reasonably check, or is it
  replacing a durable gate?
- Does the plan require red/green evidence for behavior changes where that is
  feasible?
- Does the plan avoid noise tests that only freeze implementation shape,
  deleted files/configs, or symmetric positive/negative cases?

Use this classification:

| Classification | Meaning | Reviewer action |
| --- | --- | --- |
| Direct proof | The gate maps to a requirement, failure mode, and expected signal. | Usually fine. |
| Proof theater | A command/check exists but would not catch the relevant failure. | Finding. |
| Rote pyramid | The plan says every ticket gets every layer without requirement/risk rationale. | Finding. |
| Missing signal | The plan names a command/manual check but not what output/state proves success. | Finding. |
| Layer gap | Unit/integration/smoke/e2e/manual/CI/release layers are skipped or mislabeled. | Finding if the gap affects confidence. |
| Noise test | Test freezes implementation detail, deleted config/file, or symmetric branch without source value. | Finding. |
| Stale proof | Prior result is reused without head/worktree/data freshness. | Finding. |
| Spec gap | Proof cannot be defined because the source requirement is vague. | Route source issue back to spec creation. |

## Prioritized smells / failure signals:

- "Run tests" appears without expected pass/fail signal.
- Proof gate is not mapped to a source requirement or failure mode.
- Proof rubric is absent for a material requirement, ticket, or section.
- "Pyramid TDD" is used as a slogan instead of risk, value, selected layer, and
  expected signal.
- Every ticket gets unit/integration/smoke/e2e by policy, without explaining why
  each layer would catch a distinct failure.
- Positive/negative tests are proposed by symmetry rather than because each case
  proves a distinct source obligation or failure mode.
- A test permanently asserts that a deleted file/config/internal shape is absent
  without a source contract or security invariant for that absence.
- Unit/integration/smoke/e2e/manual/CI/release labels are used loosely.
- Higher-layer proof is used to excuse missing lower-layer proof without reason.
- Manual proof is used where durable automated proof is available.
- Red/green evidence is missing for a behavior change where it is feasible.
- Screenshot, log, trace, metric, DB/state, or UX proof is missing even though
  the source requirement depends on that observable.
- PR/CI/release proof is treated as implementation proof without local slice
  evidence.

## Judgment Calibration

- Blocker: a load-bearing requirement has no proof gate, or the claimed proof
  would not catch the requirement's failure.
- Important: the proof may be suitable but lacks expected signal, freshness
  guard, layer label, or attachment to the right slice.
- Question: proof cannot be defined because the source requirement is too vague.
- Noise: preference for a different command when the current proof already
  catches the relevant failure and has a clear signal.

## Useful Evidence To Return

Return evidence that lets the plan creator repair the proof chain:

- source requirement;
- failure mode;
- planned task/slice;
- claimed proof gate;
- why the proof is valuable, or that the plan failed to say;
- why the gate does or does not catch the failure;
- selected proof layer(s), or that the plan used a rote all-layer checklist;
- missing expected signal, layer, freshness guard, noise-test exclusion, or
  smallest proof step.

## Boundaries

Overlap boundary:
If the issue is missing source obligation coverage, hand it to
`spec-compliance`. If proof gaps come from task sizing, checkpoint order, or
parallel sequencing, hand it to `execution-scope`. If the issue is cross-slice
proof composition, hand it to `whole-plan-cohesion`.

Cannot-verify boundary:
Mark unresolved for final implementation readiness, full PR/release readiness,
whole-plan proof composition, or source/plan anchors missing from this lane's
packet.

## Good / Bad Findings

Good finding:

```text
The source requires quota fallback to choose a usable account before forwarding
a Codex request. The plan's proof gate only runs unit tests for account ranking;
it does not prove the forwarding path uses the selected account. Add an
integration or smoke proof that sends a request through the router with one
exhausted account and asserts the forwarded request uses the available account.
```

Bad finding:

```text
The validation plan should be stronger.
```

Good finding:

```text
The plan says every ticket needs unit, integration, smoke, and e2e tests, but
the source requirement here is a deterministic parser contract. The useful
proof is a red/green parser unit test plus one boundary integration where the
parsed event enters the protocol handler. Requiring an e2e test for this ticket
adds cost without catching a distinct failure. Replace the checklist row with a
proof rubric that names the parser failure mode, selected layers, expected
signals, and the deliberately omitted noise tests.
```
