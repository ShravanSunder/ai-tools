# Design Run State

This reference owns the temporary state procedure for one bounded design cycle.

```text
expected inputs:
  design-run identity and goal pointer
  current temporary state when resuming
  already-composed compact phase handoff when recording a continuation
  phase terminal payload when recording a stop

return:
  fresh continuation | active continuation | recorded-terminal replay |
  blocked state contradiction

complete when:
  details and events agree, the current handoff association is unambiguous,
  counters reflect completed phase calls, and the returned branch permits at
  most one next invocation
```

This procedure records routing evidence in plain temporary files; it does not decide semantic content or require executable infrastructure.

Consume the identity representation and two structural slots returned by the shared Requirements, Specification, and Program Design reference loaded from `SKILL.md`.

## Temporary Homes

Use:

```text
tmp/design-orchestration/<design_id>/details.md
tmp/design-orchestration/<design_id>/events.jsonl
```

`design_id` is `<yyyy-mm-dd>-<short-slug>`. Reuse it in both files and every status.

`details.md` keeps:

- design identity and goal pointer;
- current stage;
- completed invocation counters and remaining limits;
- each compact continuation handoff under one fresh local identity;
- the active initiating-pathfinding handoff identity when applicable;
- terminal condition and one exact terminal payload when stopped.

`events.jsonl` is an append-only transition history. Each event records the applied skill, `continue | stop`, resulting counters, and identities needed to connect the event to the stored handoff or terminal payload. It does not copy semantic routing fields.

A handoff identity is a local correlation label such as `H1`, not content certification. Allocate it only after accepting a valid phase continuation. Never reuse, overwrite, or resolve it outside this design run.

## Inspect One Of Four States

### Fresh

Require:

```text
design identity and goal pointer present
stage = pre-review
all counters = 0
no event
no phase handoff
no recommendation
```

Return the first `spec-design` continuation with no phase handoff plus the full remaining call limits for the fresh cycle. Any transition residue is invalid fresh state and returns `blocked`.

### Active

Require `details.md` and the last event to agree on design identity, stage, counters, and the accepted continuation-handoff identity. Resolve that identity to exactly one stored compact handoff. Read the next skill, reason, exact gap, and optional pathfinding return owner only from it.

Return the unchanged handoff plus separate current stage and remaining limits. A missing, duplicate, reused, overwritten, or mismatched identity returns `blocked`; do not reconstruct from chat.

### Recorded terminal

Require the final event and `details.md` to agree on terminal condition and terminal-payload identity. Replay the exact stored payload and invoke nothing.

A direct terminal phase result has no accepted continuation identity. A terminal such as `cycle-limit-reached` or `correction-complete-review-stale` may point to one accepted unchanged phase handoff only to explain the valid route that is no longer executable. That pointer must equal the final event's accepted-return identity and resolve to the exact stored handoff.

For a blocked completed-pathfinding return mismatch, require no accepted-return identity and no preserved returned handoff. The final event retains the initiating identity only long enough to verify the rejected target against the exact initiating handoff, and the terminal payload carries the rejected-target reason.

Any extra runnable target, unexplained accepted-return identity, missing payload, or identity disagreement returns `blocked` instead of replaying.

### Invalid

Return `blocked`, the exact contradiction, and no invocation. Do not repair state by guessing from conversation or artifact meaning.

## Record A Phase Return

After one phase completes:

1. increment only that completed invocation's applicable stage counter;
2. when the continuation consumes Requirements and Specification, apply the representation-aware continuation guard below before accepting the handoff;
3. when three-artifact design review recommends `spec-design` or `program-design`, set the stage to `post-review` before invoking that correction; a terminal three-artifact design review result records its stop without a stage transition;
4. if it stops directly, store one terminal payload and no accepted continuation identity;
5. if it recommends continuation, allocate one fresh local handoff identity, store the exact compact handoff unchanged, and record the same identity in the event;
6. verify `details.md` and `events.jsonl` agree before another invocation.

Missing or contradictory post-call state stops `blocked`. Counters record completed calls; there is no reserved future edge.

