# Discussion Requirement Capture Spec

Status: current

## Product Intent

The workflow needs a better discussion system before more planning or
implementation work. The failure is not "discussion did not happen." The
failure is that useful discussion, mid-goal corrections, accepted requirements,
and owner decisions can remain in chat while later spec, review, plan, or
implementation work proceeds from an older mental model.

Success means the workflow can:

- build a shared mental model without a ritual one-question grill;
- capture material user interjections as actions or requirements;
- reduce substantial conversations into reviewable requirements packets;
- keep review normalization inside the review skill that produced the findings;
- ask the owner only for verified owner-level decisions;
- let `orchestrator-goal` count repeated loops and de-escalate after the limit.

## Source Evidence

- `tmp/research-workflows/2026-06-24-discussion-review-governance/research-ledger.md`
- `tmp/research-workflows/2026-06-24-discussion-review-governance/lanes/discussion-rfc-shapes.md`
- `tmp/research-workflows/2026-06-24-discussion-review-governance/lanes/bridge-raw-log-exact.md`
- `tmp/research-workflows/2026-06-25-discussion-taxonomy-refresh/research-ledger.md`
- `tmp/research-workflows/2026-06-26-workflow-interjection-and-source-inspirations/research-ledger.md`

The detailed chat and research already decomposed the space. The accepted shape
is not one larger `discuss-with-me`; it is a small set of discussion surfaces
plus a requirements/action capture contract.

## Boundary Map

```text
conversation
  owns: raw user intent, corrections, model refinements, authority signals
  exposes: discussion state, material interjections, accepted/open/rejected requirements

discussion surface
  owns: live shared-understanding or human-authority conversation
  does not own: artifact editing, review reduction, official loop counters

action / requirements capture
  owns: durable reduction of material chat into workflow obligations
  exposes: session requirements packet, action ledger, owner-decision packet

phase skill
  owns: spec, plan, implementation, or review artifact work
  consumes: requirements packet and action entries

orchestrator-goal
  owns: loop keys, repeat counts, phase transitions, escalation threshold
```

## Discussion Surfaces

### `discuss-clarify-mental-models`

Use when the user and agent are still forming the shared picture: terms,
boundaries, assumptions, competing framings, source-of-truth questions, and
tradeoffs.

It should support lateral thinking. It must not force one load-bearing question
when the real work is to explore several axes and let the user reshape the
frame. Good output may be a scope map, decision ledger, two-voice debate,
assumption board, or direct synthesis.

It terminates with either:

- a confirmed shared model;
- a named open branch;
- or a route to research, spec creation, plan creation, or blocker discussion.

### `discuss-clarify-blockers-and-divergences`

Use when the workflow cannot proceed responsibly because something is blocked
or the model broke.

Examples:

- implementation reality contradicts the spec or plan;
- source artifacts conflict;
- a review loop repeats for the same root cause;
- the agent cannot tell whether to accept, defer, or reopen scope;
- a required owner authority, access grant, waiver, or product decision is missing.

It must distinguish a real blocker from ordinary review feedback. It terminates
with the blocked thing, observed divergence, evidence, route target, and either
the missing evidence or missing authority.

### `discuss-owner-decision`

Use only after the agent verifies that the choice cannot be owned from source
artifacts, repo evidence, accepted workflow rules, or bounded research.

The owner decision packet must include:

- decision needed;
- why the agent cannot decide;
- evidence checked;
- options and tradeoffs;
- recommended default;
- consequence if the default is wrong;
- route after the decision.

This is for owner-level choices, not small implementation preferences.

### `discuss-spec-rfc`

Use when a spec, RFC, or design-proposal artifact has contested feedback that
requires human discussion.

It is not a replacement for `spec-review-swarm`. Review finds and normalizes
candidate issues; this surface discusses contested spec/RFC/design choices after
the reducer has verified they are real owner-level choices.

It terminates with accepted, rejected, deferred-with-authority, or open
spec/RFC/design-proposal feedback.

## Capture Contracts

### Interjection / Action Ledger

