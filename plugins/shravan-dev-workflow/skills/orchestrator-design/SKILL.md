---
name: orchestrator-design
description: Use when a user asks to run, resume, or finish one bounded Requirements, Specification, Program Design, and independent three-artifact design cycle before planning. Not for a direct design phase, long-horizon delivery, implementation, or PR work.
---

# Design Orchestration

The coordinator advances the smallest design owner that can resolve the work, verifies its material result against current evidence, and continues until the three artifacts form one coherent reviewed design or an owner decision or blocker stops the run. This skill owns coordination and the final claim. `spec-design`, `program-design`, and `spec-program-review` own their phase judgment and artifacts.

```text
spec-design          Requirements and observable Specification
program-design       structural realization
spec-program-review  independent three-artifact review
discuss-pathfinding  genuinely unwritten owner meaning
```

MUST load `../../shared-references/requirements-specification-program-design.md` and return the separate concept and identity boundaries used to validate every downstream handoff.

MUST invoke `track-show-me-your-work` once at the start and return the shared work reference (or explicitly unshared checkpoint path) plus whether this workflow is responsible for the whole work or contributes to it. Reuse supplied work context for nested work. The tracker owns recording, fallback, and conditional readable views. If tracking cannot initialize, report the gap and continue independent design/review work; tracking availability is not a review-admission prerequisite unless the user explicitly made it one.

Record only consequential design decisions, owner confirmations, accepted or rejected review findings, corrections, results with evidence, and unresolved meaning. A historical event helps orientation but never proves the current artifact or review state. User corrections append a record referencing the earlier record; do not rewrite history.

## Orient And Route

1. Reopen the current user intent, governing sources, Requirements, Specification, Program Design, and any inspectable current phase or review result. Use the trail to find relevant context, then verify load-bearing claims in current sources.
2. IF assigning research or another phase owner, load `manage-agents` and return the selected responsibility, continuity, and assignment boundary. The coordinator retains material design work with the user. A bounded research question goes to a Worker; related research with follow-up questions may use a research Sidekick.
3. Invoke the smallest owner that can advance the current evidence:
   - fresh full-design request, or missing Requirements or Specification -> `spec-design`;
   - current Requirements and Specification but missing Program Design -> `program-design`;
   - three current artifacts without completed review coverage -> assign or resume the persistent independent design-review Sidekick through `spec-program-review` in `three-artifact-design` mode;
   - genuinely unmade owner meaning -> `discuss-pathfinding`, returning to the phase that owns it.
4. Preserve each producer's current route and compact handoff. Accept only `discuss-pathfinding | spec-design | program-design | spec-program-review | stop`; a contradictory destination blocks without the coordinator inventing a route.
5. Verify what materially changed before continuing. Check artifact identity and resolution, returned owner, current evidence, and the finding or decision that justifies the next route. Require exact source identity where correctness depends on it, such as a reviewed commit or PR head; ordinary decisions need no opaque identity.
6. Route a `specification-gap` to `spec-design`, an owner-controlled structural choice through `discuss-pathfinding` back to `program-design`, a bounded How correction to `program-design`, and a blocker or owner decision to the exact stop. Continue across phase boundaries instead of returning a progress checkpoint as completion.

For newly created file-backed artifacts, pass `new artifact home: <project-root>/docs/specs/` to `spec-design` and `program-design` and validate their distinct returned paths beneath that home. Preserve authoritative pre-existing artifacts wherever they already live. Decision records and linked detail may live in the central trail; do not create a second lifecycle ledger, replay store, digest, generic approval record, or per-turn report in the project.

## Review And Correction Rounds

Prefer one review-and-correction round. Allow a second only for a concrete, substantive issue that remains or was introduced by the correction, within the agreed design. Pedantic, stylistic, or already-satisfied findings do not justify another round. Ask before a third.

Reduce findings against the sources:

- `ready` -> design terminal;
- non-semantic or unsupported finding -> reject with evidence;
- mental-model break or unmade owner meaning -> stop with assumption, evidence, consequence, and owner;
- accepted bounded findings -> correct through the semantic owners; the retained independent design-review Sidekick checks corrected anchors and current affected evidence, then the coordinator accepts the result.

Each round may call `spec-design` then `program-design`, correcting each affected artifact once. The retained design-review Sidekick verifies those corrections within the same review relationship; this verification does not start another full review or expand the round allowance. Pre-review authoring does not consume a review round. `spec-program-review` owns review admission and coverage.

## Missing Review Evidence

Pass `spec-program-review` one explicit coordinator-authorized recovery request for unavailable prior results, using verified current artifacts and governing sources and a recorded reason. Preserve existing limits and unknown history; recovery grants no extra correction rounds. Reject repeated recovery or unverified inputs. Ask before corrections if the remaining allowance is exhausted or unknown. Route design breaks to their owner.

## Trail And Completion

At each owner return, record a meaningful checkpoint with decision, reason, evidence, and result through the tracker. At every terminal response, leave the actual design outcome and continuation context, including blocked, deferred, or stopped work. Nested work contributes without resolving the outer thread; the responsible whole-work agent follows the tracker's current-history and completion checks before resolution. Produce a readable view when requested or substantial synthesis is needed. Report unshared fallback or view gaps honestly; preserve the real design result and continue independent work unless shared recording was made a delivery gate.

Return one status and the next skill or stop. `ready` requires distinct, current Requirements, Specification, and Program Design artifacts, independent review, retained design-review-Sidekick verification of corrected anchors and current affected evidence, and coordinator acceptance within the allowed rounds. It means design-ready, not implemented.

## Design-Ready Continuation

When the caller or user has requested continued delivery, preserve this design terminal and the next phase's existing input/result contract for the delivery loop; the coordinator does not implement or claim delivery complete. The reviewed artifacts, task boundary, completion or escalation, and design proof/results remain authoritative. Use `plan-handoff` only when a current implementation plan needs portability, or `spec-handoff` only when reviewed design context needs portability before a plan exists. Do not require either handoff merely because the executor uses a separate session, and do not create a management packet schema, route, or work trail.

For a substantive design loop that uses agent help, the coordinator may be Frontier or Balanced. It works with the user on material design meaning through this workflow. Workers can gather bounded evidence or draft already-settled artifacts, retaining their assignment through corrections. A research Sidekick is useful when related assignments need continuing context. Only an explicitly requested Advisor assists the coordinator with design choices.

If continued delivery is requested, after `ready` MUST load `manage-agents` to assign or resume one persistent implementation Sidekick. The coordinator keeps the existing work-root as `orchestrator`; the implementer joins that thread and owns development, proof, bounded native Workers, and standalone native Operators. Design gaps return to the coordinator and user. `plan-implementation` remains required when no ready plan exists, preserving its admission requirements.
