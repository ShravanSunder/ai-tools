---
name: orchestrator-design
description: Use when a user asks to run, resume, or finish one bounded Requirements, Specification, Program Design, and independent three-artifact design cycle before planning. Not for a direct design phase, long-horizon delivery, implementation, or PR work.
---

# Design Orchestration

The agent is the actor; this skill is a stateless guarded router among design owners. Durable artifacts and current phase returns prove progress. Optional scratch may accelerate packet reconstruction but never owns authority.

```text
spec-design          Requirements and observable Specification
program-design       structural realization
spec-program-review  one independent design review
discuss-pathfinding  genuinely unwritten owner meaning
```

MUST load `../../shared-references/requirements-specification-program-design.md` and return the separate concept/identity boundaries.

## Artifact Homes

- For newly created file-backed artifacts in this orchestrated cycle, pass `new artifact home: <project-root>/docs/specs/` to `spec-design` and `program-design` and validate their returned distinct paths beneath that home.
- Preserve authoritative pre-existing artifacts elsewhere; do not move, copy, reject, or relabel them merely because of location.
- Optional private packets, working summaries, and agent-transfer material live only beneath `<os-temp>/shravan-dev-workflow/orchestrator-design/` and may disappear at any time.
- Never create project-local `details.md`, `events.jsonl`, counters, handoff identities, stale-review budgets, transition history, terminal replay, or recovery state.

## Route From Current Evidence

1. Open current Requirements, Specification, Program Design, and any inspectable current phase/review return.
2. Fresh full-design request -> `spec-design`.
3. Missing Requirements or Specification -> `spec-design`; missing Program Design -> `program-design`; three current artifacts without a review -> `spec-program-review` in `three-artifact-design` mode.
4. Preserve each producer's returned next owner and exact compact handoff. Validate only that the route is among `discuss-pathfinding | spec-design | program-design | spec-program-review | stop`; do not redo semantic judgment.
5. `specification-gap` -> `spec-design`; owner-controlled structural choice -> `discuss-pathfinding` with return owner `program-design`; How correction -> `program-design`; blocker/decision -> exact stop.
6. If a phase return is unavailable, rerun the smallest authoring phase whose result is unproven. An unavailable consumed review/remediation result is permission-gated rather than automatically rerun.

## One Review, One Remediation

One bounded design run permits:

```text
one independent design review
  ├─ ready ──► design terminal
  ├─ pedantic/non-semantic finding ──► parent rejects with evidence ──► design terminal
  ├─ mental-model break ──► stop with assumption, evidence, consequence, and owner
  └─ accepted bounded findings
       ──► one bounded remediation round follows the exact semantic owner route
            (`spec-design -> program-design` when findings span both; each artifact once)
       ──► parent verifies corrected anchors against original findings
       ──► design terminal or planning handoff
```

The remediation allowance begins only when the one independent review returns accepted bounded findings. It is one correction round, not one owner call: accepted findings spanning Why/What and structural How use the ordered `spec-design -> program-design` route, correct each artifact at most once, and close with one parent verification. Pre-review authoring recovery—including `specification-gap -> spec-design -> program-design`—follows the producer route until three current artifacts exist, then proceeds to the one independent review; it neither consumes remediation nor requires review permission.

Disposition precedes remediation. Do not spend the remediation allowance on prose taste, already-satisfied obligations, or findings without semantic effect. Do not force a mental-model break through correction: stop at `discuss-pathfinding` or the exact owner selected by `spec-program-review`.

Do not dispatch a second design reviewer after remediation. Switching review mode, reviewer lane, target label, caller skill, or resuming after scratch loss does not reset the boundary. Another design review requires explicit user permission given after the first review/remediation result is visible.

Parent verification is not mislabeled independent review. Return the original review identity, accepted findings, correction anchors, verification evidence, unresolved boundary, and `review-permission-required` when another review would be needed.

## Terminal Results

Return exactly one:

```text
ready
needs-revision
decision-needed
deferred
review-permission-required
blocked
stopped
```

`ready` requires distinct current artifacts plus either one ready independent review or one independent review whose accepted findings received the single complete parent-verified remediation. It never claims planning or implementation.

Completion: the route is artifact-driven, new design homes are valid, at most one review and one remediation occurred, no project-local lifecycle state exists, and the exact next skill or stop is explicit.
