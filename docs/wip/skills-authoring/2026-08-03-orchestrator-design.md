# Orchestrator Design Skill Proposal

## Objective

Create `shravan-dev-workflow:orchestrator-design` as guidance an agent uses to route one bounded design cycle. The agent applies the skill named by the current phase-guided result, carries a compact handoff forward, records the transition, and stops when the route is complete or its call budget is exhausted.

The agent is always the actor. Phase skills supply the judgment method for requirements, specification, program design, pathfinding, and review. `orchestrator-design` supplies only routing, explanation, temporary record keeping, and cycle limits; it supplies no competing semantic judgment.

## Success definition

When a user asks to take a product or system change through design, the agent uses `orchestrator-design` to explain the cycle, begin with `spec-design`, follow the phase-guided route recommendations through critically validated pair review, permit at most one bounded correction pass, and stop before planning or implementation without inventing a next step.

## Problem and evidence

Repeated corrections during this proposal exposed one failure: orchestration kept absorbing requirements admission, finding validation, model-break classification, and correction ordering. Those judgments already have owners:

- `plugins/shravan-dev-workflow/skills/spec-design/SKILL.md` owns source authority, requirements admission, and conditional initial pathfinding;
- `plugins/shravan-dev-workflow/skills/program-design/SKILL.md` owns specification-gap and structural-decision classification;
- `plugins/shravan-dev-workflow/skills/spec-program-review/SKILL.md` and `references/finding-and-reduction-schema.md` own parent validation and reduction of reviewer candidates;
- `plugins/shravan-dev-workflow/skills/discuss-pathfinding/SKILL.md` owns extraction and confirmation of unwritten owner meaning.

The reusable gap is coordination between those results, not another semantic decision-maker.

## Mental model

The agent is the actor; `orchestrator-design` is the guarded-router guidance it uses between phases:

```text
agent applies current phase skill
  -> performs that phase's judgment
  -> produces a terminal result or one recommended next skill
                         |
                         v
agent applies orchestrator-design
  -> explains what completed and why the recommendation follows
  -> checks only route shape and remaining call budget
  -> records the compact handoff and transition
                         |
                         v
agent applies the recommended next skill
```

Under orchestration guidance, the agent rejects a missing, unknown, contradictory, or over-budget route. It does not replace one with a route it considers better.

## Why a separate orchestrator

The phase skills already guide design judgment. The missing reusable behavior is smaller: help the agent preserve the current workflow position across phase calls, explain the current and next phase, forward compact results without reinterpretation, enforce a bounded cycle, and expose the exact stop condition.

`orchestrator-goal` is not this owner. It coordinates a long-horizon delivery lifecycle through planning, implementation, review, and PR readiness. `orchestrator-design` ends at the design boundary and never invokes those systems.

## Route graph

```text
user asks to run or resume the design workflow
                    |
                    v
          +-------------------------+
          | agent uses              |
          | orchestrator-design     |
          +------------+------------+
                       |
          +------------+-------------+
          |                          |
        fresh                      resume
          |                          |
          v                          v
 initialize zero-transition    validate stored state
 state; no phase handoff       + terminal -> report unchanged
          |                    + active -> stored next skill
          |                    + invalid -> blocked
          | fresh-only fixed route
          v
              +-----------+
              | spec-design|
              +-----+-----+
                    |
        missing load-bearing owner meaning
                    |
                    v
        +------------------------+
        | discuss-pathfinding    |
        | agent applies under    |
        | spec-design guidance   |
        +-----------+------------+
                    | confirmed requirements record
                    v
              +-----------+
              | spec-design|
              +-----+-----+
                    | locally-ready recommends program-design
                    v
             +--------------+
             | program-design|
             +------+-------+
                    |
       +------------+---------------------------+
       |                                        |
 specification-gap                       locally-ready
 recommends spec-design                  recommends pair review
       |                                        |
       v                                        v
 +-----------+                        +---------------------+
 | spec-design|                       | spec-program-review |
 +-----------+                        +----------+----------+
                                                 |
                    +----------------------------+---------------------+
                    |                  |                 |             |
                  ready          accepted Why/What  accepted How  validated model failure
              terminal: ready    -> spec-design     -> program-    whose replacement needs
                                                      design       unmade owner meaning
                                                                      |
                                                                      v
                                                         +----------------------+
                                                         | discuss-pathfinding  |
                                                         +----------+-----------+
                                                                    |
                                                                    | returns only to the
                                                                    | review-supplied owner
                                                                    v
                                                       +-------------------------+
                                                       | spec-design or          |
                                                       | program-design          |
                                                       +-------------------------+
```

Program design also owns this conditional branch, shown separately to keep the main graph readable:

```text
program-design
  -> unmade owner-controlled structural choice
  -> discuss-pathfinding
       caller-supplied return: program-design
  -> correction program-design call
```

Initial requirements pathfinding remains inside the work guided by `spec-design`, which already owns the source-authority and requirements-admission method. Review-triggered pathfinding is different: the agent applying `spec-program-review` first validates the alleged model failure and establishes that replacement owner meaning is genuinely unmade, then produces an explicit `discuss-pathfinding` recommendation and evidence-backed handoff. A validated correction already determined by current authority points to `spec-design` or `program-design`; a missing-evidence result stops. The agent then uses orchestration guidance only to record and follow that recommendation.