Material user messages during an active workflow must be evaluated for capture.
A message is material when it changes requirement, scope, non-goal, proof
expectation, priority, artifact destination, subagent task, follow-up workflow,
or premise.

Each captured entry records:

- source turn or transcript pointer;
- classification;
- requirement or action implication;
- affected artifact or workflow;
- owner;
- disposition;
- evidence or follow-up pointer.

Disposition states:

```text
captured -> assigned -> in_progress -> accepted
                              |          |
                              |          +-> deferred / rejected / superseded
                              +-> blocked
```

A subagent request is not satisfied when launched. It is satisfied only after
the lane returns, the parent verifies the output, and the action disposition is
recorded.

### Session Requirements Packet

A substantial conversational spec must have a session-derived requirements
packet before `spec-review-swarm` runs.

Every accepted material requirement maps to one of:

- a spec section;
- an explicit non-goal;
- a deferred follow-up with owner and trigger;
- a human-elevation row when the agent cannot decide.

Spec review must ask whether the spec could pass while an accepted session
requirement is still missing.

### Top-Level Requirements Ledger

Before `spec-creation-swarm` dispatches lanes for substantial work, the parent
must create a top-level requirements ledger.

The ledger separates:

- user-stated target requirements;
- accepted prior specs or artifacts;
- corrections and rejected premises;
- current-state observations;
- open questions;
- non-goals;
- source anchors.

Current state is evidence, not automatically target state. A spec may not turn
"the repo currently does X" into "the target system must keep X" without naming
the tradeoff and accepting or opening the decision.

## Review And Loop Ownership

Review normalization belongs inside the owning review skill:

- `spec-review-swarm` owns spec finding normalization;
- `plan-review-swarm` owns plan finding normalization;
- `implementation-review-swarm` owns implementation finding normalization.

Discussion handles human conversation after a reducer identifies a contested
owner-level choice. It does not normalize raw reviewer output.

`orchestrator-goal` owns official loop state:

```text
spec creation/review loop: 2 repeats per loop_key
plan creation/review loop: 2 repeats per loop_key
implementation/review loop: 3 repeats per loop_key
```

The count is per same unresolved root cause, not per phase name. Materially new
evidence, a different owner, or a different route target starts a distinct loop.
At threshold, the orchestrator stops automatic cycling and routes to blocker /
divergence clarification or owner decision only when authority is truly missing.

## Requirements

R1. Discussion surfaces are split by conversation job, not lifecycle phase.

R2. Discussion surfaces stay read-only and do not write specs, plans, code, or
review findings.

R3. Discussion responses use the smallest shape that preserves the model,
evidence, countercase, authority boundary, and route.

R4. The workflow must not require exactly one forcing question when the useful
discussion has multiple axes.

R5. Material interjections during goal, spec, plan, review, or implementation
work must be captured as action or requirement entries.

R6. Substantial conversational specs must provide a session requirements packet
to `spec-review-swarm`.

R7. `spec-creation-swarm` must reflect top-level requirements before dispatching
lanes and must keep current-state evidence distinct from target-state intent.

R8. Review skills must normalize their own findings and route by owner/cause,
not severity alone.

R9. Owner decisions are requested only after the agent verifies it cannot own
the choice.

R10. `orchestrator-goal` is the only owner of official loop counters,
transitions, thresholds, escalation state, and goal closeout.

## Non-Goals

- Do not create one universal bigger discussion skill.
- Do not let discussion skills edit artifacts.
- Do not route ordinary review findings to owner discussion.
- Do not make transcripts durable design docs.
- Do not require full ledger ceremony for tiny one-turn clarifications.

## Proof Expectations

- Pressure test where a multi-axis discussion does not collapse into one
  forced question.
- Pressure test where a mid-goal user correction becomes an action entry and
  blocks phase advancement until resolved.
- Pressure test where spec review catches a missing accepted session
  requirement because it received the session requirements packet.
- Pressure test where current repo shape is not silently promoted into target
  state during spec creation.
- Pressure test where repeated same-root-cause spec review failures stop after
  two repeats and route to blocker or owner-decision discussion.
