---
name: skill-creation
description: "Use when designing or writing one named skill, or its skill spec, especially when its trigger, main path, references, steering, or proof plan need judgment. Not for judging a finished skill (skill-review) or for choosing which skills should exist (skill-audit)."
---

# Skill Creation

A skill wrangles determinism out of a stochastic system by making the agent follow a predictable process.

Predictable means the same process, not the same output. A brainstorming skill should diverge every run and still take the same route to diverge.

## Stance

Work on exactly one named skill per run. Portfolio inventory, duplicate-surface archaeology, and "which skills should exist" belong to `skill-audit`.

Open the skill's current files before saying anything about them. A claim about text you have not read in this run is not made; "I already know this skill" is not a read.

Whoever writes a change never reviews it. Review runs in agents that did not write it (`skill-review`).

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
| `MUST dispatch` procedure | a helper agent | on reaching the call |
| `IF ..., dispatch` procedure | a helper agent | when the predicate holds |

Review checks and research are steps the current agent loads and performs. Dispatch is only for a prescribed procedure: a command, watch, or mechanical transform with an observed result. A judgment check is never a dispatched procedure, even when it could be described as independent.

### Call Grammar

A call the agent cannot act on sends it away with nothing to bring back. Each form names when to go, where, what to do there, and what to return — and every call site uses exactly one of them.

```text
Reference
  MUST load `<reference>` and return `<result>`.
  IF `<predicate>`, load `<reference>` and return `<result>`.
  ...add `to <requested work>` when the result alone does not say what to do there.
```

```text
Prescribed procedure
  MUST dispatch `<procedure>` to a helper agent using `<prescribed steps>`; return `<observed result>`.
  IF `<predicate>`, dispatch `<procedure>` to a helper agent using `<prescribed steps>`; return `<observed result>`.
```

The caller names the exact procedure, allowed commands or transformation, execution boundary, and result to return. The helper reports observations and exceptions; the calling agent judges them. A known check skipped under pressure cannot become a dispatched procedure because it is independent. Load its reference and perform it as a step.

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

# Creating a Skill

## What Belongs in SKILL.md

Include every applicable element below. Choose headings and a format that fit the skill:

- **Mental model or stance:** the lens or domain model that improves judgment.
- **All-run spine:** the work from load to completion in one scan; order steps only when order changes behavior.
- **Completion checks:** each meaningful step or reference pass says what must be true before continuing.
- **Always-needed steering and invariants:** keep rules every run needs inline and near the decision they govern.
- **Reference calls:** name the load mode, exact destination, and concrete result the main path consumes, plus the requested work where the result alone does not say what to do there.
- **Dispatch, for a prescribed procedure:** fill the procedure form in the Call Grammar above.
- **Overall completion boundary:** name the proof, unresolved conditions, or blockers that prevent a done claim.

Reference loads and dispatched procedures use the Call Grammar above; placement follows Progressive Disclosure above.

## Workflow

Steps 1–6 produce the skill spec: the proposal a reviewer can judge before any skill file changes. Step 7 writes the files inside the accepted spec. Proof and independent implementation review come after this skill: `skill-pressure-testing` proves behavior and `skill-review` reviews the changed files.

A run implementing one slice of an accepted multi-run skill spec reads that spec doc and takes its step 1–6 returns from it, quoting the slice's success definition, authoring basis, surface allocation, proof posture, and the decision rows it must honor, and checks the doc's coordination slot before editing. The doc is the commission for that slice, and each slice still names exactly one skill target.

### 1. Name the promise and success

Classify the run as `create` or `update`. IF the request is to judge an existing skill or a draft rather than change it, use `skill-review` and return its verdict instead of continuing here. Search the owning plugin or skill folder for an existing skill or reference that already owns the named behavior and return the matching paths or `none`. Name the reusable behavior in one sentence: "This skill helps agents reliably do X when Y happens." Before behavior-changing authoring, state a concise, human-readable success definition that names the observable behavior and situation that matter. Ask the user when missing meaning would materially change the intended behavior; do not derive the need from current skill wording alone.