## Responsibility boundaries

### `orchestrator-design`

Guides the agent only to:

- create or resume the design-run identity and private temporary state;
- make the fixed initial call to `spec-design`;
- validate that a returned route names an allowed skill and carries the required handoff;
- apply exactly the recommended next skill;
- maintain call counters and the one-cycle budget;
- record official transitions; and
- report the terminal phase result and exact reason for stopping.

While applying it, the agent does not inspect artifact meaning to choose a different route, reclassify a phase result, validate reviewer findings, repair phase-owned content, or manufacture a missing route.

### `spec-design`

Supplies the requirements-admission and authoritative Why/What method. The agent uses it to decide whether existing sources are sufficient and to apply `discuss-pathfinding` when load-bearing owner meaning is unwritten. After the update run, its guidance makes a `locally-ready` result recommend `program-design`; an unresolved result stops or recommends only the route selected through that method.

### `program-design`

Supplies the structural-How method. The agent uses it to decide whether the governing specification is sufficient. After the update run, its guidance makes a `specification-gap` recommend `spec-design`, a `locally-ready` result recommend pair review, and an unmade owner-controlled structural decision recommend `discuss-pathfinding` with `program-design` as the return destination.

### `spec-program-review`

Supplies the independent-review method. Reviewer subagents return candidate findings only. The agent applying `spec-program-review` opens the cited evidence, ties each candidate to an accepted requirement or boundary, reproduces the claimed failure, tests deletion before addition, checks scope, and assigns `accepted | rejected | contested | unverified` before producing a verdict or route.

After the update run, only that parent-validated result may recommend:

- no next skill for `ready` or `blocked`;
- `spec-design` for an accepted Why/What correction;
- `program-design` for an accepted structural-How correction;
- `discuss-pathfinding` when complete review evidence establishes both that the current model no longer holds and that replacement owner meaning is genuinely unmade.
- no next skill when an accepted correction belongs to the caller; the result remains `needs-revision` and supplies the exact caller action.

A genuinely unresolved owner choice is not an accepted correction: it returns `decision-needed`. Invalid or missing review input returns `blocked`. This preserves the existing review verdict precedence while keeping all three caller outcomes distinct.

For that pathfinding route, the review-guided result also supplies the return destination selected through validated semantic classification: Why/What returns to `spec-design`, structural How returns to `program-design`, and both return to `spec-design` first with the complete accepted set.

When validated accepted corrections span Why/What and structural How, the review-guided result recommends `spec-design` first and carries the complete accepted set. The later spec-guided result recommends `program-design`; orchestration guidance does not construct that sequence.

### `discuss-pathfinding`

Supplies the user-facing method for extracting and confirming unwritten requirements or design decisions. The agent applies it with the calling phase's return destination and break/decision handoff. When the decision is confirmed, the pathfinding-guided result returns the record only to that destination. If the confirmed meaning no longer fits, the agent stops and exposes the mismatch instead of selecting another phase. The result never recommends planning or implementation.

## Phase-result route requirement

Each participating skill keeps its existing terminal contract and adds one plain-language routing obligation: either say why work must stop, or recommend exactly one next skill, explain the phase-owned reason, and return the handoff that skill needs.

This is model-readable workflow guidance, not a public data format or runtime API. The first implementation does not create shared fields, a schema, parser, or library. The natural-language result may vary; the named next skill and its handoff may not be ambiguous.

The planned post-update mappings are:

```text
spec-design
  locally-ready       -> program-design
  decision-needed     -> stop
  evidence-blocked    -> stop
  deferred            -> stop
  note: initial requirements pathfinding remains internal to spec-design

program-design
  locally-ready       -> spec-program-review in pair mode
  specification-gap   -> spec-design
  decision-needed     -> discuss-pathfinding only when its own method
                         identifies an unmade owner-controlled structural choice;
                         required return: program-design;
                         otherwise stop
  evidence-blocked    -> stop
  deferred            -> stop

spec-program-review
  ready               -> stop ready
  blocked             -> stop
  needs-revision      -> spec-design for accepted Why/What,
                         program-design for accepted structural How,
                         or stop needs-revision with the exact caller action
                         for an accepted caller-owned correction
  decision-needed     -> discuss-pathfinding only when validated evidence shows
                         replacement owner meaning is unmade; review supplies
                         return to spec-design for Why/What, program-design for
                         structural How, or spec-design first for both;
                         otherwise stop

discuss-pathfinding when called through this workflow
  confirmed decision  -> caller-supplied return skill
  unresolved decision or no live user
                       -> stop decision-needed with unanswered questions
```

These are proposed contract changes implemented by the ordered skill runs below. The current shipped phase skills do not yet guarantee these route recommendations.

## Efficient handoffs and explanations

Before recommending a next skill, the agent applies the current phase skill to inspect what that destination needs and produce a compact semantic handoff. Each updated phase skill teaches this in its return path. That phase handoff contains only:

