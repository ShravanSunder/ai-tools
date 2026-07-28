---
name: skills-creation
description: Always use when creating, updating, editing or reviewing a skill.  Also pressure test and validate the skill.
---

# Skills Design & Concepts

A skill exists to wrangle determinism out of a stochastic system; making the agent take a predictable process through a system.  It is process focused.

Predictable means the same process, not the same output. A brainstorming skill should diverge every run and still take the same route to diverge.

## Stance

Work on exactly one named skill or accepted draft per run. Portfolio inventory, duplicate-surface archaeology, and "which skills should exist" belong to `skill-audit`.

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

| home                        | read by    | when                            |
| --------------------------- | ---------- | ------------------------------- |
| `SKILL.md`                  | this agent | every run, always in context    |
| `MUST load` reference       | this agent | every run, on reaching the call |
| `IF ..., load` reference    | this agent | only when the predicate holds   |
| `MUST dispatch` lane        | a subagent | every run, on reaching the call |
| `IF ..., dispatch` lane     | a subagent | only when the predicate holds   |

The `read by` column decides `load` or `dispatch`; the `when` column decides `MUST` or `IF`. A lane is a reference a subagent loads.

Handing a lane over takes more than a path. The Lane handoff form below carries the full set, and `references/reference-lanes-design.md` owns the contract underneath it. One invariant belongs at the call site because that is where it gets violated: a caller may narrow the lane reference's maximum authority, never widen it.

### Call Grammar

A call the agent cannot act on sends it away with nothing to bring back. Each form names when to go, where, what to do there, and what to return — and every call site uses exactly one of them.

```text
Reference
  MUST load `<reference>` and return `<result>`.
  IF `<predicate>`, load `<reference>` and return `<result>`.
  ...add `to <requested work>` when the result alone does not say what to do there.
```

```text
Lane handoff
  MUST dispatch `<lane>` to a subagent using `<packet>`.
  IF `<predicate>`, dispatch `<lane>` to a subagent using `<packet>`.
  Subagent loads `<lane-reference>`.
  Parallel-safe after `<prerequisites>`; actual scheduling may serialize.
  Instance authority is equal to or narrower than `<lane-reference maximum>`.
  Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

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

State the target rather than banning the mistake. A prohibition tells the agent where not to go and leaves it guessing where to go instead.

# Skill Creation Process

## What Belongs in SKILL.md

Include every applicable element below. Choose headings and a format that fit the skill:

- **Mental model or stance:** the lens or domain model that improves judgment.
- **All-run spine:** the work from load to completion in one scan; order steps only when order changes behavior.
- **Completion checks:** each meaningful step or reference pass says what must be true before continuing.
- **Always-needed steering and invariants:** keep rules every run needs inline and near the decision they govern.
- **Reference calls:** name the load mode, exact destination, and concrete result the main path consumes, plus the requested work where the result alone does not say what to do there.
- **Lane dispatch, when handed to a subagent:** fill every slot of the Lane handoff form in the Call Grammar above.
- **Overall completion boundary:** name the proof, unresolved conditions, or blockers that prevent a done claim.

Reference calls and lane dispatches use the Call Grammar above; placement follows Progressive Disclosure above.

## Review

Behavior-changing work is reviewed twice: the proposal before any file is edited, and the changed files before ship. Lanes return candidate findings; the parent verifies, reduces, and owns the verdict. Mechanical changes are not reviewed.

Each stage owns its own lane selection: `references/review/spec-review.md` for a proposal, `references/review/implementation-review.md` for changed or existing files. Both dispatch under the Dispatch Contract in `references/review/lanes/lane-schema.md`.

Collect every receipt explicitly and ask a lane that goes quiet; silence is never a clean review. Prefer native dispatch in the parent host's own lineage, and when the runtime can reach another lineage give at least one lane a different-lineage reviewer, because a second model family fails differently than the one that wrote the text.

## Scaled Run Note

Use a compact run note when implementation, shipping, disputed scope, or proof needs tracking. Do not make chat-only discussion perform state ceremony.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable behavior:
success definition:
authoring basis: observed failure | user-directed intent
reproduction: reproduced | not reproduced | insufficient evidence | inconclusive | n/a
invocation: model-invocable | user-invocable
branches loaded:
review lanes dispatched:
lane receipts: complete | partial | blocked, per lane
security route: allowed | disallowed | blocked | deferred | n/a
proof route: RED/GREEN | characterization | representative hypothesis | static-only | deferred | proof gap
shipping status: source-only | PR-ready | released
```

