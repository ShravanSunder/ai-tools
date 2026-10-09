# Proof and Claims

Use this as the detailed behavior-evidence and claim-boundary protocol. Pressure testing validates the craft model; it is not a substitute for writing a clear trigger, mental model, main path, and reference hierarchy, and it is not the admission gate for drafting from user-approved intent.

This reference owns proof interpretation beyond static validation. Return the authoring basis, success definition, reproduction or characterization result, evaluation evidence, rationalizations, strongest demonstrated claim, remaining proof gap, and smallest wording change still needed.

## Authoring Basis And Reproduction

For `observed failure`, attempt faithful reproduction when the available evidence can preserve the load-bearing prompt, inputs, environment, context, and expected behavior. Return one result:

- `reproduced`: the targeted failure occurred and establishes prompt-specific RED;
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
repeated regression evidence-> repeated fresh runs of the same prompts and checks pass at reported strength
```

A passing control means the comparison did not demonstrate added value. It may expose native model behavior, a weak prompt, or a user preference. It does not automatically forbid authoring.

## Proof By Skill Type

- Discipline skill: combine pressures such as urgency, sunk cost, authority, fatigue, ambiguity, or "this is obvious." Success means the rule holds under pressure and rationalizations are rejected.
- Technique skill: test application on a fresh but similar task. Success means the technique transfers without handholding.
- Pattern skill: test recognition, correct use, and counter-examples. Success means the agent knows when and when not to apply the mental model.
- Reference skill: test retrieval and correct use. Success means the pointer gets the agent to the right detail and the detail is applied correctly.
- Mechanical or metadata change: use structural validation. Do not invent pressure proof for a change that cannot alter behavior.

## Controls And Repetitions

- When claiming improvement, first run a prior-revision control on the same prompts and checks: fresh runs that loaded the skill as it was before the change. When characterizing or drafting from user intent, label that different purpose explicitly.
- Choose fresh-context repetitions proportionate to stochasticity, observed variance, risk, and the strength of the claim; there is no universal count.
- Treat variance across repetitions as a proof gap. Inconsistent interpretations mean the wording is not binding at the claimed strength.

## Rationalization Capture

Treat rationalizations as test evidence. Record the excuse, then decide whether it needs a main-body gate, a sharper context pointer, a stronger completion criterion, or branch-only detail in this reference.

```text
rationalization:
behavior risk:
smallest wording change:
retest:
```

## Running

A run is a fresh agent with no authoring history (a new subagent or session, never a fork or a resume), given only a realistic request that never shows the checks, never says it is a test, and never asks which skills or files the agent used. Write the checks before anything runs, and keep them outside any directory the agent works in. Judge each check only against what the request asked; a run that broke before the agent did the work (a permission stop, a runtime failure) is not a skill failure and is rerun; a trigger run's request never names the skill, because a named skill is loaded directly and says nothing about routing. A checkout does not decide which skills the agent loads. For a run whose checks need the skill's body, confirm from the run's record which copy it loaded (the `SKILL.md` path it read, or the host's record of the skill it invoked); for a trigger run, record whether it invoked the skill and which installed revision offered the description. Take its actions from the host's record of the session, never from its reply. Read every run by hand. IF you cannot start a fresh agent, cannot show the loaded copy or offered revision a check depends on, or have no record of its actions, return that as the proof gap instead of a result.

If no prompt can exercise the behavior or the user defers evaluation, return the named proof gap. Do not fabricate a run merely to satisfy the protocol.

Return the current proof and every remaining gap to whoever assesses the change before independent implementation review. A reviewer consumes this demonstrated behavior and may challenge it; review does not create the missing proof.

Complete when: the strongest claim the evidence supports is named, any gap between that and the claim being made is stated, and the proof artifacts are sufficient for assessment or the exact missing observation is returned to the implementer.