- pointers to the relevant requirements, specification, program design, review, or decision records;
- the phase-guided result and current boundary status;
- the exact open decision, evidence gap, or correction when one exists;
- one recommended next skill and why that skill owns the next work.

Under orchestration guidance, the agent attaches separate routing context containing only the current stage and remaining cycle limits. The next skill receives the unchanged phase handoff plus that routing context. A direct phase call has no cycle-budget obligation.

The combined transition excludes copied artifacts when pointers suffice, full conversation history, repeated background, unrelated evidence, and reviewer candidates the agent has not validated. The compact phase handoff is the sole semantic home of the recommended next skill, its reason, and any pathfinding return owner. The agent stores it unchanged so resume preserves its meaning; “unchanged” does not authorize a phase to emit a wall of text.

At cycle start, the agent uses `orchestrator-design` to explain:

```text
participating skills
  spec-design          goal boundary and observable contract
  program-design       structural realization
  spec-program-review  independent challenge of the pair
  discuss-pathfinding  owner decisions that are genuinely unwritten

design-cycle boundary
  starts with spec-design
  ends at a reviewed pair or an explicit stop
  never enters planning or implementation
```

At each transition, it reports only:

```text
completed skill -> recommended next skill or stop
why that result leads there
relevant artifact pointers and exact open decision
remaining cycle budget
```

The responsible phase explains difficult ownership, boundary, sequence, or model-break reasoning plainly and uses a diagram when that materially improves understanding. Orchestration guidance explains the workflow position and route; it does not recreate the phase's semantic explanation.

Under orchestration guidance, the agent validates only:

```text
next skill is one of:
  discuss-pathfinding
  spec-design
  program-design
  spec-program-review

required handoff exists
route does not enter planning or implementation
next skill matches the producing skill's declared terminal-result mapping

for an orchestrator-routed pathfinding call:
  require and record the exact return skill declared by the producing phase
  verify it matches that phase's route mapping before invocation
  record the caller-supplied return skill
  accept only that exact return skill
  a declared pre-invocation mismatch is an invalid route:
    stop blocked without another invocation
```

These are structural guards. An unknown target, missing required handoff, source-result route mismatch, wrong completed-pathfinding return target, or planning/implementation route stops as `blocked`. Only after those guards pass does the agent apply the special stale-review stop, then the remaining-budget check. A structurally valid route beyond the remaining stage budget stops as `cycle-limit-reached`. The agent reports the phase-guided route and does not infer a substitute.

One expected stop has precedence over generic over-budget failure: after a pair review has already run, a corrected phase may recommend pair review again. The agent records that recommendation, returns `correction-complete-review-stale`, and does not apply review again. This is a completed bounded correction, not an invalid route or `blocked` result.

## Private state

Every run uses:

```text
tmp/design-orchestration/<design_id>/details.md
tmp/design-orchestration/<design_id>/events.jsonl
```

`design_id` uses `<yyyy-mm-dd>-<short-slug>` and is reused in both files and every returned status.

`details.md` records each compact continuation handoff under one fresh identity, separately from orchestration-owned routing context: design-run identity, current stage, recorded invocation counters, remaining limits, and terminal condition. A handoff identity is only a local correlation label; it is not a hash or digest. It does not copy the recommended next skill, reason, or pathfinding return owner out of a phase handoff. A direct terminal phase result has no continuation-handoff identity; its exact result lives in the terminal payload. When the agent follows a phase handoff to invoke pathfinding, the routing context retains that initiating handoff identity; the immediately preceding `continue` event must reference the same identity. A matching return retains H1 until destination invocation or terminal stop is recorded. An invalid return retains H1 only until its blocked terminal event is recorded and verified. Both branches then clear the active association. For a terminal run `details.md` also retains the exact terminal payload required by that result: reason and artifact pointers in every case, plus caller action, deferral consequence and re-entry condition, unanswered questions, or the identity of the unchanged continuation handoff whose recommendation remains explanatory when applicable.

`events.jsonl` is the append-only transition history. Only the agent applying `orchestrator-design` writes it. Each event records the applied skill, `continue | stop`, terminal condition and terminal-payload identity when stopped, resulting counters, and two distinct identity roles when applicable: an accepted phase-return handoff identity and an initiating-pathfinding handoff association. A normal or accepted return has the first; a pathfinding return or its destination/terminal record also has the second. A completed pathfinding return rejected before handoff acceptance has no accepted-return identity: its blocked event records H1 only as the initiating-pathfinding association, while the terminal payload records the rejected-target reason and never treats H1 as an explanatory returned handoff. Events do not copy a phase-recommended next skill. The exact terminal payload has one home in `details.md`; the event carries only the identities needed to verify that both files describe the same result and pathfinding association.

The state is temporary coordination evidence, not a fifth design artifact. A stored phase handoff remains compact phase-guided input; the agent carries it unchanged and does not reinterpret or promote it as authority. The separately stored stage and counters remain orchestration-owned. On resume, a missing handoff or contradictory state stops the run; the agent does not reconstruct semantic meaning from chat.

