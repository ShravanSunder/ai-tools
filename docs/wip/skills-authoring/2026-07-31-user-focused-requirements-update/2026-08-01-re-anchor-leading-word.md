# Re-anchor Checkpoints

Date: 2026-08-01
Status: accepted to implement
Owner plugin: `shravan-dev-workflow`

## Promise and Success

Make `Re-anchor` the leading action word at the few workflow junctions where the confirmed goal is most likely to be displaced by artifact momentum, new machinery, repeated correction, or reviewer advice.

Success means an agent briefly compares the current move with the applicable confirmed goal, governing boundaries, accepted requirements and non-goals, and existing foundation; states `aligned` or names the exact mismatch when authoring, or returns the existing finding disposition when reviewing; and stops the affected work when the comparison exposes a mismatch. The check stays in returned workflow state or chat and never becomes a durable design section, ledger, digest, receipt, or repeated status ritual.

## Problem and Evidence

The scope-inflation incidents show agents continuing to patch artifacts after the same boundary was corrected, introducing governance and persistence before rechecking the existing foundation, and promoting reviewer concerns into product requirements. The requirements-fidelity incident shows a How-only simplification narrowing accepted Why/What while the current files remained mutually consistent. See `sources/2026-07-31-scope-inflation-session-analysis.md` and `sources/2026-07-31-perseus-requirements-fidelity-loss.md`.

The current skills already contain the necessary boundary, accepted-set, foundation, drift-interrupt, deletion, and parent-reduction rules. The missing behavior is a compact leading word that makes the agent actively retrieve those rules at the decision point instead of treating them as background prose.

## Options and Decision

| Option | Gain | Cost | Decision |
| --- | --- | --- | --- |
| Repeat a general “stay on track” reminder | Very small edit | No inspectable comparison; easy to answer with hollow agreement | Reject |
| Add a shared record, ledger, or mandatory checkpoint section | Uniform fields | Recreates the process ceremony and durable metadata leakage this work removes | Reject |
| Use `Re-anchor` as a local leading word with a compact comparison and mismatch stop | Retrieves the right mental model at the exact risk point without a new artifact | Each consuming skill must name its local comparison target | Select |

## Runs and Surface Allocation

Each run is one named `skills-creation` update. The runs may land in one changeset because they are consumers of one approved leading-word decision, but each remains independently reviewable.

### Run A — `discuss-clarify-mental-models`

Authoring basis: user-directed intent supported by the repeated-correction incidents.

- Trigger: add explicit requests to re-anchor or verify whether a shared mental model or in-flight work has drifted from the confirmed goal. Artifact authoring/editing, independent artifact review, and evidence gathering remain with their existing owners even when the prompt uses `re-anchor`, `rails`, or `scope drift`.
- Main path: preserve `Frame the map` as the all-run action. When the user explicitly asks whether the shared model or in-flight work remains on the rails, asks to re-anchor a drifted shared model, or the agent detects artifact-to-goal displacement, lead that framing action with `Re-anchor`; compare the confirmed goal and boundaries with the in-flight work instead of answering “yes, still on track,” then continue the existing provenance, branches, countercase, and rebuilding route. Other term, flow, state, ownership, constraint, or tradeoff repairs keep the existing lens without a goal checkpoint.
- Depth: none.
- Proof: update the existing drift-interrupt pressure scenario; execution remains deferred.

Completion: an explicit “re-anchor the drifted model” or “are we still on the rails?” request interrupts artifact work and returns an evidence-backed alignment or exact mismatch, while same-goal term or ownership drift still receives the full existing reconstruction.

### Run B — `spec-design`

Authoring basis: observed scope expansion and requirements-fidelity loss.

- Trigger: unchanged.
- Main path: after boundary check 1 and accepted-requirements recovery, `Re-anchor` before deriving or revising normative requirements. Compare the proposed meaning with the confirmed goal, accepted requirements/non-goals, and existing foundation.
- Depth: unchanged; reuse the already-loaded authority/problem reference.
- Proof: extend the existing deterministic workflow contract and future pressure scenario; model execution remains deferred.

Completion: an out-of-bound requirement returns the exact mismatch and owner decision instead of entering the specification.

### Run C — `program-design`

Authoring basis: observed governance/platform scope inflation.

- Trigger: unchanged.
- Main path: `Re-anchor` after the current-system model and before selecting target machinery. Compare the proposed mechanism with the confirmed goal, accepted requirements/non-goals, existing foundation, minimal-change path, and complexity budget.
- Depth: unchanged.
- Proof: extend the existing deterministic workflow contract and future pressure scenario; model execution remains deferred.

Completion: material machinery that no confirmed obligation needs is deleted. If pursuing the machinery would widen the confirmed boundary or complexity budget, the agent returns the exact mismatch and owner expansion decision instead of continuing to complete the mechanism.

### Run D — `spec-program-review`

Authoring basis: observed promotion of reviewer concerns into requirements.

- Trigger: unchanged.
- Main path: use `Re-anchor` as the leading word for the existing parent-reduction questions before accepting each finding. Compare the candidate with the confirmed goal, accepted requirement/non-goal, existing foundation, deletion-first result, and smallest in-bound correction; return the existing disposition rather than a second checkpoint status.
- Depth: keep the detailed finding shape in `references/finding-and-reduction-schema.md`; do not create a new reference or field schema.
- Proof: extend the deterministic workflow contract and future scope/call-path pressure scenario; model execution remains deferred.

Completion: each candidate receives the existing `accepted`, `rejected`, `contested`, or `unverified` disposition. An accepted scope-expansion concern records `requires owner expansion decision`, after which the coverage-bound result may be `decision-needed`; reviewer advice never becomes authority through repetition and no separate `aligned | exact mismatch` record is produced.

## Wording Contract

Use `Re-anchor` as the leading word followed by a context-specific action. Do not require one fixed template everywhere. At each applicable authoring or drift consumer the result must still answer:

```text
confirmed goal and governing boundaries, including accepted requirements/non-goals when applicable
existing foundation relevant to this decision when one exists
current proposal, mechanism, work, or finding and why it serves the goal
aligned | exact mismatch
```

Run D uses the same questions but returns its existing candidate disposition instead of `aligned | exact mismatch`. When an authoring result is `exact mismatch`, apply the existing correction: delete an unnecessary mechanism, return an owner decision when pursuing it would expand the confirmed boundary, or use `discuss-clarify-mental-models` when the shared model itself drifted. When aligned, continue without persisting the check as design prose.

## Non-goals

- No new skill, shared reference, schema, ledger, digest, receipt, reviewer lane, or durable artifact section.
- No periodic timer, repeated canned reminder, or requirement to print the checkpoint at every stage.
- No replacement for boundary check 1, boundary check 2, accepted-requirements comparison, current-system research, deletion tests, or parent verification.
- No full model pressure execution in this changeset.

## Coordination

Base branch: `improve-specs`
Base commit: `ed36994`
Pending edits: none at proposal creation
Version and changelog: retain the pending `shravan-dev-workflow` 1.7.5 release and extend its existing 2026-08-01 changelog entry; do not create another release version for this unmerged PR.

## Spec Review Record

Accepted revision: `2026-08-01-r2`
Lanes and receipts: mental-model-fit complete; trigger-routing complete; rule-agreement complete; depth-coverage complete
Verdict: `great`
Semantic coverage: the `Re-anchor` lens, Run A drift-only routing and complete reconstruction, Run B boundary-to-requirements comparison, Run C deletion-first and scope-expansion split, Run D reuse of existing candidate dispositions, local teaching ownership, and the static/deferred-pressure proof boundary
Implementation decision: accepted-to-implement
