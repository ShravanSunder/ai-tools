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

### Progressive Disclosure

Two different reasons move material out of `SKILL.md`.

**Branch** — only some runs need it. Moving it out keeps every other run from reading it. This is the `IF <predicate>, load` case, and it is an attention decision.

**Module** — every run needs it, but it is one coherent thing that changes for its own reason. Moving it out keeps the main path scannable and lets that piece be maintained on its own. This is the `MUST load` case, and it is a maintenance decision.

Moving all-run procedure behind `MUST load` does not move the obligation. The obligation, order, decision, required return, invariant, and completion stay visible in `SKILL.md`; the reference owns the detail.

Four things never move out: the mental model, the all-run spine, rules every run needs at the decision they govern, and the completion boundary.

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

Keep the body compact and scan-first. Long examples, provider mechanics, branch-local rubrics, and exceptional procedure belong behind strong callers. Use this mutually exclusive grammar:

```text
Reference
  MUST load `<reference>` and return `<result>`.
  IF `<predicate>`, load `<reference>` and return `<result>`.

Lane handoff
  MUST dispatch `<lane>` to a subagent using `<packet>`.
  IF `<predicate>`, dispatch `<lane>` to a subagent using `<packet>`.
  Subagent loads `<lane-reference>`.
  Parallel-safe after `<prerequisites>`; actual scheduling may serialize.
  Instance authority is equal to or narrower than `<lane-reference maximum>`.
  Return `<complete | partial | blocked receipt>`; parent verifies and reduces it.
```

`MUST` is the all-run path; `IF` is an observable branch. Use exactly one at a call site. `load` consumes reference content in the current workflow. `dispatch` hands a lane to a subagent. A dispatch caller names the lane, supplied packet including prerequisites and dependency state, lane reference, parallel-safety basis, instance authority, expected receipt, and parent reduction point. The caller may equal or narrow the lane reference's stable maximum authority; it must never widen it.

## Scaled Run Note

Use a compact run note when implementation, shipping, disputed scope, or proof needs tracking. Do not make chat-only discussion perform state ceremony.

```text
classification: create | update | evaluate
target skill / owner plugin:
reusable behavior:
baseline or review target:
invocation: model-invocable | user-invocable
branches loaded:
security route: allowed | disallowed | blocked | deferred | n/a
proof route: RED | GREEN | static-only | pressure scenario | micro-test | proof gap
shipping status: source-only | PR-ready | released
```

## Workflow

**1. Name the promise.** Classify the run; run an existing-surface check; name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." IF evaluating an existing skill or draft, load `references/skill-spec-review.md` and return its allowed verdict, blocker overrides, rubric evidence, first revision, and proof implication. Completion: classification, owner, reusable behavior, and baseline or review target are named.

For any classify, scope, or draft response, state the surface allocation in plain words before the details: YAML/frontmatter is the trigger surface, `SKILL.md` will carry the mental model and main path, `references/` will carry coherent mandatory detail and conditional branch depth, and pressure or static proof will validate the change. This is part of alignment, not ceremony.

**2. Prove first (behavior-changing work).** A change is behavior-changing when it alters the skill's trigger or invocation, mental model, main path, reference/lane/schema allocation, steering, completion, proof, security, or platform contract. Typos, formatting, version-only changes, and metadata-only changes with no behavior claim are mechanical. Before describing or writing any behavior-changing update, name a pressure scenario or micro-test that already fails against the current skill (RED). State the order visibly as RED before edit, wording, or change. Creates may draft from a hypothesized baseline; they still need GREEN before `PR-ready` or `released`. Mechanical changes are static-only and must be labeled that way. "I already know the wording problem" is not a skip. Completion: RED is named, or the change is explicitly static-only.

**3. Design the trigger.** Choose the invocation capabilities, then write the YAML description as a trigger-only context pointer for that choice. It should start with the real loading condition, use words the user/docs/code are likely to use, name distinct branches once, include a brief payoff when useful, and avoid internal step narration. IF the run must decide trigger wording, distinguish an adjacent-skill boundary, or choose an invocation tradeoff, load `references/frontmatter-design.md` and return the trigger and invocation decision. IF client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

**4. Build the mental model.** Decide what concept, lens, or leading word the skill should pull into the model's latent space. State the behavior the skill stabilizes and the judgment it should improve. Completion: `SKILL.md` has a clear mental model before details or exceptions.

**5. Shape the main path.** Express the authored body contract in the form this skill needs: steps, a compact route, references, or a mix. Keep the all-run spine, always-needed steering, and overall completion boundary visible. Put ordered steps in `SKILL.md` only when order changes behavior. End each meaningful step or reference pass with a checkable completion criterion. Completion: the main path is visible in one scan and cannot be mistaken for a loose essay or link-only router.

**6. Build the workflow and calls.** Name the all-run workflow from load to completion. Add a branch only when an observable condition changes the work; a topic being interesting, provider-specific, or detailed is not enough. Each branch names its predicate, action or destination, and concrete return. A result of only "more context" is incomplete. Strengthen predicates, returns, and completion criteria when the agent would guess or stop early. Completion: one all-run spine is explicit, every branch changes the work, each call follows the literal grammar above, and every route returns something the main path can use.

