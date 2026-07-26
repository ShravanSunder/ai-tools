---
name: skills-creation
description: Use when creating, updating, or evaluating one named skill or accepted draft; when skill wording fails under pressure; or when a draft's trigger, main path, or proof needs judgment before shipping.
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

Placement answers one question: who reads this, and when?

| home                     | read by    | when                            |
| ------------------------ | ---------- | ------------------------------- |
| `SKILL.md`               | this agent | every run, always in context    |
| `MUST load` reference    | this agent | every run, on reaching the call |
| `IF ..., load` reference | this agent | only when the predicate holds   |
| lane                     | a subagent | when the parent dispatches it   |

A lane is a reference a subagent loads. The contract for handing one over — packet, prerequisites, authority, receipt, parent reduction — is owned by `references/reference-lanes-design.md`.

### Call Grammar

Every call site uses exactly one of these forms:

```text
Reference
  MUST load `<reference>` to `<requested work>` and return `<result>`.
  IF `<predicate>`, load `<reference>` to `<requested work>` and return `<result>`.

Lane handoff
  MUST dispatch `<lane>` to a subagent using `<packet>`.
  IF `<predicate>`, dispatch `<lane>` to a subagent using `<packet>`.
  Subagent loads `<lane-reference>`.
  Parallel-safe after `<prerequisites>`; actual scheduling may serialize.
  Instance authority is equal to or narrower than `<lane-reference maximum>`.
  Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

`MUST` is the all-run path; `IF` is an observable branch. `load` consumes reference content in the current workflow; `dispatch` hands a lane to a subagent. A dispatch caller names the lane, supplied packet including prerequisites and dependency state, lane reference, parallel-safety basis, instance authority, expected receipt, and parent reduction point. The caller may equal or narrow the lane reference's stable maximum authority; it must never widen it.

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

# Skill Creation Process

## What Belongs in SKILL.md

Include every applicable element below. Choose headings and a format that fit the skill:

- **Mental model or stance:** the lens or domain model that improves judgment.
- **All-run spine:** the work from load to completion in one scan; order steps only when order changes behavior.
- **Completion checks:** each meaningful step or reference pass says what must be true before continuing.
- **Always-needed steering and invariants:** keep rules every run needs inline and near the decision they govern.
- **Reference calls:** name the load mode, exact destination, requested work, and concrete result the main path consumes.
- **Lane dispatch, when handed to a subagent:** name the dispatch mode, bounded instance packet, lane reference, parallel-safety basis, instance authority, receipt, and parent reduction point.
- **Overall completion boundary:** name the proof, unresolved conditions, or blockers that prevent a done claim.

Reference calls and lane dispatches use the Call Grammar above; placement follows Progressive Disclosure above.

## Review Lanes

Each lane loads one file from `references/lanes/` and returns candidate findings; the parent verifies and reduces them.

Dispatch every lane through `manage-agents` as a reviewer. Its `Context And Access` section (`../manage-agents/SKILL.md`) sets `parent conversation history: none` and `workspace access: read-only` for reviewers; `manage-agents` owns the dispatch mechanics; `references/skill-review-lane-schema.md` owns the review packet, lane finding, and parent reduction shapes. A reviewer carrying the authoring session's history inherits its rationalizations, which is the one thing review exists to avoid. Prefer native dispatch in the parent host's own lineage; when the runtime can reach another lineage, give at least one lane a different-lineage reviewer, because a second model family fails differently than the one that wrote the text.

Lane selection lives here and nowhere else. A lane file never states when it runs.

Two gates run before the table, in order.

**Gate 1 — change class.** A mechanical change — a typo, version bump, or metadata edit with no behavior claim, outside any executable or privileged surface — dispatches nothing and takes static validation only. Stop here. A typo inside a script, hook, or other sensitive surface is not mechanical: it goes to the table and dispatches `sensitive-surface`.

**Gate 2 — artifact.** A **proposal** exists only in conversation and dispatches exactly `mental-model-fit`, `trigger-routing`, and `rule-agreement` — the lanes whose questions are answerable about a design. The table does not apply. `no-op-pruning`, `placement-and-calls`, and `claim-vs-evidence` need line-level text, call sites, and real transcripts; against a proposal they would open the currently shipped file and return a clean receipt about text nobody proposed. **Changed files** exist on disk and go to the table. **Existing files** — evaluating a shipped skill nobody has edited — also go to the table, with every row its current surfaces satisfy; there is no diff, so lanes read whole files.

For changed files, dispatch the union of every row whose surface the change touched. The rows are the four surfaces of the Great Skill Frame, plus the security gate:

| reviewed surface                     | lanes dispatched                                |
| ------------------------------------ | ----------------------------------------------- |
| `SKILL.md` body (main path)          | placement-and-calls, steering-strength,         |
|                                      | mental-model-fit, no-op-pruning, rule-agreement |
| reference text (depth)               | rule-agreement, no-op-pruning                   |
| frontmatter or description (trigger) | trigger-routing                                 |
| a behavior-proof claim (proof)       | claim-vs-evidence                               |
| a sensitive surface                  | sensitive-surface                               |

For classification `create`, the reviewed surface is the new files, not a diff. Sensitive surfaces are the set owned by `references/skill-security-review.md`; plugin manifests and versioning are not among them and route to `references/platform-mechanics.md` instead.

IF any lane will be dispatched, load `references/skill-review-lane-schema.md` and return the review packet, the common lane contract, and the parent reduction shape before the first dispatch.

### Review Dispatch Contract

Applied to each selected lane:

```text
MUST dispatch `<lane>` to a subagent using `<review packet>`.
Subagent loads `references/skill-review-lane-schema.md` and `references/lanes/<lane>.md`.
Parallel-safe after the reviewed artifact exists; actual scheduling may serialize.
Instance authority is the reviewer contract in `manage-agents`.
Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