## Guard Requirements And Specification Identities

Apply this guard to every continuation whose destination consumes Requirements and Specification, including `program-design` and three-artifact design review. Classify only the representation supplied by the phase handoff.

Accept exactly one of these shapes:

```text
file-backed
  Requirements: present pointer that resolves to one existing file
  Specification: present pointer that resolves to another existing file

chat-only
  Requirements: one separately labeled in-chat record
  Specification: another separately labeled in-chat record
```

For file-backed work, check that both pointer strings are present, differ, and resolve. Do not open either file to judge its title, completeness, authority, or meaning. For chat-only work, check that both labels and records are present and distinct; host-exposed message anchors or opaque record IDs are not required. Do not accept a mixed file/chat representation, one combined `Requirements/spec` slot, a Requirements label plus an accepted-requirements-set value, or two labels pointing to the same file or chat record.

When the shape is valid, preserve both slots unchanged and continue with the phase-selected route. Semantic doubt is not orchestration authority to block a structurally valid handoff.

When the shape is invalid, return:

```text
terminal: blocked
invocation: none
reason: Requirements and Specification identities are structurally invalid: <missing, identical, unresolved, mixed, or collapsed condition>
phase result: <unchanged producing-phase result>
record: <terminal payload and stop event written, or what read-only mode would write>
```

Do not create, repair, copy, normalize, or semantically inspect either identity. The phase that produced the handoff owns the content; this guard owns only representation integrity.

## Preserve A Pathfinding Return Association

Before invoking orchestrator-routed pathfinding, retain the initiating phase handoff identity. The immediately preceding `continue` event must reference that same identity and its stored handoff must name `discuss-pathfinding` plus one exact return owner.

When pathfinding completes:

```text
resolve initiating H1
  -> confirm it is the immediately preceding pathfinding continue handoff
  -> read exact return owner from H1
  -> compare completed pathfinding destination
```

If the destination differs:

- allocate no return identity;
- store no returned handoff;
- record `blocked` with the rejected-target reason;
- append a stop event with no accepted-return identity and H1 only as the initiating association;
- verify that terminal record, then clear the active association.

If it matches:

- allocate fresh H2;
- store the returned compact handoff unchanged under H2;
- record H2 as the accepted-return identity and H1 only as the initiating association;
- retain H1 until the destination invocation or terminal stop records that same association, then clear it.

Another same-run handoff is not interchangeable with H1. A missing or different association returns `blocked` even when the destination skill itself is allowed.

## Guard And Record The Next Invocation

After state integrity passes, apply guards in this order:

```text
allowed target
required compact handoff
Requirements/Specification representation when the destination consumes both
design-only boundary
producing-phase terminal mapping
pathfinding return-owner match when applicable
  -> corrected phase recommends second three-artifact design review
       stop correction-complete-review-stale
  -> applicable stage counter is at its limit
       stop cycle-limit-reached
  -> otherwise
       invoke one selected phase
```

After the phase returns, increment its counter, record its result, and verify both files agree. Structural invalidity is `blocked`; it is never relabeled as a stale-review or budget stop.

## Terminal Payloads

Every terminal payload carries the design identity, terminal condition, phase result and reason, and relevant artifact pointers. Add only what the terminal needs:

- `needs-revision`: exact caller action;
- `decision-needed`: unanswered questions or owner choice;
- `deferred`: authority, consequence, and re-entry condition;
- `cycle-limit-reached` or `correction-complete-review-stale`: identity of the unchanged valid continuation handoff, its exact artifact pointers and recommendation, presented as non-executable explanation;
- `blocked`: exact missing input, contradiction, invalid route, or rejected pathfinding target;
- `ready`: current three-artifact design review target identities and its exact ready result.

Complete recording only after the final event and terminal payload agree.

When the caller requests a read-only simulation, do not write these files. Return the exact fresh, active, terminal, or blocked payload that the procedure would record, including remaining limits and terminal-specific pointers; read-only changes the write location, not the returned fields.
