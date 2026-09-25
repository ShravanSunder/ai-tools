---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill or accepted draft, including executing one run or slice of an accepted multi-run skill-change spec, especially when the skill's trigger, main path, reference hierarchy, steering, or proof quality needs judgment.
---

# Skills Design & Concepts

IF no work reference is in context and the task qualifies, open or resume the trace through `practices-show-me-your-work` before phase work.

A skill wrangles determinism out of a stochastic system by making the agent follow a predictable process.

Predictable means the same process, not the same output. A brainstorming skill should diverge every run and still take the same route to diverge.

## Stance

Work on exactly one named skill or accepted draft per run. Portfolio inventory, duplicate-surface archaeology, and "which skills should exist" belong to `skill-audit`.

The user-facing main authors every governing skill-change proposal, specification, and implementation plan. A persistent implementation 🐒 Sidekick may execute one accepted named run or slice at a time and produce its proof; that commission does not transfer design or planning authorship. Research helpers return evidence, and independent reviewers return findings. Only an explicit user-designated successor-main transfer may move governing authorship under the `manage-agents` contract.

## Great Skill Frame

A skill has four surfaces:

| surface   | lives in         | owns                                 |
| --------- | ---------------- | ------------------------------------ |
| trigger   | YAML frontmatter | when and why the skill loads         |
| main path | `SKILL.md`       | the mental model and the route       |
| depth     | `references/`    | detail the main path calls for       |
| proof     | tests            | that the other three change behavior |

Design them in that order. Each one can only be judged against the one before it: the trigger decides what the path must handle, the path decides what depth is needed, and proof judges the result.

## Invocation

The trigger surface has two capabilities. Each pays a different cost.

**Model-invocable** — the skill keeps a `description`, so the agent loads it on its own and other skills can reach it. Pays **context load**: the description sits in the window every turn.

**User-invocable** — the human names the skill directly. Pays **cognitive load**: the human is the index that has to remember it exists.

They are not exclusive: a description adds agent reach without removing the human's. Choose model-invocable when the agent must find the skill unprompted, or when another skill must reach it. When user-invocable skills outgrow what a human can hold, a router skill indexes them.

`references/frontmatter-design.md` owns description wording, adjacent-skill boundaries, and the invocation tradeoff. `references/platform-mechanics.md` owns client-specific invocation controls.

## Information Hierarchy

Placement answers one question: who reads this, and when? The answer picks the call form.

| home | read by | when |
| --- | --- | --- |
| `SKILL.md` | this agent | every run |
| `MUST load` reference | this agent | on reaching the call |
| `IF ..., load` reference | this agent | when the predicate holds |
| `MUST dispatch` procedure | 🔧 Operator | on reaching the call |
| `IF ..., dispatch` procedure | 🔧 Operator | when the predicate holds |

The review and research source classes are steps the current agent loads and performs. Dispatch is only for a prescribed 🔧 Operator procedure: a command, watch, or mechanical transform with an observed result. Commissioning a persistent 🐒 Sidekick or 🔎 Review Sidekick follows `manage-agents`, outside this Call Grammar. A judgment check is never an 🔧 Operator procedure, even when it could be described as independent.

### Call Grammar

A call the agent cannot act on sends it away with nothing to bring back. Each form names when to go, where, what to do there, and what to return — and every call site uses exactly one of them.

```text
Reference
  MUST load `<reference>` and return `<result>`.
  IF `<predicate>`, load `<reference>` and return `<result>`.
  ...add `to <requested work>` when the result alone does not say what to do there.
```

```text
🔧 Operator procedure
  MUST dispatch `<procedure>` to a 🔧 Operator using `<prescribed steps>`; return `<observed result>`.
  IF `<predicate>`, dispatch `<procedure>` to a 🔧 Operator using `<prescribed steps>`; return `<observed result>`.
```

The caller names the exact procedure, allowed commands or transformation, execution boundary, and result to return. The 🔧 Operator reports observations and exceptions; the calling agent judges them. A known check skipped under pressure cannot become a lane because it is independent. Load its reference and perform it as a step.

### Progressive Disclosure

Two different reasons move material out of `SKILL.md`.

**Branch** — only some runs need it. Moving it out keeps every other run from reading it. This is the `IF <predicate>, load` case, and it is an attention decision.