`manage-agents` owns pattern, model category, lineage, runtime, history, workspace access, and packet mechanics. This skill owns only which lanes run and what each returns.

No lane reads another lane's receipt, so every dispatch is one readiness wave with no barrier.

The parent collects every receipt explicitly. A dispatched lane that returns nothing is `no-receipt`, not `complete` — silence is never a clean review. Await one terminal receipt per dispatched lane, and ask for it if the lane goes quiet. While any dispatched lane is `partial`, `blocked`, or `no-receipt`, the run may not advance to `PR-ready` or `released` unless the parent closes that exact gap itself and records how. Synthesis is the parent's: merge duplicate findings across lanes, resolve conflicts against the artifact, name what no lane examined, and rank.

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

**1. Name the promise and success.** Classify the run; run an existing-surface check; name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." Before behavior-changing authoring, state a concise, human-readable success definition that names the observable behavior and situation that matter. Ask the user when missing meaning would materially change the intended behavior; do not derive the need from current skill wording alone. IF evaluating an existing skill or draft, load `references/skill-spec-review.md` and return one of its allowed verdict labels plus the blocker overrides, rubric evidence, first revision, and proof implication. Completion: classification, owner, reusable behavior, baseline or review target, and success definition are named.

For any classify, scope, or draft response, state the surface allocation in plain words before the details: YAML/frontmatter is the trigger surface, `SKILL.md` will carry the mental model and main path, `references/` will carry coherent mandatory detail and conditional branch depth, and pressure or static proof will validate the change.

**2. Choose the authoring basis and proof posture.** A change is behavior-changing when it alters the skill's trigger or invocation, mental model, main path, reference/lane/schema allocation, steering, completion, proof, security, or platform contract. Typos, formatting, version-only changes, and metadata-only changes with no behavior claim are mechanical and static-only. Classify behavior-changing work as `observed failure` or `user-directed intent`. For an observed failure, attempt faithful reproduction before claiming a causal fix. If the failure is reproduced, name the targeted RED. If it is not reproduced, evidence is insufficient, or the result is inconclusive, show the gap and ask the user to supply evidence and retry, approve a representative hypothesis, author from the success definition with a named proof gap, or defer. A representative hypothesis tests an approved substitute; it does not reproduce the historical incident. User-directed work may draft from an approved success definition without RED. Never manufacture RED or let a passing control automatically forbid authoring. "I already know the wording problem" is not a skip. Completion: authoring basis, reproduction result when applicable, user decision, and strongest honest proof posture are explicit.

**3. Design the trigger.** Choose the invocation capabilities, then write the YAML description as a trigger-only context pointer for that choice. It should start with the real loading condition, use words the user/docs/code are likely to use, name distinct branches once, include a brief payoff when useful, and avoid internal step narration. IF the run must decide trigger wording, distinguish an adjacent-skill boundary, or choose an invocation tradeoff, load `references/frontmatter-design.md` and return the trigger and invocation decision. IF client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