An invitation like "just quickly fix it" that names neither a success definition nor an authoring basis is not a commission for an `update` run.

Completion: classification, owner, reusable behavior, baseline, success definition, and the surface allocation — which of the four surfaces carries each part of the change — are named.

### 2. Choose the authoring basis and proof posture

IF the work the skill teaches lives in someone's head and is not yet understood, interview the user until you can restate it and they confirm the restatement; return the confirmed restatement. IF it lives in artifacts the run has not read, read them and return what each establishes with its path. `Build the main path`, `Place the depth`, and `Implement` consume these returns.

Then classify the change, and classify why you are making it.

| change class        | qualifies when                                                                                                                                                                                                                      | consequence                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `mechanical`        | typos, formatting, version-only, or metadata-only edits with no behavior claim                                                                                                                                                       | static-only; skips both reviews                           |
| `behavior-changing` | the diff alters trigger or invocation, mental model, main path, reference/check/schema allocation, steering, completion, proof, security, or platform contract                                                                        | both review stages plus the proof posture below           |
| `scoped` (behavior-changing) | behavior-changing, and the entire diff is wording inside one owned home — `SKILL.md` prose or a single reference — touching no trigger, call site, branch predicate, check selection, schema, label set, security surface, or ownership boundary | each review stage narrows to its scoped form; proof rules unchanged |

Every classification is a claim the next reader can check, and this session makes the call about its own work: `mechanical` names the surfaces the change touches and shows none is in the behavior-changing row; `behavior-changing` names which listed surface the diff alters; `scoped` names its one home and shows each excluded surface is untouched. Edits to `SKILL.md` prose, a reference's rules, or the description are behavior-changing whatever their size — small is not a surface.

Behavior-changing work is either `observed failure` or `user-directed intent`. The basis picks the done bar the change must later meet.

- **`user-directed intent`** may draft from an approved success definition without RED. Its done bar is `new-from-intent`: its checks pass and fresh runs on realistic prompts show the behavior.
- **`observed failure`** attempts faithful reproduction before any causal fix is claimed. IF the authoring basis is `observed failure`, load `../skill-pressure-testing/references/proof-and-claims.md` to attempt faithful reproduction and return the reproduction result, representative-hypothesis boundary, and available next decisions. Reproduced means a targeted RED, and the done bar is `fix-for-recorded-failure`: the failure shows in a test before the fix and three fresh runs pass after it. Any other result means showing the gap and asking the user to supply evidence and retry, approve a representative hypothesis, author from the success definition with a named proof gap, or defer.

Never manufacture RED, and never let a passing control automatically forbid authoring. "I already know the wording problem" is not a skip.

Completion: authoring basis, done bar, reproduction result when applicable, user decision, and strongest honest proof posture are explicit — and each sourcing return that ran exists. A `mechanical` classification names the surfaces it touched; a `scoped` classification names its one home and shows each excluded surface is untouched.

### 3. Design the trigger

Choose the invocation capabilities, then write the YAML description as a trigger-only context pointer for that choice. MUST load `references/frontmatter-design.md` and return the trigger and invocation decision; that reference owns description wording, the description pattern, adjacent-skill boundaries, and the shapes to avoid. IF client-specific invocation controls are requested, load `references/platform-mechanics.md` and return the platform encoding. Completion: invocation capabilities are named, and description or platform policy matches them without summarizing the workflow.

### 4. Build the main path

Judge each part against the one before it: the lens against what the trigger promised, the route against the lens, the call sites against the route, the wording against the failure it targets.

#### The lens

Decide what concept, lens, or leading word the skill should pull into the model's latent space. State the behavior the skill stabilizes and the judgment it should improve. A reader of the mental model alone should be able to predict the shape of the workflow.

#### The route

