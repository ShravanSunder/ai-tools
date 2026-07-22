# Skills Creation Flexible Authoring Contract

Status: draft for review

Date: 2026-07-18

## Product intent

`skills-creation` must help a human create or improve one named skill even when a behavioral failure cannot yet be reproduced or the human deliberately wants to draft before testing. Rigor comes from making the authoring basis, success definition, evidence, and remaining proof gap explicit. It does not come from requiring a manufactured RED before useful authoring may begin.

The workflow separates two questions:

```text
May we draft or revise this skill?
  -> yes, when the intended behavior has a user-approved success definition

What may we claim about the result?
  -> only what the available evidence demonstrates
```

This contract is the first separable slice of the broader skill-pressure authoring design. It changes the authoring model and proof interpretation in `skills-creation`. Scenario authoring, executable scenario storage, Vitest Evals, ACPX execution, semantic judging, and new pressure-test cases are deferred to a separate specification and PR.

## Current problem

The current workflow treats strict TDD as the entry gate for all behavior-changing skill work:

- `skills-creation/SKILL.md` requires an already-failing RED before the agent may describe or write a behavior-changing update.
- `pressure-testing.md` says a passing no-guidance control forbids authoring and requires five or more fresh-context repetitions.
- The completion blockers reject behavior-changing wording that preceded a named RED.

This is useful discipline when a reported failure can be faithfully reproduced, but it fails four legitimate authoring situations:

1. The real failure is reported but cannot be reproduced in the available environment.
2. Load-bearing evidence, inputs, or session context are missing.
3. The user knows the desired behavior but has no historical failure data.
4. The user wants to draft now and evaluate later.

## Shared mental model

```text
need or intent
  -> define human-readable success
  -> classify authoring basis
       observed failure
         -> attempt faithful reproduction when evidence permits
         -> reproduced | not reproduced | insufficient evidence
       user-directed intent
         -> draft without manufactured RED
  -> author or revise the target skill
  -> evaluate now or record a named proof gap
  -> report only the strongest demonstrated claim
  -> human chooses revise, evaluate, accept the gap, or stop
```

Testing constrains claim strength. It does not own permission to draft.

## Requirements

### R1. Every behavior-changing run starts with a success definition

Before drafting or revising behavior, `skills-creation` must state a concise, human-readable success definition. It names the observable behavior the skill should stabilize and the situation in which that behavior matters.

A success definition may begin from:

- an observed failure;
- a user correction or example;
- a user-directed policy or workflow;
- research or prior-session evidence;
- an accepted draft that needs evaluation.

The workflow must ask the user when missing meaning would materially change the intended behavior. It must not infer a product decision from current skill wording alone.

### R2. Authoring basis and proof posture are explicit

Every behavior-changing run must classify its authoring basis:

```text
observed failure
user-directed intent
```

It must also state the current proof posture using plain language, such as:

```text
reproduced failure
reproduction not established
insufficient evidence
representative hypothesis approved by user
baseline characterized
evaluation deferred
behavior improvement demonstrated
```

These are receipt terms, not persisted workflow states, registry values, Git restrictions, or release automation.

### R3. Failure-driven work attempts faithful reproduction without assuming success

When the authoring basis is an observed failure, `skills-creation` should attempt faithful reproduction before making a causal claim that the skill fixes that failure. The attempt must preserve the load-bearing prompt, inputs, environment, context, and expected behavior to the degree available.

The attempt may return:

- `reproduced`: the targeted failure is observed under a credible scenario;
- `not reproduced`: the credible attempt does not show the targeted failure;
- `insufficient evidence`: missing data prevents a faithful attempt;
- `inconclusive`: execution or interpretation cannot support a result.

Only `reproduced` establishes a targeted RED. The other outcomes must not be relabeled as RED, GREEN, proof of no need, or proof that the historical failure is fixed.

### R4. Failed reproduction returns a human decision instead of blocking by default

When reproduction is not established or evidence is insufficient, `skills-creation` must show the gap and ask the user which path to take:

1. Supply missing evidence and attempt reproduction again.
2. Approve a representative hypothesis scenario that tests a suspected mechanism without claiming historical reproduction.
3. Author from the user-approved success definition and retain a named proof gap.
4. Defer the work until better evidence exists.

A representative hypothesis scenario is a deliberately simplified or synthetic case approved by the user as preserving the behavior of interest. It may demonstrate behavior in that representative case. It cannot prove that the original incident was reproduced or fixed.