**Module** — every run needs it, but it is one coherent thing that changes for its own reason. Moving it out keeps the main path scannable and lets that piece be maintained on its own. This is the `MUST load` case, and it is a maintenance decision.

Moving all-run procedure behind `MUST load` does not move the obligation. The obligation, order, decision, required return, invariant, and completion stay visible in `SKILL.md`; the reference owns the detail.

Long examples, provider mechanics, branch-local rubrics, and exceptional procedure always move out. Four things never do: the mental model, the all-run spine, rules every run needs at the decision they govern, and the completion boundary.

## Leading Words

A leading word is a compact concept the model already holds from pretraining — `root cause`, `vertical slice`, `tracer bullet`, `red-green`, `single source of truth`. Repeated as a token, it anchors a region of behavior in a few characters by recruiting priors the model already has.

It works twice. In the body it anchors execution: the agent reaches for the same behavior every time the word appears. In the description it anchors invocation: when the same word lives in the user's prompts, docs, and code, the agent links that language to the skill and loads it more reliably.

Prefer a word the model already has. A coined term recruits nothing — you pay in definition tokens what a pretrained word gives free. When a skill needs coined terms anyway, `references/glossary.md` owns them.

A leading word too weak to beat the model's default changes nothing. `be thorough` is not a leading word when the agent is already thorough-ish.

IF a term is unclear, load `references/glossary.md` and return the applicable definition.

## Steering

Steering is the wording that changes what the agent does. Three moves carry most of it.

**Completion criteria.** Test every one twice: can the agent tell done from not-done, and does it demand the legwork? `Understanding reached` fails the first — there is nothing to check. `Produce a change list` passes the first and fails the second — a list of nothing satisfies it. `Name every caller of the changed function and say which ones break` passes both, because it cannot be written without opening the callers. The second test is the one that gets skipped, and it is the one that buys depth.

**Rule strength.** Match the rule to how the agent fails. A rule it already follows needs no wording at all. A rule it skips under pressure needs a bright line — one unambiguous condition, no judgment call left at the moment of temptation — with the rationalization named beside it in the words the agent actually used. `I already know this` and `I'll verify later` belong in the skill, not in the postmortem.

**The deletion test.** Would the agent act differently if this sentence disappeared? Apply it sentence by sentence inside its surrounding context, never to whole sections at once. Rationale that changes no behavior is padding however true it is.

Lead with the positive shape: tell the agent what action to take, what result to produce, and what good judgment looks like. Add a prohibition only when a known failure still needs a bright-line boundary, and pair it with the positive target.

# Skill Creation Process

## What Belongs in SKILL.md

Include every applicable element below. Choose headings and a format that fit the skill:

- **Mental model or stance:** the lens or domain model that improves judgment.
- **All-run spine:** the work from load to completion in one scan; order steps only when order changes behavior.
- **Completion checks:** each meaningful step or reference pass says what must be true before continuing.
- **Always-needed steering and invariants:** keep rules every run needs inline and near the decision they govern.
- **Reference calls:** name the load mode, exact destination, and concrete result the main path consumes, plus the requested work where the result alone does not say what to do there.
- **🔧 Operator dispatch, for a prescribed procedure:** fill the procedure form in the Call Grammar above.
- **Overall completion boundary:** name the proof, unresolved conditions, or blockers that prevent a done claim.

Reference loads and 🔧 Operator procedures use the Call Grammar above; placement follows Progressive Disclosure above.

## Review

Behavior-changing work is reviewed twice unless the user explicitly skips the applicable review: the proposal before skill edits, and proved, main-assessed changed files before ship. A persistent independent 🔎 Review Sidekick walks ordered checks in its own session and reduces findings. The orchestrator owns final disposition. Mechanical changes are not reviewed.

Proposal review allows one independent review and one bounded remediation; the same lead verifies corrected anchors. Implementation review allows up to three remediation passes. A missing, `partial`, or `blocked` check prevents a clean result. Keep status in current run context.

`references/review/spec-review.md` owns proposal checks; `references/review/implementation-review.md` owns changed or existing file checks. Each uses `references/review/lanes/lane-schema.md` for status and reduction. A scoped change keeps both stages and uses each stage's scoped check set.

## Report the Run Without Empty Bookkeeping

