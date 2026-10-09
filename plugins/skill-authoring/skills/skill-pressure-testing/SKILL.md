---
name: skill-pressure-testing
description: "Use when proving a skill changes agent behavior, reproducing a recorded skill failure, running pressure tests or evals on a skill, or checking a skill change against its done bar. Not for reviewing skill text (skill-review)."
---

# Skill Pressure Testing

Proof is the observed behavior of fresh agents. A skill change is proven only when fresh agents, given an organic request under realistic pressure, do the right thing, judged from what they did. Static validation proves files parse; it never proves behavior. Report the strongest claim the evidence actually reaches, and no further.

## Done Bars

Every behavior-changing skill change meets one bar, chosen by its authoring basis:

```text
new-from-intent           drafted from the user's intent: every changed behavior has at
                          least one realistic prompt, the prompts and runs per prompt are
                          fixed before anything runs, and every one of those runs passes
fix-for-recorded-failure  fixing a failure someone saw: a run shows the failure at the
                          revision before the fix, then 3 fresh runs of the same prompt,
                          graded by the same checks, pass after it
```

A run that broke before the agent did the work, or whose outcome you cannot read, makes a bar not evaluable until it is rerun; it is never rounded up to met.

## Workflow

### 1. Name the purpose

Say which of these the run is for: reproduce a recorded failure; characterize current behavior; prove a change against its done bar; support an improvement claim against the prior revision. Name the skill, the revisions, and the done bar when there is one. Completion: purpose, skill, revisions, and bar are stated.

### 2. Set the claim

MUST load `references/proof-and-claims.md` and return the claim the purpose targets on its ladder, the reproduction rules when reproducing, and the proof shape for this skill type. Completion: the target claim and what evidence would support it are named before anything runs.

### 3. Write the prompts and checks

Write each prompt the way a real user would ask in that situation, including the pressure that tempts the shortcut ("it's just a label swap", "I already know the fix"). It never contains the checks or a hint of them, never says it is a test or an eval, and never asks which skills or files the agent used. Leave the skill's name out when the run tests the trigger. Before anything runs, write the checks: each answers one narrow question about what the agent did (which files it opened, whether it wrote, what it returned), judged only against what the prompt asked. Keep prompts and checks outside any directory the agent under test works in. Completion: every prompt reads as an organic request, every check is one narrow question, and each prompt exercises the changed text.

### 4. Run

Start each run as a fresh agent with no authoring history, given only the prompt: a new subagent or session, never a fork or a resume. A checkout does not decide which skills it loads; the host's installed plugin skills and instructions load wherever it starts. From the run's record, confirm which copy of each skill under test it loaded: the `SKILL.md` path it read, or the installed copy when the prompt names the skill and the host injects it without a read. Take its actions from the host's record of that session (tool calls, files read, writes attempted), never from its reply. IF you cannot start a fresh agent, cannot show that it loaded the revision under test, or have no record of its actions, report that as the proof gap instead of a result. Completion: each run's loaded skill copy and recorded actions are captured, or the gap that stopped it is reported.

### 5. Read what happened

Read every run's transcript and actions against each check by hand, and grade what the agent did before what it said. Record each rationalization the agent used, in its words, with the smallest wording change that would counter it. Treat disagreement between fresh runs as a proof gap. Completion: every check has a result read from the run itself; no result is reported from a summary.

### 6. Report

Return the strongest supported claim, the gap between it and the claim being made, the evidence, and the smallest wording change still needed. Completion: claim, gap, and evidence are reported, and a bar is reported met only when every run it counts was read.

## Rules That Hold Every Run

- Never manufacture RED. A failure that was not reproduced stays `not reproduced`; ask the user how to proceed.
- A passing control means the comparison showed no added value; it does not forbid authoring.
- The subject sees only the request. Never show it the checks, expected behavior, or that it is being evaluated.
- A commit, a PR, a reviewer's verdict, or static validation never strengthens behavior evidence.

## Completion Blockers

Do not report proof while any of these hold:

- a claim is stronger than the rung its evidence reaches;
- static or packaging validation is reported as behavior proof;
- a check result was reported without reading the run behind it;
- a prompt that never exercises the changed text is offered as proof of the change;
- a broken or unreadable run was counted toward a met bar;
- an improvement claim has no prior-revision runs on the same prompts.