## Call budget

One design cycle permits:

```text
pre-review spec-design calls:       at most 2
pre-review program-design calls:    at most 2
pair-review calls:                  at most 1
post-review spec-design calls:      at most 1
post-review program-design calls:   at most 1
orchestrator-routed pathfinding calls: at most 1
```

The first pre-review call to each authoring phase is its initial pass. A second pre-review call is the only recovery allowance for a returned specification gap or pathfinding decision. This permits one bounded `program-design -> specification-gap -> spec-design -> program-design` recovery before the first pair review without consuming post-review correction capacity.

Pathfinding applied inside the `spec-design` work for initial requirements admission remains part of that `spec-design` call. A program-design-guided or pair-review-guided result may recommend the one orchestrator-routed pathfinding call; once spent, another such route stops as `cycle-limit-reached`. Phase-owned local specification-only or program-only review also remains inside its authoring call.

Every phase invocation after orchestrator-routed pathfinding consumes the destination phase's allowance for the current stage: a pre-review return consumes a remaining pre-review call; a review-triggered return consumes the destination's post-review call. It never consumes capacity from the other stage.

Before the first pair review, a permitted specification or program-design recovery may continue to that first review when its route and remaining pre-review budget allow it.

After pair review has run, the agent never starts a second pair review automatically under orchestration guidance. If a permitted correction changes specification or program-design meaning and the corrected phase-guided result recommends pair review, the agent records that recommendation and stops as `correction-complete-review-stale`. The user may explicitly start another bounded cycle for fresh pair review.

## Terminal results

Return one concise result:

- `ready`: the current pair-review result itself returned `ready` for the current specification and program design;
- `needs-revision`: review accepted a caller-owned correction, returned its exact caller action, and recommended no design-phase skill;
- `correction-complete-review-stale`: a permitted correction route changed reviewed meaning, so another explicit cycle is required for fresh review;
- `decision-needed`: the active phase or pathfinding returned an unresolved owner decision, including unanswered questions when no live user is available or confirmed meaning that no longer fits the recorded pathfinding return destination;
- `deferred`: the active phase returned an authorized deferral; preserve its reason, consequence, and re-entry condition;
- `cycle-limit-reached`: a valid phase-selected route exceeds the remaining stage budget; preserve the route and ask whether to start another bounded cycle;
- `blocked`: a phase stopped for missing evidence, invalid input, contradictory state, or an invalid route;
- `stopped`: the user chose to stop.

The agent reports the phase result that caused the terminal state without rewording it as a new design judgment. It never claims planning readiness unless the current pair-review result is `ready`, and it never applies planning or implementation under this skill.

## Trigger

Invocation: model-invocable and user-invocable.

Proposed description:

```text
Use when a user asks to take a change through, run, resume, or finish the full design cycle—specification, program design, and independent pair review—as one bounded workflow before planning. Not for a direct requirements discussion, specification, program-design, or review-only request; long-horizon delivery goals; planning; implementation; or PR work.
```

True prompts include “take this through design,” “run the design workflow,” “resume the design cycle,” and “coordinate spec, program design, and review.” For a direct phase-skill request, the agent applies that phase skill without loading `orchestrator-design`.

## Skill shape

### `SKILL.md`

Keep the agent-as-actor and guarded-router mental model, route graph, responsibility boundaries, efficient handoff and explanation rules, route-validation bright line, call budget, terminal results, and completion blockers in the main body. These rules govern every run and cannot be hidden in a reference.

### `references/design-run-state.md`

All runs load one coherent state procedure. It owns initialization, resume validation, the two temporary file shapes, transition recording, counters, contradiction handling, and final status rendering. It receives an already-composed compact phase handoff, preserves that portion unchanged, and attaches the separate orchestration-owned stage and remaining limits; it never decides what semantic context belongs in the phase handoff.

The reference teaches one small inspection procedure:

```text
fresh initialized run
  require design identity, goal pointer, pre-review stage, zero counters,
  no event, and no phase handoff or recommendation
  permit only the first spec-design call

recorded terminal run
  require the terminal condition and terminal-payload identity to match
  the final event
  inspect and return the exact stored terminal payload unchanged
  when the final terminal event carries an initiating-pathfinding
  association from a valid completed return, require the immediately
  preceding accepted pathfinding-return event to identify H2, resolve H2
  to its exact stored handoff, and carry the identical H1 association;
  missing or different H1 -> blocked
  when the payload declares an explanatory continuation handoff,
  read any recommendation
  only when that identity resolves to the exact stored handoff for this
  design run and equals the final event's accepted-return identity;
  present it only as terminal explanation
  for an invalid completed-pathfinding terminal, require accepted-return
  identity absent, H1 present only as the final event's initiating
  association, rejected-target reason present, and no preserved-handoff
  reference; replay that payload unchanged
  for a direct terminal phase result with no explanatory continuation,
  require accepted-return identity and preserved-handoff reference both
  absent; replay the exact terminal payload unchanged
  any accepted-return identity outside the explanatory-continuation branch
  is invalid state -> blocked
  require no runnable next skill or next invocation

active resumable transition
  inspect the design identity and artifact pointers
  require the last details.md transition and matching events.jsonl entry
  require the stored compact phase handoff
  read the recommended next skill, reason, and pathfinding return owner
  only from that handoff
  inspect the current stage and all call counters
  state integrity is valid only when the files agree and all required
  state fields exist

recording a phase return
  when the result recommends continuation, allocate one fresh handoff
  identity within this design run, store the unchanged handoff under it,
  and write that same identity to the corresponding event and any terminal
  payload reference that later preserves it as explanation
  when the result is directly terminal, store only its terminal payload
  and no accepted-return identity
  duplicate, reused, unknown, or overwritten identities -> blocked

receiving a completed pathfinding return
  before allocating its fresh return identity, resolve the retained
  initiating identity to the immediately preceding pre-invocation
  continue event and exact stored handoff
  require that handoff's sole next skill to be discuss-pathfinding
  compare the returned next skill with that handoff's exact return owner
  structural mismatch -> allocate no return identity and store no accepted
  handoff; record blocked terminal payload with the rejected-target reason,
  append a stop event with accepted-return identity absent and retained H1
  only in the initiating-pathfinding association, verify the terminal
  record, then clear that identity
  matching return -> allocate fresh H2, store the exact returned compact
  handoff unchanged under H2, and record the return event with H2 as the
  accepted-return identity and retained H1 as the initiating association
  keep the initiating identity until the destination invocation or
  terminal stop event records the same association; then clear it

after state integrity is valid
  validate all route structure first: allowed target, required handoff,
  planning/implementation exclusion, and producing-phase terminal mapping
  for a recorded pathfinding return awaiting its destination, require
  its event and routing context to carry the same initiating identity
  already validated by the completed-return procedure
  any structural mismatch -> blocked, no call
  corrected phase recommends a second pair review
    -> correction-complete-review-stale, no call
  valid route with no remaining capacity -> cycle-limit-reached, no call
  otherwise invoke the allowed next skill

stop without another phase call when
  the fresh state contains transition residue, a recorded terminal and
  final event disagree, a terminal payload that declares an explanatory
  continuation handoff has a missing or mismatched preserved-handoff identity,
  a handoff identity is duplicate, reused, unknown, overwritten, or
  points outside this design run, an active pathfinding return lacks its
  initiating-handoff identity, its return/destination/terminal event does
  not attest that same identity, or it does not name the immediately
  preceding pre-invocation pathfinding continue event,
  or an active resume is missing identity,
  transition, handoff, destination, stage, or counters;
  return blocked with the exact contradiction
```

Counters count recorded phase invocations; there is no persisted reserved edge. Before an invocation, the procedure requires the applicable current-stage count to be below its limit. After that phase returns, it increments only that invocation counter, records the phase result and transition, and verifies `details.md` and `events.jsonl` agree. Missing or contradictory post-call state returns `blocked` with the exact contradiction and no further invocation.

Caller shape:

```text
MUST load `references/design-run-state.md` to inspect and validate or initialize routing state, guard and record an invocation, and return exactly one: (a) fresh continuation to the first `spec-design` call with no phase handoff; (b) recorded-terminal replay with the exact stored terminal condition and terminal-specific payload, reading any preserved non-executable recommendation only from the identified unchanged phase handoff, and no next invocation; (c) active resumed continuation with the exact compact stored phase handoff as the sole source of its next skill, reason, and pathfinding return owner, plus separate orchestration-owned stage counters and remaining limits; or (d) failed state integrity with `blocked`, the exact contradiction, and no next invocation.
```

No lane, schema, script, digest, or additional reference is justified in the first implementation.

## Proof scenarios

Add permanent scenarios under `tests/skills/pressure-scenarios/shravan-dev-workflow/orchestrator-design/` and extend the existing participating-skill scenarios only where their return contracts change:

1. The agent's initial phase call under orchestration guidance is always `spec-design`; it does not inspect requirements and call pathfinding first.
2. Missing initial owner meaning causes the agent applying `spec-design` to use pathfinding and consume its confirmed requirements record before returning a route.
3. Every phase makes its owned boundary understandable, identifies owner-controlled gaps before continuing, and uses pathfinding only when user judgment is genuinely required.
4. A program-design `specification-gap` explicitly recommends `spec-design`, and the agent follows it without reinterpreting the gap under orchestration guidance.
5. Reviewer-subagent claims remain candidate findings until the `spec-program-review` parent validates them; rejected, contested, and unverified candidates never create routes.
6. A validated Why/What correction recommends `spec-design`; a validated How correction recommends `program-design`.
7. A validated model failure whose replacement requires unmade owner meaning recommends `discuss-pathfinding` with the break evidence, unmade decisions, and review-selected return owner: Why/What returns to `spec-design`, structural How to `program-design`, and both to `spec-design` first.
8. Mixed validated Why/What and How findings recommend `spec-design` first; the later spec-guided result recommends `program-design` without orchestration sequencing logic.
9. A validated model failure with no unmade replacement owner meaning does not route to pathfinding: review recommends the correction owner when current authority settles it, or stops when evidence cannot.
10. An unmade pre-review program-design structural decision uses the single orchestrator-routed pathfinding allowance and returns to `program-design`; that returned call consumes the second pre-review program-design allowance without consuming post-review correction capacity.
11. A missing, unknown, source-result-invalid, or planning/implementation route stops as `blocked`; a valid over-budget route stops as `cycle-limit-reached`; neither is guessed or replaced.
12. A post-review semantic correction does not trigger an automatic second pair review.
13. Direct `$spec-design`, `$program-design`, `$spec-program-review`, or `$discuss-pathfinding` requests do not load the orchestrator.
14. Resume follows the last valid recorded route using the exact stored phase-returned handoff and refuses a missing handoff or contradictory state without reconstructing semantic meaning from chat.
15. A `deferred` specification or program-design result remains `deferred` and preserves the phase-returned reason, consequence, and re-entry condition.
16. Pathfinding that cannot return confirmed meaning to the recorded caller-supplied destination stops as `decision-needed`; orchestration guidance does not select another phase.
17. A parent-validated caller-owned review correction invokes no phase skill and preserves `needs-revision` plus the exact caller action; a genuinely unresolved owner choice returns `decision-needed`, and invalid or missing caller input returns `blocked`.
18. A pre-review `program-design -> specification-gap -> spec-design -> program-design` recovery may continue to the first pair review and leaves the post-review correction allocations unused.
19. A post-review correction whose phase result recommends pair review records that recommendation but invokes no second review and stops as `correction-complete-review-stale`, not `blocked`.
20. A pathfinding request whose declared return destination differs from the producing phase's mapping stops `blocked` before pathfinding; a no-live-user pathfinding result stops as `decision-needed` with the unanswered questions.
21. Cycle-start and transition explanations identify the participating skills, current and next phase, reason, boundary, and remaining budget without recreating phase reasoning.
22. Every transition is compact, sufficient, and pointer-based; resume preserves the exact phase handoff while separately advancing orchestration-owned stage and remaining-limit context. Direct phase calls carry no cycle budget.
23. A review result distinguishes an accepted caller-owned correction, an unresolved owner choice, and invalid or missing caller input with the exact `needs-revision`, `decision-needed`, and `blocked` outcomes.
24. A fresh initialized run has zero transitions and no phase handoff, then permits only the first `spec-design` call; missing-handoff checks apply only after a phase transition exists.
25. Resuming a recorded `ready`, caller-owned `needs-revision`, `deferred`, or other terminal run returns its exact stored terminal-specific payload without requiring a runnable next skill or invoking another skill.
26. Resuming `cycle-limit-reached` or `correction-complete-review-stale` reads the original phase-recommended route from the single unchanged phase-handoff home, presents it as non-executable explanation, and invokes no skill.
27. Fresh-state residue, terminal/event disagreement, active missing fields, or post-call state disagreement always returns `blocked` with the exact contradiction and no further invocation.
28. An active resume reads its next skill only from the exact stored phase handoff; any copied route field or mismatch is invalid state and returns `blocked`.
29. A terminal payload that declares an explanatory continuation handoff but whose preserved-handoff identity is missing or does not resolve to the exact stored handoff returns `blocked` without reconstructing the recommendation or invoking a skill.
30. Every post-phase route passes all structural guards before stale-review or budget handling; a malformed second-review recommendation returns `blocked`, not `correction-complete-review-stale`.
31. When a terminal payload declares an explanatory continuation handoff, replay requires its identity to equal the final event's accepted-return identity and resolve to that exact stored handoff; any mismatch returns `blocked`.
32. A completed pathfinding return must name the exact return owner read from the stored initiating phase handoff; another allowed phase still returns `blocked` with no invocation.
33. Every continuation handoff receives one fresh local identity shared by its stored handoff, event, and any later explanatory terminal reference; direct terminal results receive no accepted-return identity. Duplicate, reused, unknown, overwritten, or earlier-return identities block replay.
34. Active pathfinding keeps the immediately preceding continue event's handoff identity through return validation and destination invocation or terminal stop; another valid handoff from the same run still returns `blocked`.
35. A two-return trace records initiating H1, validates the pathfinding return against H1 before minting fresh H2, records H2 with the H1 association, and clears H1 only after the destination invocation or terminal stop records the same association.
36. A valid H1 comparison followed by an H2 return, destination, or terminal event that attests another same-run initiator returns `blocked`.
37. An invalid completed pathfinding return allocates no H2 and stores no accepted handoff; its event has no accepted-return identity, records H1 only as the initiating association, stores `blocked` with the rejected-target reason, verifies the terminal event, then clears H1.
38. A matching completed pathfinding return stores the exact handoff under fresh H2; its event records H2 only as accepted return and H1 only as initiating association.
39. Resuming an invalid-return terminal verifies accepted-return identity absent, H1 only as the final event's initiating association, no preserved-handoff reference, and the rejected-target reason; it replays that exact `blocked` payload without invoking a skill.
40. Resuming a direct `ready`, `deferred`, `decision-needed`, `needs-revision`, or ordinary `blocked` terminal requires both accepted-return identity and preserved-handoff reference absent, then replays its exact terminal payload.
41. A direct terminal carrying an arbitrary accepted-return identity or preserved-handoff reference returns `blocked` as invalid state rather than replaying.
42. Replaying an explanatory-continuation terminal with a valid pathfinding association requires its final H1 to equal the immediately preceding accepted H2 return event's H1; missing or different association returns `blocked`.
43. Replaying a direct terminal reached from a valid pathfinding return applies the same H2-to-H1 equality check before replaying its payload.