Return a run summary whenever the run evaluates or edits a skill, commissions review, or runs proof. Omit branches that did not run instead of filling them with `n/a`. Chat-only discussion and a read-only accepted-spec verification or expiry stop need no summary unless they also evaluate, edit, review, or prove something.

```text
target: <owner plugin / skill>
classification: create | update | evaluate
outcome: <what changed, verdict, or blocker>
success and basis: <success definition; observed failure | user-directed intent>  # create/update only
review: <selected checks and complete | partial | blocked results>                     # only if review ran
proof: <route, evidence, and remaining gap>                                  # only if proof ran
security: <allowed | disallowed | blocked | deferred>                        # only if a sensitive surface was routed
deviations: <accepted-spec boundary or reviewer-runtime deviation>           # only if one occurred
shipping: source-only | PR-ready | released                                  # only when shipping status changed or is claimed
```

## Workflow

An `evaluate` run walks a shorter spine: complete step 1, follow the review branch it selects, and end at the review-lead-reduced verdict plus the run summary. Steps 2-10 begin only as a new `update` run whose own step 1 records a user-supplied success definition and an authoring basis; an invitation like "just quickly fix it" that names neither is not a commission.

A run implementing one slice — one run of an accepted multi-run skill-change spec's sequenced runs — reads the accepted spec doc and takes its step-1 and step-2 returns from it, quoting the slice's success definition, authoring basis, surface allocation, proof posture, and the decision rows it must honor, and checks the doc's coordination slot before editing; the doc is the commission for that slice, and each slice still names exactly one skill target.

An update run follows one all-run spine: the main names the promise and success, chooses the authoring basis and allocates the four surfaces, designs the proposed change, and obtains an `accepted-to-implement` proposal-review result before any skill file is edited when behavior-changing unless the user explicitly skips review. For implemented behavior-changing delivery, the assigned implementer edits only inside that accepted boundary, runs fitting proof, and returns the diff and proof to the main. The main assesses the current changes and evidence against the accepted need/spec/plan before commissioning independent implementation review when it was not explicitly skipped; accepted corrections then receive fresh proof and assessment before affected review coverage is refreshed. Mechanical changes stay static-only and skip both reviews; scoped wording changes use each review stage's scoped form. An `evaluate` run retains its shorter source-only route above and does not gain implementation or shipping authority.

### 1. Name the promise and success

Classify the run; search the owning plugin for an existing skill or reference that already owns the named behavior and return the matching paths or `none`; name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." Before behavior-changing authoring, state a concise, human-readable success definition that names the observable behavior and situation that matter. Ask the user when missing meaning would materially change the intended behavior; do not derive the need from current skill wording alone. IF evaluating a draft that exists only in conversation, load `references/review/spec-review.md` to judge the proposal and return its verdict, blocker overrides, and first required revision. IF evaluating a skill already on disk, load `references/review/implementation-review.md` to judge the existing files and return its verdict, changed-file coverage, and first fix. Completion: classification, owner, reusable behavior, baseline or review target, success definition, and the surface allocation — which of the four surfaces carries each part of the change — are named; an `evaluate` run completes with classification, owner, reusable behavior, and review target.

### 2. Choose the authoring basis and proof posture

IF the work the skill teaches lives in someone's head and is not yet understood, use `discuss-pathfinding` and return its records and confirmed restatement. IF it lives in artifacts the run has not read, use `practices-research` and return its evidence-ledger summary and coverage. `Build the main path`, `Place the depth`, and `Implement` consume these returns.

Then classify the change, and classify why you are making it.

| change class        | qualifies when                                                                                                                                                                                                                      | consequence                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `mechanical`        | typos, formatting, version-only, or metadata-only edits with no behavior claim                                                                                                                                                       | static-only; skips both reviews                           |
| `behavior-changing` | the diff alters trigger or invocation, mental model, main path, reference/check/schema allocation, steering, completion, proof, security, or platform contract                                                                        | both review stages plus the proof posture below           |
| `scoped` (behavior-changing) | behavior-changing, and the entire diff is wording inside one owned home — `SKILL.md` prose or a single reference — touching no trigger, call site, branch predicate, check selection, schema, label set, security surface, or ownership boundary | each review stage narrows to its scoped form; proof rules unchanged |