**7. Place the depth.** Keep all-run obligations, decisions, invariants, required returns, and completion in the body while allowing coherent detailed procedure to have its own owner. MUST load `references/reference-design.md` and return the placement decision plus the ordinary caller/callee contract. IF work is parallel-safe and ready for bounded subagent handoff, load `references/reference-lanes-design.md` and return the lane qualification and job contract. IF multiple consumers need stable model-readable output, load `references/reference-lanes-design.md` and return the output-shape owner. IF a tool, test, CI check, or runtime validates structure, load `references/reference-lanes-design.md` and return the tool-shape owner and validation route. Completion: nothing sits in two homes, every reference has a strong caller, and advanced shape guidance remains discoverable even when no lane exists.

**8. Steer the failure.** Match the guidance form to the observed or hypothesized failure:

| observed failure                  | guidance form                               |
| --------------------------------- | ------------------------------------------- |
| known rule skipped under pressure | bright-line rule + rationalization table    |
| wrong output shape                | positive output shape or template           |
| omitted element                   | required slot next to the output            |
| conditional behavior mistake      | observable predicate + action               |
| shallow legwork                   | stronger completion criterion               |
| wrong invocation                  | sharper description or user-invocable route |
| reference retrieval gap           | stronger context pointer or inline material |

Completion: wording changes cite the failure form they are meant to fix.

**9. Review the skill spec.** IF the change is behavior-changing under step 2, load `references/skill-spec-review.md` before implementation and return its verdict and proof implication unless the user explicitly says no review is needed. Use two read-only perspectives: `fresh-perspective` plus a second independent local perspective by default. Use `outside-model` only when the user explicitly requests external counsel; otherwise record `outside-model not requested`. Name both perspectives in the run plan before implementation, including read-only planning responses that stop before edits. The plan line should say `review perspectives: fresh-perspective + local-lane` or `review perspectives: fresh-perspective + outside-model requested`. Mechanical changes with no behavior claim may stay static-only. Accepted findings return to the relevant spec step above before files are edited. `references/skill-review-output-schema.md` remains the shared packet, finding, coverage, and reduction shape. Completion: spec review is parent-reduced to accepted-to-implement, explicitly skipped by the user, or not applicable because the change is mechanical/static-only.

**10. Implement and prove GREEN.** After the spec is accepted, edit the skill surface and rerun the chosen proof route. Behavior-changing work needs GREEN before `PR-ready` or `released`; mechanical changes use static validation only. Choose proof by skill type:

- discipline skill: pressure scenario plus rationalization capture.
- technique skill: application to a fresh but similar task.
- pattern skill: recognition, application, and counter-example.
- reference skill: retrieval and correct use of the referenced material.
- mechanical change: validator, packaging, or metadata proof only.

Completion: proof route is explicit and static proof is not relabeled behavior proof. IF behavior changes, load `references/pressure-testing.md` and return the RED/GREEN protocol and required evidence.

**11. Review the implementation.** After proof exists and before `PR-ready` or `released`, IF the skill change is behavior-changing under step 2, load `references/skill-implementation-review.md` and return changed-file coverage, proof-quality findings, targeted retest, and ship decision unless the user explicitly says no review is needed. For final repo skill-work readiness, route through `implementation-review-swarm` and use that reference as the skill-specific rubric and packet input. Use two read-only perspectives: `fresh-perspective` plus a second independent local perspective by default. Use `outside-model` only when the user explicitly requests external counsel; otherwise record `outside-model not requested`. Name both perspectives in the implementation-review plan and reduction. The review checks the actual changed files, proof quality, pressure coverage, and accepted spec constraints. Accepted findings route back to implementation and proof; parent-reduce candidate findings; after fixes, rerun the targeted proof that could catch the issue and refresh the implementation-review reduction or changed-file coverage for files touched by the fix. Completion: implementation review is parent-reduced, changed-file coverage is accounted for after any review-fix edits, and targeted retest is complete or the user explicitly skipped review.

**12. Prune and ship.** Run the deletion test sentence by sentence: would agent behavior change if this disappeared? If not, delete it. IF shipping, load `references/platform-mechanics.md` and return the validation, versioning, changelog, and cache/readback route. IF scripts, hooks, assets, package scripts, shell/network behavior, third-party source adoption, private auth material, privileged actions, installed-cache refresh, or home-level mutation are in scope, load `references/skill-security-review.md` before outlining or writing them and return its allowed, disallowed, blocked, or deferred decision. Chat-only sensitive-surface reviews still use that reference's return labels, including license/permission and copy-vs-adapt decisions for third-party source. Completion: the skill is compact, valid, public-safe, and proof route matches shipping status.

## Completion Blockers

The run is not done while any of these hold:

- the YAML description summarizes the workflow instead of triggering the skill;
- `SKILL.md` lacks a mental model or main path;
- a behavior-changing update described or edited wording before naming RED;
- the workflow has branches without observable predicates or return shapes;
- an all-run obligation, decision, invariant, required return, or completion boundary is hidden exclusively in a reference;
- a reference caller omits its literal load mode, path, requested work, or needed result;
- a dispatched lane omits its bounded packet, lane reference, parallel-safety basis, non-widening instance authority, receipt, or parent reduction point;
- branch-only depth is inlined without a strong reason;
- a behavior-changing shipped update has no behavior proof or accepted proof gap;
- a behavior-changing skill change reached implementation without required spec review or explicit user skip;
- a behavior-changing skill change reached `PR-ready` or `released` without implementation-review reduction, changed-file coverage, and targeted retest, unless the user explicitly skipped review;
- static validation is claimed as behavior proof;
- a sensitive surface was touched without an allowed/disallowed/blocked/ deferred decision;
- required platform static validation failed, or was skipped without a stated reason.
