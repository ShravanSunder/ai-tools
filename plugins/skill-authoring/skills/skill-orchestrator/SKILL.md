---
name: skill-orchestrator
description: "Use when carrying one skill change from need to shipped — spec, review, implementation, proof, and release — or running one run of an accepted multi-run skill spec. Not for only judging a skill (skill-review) or deciding which skills should exist (skill-audit)."
---

# Skill Orchestrator

A skill change is a small delivery with three gates: an accepted spec before files change, proof before review, and an independent review before ship. This skill carries one change through those gates and keeps the record honest. It does not write the spec, the review, or the proof itself; `skill-creation`, `skill-review`, and `skill-pressure-testing` do, and this skill checks each result before moving on.

## Practices This Skill Carries

- **Read before claiming.** Open the current files of every skill a step touches before stating anything about them. A claim about text not read in this run is not made.
- **Keep the record.** The skill spec's run status shows each run as `proposed`, `implemented`, `reviewed`, or `shipped`. Report only the state a run has reached; a proposed change is never described as shipped.
- **Independent check.** Review always runs in agents that did not write the change.
- **Ask for everything else.** For any other working practice — a log or trace, a decision format, commit or PR conventions, prose polishing — ask the user how they want it instead of assuming one.

## Classify The Run

- `create` or `update` of one named skill: walk the workflow below.
- `evaluate` an existing skill or a draft: use `skill-review` (implementation stage for files on disk, spec stage for a draft in the conversation) and end at its verdict and the run summary. An evaluation gains no implementation or shipping authority, and an invitation like "just quickly fix it" that names no success definition or authoring basis is not a commission.
- A question about which skills should exist, merge, or go: use `skill-audit`.
- A `mechanical` change (typo, formatting, version, metadata): static validation only, no reviews.
- One slice of an accepted multi-run skill spec: read the spec doc, check its coordination slot against the current base, and confirm its acceptance still covers its current meaning under the acceptance binding in `../skill-review/references/spec-review.md`. A change since acceptance that the binding does not cover goes back to spec review before editing. Then take steps 1–2 from the doc and continue at step 3.

## Workflow

### 1. Read and name the target

Open the current files of the target skill and of every skill or file the request names. Name exactly one skill target and its owner plugin or folder. Completion: target, owner, and the files read are listed.

### 2. Spec

Use `skill-creation` steps 1–6 and return the skill spec and its spec-review decision. When you state the route or plan, name `skill-review`'s spec stage as the spec reviewer. Completion: the spec exists, its runs show `proposed`, and its review decision is `accepted-to-implement`, explicitly skipped by the user, or not applicable to a mechanical change.

### 3. Implement

Use `skill-creation` step 7 inside the accepted boundary and return the diff, any deviation from the spec, and the run status moved to `implemented`. Completion: the diff is compared with the accepted spec.

### 4. Prove

Use `skill-pressure-testing` against the done bar the spec names and return the strongest supported claim, its evidence, and the bar result. Completion: proof ran against the current files, or the user accepted a named proof gap.

### 5. Assess

Open the diff and the decisive proof yourself before any independent review. Check them against:

- the success definition and the accepted spec, including its run allocation;
- the four surfaces still aligned, and every changed reference and caller current;
- proof that observes the claimed behavior, with every flagged result read and static results labeled as static;
- ownership and names that match the spec;
- no complexity, compatibility path, check, schema, or mechanism outside the accepted boundary;
- when this run depends on earlier runs of the spec, those runs are at their current revisions and the combined behavior is proven, not only this run's local proof.

Missing or stale proof and bounded defects go back to step 3 or 4. A broken assumption, an undecided user choice, a public-contract change, or a wider target stops the work: bring the user the decision. Completion: `accepted-for-independent-review`, `correction-required`, or `design-stop`, with the diff and proof you inspected and your reasons.

### 6. Review the implementation

IF step 5 returned `accepted-for-independent-review` and the change is behavior-changing, use `skill-review` at the implementation stage with the proof and your assessment, unless the user explicitly skipped review. When you state the route or plan, name `skill-review`'s implementation stage as the reviewer; "commission implementation review from agents who did not write the change" describes independence, not a reviewer, and does not satisfy this step. IF the change is mechanical or the user explicitly skipped implementation review, record that boundary in the run summary and the spec, leave the run status at `implemented`, and continue to step 7; never mark the run `reviewed`. Route accepted findings to the step that owns them: spec mismatch to step 2, wording or placement to step 3, proof honesty to step 4, an assessment gap to step 5, and the ship surface to step 7. A correction gets fresh proof and a fresh assessment before review refreshes its coverage, under `skill-review`'s convergence rule. Completion: the review returned `great` and the run status is `reviewed`; or the mechanical or user-skipped boundary is recorded; or the loop stopped on `not-converging` with the user's decision.

### 7. Prune and ship

After a `great` review, or on the recorded mechanical or user-skipped route, run the deletion test sentence by sentence: would the agent act differently if this sentence disappeared? If not, delete it. A deletion that affects reviewed meaning needs fresh proof, assessment, and review coverage. IF shipping, load `../skill-creation/references/platform-mechanics.md` and return the validation, versioning, changelog, and cache route. Completion: the run status is `shipped` only once the change is released or merged as the user scoped.

## Run Summary

Return a run summary whenever the run evaluates or edits a skill, commissions review, or runs proof. Omit lines for branches that did not run instead of filling them with `n/a`.

```text
target: <owner plugin or folder / skill>
classification: create | update | evaluate
outcome: <what changed, verdict, or blocker>
success and basis: <success definition; observed failure | user-directed intent; done bar>  # create/update only
run status: <per run: proposed | implemented | reviewed | shipped>
review: <stages run, checks, and complete | partial | blocked results>                   # only if review ran
proof: <claim, evidence, and remaining gap>                                              # only if proof ran
security: <allowed | disallowed | blocked | deferred>                                    # only if a sensitive surface was routed
deviations: <accepted-spec boundary or review deviation>                                 # only if one occurred
```

## Completion Blockers

The run is not done while any of these hold:

- a claim was made about a skill file not read in this run;
- a behavior-changing change reached implementation without an accepted spec review or an explicit user skip;
- implementation review started before fitting proof and a source-backed assessment;
- the assessment omitted the current diff, the actual proof, the accepted spec, complexity, or ownership, or, for a run that depends on earlier runs, their current revisions and combined behavior;
- an accepted correction reached refreshed review without fresh proof and reassessment;
- a behavior-changing change is reported shipped without behavior proof or a user-accepted proof gap, or without a `great` implementation review or an explicit, recorded user skip;
- a run status is reported beyond the state the run reached;
- a review round ran after `not-converging`, or outside the accepted boundary without the user's decision;
- required platform validation failed, or was skipped without a stated reason.