Every classification is a claim the next reader can check, and this session makes the call about its own work: `mechanical` names the surfaces the change touches and shows none is in the behavior-changing row; `behavior-changing` names which listed surface the diff alters; `scoped` names its one home and shows each excluded surface is untouched. Edits to `SKILL.md` prose, a reference's rules, or the description are behavior-changing whatever their size — small is not a surface.

Behavior-changing work is either `observed failure` or `user-directed intent`.

- **`user-directed intent`** may draft from an approved success definition without RED.
- **`observed failure`** attempts faithful reproduction before any causal fix is claimed. IF the authoring basis is `observed failure`, load `references/testing/pressure-testing.md` to attempt faithful reproduction and return the reproduction result, representative-hypothesis boundary, and available next decisions. Reproduced means a targeted RED. Any other result means showing the gap and asking the user to supply evidence and retry, approve a representative hypothesis, author from the success definition with a named proof gap, or defer.

Never manufacture RED, and never let a passing control automatically forbid authoring. "I already know the wording problem" is not a skip.

Completion: authoring basis, reproduction result when applicable, user decision, and strongest honest proof posture are explicit — and each sourcing return that ran exists: the records and confirmed restatement when `discuss-pathfinding` ran, the evidence-ledger summary and coverage when `practices-research` ran. A `mechanical` classification names the surfaces it touched; a `scoped` classification names its one home and shows each excluded surface is untouched.

### 3. Design the trigger

Choose the invocation capabilities, then write the YAML description as a trigger-only context pointer for that choice. MUST load `references/frontmatter-design.md` and return the trigger and invocation decision; that reference owns description wording, the description pattern, adjacent-skill boundaries, and the shapes to avoid. Do not load `../../shared-references/humanizer.md` for that description. IF client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

### 4. Build the main path

Judge each part against the one before it: the lens against what the trigger promised, the route against the lens, the call sites against the route, the wording against the failure it targets.

#### The lens

Decide what concept, lens, or leading word the skill should pull into the model's latent space. State the behavior the skill stabilizes and the judgment it should improve. A reader of the mental model alone should be able to predict the shape of the workflow.

#### The route

Express the body in the form this skill needs: steps, a compact route, references, or a mix. IF the classification is `create` or the main-path shape is contested, load `references/worked-examples.md` to anchor the small end of the range and return the shape choice for this skill. Keep the all-run spine, always-needed steering, and the overall completion boundary visible. Put ordered steps in `SKILL.md` only when order changes behavior. Name the workflow from load to completion.

Add a branch only when an observable condition changes the work; a topic being interesting, provider-specific, or detailed is not enough. `IF the skill needs more depth, load ...` is a topic wearing IF clothing; `IF the diff adds a script, load references/security-gate.md` is a branch — the condition is observable and the work changes. Each branch names its predicate, action or destination, and concrete return. A result of only "more context" is incomplete.

#### The call sites

Write every call site here, in the literal grammar above. A `load` site names its mode, path, and needed result, plus the requested work where the result alone does not say what to do there. A `dispatch` site names a prescribed 🔧 Operator procedure, its steps and boundary, and the observed result. Review checks and research source classes use `load` sites.

#### The wording

Match the guidance form to the observed failure, representative hypothesis, or user-approved success gap:

| observed failure                  | guidance form                               |
| --------------------------------- | ------------------------------------------- |
| known rule skipped under pressure | bright-line rule + rationalization table    |
| wrong output shape                | positive output shape or template           |
| omitted element                   | required slot next to the output            |
| conditional behavior mistake      | observable predicate + action               |
| shallow legwork                   | stronger completion criterion               |
| wrong invocation                  | sharper description or user-invocable route |
| reference retrieval gap           | stronger context pointer or inline material |

Strengthen predicates, returns, and completion criteria when the agent would guess or stop early.

IF this step writes human sentences in the proposal, load `../../shared-references/humanizer.md` in file mode and return those sentences rewritten. Leave the YAML description, call-site grammar, and label sets unchanged.

Completion: the mental model is stated before details or exceptions; one all-run spine is visible in one scan and handles every branch the description promises; every branch changes the work and returns something the main path can use; every call site is complete under the grammar; and wording changes cite the failure or success gap they address without overstating its evidence source.

### 5. Place the depth