## Workflow

### 1. Name the promise and success

Classify the run; run an existing-surface check; name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." Before behavior-changing authoring, state a concise, human-readable success definition that names the observable behavior and situation that matter. Ask the user when missing meaning would materially change the intended behavior; do not derive the need from current skill wording alone. IF evaluating a draft that exists only in conversation, load `references/review/spec-review.md` to judge the proposal and return its verdict, blocker overrides, and first revision. IF evaluating a skill already on disk, load `references/review/implementation-review.md` to judge the existing files and return its verdict, changed-file coverage, and first revision. Completion: classification, owner, reusable behavior, baseline or review target, success definition, and the surface allocation are named.

### 2. Choose the authoring basis and proof posture

First classify the change, then classify why you are making it.

A change is **behavior-changing** when it alters the skill's trigger or invocation, mental model, main path, reference/lane/schema allocation, steering, completion, proof, security, or platform contract. Typos, formatting, version-only changes, and metadata-only changes with no behavior claim are **mechanical** and static-only.

`mechanical` skips both reviews, and this session makes the call about its own work. So state the claim in a form the next reader can check: name the surfaces the change touches and show that none of them is on the list above. Edits to `SKILL.md` prose, a reference's rules, or the description are behavior-changing whatever their size — small is not a surface.

Behavior-changing work is either `observed failure` or `user-directed intent`.

- **`user-directed intent`** may draft from an approved success definition without RED.
- **`observed failure`** attempts faithful reproduction before any causal fix is claimed. Reproduced means a targeted RED. Any other result means showing the gap and asking the user to supply evidence and retry, approve a representative hypothesis, author from the success definition with a named proof gap, or defer. `references/testing/pressure-testing.md` owns the reproduction result labels and defines a representative hypothesis.

Never manufacture RED, and never let a passing control automatically forbid authoring. "I already know the wording problem" is not a skip.

Completion: authoring basis, reproduction result when applicable, user decision, and strongest honest proof posture are explicit. A `mechanical` classification names the surfaces it touched.

### 3. Design the trigger

Choose the invocation capabilities, then write the YAML description as a trigger-only context pointer for that choice. MUST load `references/frontmatter-design.md` and return the trigger and invocation decision; that reference owns description wording, the description pattern, adjacent-skill boundaries, and the shapes to avoid. IF client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

### 4. Build the main path

Judge each part against the one before it: the lens against what the trigger promised, the route against the lens, the call sites against the route, the wording against the failure it targets.

#### The lens

Decide what concept, lens, or leading word the skill should pull into the model's latent space. State the behavior the skill stabilizes and the judgment it should improve. A reader of the mental model alone should be able to predict the shape of the workflow.

#### The route

Express the body in the form this skill needs: steps, a compact route, references, or a mix. Keep the all-run spine, always-needed steering, and the overall completion boundary visible. Put ordered steps in `SKILL.md` only when order changes behavior. Name the workflow from load to completion.

Add a branch only when an observable condition changes the work; a topic being interesting, provider-specific, or detailed is not enough. Each branch names its predicate, action or destination, and concrete return. A result of only "more context" is incomplete.

#### The call sites

Write every call site here, in the literal grammar above. A `load` site names its mode, path, and needed result, plus the requested work where the result alone does not say what to do there. A `dispatch` site either fills every slot of the Lane handoff form inline, or cites a named dispatch contract — in `SKILL.md` or in a reference the body names — that fills them for a set of lanes. Prefer the shared contract when several sites dispatch under the same terms; repeating six fields at every site is the duplication this skill exists to prevent.

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

Completion: the mental model is stated before details or exceptions; one all-run spine is visible in one scan and handles every branch the description promises; every branch changes the work and returns something the main path can use; every call site is complete under the grammar or a named dispatch contract; and wording changes cite the failure or success gap they address without overstating its evidence source.

### 5. Place the depth

Keep all-run obligations, decisions, invariants, required returns, and completion in the body while allowing coherent detailed procedure to have its own owner. MUST load `references/reference-design.md` and return the placement decision plus the ordinary caller/callee contract. IF the work is parallel-safe and handoff-ready, or several consumers need one stable output shape, or a tool validates the structure, load `references/reference-lanes-design.md` and return which of lane qualification, output shape, or tool shape applies, with its contract. Completion: nothing sits in two homes, every reference exists because a named call site asked for it, and advanced shape guidance remains discoverable even when no lane exists.