### R5. User-directed authoring does not require RED

When the authoring basis is user-directed intent, `skills-creation` may draft or revise after the user approves the success definition. It must not invent a failure, run a weak control merely to obtain RED, or derive the need only from the target skill's existing prose.

Evaluation may happen before or after the first draft. If it is deferred, the workflow must report the result as drafted or revised from user intent, not as demonstrated improvement, regression protection, or a verified fix.

### R6. Evidence strength bounds the completion claim

The authoring receipt must distinguish what was written from what was demonstrated:

```text
authoring result:
  drafted | revised | structurally reviewed

behavior evidence:
  not run | inconclusive | characterized | targeted improvement demonstrated

remaining proof gap:
  <plain-language limitation or none>
```

Allowed evidence interpretations include:

- intent only: drafted from an approved success definition;
- manual exercise: behavior observed in named examples;
- baseline characterization: controlled behavior recorded without an improvement claim;
- representative comparison: improvement demonstrated only for the approved representative case;
- reproduced RED to candidate GREEN: targeted improvement demonstrated for that execution;
- repeated regression evidence: stored cases currently pass at the reported strength.

Static validation proves structure and packaging only. It must not be reported as behavioral evidence.

### R7. Proof scales with the claim and risk

The workflow must select proof appropriate to the skill type, behavioral risk, and intended completion claim. There is no universal repetition count.

- Discipline skills need pressure scenarios and rationalization evidence when claiming the rule holds under pressure.
- Technique skills need transfer to a fresh but similar task.
- Pattern skills need recognition, application, and counter-examples.
- Reference skills need evidence that the pointer was followed and the detail applied.
- Mechanical or metadata changes use structural validation.

A passing no-guidance control means the proposed comparison did not demonstrate added value. It may indicate native model behavior, a weak scenario, or a user-directed preference. It does not automatically prohibit authoring.

### R8. Git and PR mechanics do not encode proof maturity

The workflow must not treat commits, branches, or PR existence as evidence that behavior is proven. A commit or draft PR may contain a hypothesis or source-only revision.

`PR-ready` and `released` remain reporting claims governed by repo-local review and proof requirements. `skills-creation` must report unmet gates and proof gaps honestly; it does not add Git hooks, branch policy, status registries, or merge enforcement.

### R9. Ownership remains narrow

`skills-creation` owns:

- the success definition;
- authoring-basis classification;
- target-skill edits;
- proof-strength selection;
- interpretation of evaluation evidence;
- the final authoring and proof receipt.

This PR does not create another skill or testing system. A future scenario-authoring workflow may independently own evidence-to-scenario fidelity, scenario assertions, and reproduction receipts. A future harness may own execution and normalized evidence. Neither may edit the target skill or decide human acceptance.

## Non-goals

- No scenario schema or scenario files.
- No new `skill-scenario-creation` skill.
- No Vitest Evals, ACPX, judge, containment, or runner changes.
- No fixed run count or statistical confidence policy.
- No workflow registry, proof database, promotion state, or Git enforcement.
- No automatic acceptance, commit, push, PR, merge, release, or cache refresh.
- No claim that a representative hypothesis reproduces a historical incident.
- No weakening of deterministic checks when deterministic evidence exists.

## Proof expectations for this slice

This slice changes prompt and documentation behavior but intentionally does not add the future executable scenario system. Its proof must therefore remain explicit about the boundary:

- static validation: skill structure, Markdown, plugin manifests, marketplace metadata, and changelog consistency;
- review: the changed authoring spine and pressure reference are checked against this contract and the current skill-authoring rubric;
- behavioral proof gap: no new scenario corpus or harness proof is claimed in this PR;
- deferred proof: the scenario/evaluation PR should add cases for success-definition-first drafting, failed reproduction, missing evidence, representative hypotheses, user-deferred evaluation, and no-manufactured-RED behavior.

## Acceptance boundary

This slice is complete when:

1. `skills-creation` requires a human-readable success definition before behavior-changing authoring.
2. Observed-failure and user-directed paths are both visible in the main workflow.
3. Failed reproduction returns the four explicit human choices without manufacturing RED.
4. Drafting without behavioral proof remains possible while evidence claims remain bounded.
5. `pressure-testing.md` no longer makes a failing control or five repetitions a universal authoring gate.
6. Scenario and harness implementation remain absent and explicitly deferred.
7. Static validation and review evidence are reported separately from the deferred behavioral proof.