Keep all-run obligations, decisions, invariants, required returns, and completion in the body while allowing coherent detailed procedure to have its own owner. MUST load `references/reference-design.md` and return the placement decision plus the ordinary caller/callee contract. Depth must teach: a reference owning a promised stage carries what to inspect, what good and bad look like, and when to stop — written from the step-2 sourcing records or a named source; a reference that only pins output shape (schemas, label sets, packet forms) is ceremony, justified by a named consumer and never a stage's owner. IF several consumers need one stable output shape or a tool validates the structure, load `references/reference-lanes-design.md` and return the output or tool shape owner and its consumers. Completion: nothing sits in two homes, every reference exists because a named call site asked for it, every promised stage names its teaching owner — an inline body section or a teaching reference — and advanced shape guidance remains discoverable.

### 6. Review the spec

IF the change is behavior-changing, before any skill file is edited and unless the user explicitly says no review is needed, the orchestrator commissions a different-lineage persistent 🔎 Review Sidekick with no author context. That lead loads `references/review/spec-review.md`, walks the selected checks in its own session and returns per-check statuses, verdict, blocker override, and implementation decision. The orchestrator makes final disposition and routes the lead's result without repeating detailed reduction. On correction, resume the same lead with its own review history; it verifies corrected anchors and closes without another review. A prior accepted proposal is reused only when its original review plus permitted remediation still covers current meaning. Expanded or uncertain semantic change stops `review-permission-required` instead of automatically dispatching another proposal review. Completion: proposal review is ready, its accepted bounded findings have one complete review-lead-verified remediation, or review was explicitly skipped/not applicable; a second review requires explicit user permission.

### 7. Implement

IF any surface on the sensitive-surface list in `references/security-gate.md` is in scope, load `references/security-gate.md` before outlining or writing the surface and return its allowed, disallowed, blocked, or deferred decision; a `disallowed` or `blocked` decision stops the write. IF this step writes human sentences in the `SKILL.md` body or a teaching reference, load `../../shared-references/humanizer.md` in file mode and return those sentences rewritten. Leave the YAML description, schemas, call-site grammar, label sets, and packet forms unchanged. Then edit the skill surface inside the accepted boundary. Completion: compare the implemented diff against the accepted spec boundary; include a deviation in the run summary only when one exists.

### 8. Proof of quality, proof of work

For implemented behavior-changing delivery, run the proof route chosen in `Choose the authoring basis and proof posture` against the current files before independent implementation review. IF the change is behavior-changing, load `references/testing/pressure-testing.md` to choose and run the proof route and return the proof protocol, evidence, inspected flagged transcripts, and claim boundaries; that reference owns proof by skill type. Mechanical work retains its static-only route, and an `evaluate` run reports source-only behavior as unverified/deferred rather than entering this delivery step.

Completion: the authoring result, current-source behavior evidence, and remaining proof gap are reported separately. Static proof is not relabeled behavior proof, Git or PR existence is not proof maturity, and an implementation without its fitting proof does not advance to main assessment.

### 9. Main assessment

For implemented behavior-changing delivery, the implementer returns the current diff, changed-file inventory, actual proof, and gaps to the user-facing main. Before any independent implementation review, the main opens the changed files and decisive proof artifacts and checks them against the user-directed success definition, accepted proposal/spec, current implementation plan or run allocation, and repository instructions. Mechanical work retains its static-only completion route, and an `evaluate` run ends at its source-only reduced verdict without entering main assessment.

Assess all of these inline:

- the changed behavior covers the original need and named run without losing required controls;
- the four surfaces still align and every changed reference/caller is current;
- actual proof observes the claimed behavior, required flagged transcripts were inspected, and static results are labeled separately;
- ownership, names, and boundaries match the accepted design and no delegated design/plan authorship leaked into the implementation;
- the diff adds no unnecessary complexity, compatibility path, lane, schema, or mechanism outside the accepted boundary;
- when several PR assignments exist, prerequisites and integrated behavior are current across their exact source identities.

Missing or stale proof, bounded implementation defects, and reversible drift return to the same implementer with the exact affected proof. A mental-model break, missing owner decision, public-contract change, expanded skill target, plan defect, or proposed proof weakening stops dependent work and returns to its semantic owner. Only a source-backed accepted main assessment may commission implementation review.

Completion: the main records `accepted-for-independent-review | correction-required | design-or-plan-stop`, the inspected diff/proof identities, reasons, and exact next owner.

