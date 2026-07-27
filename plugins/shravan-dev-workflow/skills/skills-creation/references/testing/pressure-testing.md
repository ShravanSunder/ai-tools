# Pressure Testing

Use this as the detailed behavior-evidence and claim-boundary protocol. Pressure testing validates the craft model; it is not a substitute for writing a clear trigger, mental model, main path, and reference hierarchy, and it is not the admission gate for drafting from user-approved intent.

This reference owns proof interpretation beyond static validation. Return the authoring basis, success definition, reproduction or characterization result, evaluation evidence, rationalizations, strongest demonstrated claim, remaining proof gap, and smallest wording change still needed.

Keep grader-only assertions out of the prompt -- the model under test sees only the realistic task and permitted context. Static validation remains structural proof only.

## Authoring Basis And Reproduction

For `observed failure`, attempt faithful reproduction when the available evidence can preserve the load-bearing prompt, inputs, environment, context, and expected behavior. Return one result:

- `reproduced`: the targeted failure occurred and establishes scenario-specific RED;
- `not reproduced`: a credible attempt did not show the targeted failure;
- `insufficient evidence`: missing information prevents a faithful attempt;
- `inconclusive`: execution or interpretation cannot support a result.

Only `reproduced` establishes RED. The other results do not prove that guidance is unnecessary or that the historical incident is fixed. Ask the user whether to supply evidence and retry, approve a representative hypothesis, author from the approved success definition with a named proof gap, or defer.

A representative hypothesis is a deliberately simplified or synthetic case the user approves as preserving the suspected mechanism. Evidence from it applies to that representative case, not automatically to the historical incident.

For `user-directed intent`, a first draft may proceed after the user approves the success definition. Evaluation may happen before or after that draft. If it is deferred, report `drafted from user intent; behavior not yet evaluated` rather than inventing RED or GREEN.

## Evidence And Claim Ladder

Use only the strongest claim supported by the evidence:

```text
intent only                 -> drafted from approved intent
manual exercise             -> observed in named examples
baseline characterization   -> behavior characterized without delta claim
representative comparison   -> delta demonstrated for that approved case
reproduced RED -> GREEN      -> targeted improvement demonstrated for that run
repeated regression evidence-> stored cases currently pass at reported strength
```

A passing control means the comparison did not demonstrate added value. It may expose native model behavior, a weak scenario, or a user preference. It does not automatically forbid authoring. A commit, branch, PR, reviewer verdict, or static validator does not strengthen behavior evidence.

## Proof By Skill Type

- Discipline skill: combine pressures such as urgency, sunk cost, authority, fatigue, ambiguity, or "this is obvious." Success means the rule holds under pressure and rationalizations are rejected.
- Technique skill: test application on a fresh but similar task. Success means the technique transfers without handholding.
- Pattern skill: test recognition, correct use, and counter-examples. Success means the agent knows when and when not to apply the mental model.
- Reference skill: test retrieval and correct use. Success means the pointer gets the agent to the right detail and the detail is applied correctly.
- Mechanical or metadata change: use structural validation. Do not invent pressure proof for a change that cannot alter behavior.

## Micro-Test Protocol

Use micro-tests to verify wording quickly. Scenarios remain the behavior-proof gate for discipline skills when the completion claim says the rule holds under pressure.

- When claiming improvement, run a comparable no-guidance or previous-revision control first. When characterizing or drafting from user intent, label that different purpose explicitly.
- Choose fresh-context repetitions proportionate to stochasticity, observed variance, risk, and the strength of the claim; there is no universal count.
- Read every flagged transcript by hand; do not trust a keyword match alone.
- Treat variance across repetitions as a proof gap. Inconsistent interpretations mean the wording is not binding at the claimed strength.

## Rationalization Capture

Treat rationalizations as test evidence. Record the excuse, then decide whether it needs a main-body gate, a sharper context pointer, a stronger completion criterion, or branch-only detail in this reference.

```text
rationalization:
behavior risk:
smallest wording change:
retest:
```

## Running The Suite

`tests/skills/run-skill-pressure-tests.sh --fast` runs the fast suite; `tests/skills/run-skill-pressure-tests.sh --scenario <id>` runs one scenario. Scenario file format and the runner's grader-only checks are owned by `tests/skills/README.md` -- cite it, do not restate its checklist here.

If no suitable executable scenario exists or the user defers evaluation, return the named proof gap. Do not fabricate a scenario merely to satisfy the protocol. Scenario-authoring and harness expansion are separate work from this reference's proof interpretation.
