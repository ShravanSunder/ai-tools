---
name: orchestrator-design
description: Use when a user asks to run, resume, or finish one bounded Requirements, Specification, Program Design, and independent three-artifact design cycle before planning. Not for a direct design phase, long-horizon delivery, implementation, or PR work.
---

# Design Orchestration

Coordinate the smallest design owner that can advance the work, verify its material result against current evidence, and keep going until the three artifacts form one coherent reviewed design or a real owner decision or blocker stops the run. This skill owns coordination and the final claim. `spec-design`, `program-design`, and `spec-program-review` own their phase judgment and artifacts.

```text
spec-design          Requirements and observable Specification
program-design       structural realization
spec-program-review  independent three-artifact review
discuss-pathfinding  genuinely unwritten owner meaning
```

MUST load `../../shared-references/requirements-specification-program-design.md` and return the separate concept and identity boundaries used to validate every downstream handoff.

MUST invoke `track-show-me-your-work` once at the start and return the selected trail path plus whether this workflow owns its finalization. Reuse a supplied caller trail as borrowed. Otherwise select or create the session trail as that skill directs. That skill owns recording and the operator-produced readable view. If tracking cannot initialize, record the gap in the response and continue permitted design/review work; tracking availability is not a review-admission prerequisite unless the user explicitly made it one.

Record only consequential design decisions, owner confirmations, accepted or rejected review findings, corrections, results with evidence, and unresolved meaning. A historical event helps orientation but never proves the current artifact or review state. User corrections append a record referencing the earlier line; do not rewrite history.

## Orient And Route

1. Reopen the current user intent, governing sources, Requirements, Specification, Program Design, and any inspectable current phase or review result. Use the trail to find relevant context, then verify load-bearing claims in current sources.
2. Invoke the smallest owner that can advance the current evidence:
   - fresh full-design request, or missing Requirements or Specification -> `spec-design`;
   - current Requirements and Specification but missing Program Design -> `program-design`;
   - three current artifacts without completed review coverage -> `spec-program-review` in `three-artifact-design` mode;
   - genuinely unmade owner meaning -> `discuss-pathfinding`, returning to the phase that owns it.
3. Preserve each producer's current route and compact handoff. Accept only `discuss-pathfinding | spec-design | program-design | spec-program-review | stop`; a contradictory destination blocks without the coordinator inventing a plausible route.
4. Verify what materially changed before continuing. Check artifact identity and resolution, returned owner, current evidence, and the finding or decision that justifies the next route. Require exact source identity where correctness depends on it, such as a reviewed commit or PR head; ordinary decisions need no opaque identity.
5. Route a `specification-gap` to `spec-design`, an owner-controlled structural choice through `discuss-pathfinding` back to `program-design`, a bounded How correction to `program-design`, and a blocker or owner decision to the exact stop. Continue across phase boundaries instead of returning a progress checkpoint as completion.

For newly created file-backed artifacts, pass `new artifact home: <project-root>/docs/specs/` to `spec-design` and `program-design` and validate their distinct returned paths beneath that home. Preserve authoritative pre-existing artifacts wherever they already live. Decision records and linked detail may live in the central trail; do not create a second lifecycle ledger, replay store, digest, generic approval record, or per-turn report in the project.

## Review And Correction Rounds

Prefer one review-and-correction round. Allow a second only for a concrete, substantive issue that remains or was introduced by the correction, within the agreed design. Pedantic, stylistic, or already-satisfied findings do not justify another round. Ask before a third.

Reduce findings against the sources:

- `ready` -> design terminal;
- non-semantic or unsupported finding -> reject with evidence;
- mental-model break or unmade owner meaning -> stop with assumption, evidence, consequence, and owner;
- accepted bounded findings -> correct through the semantic owners, then parent-verify the findings.

Each round may call `spec-design` then `program-design`, correcting each affected artifact once. Close when verification resolves the findings; another review is not automatic. Pre-review authoring does not consume a review round. `spec-program-review` owns review admission and coverage.

## Missing Review Evidence

Pass `spec-program-review` one explicit orchestrator-authorized recovery request for unavailable prior results, using verified current artifacts and governing sources and a recorded reason. Preserve existing limits and unknown history; recovery grants no extra correction rounds. Reject repeated recovery or unverified inputs. Ask before corrections if the remaining allowance is exhausted or unknown. Route design breaks to their owner.

## Trail And Completion

At each owner return, append a checkpoint with the decision, reason, evidence, and result. Render through the tracker whenever requested. A nested orchestrator using a borrowed trail appends checkpoints but never finalizes the outer workflow. The outermost owner of this design trail MUST finish and render it before every terminal response, including `ready`, `needs-revision`, `decision-needed`, `review-permission-required`, `blocked`, `deferred`, or `stopped`. If trail writing fails, report the incomplete trail and preserve the real design result. Continue independent design work unless the user made the trail a delivery gate; then the incomplete trail blocks completion.

Return one status and the next skill or stop. `ready` requires distinct, current Requirements, Specification, and Program Design artifacts, independent review, and parent-verified resolution of findings within the allowed rounds. It means design-ready, not implemented.