Express the body in the form this skill needs: steps, a compact route, references, or a mix. IF the classification is `create` or the main-path shape is contested, load `references/worked-examples.md` to anchor the small end of the range and return the shape choice for this skill. Keep the all-run spine, always-needed steering, and the overall completion boundary visible. Put ordered steps in `SKILL.md` only when order changes behavior. Name the workflow from load to completion.

Add a branch only when an observable condition changes the work; a topic being interesting, provider-specific, or detailed is not enough. `IF the skill needs more depth, load ...` is a topic wearing IF clothing; `IF the diff adds a script, load references/security-gate.md` is a branch — the condition is observable and the work changes. Each branch names its predicate, action or destination, and concrete return. A result of only "more context" is incomplete.

#### The call sites

Write every call site here, in the literal grammar above. A `load` site names its mode, path, and needed result, plus the requested work where the result alone does not say what to do there. A `dispatch` site names a prescribed procedure, its steps and boundary, and the observed result. Review checks and research use `load` sites.

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

Completion: the mental model is stated before details or exceptions; one all-run spine is visible in one scan and handles every branch the description promises; every branch changes the work and returns something the main path can use; every call site is complete under the grammar; and wording changes cite the failure or success gap they address without overstating its evidence source.

### 5. Place the depth

Keep all-run obligations, decisions, invariants, required returns, and completion in the body while allowing coherent detailed procedure to have its own owner. MUST load `references/reference-design.md` and return the placement decision plus the ordinary caller/callee contract. Depth must teach: a reference owning a promised stage carries what to inspect, what good and bad look like, and when to stop — written from the step-2 sourcing records or a named source; a reference that only pins output shape (schemas, label sets, packet forms) is ceremony, justified by a named consumer and never a stage's owner. IF several consumers need one stable output shape or a tool validates the structure, load `references/shared-shape-design.md` and return the output or tool shape owner and its consumers. Completion: nothing sits in two homes, every reference exists because a named call site asked for it, every promised stage names its teaching owner — an inline body section or a teaching reference — and advanced shape guidance remains discoverable.

### 6. Write the skill spec and get it reviewed

MUST load `references/skill-spec.md` and return the skill spec, in the conversation or as a doc as that reference decides. IF the change is behavior-changing, before any skill file is edited and unless the user explicitly says no review is needed, use `skill-review` at its spec stage and return its implementation decision. Accepted findings inside the settled design return to the step that owns them; a finding that changes design meaning, scope, or a user decision goes to the user first. Completion: the spec is written, and its review decision is `accepted-to-implement`, explicitly skipped by the user, or not applicable because the change is mechanical.

### 7. Implement

IF any surface on the sensitive-surface list in `references/security-gate.md` is in scope, load `references/security-gate.md` before outlining or writing the surface and return its allowed, disallowed, blocked, or deferred decision; a `disallowed` or `blocked` decision stops the write. Then edit the skill surface inside the accepted boundary, and update the spec's run status to `implemented`. Completion: compare the implemented diff against the accepted spec boundary; name a deviation when one exists, and name the proof and implementation review still owed.

## Completion Blockers

The run is not done while any of these hold:

- `SKILL.md` lacks a mental model or main path;
- behavior-changing authoring lacks a human-readable success definition, authoring basis, or done bar;
- an observed-failure path hides a failed, missing, or inconclusive reproduction result instead of returning the user decision;
- the workflow has branches without observable predicates or return shapes;
- a promised stage or branch has no teaching owner — an inline body section or a reference that teaches it; a shape-only reference never owns a stage and separately requires a named consumer;
- a dispatch site is judgment work rather than a prescribed procedure, or omits its steps, boundary, or observed result;
- a behavior-changing change reached implementation without an accepted spec review or an explicit user skip;
- implementation completed without comparing the diff to the accepted spec boundary;
- a change was classified `mechanical` without naming the surfaces it touched, or `scoped` without showing each excluded surface is untouched;
- a sensitive surface was written without an allowed/disallowed/blocked/deferred decision recorded before that surface was outlined or written;
- static validation is claimed as behavior proof.
