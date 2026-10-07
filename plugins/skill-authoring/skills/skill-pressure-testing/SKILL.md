---
name: skill-pressure-testing
description: "Use when proving a skill changes agent behavior, reproducing a recorded skill failure, writing or running pressure scenarios, or checking a skill change against its done bar. Not for reviewing skill text (skill-review)."
---

# Skill Pressure Testing

Proof is the observed behavior of fresh agents. A skill change is proven only when fresh Luna subjects, given an organic request under realistic pressure, do the right thing, judged from what they did with the cheapest evidence that settles each question. Static validation proves files parse; it never proves behavior. Report the strongest claim the evidence actually reaches, and no further.

## Done Bars

Every behavior-changing skill change meets one bar, chosen by its authoring basis:

```text
new-from-intent           drafted from the user's intent: lint passes, and fresh runs
                          of every active scenario on realistic prompts pass
fix-for-recorded-failure  fixing a failure someone saw: a scenario shows the failure
                          at the revision before the fix, then 3 fresh runs pass after it
```

An `execution-failed` or `inconclusive` run makes a bar not evaluable until it is rerun; it is never rounded up to met.

## Workflow

### 1. Name the purpose

Say which of these the run is for: reproduce a recorded failure; characterize current behavior; prove a change against its done bar; support an improvement claim against the prior revision. Name the skill, the revisions, and the done bar when there is one. Completion: purpose, skill, revisions, and bar are stated.

### 2. Set the claim

MUST load `references/proof-and-claims.md` and return the claim the purpose targets on its ladder, the reproduction rules when reproducing, and the proof shape for this skill type. Completion: the target claim and what evidence would support it are named before anything runs.

### 3. Get the scenarios

Use the active scenarios beside the skill when they exercise the behavior. IF no scenario exercises the behavior, load `references/scenario-authoring.md` and return the new scenario, its checks, and the `validate` result. Completion: every scenario you will run validates, and each one exercises the changed text.

### 4. Run

MUST load `references/runner-usage.md` and return the command, exit code, batch directory, each Run's verdict, and the Done-bar result when one was asked for. Completion: the runner has returned, or the exact environment gap that stopped it is reported.

### 5. Read what happened

Open every failed or inconclusive Check's path and the observation behind it. Record each rationalization the subject used, in its words, with the smallest wording change that would counter it. Treat disagreement between fresh runs as a proof gap. Completion: every flagged Check was read by hand; no result is reported from its label alone.

### 6. Report

Return the strongest supported claim, the gap between it and the claim being made, the evidence paths, and the smallest wording change still needed. Completion: claim, gap, and evidence paths are reported, and a bar is reported exactly as the runner returned it.

## Rules That Hold Every Run

- Never manufacture RED. A failure that was not reproduced stays `not reproduced`; ask the user how to proceed.
- A passing control means the comparison showed no added value; it does not forbid authoring.
- The subject sees only the request. Never show it the checks, expected behavior, or that it is being evaluated.
- A commit, a PR, a reviewer's verdict, or static validation never strengthens behavior evidence.

## Completion Blockers

Do not report proof while any of these hold:

- a claim is stronger than the rung its evidence reaches;
- static or packaging validation is reported as behavior proof;
- a failed or inconclusive Check was reported without reading its observation;
- a scenario that never exercises the changed text is offered as proof of the change;
- an `execution-failed` or `inconclusive` run was counted toward a met bar;
- an improvement claim has no prior-revision runs on the same scenarios.