### 6. Review the spec

IF the change is behavior-changing, before any file is edited and unless the user explicitly says no review is needed, load `references/review/spec-review.md` to select and dispatch the spec-review lanes and judge the proposed design, and return the dispatched lane set, every receipt, the verdict, blocker overrides, and the implementation decision. Accepted findings return to the design step that owns them before implementation starts. Completion: spec review is parent-reduced to accepted-to-implement, explicitly skipped by the user, or not applicable because the change is mechanical.

### 7. Implement

IF any surface on the sensitive-surface list in `references/security-gate.md` is in scope, load `references/security-gate.md` before outlining or writing the surface and return its allowed, disallowed, blocked, or deferred decision; a `disallowed` or `blocked` decision stops the write. Then edit the skill surface inside the accepted boundary. Completion: the implemented diff is compared against the accepted spec boundary and the result is stated as either `deviations: none` or a named list.

### 8. Review the implementation

Review before proving. Proof run first is spent on text the review is about to change.

IF the change is behavior-changing and the user has not said no review is needed, load `references/review/implementation-review.md` to select and dispatch the implementation-review lanes and return the dispatched lane set, every receipt, and the parent reduction.

Two obligations stay yours whatever the lanes return. Synthesis is not a lane's job: verify each candidate finding against the actual files before accepting it. And a receipt expires when its text changes: re-dispatch any lane whose reviewed text a fix touched, under the Dispatch Contract, with a refreshed packet.

Route accepted findings back to the step that owns them: spec mismatch to `Review the spec`, wording or placement to `Implement`, claim honesty to `Prove`, ship surface to `Prune and ship`.

Completion: every dispatched lane has a terminal receipt, and the Parent Reduction block from `references/review/lanes/lane-schema.md` is emitted with every field filled.

### 9. Proof of quality, proof of work

Run the proof route chosen in `Choose the authoring basis and proof posture`, after review rather than before it. IF the change is behavior-changing, load `references/testing/pressure-testing.md` to choose and run the proof route and return the proof protocol, evidence, and claim boundaries; that reference owns proof by skill type.

Completion: the authoring result, the behavior evidence, and the remaining proof gap are reported separately. Static proof is not relabeled behavior proof, and Git or PR existence is not proof maturity.

### 10. Prune and ship

Run the deletion test sentence by sentence: would agent behavior change if this disappeared? If not, delete it.

IF the change is behavior-changing and ship status is advancing to `PR-ready` or `released`, load `references/review/implementation-review.md` to judge ship readiness and return changed-file coverage, ship decision, and the `implementation-review-swarm` routing.

IF shipping, load `references/platform-mechanics.md` and return the validation, versioning, changelog, and cache/readback route.

Completion: the skill is compact, valid, public-safe, and the proof route matches the shipping status.

## Completion Blockers

The run is not done while any of these hold:

- `SKILL.md` lacks a mental model or main path;
- behavior-changing authoring lacks a human-readable success definition or authoring basis;
- an observed-failure path hides a failed, missing, or inconclusive reproduction result instead of returning the user decision;
- the workflow has branches without observable predicates or return shapes;
- a dispatch site omits its lane, or omits any of the packet, lane reference, parallel-safety basis, non-widening instance authority, receipt, or parent reduction point, without citing the Dispatch Contract in `references/review/lanes/lane-schema.md`;
- review ran outside the Dispatch Contract: the dispatched lanes do not match the changed surface, a reviewer was forked from the authoring session instead of run in fresh context, or a receipt was reused for text edited after that receipt was written;
- implementation completed without stating `deviations: none` or a named list against the accepted spec boundary;
- a behavior-changing shipped update has neither behavior proof nor an explicit user-accepted proof gap;
- a change was classified `mechanical` without naming the surfaces it touched;
- a behavior-changing skill change reached implementation without required spec review or explicit user skip;
- a behavior-changing skill change reached `PR-ready` or `released` without parent reduction and synthesis of the review lanes, changed-file coverage, and targeted retest, unless the user explicitly skipped review;
- a dispatched lane was counted as reviewed without a terminal receipt, or a `partial`, `blocked`, or `no-receipt` lane was left open at `PR-ready` or `released` without a recorded parent closure;
- static validation is claimed as behavior proof;
- a sensitive surface was written without an allowed/disallowed/blocked/deferred decision recorded before that surface was outlined or written;
- required platform static validation failed, or was skipped without a stated reason.