**4. Build the mental model.** Decide what concept, lens, or leading word the skill should pull into the model's latent space. State the behavior the skill stabilizes and the judgment it should improve. Completion: the mental model is stated before details or exceptions, and a reader of it alone can predict the shape of the workflow.

**5. Shape the main path.** Express the authored body contract in the form this skill needs: steps, a compact route, references, or a mix. Keep the all-run spine, always-needed steering, and overall completion boundary visible. Put ordered steps in `SKILL.md` only when order changes behavior. End each meaningful step or reference pass with a checkable completion criterion. Completion: the main path is visible in one scan and cannot be mistaken for a loose essay or link-only router.

**6. Build the workflow and calls.** Name the all-run workflow from load to completion. Add a branch only when an observable condition changes the work; a topic being interesting, provider-specific, or detailed is not enough. Each branch names its predicate, action or destination, and concrete return. A result of only "more context" is incomplete. Strengthen predicates, returns, and completion criteria when the agent would guess or stop early.

Write every call site here, in the literal grammar above. A `load` site names its mode, path, requested work, and needed result. A `dispatch` site names the lane, and then either carries the packet, lane reference, parallel-safety basis, non-widening instance authority, receipt, and parent reduction point inline, or cites a named dispatch contract in `SKILL.md` that carries them for a set of lanes. Prefer the shared contract when several sites dispatch under the same terms; repeating six fields at every site is the duplication this skill exists to prevent.

Completion: one all-run spine is explicit, every branch changes the work, every call site is complete under the grammar or under a named dispatch contract, and every route returns something the main path can use.

**7. Place the depth.** Keep all-run obligations, decisions, invariants, required returns, and completion in the body while allowing coherent detailed procedure to have its own owner. MUST load `references/reference-design.md` and return the placement decision plus the ordinary caller/callee contract. IF work is parallel-safe and ready for bounded subagent handoff, load `references/reference-lanes-design.md` and return the lane qualification and job contract. IF multiple consumers need stable model-readable output, load `references/reference-lanes-design.md` and return the output-shape owner. IF a tool, test, CI check, or runtime validates structure, load `references/reference-lanes-design.md` and return the tool-shape owner and validation route. Completion: nothing sits in two homes, every reference has a strong caller, and advanced shape guidance remains discoverable even when no lane exists.

**8. Steer the behavior gap.** Match the guidance form to the observed failure, representative hypothesis, or user-approved success gap:

| observed failure                  | guidance form                               |
| --------------------------------- | ------------------------------------------- |
| known rule skipped under pressure | bright-line rule + rationalization table    |
| wrong output shape                | positive output shape or template           |
| omitted element                   | required slot next to the output            |
| conditional behavior mistake      | observable predicate + action               |
| shallow legwork                   | stronger completion criterion               |
| wrong invocation                  | sharper description or user-invocable route |
| reference retrieval gap           | stronger context pointer or inline material |

Completion: wording changes cite the failure or success gap they are meant to address without overstating its evidence source.

**9. Review the spec.** IF the change is behavior-changing, do both of the following before any file is edited, unless the user explicitly says no review is needed: dispatch the lanes selected by Review Lanes above, under the Review Dispatch Contract, against the proposed design, and load `references/skill-spec-review.md` and return the verdict, blocker overrides, and implementation decision. Accepted findings return to the design step that owns them before implementation starts. Completion: spec review is parent-reduced to accepted-to-implement, explicitly skipped by the user, or not applicable because the change is mechanical.

**10. Implement.** IF any surface on the sensitive-surface list in `references/skill-security-review.md` is in scope, load that reference before writing anything and return its allowed, disallowed, blocked, or deferred decision; a `disallowed` or `blocked` decision stops the write. Then edit the skill surface inside the accepted boundary. Completion: the implemented diff is compared against the accepted spec boundary and the result is stated as either `deviations: none` or a named list.

**11. Review the implementation, then prove.** Run this as one loop, review first. Proof that runs before review wastes a run on text the review is about to change.