### 10. Review the implementation, prune, and ship

IF the main assessment is `accepted-for-independent-review`, the change is behavior-changing, and the user has not said no review is needed, the orchestrator commissions a different-lineage persistent 🔎 Review Sidekick with no author context. That lead loads `references/review/implementation-review.md`, receives the current proof and main-assessment result, walks the selected checks in its own session, and returns per-check statuses, Parent Reduction, and current remediation-pass evidence. The orchestrator makes final disposition and routes the lead's result without repeating detailed reduction.

Two obligations stay with the executing review lead as it walks the checks. Synthesis stays with the lead: the lead verifies each candidate against actual files and proof before accepting it. Accepted findings receive one remediation pass at a time. The implementer makes the correction and produces fresh affected proof; the main reassesses that current result; then the same review lead refreshes affected coverage only while fewer than three remediation passes have completed. After remediation three, stop `remediation-limit-reached`; do not start review or remediation four without explicit user permission.

Route accepted findings back to the step that owns them: spec mismatch to `Review the spec`, wording or placement to `Implement`, proof honesty to `Proof of quality, proof of work`, assessment gap to `Main assessment`, and ship surface to this step.

After a `great` current review result, run the deletion test sentence by sentence: would agent behavior change if this disappeared? If not, delete it. Any deletion that affects reviewed meaning requires fresh fitting proof, main assessment, and affected review coverage.

IF shipping, load `references/platform-mechanics.md` and return the validation, versioning, changelog, and cache/readback route. General product implementation review routes to `implementation-review`; runtime skill-package authoring remains under this `skills-creation` review contract.

Completion: when implementation review ran, every required check has `complete` status, the Parent Reduction is complete, the result is `great`, and no fourth remediation occurred. Mechanical work or an explicit review skip records that applicable boundary without fabricating review coverage. In every route the skill is compact, valid, public-safe, and supported by the proof its classification and shipping claim require; a source-only evaluation never authorizes shipping.

## Completion Blockers

The run is not done while any of these hold:

- `SKILL.md` lacks a mental model or main path;
- behavior-changing authoring lacks a human-readable success definition or authoring basis;
- an observed-failure path hides a failed, missing, or inconclusive reproduction result instead of returning the user decision;
- the workflow has branches without observable predicates or return shapes;
- a promised stage or branch has no teaching owner — an inline body section or a reference that teaches it; a shape-only reference never owns a stage and separately requires a named consumer;
- a dispatch site is judgment work rather than a prescribed 🔧 Operator procedure, or omits its steps, boundary, or observed result;
- review lead lacked independence from the authoring session, an implementation check was reused after affected text changed, or proposal coverage was reused after text changed outside its one accepted lead-verified remediation;
- implementation completed without comparing the diff to the accepted spec boundary or reporting an actual deviation;
- independent implementation review for implemented behavior-changing delivery started before fitting implementation proof and a source-backed main assessment;
- the main assessment for implemented behavior-changing delivery omitted the current diff, actual proof, accepted need/spec/plan, complexity, ownership, or cross-assignment integration applicable to the change;
- a behavior-changing shipped update has neither behavior proof nor an explicit user-accepted proof gap;
- a change was classified `mechanical` without naming the surfaces it touched, or `scoped` without showing each excluded surface is untouched;
- a behavior-changing skill change reached implementation without required spec review, citation of an unexpired accepted spec, or explicit user skip;
- a second proposal/design review ran without explicit user permission after the first review/remediation result;
- a fourth implementation remediation or its following review ran without explicit user permission;
- a behavior-changing skill change reached `PR-ready` or `released` without review-lead reduction and synthesis of the checks, changed-file coverage, and targeted retest, unless the user explicitly skipped review;
- an accepted correction reached refreshed review coverage without fresh affected proof and main reassessment;
- a required check was counted as complete without status, or a `partial` or `blocked` check was left open at `PR-ready` or `released` without a recorded review-lead closure;
- static validation is claimed as behavior proof;
- a sensitive surface was written without an allowed/disallowed/blocked/deferred decision recorded before that surface was outlined or written;
- required platform static validation failed, or was skipped without a stated reason.

IF a trace is open, at phase completion record the outcome, evidence, and next owner or return token as a checkpoint through `practices-show-me-your-work`.
