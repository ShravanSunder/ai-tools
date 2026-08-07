---
name: orchestrator-design
description: Use when a user asks to take a change through, run, resume, or finish the full design cycle—Requirements, Specification, Program Design, and independent three-artifact design review—as one bounded workflow before planning. Not for a direct requirements discussion, Requirements authoring, Specification, Program Design, or review-only request; long-horizon delivery goals; planning; implementation; or PR work.
---

# Design Orchestration

The agent is the actor. This skill is guarded-router guidance between design phases.

Phase skills decide meaning:

```text
spec-design          separate Requirements and observable Specification
program-design       structural realization of the fixed Specification
spec-program-review  independent challenge and validated findings
discuss-pathfinding  collaboration on genuinely unwritten owner meaning
```

MUST load `../../shared-references/requirements-specification-program-design.md` and return the canonical Requirements, Specification, and Program Design boundaries plus the applicable identity representation. Requirements asks WHY, for whom, and within what boundary. Specification states WHAT must be observably true. Program Design defines HOW the internal system will satisfy it. Pathfinding helps the user and agent understand and decide unclear owner meaning in any of those phases, then returns that meaning to its recorded owner; it does not replace or merge the phases.

This skill explains the workflow position, preserves the phase-selected handoff, checks route shape, records temporary state, and enforces cycle limits. It never decides whether requirements are complete, whether a reviewer is right, which correction owner applies, whether a model failed, or what replacement meaning should be.

```text
agent applies a phase skill
          |
          | phase result selects one next skill or stop
          v
agent applies orchestrator-design
          |
          | explain + validate route + record + check budget
          v
agent applies exactly the selected next skill
```

The cycle begins with `spec-design`, ends with a current three-artifact design review result or an explicit stop, and never enters planning or implementation.

## Boundary

Use this skill for a full design-cycle request or resume. A direct request for `spec-design`, `program-design`, `spec-program-review`, or `discuss-pathfinding` uses that skill alone and carries no orchestration budget.

Orchestration owns only:

- fresh or resumed design-run position;
- a short cycle-start and transition explanation;
- preservation of the exact compact phase handoff;
- allowed-target, terminal-mapping, and design-boundary checks;
- call counters and cycle limits;
- temporary transition records and the final stop report.

The producing phase owns the recommended next skill, reason, boundary status, exact gap or correction, artifact pointers, and any pathfinding return owner. Do not copy those fields into a second orchestration-owned version.

## Workflow

### 1. Inspect or initialize the design run

MUST load `references/design-run-state.md` to inspect and validate or initialize routing state, guard and record invocations, and return exactly one: a fresh `spec-design` continuation with no phase handoff; an active continuation using the exact stored phase handoff; a recorded-terminal replay with no invocation; or `blocked` with the exact state contradiction.

Fresh means zero transitions, zero counters, no event, and no phase handoff. It permits only `spec-design`. Do not inspect requirement completeness or call pathfinding first; `spec-design` owns requirements admission and its conditional initial pathfinding. The fresh return includes the first `spec-design` continuation and every remaining call limit, not merely the state that would be initialized.

Completion: state is fresh, active, terminal, or invalid; only fresh and valid active state may invoke a phase, and a fresh continuation contains the full remaining budget.

### 2. Explain the cycle and current transition

At cycle start, name what each of the four participating skills owns and state the design-only boundary in ordinary language; mentioning only the first phase and pathfinding is incomplete.

The cycle-start explanation must keep the three authoritative concepts separate:

```text
Requirements   WHY, for whom, and within what boundary?
Specification  WHAT must be observably true?
Program Design HOW will the internal system satisfy it?
```

Do not call one artifact `Requirements/spec` or imply that a Requirements record replaces the Specification.

At each transition, report only:

```text
completed skill -> recommended next skill or stop
why the producing phase selected it
relevant artifact pointers and exact open decision
remaining cycle budget
```

Use a compact diagram when ownership, sequence, boundaries, or a broken model are materially easier to understand visually. The responsible phase explains its semantic judgment; orchestration explains only workflow position and route.

Completion: the user can tell what finished, what happens next, why that phase owns it, and where the cycle stops without reading repeated background.

### 3. Apply the current phase skill

For fresh state, apply `spec-design`. For active state, read the sole next skill, reason, exact gap, and any pathfinding return owner only from the stored phase handoff. Attach separate orchestration context containing only current stage and remaining limits.

Apply exactly one of:

```text
discuss-pathfinding
spec-design
program-design
spec-program-review
```

The phase skill performs its complete method and returns its own terminal result plus either one compact continuation handoff or an exact stop. Reviewer-subagent findings remain candidates until the `spec-program-review` parent validates and reduces them; orchestration never forwards an unreduced candidate.

Completion: one phase result exists, and the producing phase—not this skill—selected its continuation or stop.

### 4. Validate the returned route structurally

Validate in this order:

1. the target is one of the four allowed skills;
2. the compact handoff exists and has the producing phase's required pointers, result, boundary status, exact gap or correction, next skill, and reason;
3. when the continuation consumes Requirements and Specification, their identities use one valid structural representation: two present, resolvable, non-identical file-backed pointers, or two different separately labeled in-chat records;
4. the route does not enter planning or implementation;
5. the next skill matches the producing phase's declared terminal mapping;
6. an orchestrator-routed pathfinding call names the exact return owner declared by its producing phase;
7. a completed pathfinding return matches that exact stored return owner.