Deterministic evaluators check allowed next-skill values, state paths, transition counts, call budgets, read/write boundaries, observable invocation order, and required compact-handoff fields. Model judges evaluate whether the agent applied phase guidance—not orchestration guidance—to make semantic decisions, whether review findings were critically validated before routing, whether the user's boundary was preserved, and whether explanations and diagrams made the stop or next route understandable without unnecessary text.

## Decisions

| Decision | Selected design | Rationale |
| --- | --- | --- |
| Orchestrator role | Guarded-router guidance | The agent applies phase skills for domain judgment and orchestration guidance only for explanation, record keeping, route-shape checks, and budget. |
| Initial route | Always `spec-design` | Requirements admission belongs to specification design, including its conditional pathfinding call. |
| Review authority | `spec-program-review` parent validates candidate findings | Reviewer output is evidence to inspect, not an instruction to forward. |
| Broken-model route | Review recommends `discuss-pathfinding` only when it validates the failure and finds replacement owner meaning unmade | A model failure alone may have an authoritative correction or an evidence gap; neither is an extraction task. |
| Mixed correction order | Review recommends `spec-design` first; later phase results continue the route | Preserves Why/What before How without putting sequencing judgment in the orchestrator. |
| State | Temporary routing state plus the exact compact phase handoff | Resume needs inspectable workflow position and exact continuation input without making that input orchestration-owned meaning. |
| Resume handoff | Persist the compact phase-returned handoff unchanged in temporary state | Resume cannot reconstruct phase-guided meaning from chat; carrying a pointer-based handoff does not transfer semantic ownership. |
| Phase handoff | Relevant pointers, result, boundary status, exact gap, next skill and reason | The next skill receives the semantic context it needs without copied artifacts, repeated history, unvalidated findings, or orchestration coupling. |
| Orchestration context | Current stage and remaining limits, stored beside the unchanged phase handoff | Cycle state stays owned by orchestration guidance and remains available to the next transition. |
| Explanation cadence | One cycle-start explanation and one compact transition explanation per route | The owner can see which skills participate, where the cycle is, and why the next skill follows without replaying phase reasoning. |
| Loop limit | At most one pre-review recovery per authoring phase, one pair review, and one post-review correction call per authoring phase | Allows bounded convergence before review while preserving one complete correction pass after validated review. |
| Route return | Plain-language stop or one named next skill in each phase's existing terminal contract | Keeps the model handoff explicit without inventing a protocol or shared schema. |
| Pathfinding return | Caller-supplied phase destination only | Pathfinding resolves unwritten meaning; it does not gain workflow-wide routing authority. |
| Scripts | None | No observed deterministic mechanic justifies executable infrastructure. |

## Non-goals

- replacing or modifying `orchestrator-goal`;
- letting the orchestrator classify requirements, findings, corrections, or model breaks;
- letting reviewer subagents decide the review verdict or next route;
- automatically repeating review and remediation until green;
- invoking planning, implementation, implementation review, PR, merge, or release workflows;
- creating a durable orchestration artifact or copying full phase artifacts or conversation history into temporary state;
- adding a runtime library, schema, hash, digest, or state machine implementation for model-authored routing;
- promoting phase-owned research, local review, visualization, or delegation helpers into orchestrator phases.

## Ordered `skills-creation` runs and surface allocation

This proposal requires separate behavior-changing runs because `skills-creation` owns one named skill per run:

### Run 1 — update `spec-program-review`

- Trigger: unchanged; this remains review-only.
- Main path: guide the agent, after parent validation and reduction, to recommend one next skill or stop; when pathfinding is warranted, supply the semantically classified return owner. Before recommending a route, inspect the destination's required review evidence and compose the compact pointer-based handoff; for an accepted caller-owned correction, preserve `needs-revision`, return the exact caller action, and recommend no phase skill.
- Depth: extend `references/finding-and-reduction-schema.md` with the validated route recommendation, return-owner decision, destination-specific compact-handoff inspection, and exact distinction between accepted caller correction, unresolved owner choice, and invalid or missing input; retain parent verification there.
- Proof: candidate findings cannot route before validation; Why/What, How, both, caller-owned, owner-decision, invalid-input, evidence-blocked, and unmade-replacement cases return the correct compact handoff, route, or stop.

### Run 2 — update `spec-design`

- Trigger: unchanged.
- Main path: preserve spec-guided initial requirements pathfinding; add the explicit post-terminal recommendation or stop described above. Before recommending `program-design`, inspect that skill's required inputs and compose the compact pointer-based handoff; stop rather than omit an unresolved boundary or required artifact.
- Depth: existing authority and requirements references remain owners; no new reference.
- Proof: initial pathfinding remains spec-owned, `locally-ready` recommends `program-design`, and unresolved terminals stop.