1. IF the change is behavior-changing, dispatch the lanes selected by Review Lanes above, under the Review Dispatch Contract, against the changed files, unless the user explicitly says no review is needed.
2. Synthesize the receipts yourself; no lane does this. Merge findings two lanes reported as one defect, resolve conflicts against the artifact rather than by lane seniority, name what no dispatched lane examined, and rank what to fix first. Completion: the Parent Reduction block from `references/skill-review-lane-schema.md` is emitted with merged duplicates, lane conflicts, routed findings, coverage gaps, and first fix filled; every dispatched lane appears by name with its status, and a lane contributing no accepted finding appears with the reason.
3. Parent-reduce candidate findings against the actual files and the accepted spec. Accepted findings route back to the phase that owns them: spec mismatch to step 9, wording or placement to step 10, claim honesty to the proof run below, ship surface to step 12.
4. Apply accepted fixes, then run the proof route chosen in step 2. Evaluation may precede or follow a first user-directed draft. If evaluation is deferred, return a source-only result with a named proof gap; do not claim demonstrated improvement, regression protection, or a verified fix. A reproduced RED may support a candidate GREEN only after a comparable rerun. A passing baseline may characterize native behavior or a weak comparison without prohibiting authoring. Choose proof by skill type:

- discipline skill: pressure scenario plus rationalization capture.
- technique skill: application to a fresh but similar task.
- pattern skill: recognition, application, and counter-example.
- reference skill: retrieval and correct use of the referenced material.
- mechanical change: validator, packaging, or metadata proof only.

5. IF a fix changed text a lane already reviewed, dispatch that lane again to a subagent under the Review Dispatch Contract using the refreshed packet, and refresh its changed-file coverage. Do not reuse a receipt for text edited after it was written.

IF the change is behavior-changing, load `references/pressure-testing.md` and return the proof protocol, evidence, and claim boundaries. IF the change is behavior-changing and ship status is advancing to `PR-ready` or `released`, load `references/skill-implementation-review.md` and return changed-file coverage, ship decision, and the `implementation-review-swarm` routing. Completion: review is parent-reduced, changed-file coverage is accounted for after every review-fix edit, and the authoring result, behavior evidence, and remaining proof gap are reported separately. Static proof is not relabeled behavior proof, and Git or PR existence is not proof maturity.

**12. Prune and ship.** Run the deletion test sentence by sentence: would agent behavior change if this disappeared? If not, delete it. IF shipping, load `references/platform-mechanics.md` and return the validation, versioning, changelog, and cache/readback route. IF any surface on the sensitive-surface list in `references/skill-security-review.md` is in scope, load that reference before outlining or writing the surface and return its allowed, disallowed, blocked, or deferred decision. That list is the single owner of the term set; do not restate it here. Chat-only sensitive-surface reviews still use that reference's return labels, including license/permission and copy-vs-adapt decisions for third-party source. Completion: the skill is compact, valid, public-safe, and proof route matches shipping status.

## Completion Blockers

The run is not done while any of these hold:

- the YAML description summarizes the workflow instead of triggering the skill;
- `SKILL.md` lacks a mental model or main path;
- behavior-changing authoring lacks a human-readable success definition or authoring basis;
- an observed-failure path hides a failed, missing, or inconclusive reproduction result instead of returning the user decision;
- the workflow has branches without observable predicates or return shapes;
- an all-run obligation, decision, invariant, required return, or completion boundary is hidden exclusively in a reference;
- a reference caller omits its literal load mode, path, requested work, or needed result;
- a dispatch site omits its lane, or omits any of the packet, lane reference, parallel-safety basis, non-widening instance authority, receipt, or parent reduction point, without citing the Review Dispatch Contract;
- review ran outside the Review Lanes contract: the dispatched lanes do not match the changed surface, a reviewer was forked from the authoring session instead of run in fresh context, or a receipt was reused for text edited after that receipt was written;
- implementation completed without stating `deviations: none` or a named list against the accepted spec boundary;
- branch-only depth is inlined without a strong reason;
- a behavior-changing shipped update has neither behavior proof nor an explicit user-accepted proof gap;
- a behavior-changing skill change reached implementation without required spec review or explicit user skip;
- a behavior-changing skill change reached `PR-ready` or `released` without parent reduction and synthesis of the review lanes, changed-file coverage, and targeted retest, unless the user explicitly skipped review;
- a dispatched lane was counted as reviewed without a terminal receipt, or a `partial`, `blocked`, or `no-receipt` lane was left open at `PR-ready` or `released` without a recorded parent closure;
- static validation is claimed as behavior proof;
- a sensitive surface was written without an allowed/disallowed/blocked/deferred decision recorded before that surface was outlined or written;
- required platform static validation failed, or was skipped without a stated reason.