The representation guard checks presence, distinctness, and file resolution or separate chat labels only. It does not read either identity to judge adequacy, create a missing artifact, turn the accepted requirements set into a Requirements identity, or reinterpret the phase's `locally-ready` result. A mixed file/chat representation is invalid. Preserve both identities unchanged in every later handoff that consumes them.

Any mismatch stops `blocked` with the exact contradiction. Do not guess, repair, or substitute a route.

The phase mappings are:

```text
spec-design
  locally-ready      -> program-design
  other terminal     -> stop

program-design
  locally-ready      -> spec-program-review, three-artifact-design mode
  specification-gap  -> spec-design
  unmade owner-controlled structural choice
                     -> discuss-pathfinding, return program-design
  other terminal     -> stop

spec-program-review
  ready              -> stop ready
  accepted Why/What  -> spec-design
  accepted How       -> program-design
  accepted both      -> spec-design first
  accepted caller correction
                     -> stop needs-revision with exact caller action
  validated failed model whose replacement owner meaning is unmade
                     -> discuss-pathfinding with review-selected return owner
  blocked or unresolved owner choice outside that case
                     -> stop

discuss-pathfinding in this cycle
  confirmed meaning  -> exact caller-supplied return owner
  unresolved, no live user, or confirmed meaning cannot fit the recorded owner
                     -> stop decision-needed
  completed handoff names a destination other than the recorded owner
                     -> stop blocked
```

Completion: the route is structurally valid or the run is blocked before stale-review and budget handling.

### 5. Apply stale-review and budget stops

After structural validation:

- if one three-artifact design review already ran and a permitted semantic correction recommends three-artifact design review again, record the unchanged recommendation and its exact artifact pointers but stop `correction-complete-review-stale`; do not invoke a second review;
- otherwise, if the applicable stage limit is exhausted, stop `cycle-limit-reached` while preserving the valid phase handoff as non-executable explanation;
- otherwise, record the transition and invoke the selected skill.

The stale-review stop takes precedence over a valid over-budget route. Structural invalidity takes precedence over both.

For `correction-complete-review-stale`, return the terminal payload plainly:

```text
terminal: correction-complete-review-stale
invocation: none
preserved recommendation: <unchanged phase recommendation and pointers>
status of recommendation: non-executable in this run
record: <transition and terminal payload that was or would be written>
```

Completion: a valid route either consumes one available call or stops without another phase invocation. A stale-review stop returns every line above; read-only changes the record line to what would be written, not the rest of the payload.

### 6. Return the exact terminal result

Return one:

```text
ready
needs-revision
correction-complete-review-stale
decision-needed
deferred
cycle-limit-reached
blocked
stopped
```

Preserve the phase result and its artifact pointers. Include the exact caller action, unanswered questions, deferral consequence and re-entry condition, or valid but non-executable continuation when that terminal requires it. A recorded terminal resume replays the stored payload and invokes nothing.

Never claim planning readiness unless the current three-artifact design review itself returned `ready` for the current Requirements, Specification, and Program Design.

Completion: the user receives the exact stop reason and can either act on it or explicitly start a new bounded cycle without orchestration inventing another step.

## Call Budget

One cycle permits:

```text
pre-review spec-design:          at most 2 calls
pre-review program-design:       at most 2 calls
three-artifact design review:  at most 1 call
post-review spec-design:         at most 1 call
post-review program-design:      at most 1 call
orchestrator-routed pathfinding: at most 1 call
```

Initial requirements pathfinding inside `spec-design` and phase-owned local specification-only or program-only review remain inside that phase call. A pre-review `program-design -> specification-gap -> spec-design -> program-design` recovery uses only pre-review allowances. A pathfinding return consumes the destination phase's allowance for the current stage, never the other stage's allowance.

## Completion Blockers

Do not continue or claim completion while any of these hold:

- fresh state has transition residue, counters, an event, or a phase handoff;
- a fresh return omits the first `spec-design` continuation or any remaining call limit;
- the cycle-start explanation omits any participating skill's ownership or the design-only stop boundary;
- active or terminal state is missing required identity, transition, handoff, counter, or terminal-payload evidence, or the temporary files disagree;
- a route target, handoff, producing-phase mapping, or pathfinding return owner is missing or contradictory;
- a continuation that consumes Requirements and Specification omits either identity, uses one identity for both, contains an unresolved file pointer, mixes file and chat representations, or collapses them into `Requirements/spec`;
- orchestration reads artifact or record content to decide whether either identity is semantically adequate;
- semantic routing meaning was copied into orchestration-owned state or reconstructed from chat;
- an unreduced reviewer candidate affects the route;
- structural guards were applied after stale-review or budget handling;
- another three-artifact design review would run automatically after reviewed meaning changed;
- a stale-review stop omits the unchanged phase recommendation, exact artifact pointers, or its non-executable status;
- a valid route exceeds its stage limit but another phase is invoked;
- planning, implementation, PR, merge, or release work is invoked;
- the terminal result rewrites the phase's reason or claims a reviewed three-artifact design when current three-artifact-design review coverage does not exist.