### Run 3 — update `program-design`

- Trigger: unchanged.
- Main path: guide the agent to add the explicit post-terminal recommendation or stop selected through the specification-gap and structural-decision method. Before recommending `spec-design`, pair review, or pathfinding, inspect that destination's required inputs and compose the compact pointer-based handoff; stop rather than copy unrelated implementation history or omit the exact gap.
- Depth: existing design references remain owners; no new reference.
- Proof: `locally-ready`, `specification-gap`, unmade structural choice, blocked, deferred, and return-from-pathfinding cases route correctly.

### Run 4 — update `discuss-pathfinding`

- Trigger: unchanged.
- Main path: for an orchestrated call, guide the agent to return confirmed meaning only to the caller-supplied phase destination. Before returning, inspect that destination's requested decision and artifact needs and compose the compact pointer-based handoff; unresolved, insufficient, or mismatched meaning stops.
- Depth: existing decision and requirements references remain owners; no new reference.
- Proof: the recorded destination is preserved even when another allowed phase appears plausible; mismatch and unresolved cases do not invent a route.

### Run 5 — create `orchestrator-design`

- Trigger: add the proposed full-design-cycle description.
- Main path: agent-as-actor guarded-router lens, fresh-only fixed initial `spec-design`, active resume through the stored next skill, terminal replay without another call, cycle and transition explanations, compact exact forwarding, route validation, call budget, and terminal boundary.
- Depth: one mandatory `references/design-run-state.md` for temporary state, compact handoff persistence, transition procedure, and counter allocation for every return edge.
- Proof: the orchestrator scenarios above plus plugin static validation.

Each run updates only its named skill and pressure scenarios. Run 5 begins only after runs 1-4 establish the return contracts it consumes.

Authoring basis: user-directed intent grounded in repeated observed responsibility drift during this proposal. Proof posture: representative pressure scenarios plus static validation; no manufactured historical RED. Security route: not applicable; no credentials, hooks, executable scripts, external writes, or sensitive-resource handling.

## Coordination

- Worktree: `/Users/shravansunder/dev/ai-tools.spec-orchestration`
- Branch: `spec-orchestration`
- Base commit at this revision: `78437e7`
- Existing pending edit outside this proposal at acceptance: none; re-check the worktree before every implementation run.
- Implementation remains blocked until this revised proposal receives current spec-review acceptance and the user explicitly switches to implementation.
- Version and changelog changes land with implementation, not this design artifact.
- Another agent owns commit and push unless the user changes that instruction.

## Spec-review record

```text
review target: router-v26 — consistent guarded-router leading term
verdict: great
blocker overrides: none
rubric evidence:
  promise: one reusable guarded-router skill that helps the agent explain, record, bound, and follow phase-guided design routes
  invocation: full-design-cycle trigger stays distinct from direct phase, goal, planning, implementation, and PR work
  authored body: agent-as-actor lens; scan-visible fresh/resume route; responsibility, handoff, explanation, route-guard, budget, terminal, and completion rules
  ownership: phase skills own semantic judgment and compact semantic handoffs; orchestration owns only stage, limits, correlation, integrity checks, and routing
  depth: one mandatory design-run-state procedure teaches initialization, active and terminal resume, transition recording, exact return association, counters, and stop behavior
  proof: phase contract scenarios plus route, boundary, explanation, compact-handoff, budget, resume, terminal replay, identity, and no-loop scenarios
  safety/platform: no sensitive surface, executable script, runtime library, schema, hash, or digest
highest risk: orchestration wording silently becoming a second semantic decision-maker
accepted findings: actor wording, caller-result distinction, compact-handoff ownership, fresh/active/terminal state branches, route-guard order, exact pathfinding-return association, and terminal replay findings were verified and incorporated through router-v25
rejected findings: none
first required revision: none
proof or retest implication: implement Runs 1-5 in order; prove each changed phase contract before orchestrator scenarios, then run the complete focused eval set
implementation decision: accepted-to-implement, pending explicit user switch to implementation
```

Current-source validation: after PR #41 reached `origin/master` at `78437e7`, the parent re-read the complete terminal and routing contracts for `spec-design`, `program-design`, `spec-program-review`, and `discuss-pathfinding`. Their ownership split and terminal meanings remain compatible with router-v26; no accepted semantic coverage expired. The user explicitly authorized implementation after this validation.

Lane receipts:

- mental-model-fit: complete and clean at router-v26;
- trigger-routing: retained from router-v2; parent verified the proposed description and adjacent-skill boundary are semantically unchanged;
- rule-agreement: complete and clean at router-v25; router-v26 changes only the mental-model label;
- depth-coverage: complete and clean at router-v25; router-v26 changes only the mental-model label.

Reviewer runtime deviation: owner-directed fresh, read-only Terra-medium Delegates. The parent verified every candidate against the current requirements, proposal, and cited phase sources before accepting it; router-v26 has no open finding.
